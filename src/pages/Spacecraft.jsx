import { useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import LazyImage from '../components/ui/LazyImage.jsx';
import { useReveal } from '../lib/useReveal.js';
import { SPACECRAFT } from '../data/spacecraft.js';

const ERAS = ['All', 'Pioneering', 'Outer planets', 'Observatories', 'Mars rovers', 'Modern explorers', 'Living spacecraft'];

export default function Spacecraft() {
  useReveal();
  const [era, setEra] = useState('All');

  const filtered = era === 'All' ? SPACECRAFT : SPACECRAFT.filter(s => s.era === era);

  return (
    <>
      <PageHero
        kicker="Discoveries"
        title="Spacecraft & Missions"
        sub="Sixty-eight years of robotic exploration. The probes, telescopes, rovers and landers that have carried us across the solar system and back."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">How We Got Here</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">In October 1957, the Soviet Union launched a 58-centimetre aluminium ball that beeped at radio operators for three weeks. By 1969, twelve human beings had walked on another world. By the 2010s, robots had stood on Mars, swum past Pluto, and brought home grains of asteroid dust older than the Sun.</p>
          <p className="planet-desc-body">What follows is a curated tour of the spacecraft that have done the most to expand what we know about our solar system, the stars, and ourselves. The earliest entries are silent now — Pioneer 10 went dark in 2003, Pioneer 11 in 1995 — but their hardware still flies, carrying messages we have addressed to whoever may find them.</p>
          <p className="planet-desc-body">Two Voyagers, launched within weeks of each other in 1977, are still operational. They left the Sun's influence and entered interstellar space in 2012 and 2018 respectively. The signal they send takes more than 22 hours to reach Earth, even at the speed of light.</p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>+</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Catalogue</div>
            <h2 className="movement-title">Browse by Era</h2>
            <p className="movement-sub">{filtered.length} spacecraft</p>
          </div>
        </header>

        <div className="chip-row reveal">
          {ERAS.map(e => (
            <button key={e}
              className={`chip ${era === e ? 'active' : ''}`}
              onClick={() => setEra(e)}>
              {e}
            </button>
          ))}
        </div>

        <div className="spacecraft-grid reveal">
          {filtered.map(s => (
            <article key={s.name} className="spacecraft-card">
              <LazyImage query={s.image} alt={s.name} aspectRatio="16/10" className="spacecraft-img" />
              <div className="spacecraft-body">
                <div className="sc-header">
                  <div className="sc-h-left">
                    <div className="sc-agency">{s.agency} · launched {s.launched}</div>
                    <h3 className="sc-name">{s.name}</h3>
                    <div className="sc-target">→ {s.target}</div>
                  </div>
                </div>
                <div className={`sc-status ${typeof s.status === 'string' && s.status.startsWith('OPERATIONAL') ? 'live' : ''}`}>
                  {s.status}
                </div>
                <div className="sc-tagline">— {s.tagline}</div>
                <p className="sc-detail">{s.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
