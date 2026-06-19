/**
 * Frontend API client. All calls go through /api/* which the Express
 * backend proxies (with caching + API key hidden).
 */

async function jget(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${url}`);
  return r.json();
}

export const api = {
  apod:     ()                     => jget('/api/apod'),
  planet:   (id)                   => jget(`/api/planets/${id}`),
  mars:     (rover, sol = 1000)    => jget(`/api/mars/${rover}?sol=${sol}`),
  library:  (q, limit = 12)        => jget(`/api/library?q=${encodeURIComponent(q)}&limit=${limit}`),
  neo:      ()                     => jget('/api/neo'),
  iss:      ()                     => jget('/api/iss'),
  missionsPast:     (limit = 10)   => jget(`/api/missions/past?limit=${limit}`),
  missionsUpcoming: (limit = 10)   => jget(`/api/missions/upcoming?limit=${limit}`),
  launchesUpcoming: (limit = 12)   => jget(`/api/launches/upcoming?limit=${limit}`),
  launchesPast:     (limit = 12)   => jget(`/api/launches/past?limit=${limit}`),
  cme:              ()             => jget('/api/donki/cme'),
  image:            (q)            => jget(`/api/image?q=${encodeURIComponent(q)}`),
  astronauts:       ()             => jget('/api/astronauts'),
  spaceWeather:     ()             => jget('/api/space-weather'),
  sunrise:          (lat, lon)     => jget(`/api/sunrise?lat=${lat}&lon=${lon}`),
  jwstImages:       ()             => jget('/api/jwst-images'),
};
