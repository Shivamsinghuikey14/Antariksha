/**
 * Catalogue of significant moons in the solar system.
 * Data drawn from NASA, JPL Solar System Dynamics, and IAU.
 * Where a moon has been visited by spacecraft, that visit is noted.
 */

export const MOONS = [
  // ───────── Earth
  {
    id: 'luna', name: 'Luna (The Moon)', parent: 'Earth', diameter: '3,474 km',
    discovered: 'Known to ancient civilisations', tagline: 'Earth\'s companion',
    notable: 'The only object beyond Earth on which humans have walked.',
    facts: 'Twelve humans landed here between 1969 and 1972 (Apollo 11–17). Continuously moves 3.8 cm farther from Earth each year. Likely formed from debris of a giant Mars-sized impact 4.5 billion years ago.',
    detailPage: '/moon',
  },

  // ───────── Mars
  {
    id: 'phobos', name: 'Phobos', parent: 'Mars', diameter: '22 km',
    discovered: 'Asaph Hall, 1877', tagline: 'The doomed moon',
    notable: 'Orbits below the synchronous altitude — falling.',
    facts: 'Orbits Mars in 7h 39m, faster than Mars itself spins. Spirals inward by 2 cm per year. Will crash into Mars (or shatter into a ring) within 50 million years.',
  },
  {
    id: 'deimos', name: 'Deimos', parent: 'Mars', diameter: '12 km',
    discovered: 'Asaph Hall, 1877', tagline: 'The small terror',
    notable: 'Mars\'s outer, smaller moon. Likely a captured asteroid.',
    facts: 'Named for the Greek god of dread. Orbits Mars in 30 hours and is slowly receding.',
  },

  // ───────── Jupiter (Galilean + notable irregulars)
  {
    id: 'io', name: 'Io', parent: 'Jupiter', diameter: '3,643 km',
    discovered: 'Galileo Galilei, 1610', tagline: 'Hell\'s portrait',
    notable: 'The most volcanically active body in the solar system.',
    facts: 'Over 400 active volcanoes. Surface is constantly resurfaced by lava. Sulphur dioxide gives it its yellow-red appearance. Its volcanism is powered by tidal heating from Jupiter\'s gravity.',
  },
  {
    id: 'europa', name: 'Europa', parent: 'Jupiter', diameter: '3,122 km',
    discovered: 'Galileo Galilei, 1610', tagline: 'The hidden ocean',
    notable: 'A subsurface ocean of liquid water — perhaps twice the volume of Earth\'s.',
    facts: 'Smooth icy crust criss-crossed by red-brown fractures. Underneath: liquid water in contact with rocky seafloor, where life is conceivable. NASA\'s Europa Clipper will explore in detail (arrival 2030).',
  },
  {
    id: 'ganymede', name: 'Ganymede', parent: 'Jupiter', diameter: '5,268 km',
    discovered: 'Galileo Galilei, 1610', tagline: 'The largest moon',
    notable: 'Larger than Mercury. The only moon with its own magnetic field.',
    facts: 'Composed of equal parts silicate rock and water ice. Subsurface ocean. ESA\'s JUICE mission (launched 2023) will orbit it in 2034.',
  },
  {
    id: 'callisto', name: 'Callisto', parent: 'Jupiter', diameter: '4,821 km',
    discovered: 'Galileo Galilei, 1610', tagline: 'The crater-covered',
    notable: 'The most heavily cratered object in the solar system.',
    facts: 'Composed of roughly equal parts ice and rock. Has the lowest density of the four Galilean moons. May also harbour a subsurface ocean.',
  },

  // ───────── Saturn
  {
    id: 'titan', name: 'Titan', parent: 'Saturn', diameter: '5,150 km',
    discovered: 'Christiaan Huygens, 1655', tagline: 'The world with weather',
    notable: 'The only moon with a thick atmosphere and stable liquid on its surface.',
    facts: 'Larger than Mercury. Atmosphere: 95% nitrogen, denser than Earth\'s. Lakes and rivers of liquid methane and ethane. ESA\'s Huygens probe landed in 2005 — the most distant landing ever. NASA\'s Dragonfly drone arrives 2034.',
  },
  {
    id: 'enceladus', name: 'Enceladus', parent: 'Saturn', diameter: '504 km',
    discovered: 'William Herschel, 1789', tagline: 'The geyser moon',
    notable: 'Shoots geysers of water from a global subsurface ocean.',
    facts: 'Surface reflects 99% of sunlight — the whitest object in the solar system. Cassini detected complex organic molecules in the water plumes. A prime target for life beyond Earth.',
  },
  {
    id: 'mimas', name: 'Mimas', parent: 'Saturn', diameter: '396 km',
    discovered: 'William Herschel, 1789', tagline: 'The Death Star moon',
    notable: 'Dominated by the 130 km Herschel crater — looks like the Death Star.',
    facts: 'Cassini data suggests a subsurface ocean beneath its battered ice shell.',
  },
  {
    id: 'iapetus', name: 'Iapetus', parent: 'Saturn', diameter: '1,469 km',
    discovered: 'Giovanni Cassini, 1671', tagline: 'The two-faced',
    notable: 'One hemisphere is dark as coal, the other bright as snow.',
    facts: 'Has a 20 km-tall equatorial ridge — taller than Olympus Mons — wrapping nearly halfway around it. Nobody is quite sure why.',
  },
  {
    id: 'rhea', name: 'Rhea', parent: 'Saturn', diameter: '1,527 km',
    discovered: 'Giovanni Cassini, 1672', tagline: 'Saturn\'s second-largest',
    notable: 'May have its own faint ring system.',
    facts: 'A heavily cratered ice world. Hints of a tenuous oxygen atmosphere were detected by Cassini.',
  },

  // ───────── Uranus
  {
    id: 'miranda', name: 'Miranda', parent: 'Uranus', diameter: '472 km',
    discovered: 'Gerard Kuiper, 1948', tagline: 'The patchwork',
    notable: 'A bizarre patchwork of terrains — possibly the wreckage of an earlier collision.',
    facts: 'Cliffs up to 20 km high — among the tallest in the solar system. Named for a character in Shakespeare\'s The Tempest.',
  },
  {
    id: 'titania', name: 'Titania', parent: 'Uranus', diameter: '1,578 km',
    discovered: 'William Herschel, 1787', tagline: 'Uranus\'s largest',
    notable: 'Vast canyons longer than any on Earth.',
    facts: 'Named after the queen of the fairies in Shakespeare\'s A Midsummer Night\'s Dream.',
  },
  {
    id: 'oberon', name: 'Oberon', parent: 'Uranus', diameter: '1,523 km',
    discovered: 'William Herschel, 1787', tagline: 'The outermost large moon',
    notable: 'Reddish surface heavily marked with impact craters.',
    facts: 'Named after the king of the fairies, partner to Titania.',
  },
  {
    id: 'ariel', name: 'Ariel', parent: 'Uranus', diameter: '1,158 km',
    discovered: 'William Lassell, 1851', tagline: 'The brightest',
    notable: 'The brightest of Uranus\'s major moons.',
    facts: 'Shows evidence of recent geological activity — younger surface than its siblings.',
  },

  // ───────── Neptune
  {
    id: 'triton', name: 'Triton', parent: 'Neptune', diameter: '2,710 km',
    discovered: 'William Lassell, 1846', tagline: 'The captured stranger',
    notable: 'Orbits backwards — almost certainly a captured Kuiper Belt object.',
    facts: 'The seventh-largest moon. Nitrogen ice geysers shoot 8 km above the surface. -235 °C — the coldest known object in the solar system with geological activity.',
  },
  {
    id: 'nereid', name: 'Nereid', parent: 'Neptune', diameter: '340 km',
    discovered: 'Gerard Kuiper, 1949', tagline: 'The wanderer',
    notable: 'One of the most eccentric orbits of any large moon.',
    facts: 'Travels between 1.4 million km and 9.6 million km from Neptune.',
  },

  // ───────── Pluto (dwarf planet)
  {
    id: 'charon', name: 'Charon', parent: 'Pluto', diameter: '1,212 km',
    discovered: 'James Christy, 1978', tagline: 'Pluto\'s companion',
    notable: 'Half the size of Pluto — they orbit a common centre outside Pluto itself.',
    facts: 'Mapped in 2015 by New Horizons. Has its own polar ice cap of red tholins from Pluto\'s atmosphere.',
  },
];

export const MOONS_BY_PARENT = MOONS.reduce((acc, m) => {
  (acc[m.parent] = acc[m.parent] || []).push(m);
  return acc;
}, {});
