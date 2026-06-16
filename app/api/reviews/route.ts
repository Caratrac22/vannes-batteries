import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000;

export async function GET() {
  if (!API_KEY || !PLACE_ID) {
    return NextResponse.json(
      { error: "Google Places API not configured" },
      { status: 503 }
    );
  }

  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?key=${API_KEY}`;
    const res = await fetch(url, {
      headers: {
        "X-Goog-FieldMask": "rating,userRatingCount,reviews",
      },
      next: { revalidate: 3600 },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Google API error: ${data.error?.status ?? res.status}`);
    }

    const result = {
      rating: data.rating ?? 0,
      totalReviews: data.userRatingCount ?? 0,
      reviews: (data.reviews ?? []).slice(0, 5).map((r: any) => ({
        name: r.authorAttribution?.displayName ?? "Anonyme",
        text: r.text?.text ?? "",
        rating: r.rating ?? 5,
        time: r.relativePublishTimeDescription ?? "",
        profilePhoto: r.authorAttribution?.photoUri ?? "",
      })),
    };

    cache = { data: result, timestamp: Date.now() };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Google Places API error:", error);

    if (cache) {
      return NextResponse.json(cache.data);
    }

    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
