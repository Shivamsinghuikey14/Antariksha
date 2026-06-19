import { Link } from 'react-router-dom';

const SITEMAP = [
  ['Solar System', [
    ['/solar-system',    '3D Solar System'],
    ['/solar-system-3d', 'Real 3D Model'],
    ['/planets',         'Planets'],
    ['/sun',             'The Sun'],
    ['/moon',            'The Moon'],
    ['/moons',           'All Moons'],
    ['/asteroids',       'Asteroids'],
    ['/comets',          'Comets & Meteors'],
    ['/exoplanets',      'Exoplanets'],
    ['/planet-weather',  'Planet Weather'],
    ['/scale',           'Solar System to Scale'],
  ]],
  ['Deep Sky', [
    ['/stars',           'Stars'],
    ['/constellations',  'Constellations'],
    ['/nebulae',         'Nebulae'],
    ['/galaxies',        'Galaxies'],
    ['/milkyway',        'The Milky Way'],
    ['/blackholes',      'Black Holes'],
    ['/universe',        'The Universe'],
    ['/skymap',          'Interactive Sky Map'],
    ['/galaxy-3d',       'Milky Way in 3D'],
    ['/fall',            'Fall Into a Black Hole'],
  ]],
  ['Live & Missions', [
    ['/iss',             'ISS Tracker'],
    ['/astronauts',      'People in Space'],
    ['/space-weather',   'Space Weather'],
    ['/telescopes',      'Telescopes & Feeds'],
    ['/missions',        'Launches'],
    ['/spacecraft',      'Spacecraft & Missions'],
    ['/agencies',        'Space Agencies'],
    ['/jwst',            'James Webb'],
    ['/jwst-feed',       'JWST Image Feed'],
    ['/mars',            'Mars Rovers'],
    ['/mars-time',       'Mars Time Clock'],
  ]],
  ['Tools & More', [
    ['/simulator',        'Gravity Simulator'],
    ['/cosmic-calendar',  'Cosmic Calendar'],
    ['/archive',          'NASA Image Archive'],
    ['/light-pollution',  'Light Pollution Map'],
    ['/favorites',        'Bookmarks'],
    ['/about',            'About AETHER'],
  ]],
];

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-sitemap">
        {SITEMAP.map(([heading, links]) => (
          <div key={heading} className="foot-col">
            <div className="foot-col-h">{heading}</div>
            <ul>
              {links.map(([to, label]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="foot-cosmos">
        <div className="foot-mark">AETHER</div>
        <div className="foot-tag">a complete heaven for space lovers</div>
        <div className="foot-credits">
          Data: NASA · ESA · JAXA · NOAA SWPC · Open Notify · Sunrise-Sunset.org · SpaceX · The Space Devs<br/>
          Imagery: NASA · Hubble · JWST · ESO · Wikipedia · Wikimedia Commons<br/>
          Sky map: Aladin Lite (CDS Strasbourg) · Light pollution: lightpollutionmap.info<br/>
          Code: Open source. MIT licence.
        </div>
        <p className="foot-sub">A complete heaven for space lovers · free forever · open source</p>
      </div>
    </footer>
  );
}
