import { Router } from 'express';
import { cached } from '../../lib/cache.js';
import { fetchJSON, withKey } from '../../lib/nasaClient.js';

const router = Router();

/**
 * GET /api/donki/notifications
 * NASA DONKI — space weather notifications.
 * Coronal mass ejections, solar flares, geomagnetic storms.
 * Cached for 1 hour.
 */
router.get('/notifications', async (req, res) => {
  try {
    const days = 7;
    const end = new Date();
    const start = new Date(Date.now() - days * 86400 * 1000);
    const startStr = start.toISOString().slice(0, 10);
    const endStr   = end.toISOString().slice(0, 10);
    const data = await cached(`donki:${startStr}:${endStr}`, 3600, async () => {
      const arr = await fetchJSON(withKey(`https://api.nasa.gov/DONKI/notifications?startDate=${startStr}&endDate=${endStr}&type=all`));
      return (arr || []).slice(0, 20).map(n => ({
        id: n.messageID,
        type: n.messageType,
        issueTime: n.messageIssueTime,
        body: (n.messageBody || '').slice(0, 800),
        url: n.messageURL,
      }));
    });
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: 'DONKI unavailable', detail: err.message });
  }
});

/**
 * GET /api/donki/cme
 * Coronal Mass Ejections in the last 7 days.
 */
router.get('/cme', async (req, res) => {
  try {
    const end = new Date();
    const start = new Date(Date.now() - 7 * 86400 * 1000);
    const startStr = start.toISOString().slice(0, 10);
    const endStr   = end.toISOString().slice(0, 10);
    const data = await cached(`donki:cme:${startStr}:${endStr}`, 3600, async () => {
      const arr = await fetchJSON(withKey(`https://api.nasa.gov/DONKI/CME?startDate=${startStr}&endDate=${endStr}`));
      return (arr || []).slice(0, 15).map(n => ({
        id: n.activityID,
        startTime: n.startTime,
        note: n.note,
        sourceLocation: n.sourceLocation,
        instruments: (n.instruments || []).map(i => i.displayName),
      }));
    });
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: 'CME feed unavailable', detail: err.message });
  }
});

export default router;
