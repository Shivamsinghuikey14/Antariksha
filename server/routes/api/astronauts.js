/**
 * /api/astronauts
 *
 * Proxies http://api.open-notify.org/astros.json — a free, no-key API that
 * returns the names of every human currently in space, plus the craft they
 * are aboard. Updated as crews launch and return.
 *
 * Caches for 5 minutes server-side.
 */

import express from 'express';
const router = express.Router();

let cache = null;
const TTL = 5 * 60 * 1000;

router.get('/', async (_req, res) => {
  if (cache && Date.now() - cache.t < TTL) return res.json(cache.data);
  try {
    const r = await fetch('http://api.open-notify.org/astros.json');
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    const d = await r.json();
    cache = { data: d, t: Date.now() };
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json(d);
  } catch (err) {
    console.error('[astronauts]', err.message);
    res.status(502).json({ error: 'upstream unavailable', message: err.message });
  }
});

export default router;
