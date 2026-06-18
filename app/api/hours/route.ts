import { NextResponse } from "next/server";
import { redisGet, redisSet } from "@/lib/redis";
import { rateLimit } from "@/lib/rateLimit";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

const CACHE_KEY = "vb:hours";
const CACHE_TTL = 30 * 60;

const DAY_NAMES = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

const FALLBACK_HOURS = [
  "dimanche: Fermé",
  "lundi: 08:30 – 12:00, 14:00 – 18:30",
  "mardi: 08:30 – 12:00, 14:00 – 18:30",
  "mercredi: 08:30 – 12:00, 14:00 – 18:30",
  "jeudi: 08:30 – 12:00, 14:00 – 18:30",
  "vendredi: 08:30 – 12:00, 14:00 – 18:30",
  "samedi: 09:00 – 12:00",
];

function getFranceNow(): Date {
  const now = new Date();
  const fr = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parseInt(fr.find((p) => p.type === t)?.value ?? "0", 10);
  return new Date(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
}

function computeIsOpen(descriptions: string[]): { isOpen: boolean; closingMinutes: number | null } {
  const now = getFranceNow();
  const day = now.getDay();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const dayLabel = DAY_NAMES[day];

  const desc = descriptions.find((d) => d.toLowerCase().startsWith(dayLabel));
  if (!desc || desc.toLowerCase().includes("fermé")) return { isOpen: false, closingMinutes: null };

  const hours = desc.replace(/^[^:]+:\s*/, "").trim();
  const periods = hours.split(/,\s*/);

  for (const period of periods) {
    const match = period.match(/(\d{1,2}:\d{2})\s*[\u2013\u2014\-–]\s*(\d{1,2}:\d{2})/);
    if (!match) continue;
    const [sh, sm] = match[1].split(":").map(Number);
    const [eh, em] = match[2].split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    if (currentMin >= start && currentMin < end) {
      return { isOpen: true, closingMinutes: end - currentMin };
    }
  }
  return { isOpen: false, closingMinutes: null };
}

export async function GET() {
  const rl = await rateLimit("hours", 60, 60);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const cached = await redisGet(CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached);
    parsed.isOpenNow = computeIsOpen(parsed.regularHours).isOpen;
    return NextResponse.json(parsed);
  }

  if (API_KEY && PLACE_ID) {
    try {
      const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=fr&fields=regularOpeningHours,businessStatus`;
      const res = await fetch(url, {
        headers: { "X-Goog-Api-Key": API_KEY },
        next: { revalidate: 1800 },
      });
      const data = await res.json();

      if (res.ok && data.regularOpeningHours) {
        const oh = data.regularOpeningHours;
        const rawDescriptions: string[] = oh.weekdayDescriptions ?? [];
        const { isOpen, closingMinutes } = computeIsOpen(rawDescriptions);

        const result = {
          isOpenNow: isOpen,
          closingMinutes,
          currentDay: rawDescriptions,
          regularHours: rawDescriptions,
          businessStatus: data.businessStatus ?? "OPERATIONAL",
        };

        await redisSet(CACHE_KEY, JSON.stringify(result), "EX", CACHE_TTL);
        return NextResponse.json(result);
      }
      console.warn("Google Places v2 response:", JSON.stringify(data).slice(0, 300));
    } catch (error) {
      console.error("Google Hours API error:", error);
    }
  }

  const { isOpen, closingMinutes } = computeIsOpen(FALLBACK_HOURS);
  const fallbackResult = {
    isOpenNow: isOpen,
    closingMinutes,
    currentDay: FALLBACK_HOURS,
    regularHours: FALLBACK_HOURS,
    businessStatus: "OPERATIONAL",
    source: "fallback",
  };

  await redisSet(CACHE_KEY, JSON.stringify(fallbackResult), "EX", 300);
  return NextResponse.json(fallbackResult);
}
