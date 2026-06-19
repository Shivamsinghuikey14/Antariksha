import { Link } from 'react-router-dom';
import { useReveal } from '../lib/useReveal.js';
import { BODIES } from '../data/bodies.js';
import Orrery from '../components/three/Orrery.jsx';
import HubCards from '../components/ui/HubCards.jsx';

export default function SolarSystem() {
  useReveal();
  return (
    <>
      <section className="orrery-hero">
        <Orrery />
        <div className="orrery-ui">
          <div className="orrery-readout">
            <div className="orrery-eyebrow">Live · 3D Orrery</div>
            <h1 className="orrery-title">The Solar System</h1>
            <p className="orrery-sub">Every world that orbits our star. Drag to rotate. Scroll to zoom. Click a planet to step inside.</p>
            <div className="orrery-legend">
              <span><i style={{ background: '#c4a988' }}></i> Mercury</span>
              <span><i style={{ background: '#e8c890' }}></i> Venus</span>
              <span><i style={{ background: '#5dd5ff' }}></i> Earth</span>
              <span><i style={{ background: '#ff6244' }}></i> Mars</span>
              <span><i style={{ background: '#d4a574' }}></i> Jupiter</span>
              <span><i style={{ background: '#f0d68c' }}></i> Saturn</span>
              <span><i style={{ background: '#9be3e6' }}></i> Uranus</span>
              <span><i style={{ background: '#4a6fff' }}></i> Neptune</span>
            </div>
          </div>
        </div>
      </section>

      <HubCards
        kicker="Browse"
        title="Tour the Solar System"
        items={[
        ['/planets', '01', 'The Eight Planets', 'Mercury through Neptune. Full vital stats, dossiers, moons, and gallery for each.'],
        ['/sun', '02', 'The Sun', 'Our star in 3D — with live coronal mass ejection data from NASA DONKI.'],
        ['/moon', '03', 'The Moon', "Earth's closest companion. Phases, geology, and the Apollo landing sites."],
        ['/moons', '04', 'All Moons', 'Every major moon in the solar system — Europa, Titan, Triton, twenty more.'],
        ['/asteroids', '05', 'Asteroids', 'Ceres, Vesta, Bennu, Ryugu and the live tracker of near-Earth objects.'],
        ['/comets', '06', 'Comets & Meteors', 'Annual meteor showers and the most famous comet visitors.'],
        ['/exoplanets', '07', 'Exoplanets', 'Worlds around other stars — over 5,500 confirmed.']
      ]}
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">About the Model</div>
            <h2 className="movement-title">What You're Looking At</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">
            Every planet here is rendered with its real surface texture, in correct relative scale, on its actual orbital plane. Orbital distances are compressed for visibility — a true-to-scale model would put Neptune off your screen, and the Sun would be the size of a poppy seed. Orbital periods are accurate relative to each other: while Mercury races, Neptune barely moves.
          </p>
          <p className="planet-desc-body">
            Click any planet to load its detail page — full vital statistics, in-depth description, moons, missions, and NASA imagery.
          </p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>+</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">All Worlds</div>
            <h2 className="movement-title">Pick a Planet</h2>
          </div>
        </header>
        <div className="planet-nav reveal">
          {BODIES.map(b => (
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
