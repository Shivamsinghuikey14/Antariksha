/**
 * Thin wrapper around fetch() for NASA endpoints that need the API key.
 * Centralises key injection and error handling.
 */
const NASA_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

export async function fetchJSON(url, { timeoutMs = 10000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const err = new Error(`Upstream ${res.status}: ${text.slice(0, 200)}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Append the NASA key to a URL */
export function withKey(url) {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}api_key=${NASA_KEY}`;
}

export const usingDemoKey = NASA_KEY === 'DEMO_KEY';
