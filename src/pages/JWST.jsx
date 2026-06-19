import PageHero from '../components/ui/PageHero.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import { useReveal } from '../lib/useReveal.js';

const STATS = [
  ['Launched',                 '25 Dec 2021 · Ariane 5'],
  ['Operational since',        '12 Jul 2023 (first images)'],
  ['Primary mirror diameter',  '6.5 m'],
  ['Wavelength range',         '0.6 µm to 28 µm (infrared)'],
  ['Orbit',                    'L2 Sun-Earth Lagrange point'],
  ['Distance from Earth',      '~1.5 million km'],
  ['Operating temperature',    '~50 K (-223 °C)'],
  ['Mission duration',         'Designed 10 yr, fuel for ~20+'],
  ['Cost',                     '~$10 billion'],
  ['Predecessor',              'Hubble Space Telescope'],
];

export default function JWST() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Webb"
        title="James Webb Space Telescope"
        sub="The largest, most powerful, and most expensive scientific instrument ever placed in orbit. It is seeing things no human has ever seen."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">An Eye in the Cold Dark</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">The James Webb Space Telescope is an infrared observatory the size of a tennis court. Its 6.5-metre golden primary mirror — six times the area of Hubble's — is composed of 18 hexagonal beryllium segments that unfolded after launch like the petals of a flower. Beneath it, a five-layer sunshield the size of a tennis court keeps the optics at a frigid 50 kelvin, cold enough to see the faint infrared glow of the most distant galaxies.</p>
          <p className="planet-desc-body">Webb was 25 years in development, a billion dollars over its original budget, and almost cancelled half a dozen times. Then on Christmas morning 2021, an Ariane 5 rocket launched it perfectly from French Guiana. Over the next month, every one of 344 potential single-point failures executed flawlessly. Webb deployed itself a million miles from Earth, opened its mirror and sunshield, and began to cool.</p>
          <p className="planet-desc-body">In July 2022, the first images arrived. The universe — already inconceivably old — turned out to be even older and stranger than we knew. Galaxies in the first 300 million years after the Big Bang. Atmospheres on exoplanets light-years away. The clearest pictures of star formation ever captured. Pillars and pinwheels and clouds we had only seen the silhouettes of before.</p>
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
            <div className="movement-kicker">Imagery · STScI</div>
            <h2 className="movement-title">What Webb Has Seen</h2>
            <p className="movement-sub">The first images, the deepest looks, the most extraordinary discoveries — all from a telescope a million miles from home.</p>
          </div>
        </header>
        <TopicGallery query="james webb space telescope" limit={16} />
      </section>
    </>
  );
}
