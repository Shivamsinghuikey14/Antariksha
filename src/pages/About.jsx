import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';

export default function About() {
  useReveal();
  return (
    <>
      <PageHero kicker="About" title="About Aether" sub="Open data, open code, free forever." />
      <section className="movement">
        <div className="planet-description reveal">
          <p className="planet-desc-body">Aether is an atlas of the cosmos built on open data and free software. It weaves together feeds from NASA, SpaceX, ESA, JAXA, the Launch Library aggregator, Solar System OpenData, and WhereTheISS.at to make every corner of space accessible from a single place.</p>
          <p className="planet-desc-body">The name comes from the ancient Greek φύσις — <em>aether</em>, the fifth element, the substance that fills the celestial realm beyond Earth. Dante used the word "empyrean" for the highest heaven. Aether is its modern echo.</p>
          <p className="planet-desc-body">There are no accounts, no tracking, no ads, no paywalls. The source code is on GitHub under the MIT licence. Fork it, run it locally, send patches.</p>
          <p className="planet-desc-body" style={{ marginTop: '2rem', fontStyle: 'italic', color: 'var(--ember)' }}>
            "For small creatures such as we, the vastness is bearable only through love." — Carl Sagan
          </p>
        </div>
      </section>
    </>
  );
}
