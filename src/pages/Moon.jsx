import PageHero from '../components/ui/PageHero.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import { useReveal } from '../lib/useReveal.js';

const STATS = [
  ['Mean radius', '1,737 km'],
  ['Mass', '7.34 × 10²² kg (0.012 Earths)'],
  ['Surface gravity', '1.62 m/s² (0.17 g)'],
  ['Day length', '29.5 Earth days'],
  ['Orbital period', '27.3 days'],
  ['Distance from Earth', '384,400 km (1.28 light-seconds)'],
  ['Atmosphere', 'Effectively none — exosphere'],
  ['Temperature', '-173 °C to 127 °C'],
  ['Age', '~4.51 billion years'],
  ['Human visitors', '12 (Apollo 11-17)'],
];

const FACTS = [
  ['01', 'The Moon is drifting away from Earth at 3.8 cm per year. In 600 million years, total solar eclipses will be impossible.'],
  ['02', 'The same hemisphere always faces Earth, because the Moon\'s rotation is tidally locked to its orbit.'],
  ['03', 'A handful of Moon rocks brought back by Apollo astronauts are still being studied today, revealing new things about the early solar system.'],
  ['04', 'The Moon almost certainly formed from a giant impact 4.5 billion years ago, when a Mars-sized body (Theia) struck the proto-Earth.'],
  ['05', 'Permanently shadowed craters at the lunar poles contain water ice — a critical resource for future bases.'],
];

export default function Moon() {
  useReveal();
  return (
    <>
      <PageHero kicker="The Companion" title="The Moon" sub="Our pale, dusty neighbour. Twelve human beings have walked on it. None for fifty years — though that is about to change." />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">Earth's Companion</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">The Moon is unusually large for a body orbiting a planet our size — proportionally, the largest moon in the solar system relative to its parent. We believe it was born from violence: 4.5 billion years ago, a Mars-sized body called Theia collided with the proto-Earth, and the debris coalesced into the Moon we see today.</p>
          <p className="planet-desc-body">Its gravity keeps Earth's axial tilt stable, giving us reliable seasons. Its tides shape our oceans and may have been essential to the emergence of life. And for half a million years, our ancestors have looked up at it.</p>
        </div>
        <div className="planet-stats-grid reveal">
          {STATS.map(([k, v]) => (
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
            {FACTS.map(([num, text]) => (
              <li key={num}><span className="fact-num">{num}</span><span className="fact-text">{text}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery</div>
            <h2 className="movement-title">The Moon in Photographs</h2>
          </div>
        </header>
        <TopicGallery query="moon lunar surface" limit={12} />
      </section>
    </>
  );
}
