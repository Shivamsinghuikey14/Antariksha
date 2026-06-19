import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';
import { useFavorites } from '../lib/useFavorites.js';

export default function Favorites() {
  useReveal();
  const { list, remove, clear } = useFavorites();

  return (
    <>
      <PageHero
        kicker="Your saved pages"
        title="Bookmarks"
        sub="Pages you've starred. Stored locally in your browser — no account required."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">★</div>
          <div className="movement-title-block">
            <div className="movement-kicker">{list.length === 0 ? 'Nothing here yet' : `${list.length} saved`}</div>
            <h2 className="movement-title">
              {list.length === 0 ? 'Start saving' : 'Your library'}
            </h2>
            {list.length > 0 && (
              <button className="chip" onClick={() => confirm('Remove all bookmarks?') && clear()} style={{ marginTop: '1rem' }}>
                Clear all
              </button>
            )}
          </div>
        </header>

        {list.length === 0 ? (
          <div className="planet-description reveal">
            <p className="planet-desc-body">Click the ★ button on any page header to save it here. Your bookmarks live in your browser's local storage — they stay when you close the tab and sync across all your AETHER tabs, but they aren't synced to other devices.</p>
          </div>
        ) : (
          <div className="hub-grid reveal">
            {list.sort((a, b) => b.savedAt - a.savedAt).map(f => (
              <div key={f.path} className="hub-card" style={{ paddingRight: '4rem', position: 'relative' }}>
                <Link to={f.path} className="hub-card-title" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {f.label}
                </Link>
                <div className="hub-card-desc">{f.path}</div>
                <div className="hub-card-cta">Saved {new Date(f.savedAt).toLocaleDateString()}</div>
                <button
                  onClick={() => remove(f.path)}
                  style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: 'transparent', border: '1px solid rgba(239,234,224,0.15)',
                    color: 'rgba(239,234,224,0.6)', padding: '0.4rem 0.7rem',
                    cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.1em',
                  }}>×</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
