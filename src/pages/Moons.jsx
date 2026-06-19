import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero.jsx';
import LazyImage from '../components/ui/LazyImage.jsx';
import { useReveal } from '../lib/useReveal.js';
import { MOONS_BY_PARENT } from '../data/moons.js';

export default function Moons() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Satellites"
        title="All Moons"
        sub="Over 200 natural satellites orbit the worlds of our solar system. These are the ones that matter most."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">The Satellites of the Solar System</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">
            Our solar system contains over 200 confirmed natural satellites. Mercury and Venus have none; Earth has one; Mars has two tiny captured asteroids. Jupiter has 95 confirmed moons, Saturn 146, Uranus 27, and Neptune 14 — with hundreds more sub-kilometre moonlets known. Below are the moons that matter most: the largest, the strangest, the ones we have visited, and the ones that may hide life beneath their ice.
          </p>
        </div>
      </section>

      {Object.entries(MOONS_BY_PARENT).map(([parent, list]) => (
        <section className="movement" key={parent}>
          <header className="movement-header reveal">
            <div className="movement-num"><em>☾</em></div>
            <div className="movement-title-block">
              <div className="movement-kicker">Parent · {parent}</div>
              <h2 className="movement-title">{parent}'s Moons</h2>
            </div>
          </header>
          <div className="moons-grid reveal">
            {list.map(m => (
              <article key={m.id} className="moon-card has-image">
                <LazyImage
                  query={`${m.name} moon`}
                  alt={m.name}
                  aspectRatio="16/9"
                  className="moon-card-img"
                />
                <div className="moon-card-body">
                  <div className="moon-card-h">
                    <h3 className="moon-name">{m.name}</h3>
                    <div className="moon-diameter">{m.diameter}</div>
                  </div>
                  <div className="moon-tag">— {m.tagline}</div>
                  <p className="moon-notable">{m.notable}</p>
                  <p className="moon-facts">{m.facts}</p>
                  <div className="moon-meta">
                    <span><strong>Discovered:</strong> {m.discovered}</span>
                  </div>
                  {m.detailPage && <Link to={m.detailPage} className="moon-link">Read more →</Link>}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
