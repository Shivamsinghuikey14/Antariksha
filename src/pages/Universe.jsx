import PageHero from '../components/ui/PageHero.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import { useReveal } from '../lib/useReveal.js';
import HubCards from '../components/ui/HubCards.jsx';

const STATS = [
  ['Age of the universe', '13.787 billion years'],
  ['Observable diameter', '~93 billion light-years'],
  ['Total mass-energy', '~1.5 × 10⁵³ kg'],
  ['Composition · dark energy', '~68%'],
  ['Composition · dark matter', '~27%'],
  ['Composition · ordinary matter', '~5%'],
  ['Galaxies (observable)', '~2 trillion'],
  ['Stars in Milky Way', '~400 billion'],
  ['Stars in observable universe', '~2 × 10²³'],
  ['Expansion rate (H₀)', '~67 km/s/Mpc'],
  ['CMB temperature', '2.725 K (-270.42 °C)'],
  ['First galaxy seen', 'JADES-GS-z14-0 · ~290 Myr after Big Bang'],
];

const DARK = [
  ['Dark Matter', "27% of the universe. We see its gravity — galaxies spin too fast for their visible mass; gravitational lensing reveals invisible matter — but we have never directly detected it."],
  ['Dark Energy', "68% of the universe. A mysterious energy permeating empty space, accelerating cosmic expansion. Discovered in 1998 (2011 Nobel Prize). We have no idea what it is."],
  ['Inflation', "In the first 10⁻³² seconds, the universe expanded by a factor of 10²⁶. We can see its fingerprints in the CMB, but the mechanism — the 'inflaton field' — remains theoretical."],
  ['The Hubble Tension', "Different ways of measuring the universe's expansion give different answers — and the disagreement is now statistically significant."],
  ['Matter–Antimatter Asymmetry', "The Big Bang should have created equal amounts of matter and antimatter. They should have annihilated. Yet here you are."],
  ['The Fate of the Universe', "Heat death? Big Rip? Big Crunch? All depend on the behaviour of dark energy. The most likely current answer is 'eternal expansion into an empty, cold, dark forever.'"],
];

const TIMELINE = [
  ['t=0', 'Big Bang. The universe begins.'],
  ['10⁻³²s', 'Inflation ends. The universe has expanded by 10²⁶.'],
  ['1 sec', 'Protons and neutrons form.'],
  ['3 min', 'Nucleosynthesis. Hydrogen, helium, and trace lithium nuclei form.'],
  ['380 kyr', 'Recombination. Electrons bind to nuclei. The universe becomes transparent. The CMB is released.'],
  ['~100 Myr', 'First stars ignite. The "cosmic dawn".'],
  ['~400 Myr', 'First galaxies. Webb has seen them.'],
  ['9.2 Gyr', 'The solar system forms.'],
  ['9.4 Gyr', 'Life appears on Earth.'],
  ['13.787 Gyr', 'Now.'],
  ['+5 Gyr', 'Sun becomes a red giant. Earth scorched.'],
  ['~10¹⁰⁰ y', 'Heat death — the last black holes evaporate.'],
];

export default function Universe() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Cosmology"
        title="The Universe"
        sub="Where we came from. How big it is. What it is made of. And what we still do not understand."
      />

      <HubCards
        kicker="Browse"
        title="Explore the Deep Sky"
        items={[
        ['/stars', '★', 'Stars', 'The brightest, biggest, nearest — full catalogue with imagery.'],
        ['/constellations', '✦', 'Constellations', 'All 88 IAU patterns, by hemisphere and mythological family.'],
        ['/nebulae', '∝', 'Nebulae', 'Star nurseries and graves — emission, planetary, supernova remnants.'],
        ['/galaxies', '◯', 'Galaxies', 'Andromeda, Sombrero, Whirlpool, M87 and beyond.'],
        ['/milkyway', '⊙', 'The Milky Way', 'Our home galaxy — structure, position, fate.'],
        ['/blackholes', '●', 'Black Holes', 'Sgr A*, M87*, TON 618 — the edge of physics.'],
        ['/skymap', '⊕', 'Interactive Sky Map', 'Aladin Lite — pan, zoom, click any object to identify.']
      ]}
      />


      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>∞</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Numbers</div>
            <h2 className="movement-title">The Universe in Numbers</h2>
          </div>
        </header>
        <div className="planet-stats-grid reveal">
          {STATS.map(([k, v]) => (
            <div key={k} className="ps-cell"><div className="ps-label">{k}</div><div className="ps-value">{v}</div></div>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>1</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Origin</div>
            <h2 className="movement-title">The Big Bang</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">Thirteen point eight billion years ago, the universe was hotter and denser than it has ever been since. Not in any one place — <em>everywhere</em>. All of space — all the space there would ever be — was concentrated into a state we cannot quite describe. And then it began to expand.</p>
          <p className="planet-desc-body">In the first second, it cooled enough for protons and neutrons to form. Within minutes, hydrogen and helium nuclei. For 380,000 years, the universe was an opaque plasma — and then it cooled enough for electrons to bind to nuclei, light could finally travel freely, and the first photons set out across a transparent cosmos. We can still see those photons today, redshifted into microwaves, in every direction: the Cosmic Microwave Background. It is the oldest light there is.</p>
          <p className="planet-desc-body">Gravity gathered hydrogen and helium into the first stars; the first stars died and seeded the universe with the heavier elements. Gravity gathered the stars into galaxies, the galaxies into clusters, and dark matter built the cosmic web on which all of it hangs. You are a recent development.</p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>?</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">The Dark Sector</div>
            <h2 className="movement-title">What We Don't Understand</h2>
          </div>
        </header>
        <div className="nebula-types reveal">
          {DARK.map(([h, p]) => (
            <div key={h} className="nt-card"><h3>{h}</h3><p>{p}</p></div>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>+</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">A Brief Timeline</div>
            <h2 className="movement-title">Everything That Has Happened</h2>
          </div>
        </header>
        <div className="planet-facts reveal" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <ul className="fact-list">
            {TIMELINE.map(([t, e], i) => (
              <li key={i}><span className="fact-num">{t}</span><span className="fact-text">{e}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery</div>
            <h2 className="movement-title">Looking at the Universe</h2>
          </div>
        </header>
        <TopicGallery query="cosmic microwave background" limit={14} />
      </section>
    </>
  );
}
