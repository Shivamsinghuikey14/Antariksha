import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    let w, h, stars, raf;
    function resize() {
      w = c.width  = innerWidth;
      h = c.height = innerHeight;
      const n = Math.floor(w * h / 3000);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.5 + 0.2,
        twinkle: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const alpha = s.a + Math.sin(t * s.twinkle + s.phase) * 0.25;
        ctx.fillStyle = `rgba(239, 234, 224, ${Math.max(0.05, alpha)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    addEventListener('resize', resize);
    draw(0);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
    };
  }, []);

  return <canvas id="bg-stars" ref={canvasRef} />;
}
