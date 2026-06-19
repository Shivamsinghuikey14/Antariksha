import PageHero from '../components/ui/PageHero.jsx';
import GravitySim from '../components/widgets/GravitySim.jsx';
import { useReveal } from '../lib/useReveal.js';
import HubCards from '../components/ui/HubCards.jsx';

export default function Simulator() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Sandbox"
        title="Gravity Simulator"
        sub="Place stars, planets, black holes. Watch them dance — or destroy each other. Real Newtonian gravity, in real time."
      />

      <HubCards
        kicker="Browse"
        title="More Tools"
        items={[
        ['/cosmic-calendar', '⌘', 'Cosmic Calendar', '13.8 billion years compressed into one year — Carl Sagan style.'],
        ['/archive', '🔍', 'NASA Image Archive', "Search NASA's full library of imagery and footage."]
      ]}
      />


      <GravitySim />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">How it works</div>
            <h2 className="movement-title">Newton's Universe in a Box</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">Every body attracts every other body with a force proportional to the product of their masses and inversely proportional to the square of the distance between them — Newton's law of universal gravitation, F = G·m₁·m₂/r². The simulator integrates these forces forty times per second using a velocity-Verlet scheme: stable, energy-conserving, and accurate enough to keep a stable binary running indefinitely.</p>
          <p className="planet-desc-body">Try the three-body scenario. Henri Poincaré proved in 1887 that the motion of three gravitating bodies has no general closed-form solution — it is a deterministic system, but its long-term behaviour is chaotic. Watch and you will see.</p>
        </div>
      </section>
    </>
  );
}
