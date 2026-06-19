import { Router } from 'express';
import { cached } from '../../lib/cache.js';
import { fetchJSON } from '../../lib/nasaClient.js';

const router = Router();

const VALID_PLANETS = new Set([
  'mercure', 'venus', 'terre', 'mars',
  'jupiter', 'saturne', 'uranus', 'neptune',
  'lune', 'soleil',
]);

/**
 * GET /api/planets/:id
 * Fetches a single body's data from Solar System OpenData.
 * Cached for 24 hours (this data is essentially static).
 */
router.get('/:id', async (req, res) => {
  const id = req.params.id.toLowerCase();
  if (!VALID_PLANETS.has(id)) {
    return res.status(400).json({ error: 'Unknown body', valid: [...VALID_PLANETS] });
  }
  try {
    const data = await cached(`planet:${id}`, 86400, () =>
      fetchJSON(`https://api.le-systeme-solaire.net/rest/bodies/${id}`)
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: 'Planet data unavailable', detail: err.message });
  }
});

export default router;
