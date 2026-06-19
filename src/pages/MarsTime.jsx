import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';

/**
 * Mars Time formulas from Allison & McEwen (2000).
 * MSD = Mars Sol Date (one sol = 24h 39m 35s of Earth time).
 * MTC = Mars Coordinated Time (mean solar time at Mars prime meridian).
 * LMST = Local Mean Solar Time at any given east longitude.
 */
function marsClock(date = new Date()) {
  const J2000 = 2451545.0;
  const jd_ut = date.getTime() / 86400000 + 2440587.5;
  const dt_j2000 = jd_ut - J2000;
  const MSD = (dt_j2000 - 4.5) / 1.027491252 + 44796.0 - 0.00096;
  const MTC = (24 * MSD) % 24;
  return { MSD, MTC };
}

function localMST(MTC, lonEast) {
  const lonWest = 360 - lonEast;
  let h = MTC - lonWest / 15;
  while (h < 0) h += 24;
  while (h >= 24) h -= 24;
  return h;
}

function fmt(decimalHours) {
  const h = Math.floor(decimalHours);
  const m = Math.floor((decimalHours - h) * 60);
  const s = Math.floor(((decimalHours - h) * 60 - m) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Mission landing dates (sol 0 = landing day, sol 1 = day after)
const SOLS = {
  perseverance: { landingMs: Date.UTC(2021, 1, 18, 20, 55, 0) },  // 18 Feb 2021 20:55 UTC
  curiosity:    { landingMs: Date.UTC(2012, 7, 6, 5, 17, 0) },    // 06 Aug 2012 05:17 UTC
};
function missionSol(landingMs) {
  const elapsedSec = (Date.now() - landingMs) / 1000;
  return Math.floor(elapsedSec / 88775.244);   // one Mars sol ≈ 88775.244 sec
}

const LOCATIONS = [
  { id: 'jezero', name: 'Jezero Crater',  rover: 'Perseverance', lonE:  77.45, lat:  18.44, since: 'Feb 2021' },
  { id: 'gale',   name: 'Gale Crater',    rover: 'Curiosity',    lonE: 137.44, lat:  -4.59, since: 'Aug 2012' },
];

export default function MarsTime() {
  useReveal();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { MSD, MTC } = marsClock(now);
  const utc  = now.toISOString().slice(11, 19);
  const earth = now.toLocaleTimeString();

  return (
    <>
      <PageHero
        kicker="Live"
        title="Mars Time"
        sub="The current time on Mars, computed from the Allison & McEwen (2000) formulas. Mars Coordinated Time + local mean solar time at both active rover sites."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">⊕</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Earth</div>
            <h2 className="movement-title">Your local clocks</h2>
          </div>
        </header>
        <div className="mt-grid reveal">
          <div className="mt-clock">
            <div className="mt-clock-label">UTC</div>
            <div className="mt-clock-time">{utc}</div>
            <div className="mt-clock-sub">{now.toUTCString().slice(0, 16)}</div>
          </div>
          <div className="mt-clock">
            <div className="mt-clock-label">Your local time</div>
            <div className="mt-clock-time">{earth}</div>
            <div className="mt-clock-sub">{now.toLocaleDateString()}</div>
          </div>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">♂</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Mars · Global</div>
            <h2 className="movement-title">Mars Coordinated Time (MTC)</h2>
            <p className="movement-sub">Mean solar time at Mars's prime meridian (Airy-0 crater)</p>
          </div>
        </header>
        <div className="mt-grid reveal">
          <div className="mt-clock gold">
            <div className="mt-clock-label">MTC</div>
            <div className="mt-clock-time">{fmt(MTC)}</div>
            <div className="mt-clock-sub">MSD {MSD.toFixed(5)}</div>
          </div>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">⌖</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Rover sites</div>
            <h2 className="movement-title">Local time where the robots are</h2>
          </div>
        </header>
        <div className="mt-grid reveal">
          {LOCATIONS.map(loc => {
            const lmst = localMST(MTC, loc.lonE);
            const sol  = missionSol(SOLS[loc.id === 'jezero' ? 'perseverance' : 'curiosity'].landingMs);
            const isDaytime = lmst > 6 && lmst < 18;
            return (
              <div key={loc.id} className={`mt-clock ${isDaytime ? 'daytime' : 'nighttime'}`}>
                <div className="mt-clock-label">{loc.name} · {loc.rover}</div>
                <div className="mt-clock-time">{fmt(lmst)}</div>
                <div className="mt-clock-sub">
                  Sol {sol.toLocaleString()} · {isDaytime ? '☀ daytime' : '☾ night'} · {loc.lat}°, {loc.lonE}°E
                </div>
                <div className="mt-clock-since">Operating since {loc.since}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">How it works</div>
            <h2 className="movement-title">A Martian day</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">A Mars sol — one full rotation — is <strong>24 hours, 39 minutes, 35.244 seconds</strong> long, about 2.7% longer than an Earth day. Mission controllers working with rovers live on "Mars time" for the first 90 sols after landing, shifting their sleep schedule by 40 minutes every day. After three months their bodies and families revolt and they switch back to Earth time.</p>
          <p className="planet-desc-body">The math here uses the formulas published by Michael Allison and Megan McEwen in 2000, accurate to better than a second. <strong>MSD</strong> (Mars Sol Date) counts sols since 29 December 1873 — an arbitrary epoch chosen by Allison so the count works smoothly with the Julian Date system used in astronomy.</p>
        </div>
      </section>
    </>
  );
}
