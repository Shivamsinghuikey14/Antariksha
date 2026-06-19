import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import { useLightbox } from '../components/ui/Lightbox.jsx';
import { useReveal } from '../lib/useReveal.js';
import { api } from '../lib/api.js';

const ROVERS = [
  { id: 'curiosity',    name: 'Curiosity',    landed: 'Aug 2012', status: 'Active' },
  { id: 'perseverance', name: 'Perseverance', landed: 'Feb 2021', status: 'Active' },
];

export default function Mars() {
  useReveal();
  const [rover, setRover] = useState('curiosity');
  const [sol, setSol]     = useState(1000);
  const [photos, setPhotos] = useState(null);
  const [err, setErr] = useState(null);
  const { openLightbox } = useLightbox();

  useEffect(() => {
    setPhotos(null);
    setErr(null);
    api.mars(rover, sol)
      .then(d => setPhotos(d.photos || []))
      .catch(e => setErr(e.message));
  }, [rover, sol]);

  return (
    <>
      <PageHero
        kicker="Mars"
        title="The Red Frontier"
        sub="Two rovers are exploring Mars right now. Drive with them — every photograph they have ever taken is in here."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">A World We're Already Walking</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">There are two functioning rovers on Mars at this moment. Curiosity has been driving the floor of Gale Crater since 2012, climbing the foothills of Mount Sharp. Perseverance landed in Jezero Crater in 2021 with the helicopter Ingenuity strapped to its belly — Ingenuity went on to make 72 powered flights before retirement, the first ever on another world. Perseverance is now caching tiny tubes of carefully chosen Martian samples for a future mission to bring home.</p>
          <p className="planet-desc-body">Every day, fresh photographs come back. Click below to browse.</p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◯</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Live · NASA</div>
            <h2 className="movement-title">Rover Photo Browser</h2>
          </div>
        </header>

        <div className="mars-controls reveal">
          <div className="mars-control-block">
            <div className="mars-control-label">Rover</div>
            <div className="mars-control-row">
              {ROVERS.map(r => (
                <button key={r.id}
                  className={`sim-btn ${rover === r.id ? 'active' : ''}`}
                  onClick={() => setRover(r.id)}>
                  {r.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mars-control-block">
            <div className="mars-control-label">Sol (Martian day after landing)</div>
            <div className="mars-control-row">
              <input
                type="number"
                value={sol}
                min="1"
                onChange={e => setSol(parseInt(e.target.value) || 1)}
                className="mars-sol-input"
              />
              <button className="sim-btn" onClick={() => setSol(s => Math.max(1, s - 50))}>−50</button>
              <button className="sim-btn" onClick={() => setSol(s => s + 50)}>+50</button>
            </div>
          </div>
        </div>

        <div className="mars-photos reveal">
          {err && <div className="error">// Mars photos unavailable — {err}</div>}
          {!err && !photos && <div className="loading">Retrieving photos from Mars…</div>}
          {photos?.length === 0 && <div className="empty">No photos for this rover and sol. Try a different sol.</div>}
          {photos?.slice(0, 20).map((p, i) => (
            <div key={i} className="mars-photo" onClick={() => openLightbox(p.img_src, `${p.camera?.full_name || p.camera_name} · sol ${p.sol}`)}>
              <img src={p.img_src} alt={`Mars sol ${p.sol}`} loading="lazy" />
              <div className="mars-photo-meta">
                <span>{p.camera?.full_name || p.camera_name || 'camera'}</span>
                <span>sol {p.sol}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery</div>
            <h2 className="movement-title">More from the Surface</h2>
          </div>
        </header>
        <TopicGallery query="mars surface" limit={12} />
      </section>
    </>
  );
}
