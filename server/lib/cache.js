/**
 * Simple in-memory cache with TTL.
 * Reduces upstream API calls and protects against rate-limiting on the NASA key.
 */
const store = new Map();

export function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function set(key, value, ttlSeconds) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Wrap an async producer with caching.
 * If a value for `key` exists and is fresh, return it.
 * Otherwise call the producer, cache its result, return it.
 */
export async function cached(key, ttlSeconds, producer) {
  const hit = get(key);
  if (hit !== null) return hit;
  const value = await producer();
  set(key, value, ttlSeconds);
  return value;
}

/** Stats for /api/health */
export function stats() {
  return { size: store.size, keys: [...store.keys()] };
}
