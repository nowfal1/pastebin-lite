import { NextResponse } from "next/server";
import redis from "@/lib/redis";



export async function POST(req) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  // Validation
  if (!content || typeof content !== "string") {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  if (ttl_seconds && ttl_seconds < 1) {
    return NextResponse.json(
      { error: "ttl_seconds must be >= 1" },
      { status: 400 }
    );
  }

  if (max_views && max_views < 1) {
    return NextResponse.json(
      { error: "max_views must be >= 1" },
      { status: 400 }
    );
  }

  const id = Math.random().toString(36).substring(2, 10);

  const now = Date.now();
  const expires_at = ttl_seconds ? now + ttl_seconds * 1000 : null;

  await redis.set(
  `paste:${id}`,
  JSON.stringify({
    content,
    expires_at,
    remaining_views: max_views ?? null,
  })
);


  return NextResponse.json({
    id,
    url: `${process.env.VERCEL_URL || "http://localhost:3000"}/p/${id}`,
  });
}
