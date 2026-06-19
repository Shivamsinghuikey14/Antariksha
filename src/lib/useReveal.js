import { useEffect } from 'react';

/**
 * Attaches an IntersectionObserver to all `.reveal` elements within the
 * current page. Adds both `.visible` and `.in` (legacy name from the
 * pre-React build) when they scroll into view.
 *
 * The CSS base state is opacity:1, so even if this hook never fires,
 * content remains visible. The classes only add a subtle entrance
 * transition — never a "must run or content is hidden" dependency.
 *
 * After 2 seconds we also force the reveal on every remaining element
 * as a final safety net (covers exotic edge cases like browsers without
 * IntersectionObserver).
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const reveal = el => { el.classList.add('visible'); el.classList.add('in'); };

    let timeoutId;

    if (typeof IntersectionObserver === 'function') {
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) {
            reveal(e.target);
            obs.unobserve(e.target);
          }
        }),
        { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
      );
      document.querySelectorAll('.reveal').forEach(el => {
        if (!el.classList.contains('visible')) obs.observe(el);
      });

      // Failsafe — after 2 seconds, reveal anything still hidden.
      timeoutId = setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(reveal);
      }, 2000);

      return () => {
        obs.disconnect();
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    // Fallback for any environment without IntersectionObserver
    document.querySelectorAll('.reveal').forEach(reveal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
