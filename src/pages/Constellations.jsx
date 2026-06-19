import { useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import LazyImage from '../components/ui/LazyImage.jsx';
import { useReveal } from '../lib/useReveal.js';
import { CONSTELLATIONS_UNIQUE, FAMILIES } from '../data/constellations.js';

export default function Constellations() {
  useReveal();
  const [family,   setFamily]   = useState('all');
  const [hemi,     setHemi]     = useState('all');

  const filtered = CONSTELLATIONS_UNIQUE.filter(c => {
    if (family !== 'all' && c.family !== family) return false;
    if (hemi === 'N' && c.hemi === 'S') return false;
    if (hemi === 'S' && c.hemi === 'N') return false;
    return true;
  });

  return (
    <>
      <PageHero
        kicker="Star Patterns"
        title="The 88 Constellations"
        sub="The official IAU constellations — patterns we have drawn between the stars for forty thousand years. Each one is a story, a mythology, a map."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">Lines Between the Stars</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">A constellation is a region of the sky — an area, with boundaries — containing a recognisable pattern of stars. The International Astronomical Union officially recognises 88 of them, dividing the entire celestial sphere into 88 contiguous zones. Every star, galaxy, and visible object lies within exactly one.</p>
          <p className="planet-desc-body">Forty-eight constellations come from Ptolemy's <em>Almagest</em> (around 150 AD), which preserved the patterns of the ancient Greeks — themselves often borrowed from earlier Babylonian, Egyptian, and Mesopotamian traditions. The southern constellations, invisible from the Mediterranean, were added much later — most by Dutch navigators around 1600 and by Nicolas-Louis de Lacaille in the 1750s. The boundaries we use today were finalised in 1930 by Belgian astronomer Eugène Delporte for the IAU.</p>
          <p className="planet-desc-body">The stars in a constellation are not physically related. They are at wildly different distances and merely <em>appear</em> close from Earth's vantage point. Move to a star a thousand light-years away and every familiar pattern would dissolve.</p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>+</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Catalogue</div>
            <h2 className="movement-title">Browse all 88</h2>
          </div>
        </header>

        <div className="chip-row reveal">
          <button
            className={`chip ${family === 'all' ? 'active' : ''}`}
            onClick={() => setFamily('all')}
          >All families</button>
          {FAMILIES.map(f => (
            <button key={f}
              className={`chip ${family === f ? 'active' : ''}`}
              onClick={() => setFamily(f)}
            >{f}</button>
          ))}
        </div>
        <div className="chip-row reveal" style={{ marginBottom: '2rem' }}>
          {[['all','Both hemispheres'],['N','Northern'],['S','Southern']].map(([k, label]) => (
            <button key={k}
              className={`chip ${hemi === k ? 'active' : ''}`}
              onClick={() => setHemi(k)}
            >{label}</button>
          ))}
        </div>

        <div className="constellation-grid reveal">
          {filtered.map(c => (
            <article key={c.abbr} className="constellation-card has-image">
              <LazyImage
                query={`${c.name} constellation`}
                alt={`${c.name} constellation`}
                aspectRatio="16/9"
                className="cc-card-img"
              />
              <div className="cc-card-body">
                <div className="cc-header">
                  <div className="cc-abbr">{c.abbr}</div>
                  <div className="cc-h-main">
                    <h3 className="cc-name">{c.name}</h3>
                    <div className="cc-meaning">— {c.meaning}</div>
                  </div>
                </div>
                <div className="cc-pill-row">
                  <span className="cc-pill">{c.hemi === 'N' ? '↑ Northern' : c.hemi === 'S' ? '↓ Southern' : '◐ Both'}</span>
                  <span className="cc-pill">{c.season}</span>
                  <span className="cc-pill">{c.area} sq°</span>
                  <span className="cc-pill">{c.family}</span>
                </div>
                <div className="cc-fact">
                  <div className="cc-fact-label">Brightest star</div>
                  <div className="cc-fact-text">{c.brightest}</div>
                </div>
                <div className="cc-fact">
                  <div className="cc-fact-label">Notable object</div>
                  <div className="cc-fact-text">{c.dso}</div>
                </div>
                <p className="cc-myth">{c.mythology}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery</div>
            <h2 className="movement-title">The Sky in Photographs</h2>
          </div>
        </header>
        <TopicGallery query="constellation milky way" limit={14} />
      </section>
    </>
  );
}
