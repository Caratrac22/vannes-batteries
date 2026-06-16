import { NextResponse } from "next/server";
import { redisGet, redisSet } from "@/lib/redis";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

const CACHE_KEY = "vb:hours";
const CACHE_TTL = 30 * 60; // 30 min in seconds

export async function GET() {
  if (!API_KEY || !PLACE_ID) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const cached = await redisGet(CACHE_KEY);
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?key=${API_KEY}&languageCode=fr`;
    const res = await fetch(url, {
      headers: {
        "X-Goog-FieldMask": "currentOpeningHours,regularOpeningHours,businessStatus",
      },
      next: { revalidate: 1800 },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Google API error: ${data.error?.status ?? res.status}`);
    }

    const result = {
      isOpenNow: data.currentOpeningHours?.openNow ?? null,
      currentDay: data.currentOpeningHours?.weekdayDescriptions ?? [],
      regularHours: data.regularOpeningHours?.weekdayDescriptions ?? [],
      businessStatus: data.businessStatus ?? "OPERATIONAL",
    };

    await redisSet(CACHE_KEY, JSON.stringify(result), "EX", CACHE_TTL);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Google Hours API error:", error);

    const stale = await redisGet(CACHE_KEY);
    if (stale) return NextResponse.json(JSON.parse(stale));

    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
