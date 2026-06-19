import { useParams, Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import PlanetScene from '../components/three/PlanetScene.jsx';
import { useReveal } from '../lib/useReveal.js';
import { BODIES } from '../data/bodies.js';
import NotFound from './NotFound.jsx';

const ringedBodies = {
  saturn: 'saturnringcolor.jpg',
};
const cloudedBodies = {
  earth: 'earthcloudmap.jpg',
  venus: 'venusmap.jpg', // venus surface is so clouded it acts like the cloud layer
};

const galleryQuery = {
  mercury: 'mercury planet',
  venus:   'venus planet',
  earth:   'earth from space',
  mars:    'mars surface',
  jupiter: 'jupiter planet',
  saturn:  'saturn rings',
  uranus:  'uranus planet',
  neptune: 'neptune planet',
};

export default function PlanetDetail() {
  useReveal();
  const { id } = useParams();
  const body = BODIES.find(b => b.id === id);
  if (!body) return <NotFound />;

  const ringTex = ringedBodies[body.id] || null;
  const cloudsTex = body.id === 'earth' ? cloudedBodies.earth : null;

  return (
    <>
      <PageHero
        kicker={`${body.index} · ${body.name}`}
        title={body.name}
        sub={body.tagline}
      />

      <section className="movement">
        <PlanetScene
          tex={body.tex}
          ringTex={ringTex}
          cloudsTex={cloudsTex}
        />
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">{body.name} — A Closer Look</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">{body.description}</p>
          <div className="planet-named-after">
            <strong>Named after:</strong> {body.namedAfter}<br/>
            <strong>Discovery:</strong> {body.discovered}<br/>
            <strong>Type:</strong> {body.type}
          </div>
        </div>
        <div className="planet-stats-grid reveal">
          {Object.entries(body.stats).map(([k, v]) => (
            <div key={k} className="ps-cell"><div className="ps-label">{k}</div><div className="ps-value">{v}</div></div>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>!</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Things to know</div>
            <h2 className="movement-title">Quick Facts</h2>
          </div>
        </header>
        <div className="planet-facts reveal" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <ul className="fact-list">
            {body.facts.map((text, i) => (
              <li key={i}><span className="fact-num">{String(i+1).padStart(2,'0')}</span><span className="fact-text">{text}</span></li>
            ))}
          </ul>
        </div>
      </section>

      {body.moons.length > 0 && (
        <section className="movement">
          <header className="movement-header reveal">
            <div className="movement-num"><em>☾</em></div>
            <div className="movement-title-block">
              <div className="movement-kicker">Satellites</div>
              <h2 className="movement-title">Moons of {body.name}</h2>
            </div>
          </header>
          <div className="planet-moons reveal">
            {body.moons.map(m => <span key={m} className="moon-chip">{m}</span>)}
          </div>
        </section>
      )}

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>↑</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Exploration</div>
            <h2 className="movement-title">Missions to {body.name}</h2>
          </div>
        </header>
        <div className="planet-missions reveal">
          {body.missions.map((m, i) => <div key={i} className="mission-pill">{m}</div>)}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery · NASA</div>
            <h2 className="movement-title">{body.name} in Photographs</h2>
          </div>
        </header>
        <TopicGallery query={galleryQuery[body.id] || body.id} limit={14} />
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>+</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">All Worlds</div>
            <h2 className="movement-title">Continue Exploring</h2>
          </div>
        </header>
        <div className="planet-nav reveal">
          {BODIES.filter(b => b.id !== body.id).map(b => (
            <Link key={b.id} to={`/planets/${b.id}`} className="planet-nav-item">
              <div className="pni-num">{b.index}</div>
              <div className="pni-name">{b.name}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
