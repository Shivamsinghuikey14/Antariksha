import { Link } from 'react-router-dom';

/**
 * HubCards — a grid of large clickable cards, identical in feel to the
 * home page's gateway grid. Used on the four hub pages (Solar System,
 * Deep Sky, Live, Tools) in place of the old navbar dropdowns.
 *
 * Props:
 *   kicker  — small label above the title (eg "Browse")
 *   title   — section heading
 *   items   — array of [to, num, name, desc] tuples
 */
export default function HubCards({ kicker = 'Browse', title = 'Explore this section', items = [] }) {
  return (
    <section className="movement hub-section">
      <header className="movement-header reveal">
        <div className="movement-num">⌒</div>
        <div className="movement-title-block">
          <div className="movement-kicker">{kicker}</div>
          <h2 className="movement-title">{title}</h2>
        </div>
      </header>

      <div className="hub-grid reveal">
        {items.map(([to, num, name, desc], i) => (
          <Link key={to} to={to} className={`hub-card ${i === 0 ? 'big' : ''}`}>
            <div className="hub-card-num">{num}</div>
            <h3 className="hub-card-title">{name}</h3>
            <p className="hub-card-desc">{desc}</p>
            <div className="hub-card-cta">Open →</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
