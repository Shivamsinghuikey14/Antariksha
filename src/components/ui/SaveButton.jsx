import { useLocation } from 'react-router-dom';
import { useFavorites } from '../../lib/useFavorites.js';

export default function SaveButton({ label }) {
  const { pathname } = useLocation();
  const { has, toggle } = useFavorites();
  const saved = has(pathname);
  return (
    <button
      type="button"
      onClick={() => toggle(pathname, label || pathname)}
      className={`save-btn ${saved ? 'saved' : ''}`}
      aria-label={saved ? 'Remove from bookmarks' : 'Save to bookmarks'}
    >
      {saved ? '★ Saved' : '☆ Save'}
    </button>
  );
}
