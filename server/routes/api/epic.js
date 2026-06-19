import { Router } from 'express';
import { cached } from '../../lib/cache.js';
import { fetchJSON, withKey } from '../../lib/nasaClient.js';

const router = Router();

/**
 * GET /api/epic
 * NASA EPIC — full-disk Earth photos from DSCOVR satellite at the
 * Earth-Sun L1 Lagrange point, 1.5 million km from Earth.
 * Returns the most recent set with formatted image URLs.
 * Cached for 2 hours.
 */
router.get('/', async (req, res) => {
  try {
    const data = await cached('epic:latest', 7200, async () => {
      const list = await fetchJSON(withKey('https://api.nasa.gov/EPIC/api/natural'));
      return (list || []).slice(0, 20).map(img => {
        const d = img.date.slice(0, 10).replace(/-/g, '/');
        const base = `https://epic.gsfc.nasa.gov/archive/natural/${d}/png/${img.image}.png`;
        return {
          identifier: img.identifier,
          caption: img.caption,
          date: img.date,
          image: base,
          thumb: base.replace('/png/', '/thumbs/').replace('.png', '.jpg'),
          centroid: img.centroid_coordinates,
        };
      });
    });
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: 'EPIC unavailable', detail: err.message });
  }
});

export default router;
