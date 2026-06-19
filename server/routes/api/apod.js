import { Router } from 'express';
import { cached } from '../../lib/cache.js';
import { fetchJSON, withKey } from '../../lib/nasaClient.js';

const router = Router();

/**
 * GET /api/apod
 * NASA Astronomy Picture of the Day.
 * Cached for 1 hour (image changes once per day).
 */
router.get('/', async (req, res) => {
  try {
    const data = await cached('apod:today', 3600, () =>
      fetchJSON(withKey('https://api.nasa.gov/planetary/apod'))
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: 'APOD unavailable', detail: err.message });
  }
});

export default router;
