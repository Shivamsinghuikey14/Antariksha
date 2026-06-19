import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="nf-content">
        <div className="nf-num">404</div>
        <h1 className="nf-title">Lost in space</h1>
        <p className="nf-sub">The page you're looking for has drifted beyond the heliopause.</p>
        <Link className="nf-link" to="/">← Return to Earth</Link>
      </div>
    </section>
  );
}
