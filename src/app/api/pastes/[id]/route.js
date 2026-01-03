import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function GET(req, { params }) {
  const { id } = await params;

  const raw = await redis.get(`paste:${id}`);
  const paste = raw ? JSON.parse(raw) : null;

  if (!paste) {
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const now =
    process.env.TEST_MODE === "1"
      ? Number(req.headers.get("x-test-now-ms")) || Date.now()
      : Date.now();

  if (paste.expires_at && now > paste.expires_at) {
    return new Response(
      JSON.stringify({ error: "Expired" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      return new Response(
        JSON.stringify({ error: "No views left" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    paste.remaining_views -= 1;
    await redis.set(`paste:${id}`, JSON.stringify(paste));
  }

  return new Response(
    JSON.stringify({
      content: paste.content,
      remaining_views: paste.remaining_views,
      expires_at: paste.expires_at
        ? new Date(paste.expires_at).toISOString()
        : null,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
