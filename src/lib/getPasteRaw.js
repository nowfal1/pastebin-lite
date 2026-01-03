import redis from "./redis";

export async function getPasteRaw(id) {
  const key = `paste:${id}`;
  const raw = await redis.get(key);

  if (!raw) return null;

  const paste = JSON.parse(raw);
  const now = Date.now();

  // Check expiry
  if (paste.expires_at && now > paste.expires_at) {
    await redis.del(key);
    return null;
  }

  // Check views
  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await redis.del(key);
      return null;
    }

    // 🔽 DECREMENT VIEW COUNT
    paste.remaining_views -= 1;

    await redis.set(key, JSON.stringify(paste));
  }

  return paste;
}
