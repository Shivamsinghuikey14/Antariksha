import PageHero from '../components/ui/PageHero.jsx';
import MilkyWay3D from '../components/three/MilkyWay3D.jsx';
import { useReveal } from '../lib/useReveal.js';

export default function Galaxy3D() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Live · 3D"
        title="The Milky Way in 3D"
        sub="Our home galaxy, 40,000 procedural stars in a four-arm logarithmic spiral. Drag to rotate. Scroll to zoom. The gold marker is the Sun, 26,000 light-years from the centre."
      />

      <div className="mw3d-stage reveal">
        <MilkyWay3D />
      </div>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Our address</div>
            <h2 className="movement-title">Where exactly are we?</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">The Sun sits in a minor spiral arm called the <strong>Orion Arm</strong> (or Local Arm), midway between the larger Sagittarius and Perseus arms. Our distance from the galactic centre is roughly <strong>26,000 light-years</strong>. We orbit Sagittarius A* — the supermassive black hole at the centre, 4 million solar masses — at about <strong>230 km/s</strong>, completing one revolution every <strong>230 million years</strong>. The Sun has made roughly 20 such laps since it formed.</p>
          <p className="planet-desc-body">The Milky Way is a barred spiral galaxy with four main arms, around 100,000 light-years across and only 1,000 ly thick at the disk. It contains 100-400 billion stars and is currently being eaten by — and merging with — several smaller satellite galaxies. In about 4.5 billion years it will collide with Andromeda. The resulting galaxy has already been named: <em>Milkomeda</em>.</p>
        </div>
      </section>
    </>
  );
}
