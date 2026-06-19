import { Router } from 'express';
import { cached } from '../../lib/cache.js';
import { fetchJSON } from '../../lib/nasaClient.js';

const router = Router();

/**
 * GET /api/missions/past?limit=...
 * Most recent past SpaceX launches.
 * Cached for 30 minutes.
 */
router.get('/past', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 12, 30);
  try {
    const data = await cached(`missions:past:${limit}`, 1800, async () => {
      const arr = await fetchJSON('https://api.spacexdata.com/v5/launches/past');
      const recent = arr.slice(-limit).reverse();
      return recent.map(normalise);
    });
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: 'SpaceX feed unavailable', detail: err.message });
  }
});

/**
 * GET /api/missions/upcoming?limit=...
 * Upcoming SpaceX launches.
 * Cached for 30 minutes.
 */
router.get('/upcoming', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 6, 20);
  try {
    const data = await cached(`missions:upcoming:${limit}`, 1800, async () => {
      const arr = await fetchJSON('https://api.spacexdata.com/v5/launches/upcoming');
      const sorted = arr
        .sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc))
        .slice(0, limit);
      return sorted.map(normalise);
    });
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: 'SpaceX feed unavailable', detail: err.message });
  }
});

function normalise(m) {
  return {
    id: m.id,
    name: m.name,
    flightNumber: m.flight_number,
    dateUTC: m.date_utc,
    success: m.success,
    details: m.details,
    patch: m.links?.patch?.small || null,
    webcast: m.links?.webcast || null,
    article: m.links?.article || null,
    wikipedia: m.links?.wikipedia || null,
  };
}

export default router;
