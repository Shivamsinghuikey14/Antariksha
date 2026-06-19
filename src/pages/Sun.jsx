import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import SunScene from '../components/three/SunScene.jsx';
import { useReveal } from '../lib/useReveal.js';
import { api } from '../lib/api.js';

const STATS = [
  ['Mean radius', '696,340 km (109 Earths)'],
  ['Mass', '1.989 × 10³⁰ kg (333,000 Earths)'],
  ['Surface temperature', '5,500 °C'],
  ['Core temperature', '15.7 million °C'],
  ['Composition', '~73% hydrogen, ~25% helium'],
  ['Age', '~4.6 billion years'],
  ['Type', 'G-type main sequence (G2V)'],
  ['Distance from Earth', '1 AU = 149.6 million km'],
  ['Sunlight travel time', '8 min 20 sec'],
  ['Rotation period', '~25 days (equator), ~35 days (poles)'],
  ['Energy output', '3.828 × 10²⁶ W'],
  ['Remaining lifespan', '~5 billion years'],
];

export default function Sun() {
  useReveal();
  const [cmes, setCmes] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.cme().then(setCmes).catch(e => setErr(e.message));
  }, []);

  return (
    <>
      <PageHero kicker="Our Star" title="The Sun" sub="Four and a half billion years old. A million Earths could fit inside. Every photon you have ever seen by day, it made." />

      <section className="movement">
        <SunScene />
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">A Yellow Dwarf</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">The Sun is a G-type main sequence star — astronomers call it a yellow dwarf, though it is neither yellow nor a dwarf. It accounts for 99.86% of the mass of the solar system. Inside its core, four hydrogen nuclei fuse into one helium nucleus 600 million tonnes per second, releasing the gamma rays that take 100,000 years to climb to the surface, then eight minutes to reach your eye.</p>
          <p className="planet-desc-body">It is about halfway through its life. In five billion years it will swell into a red giant, swallow Mercury and Venus, and bake the Earth dry. Then it will cast off its outer layers as a planetary nebula and leave behind a slowly cooling white dwarf.</p>
        </div>
        <div className="planet-stats-grid reveal">
          {STATS.map(([k, v]) => (
            <div key={k} className="ps-cell"><div className="ps-label">{k}</div><div className="ps-value">{v}</div></div>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>⚡</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Live · NASA DONKI</div>
            <h2 className="movement-title">Recent Coronal Mass Ejections</h2>
            <p className="movement-sub">Real-time solar weather data. The Sun is constantly throwing material into space.</p>
          </div>
        </header>
        <div className="cme-list reveal">
          {err && <div className="error">// Solar weather feed unavailable — {err}</div>}
          {!err && !cmes && <div className="loading">Loading solar weather…</div>}
          {cmes?.length === 0 && <div className="cme-row"><div className="cme-detail"><em>The sun has been quiet for the last week. No detected coronal mass ejections.</em></div></div>}
          {cmes?.map((c, i) => {
            const t = new Date(c.startTime).toLocaleString('en', {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
            });
            const instruments = c.instruments?.length ? c.instruments.join(', ') : 'unspecified';
            return (
              <div key={i} className="cme-row">
                <div className="cme-date">{t} UTC{c.sourceLocation ? ` · origin ${c.sourceLocation}` : ''}</div>
                <div className="cme-detail">
                  {(c.note || 'A burst of solar plasma was detected.').slice(0, 300)}
                  <br/><small style={{ opacity: 0.6, fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>Instruments: {instruments}</small>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery · SDO</div>
            <h2 className="movement-title">The Sun in Photographs</h2>
          </div>
        </header>
        <TopicGallery query="sun" limit={12} />
      </section>
    </>
  );
}
