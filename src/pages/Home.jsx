import { Link } from 'react-router-dom';
import { useReveal }   from '../lib/useReveal.js';
import SolarSystemHero from '../components/three/SolarSystemHero.jsx';
import ApodCard        from '../components/widgets/ApodCard.jsx';
import TonightSky      from '../components/widgets/TonightSky.jsx';

const CARDS = [
  ['big',  '/solar-system', '01', 'The Solar System · Live 3D', 'Every world orbiting our star, rendered in 3D at correct relative speeds. Drag to rotate, click a planet to step inside.'],
  ['',     '/planets',      '02', 'The Eight Planets',     'Mercury through Neptune. Each with full vital stats, in-depth dossiers, moons, and gallery.'],
  ['',     '/sun',          '03', 'The Sun',               'Our star in 3D — with live coronal mass ejection data from NASA DONKI.'],
  ['',     '/moons',        '04', 'All Moons',             'Every major satellite — Europa, Titan, Triton, and twenty more, grouped by parent world.'],
  ['',     '/stars',        '05', 'Stars',                 'The brightest, biggest, nearest, strangest. From Sirius and Betelgeuse to Proxima Centauri.'],
  ['big',  '/exoplanets',   '06', 'Exoplanets · 5,793 confirmed worlds', 'Worlds beyond our sun. The TRAPPIST-1 system. Proxima b. K2-18 b\'s possible biosignatures.'],
  ['',     '/constellations','07','The 88 Constellations', 'Every official IAU star pattern, with mythology, brightest star, and deep-sky highlights.'],
  ['',     '/universe',     '08', 'The Universe',          'Cosmology. The Big Bang. Dark matter, dark energy, inflation, and the questions we still can\'t answer.'],
  ['',     '/nebulae',      '09', 'Nebulae',               'Stellar nurseries and stellar graves. Where stars are born and die.'],
  ['',     '/galaxies',     '10', 'Galaxies',              'Two trillion of them. Spirals, ellipticals, irregulars.'],
  ['',     '/milkyway',     '11', 'The Milky Way',         'Our home galaxy. 400 billion stars, 100,000 light-years across.'],
  ['',     '/blackholes',   '12', 'Black Holes',           'The edge of physics. Sagittarius A* sits in the heart of our own galaxy.'],
  ['',     '/asteroids',    '13', 'Asteroids',             "Today's near-Earth approaches, live from NASA's NeoWs tracker."],
  ['',     '/comets',       '14', 'Comets & Meteors',      'Visitors from the outer dark. Dirty snowballs with tails light-years long.'],
  ['big',  '/simulator',    '15', 'Gravity Simulator',     'Build your own solar system. Place planets, stars, and black holes. Real Newtonian gravity in real time.'],
  ['',     '/missions',     '16', 'Missions',              'Every launch from every space agency on Earth — past and upcoming.'],
  ['',     '/agencies',     '17', 'Space Agencies',        '15 national agencies + commercial industry. Who is out there, and what they do.'],
  ['',     '/iss',          '18', 'The ISS',               'Live position of the Space Station, updated every 5 seconds.'],
  ['',     '/jwst',         '19', 'James Webb',            'The most powerful telescope ever built. Looking 13 billion years back in time.'],
  ['',     '/mars',         '20', 'Mars Rovers',           'Latest photographs from Curiosity and Perseverance.'],
  ['big',  '/telescopes',   '21', 'Telescopes & Live Feeds', '8 live streams + free observation programs + a directory of 25 major telescopes.'],
  ['',     '/archive',      '22', 'The Image Archive',     "Every spacecraft, every mission, every photograph NASA has released since 1958. Searchable."],
];

export default function Home() {
  useReveal();
  return (
    <>
      <section className="hero">
        <SolarSystemHero />
        <div className="hero-vignette"></div>
        <div className="hero-content">
          <div className="hero-headline-wrap">
            <div className="hero-eyebrow">— a complete heaven for space lovers —</div>
            <h1 className="hero-headline">Aether</h1>
            <p className="hero-sub">Eight worlds. One star. Two trillion galaxies. Drift through what we have learned to see — drawn live, in real time, from NASA, SpaceX, ESA, JAXA, ISRO, and the great observatories of Earth.</p>
          </div>
          <div className="hero-cue">
            <div>drag · scroll · explore</div>
            <div className="scroll-cue"><div>scroll</div><div className="scroll-bar"></div></div>
          </div>
        </div>
      </section>

      <section className="gateway">
        <div className="gateway-header reveal">
          <div className="gateway-kicker">A complete heaven for space lovers</div>
          <h2 className="gateway-title">Where would you like to go?</h2>
          <p className="gateway-sub">Aether is a series of rooms, each dedicated to a different corner of the universe. Pick one to step inside.</p>
        </div>
        <div className="gateway-grid">
          {CARDS.map(([size, to, num, name, desc]) => (
            <Link key={to} to={to} className={`gw-card ${size} reveal`}>
              <div className="gw-num">{num}</div>
              <h3 className="gw-name">{name}</h3>
              <p className="gw-desc">{desc}</p>
              <span className="gw-arrow">Enter →</span>
            </Link>
          ))}
        </div>
      </section>

      <TonightSky />
      <section className="movement" id="today">
        <header className="movement-header reveal">
          <div className="movement-num"><em>·</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Today · Picture of the Day</div>
            <h2 className="movement-title">Picture of the Day</h2>
            <p className="movement-sub">Each morning, NASA chooses a single window into the universe — a place to dwell on for twenty-four hours before the sky turns again.</p>
          </div>
        </header>
        <ApodCard />
      </section>
    </>
  );
}
