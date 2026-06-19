import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';
import { api } from '../lib/api.js';

export default function JwstFeed() {
  useReveal();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.jwstImages()
      .then(d => setItems(d.items || []))
      .catch(e => setError(e.message || 'Failed to load'));
  }, []);

  return (
    <>
      <PageHero
        kicker="Live"
        title="JWST Image Releases"
        sub="The 40 newest publicly-released James Webb Space Telescope images, fresh from the NASA Image Library. Click any to see it full-size."
      />

      {error && (
        <section className="movement">
          <p className="planet-desc-body reveal" style={{ color: '#ff8b6a' }}>
            Couldn't load JWST feed: {error}
          </p>
        </section>
      )}

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">✦</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Newest first</div>
            <h2 className="movement-title">{items ? `${items.length} releases` : 'Loading…'}</h2>
          </div>
        </header>

        <div className="jwst-feed reveal">
          {items && items.map(it => (
            <article key={it.nasa_id} className="jwst-tile" onClick={() => setSelected(it)}>
              <img src={it.src} alt={it.title} loading="lazy" />
              <div className="jwst-tile-meta">
                <div className="jwst-tile-date">{it.date ? new Date(it.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</div>
                <h3 className="jwst-tile-title">{it.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selected && (
        <div className="jwst-modal" onClick={() => setSelected(null)}>
          <button className="jwst-modal-close" onClick={() => setSelected(null)}>×</button>
          <div className="jwst-modal-inner" onClick={e => e.stopPropagation()}>
            <img src={selected.src} alt={selected.title} />
            <div className="jwst-modal-body">
              <div className="jwst-modal-date">{selected.date ? new Date(selected.date).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</div>
              <h2 className="jwst-modal-title">{selected.title}</h2>
              <p className="jwst-modal-desc">{selected.desc}</p>
              <a href={selected.src} target="_blank" rel="noopener noreferrer" className="jwst-modal-link">Open full resolution ↗</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
