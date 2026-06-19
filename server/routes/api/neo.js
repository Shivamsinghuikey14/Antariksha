import { Router } from 'express';
import { cached } from '../../lib/cache.js';
import { fetchJSON, withKey } from '../../lib/nasaClient.js';

const router = Router();

/**
 * GET /api/neo
 * Today's near-earth object close approaches.
 * Returns a normalised summary + list.
 * Cached for 1 hour.
 */
router.get('/', async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = await cached(`neo:${today}`, 3600, async () => {
      const upstream = await fetchJSON(withKey(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}`));
      const list = upstream.near_earth_objects?.[today] || [];
      const items = list.map(n => {
        const a = n.close_approach_data?.[0] || {};
        const dia = n.estimated_diameter?.meters || {};
        return {
          id: n.id,
          name: n.name?.replace(/[()]/g, '') || '',
          diameterMin: Math.round(dia.estimated_diameter_min || 0),
          diameterMax: Math.round(dia.estimated_diameter_max || 0),
          velocityKmh: Math.round(parseFloat(a.relative_velocity?.kilometers_per_hour) || 0),
          missDistanceKm: Math.round(parseFloat(a.miss_distance?.kilometers) || 0),
          hazardous: !!n.is_potentially_hazardous_asteroid,
          approachTime: a.close_approach_date_full || '',
        };
      });
      const hazardous = items.filter(i => i.hazardous).length;
      const closest = items.reduce((min, i) => i.missDistanceKm < min ? i.missDistanceKm : min, Infinity);
      return {
        date: today,
        total: items.length,
        hazardous,
        closestKm: closest === Infinity ? null : closest,
        items: items.sort((a, b) => a.missDistanceKm - b.missDistanceKm),
      };
    });
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: 'NEO feed unavailable', detail: err.message });
  }
});

export default router;
