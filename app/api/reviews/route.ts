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
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=rating,user_ratings_total,reviews&key=${API_KEY}&reviews_sort=most_relevant`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    const json = await res.json();

    if (json.status !== "OK") {
      throw new Error(`Google API error: ${json.status}`);
    }

    const result = {
      rating: json.result.rating ?? 0,
      totalReviews: json.result.user_ratings_total ?? 0,
      reviews: (json.result.reviews ?? []).slice(0, 5).map((r: any) => ({
        name: r.author_name ?? "Anonyme",
        text: r.text ?? "",
        rating: r.rating ?? 5,
        time: r.relative_time_description ?? "",
        profilePhoto: r.profile_photo_url ?? "",
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
