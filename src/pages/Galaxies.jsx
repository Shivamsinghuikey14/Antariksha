import PageHero from '../components/ui/PageHero.jsx';
import LazyImage from '../components/ui/LazyImage.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import { useReveal } from '../lib/useReveal.js';

const FAMOUS = [
  ['Andromeda (M31)', '2.5 million ly', "Our nearest large galactic neighbour, on a collision course with the Milky Way. They will merge in about 4.5 billion years to form a new elliptical galaxy."],
  ['Sombrero (M104)', '29 million ly', "An almost edge-on spiral with a brilliant white nucleus and a dramatic dust lane that gives it its hat-like appearance."],
  ['Whirlpool (M51)', '23 million ly', "A face-on spiral galaxy in the act of cannibalising a smaller companion. Charles Messier catalogued it in 1773."],
  ['M87', '53.5 million ly', "A giant elliptical with a supermassive black hole 6.5 billion times the mass of the Sun. The first black hole ever directly imaged (EHT, 2019)."],
  ['Large Magellanic Cloud', '163,000 ly', "A satellite galaxy of the Milky Way, visible to the naked eye from the southern hemisphere. Host to R136a1, the most massive known star."],
  ['IC 1101', '~1 billion ly', "One of the largest known galaxies — roughly 4 million light-years across, with perhaps 100 trillion stars."],
];

export default function Galaxies() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Galaxies"
        title="Galaxies"
        sub="A galaxy is a hundred billion suns held together by gravity. The observable universe contains roughly two trillion of them."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">Islands of Stars</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">Until the 1920s, we thought the Milky Way was the entire universe — all those fuzzy patches in the sky were just nearby nebulae. Then Edwin Hubble measured the distance to Andromeda and proved it was a whole other galaxy, two and a half million light-years away. The universe became unimaginably larger overnight.</p>
          <p className="planet-desc-body">Galaxies come in three main shapes: spirals (like our Milky Way) with elegant rotating arms; ellipticals which are vast featureless balls of mostly old stars; and irregulars, which are everything else. Almost every large galaxy has a supermassive black hole at its centre, and most are clustered together into groups, clusters, and superclusters connected by an enormous cosmic web of dark matter.</p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>+</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Famous Galaxies</div>
            <h2 className="movement-title">A Handful Worth Knowing</h2>
          </div>
        </header>
        <div className="moons-grid reveal">
          {FAMOUS.map(([name, dist, desc]) => (
            <article key={name} className="moon-card has-image">
              <LazyImage query={`${name} galaxy`} alt={name} aspectRatio="16/9" />
              <div className="moon-card-body">
                <div className="moon-card-h">
                  <h3 className="moon-name">{name}</h3>
                  <div className="moon-diameter">{dist}</div>
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
            <h2 className="movement-title">Gallery</h2>
          </div>
        </header>
        <TopicGallery query="galaxy hubble" limit={14} />
      </section>
    </>
  );
}
