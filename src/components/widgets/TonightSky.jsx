import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

/**
 * TonightSky — a compact panel showing live conditions for the user.
 * Combines three free APIs:
 *   - Sunrise-Sunset.org   → today's sunset, twilight begins, day length
 *   - Open Notify          → how many humans are off Earth right now
 *   - NOAA SWPC            → current geomagnetic Kp index (aurora chance)
 *
 * Geolocation falls back to London if user denies the prompt.
 */

const FALLBACK = { lat: 51.51, lon: -0.13, label: 'London (fallback)' };

function fmtTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function TonightSky() {
  const [loc, setLoc]     = useState(null);
  const [sun, setSun]     = useState(null);
  const [astro, setAstro] = useState(null);
  const [sw, setSw]       = useState(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) { setLoc(FALLBACK); return; }
    navigator.geolocation.getCurrentPosition(
      pos => setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'Your location' }),
      _   => setLoc(FALLBACK),
      { timeout: 5000, maximumAge: 600_000 }
    );
  }, []);

  useEffect(() => {
    if (!loc) return;
    api.sunrise(loc.lat, loc.lon).then(setSun).catch(() => {});
  }, [loc]);

  useEffect(() => {
    api.astronauts().then(setAstro).catch(() => {});
    api.spaceWeather().then(setSw).catch(() => {});
  }, []);

  const kpVal = sw?.kp?.kp_index ?? sw?.kp?.estimated_kp ?? null;
  const kpHigh = kpVal != null && Number(kpVal) >= 5;

  return (
    <section className="tonight-sky reveal">
      <header className="ts-header">
        <div className="ts-kicker">Live · {loc?.label || '…'}</div>
        <h2 className="ts-title">Tonight</h2>
      </header>

      <div className="ts-grid">
        <div className="ts-cell">
          <div className="ts-cell-label">Sunset</div>
          <div className="ts-cell-val">{fmtTime(sun?.sunset)}</div>
          <div className="ts-cell-foot">civil twilight ends {fmtTime(sun?.civil_twilight_end)}</div>
        </div>
        <div className="ts-cell">
          <div className="ts-cell-label">Astronomical dark</div>
          <div className="ts-cell-val">{fmtTime(sun?.astronomical_twilight_end)}</div>
          <div className="ts-cell-foot">best stargazing begins</div>
        </div>
        <div className="ts-cell">
          <div className="ts-cell-label">Sunrise</div>
          <div className="ts-cell-val">{fmtTime(sun?.sunrise)}</div>
          <div className="ts-cell-foot">day length {sun?.day_length ? Math.round(sun.day_length / 60) + ' min' : '—'}</div>
        </div>
        <div className="ts-cell">
          <div className="ts-cell-label">In space right now</div>
          <div className="ts-cell-val">{astro?.number ?? '—'}</div>
          <div className="ts-cell-foot">humans off Earth</div>
        </div>
        <div className={`ts-cell ${kpHigh ? 'alert' : ''}`}>
          <div className="ts-cell-label">Aurora forecast (Kp)</div>
          <div className="ts-cell-val">{kpVal != null ? Number(kpVal).toFixed(1) : '—'}</div>
          <div className="ts-cell-foot">{
            kpVal == null ? '—'
              : kpVal < 4 ? 'quiet — no aurora'
              : kpVal < 5 ? 'unsettled'
              : kpVal < 6 ? 'minor storm — high latitudes'
              : kpVal < 7 ? 'moderate — visible at mid-lat'
              : 'strong storm — aurora widespread'
          }</div>
        </div>
      </div>
    </section>
  );
}
