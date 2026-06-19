import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const LightboxCtx = createContext(null);

export function LightboxProvider({ children }) {
  const [open, setOpen]   = useState(false);
  const [src, setSrc]     = useState('');
  const [cap, setCap]     = useState('');

  const openLightbox = useCallback((source, caption = '') => {
    setSrc(source);
    setCap(caption);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') close(); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
    <LightboxCtx.Provider value={{ openLightbox, close }}>
      {children}
      <div
        className={`lightbox ${open ? 'active' : ''}`}
        role="dialog"
        aria-hidden={!open}
        onClick={e => e.target === e.currentTarget && close()}
      >
        <button className="lightbox-close" aria-label="Close" onClick={close}>×</button>
        {src && <img src={src} alt={cap} />}
        {cap && <div className="lightbox-caption">{cap}</div>}
      </div>
    </LightboxCtx.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxCtx);
  // Tolerant fallback — if used outside provider, return no-ops
  return ctx ?? { openLightbox: () => {}, close: () => {} };
}

// Required exports for App.jsx and Layout.jsx
export default { Portal: () => null };
