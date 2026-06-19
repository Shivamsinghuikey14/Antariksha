/**
 * /api/sunrise?lat=X&lon=Y[&date=YYYY-MM-DD]
 *
 * Proxies https://api.sunrise-sunset.org/json — free, no key required.
 * Returns sunrise / sunset / civil twilight / nautical twilight / astronomical
 * twilight / solar noon / day length for any coordinate.
 *
 * Cached per (lat,lon,date) for 1 h.
 */

import express from 'express';
const router = express.Router();

const CACHE = new Map();
const TTL = 60 * 60 * 1000;

router.get('/', async (req, res) => {
  const lat  = req.query.lat;
  const lon  = req.query.lon;
  const date = req.query.date || 'today';
  if (!lat || !lon) return res.status(400).json({ error: 'lat & lon required' });

  const key = `${lat},${lon},${date}`;
  const cached = CACHE.get(key);
  if (cached && Date.now() - cached.t < TTL) return res.json(cached.data);

  try {
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${date}&formatted=0`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    const d = await r.json();
    if (d.status !== 'OK') throw new Error(d.status || 'unknown');
    CACHE.set(key, { data: d.results, t: Date.now() });
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(d.results);
  } catch (err) {
    console.error('[sunrise]', err.message);
    res.status(502).json({ error: 'upstream unavailable', message: err.message });
  }
});

export default router;
