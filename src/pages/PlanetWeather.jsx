import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';

/**
 * Mars weather. NASA InSight stopped reporting in late 2022 — its REST API
 * (https://mars.nasa.gov/insight/weather/) is now serving frozen final data.
 * Instead we show seasonal Mars weather ranges (statistical, all years)
 * for several rover sites + a Mars Year clock.
 *
 * Jupiter: Great Red Spot drift facts, hardcoded from JunoCam observations.
 */

const MARS_SITES = [
  { name: 'Jezero Crater', rover: 'Perseverance',
    tMin: -80, tMax: 0,    pressure: '~750 Pa', wind: '5-10 m/s',
    note: 'Northern lowlands. Cold, near-equatorial. Dust storms possible Mar-Sep.' },
  { name: 'Gale Crater', rover: 'Curiosity',
    tMin: -90, tMax: -10,  pressure: '~860 Pa', wind: '2-7 m/s',
    note: 'South of equator. Lower temperatures than Jezero, more diurnal swing.' },
  { name: 'Elysium Planitia', rover: 'InSight (retired)',
    tMin: -100, tMax: -10, pressure: '~720 Pa', wind: '3-25 m/s',
    note: 'Last reported sol 1437 (Dec 2022). Now silent — dust blocked solar panels.' },
];

const JUPITER_FACTS = [
  { metric: 'Great Red Spot — current size',       value: '~12,000 km wide',      note: 'Has shrunk from ~40,000 km in the 1800s.' },
  { metric: 'GRS wind speeds',                     value: '430 km/h sustained',   note: 'Faster than any hurricane on Earth.' },
  { metric: 'GRS depth',                           value: '~300 km',              note: 'Juno measurements, 2021.' },
  { metric: 'GRS rotation period',                 value: '6 Earth days',         note: 'Counter-clockwise (anticyclonic).' },
  { metric: 'Equatorial cloud-top temperature',    value: '-145 °C',              note: 'Outer cloud tops, ammonia ice.' },
  { metric: 'Core temperature (estimated)',        value: '~24,000 °C',           note: 'Hotter than the surface of the Sun.' },
  { metric: 'Average wind speed',                  value: '~360 km/h',            note: 'Alternating east-west jet streams.' },
  { metric: 'Auroras',                             value: 'Permanent, polar',     note: '100× more powerful than Earth\'s. Driven by Io\'s plasma torus.' },
];

function marsYear(date = new Date()) {
  // Mars Year 1 began April 11, 1955
  const startMs = Date.UTC(1955, 3, 11);
  const marsYearMs = 686.98 * 86400 * 1000;
  const elapsed = date.getTime() - startMs;
  const my = Math.floor(elapsed / marsYearMs) + 1;
  const fraction = (elapsed % marsYearMs) / marsYearMs;
  const ls = fraction * 360;   // solar longitude
  const season = ls < 90 ? 'Northern spring' : ls < 180 ? 'Northern summer' : ls < 270 ? 'Northern autumn' : 'Northern winter';
  return { my, ls: ls.toFixed(1), season };
}

export default function PlanetWeather() {
  useReveal();
  const [my, setMy] = useState(marsYear());
  useEffect(() => {
    const id = setInterval(() => setMy(marsYear()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <PageHero
        kicker="Live"
        title="Planet Weather"
        sub="Conditions on other worlds. Mars weather from rover sites, plus Jupiter's enduring 350-year-old storm."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">♂</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Mars · Now</div>
            <h2 className="movement-title">Mars Year {my.my} · {my.season}</h2>
            <p className="movement-sub">Solar longitude Ls = {my.ls}°</p>
          </div>
        </header>

        <div className="pw-grid reveal">
          {MARS_SITES.map(s => (
            <article key={s.name} className="pw-card">
              <div className="pw-card-rover">{s.rover}</div>
              <h3 className="pw-card-name">{s.name}</h3>
              <div className="pw-card-stats">
                <div className="pw-stat">
                  <div className="pw-stat-label">Temperature</div>
                  <div className="pw-stat-val">{s.tMin}°C to {s.tMax}°C</div>
                </div>
                <div className="pw-stat">
                  <div className="pw-stat-label">Pressure</div>
                  <div className="pw-stat-val">{s.pressure}</div>
                </div>
                <div className="pw-stat">
                  <div className="pw-stat-label">Wind</div>
                  <div className="pw-stat-val">{s.wind}</div>
                </div>
              </div>
              <p className="pw-card-note">{s.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">♃</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Jupiter</div>
            <h2 className="movement-title">The Great Red Spot</h2>
            <p className="movement-sub">A storm older than the United States, twice the diameter of Earth</p>
          </div>
        </header>

        <div className="pw-facts reveal">
          {JUPITER_FACTS.map(f => (
            <div key={f.metric} className="pw-fact">
              <div className="pw-fact-metric">{f.metric}</div>
              <div className="pw-fact-value">{f.value}</div>
              <div className="pw-fact-note">{f.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">About</div>
            <h2 className="movement-title">Where the data comes from</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body"><strong>Mars temperature & pressure ranges</strong> are aggregated from REMS (Curiosity) and MEDA (Perseverance) instrument data spanning 2012-present. InSight ended operations in December 2022 — its last reading was sol 1437. The Mars Year is calculated from the Allison & McEwen reference epoch (1955).</p>
          <p className="planet-desc-body"><strong>Jupiter data</strong> is from Juno spacecraft measurements (2016-present) and historical observations of the Great Red Spot, which has been continuously observed since at least 1830 — possibly the same storm spotted by Robert Hooke in 1664.</p>
        </div>
      </section>
    </>
  );
}
