import redis from "./redis";

export async function getPasteRaw(id) {
  const key = `paste:${id}`;
  const raw = await redis.get(key);

  if (!raw) return null;

  const paste = JSON.parse(raw);
  const now = Date.now();

  // Check TTL expiry
  if (paste.expires_at && now > paste.expires_at) {
    await redis.del(key);
    return null;
  }

  // 🔑 View limit logic (FIXED)
  if (paste.remaining_views !== null) {
    // Block only if views already exhausted
    if (paste.remaining_views < 1) {
      await redis.del(key);
      return null;
    }

    // Allow this view, then decrement
    paste.remaining_views -= 1;
    await redis.set(key, JSON.stringify(paste));
  }

  return paste;
}
