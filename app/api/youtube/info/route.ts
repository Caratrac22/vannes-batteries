import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("id");
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
  }

  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

  const res = await fetch(oembedUrl, {
    next: { revalidate: 86400 },
    headers: { "User-Agent": "VannesBatteries/1.0" },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch video info" }, { status: 502 });
  }

  const data = await res.json();

  return NextResponse.json({
    title: data.title,
    authorName: data.author_name,
    authorUrl: data.author_url,
    thumbnailUrl: data.thumbnail_url,
    thumbnailWidth: data.thumbnail_width,
    thumbnailHeight: data.thumbnail_height,
  });
}
