import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';
import { BODIES } from '../data/bodies.js';

export default function Planets() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Worlds"
        title="The Eight Planets"
        sub="Eight planets, one star, and the moons that orbit them. Pick a world to step closer."
      />

      <section className="movement">
        <div className="planet-index-grid reveal">
          {BODIES.map(b => (
            <Link key={b.id} to={`/planets/${b.id}`} className="planet-index-card" style={{ borderColor: b.color + '33' }}>
              <div className="pic-num">{b.index}</div>
              <h3 className="pic-name">{b.name}</h3>
              <div className="pic-tag" style={{ color: b.color }}>— {b.tagline}</div>
              <p className="pic-desc">{b.description.split('. ').slice(0, 2).join('. ')}.</p>
              <span className="pic-arrow">Enter →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
