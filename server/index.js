import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// API routes
import apodRouter     from './routes/api/apod.js';
import planetsRouter  from './routes/api/planets.js';
import marsRouter     from './routes/api/mars.js';
import libraryRouter  from './routes/api/library.js';
import neoRouter      from './routes/api/neo.js';
import missionsRouter from './routes/api/missions.js';
import issRouter      from './routes/api/iss.js';
import launchesRouter from './routes/api/launches.js';
import epicRouter     from './routes/api/epic.js';
import donkiRouter      from './routes/api/donki.js';
import imageRouter      from './routes/api/image.js';
import astronautsRouter from './routes/api/astronauts.js';
import spaceWxRouter    from './routes/api/space-weather.js';
import sunriseRouter    from './routes/api/sunrise.js';
import jwstImagesRouter from './routes/api/jwst-images.js';
import textureRouter   from './routes/api/texture.js';

import { stats }          from './lib/cache.js';
import { usingDemoKey }   from './lib/nasaClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const DIST_DIR  = path.join(ROOT, 'dist');
const PORT      = process.env.PORT || 3000;

const app = express();
app.disable('x-powered-by');
app.use(compression());

/* ─────────── API routes ─────────── */
app.use('/api/apod',     apodRouter);
app.use('/api/planets',  planetsRouter);
app.use('/api/mars',     marsRouter);
app.use('/api/library',  libraryRouter);
app.use('/api/neo',      neoRouter);
app.use('/api/missions', missionsRouter);
app.use('/api/iss',      issRouter);
app.use('/api/launches', launchesRouter);
app.use('/api/epic',     epicRouter);
app.use('/api/donki',         donkiRouter);
app.use('/api/image',         imageRouter);
app.use('/api/astronauts',    astronautsRouter);
app.use('/api/space-weather', spaceWxRouter);
app.use('/api/sunrise',       sunriseRouter);
app.use('/api/jwst-images',   jwstImagesRouter);
app.use('/api/texture',       textureRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptimeSec: Math.round(process.uptime()),
    usingDemoKey,
    cache: stats(),
  });
});

/* ─────────── React static build + SPA fallback ───────────
 *  - Hashed asset files (JS/CSS in /assets/) get aggressive caching.
 *  - The HTML shell (index.html) is never cached.
 *  - Any unknown URL serves index.html so React Router can take over.
 * ────────────────────────────────────────────────────────── */
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, {
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else if (filePath.includes('/assets/')) {
        // Vite emits hashed filenames, safe to cache forever
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    },
  }));

  // SPA fallback — every non-API GET serves the React shell
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  const line = '─'.repeat(58);
  console.log(`\n${line}`);
  console.log(`  ✦  AETHER · API server is live`);
  console.log(`     Local:   http://localhost:${PORT}`);
  console.log(`     Health:  http://localhost:${PORT}/api/health`);
  if (!fs.existsSync(DIST_DIR)) {
    console.log(`     ⚠  No React build at ${DIST_DIR}`);
    console.log(`        Run \`npm run build\` first, or use \`npm run dev\`.`);
  }
  if (usingDemoKey) {
    console.log(`     ⚠  Using NASA DEMO_KEY (30 req/hour limit)`);
    console.log(`        Free key: https://api.nasa.gov`);
  }
  console.log(`${line}\n`);
});
