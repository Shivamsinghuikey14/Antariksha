import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';
import { api } from '../lib/api.js';

function kpLabel(kp) {
  if (kp == null) return { level: '—', desc: 'No data', color: '#888' };
  if (kp <  4) return { level: 'Quiet',           desc: 'No noticeable disturbance',           color: '#7ce0a3' };
  if (kp <  5) return { level: 'Active',          desc: 'Minor disturbance',                   color: '#d8e07c' };
  if (kp <  6) return { level: 'Minor Storm',     desc: 'G1 — weak power-grid fluctuations',   color: '#e0c47c' };
  if (kp <  7) return { level: 'Moderate Storm',  desc: 'G2 — visible aurora at mid-latitudes',color: '#e0a07c' };
  if (kp <  8) return { level: 'Strong Storm',    desc: 'G3 — voltage corrections required',   color: '#e07c7c' };
  if (kp <  9) return { level: 'Severe Storm',    desc: 'G4 — widespread voltage control',     color: '#d864bf' };
  return                 { level: 'Extreme Storm',desc: 'G5 — collapse of power systems',      color: '#b964ff' };
}

export default function SpaceWeather() {
  useReveal();
  const [data, setData]   = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.spaceWeather()
      .then(d => setData(d))
      .catch(e => setError(e.message || 'Failed to load'));
    const id = setInterval(() => {
      api.spaceWeather().then(setData).catch(() => {});
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const kpVal = data?.kp?.kp_index ?? data?.kp?.estimated_kp ?? null;
  const kp    = kpLabel(kpVal);
  const wind  = data?.solarWind;
  const xray  = data?.xray;
  const alerts = data?.alerts || [];

  return (
    <>
      <PageHero
        kicker="Live"
        title="Space Weather"
        sub="Conditions in the space environment around Earth, updated every minute. Data: NOAA Space Weather Prediction Center."
      />

      {error && (
        <section className="movement">
          <p className="planet-desc-body reveal" style={{ color: '#ff8b6a' }}>Couldn't reach NOAA SWPC: {error}. Try again in a moment.</p>
        </section>
      )}

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">01</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Geomagnetic Activity</div>
            <h2 className="movement-title">Kp Index — Aurora Forecast</h2>
          </div>
        </header>

        <div className="sw-kp-card reveal" style={{ borderColor: kp.color }}>
          <div className="sw-kp-big" style={{ color: kp.color }}>
            {kpVal != null ? Number(kpVal).toFixed(1) : '—'}
          </div>
          <div className="sw-kp-meta">
            <div className="sw-kp-level" style={{ color: kp.color }}>{kp.level}</div>
            <div className="sw-kp-desc">{kp.desc}</div>
            <div className="sw-kp-info">
              The planetary K-index measures the magnitude of geomagnetic disturbance on a 0-9 scale.
              When Kp is 5 or higher, auroras become visible at lower latitudes than usual.
              At Kp 7+, auroras can be seen as far south as central Europe and northern US states.
            </div>
          </div>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">02</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Solar Wind</div>
            <h2 className="movement-title">Plasma streaming from the Sun</h2>
          </div>
        </header>
        <div className="sw-grid reveal">
          <div className="sw-stat">
            <div className="sw-stat-label">Speed</div>
            <div className="sw-stat-num">{wind?.speed ? `${Math.round(wind.speed)}` : '—'}</div>
            <div className="sw-stat-unit">km/s</div>
          </div>
          <div className="sw-stat">
            <div className="sw-stat-label">Density</div>
            <div className="sw-stat-num">{wind?.density ? Number(wind.density).toFixed(1) : '—'}</div>
            <div className="sw-stat-unit">protons/cm³</div>
          </div>
          <div className="sw-stat">
            <div className="sw-stat-label">Temperature</div>
            <div className="sw-stat-num">{wind?.temperature ? `${(Number(wind.temperature)/1e5).toFixed(1)}` : '—'}</div>
            <div className="sw-stat-unit">×10⁵ K</div>
          </div>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">03</div>
          <div className="movement-title-block">
            <div className="movement-kicker">X-Ray Flux</div>
            <h2 className="movement-title">Solar Flare Activity</h2>
          </div>
        </header>
        <div className="reveal">
          <p className="planet-desc-body">
            Current GOES-primary X-ray flux:{' '}
            <strong style={{ color: 'var(--gold)' }}>
              {xray?.flux ? Number(xray.flux).toExponential(2) : '—'} W/m²
            </strong>
            {xray?.flux && (
              <> · Class <strong>{
                xray.flux >= 1e-4 ? 'X (extreme)' :
                xray.flux >= 1e-5 ? 'M (medium)'  :
                xray.flux >= 1e-6 ? 'C (common)'  :
                xray.flux >= 1e-7 ? 'B'           : 'A (quiet)'
              }</strong></>
            )}
          </p>
          <p className="planet-desc-body">
            Solar flares are classified A through X by their peak X-ray brightness. X-class flares can disrupt
            radio communication on the daylit side of Earth and accelerate the solar wind into geomagnetic storms
            that produce aurora 1–3 days later.
          </p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">04</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Active Alerts</div>
            <h2 className="movement-title">Recent NOAA SWPC Bulletins</h2>
          </div>
        </header>
        <div className="reveal">
          {alerts.length === 0 && <p className="planet-desc-body">No recent alerts.</p>}
          {alerts.map((a, i) => (
            <div key={i} className="sw-alert">
              <div className="sw-alert-time">{a.issue_datetime || a.issued || '—'}</div>
              <pre className="sw-alert-msg">{a.message}</pre>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
