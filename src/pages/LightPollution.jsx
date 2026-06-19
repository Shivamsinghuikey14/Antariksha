import { useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';

const PRESETS = [
  { name: 'Your location',        lat: null,    lon: null,    zoom: 8  },
  { name: 'Atacama Desert',       lat: -24.628, lon: -70.404, zoom: 7  },
  { name: 'Mauna Kea, Hawaii',    lat: 19.823,  lon: -155.469,zoom: 8  },
  { name: 'La Palma, Canaries',   lat: 28.760,  lon: -17.892, zoom: 9  },
  { name: 'Aoraki Mackenzie, NZ', lat: -43.595, lon: 170.142, zoom: 8  },
  { name: 'Karoo, South Africa',  lat: -32.379, lon: 20.812,  zoom: 7  },
  { name: 'Ladakh, India',        lat: 32.778,  lon: 78.964,  zoom: 7  },
  { name: 'NamibRand, Namibia',   lat: -25.000, lon: 16.150,  zoom: 7  },
];

const BORTLE = [
  { class: '1',     label: 'Excellent dark-sky site',           desc: 'The Milky Way casts shadows. Zodiacal light is obvious. Limiting magnitude 7.6-8.0.', color: '#000814' },
  { class: '2',     label: 'Typical truly dark site',           desc: 'Milky Way highly structured. Airglow visible. Magnitude 7.1-7.5.', color: '#0a1530' },
  { class: '3',     label: 'Rural sky',                         desc: 'Some signs of pollution near horizon. Magnitude 6.6-7.0.', color: '#1a2550' },
  { class: '4',     label: 'Rural / suburban transition',       desc: 'Milky Way visible but dim. Magnitude 6.1-6.5.', color: '#3a3570' },
  { class: '5',     label: 'Suburban',                          desc: 'Milky Way weak or invisible. Magnitude 5.6-6.0.', color: '#6a5580' },
  { class: '6',     label: 'Bright suburban',                   desc: 'Milky Way invisible. Sky background obvious grey. Magnitude 5.1-5.5.', color: '#9a7590' },
  { class: '7',     label: 'Suburban / urban transition',       desc: 'Sky background grey-orange. Magnitude 4.6-5.0.', color: '#c4956a' },
  { class: '8',     label: 'City sky',                          desc: 'Sky glows whitish-orange. Magnitude 4.1-4.5.', color: '#daa050' },
  { class: '9',     label: 'Inner-city sky',                    desc: 'Sky bright enough to read by. Magnitude < 4.0. Only Moon, planets, brightest stars.', color: '#f5b830' },
];

export default function LightPollution() {
  useReveal();
  const [preset, setPreset] = useState(PRESETS[1]);
  const [coords, setCoords] = useState(null);

  const tryGeolocation = () => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      p => setCoords({ lat: p.coords.latitude, lon: p.coords.longitude }),
      _ => alert('Location permission denied. Pick a preset below instead.'),
      { timeout: 5000 }
    );
  };

  const lat  = preset.lat ?? coords?.lat ?? 39.5;
  const lon  = preset.lon ?? coords?.lon ?? -98.0;
  const zoom = preset.zoom;
  const src  = `https://www.lightpollutionmap.info/#zoom=${zoom}&lat=${lat}&lon=${lon}&state=overlay&layers=B0FFFFFTFFFFFFFFFFFF`;

  return (
    <>
      <PageHero
        kicker="Tools"
        title="Light Pollution Map"
        sub="Where can you actually see the stars? Real-world atlas of artificial sky brightness, with the world's best dark-sky reserves marked."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">⊕</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Pick a location</div>
            <h2 className="movement-title">Famous dark-sky sites</h2>
          </div>
        </header>

        <div className="chip-row reveal">
          <button className="chip" onClick={tryGeolocation}>📍 Use my location</button>
          {PRESETS.slice(1).map(p => (
            <button key={p.name}
              className={`chip ${p.name === preset.name ? 'active' : ''}`}
              onClick={() => setPreset(p)}>
              {p.name}
            </button>
          ))}
        </div>

        <div className="lp-frame reveal">
          <iframe
            key={`${lat}-${lon}-${zoom}`}
            src={src}
            title="Light pollution atlas"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="fullscreen"
          />
        </div>

        <p className="lp-credit reveal">Atlas: <a href="https://www.lightpollutionmap.info/" target="_blank" rel="noopener noreferrer">lightpollutionmap.info</a> · World Atlas 2015 (Falchi et al.) + VIIRS DNB satellite data</p>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">★</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Bortle Scale</div>
            <h2 className="movement-title">How dark is "dark"?</h2>
            <p className="movement-sub">John Bortle's 9-class measure of night sky quality</p>
          </div>
        </header>
        <div className="bortle-grid reveal">
          {BORTLE.map(b => (
            <article key={b.class} className="bortle-card" style={{ borderLeftColor: b.color }}>
              <div className="bortle-num" style={{ background: b.color }}>{b.class}</div>
              <div className="bortle-body">
                <h3 className="bortle-label">Class {b.class} — {b.label}</h3>
                <p className="bortle-desc">{b.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
