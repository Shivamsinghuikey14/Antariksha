import { useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api.js';

/**
 * LazyImage — renders a single NASA-library image for a given query.
 *
 *  - Uses IntersectionObserver so the fetch only fires when the card is
 *    near the viewport. Critical when a page has 88 cards (constellations)
 *    or 22 cards (moons) so we never hammer the API with off-screen requests.
 *  - Caches results in a module-level Map keyed by query, so revisiting a
 *    page reuses already-fetched URLs instantly.
 *  - Coalesces concurrent requests: if two cards on the same page ask for
 *    "Europa" at once, only one HTTP request is made.
 *  - Renders a graceful placeholder while loading, and a quiet message if
 *    no image is available — never just blank.
 */

const CACHE   = new Map();   // query → resolved src URL or '__failed__'
const PENDING = new Map();   // query → in-flight Promise<src>

async function fetchOne(query) {
  if (CACHE.has(query)) {
    const v = CACHE.get(query);
    if (v === '__failed__') throw new Error('no image');
    return v;
  }
  if (PENDING.has(query)) return PENDING.get(query);

  const promise = (async () => {
    try {
      const d = await api.image(query);
      const url = d.src;
      if (!url) throw new Error('no src');
      CACHE.set(query, url);
      return url;
    } catch (err) {
      CACHE.set(query, '__failed__');
      throw err;
    } finally {
      PENDING.delete(query);
    }
  })();

  PENDING.set(query, promise);
  return promise;
}

export default function LazyImage({ query, alt, aspectRatio = '16/10', className = '' }) {
  const ref = useRef(null);
  const [state, setState] = useState(() => {
    // If we already have a cached result for this query, use it synchronously
    if (CACHE.has(query)) {
      const v = CACHE.get(query);
      return v === '__failed__' ? { kind: 'failed' } : { kind: 'loaded', src: v };
    }
    return { kind: 'idle' };
  });

  useEffect(() => {
    if (state.kind !== 'idle') return;
    if (!ref.current) return;

    let cancelled = false;
    const start = () => {
      setState({ kind: 'loading' });
      fetchOne(query)
        .then(src => { if (!cancelled) setState({ kind: 'loaded', src }); })
        .catch(()  => { if (!cancelled) setState({ kind: 'failed' }); });
    };

    if (typeof IntersectionObserver !== 'function') {
      start();
      return () => { cancelled = true; };
    }

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.disconnect();
        start();
      }
    }, { rootMargin: '300px' });
    obs.observe(ref.current);

    return () => { cancelled = true; obs.disconnect(); };
  }, [query, state.kind]);

  return (
    <div
      ref={ref}
      className={`lazy-img ${className}`}
      style={{ aspectRatio }}
    >
      {state.kind === 'loaded' && (
        <img src={state.src} alt={alt} loading="lazy" decoding="async" />
      )}
      {state.kind === 'failed' && (
        <div className="lazy-img-fallback">
          <span>{alt}</span>
        </div>
      )}
      {(state.kind === 'idle' || state.kind === 'loading') && (
        <div className="lazy-img-loading"><span>·</span></div>
      )}
    </div>
  );
}
