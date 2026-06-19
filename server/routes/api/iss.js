import { Router } from 'express';
import { fetchJSON } from '../../lib/nasaClient.js';

const router = Router();

/**
 * GET /api/iss
 * Live position of the International Space Station.
 * NOT cached — this changes every second.
 */
router.get('/', async (req, res) => {
  try {
    const data = await fetchJSON('https://api.wheretheiss.at/v1/satellites/25544');
    res.set('Cache-Control', 'no-store');
    res.json({
      latitude: data.latitude,
      longitude: data.longitude,
      altitudeKm: data.altitude,
      velocityKmh: data.velocity,
      visibility: data.visibility,
      timestamp: data.timestamp,
      region: guessRegion(data.latitude, data.longitude),
    });
  } catch (err) {
    res.status(err.status || 502).json({ error: 'ISS feed unavailable', detail: err.message });
  }
});

/** Rough region lookup based on lat/lon */
function guessRegion(lat, lon) {
  if (Math.abs(lat) > 60) return lat > 0 ? 'Arctic Region' : 'Antarctic Region';
  if (lon > -170 && lon < -50) {
    if (lat > 15) return 'North America / Atlantic';
    if (lat > -10) return 'Central America / Pacific';
    return 'South America / South Atlantic';
  }
  if (lon > -50 && lon < 40) {
    if (lat > 35) return 'Europe / North Atlantic';
    if (lat > 0) return 'Africa / Sahara';
    return 'Southern Africa / South Atlantic';
  }
  if (lon > 40 && lon < 100) {
    if (lat > 25) return 'Asia / Central Steppes';
    return 'Indian Ocean / South Asia';
  }
  if (lon > 100 && lon < 160) {
    if (lat > 20) return 'East Asia / Pacific';
    if (lat > -15) return 'Southeast Asia / Pacific';
    return 'Australia / Coral Sea';
  }
  return 'Pacific Ocean';
}

export default router;
