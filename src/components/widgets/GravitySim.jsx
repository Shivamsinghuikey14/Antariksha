import { useEffect, useRef, useState } from 'react';

const G = 0.6;
const DT = 0.5;

const TYPES = {
  planet:    { mass: 14,   colour: '#5dd5ff', glow: false },
  moon:      { mass: 3,    colour: '#9a9690', glow: false },
  star:      { mass: 240,  colour: '#ffd28a', glow: true  },
  blackhole: { mass: 1800, colour: '#080808', glow: 'bh'  },
};

let _id = 0;
function makeBody(x, y, vx, vy, type) {
  const t = TYPES[type];
  return {
    id: ++_id,
    x, y, vx, vy,
    ax: 0, ay: 0,
    mass: t.mass,
    radius: Math.max(2, Math.cbrt(t.mass) * 1.8),
    colour: t.colour,
    glow: t.glow,
    type,
  };
}

export default function GravitySim() {
  const canvasRef = useRef(null);
  const stageRef  = useRef(null);

  const stateRef = useRef({
    bodies: [],
    trails: new Map(),
    placeType:   'planet',
    trailsOn:    true,
    collisionsOn: true,
    speedMult:   1,
    paused:      false,
    tick:        0,
    W: 0, H: 0,
    dragging: false,
    dragStart:   { x: 0, y: 0 },
    dragCurrent: { x: 0, y: 0 },
    hideHint: false,
  });

  // UI state mirrors selected values for the buttons' highlight class
  const [placeType,    setPlaceType]    = useState('planet');
  const [speedMult,    setSpeedMult]    = useState(1);
  const [trailsOn,     setTrailsOn]     = useState(true);
  const [collisionsOn, setCollisionsOn] = useState(true);
  const [paused,       setPaused]       = useState(false);
  const [hideHint,     setHideHint]     = useState(false);
  const [stats, setStats] = useState({ count: 0, mass: 0, tick: 0 });

  // Mirror UI state into the mutable physics state ref
  useEffect(() => { stateRef.current.placeType    = placeType; }, [placeType]);
  useEffect(() => { stateRef.current.speedMult    = speedMult; }, [speedMult]);
  useEffect(() => { stateRef.current.trailsOn     = trailsOn;  if (!trailsOn) stateRef.current.trails.clear(); }, [trailsOn]);
  useEffect(() => { stateRef.current.collisionsOn = collisionsOn; }, [collisionsOn]);
  useEffect(() => { stateRef.current.paused       = paused; }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage  = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const S = stateRef.current;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      const r = stage.getBoundingClientRect();
      S.W = r.width; S.H = r.height;
      canvas.width  = S.W * dpr;
      canvas.height = S.H * dpr;
      canvas.style.width  = S.W + 'px';
      canvas.style.height = S.H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener('resize', resize);

    /* ── physics ────────────────────────── */
    const computeAccelerations = () => {
      const bs = S.bodies;
      for (const b of bs) { b.ax = 0; b.ay = 0; }
      for (let i = 0; i < bs.length; i++) {
        for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i], c = bs[j];
          const dx = c.x - a.x, dy = c.y - a.y;
          const r2 = dx*dx + dy*dy;
          const dist = Math.sqrt(r2 + 25);  // softening
          const F = G / (dist * dist * dist);
          a.ax += F * c.mass * dx;
          a.ay += F * c.mass * dy;
          c.ax -= F * a.mass * dx;
          c.ay -= F * a.mass * dy;
        }
      }
    };

    const handleCollisions = () => {
      const bs = S.bodies;
      for (let i = 0; i < bs.length; i++) {
        for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i], c = bs[j];
          const dx = c.x - a.x, dy = c.y - a.y;
          if (Math.sqrt(dx*dx + dy*dy) < a.radius + c.radius - 1) {
            const big   = a.mass >= c.mass ? a : c;
            const small = a.mass >= c.mass ? c : a;
            const total = big.mass + small.mass;
            big.vx = (big.vx * big.mass + small.vx * small.mass) / total;
            big.vy = (big.vy * big.mass + small.vy * small.mass) / total;
            big.mass = total;
            big.radius = Math.max(2, Math.cbrt(total) * 1.8);
            if (small.type === 'blackhole') {
              big.type = 'blackhole'; big.colour = TYPES.blackhole.colour; big.glow = 'bh';
            } else if (small.type === 'star' && big.type !== 'blackhole') {
              big.type = 'star'; big.colour = TYPES.star.colour; big.glow = true;
            }
            S.trails.delete(small.id);
            S.bodies.splice(S.bodies.indexOf(small), 1);
            j = i;
          }
        }
      }
    };

    const pruneOutOfBounds = () => {
      const M = 4000, cx = S.W / 2, cy = S.H / 2;
      S.bodies = S.bodies.filter(b => {
        const dx = b.x - cx, dy = b.y - cy;
        const inside = (dx*dx + dy*dy) < M*M;
        if (!inside) S.trails.delete(b.id);
        return inside;
      });
    };

    const step = (dt) => {
      if (!S.bodies.length) return;
      computeAccelerations();
      for (const b of S.bodies) {
        b.x += b.vx * dt + 0.5 * b.ax * dt * dt;
        b.y += b.vy * dt + 0.5 * b.ay * dt * dt;
        b._axp = b.ax;
        b._ayp = b.ay;
      }
      computeAccelerations();
      for (const b of S.bodies) {
        b.vx += 0.5 * (b._axp + b.ax) * dt;
        b.vy += 0.5 * (b._ayp + b.ay) * dt;
      }
      if (S.collisionsOn) handleCollisions();
      pruneOutOfBounds();
      S.tick++;
    };

    /* ── render ────────────────────────── */
    const draw = () => {
      ctx.fillStyle = 'rgba(8, 10, 16, 0.18)';
      ctx.fillRect(0, 0, S.W, S.H);

      if (S.trailsOn) {
        for (const b of S.bodies) {
          let t = S.trails.get(b.id);
          if (!t) { t = []; S.trails.set(b.id, t); }
          t.push({ x: b.x, y: b.y });
          if (t.length > 220) t.shift();
          if (t.length < 2) continue;
          ctx.beginPath();
          ctx.moveTo(t[0].x, t[0].y);
          for (let i = 1; i < t.length; i++) ctx.lineTo(t[i].x, t[i].y);
          ctx.strokeStyle = b.colour;
          ctx.globalAlpha = 0.18;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      for (const b of S.bodies) {
        if (b.glow === 'bh') {
          const r = b.radius * 4;
          const grad = ctx.createRadialGradient(b.x, b.y, b.radius * 0.8, b.x, b.y, r);
          grad.addColorStop(0,   'rgba(255, 90, 60, 0.55)');
          grad.addColorStop(0.4, 'rgba(180, 100, 200, 0.25)');
          grad.addColorStop(1,   'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#000';
          ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2); ctx.fill();
          ctx.strokeStyle = 'rgba(255, 180, 100, 0.65)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else if (b.glow) {
          const r = b.radius * 3.5;
          const grad = ctx.createRadialGradient(b.x, b.y, 1, b.x, b.y, r);
          grad.addColorStop(0,   b.colour);
          grad.addColorStop(0.3, 'rgba(255, 200, 130, 0.4)');
          grad.addColorStop(1,   'rgba(255, 100, 40, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = b.colour;
          ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2); ctx.fill();
        } else {
          ctx.fillStyle = b.colour;
          ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2); ctx.fill();
        }
      }

      if (S.dragging) {
        ctx.strokeStyle = 'rgba(255, 210, 138, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(S.dragStart.x, S.dragStart.y);
        ctx.lineTo(S.dragCurrent.x, S.dragCurrent.y);
        ctx.stroke();
        ctx.setLineDash([]);
        const t = TYPES[S.placeType];
        ctx.fillStyle = t.colour;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(S.dragStart.x, S.dragStart.y, Math.max(2, Math.cbrt(t.mass) * 1.8), 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    /* ── input ────────────────────────── */
    const getCoords = e => {
      const r = canvas.getBoundingClientRect();
      const t = e.touches?.[0] ?? e;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    };
    const onDown = e => {
      S.dragStart   = getCoords(e);
      S.dragCurrent = { ...S.dragStart };
      S.dragging    = true;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = e => { if (S.dragging) S.dragCurrent = getCoords(e); };
    const onUp   = e => {
      if (!S.dragging) return;
      const end = getCoords(e);
      const vx = (end.x - S.dragStart.x) * 0.03;
      const vy = (end.y - S.dragStart.y) * 0.03;
      S.bodies.push(makeBody(S.dragStart.x, S.dragStart.y, vx, vy, S.placeType));
      S.dragging = false;
      setHideHint(true);
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup',   onUp);

    /* ── scenarios ──────────────────── */
    const SCENARIOS = {
      binary() {
        S.bodies = []; S.trails.clear(); S.tick = 0;
        const cx = S.W / 2, cy = S.H / 2;
        S.bodies.push(makeBody(cx - 60, cy, 0, -1.4, 'star'));
        S.bodies.push(makeBody(cx + 60, cy, 0,  1.4, 'star'));
      },
      solar() {
        S.bodies = []; S.trails.clear(); S.tick = 0;
        const cx = S.W / 2, cy = S.H / 2;
        S.bodies.push(makeBody(cx, cy, 0, 0, 'star'));
        [60, 110, 170, 240].forEach((d, i) => {
          const v   = [1.55, 1.18, 0.95, 0.80][i];
          const ang = Math.random() * Math.PI * 2;
          S.bodies.push(makeBody(
            cx + Math.cos(ang) * d,
            cy + Math.sin(ang) * d,
            -Math.sin(ang) * v,
             Math.cos(ang) * v,
            'planet',
          ));
        });
      },
      threebody() {
        S.bodies = []; S.trails.clear(); S.tick = 0;
        const cx = S.W / 2, cy = S.H / 2, r = 70;
        for (let i = 0; i < 3; i++) {
          const ang = (i / 3) * Math.PI * 2 - Math.PI / 2;
          S.bodies.push(makeBody(
            cx + Math.cos(ang) * r,
            cy + Math.sin(ang) * r,
            -Math.sin(ang) * 0.6,
             Math.cos(ang) * 0.6,
            'star',
          ));
        }
      },
      bh() {
        S.bodies = []; S.trails.clear(); S.tick = 0;
        const cx = S.W / 2, cy = S.H / 2;
        S.bodies.push(makeBody(cx, cy, 0, 0, 'blackhole'));
        for (let i = 0; i < 8; i++) {
          const ang = Math.random() * Math.PI * 2;
          const d   = 90 + Math.random() * 140;
          const v   = Math.sqrt((G * 1800) / d);
          S.bodies.push(makeBody(
            cx + Math.cos(ang) * d,
            cy + Math.sin(ang) * d,
            -Math.sin(ang) * v * (0.9 + Math.random() * 0.2),
             Math.cos(ang) * v * (0.9 + Math.random() * 0.2),
            Math.random() < 0.4 ? 'star' : 'planet',
          ));
        }
      },
    };

    // expose to the JSX buttons
    canvas._scenarios = SCENARIOS;
    canvas._clear = () => {
      S.bodies = []; S.trails.clear(); S.tick = 0;
      setHideHint(false);
    };

    /* ── loop ────────────────────────── */
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!S.paused) step(DT * S.speedMult);
      draw();
      if (S.tick % 6 === 0) {
        setStats({
          count: S.bodies.length,
          mass:  Math.round(S.bodies.reduce((s, b) => s + b.mass, 0)),
          tick:  S.tick,
        });
      }
    };

    // kick off with a small solar system
    setTimeout(() => SCENARIOS.solar(), 100);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup',   onUp);
    };
  }, []);

  const runScenario = name => {
    canvasRef.current?._scenarios?.[name]?.();
    setHideHint(true);
  };
  const clear = () => canvasRef.current?._clear?.();

  return (
    <section className="sim-section">
      <div className="sim-stage" ref={stageRef}>
        <canvas id="sim-canvas" ref={canvasRef} className="sim-canvas" />
        {!hideHint && (
          <div className="sim-hint">
            <strong>Click and drag</strong> anywhere to launch a body.<br/>
            Direction and length of the drag set the initial velocity.
          </div>
        )}
        <div className="sim-stats" id="sim-stats">
          <span>Bodies <strong>{stats.count}</strong></span>
          <span>Mass <strong>{stats.mass}</strong></span>
          <span>Tick <strong>{stats.tick}</strong></span>
        </div>
      </div>

      <div className="sim-panel">
        <div className="sim-control-block">
          <div className="sim-control-label">Place</div>
          <div className="sim-control-row">
            {['planet','moon','star','blackhole'].map(t => (
              <button key={t}
                className={`sim-btn ${placeType === t ? 'active' : ''}`}
                onClick={() => setPlaceType(t)}
              >{t === 'blackhole' ? 'black hole' : t}</button>
            ))}
          </div>
        </div>

        <div className="sim-control-block">
          <div className="sim-control-label">Scenarios</div>
          <div className="sim-control-row">
            <button className="sim-btn" onClick={() => runScenario('binary')}>Binary stars</button>
            <button className="sim-btn" onClick={() => runScenario('solar')}>Solar system</button>
            <button className="sim-btn" onClick={() => runScenario('threebody')}>Three-body</button>
            <button className="sim-btn" onClick={() => runScenario('bh')}>Black hole</button>
          </div>
        </div>

        <div className="sim-control-block">
          <div className="sim-control-label">Speed</div>
          <div className="sim-control-row">
            {[0.5, 1, 2, 4].map(s => (
              <button key={s}
                className={`sim-btn ${speedMult === s ? 'active' : ''}`}
                onClick={() => setSpeedMult(s)}
              >{s}×</button>
            ))}
          </div>
        </div>

        <div className="sim-control-block">
          <div className="sim-control-label">Options</div>
          <div className="sim-control-row">
            <label className="sim-toggle">
              <input type="checkbox" checked={trailsOn} onChange={e => setTrailsOn(e.target.checked)} />
              Trails
            </label>
            <label className="sim-toggle">
              <input type="checkbox" checked={collisionsOn} onChange={e => setCollisionsOn(e.target.checked)} />
              Collisions
            </label>
          </div>
        </div>

        <div className="sim-control-block">
          <div className="sim-control-row">
            <button className="sim-btn" onClick={() => setPaused(p => !p)}>
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button className="sim-btn" onClick={clear}>Clear</button>
          </div>
        </div>
      </div>
    </section>
  );
}
