import { useEffect, useRef, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';

const STAGES = [
  {
    distance: '1 light-year out',
    title: 'You see the void',
    text: "From a light-year away, the black hole looks like nothing at all — a perfect circle of dark, surrounded by a thin halo of distorted starlight bent around its mass. It is silent. There is no warning of what comes next.",
  },
  {
    distance: '100,000 km out',
    title: 'The Einstein ring',
    text: "Light from stars behind the hole curves around it and reaches your eyes from every direction simultaneously. A bright ring of duplicated images forms a halo. You are still falling at thousands of kilometres per second, but it feels like floating.",
  },
  {
    distance: 'Photon sphere — 1.5× the Schwarzschild radius',
    title: 'Light goes in circles',
    text: "Here gravity is so strong that photons travel in closed orbits around the hole. If you turned a torch outward at exactly this radius, the light would come back and hit you on the back of the head a few microseconds later. Behind you, the universe shrinks into a bright disk overhead. Ahead, only darkness.",
  },
  {
    distance: 'Event horizon — Schwarzschild radius',
    title: 'The point of no return',
    text: "You cross the boundary without feeling it — there is no plaque, no jolt. For a stellar-mass black hole, this happens at about 30 km from the centre. From outside, no signal can ever escape past this radius, which is why we call it a black hole. From inside, you have hours or seconds depending on the hole's mass.",
  },
  {
    distance: 'Tidal forces rising',
    title: 'Spaghettification begins',
    text: "Your feet are now closer to the singularity than your head, and the difference in gravity between them is enormous. Your body stretches into a thin string of atoms, then into a single chain of nuclei. For a stellar-mass hole this happens before you even reach the horizon. For a supermassive hole — like the one at our galactic centre — the tidal forces are gentler and you would survive crossing the horizon, but only briefly.",
  },
  {
    distance: 'r = 0',
    title: 'The singularity',
    text: "All paths converge here. According to general relativity, density becomes infinite and the equations break. We do not believe nature actually achieves infinity — quantum gravity should take over at the Planck scale — but we have no working theory of what happens next. From the outside, no one ever sees you arrive. To them, you appear frozen at the horizon, redshifted into invisibility, taking forever to fall but never quite arriving. From your perspective, the journey is over in an eyeblink.",
  },
];

export default function BlackHoleFall() {
  const containerRef = useRef(null);
  const [stage, setStage] = useState(0);

  // Track scroll position to advance stages
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / total));
      const idx = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length));
      setStage(idx);
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <PageHero
        kicker="Thought Experiment"
        title="Falling Into a Black Hole"
        sub="Scroll. Slowly. Six stages of a one-way trip nobody has ever taken — but general relativity tells us exactly what would happen."
      />

      <div className="bhf-container" ref={containerRef}>
        {/* Sticky visualization on the left */}
        <div className="bhf-viz">
          <div className="bhf-stars" style={{ opacity: 1 - stage * 0.15 }}></div>
          <div className="bhf-ring" style={{
            transform: `scale(${1 + stage * 0.6}) rotate(${stage * 8}deg)`,
            opacity: stage < 5 ? 1 : 0,
          }}></div>
          <div className="bhf-hole" style={{
            transform: `scale(${1 + stage * 1.5})`,
            boxShadow: stage >= 2 ? `0 0 ${50 + stage * 30}px rgba(255, 180, 100, 0.${stage * 2})` : 'none',
          }}></div>
          {stage >= 4 && (
            <div className="bhf-tidal" style={{ transform: `scaleY(${1 + (stage - 3) * 2})` }}></div>
          )}
          <div className="bhf-stage-counter">
            <div className="bhf-counter-num">{stage + 1} / {STAGES.length}</div>
            <div className="bhf-counter-dist">{STAGES[stage].distance}</div>
          </div>
        </div>

        {/* Scrollable story on the right */}
        <div className="bhf-story">
          {STAGES.map((s, i) => (
            <div key={i} className={`bhf-stage ${i === stage ? 'active' : ''}`}>
              <div className="bhf-stage-num">Stage {i + 1}</div>
              <h2 className="bhf-stage-title">{s.title}</h2>
              <p className="bhf-stage-text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="movement">
        <header className="movement-header">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">The Maths</div>
            <h2 className="movement-title">The numbers behind it</h2>
          </div>
        </header>
        <div className="planet-description">
          <p className="planet-desc-body">A black hole's event horizon — the Schwarzschild radius — depends only on mass: <strong>r<sub>s</sub> = 2GM/c²</strong>. For a hole the mass of the Sun, that is 3 km. For Sagittarius A*, the supermassive hole at the centre of the Milky Way (~4 million solar masses), it is 12 million km — about 17 times the Sun's diameter. You could survive crossing it.</p>
          <p className="planet-desc-body">The maximum proper time you have between crossing the horizon and hitting the singularity also depends on mass alone: <strong>τ = πGM/c³</strong>. For Sgr A* this works out to about 64 seconds. For a stellar-mass hole, a few microseconds. There is no acceleration you can apply, no fuel you can burn, that will save you.</p>
        </div>
      </section>
    </>
  );
}
