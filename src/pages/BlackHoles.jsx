import PageHero from '../components/ui/PageHero.jsx';
import LazyImage from '../components/ui/LazyImage.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import { useReveal } from '../lib/useReveal.js';

const KINDS = [
  ['Stellar-mass black holes', "Form when massive stars (>20 solar masses) collapse at the end of their lives. Typically 5-30 solar masses. Hundreds of millions exist in the Milky Way."],
  ['Supermassive black holes', "Millions to billions of solar masses. Sit at the centre of nearly every large galaxy. How they got so big, so early, is one of cosmology's open questions."],
  ['Intermediate-mass black holes', "100 to 100,000 solar masses. The 'missing link' — recently confirmed to exist, but rare."],
  ['Primordial black holes', "Hypothetical relics from the very early universe. Could potentially explain dark matter, though none have been confirmed."],
];

const FAMOUS = [
  ['Sagittarius A*', '4.3 million ☉', "The supermassive black hole at the centre of our own galaxy. The Event Horizon Telescope imaged it in 2022."],
  ['M87*', '6.5 billion ☉', "The supermassive black hole at the centre of galaxy M87. The first black hole ever directly imaged (EHT, 2019)."],
  ['Cygnus X-1', '~21 ☉', "The first object identified as a black hole. Discovered in 1964 by X-ray emission as it consumes material from a companion star."],
  ['TON 618', '40-66 billion ☉', "One of the most massive black holes known — 11 times more massive than the one in M87, and possibly the largest ever found."],
];

export default function BlackHoles() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Singularities"
        title="Black Holes"
        sub="Regions of spacetime where gravity is so extreme that not even light can escape."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">The Edge of Physics</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">A black hole is a region where matter has collapsed past a critical density and gravity becomes so extreme that nothing — not even light — can escape from within a boundary called the event horizon. Beyond it, our understanding of physics breaks down: general relativity predicts a singularity of infinite density, but quantum mechanics insists this cannot be.</p>
          <p className="planet-desc-body">Black holes were predicted by Einstein's general relativity in 1915, and the first solution describing one was found by Karl Schwarzschild months later, while serving on the Russian front in WWI. For decades they were thought to be a mathematical curiosity. Now we see them everywhere — and have photographed two of them.</p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>+</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Types</div>
            <h2 className="movement-title">Four Sizes</h2>
          </div>
        </header>
        <div className="nebula-types reveal">
          {KINDS.map(([h, p]) => (
            <div key={h} className="nt-card"><h3>{h}</h3><p>{p}</p></div>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>★</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Famous Black Holes</div>
            <h2 className="movement-title">The Ones We Have Met</h2>
          </div>
        </header>
        <div className="moons-grid reveal">
          {FAMOUS.map(([name, mass, desc]) => (
            <article key={name} className="moon-card has-image">
              <LazyImage query={`${name} black hole`} alt={name} aspectRatio="16/9" />
              <div className="moon-card-body">
                <div className="moon-card-h">
                  <h3 className="moon-name">{name}</h3>
                  <div className="moon-diameter">{mass}</div>
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
            <div className="movement-kicker">EHT Imagery</div>
            <h2 className="movement-title">Black Holes in Photographs</h2>
          </div>
        </header>
        <TopicGallery query="black hole event horizon" limit={14} />
      </section>
    </>
  );
}
