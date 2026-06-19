import { useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';

// Real values in km
const REAL = {
  sunDiameter: 1392684,
  planets: [
    { name: 'Mercury', diameter:   4880, dist:    57909000, color: '#c4a988' },
    { name: 'Venus',   diameter:  12104, dist:   108208000, color: '#e8c890' },
    { name: 'Earth',   diameter:  12742, dist:   149598000, color: '#5dd5ff' },
    { name: 'Mars',    diameter:   6779, dist:   227939000, color: '#ff6244' },
    { name: 'Jupiter', diameter: 139820, dist:   778298000, color: '#d4a574' },
    { name: 'Saturn',  diameter: 116460, dist:  1429394000, color: '#f0d68c' },
    { name: 'Uranus',  diameter:  50724, dist:  2870972000, color: '#9be3e6' },
    { name: 'Neptune', diameter:  49244, dist:  4504300000, color: '#4a6fff' },
  ],
};

// Preset Sun sizes (in cm)
const PRESETS = [
  { cm: 0.1,    label: 'A pinhead'           },
  { cm: 1,      label: 'A pea'               },
  { cm: 8,      label: 'An orange'           },
  { cm: 24,     label: 'A basketball'        },
  { cm: 100,    label: '1 meter sphere'      },
  { cm: 500,    label: '5 meter ball'        },
];

// Format a length nicely with appropriate unit
function fmtLen(cm) {
  if (cm < 0.1)  return `${(cm * 10).toFixed(2)} mm`;
  if (cm < 100)  return `${cm.toFixed(cm < 1 ? 2 : 1)} cm`;
  const m = cm / 100;
  if (m < 1000)  return `${m.toFixed(1)} m`;
  const km = m / 1000;
  return `${km.toFixed(km < 10 ? 2 : km < 100 ? 1 : 0)} km`;
}

export default function Scale() {
  useReveal();
  const [presetIdx, setPresetIdx] = useState(3);  // basketball
  const sunCm = PRESETS[presetIdx].cm;

  // Scale factor: Sun's real diameter (km) → user's chosen cm
  const realDiameterCm = REAL.sunDiameter * 1e5;  // km → cm
  const scale = sunCm / realDiameterCm;

  const scaled = REAL.planets.map(p => ({
    ...p,
    sizeCm: p.diameter * 1e5 * scale,
    distCm: p.dist     * 1e5 * scale,
  }));

  return (
    <>
      <PageHero
        kicker="Tools"
        title="Solar System to Scale"
        sub="Pick a size for the Sun. Every planet's size and distance rescales correctly. Drag the slider to feel how empty the solar system really is."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">⌬</div>
          <div className="movement-title-block">
            <div className="movement-kicker">If the Sun were…</div>
            <h2 className="movement-title">{PRESETS[presetIdx].label}</h2>
            <p className="movement-sub">Diameter: {fmtLen(sunCm)}</p>
          </div>
        </header>

        <div className="scale-slider reveal">
          <input
            type="range"
            min="0"
            max={PRESETS.length - 1}
            step="1"
            value={presetIdx}
            onChange={e => setPresetIdx(parseInt(e.target.value))}
            className="scale-input"
          />
          <div className="scale-ticks">
            {PRESETS.map((p, i) => (
              <button key={i}
                className={`scale-tick ${i === presetIdx ? 'active' : ''}`}
                onClick={() => setPresetIdx(i)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="scale-grid reveal">
          <div className="scale-card sun">
            <div className="scale-dot sun-dot" style={{ width: `${Math.min(120, sunCm * 4)}px`, height: `${Math.min(120, sunCm * 4)}px` }}></div>
            <div className="scale-card-name">The Sun</div>
            <div className="scale-card-stat">{fmtLen(sunCm)} across</div>
            <div className="scale-card-real">In reality: 1,392,684 km</div>
          </div>
          {scaled.map(p => (
            <div key={p.name} className="scale-card">
              <div className="scale-dot" style={{
                width: `${Math.max(4, Math.min(80, p.sizeCm * 4))}px`,
                height: `${Math.max(4, Math.min(80, p.sizeCm * 4))}px`,
                background: p.color,
              }}></div>
              <div className="scale-card-name">{p.name}</div>
              <div className="scale-card-stat">
                <strong>{fmtLen(p.sizeCm)}</strong> across
              </div>
              <div className="scale-card-stat">
                <strong>{fmtLen(p.distCm)}</strong> from Sun
              </div>
              <div className="scale-card-real">
                Real: {p.diameter.toLocaleString()} km · {(p.dist / 1e6).toLocaleString()} million km from Sun
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>!</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">The point</div>
            <h2 className="movement-title">Mostly empty space</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">Most pictures of the solar system are lies — you have to be, to fit eight planets on one page. At any honest scale, the planets are pinpricks vanishingly small against the distances between them.</p>
          <p className="planet-desc-body">If the Sun were a basketball, Earth would be a peppercorn 26 metres away. Jupiter would be a marble 140 metres further on. Neptune would be a smaller pea, almost a kilometre from the basketball Sun. <strong>Voyager 1</strong>, our farthest emissary, would still be inside that imaginary kilometre — only 4 kilometres out, not yet halfway to the nearest star.</p>
          <p className="planet-desc-body">Try setting the Sun to "a pea" and you'll see why we send robots, not people, to the outer planets.</p>
        </div>
      </section>
    </>
  );
}
