/**
 * api/index.js — Vercel serverless adapter.
 *
 * Vercel runs each /api/* file as a Node serverless function. We mount
 * the existing Express app from server/index.js as a single catch-all,
 * so every route Claude already wrote (apod, planets, mars, library,
 * neo, missions, iss, launches, epic, donki, image, astronauts,
 * space-weather, sunrise, jwst-images, texture) keeps working with
 * zero changes.
 *
 * The serve(...) call inside server/index.js doesn't fire because
 * Vercel never imports it as the entry — it imports the exported app.
 */
import express from 'express';

// Re-create the same router setup as server/index.js, but export it.
import apodRouter         from '../server/routes/api/apod.js';
import planetsRouter      from '../server/routes/api/planets.js';
import marsRouter         from '../server/routes/api/mars.js';
import libraryRouter      from '../server/routes/api/library.js';
import neoRouter          from '../server/routes/api/neo.js';
import missionsRouter     from '../server/routes/api/missions.js';
import issRouter          from '../server/routes/api/iss.js';
import launchesRouter     from '../server/routes/api/launches.js';
import epicRouter         from '../server/routes/api/epic.js';
import donkiRouter        from '../server/routes/api/donki.js';
import imageRouter        from '../server/routes/api/image.js';
import astronautsRouter   from '../server/routes/api/astronauts.js';
import spaceWeatherRouter from '../server/routes/api/space-weather.js';
import sunriseRouter      from '../server/routes/api/sunrise.js';
import jwstImagesRouter   from '../server/routes/api/jwst-images.js';
import textureRouter      from '../server/routes/api/texture.js';

const app = express();

app.get('/api/health', (_req, res) => res.json({ ok: true, env: 'vercel' }));

app.use('/api/apod',          apodRouter);
app.use('/api/planets',       planetsRouter);
app.use('/api/mars',          marsRouter);
app.use('/api/library',       libraryRouter);
app.use('/api/neo',           neoRouter);
app.use('/api/missions',      missionsRouter);
app.use('/api/iss',           issRouter);
app.use('/api/launches',      launchesRouter);
app.use('/api/epic',          epicRouter);
app.use('/api/donki',         donkiRouter);
app.use('/api/image',         imageRouter);
app.use('/api/astronauts',    astronautsRouter);
app.use('/api/space-weather', spaceWeatherRouter);
app.use('/api/sunrise',       sunriseRouter);
app.use('/api/jwst-images',   jwstImagesRouter);
app.use('/api/texture',       textureRouter);

export default app;
