import { useEffect, useRef, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';

const PRESETS = [
  { name: 'M31 — Andromeda Galaxy',       target: 'M31',  fov: 2.5 },
  { name: 'Orion Nebula (M42)',           target: 'M42',  fov: 1.5 },
  { name: 'Pleiades (M45)',               target: 'M45',  fov: 2 },
  { name: 'Crab Nebula (M1)',             target: 'M1',   fov: 0.5 },
  { name: 'Whirlpool Galaxy (M51)',       target: 'M51',  fov: 0.5 },
  { name: 'Centre of the Milky Way',      target: 'Sgr A*', fov: 8 },
  { name: 'Eagle Nebula (M16)',           target: 'M16',  fov: 0.8 },
  { name: 'Ring Nebula (M57)',            target: 'M57',  fov: 0.3 },
  { name: 'Hubble Deep Field',            target: '12 36 49.4 +62 12 58', fov: 0.1 },
  { name: 'Saturn Nebula (NGC 7009)',     target: 'NGC 7009', fov: 0.2 },
];

export default function SkyMap() {
  useReveal();
  const [preset, setPreset] = useState(PRESETS[0]);
  const iframeRef = useRef(null);

  const src = `https://aladin.cds.unistra.fr/AladinLite/?target=${encodeURIComponent(preset.target)}&fov=${preset.fov}&survey=P%2FDSS2%2Fcolor`;

  return (
    <>
      <PageHero
        kicker="Tools"
        title="Interactive Sky Map"
        sub="Pan, zoom and explore the entire sky. Click any star or galaxy to identify it. Powered by Aladin Lite from CDS Strasbourg — free and open."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">⊕</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Now Viewing</div>
            <h2 className="movement-title">{preset.name}</h2>
            <p className="movement-sub">Drag to pan · scroll to zoom · click an object for its catalogue identifier</p>
          </div>
        </header>

        <div className="chip-row reveal">
          {PRESETS.map(p => (
            <button key={p.name}
              className={`chip ${p.target === preset.target ? 'active' : ''}`}
              onClick={() => setPreset(p)}>
              {p.name}
            </button>
          ))}
        </div>

        <div className="skymap-frame reveal">
          <iframe
            ref={iframeRef}
            key={preset.target}
            src={src}
            title="Aladin Lite — sky map"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="fullscreen"
          />
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">About</div>
            <h2 className="movement-title">What you're looking at</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">Aladin Lite is a sky atlas developed at the Centre de Données astronomiques de Strasbourg (CDS), France. It overlays sky-survey imagery from the Digitised Sky Survey, 2MASS, GALEX, and many other catalogues. Click anywhere to query SIMBAD, NED, or VizieR for what's at that location.</p>
          <p className="planet-desc-body">Free, no registration, available worldwide. <a href="https://aladin.cds.unistra.fr/AladinLite/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>Open full version ↗</a></p>
        </div>
      </section>
    </>
  );
}
