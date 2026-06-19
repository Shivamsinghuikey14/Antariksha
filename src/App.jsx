import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout         from './components/Layout.jsx';
import { I18nProvider } from './i18n/i18n.jsx';
import { LightboxProvider } from './components/ui/Lightbox.jsx';

// Pages
import Home          from './pages/Home.jsx';
import SolarSystem   from './pages/SolarSystem.jsx';
import Planets       from './pages/Planets.jsx';
import PlanetDetail  from './pages/PlanetDetail.jsx';
import Sun           from './pages/Sun.jsx';
import Moon          from './pages/Moon.jsx';
import Moons         from './pages/Moons.jsx';
import Stars         from './pages/Stars.jsx';
import Exoplanets    from './pages/Exoplanets.jsx';
import Universe      from './pages/Universe.jsx';
import Nebulae       from './pages/Nebulae.jsx';
import Galaxies      from './pages/Galaxies.jsx';
import MilkyWay      from './pages/MilkyWay.jsx';
import BlackHoles    from './pages/BlackHoles.jsx';
import Constellations from './pages/Constellations.jsx';
import Agencies      from './pages/Agencies.jsx';
import Spacecraft    from './pages/Spacecraft.jsx';
import Astronauts    from './pages/Astronauts.jsx';
import SpaceWeather  from './pages/SpaceWeather.jsx';
import CosmicCalendar from './pages/CosmicCalendar.jsx';
import SkyMap        from './pages/SkyMap.jsx';
import MarsTime       from './pages/MarsTime.jsx';
import Scale          from './pages/Scale.jsx';
import LightPollution from './pages/LightPollution.jsx';
import BlackHoleFall  from './pages/BlackHoleFall.jsx';
import JwstFeed       from './pages/JwstFeed.jsx';
import Galaxy3D       from './pages/Galaxy3D.jsx';
import SolarSystemFull from './pages/SolarSystemFull.jsx';
import PlanetWeather  from './pages/PlanetWeather.jsx';
import Favorites      from './pages/Favorites.jsx';

import Asteroids     from './pages/Asteroids.jsx';
import Comets        from './pages/Comets.jsx';
import Missions      from './pages/Missions.jsx';
import Mars          from './pages/Mars.jsx';
import ISS           from './pages/ISS.jsx';
import JWST          from './pages/JWST.jsx';
import Telescopes    from './pages/Telescopes.jsx';
import Simulator     from './pages/Simulator.jsx';
import Archive       from './pages/Archive.jsx';
import About         from './pages/About.jsx';
import NotFound      from './pages/NotFound.jsx';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <I18nProvider><LightboxProvider>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/solar-system"   element={<SolarSystem />} />
          <Route path="/planets"        element={<Planets />} />
          <Route path="/planets/:id"    element={<PlanetDetail />} />
          <Route path="/sun"            element={<Sun />} />
          <Route path="/moon"           element={<Moon />} />
          <Route path="/moons"          element={<Moons />} />
          <Route path="/stars"          element={<Stars />} />
          <Route path="/exoplanets"     element={<Exoplanets />} />
          <Route path="/universe"       element={<Universe />} />
          <Route path="/nebulae"        element={<Nebulae />} />
          <Route path="/galaxies"       element={<Galaxies />} />
          <Route path="/milkyway"       element={<MilkyWay />} />
          <Route path="/blackholes"     element={<BlackHoles />} />
          <Route path="/constellations" element={<Constellations />} />
          <Route path="/agencies"       element={<Agencies />} />
          <Route path="/spacecraft"      element={<Spacecraft />} />
          <Route path="/astronauts"      element={<Astronauts />} />
          <Route path="/space-weather"   element={<SpaceWeather />} />
          <Route path="/cosmic-calendar" element={<CosmicCalendar />} />
          <Route path="/skymap"          element={<SkyMap />} />
          <Route path="/mars-time"        element={<MarsTime />} />
          <Route path="/scale"            element={<Scale />} />
          <Route path="/light-pollution"  element={<LightPollution />} />
          <Route path="/fall"             element={<BlackHoleFall />} />
          <Route path="/jwst-feed"        element={<JwstFeed />} />
          <Route path="/solar-system-3d" element={<SolarSystemFull />} />
          <Route path="/galaxy-3d"        element={<Galaxy3D />} />
          <Route path="/planet-weather"   element={<PlanetWeather />} />
          <Route path="/favorites"        element={<Favorites />} />

          <Route path="/asteroids"      element={<Asteroids />} />
          <Route path="/comets"         element={<Comets />} />
          <Route path="/missions"       element={<Missions />} />
          <Route path="/mars"           element={<Mars />} />
          <Route path="/iss"            element={<ISS />} />
          <Route path="/jwst"           element={<JWST />} />
          <Route path="/telescopes"     element={<Telescopes />} />
          <Route path="/simulator"      element={<Simulator />} />
          <Route path="/archive"        element={<Archive />} />
          <Route path="/about"          element={<About />} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
      </Layout>
    </LightboxProvider></I18nProvider>
  );
}
