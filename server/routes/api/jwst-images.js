/**
 * /api/jwst-images
 *
 * Returns the latest James Webb Space Telescope imagery from the NASA Image
 * and Video Library, sorted newest-first. No API key required.
 *
 * Cached 6 hours.
 */

import express from 'express';
const router = express.Router();

let cache = null;
const TTL = 6 * 60 * 60 * 1000;

router.get('/', async (_req, res) => {
  if (cache && Date.now() - cache.t < TTL) return res.json(cache.data);
  try {
    const r = await fetch('https://images-api.nasa.gov/search?q=james+webb&media_type=image&year_start=2022');
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    const d = await r.json();
    const items = (d.collection?.items || [])
      .map(it => ({
        title:    it.data?.[0]?.title || '',
        date:     it.data?.[0]?.date_created || '',
        desc:     (it.data?.[0]?.description || '').slice(0, 600),
        src:      it.links?.[0]?.href,
        nasa_id:  it.data?.[0]?.nasa_id,
      }))
      .filter(it => it.src && it.title)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 40);
    const out = { items, fetched: new Date().toISOString() };
    cache = { data: out, t: Date.now() };
    res.setHeader('Cache-Control', 'public, max-age=21600');
    res.json(out);
  } catch (err) {
    console.error('[jwst-images]', err.message);
    res.status(502).json({ error: 'upstream unavailable', message: err.message });
  }
});

export default router;
