import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef   = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const c = dotRef.current;
    const t = trailRef.current;
    if (!c || !t) return;

    // Disable on touch devices
    if (matchMedia('(hover: none)').matches) {
      c.style.display = t.style.display = 'none';
      return;
    }

    let mx = -100, my = -100, tx = -100, ty = -100, raf;

    const onMove = e => {
      mx = e.clientX;
      my = e.clientY;
      c.style.left = mx + 'px';
      c.style.top  = my + 'px';
    };

    const onHoverIn  = () => { c.classList.add('big');  t.classList.add('big');  };
    const onHoverOut = () => { c.classList.remove('big'); t.classList.remove('big'); };

    const lerp = () => {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      t.style.left = tx + 'px';
      t.style.top  = ty + 'px';
      raf = requestAnimationFrame(lerp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', e => {
      const target = e.target;
      if (target.closest('a, button, .gw-card, .gal-card, .gw-arrow, .scope-img, .moon-card, .star-card, .exo-card, .planet-nav-item, .gateway-card')) onHoverIn();
      else onHoverOut();
    });

    lerp();
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <div id="cursor-trail" ref={trailRef} />
      <div id="cursor" ref={dotRef} />
    </>
  );
}
