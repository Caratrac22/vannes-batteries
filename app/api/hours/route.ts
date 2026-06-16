import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 min

export async function GET() {
  if (!API_KEY || !PLACE_ID) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?key=${API_KEY}`;
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

    cache = { data: result, timestamp: Date.now() };
    return NextResponse.json(result);
  } catch (error) {
    console.error("Google Hours API error:", error);
    if (cache) return NextResponse.json(cache.data);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
