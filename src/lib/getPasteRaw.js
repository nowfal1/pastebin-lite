export const runtime = "nodejs";
import redis from "@/lib/redis";

export async function getPasteRaw(id) {
  const raw = await redis.get(`paste:${id}`);
  if (!raw) return null;
  return JSON.parse(raw);
}
