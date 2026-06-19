import PageHero from '../components/ui/PageHero.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import { useReveal } from '../lib/useReveal.js';

const STATS = [
  ['Type', 'Barred spiral'],
  ['Diameter', '~100,000 light-years'],
  ['Thickness (disk)', '~1,000 ly'],
  ['Stars', '~400 billion'],
  ['Mass (total)', '~1.5 trillion ☉'],
  ['Age', '~13.6 billion years'],
  ['Number of arms', 'Four major + minor spurs'],
  ['Galactic centre', 'Sgr A* — supermassive black hole'],
  ['Sun\'s distance from centre', '~26,000 ly'],
  ['Sun\'s orbital period', '~230 million years'],
];

export default function MilkyWay() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Our Galaxy"
        title="The Milky Way"
        sub="A barred spiral, a hundred thousand light-years across. The Sun is one of perhaps 400 billion stars within it."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">Our Home Galaxy</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">From a dark sky, the Milky Way appears as a softly glowing band across the heavens — the collective light of billions of stars too distant to resolve, threaded with darker bands of interstellar dust. We are looking at our own galaxy from the inside, edge-on through its disk.</p>
          <p className="planet-desc-body">The Milky Way is a barred spiral galaxy with four major arms — Perseus, Sagittarius, Centaurus, and the outer Cygnus arm. Our Sun sits in a smaller offshoot called the Orion Spur, about 26,000 light-years from the centre. We complete one orbit of the galactic core every 230 million years — about 20 times since the Earth formed.</p>
          <p className="planet-desc-body">At the heart of the Milky Way is Sagittarius A*, a supermassive black hole 4.3 million times the mass of the Sun. The Event Horizon Telescope captured its first direct image in 2022. Around it, stars orbit at thousands of kilometres per second.</p>
        </div>
        <div className="planet-stats-grid reveal">
          {STATS.map(([k, v]) => (
            <div key={k} className="ps-cell"><div className="ps-label">{k}</div><div className="ps-value">{v}</div></div>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery</div>
            <h2 className="movement-title">The Milky Way in Photographs</h2>
          </div>
        </header>
        <TopicGallery query="milky way galactic center" limit={14} />
      </section>
    </>
  );
}
