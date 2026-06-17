import { NextResponse } from "next/server";
import { redisGet, redisSet } from "@/lib/redis";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

const CACHE_KEY = "vb:hours";
const CACHE_TTL = 30 * 60;

const DAY_NAMES = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

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
  if (!API_KEY || !PLACE_ID) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const cached = await redisGet(CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached);
    parsed.isOpenNow = computeIsOpen(parsed.regularHours).isOpen;
    return NextResponse.json(parsed);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&key=${API_KEY}&language=fr&fields=opening_hours,business_status`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    const data = await res.json();

    if (!res.ok || data.status !== "OK") {
      throw new Error(data.error_message ?? `Google API error: ${data.status}`);
    }

    const oh = data.result?.opening_hours ?? {};
    const rawDescriptions = oh.weekday_text ?? [];
    const { isOpen, closingMinutes } = computeIsOpen(rawDescriptions);

    const result = {
      isOpenNow: isOpen,
      closingMinutes,
      currentDay: rawDescriptions,
      regularHours: rawDescriptions,
      businessStatus: data.result?.business_status ?? "OPERATIONAL",
    };

    await redisSet(CACHE_KEY, JSON.stringify(result), "EX", CACHE_TTL);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Google Hours API error:", error);

    const stale = await redisGet(CACHE_KEY);
    if (stale) {
      const parsed = JSON.parse(stale);
      parsed.isOpenNow = computeIsOpen(parsed.regularHours).isOpen;
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
