import { Router } from 'express';
import { cached } from '../../lib/cache.js';
import { fetchJSON, withKey } from '../../lib/nasaClient.js';

const router = Router();

const VALID_ROVERS = new Set(['curiosity', 'perseverance', 'opportunity', 'spirit']);

/**
 * GET /api/mars/:rover
 * Latest photographs from a Mars rover.
 * Cached for 1 hour.
 */
router.get('/:rover', async (req, res) => {
  const rover = req.params.rover.toLowerCase();
  if (!VALID_ROVERS.has(rover)) {
    return res.status(400).json({ error: 'Unknown rover', valid: [...VALID_ROVERS] });
  }
  try {
    const data = await cached(`mars:${rover}:latest`, 3600, () =>
      fetchJSON(withKey(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos`))
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: 'Mars photos unavailable', detail: err.message });
  }
});

export default router;
