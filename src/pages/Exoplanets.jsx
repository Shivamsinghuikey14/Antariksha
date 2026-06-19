import PageHero from '../components/ui/PageHero.jsx';
import LazyImage from '../components/ui/LazyImage.jsx';
import { useReveal } from '../lib/useReveal.js';
import { EXOPLANETS, EXOPLANET_COUNT_TOTAL } from '../data/exoplanets.js';

export default function Exoplanets() {
  useReveal();
  const total = EXOPLANET_COUNT_TOTAL;
  return (
    <>
      <PageHero
        kicker="Exoplanets"
        title="Exoplanets"
        sub={`Over ${total.toLocaleString()} confirmed worlds beyond our solar system.`}
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">Worlds Beyond Our Sun</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">An exoplanet is any planet that orbits a star other than the Sun. The first was confirmed in 1992 — orbiting a pulsar — and the first around a sun-like star in 1995. Since then, the field has exploded: there are now <strong style={{ color: 'var(--ember)' }}>{total.toLocaleString()}</strong> confirmed worlds, and counting. The Kepler and TESS missions have shown us that on average, every star in our galaxy has at least one planet.</p>
          <p className="planet-desc-body">We detect them mostly indirectly — by watching a star's brightness dip slightly as a planet passes in front (the transit method), or by watching the star wobble in response to its planets' gravity (radial velocity). The James Webb Space Telescope can now read the chemical composition of exoplanet atmospheres, and has already detected water vapour, carbon dioxide, methane, and — controversially — molecules associated with life on Earth.</p>
        </div>
        <div className="planet-stats-grid reveal">
          <div className="ps-cell"><div className="ps-label">Confirmed worlds</div><div className="ps-value">{total.toLocaleString()}</div></div>
          <div className="ps-cell"><div className="ps-label">First detected</div><div className="ps-value">1992 · pulsar planet</div></div>
          <div className="ps-cell"><div className="ps-label">First around sun-like star</div><div className="ps-value">1995 · 51 Peg b</div></div>
          <div className="ps-cell"><div className="ps-label">Closest known</div><div className="ps-value">Proxima b · 4.24 ly</div></div>
          <div className="ps-cell"><div className="ps-label">Earth-sized in HZ</div><div className="ps-value">~60 candidates</div></div>
          <div className="ps-cell"><div className="ps-label">Planet-bearing stars</div><div className="ps-value">Effectively all of them</div></div>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>+</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Notable Worlds</div>
            <h2 className="movement-title">The Ones to Know</h2>
            <p className="movement-sub">Habitable zone candidates, record-holders, and discoveries that changed the field.</p>
          </div>
        </header>
        <div className="exo-grid reveal">
          {EXOPLANETS.map(p => (
            <article key={p.id} className="exo-card has-image">
              <LazyImage query={`${p.name} exoplanet`} alt={p.name} aspectRatio="16/9" />
              <div className="exo-card-body">
                <div className="exo-header">
                  <div className="exo-h-left">
                    <div className="exo-type">{p.type}</div>
                    <h3 className="exo-name">{p.name}</h3>
                    <div className="exo-star">★ {p.star} · {p.distance}</div>
                  </div>
                </div>
                <div className="exo-tag">— {p.tagline}</div>
                <p className="exo-desc">{p.description}</p>
                <div className="exo-stats">
                  <div><span>Mass</span>{p.mass}</div>
                  <div><span>Radius</span>{p.radius}</div>
                  <div><span>Period</span>{p.period}</div>
                  <div><span>Discovered</span>{p.discovered}</div>
                  <div><span>Method</span>{p.method}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
