import { Router } from 'express';
import { cached } from '../../lib/cache.js';
import { fetchJSON } from '../../lib/nasaClient.js';

const router = Router();

/**
 * GET /api/library?q=...&limit=...
 * Search NASA's open image archive (no key required upstream).
 * Cached per-query for 10 minutes.
 */
router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim().slice(0, 80);
  const limit = Math.min(parseInt(req.query.limit) || 16, 40);
  if (!q) return res.status(400).json({ error: 'Query parameter q is required' });
  try {
    const data = await cached(`lib:${q}:${limit}`, 600, async () => {
      const upstream = await fetchJSON(`https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image`);
      const items = (upstream.collection?.items || [])
        .filter(i => i.links?.[0]?.href)
        .slice(0, limit)
        .map(i => ({
          src: i.links[0].href,
          title: i.data?.[0]?.title || '',
          description: i.data?.[0]?.description || '',
          date: i.data?.[0]?.date_created || '',
          center: i.data?.[0]?.center || '',
          keywords: i.data?.[0]?.keywords || [],
        }));
      return { query: q, count: items.length, items };
    });
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: 'Image archive unavailable', detail: err.message });
  }
});

export default router;
