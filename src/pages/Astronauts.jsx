import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import LazyImage from '../components/ui/LazyImage.jsx';
import { useReveal } from '../lib/useReveal.js';
import { api } from '../lib/api.js';

export default function Astronauts() {
  useReveal();
  const [data, setData]   = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.astronauts()
      .then(d => setData(d))
      .catch(e => setError(e.message || 'Failed to load'));
  }, []);

  // Group by craft
  const byCraft = {};
  data?.people?.forEach(p => {
    (byCraft[p.craft] = byCraft[p.craft] || []).push(p);
  });

  return (
    <>
      <PageHero
        kicker="Live"
        title="People in Space"
        sub="Every human currently off the surface of Earth, updated as crews launch and return. Data from Open Notify."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">{data ? data.number : '·'}</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Right Now</div>
            <h2 className="movement-title">{data ? `${data.number} humans off Earth` : 'Loading…'}</h2>
            {error && <p className="movement-sub" style={{ color: '#ff8b6a' }}>Couldn't reach Open Notify: {error}</p>}
          </div>
        </header>

        {Object.entries(byCraft).map(([craft, crew]) => (
          <div key={craft} className="reveal" style={{ marginBottom: '3rem' }}>
            <div className="craft-header">
              <h3 className="craft-name">{craft}</h3>
              <div className="craft-count">{crew.length} {crew.length === 1 ? 'crew member' : 'crew members'}</div>
            </div>
            <div className="astronaut-grid">
              {crew.map(p => (
                <article key={p.name} className="astronaut-card">
                  <LazyImage query={p.name} alt={p.name} aspectRatio="1/1" />
                  <div className="astronaut-card-body">
                    <h4 className="astronaut-name">{p.name}</h4>
                    <div className="astronaut-craft">aboard {p.craft}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Background</div>
            <h2 className="movement-title">Unbroken Human Presence</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">Humans have lived continuously in space since 2 November 2000, when the first long-duration crew arrived at the International Space Station. As of today that's more than 25 years of unbroken human presence beyond Earth — the longest such streak in our species' history.</p>
          <p className="planet-desc-body">In recent years China's Tiangong space station has joined the ISS as a permanently crewed orbital outpost. The Chinese crews rotate roughly every six months, similar to the ISS expedition pattern. Together they typically host between 7 and 13 people at any given moment.</p>
        </div>
      </section>
    </>
  );
}
