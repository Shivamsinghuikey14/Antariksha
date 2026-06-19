import { Router } from 'express';
import { cached } from '../../lib/cache.js';
import { fetchJSON } from '../../lib/nasaClient.js';

const router = Router();

/**
 * GET /api/launches/upcoming?limit=
 * Aggregates launches from EVERY tracked space agency:
 * NASA, SpaceX, ULA, Roscosmos, CNSA (China), ISRO (India),
 * JAXA (Japan), Arianespace, Rocket Lab, Blue Origin, and more.
 * Source: Launch Library 2 by The Space Devs.
 * Cached for 15 minutes (schedules slip frequently).
 */
router.get('/upcoming', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 30);
  try {
    const data = await cached(`ll2:upcoming:${limit}`, 900, async () => {
      const up = await fetchJSON(`https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=${limit}`);
      return up.results.map(normalise);
    });
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: 'Launches unavailable', detail: err.message });
  }
});

router.get('/past', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 30);
  try {
    const data = await cached(`ll2:past:${limit}`, 1800, async () => {
      const up = await fetchJSON(`https://ll.thespacedevs.com/2.2.0/launch/previous/?limit=${limit}`);
      return up.results.map(normalise);
    });
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: 'Launches unavailable', detail: err.message });
  }
});

function normalise(l) {
  return {
    id: l.id,
    name: l.name,
    status: l.status?.name || '',
    statusAbbrev: l.status?.abbrev || '',
    netTime: l.net,
    windowStart: l.window_start,
    windowEnd: l.window_end,
    provider: l.launch_service_provider?.name || '',
    providerType: l.launch_service_provider?.type || '',
    rocket: l.rocket?.configuration?.full_name || l.rocket?.configuration?.name || '',
    mission: l.mission?.name || '',
    missionDescription: l.mission?.description || '',
    missionType: l.mission?.type || '',
    orbit: l.mission?.orbit?.name || '',
    pad: l.pad?.name || '',
    padLocation: l.pad?.location?.name || '',
    image: l.image || null,
    webcastLive: l.webcast_live || false,
    infoUrl: l.infoURLs?.[0]?.url || null,
    videoUrl: l.vidURLs?.[0]?.url || null,
  };
}

export default router;
