/**
 * /api/space-weather
 *
 * Aggregates several NOAA Space Weather Prediction Center feeds into a
 * single response:
 *   - Latest planetary K-index (geomagnetic disturbance, 0-9)
 *   - 5-minute solar wind plasma
 *   - 6-hour X-ray flux (solar flares)
 *   - Active alerts
 *
 * All NOAA SWPC endpoints are free with no API key.
 * Cached 60 s.
 */

import express from 'express';
const router = express.Router();

let cache = null;
const TTL = 60 * 1000;

const ENDPOINTS = {
  kp:        'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json',
  wind:      'https://services.swpc.noaa.gov/products/solar-wind/plasma-5-minute.json',
  xray:      'https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json',
  alerts:    'https://services.swpc.noaa.gov/products/alerts.json',
};

async function fetchJson(url) {
  try {
    const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

router.get('/', async (_req, res) => {
  if (cache && Date.now() - cache.t < TTL) return res.json(cache.data);

  const [kp, wind, xray, alerts] = await Promise.all([
    fetchJson(ENDPOINTS.kp),
    fetchJson(ENDPOINTS.wind),
    fetchJson(ENDPOINTS.xray),
    fetchJson(ENDPOINTS.alerts),
  ]);

  // Latest Kp index (last item)
  const latestKp = Array.isArray(kp) && kp.length ? kp[kp.length - 1] : null;

  // Solar wind comes as array-of-arrays with first row = headers
  let solarWind = null;
  if (Array.isArray(wind) && wind.length > 1) {
    const headers = wind[0];
    const latest  = wind[wind.length - 1];
    solarWind = Object.fromEntries(headers.map((h, i) => [h, latest[i]]));
  }

  // X-ray: latest GOES primary observation
  let latestXray = null;
  if (Array.isArray(xray) && xray.length) {
    const long  = xray.filter(x => x.energy === '0.1-0.8nm');
    if (long.length) latestXray = long[long.length - 1];
  }

  // Active alerts: last 5
  const recentAlerts = Array.isArray(alerts) ? alerts.slice(0, 5) : [];

  const data = { kp: latestKp, solarWind, xray: latestXray, alerts: recentAlerts, fetched: new Date().toISOString() };
  cache = { data, t: Date.now() };
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.json(data);
});

export default router;
