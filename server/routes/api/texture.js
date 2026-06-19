/**
 * /api/texture/:name
 *
 * Proxies planet texture images from Solar System Scope (free for
 * educational use). Serves through Express so there are zero CORS
 * issues when Three.js TextureLoader loads them.
 *
 * Cached in-memory for the session lifetime (textures don't change).
 */

import express from 'express';
const router = express.Router();

const URLS = {
  sun:        'https://www.solarsystemscope.com/textures/download/2k_sun.jpg',
  mercury:    'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
  venus:      'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
  earth:      'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
  earthcloud: 'https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg',
  mars:       'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
  jupiter:    'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
  saturn:     'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
  saturnring: 'https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png',
  uranus:     'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
  neptune:    'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
  moon:       'https://www.solarsystemscope.com/textures/download/2k_moon.jpg',
  stars:      'https://www.solarsystemscope.com/textures/download/2k_stars_milky_way.jpg',
};

const CACHE = new Map();

router.get('/:name', async (req, res) => {
  const name = req.params.name.toLowerCase();
  const url = URLS[name];
  if (!url) return res.status(404).json({ error: 'unknown texture', available: Object.keys(URLS) });

  try {
    if (CACHE.has(name)) {
      const c = CACHE.get(name);
      res.setHeader('Content-Type', c.type);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(c.buf);
    }

    const r = await fetch(url);
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    const type = r.headers.get('content-type') || 'image/jpeg';
    CACHE.set(name, { buf, type });
    res.setHeader('Content-Type', type);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buf);
  } catch (err) {
    console.error(`[texture] ${name}:`, err.message);
    res.status(502).json({ error: 'fetch failed', message: err.message });
  }
});

export default router;
