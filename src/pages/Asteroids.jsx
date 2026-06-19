import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import LazyImage from '../components/ui/LazyImage.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import { useReveal } from '../lib/useReveal.js';
import { api } from '../lib/api.js';

const FAMOUS = [
  ['Ceres',     '~940 km diam',  "The largest object in the asteroid belt — a dwarf planet, not just an asteroid. NASA's Dawn mission orbited it 2015-18 and found evidence of cryovolcanism and a subsurface brine ocean."],
  ['Vesta',     '~525 km diam',  "Second-largest asteroid, and the brightest seen from Earth. A protoplanet that never quite became a planet, with a differentiated iron core like Earth's."],
  ['Bennu',     '~492 m diam',   "A carbon-rich rubble pile NASA's OSIRIS-REx visited 2018-21, returning samples to Earth in 2023. Bennu has a small chance (1-in-1,750) of impacting Earth in the 2300s."],
  ['Ryugu',     '~900 m diam',   "JAXA's Hayabusa2 visited this diamond-shaped rubble pile in 2018-19 and returned samples to Earth in 2020. Found to contain organic molecules and amino acids."],
  ['Apophis',   '~340 m diam',   "On April 13, 2029, Apophis will pass closer to Earth than our geostationary satellites — visible to the naked eye. Once feared for impact, now ruled out for the 21st century."],
  ['Psyche',    '~226 km diam',  "A unique metallic asteroid believed to be the exposed core of an early planet. NASA's Psyche spacecraft launched in 2023 and will arrive in 2029."],
];

export default function Asteroids() {
  useReveal();
  const [neos, setNeos] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.neo()
      .then(d => setNeos(d.objects || d || []))
      .catch(e => setErr(e.message));
  }, []);

  return (
    <>
      <PageHero
        kicker="Watch"
        title="Asteroids"
        sub="A million rocky remnants from the birth of the solar system. Most live in the belt between Mars and Jupiter — but tens of thousands cross Earth's orbit."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">Rocks Between the Worlds</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">Asteroids are the leftover construction debris of the solar system — rocky and metallic bodies that never accreted into a planet. The vast majority orbit in the main belt between Mars and Jupiter, where Jupiter's gravity prevented the formation of a fifth terrestrial world. Their combined mass would not equal that of our Moon.</p>
          <p className="planet-desc-body">Near-Earth Asteroids (NEAs) are those whose orbits bring them within 1.3 AU of the Sun — close enough to potentially threaten Earth. NASA's planetary defence office tracks over 35,000 of them; in 2022, the DART mission successfully altered the orbit of one (Dimorphos) to demonstrate that we can deflect a threat if needed.</p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>↻</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Live · NASA NeoWs</div>
            <h2 className="movement-title">Near-Earth Approaches This Week</h2>
            <p className="movement-sub">Asteroids currently passing within the inner solar system. Updated continuously from NASA's tracking database.</p>
          </div>
        </header>
        <div className="neo-grid reveal">
          {err && <div className="error">// NEO tracker unavailable — {err}</div>}
          {!err && !neos && <div className="loading">Loading near-Earth objects…</div>}
          {neos?.slice(0, 12).map((n, i) => (
            <article key={i} className={`neo-card ${n.hazardous ? 'hazardous' : ''}`}>
              <div className="neo-name">{n.name}</div>
              <div className="neo-stat-row">
                <div className="neo-stat"><span>Approach</span>{n.closeApproachDate}</div>
                <div className="neo-stat"><span>Miss distance</span>{n.missKm ? `${(n.missKm / 1e6).toFixed(2)}M km` : 'n/a'}</div>
                <div className="neo-stat"><span>Velocity</span>{n.velocityKmS ? `${n.velocityKmS.toFixed(1)} km/s` : 'n/a'}</div>
                <div className="neo-stat"><span>Diameter</span>{n.diameterM ? `~${Math.round(n.diameterM)} m` : 'n/a'}</div>
              </div>
              {n.hazardous && <div className="neo-hazard">⚠ Potentially hazardous</div>}
            </article>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>★</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Famous Asteroids</div>
            <h2 className="movement-title">The Ones We Have Met</h2>
          </div>
        </header>
        <div className="moons-grid reveal">
          {FAMOUS.map(([name, size, desc]) => (
            <article key={name} className="moon-card has-image">
              <LazyImage query={`${name} asteroid`} alt={name} aspectRatio="16/9" />
              <div className="moon-card-body">
                <div className="moon-card-h">
                  <h3 className="moon-name">{name}</h3>
                  <div className="moon-diameter">{size}</div>
                </div>
                <p className="moon-notable">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery · NASA</div>
            <h2 className="movement-title">Asteroids Up Close</h2>
          </div>
        </header>
        <TopicGallery query="asteroid" limit={12} />
      </section>
    </>
  );
}
