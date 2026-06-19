import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { useLightbox } from '../ui/Lightbox.jsx';

const SPANS = ['span-2-2', '', '', 'span-1-2', '', 'span-2-1', '', '', 'span-1-2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

export default function TopicGallery({ query, limit = 12 }) {
  const [items, setItems] = useState(null);
  const [err, setErr]     = useState(null);
  const { openLightbox }  = useLightbox();

  useEffect(() => {
    setItems(null);
    setErr(null);
    api.library(query, limit)
      .then(d => setItems(d.items || []))
      .catch(e => setErr(e.message));
  }, [query, limit]);

  if (err) return <div className="gallery-grid"><div className="error">// Gallery unavailable — {err}</div></div>;
  if (!items) return <div className="gallery-grid"><div className="loading">Loading</div></div>;
  if (!items.length) return <div className="gallery-grid"><div className="error">// No matches for "{query}"</div></div>;

  return (
    <div className="gallery-grid reveal">
      {items.slice(0, limit).map((it, i) => (
        <div
          key={i}
          className={`gal-card ${SPANS[i] || ''}`}
          onClick={() => openLightbox(it.src, it.title)}
        >
          <img src={it.src} alt={it.title} loading="lazy" />
          <div className="gal-overlay">{it.title}</div>
        </div>
      ))}
    </div>
  );
}
