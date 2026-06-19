import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import EarthScene from '../components/three/EarthScene.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import { useReveal } from '../lib/useReveal.js';
import { api } from '../lib/api.js';

const FACTS = [
  ['01', 'The ISS orbits Earth every 92 minutes — the crew sees 16 sunrises and 16 sunsets every day.'],
  ['02', 'Its average altitude is 400 km. It travels at 7.66 km/s, or about 27,600 km/h.'],
  ['03', 'It has been continuously inhabited since 2 November 2000 — the longest unbroken human presence in space.'],
  ['04', 'The pressurised volume is roughly equivalent to a six-bedroom house. The exterior is the size of a football pitch.'],
  ['05', 'Five space agencies operate it together: NASA, Roscosmos, ESA, JAXA, and CSA. Over 270 people from 21 countries have visited.'],
  ['06', 'The station is scheduled for retirement in January 2031 and will be guided into a controlled re-entry over the Pacific Ocean.'],
];

export default function ISS() {
  useReveal();
  const [iss, setIss] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    const tick = () => {
      api.iss()
        .then(d => { if (alive) setIss(d); })
        .catch(e => { if (alive) setErr(e.message); });
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return (
    <>
      <PageHero
        kicker="Station"
        title="The International Space Station"
        sub="A 420-tonne laboratory orbiting Earth every 92 minutes at 27,600 km/h. Continuously inhabited since November 2000."
      />

      <section className="movement">
        <EarthScene lat={iss?.latitude} lon={iss?.longitude} />
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◯</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Live · WhereTheISSAt</div>
            <h2 className="movement-title">Live Telemetry</h2>
            <p className="movement-sub">Position refreshed every five seconds.</p>
          </div>
        </header>
        <div className="iss-telemetry reveal">
          {err && <div className="error">// ISS telemetry unavailable — {err}</div>}
          {!err && !iss && <div className="loading">Acquiring ISS position…</div>}
          {iss && (
            <div className="iss-grid">
              <div className="iss-cell"><div className="iss-k">Latitude</div><div className="iss-v">{iss.latitude?.toFixed(4)}°</div></div>
              <div className="iss-cell"><div className="iss-k">Longitude</div><div className="iss-v">{iss.longitude?.toFixed(4)}°</div></div>
              <div className="iss-cell"><div className="iss-k">Altitude</div><div className="iss-v">{iss.altitude?.toFixed(2)} km</div></div>
              <div className="iss-cell"><div className="iss-k">Velocity</div><div className="iss-v">{iss.velocity?.toFixed(2)} km/h</div></div>
              <div className="iss-cell"><div className="iss-k">Visibility</div><div className="iss-v">{iss.visibility || '—'}</div></div>
              <div className="iss-cell"><div className="iss-k">Updated</div><div className="iss-v">{iss.timestamp ? new Date(iss.timestamp * 1000).toLocaleTimeString() : '—'}</div></div>
            </div>
          )}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>!</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Quick Facts</div>
            <h2 className="movement-title">Things About the Station</h2>
          </div>
        </header>
        <div className="planet-facts reveal" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <ul className="fact-list">
            {FACTS.map(([num, text]) => (
              <li key={num}><span className="fact-num">{num}</span><span className="fact-text">{text}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery · NASA</div>
            <h2 className="movement-title">The Station in Photographs</h2>
          </div>
        </header>
        <TopicGallery query="international space station" limit={14} />
      </section>
    </>
  );
}
