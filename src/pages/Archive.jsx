import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';
import { useLightbox } from '../components/ui/Lightbox.jsx';
import { api } from '../lib/api.js';

const HINTS = [
  'apollo','mars','jupiter','saturn','nebula','galaxy',
  'voyager','hubble','iss','cassini','curiosity','europa',
  'webb','aurora','milky way','black hole','andromeda','crab nebula',
];

export default function Archive() {
  useReveal();
  const [query, setQuery] = useState('hubble');
  const [input, setInput] = useState('hubble');
  const [items, setItems] = useState(null);
  const [err, setErr]     = useState(null);
  const { openLightbox }  = useLightbox();

  useEffect(() => {
    setItems(null);
    setErr(null);
    api.library(query, 30)
      .then(d => setItems(d.items || []))
      .catch(e => setErr(e.message));
  }, [query]);

  const submit = e => {
    e.preventDefault();
    if (input.trim()) setQuery(input.trim());
  };

  return (
    <>
      <PageHero
        kicker="Library"
        title="Every Photograph"
        sub="Every spacecraft, every mission, every photograph NASA has released since 1958. Search the archive."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>🔍</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Search</div>
            <h2 className="movement-title">What would you like to see?</h2>
          </div>
        </header>

        <form className="search-form reveal" onSubmit={submit}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Search NASA's image library — Hubble, Mars, Saturn, Apollo, supernova…"
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="search-hint reveal">
          <em>or try:</em>
          {HINTS.map(h => (
            <span key={h} onClick={() => { setInput(h); setQuery(h); }}>{h}</span>
          ))}
        </div>

        <div className="library-results reveal">
          {err && <div className="error">// Archive unavailable — {err}</div>}
          {!err && !items && <div className="loading">Searching NASA archive…</div>}
          {items?.length === 0 && <div className="empty">No results for "{query}". Try a different search term.</div>}
          {items?.map((it, i) => (
            <article
              key={i}
              className="library-card"
              onClick={() => openLightbox(it.src, it.title)}
            >
              <img src={it.src} alt={it.title} loading="lazy" />
              <div className="library-meta">
                <h4 className="library-title">{it.title}</h4>
                {it.date && <div className="library-date">{new Date(it.date).getFullYear()}</div>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
