import PageHero from '../components/ui/PageHero.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import { useReveal } from '../lib/useReveal.js';

const TYPES = [
  ['Emission Nebulae', "Clouds of ionised gas that glow in their own light, energised by hot young stars within or nearby. The Orion Nebula and the Eagle Nebula are classic examples."],
  ['Reflection Nebulae', "Dust clouds that don't emit their own light but reflect the light of nearby stars. Often blue, because dust scatters blue light more efficiently than red."],
  ['Dark Nebulae', "Dense clouds so thick they block the light of stars behind them, appearing as silhouettes against brighter backgrounds. The Horsehead and Coalsack are famous examples."],
  ['Planetary Nebulae', "The expanding outer shells of dying sun-like stars. Misleadingly named — they have nothing to do with planets. The Ring Nebula and the Cat's Eye are gorgeous specimens."],
  ['Supernova Remnants', "The expanding debris of exploded massive stars. The Crab Nebula is the remnant of a supernova witnessed by Chinese astronomers in 1054 AD."],
];

export default function Nebulae() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Deep Sky"
        title="Nebulae"
        sub="Vast clouds of gas and dust, light-years across. Some are stellar nurseries. Some are graves. All of them are how the universe paints."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">Five Kinds of Cloud</h2>
          </div>
        </header>
        <div className="nebula-types reveal">
          {TYPES.map(([h, p]) => (
            <div key={h} className="nt-card"><h3>{h}</h3><p>{p}</p></div>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery · NASA</div>
            <h2 className="movement-title">A Gallery</h2>
          </div>
        </header>
        <TopicGallery query="nebula" limit={16} />
      </section>
    </>
  );
}
