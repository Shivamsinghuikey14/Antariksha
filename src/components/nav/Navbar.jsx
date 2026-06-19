import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LangSwitcher from '../ui/LangSwitcher.jsx';

const NAV = [
  { name: 'Solar System', to: '/solar-system',
    paths: ['/solar-system','/planets','/sun','/moon','/moons','/asteroids','/comets','/exoplanets'] },
  { name: 'Deep Sky',     to: '/universe',
    paths: ['/universe','/stars','/constellations','/nebulae','/galaxies','/milkyway','/blackholes','/skymap'] },
  { name: 'Live',         to: '/missions',
    paths: ['/missions','/iss','/astronauts','/space-weather','/telescopes','/spacecraft','/agencies','/jwst','/mars'] },
  { name: 'Tools',        to: '/simulator',
    paths: ['/simulator','/cosmic-calendar','/archive'] },
];

// Mobile menu uses the same flat lists that hub pages display
const MOBILE_GROUPS = [
  { name: 'Solar System', hub: '/solar-system', items: [
    ['/planets',     'Planets'], ['/sun', 'The Sun'], ['/moon', 'The Moon'],
    ['/moons',       'All Moons'], ['/asteroids', 'Asteroids'],
    ['/comets',      'Comets & Meteors'], ['/exoplanets', 'Exoplanets'],
  ]},
  { name: 'Deep Sky', hub: '/universe', items: [
    ['/stars',          'Stars'], ['/constellations', 'Constellations'],
    ['/nebulae',        'Nebulae'], ['/galaxies', 'Galaxies'],
    ['/milkyway',       'The Milky Way'], ['/blackholes', 'Black Holes'],
    ['/skymap',         'Sky Map'],
  ]},
  { name: 'Live', hub: '/missions', items: [
    ['/iss',           'ISS Tracker'], ['/astronauts', 'People in Space'],
    ['/space-weather', 'Space Weather'], ['/telescopes', 'Telescopes & Feeds'],
    ['/spacecraft',    'Spacecraft'], ['/agencies', 'Space Agencies'],
    ['/jwst',          'James Webb'], ['/mars', 'Mars Rovers'],
  ]},
  { name: 'Tools', hub: '/simulator', items: [
    ['/cosmic-calendar', 'Cosmic Calendar'], ['/archive', 'Image Archive'],
  ]},
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time,       setTime]       = useState('');
  const { pathname } = useLocation();

  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().slice(11, 19) + ' UTC');
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.classList.toggle('nav-locked', mobileOpen);
    return () => document.body.classList.remove('nav-locked');
  }, [mobileOpen]);
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = e => e.key === 'Escape' && setMobileOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <>
      <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="brand" aria-label="AETHER home">
          <span className="brand-mark">✦</span>
          <span className="brand-word">AETHER</span>
        </Link>

        <nav className="nav-desktop" aria-label="Main navigation">
          <ul className="nav-root">
            {NAV.map(group => {
              const onCurrent = group.paths.includes(pathname);
              return (
                <li key={group.name} className="nav-item">
                  <Link to={group.to} className={`nav-link ${onCurrent ? 'on' : ''}`}>
                    {group.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="topbar-right">
          <Link to="/favorites" className="topbar-fav" aria-label="Bookmarks">★</Link>
          <LangSwitcher />
          <div className="live-pill" aria-hidden="true">
            <span className="dot"></span>
            <span>{time}</span>
          </div>
          <button
            type="button"
            className={`nav-burger ${mobileOpen ? 'open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(v => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div
        className={`nav-mobile ${mobileOpen ? 'open' : ''}`}
        aria-hidden={!mobileOpen}
        onClick={e => e.target === e.currentTarget && setMobileOpen(false)}
      >
        <div className="nm-inner">
          {MOBILE_GROUPS.map(group => (
            <div key={group.name} className="nm-group">
              <Link to={group.hub} className="nm-group-h">{group.name}</Link>
              {group.items.map(([to, label]) => (
                <Link key={to} to={to}>{label}</Link>
              ))}
            </div>
          ))}
          <div className="nm-group">
            <Link to="/about" className="nm-group-h">About</Link>
          </div>
        </div>
      </div>
    </>
  );
}
