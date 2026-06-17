import { NextResponse } from "next/server";
import { redisGet, redisSet } from "@/lib/redis";
import { rateLimit } from "@/lib/rateLimit";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

const CACHE_KEY = "vb:reviews";
const CACHE_TTL = 60 * 60;

export async function GET() {
  const rl = await rateLimit("reviews", 30, 60);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  if (!API_KEY || !PLACE_ID) {
    return NextResponse.json(
      { error: "Google Places API not configured" },
      { status: 503 }
    );
  }

  const cached = await redisGet(CACHE_KEY);
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
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

    await redisSet(CACHE_KEY, JSON.stringify(result), "EX", CACHE_TTL);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Google Places API error:", error);

    const stale = await redisGet(CACHE_KEY);
    if (stale) return NextResponse.json(JSON.parse(stale));

    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
