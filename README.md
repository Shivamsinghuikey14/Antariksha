# AETHER — a complete heaven for space lovers

> React + Three.js atlas of the cosmos. Live data from NASA, ESA, JAXA, SpaceX, and the great observatories of Earth.

A **single-page application** built with React 18, Vite 5, React Router 6, and Three.js. Backed by a small Express server that proxies APIs and serves the built SPA.

## Quick start

```bash
npm install
npm run dev
```

This launches Vite (frontend dev server) at **http://localhost:5173** and Express (API backend) at **http://localhost:3000** simultaneously, via `concurrently`. Vite proxies `/api/*` to Express, so the frontend feels seamless.

For production:

```bash
npm run build       # → dist/
npm start           # serves dist/ + /api/* on PORT (default 3000)
```

Open `http://localhost:3000`.

## NASA API key (recommended)

NASA's APIs work without a key but are rate-limited to ~30 requests/hour per IP. Get a free key at <https://api.nasa.gov> and drop it in `.env`:

```
NASA_API_KEY=your_key_here
```

The server reads it via `dotenv` and uses it for APOD, NeoWs (asteroids), Mars Rover Photos, EPIC, and DONKI (solar weather).

## All 26 routes

| Path | What's there |
|------|--------------|
| `/` | 3D hero + 20 gateway cards + APOD |
| `/solar-system` | Full live 3D orrery — click any planet to step inside |
| `/planets` | Index of the eight worlds |
| `/planets/:id` | Per-planet 3D viewer, dossier, moons, missions, gallery |
| `/sun` | 3D Sun + live coronal mass ejections from NASA DONKI |
| `/moon` | Lunar dossier + facts + gallery |
| `/moons` | 22 major moons, grouped by parent |
| `/stars` | Catalogue of notable stars |
| `/exoplanets` | 5,793+ confirmed worlds beyond our sun |
| `/universe` | Cosmology — Big Bang, dark sector, timeline |
| `/nebulae` | Star nurseries and graves |
| `/galaxies` | Andromeda, Sombrero, Whirlpool, more |
| `/milkyway` | Our home galaxy in numbers |
| `/blackholes` | Sgr A*, M87*, Cygnus X-1, TON 618 |
| `/asteroids` | Live NEO tracker + famous asteroids |
| `/comets` | Annual meteor showers calendar |
| `/missions` | Upcoming + past launches from every agency |
| `/mars` | Live Curiosity & Perseverance rover photos |
| `/iss` | 3D Earth + live ISS position (refreshed every 5 s) |
| `/jwst` | James Webb dossier + Webb gallery |
| `/telescopes` | YouTube live feeds + 25-telescope directory |
| `/simulator` | Newtonian gravity sandbox (velocity-Verlet integration) |
| `/archive` | NASA Image Library search |
| `/about` | Credits and philosophy |

All routes use **React Router** for client-side navigation. The Express server has a **SPA fallback** — any non-`/api/*` URL serves `index.html`, so deep links work on refresh.

## Architecture

```
aether-react/
├── src/                          # React frontend
│   ├── main.jsx                  # Entry — mounts <App /> with BrowserRouter
│   ├── App.jsx                   # All 26 routes
│   ├── components/
│   │   ├── Layout.jsx            # Starfield + Cursor + Navbar + main + Footer
│   │   ├── nav/Navbar.jsx        # Desktop dropdowns + mobile burger overlay
│   │   ├── ui/                   # Starfield, Cursor, Lightbox (Context), Footer, PageHero
│   │   ├── three/                # SolarSystemHero, Orrery, PlanetScene, SunScene, EarthScene
│   │   └── widgets/              # ApodCard, TopicGallery, GravitySim
│   ├── pages/                    # One file per route
│   ├── data/                     # Static data (bodies, moons, stars, exoplanets, telescopes)
│   ├── lib/                      # api.js (frontend client), useReveal hook
│   └── styles/                   # 7 CSS files, imported globally
├── server/                       # Express backend
│   ├── index.js                  # Serves dist/ + SPA fallback + cache headers
│   ├── lib/                      # cache, nasaClient (API key, caching)
│   └── routes/api/               # 10 endpoints
├── vite.config.js                # Dev proxy, manualChunks for three+react
├── index.html                    # Vite entry
└── package.json
```

## Why this architecture vs. the previous server-rendered EJS version

The previous build was Express + EJS multi-page rendering. The breaking pain-point was that **a stale browser-cached ES module from an earlier package** kept throwing `Cannot read properties of null (reading 'addEventListener')` in `lightbox.js`, killing every page's JavaScript boot and breaking the mobile burger menu.

The React rewrite makes that class of bug **structurally impossible**:

| Old (EJS multipage) | New (React SPA) |
|---|---|
| Hand-written ES modules per page | Single Vite bundle with content-hashed filenames |
| `import './ui/lightbox.js'` cached by browser indefinitely | `/assets/index-XYZ123.js` — filename changes when content changes |
| Module-level side effects (`initLightbox()`) brick the page on throw | Components mount declaratively; React Error Boundaries catch failures |
| `getElementById('lb-close').addEventListener(...)` — null = throw | `useEffect` runs after render; refs are typed |
| Mobile menu state in DOM classes | Mobile menu state in `useState` — no stale handler |
| Lightbox = global singleton wired by `initLightbox()` | Lightbox = `LightboxProvider` Context; any component opens it via `useLightbox()` |

The Express server now sets:

```
Cache-Control: no-cache, no-store, must-revalidate     # for index.html
Cache-Control: public, max-age=31536000, immutable     # for /assets/*
```

`index.html` is *always* refetched, so it always points at the current hashed bundle. The bundle itself is safe to cache forever because its filename changes whenever its content does. Stale-asset bugs are now impossible by construction.

## Tech stack

- **React 18** with hooks; no class components anywhere
- **React Router 6** for routing
- **Vite 5** as the build tool (lightning-fast HMR in dev)
- **Three.js r160** for 3D scenes (SolarSystemHero, Orrery, PlanetScene, SunScene, EarthScene)
- **Canvas 2D** for the gravity simulator (velocity-Verlet integrator at 60 Hz)
- **Express 4** for the API backend (just 10 thin proxy routes)
- **dotenv** for the NASA key
- **compression** for gzipped responses

## Data sources

- **NASA APOD** — Astronomy Picture of the Day
- **NASA NeoWs** — Near-Earth Object Web Service
- **NASA Mars Rover Photos** — Curiosity, Perseverance
- **NASA Image and Video Library** — public archive (image search)
- **NASA EPIC** — Earth Polychromatic Imaging Camera
- **NASA DONKI** — solar weather (CMEs)
- **Solar System OpenData (api.le-systeme-solaire.net)** — planetary stats
- **WhereTheISSAt** — live ISS position
- **The Space Devs (LL2)** — aggregated launch data from every agency
- **SpaceX REST API** — detailed SpaceX records

## Licence

MIT. Open source, free forever, no accounts, no tracking, no ads, no paywalls.

> "For small creatures such as we, the vastness is bearable only through love."
> — Carl Sagan
