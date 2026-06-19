export default function PageHero({ kicker, title, sub }) {
  return (
    <section className="page-hero">
      <div className="hero-content">
        {kicker && <div className="hero-eyebrow">{kicker}</div>}
        <h1 className="hero-headline">{title}</h1>
        {sub && <p className="hero-sub">{sub}</p>}
      </div>
    </section>
  );
}
