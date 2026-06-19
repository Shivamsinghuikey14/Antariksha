import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';
import { api } from '../lib/api.js';
import HubCards from '../components/ui/HubCards.jsx';

function LaunchCard({ l }) {
  const when = l.when ? new Date(l.when).toLocaleString('en', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  }) : '—';
  return (
    <article className="launch-card">
      <div className="launch-row-top">
        <div className="launch-provider">{l.provider || '—'}</div>
        {l.status && <div className={`launch-status status-${(l.statusKey || l.status).toLowerCase().replace(/\s/g, '-')}`}>{l.status}</div>}
      </div>
      <h3 className="launch-name">{l.name}</h3>
      <div className="launch-rocket">↑ {l.rocket || '—'}</div>
      <div className="launch-meta">
        <div className="lm-row"><span>When</span><strong>{when}</strong></div>
        {l.pad && <div className="lm-row"><span>Pad</span><strong>{l.pad}</strong></div>}
        {l.orbit && <div className="lm-row"><span>Orbit</span><strong>{l.orbit}</strong></div>}
        {l.mission && <div className="lm-row"><span>Type</span><strong>{l.mission}</strong></div>}
      </div>
      {l.webcast && <a className="launch-webcast" href={l.webcast} target="_blank" rel="noopener noreferrer">▶ Webcast</a>}
    </article>
  );
}

export default function Missions() {
  useReveal();
  const [upcoming, setUpcoming] = useState(null);
  const [past, setPast] = useState(null);
  const [spacex, setSpacex] = useState(null);
  const [errU, setErrU] = useState(null);
  const [errP, setErrP] = useState(null);
  const [errS, setErrS] = useState(null);

  useEffect(() => {
    api.launchesUpcoming(12).then(d => setUpcoming(d.launches || d || [])).catch(e => setErrU(e.message));
    api.launchesPast(12).then(d => setPast(d.launches || d || [])).catch(e => setErrP(e.message));
    api.missionsPast(10).then(d => setSpacex(d.missions || d || [])).catch(e => setErrS(e.message));
  }, []);

  return (
    <>
      <PageHero
        kicker="Launches"
        title="Missions"
        sub="Every launch from every space agency, live. Past, upcoming, and the spacecraft they sent."
      />

      <HubCards
        kicker="Browse"
        title="Live & Missions"
        items={[
        ['/iss', '◯', 'ISS Tracker', '3D position of the International Space Station, refreshed every 5 s.'],
        ['/astronauts', '⌒', 'People in Space', 'Live — every human currently off Earth, by craft.'],
        ['/space-weather', '☀', 'Space Weather', 'Kp index, solar wind, aurora forecast — live NOAA SWPC data.'],
        ['/telescopes', '⊡', 'Telescopes & Feeds', '8 live YouTube feeds + free-access observatory programmes.'],
        ['/spacecraft', '⊹', 'Spacecraft & Missions', '30 historic missions from Sputnik to JWST.'],
        ['/agencies', '⌖', 'Space Agencies', '15 national agencies + 8 commercial operators.'],
        ['/jwst', '✦', 'James Webb', 'The deepest infrared eye humanity has ever opened.'],
        ['/mars', '♂', 'Mars Rovers', 'Latest photos from Perseverance, Curiosity and the rovers before them.']
      ]}
      />


      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>↑</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Live · The Space Devs</div>
            <h2 className="movement-title">Upcoming Launches</h2>
            <p className="movement-sub">Aggregated from every space agency and commercial provider on Earth.</p>
          </div>
        </header>
        <div className="launches-grid reveal">
          {errU && <div className="error">// Upcoming launches unavailable — {errU}</div>}
          {!errU && !upcoming && <div className="loading">Loading upcoming launches…</div>}
          {upcoming?.map((l, i) => <LaunchCard key={i} l={l} />)}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>↓</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Recent · The Space Devs</div>
            <h2 className="movement-title">Past Launches</h2>
            <p className="movement-sub">The most recent successful (or failed) launches around the world.</p>
          </div>
        </header>
        <div className="launches-grid reveal">
          {errP && <div className="error">// Past launches unavailable — {errP}</div>}
          {!errP && !past && <div className="loading">Loading past launches…</div>}
          {past?.map((l, i) => <LaunchCard key={i} l={l} />)}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◆</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">SpaceX · Detailed</div>
            <h2 className="movement-title">Recent SpaceX Missions</h2>
            <p className="movement-sub">Detailed records from the SpaceX archive — payloads, landing attempts, reuse.</p>
          </div>
        </header>
        <div className="launches-grid reveal">
          {errS && <div className="error">// SpaceX archive unavailable — {errS}</div>}
          {!errS && !spacex && <div className="loading">Loading SpaceX archive…</div>}
          {spacex?.map((l, i) => <LaunchCard key={i} l={{ ...l, provider: 'SpaceX' }} />)}
        </div>
      </section>
    </>
  );
}
