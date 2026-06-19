import { useState, useCallback, useRef, useEffect } from 'react';
import SolarSystemRealistic, { PLANETS } from '../components/three/SolarSystemRealistic.jsx';

export default function SolarSystemFull() {
  const [selected, setSelected] = useState(null);
  const [speed, setSpeed]       = useState(1);
  const [labels, setLabels]     = useState(true);
  const [paths, setPaths]       = useState(true);
  const [focus, setFocus]       = useState(null);
  const ctrlRef = useRef({ speed: 1, labels: true, paths: true, focus: null });

  useEffect(() => { ctrlRef.current = { ...ctrlRef.current, speed, labels, paths, focus }; }, [speed, labels, paths, focus]);

  const handleSelect = useCallback((data) => setSelected(data), []);
  const info = selected?.info;

  return (
    <div className="ss3d-page">
      <div className="ss3d-controls">
        <span className="ss3d-label">AETHER · 3D UNIVERSE</span>

        <div className="ss3d-controls-center">
          <div className="ss3d-ctrl-group">
            <span className="ss3d-ctrl-h">SPEED</span>
            {[0.1, 0.5, 1, 2, 5, 10].map(s => (
              <button key={s} className={`ss3d-btn ${speed === s ? 'active' : ''}`}
                onClick={() => setSpeed(s)}>{s}×</button>
            ))}
          </div>
          <div className="ss3d-divider" />
          <div className="ss3d-ctrl-group">
            <span className="ss3d-ctrl-h">GO TO</span>
            {PLANETS.map(p => (
              <button key={p.name} className={`ss3d-btn ${focus === p.name ? 'active' : ''}`}
                onClick={() => setFocus(f => f === p.name ? null : p.name)}>{p.name.slice(0,3)}</button>
            ))}
          </div>
          <div className="ss3d-divider" />
          <button className={`ss3d-btn ${labels ? 'active' : ''}`}
            onClick={() => setLabels(l => !l)}>{labels ? '🏷 Labels ON' : '🏷 OFF'}</button>
          <button className={`ss3d-btn ${paths ? 'active' : ''}`}
            onClick={() => setPaths(p => !p)}>{paths ? '⊙ Orbits ON' : '⊙ OFF'}</button>
        </div>
      </div>

      <SolarSystemRealistic onSelect={handleSelect} ctrlRef={ctrlRef} />

      <div className="ss3d-hint">Drag to orbit · Scroll to zoom · Click any object · Zoom out → Milky Way → nearby stars → Andromeda</div>

      <div className={`ss3d-info ${selected ? 'open' : ''}`}>
        {selected && (
          <>
            <button className="ss3d-info-close" onClick={() => setSelected(null)}>×</button>
            <div className="ss3d-info-kicker">
              {selected.parentName ? `Moon of ${selected.parentName}` :
               selected.type === 'satellite' ? 'Spacecraft' :
               selected.type === 'star' ? 'Star' :
               selected.type === 'galaxy' ? 'Galaxy' :
               selected.type === 'dwarf' ? 'Dwarf Planet' : 'Celestial Body'}
            </div>
            <h2 className="ss3d-info-name">{selected.name}</h2>

            {info && typeof info === 'object' && Object.entries(info).filter(([k]) => k !== 'note').map(([k, v]) => (
              <div key={k} className="ss3d-info-row">
                <span>{k.replace(/_/g,' ')}</span><span>{String(v)}</span>
              </div>
            ))}
            {info?.note && <div className="ss3d-info-note">{info.note}</div>}
            {selected.info && typeof selected.info === 'string' && (
              <div className="ss3d-info-note">{selected.info}</div>
            )}

            {selected.moons?.length > 0 && (
              <div className="ss3d-info-moons">
                <div className="ss3d-info-moons-h">Major moons</div>
                {selected.moons.map(m => (
                  <button key={m.name} className="ss3d-moon-btn"
                    onClick={() => setSelected({...m, parentName: selected.name})}>
                    {m.name}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="ss3d-legend">
        <div className="ss3d-legend-item"><span className="ss3d-legend-dot" style={{background:'#ffdd44'}}></span>Sun</div>
        <div className="ss3d-legend-item"><span className="ss3d-legend-dot" style={{background:'#998877'}}></span>Asteroid belt</div>
        <div className="ss3d-legend-item"><span className="ss3d-legend-dot" style={{background:'#667788'}}></span>Kuiper belt</div>
        <div className="ss3d-legend-item"><span className="ss3d-legend-dot" style={{background:'#44ff44'}}></span>Satellites</div>
        <div className="ss3d-legend-item"><span className="ss3d-legend-dot" style={{background:'#ff4444'}}></span>Deep-space probes</div>
        <div className="ss3d-legend-item"><span className="ss3d-legend-dot" style={{background:'#ffeecc'}}></span>Nearby stars (zoom out)</div>
        <div className="ss3d-legend-item"><span className="ss3d-legend-dot" style={{background:'#ccbbff'}}></span>Andromeda (max zoom)</div>
      </div>
    </div>
  );
}
