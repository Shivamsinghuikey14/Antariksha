/**
 * Catalogue of notable stars — the brightest, nearest, biggest,
 * most studied, and most culturally significant stars in our sky.
 * Distance in light-years (ly). Mass and radius in solar units (☉).
 */

export const STARS = [
  // ───────── Bright stars
  {
    id: 'sirius', name: 'Sirius A', also: 'Alpha Canis Majoris', constellation: 'Canis Major',
    distance: '8.6 ly', mass: '2.06 ☉', radius: '1.7 ☉', temp: '9,940 K',
    type: 'A1V (main sequence)', apparentMag: '-1.46', tagline: 'The brightest star in the night sky',
    description: 'Twice the mass of the Sun and 25 times more luminous. Has a faint white dwarf companion, Sirius B, discovered in 1862.',
  },
  {
    id: 'canopus', name: 'Canopus', also: 'Alpha Carinae', constellation: 'Carina',
    distance: '310 ly', mass: '8 ☉', radius: '71 ☉', temp: '7,400 K',
    type: 'A9 II (bright giant)', apparentMag: '-0.74', tagline: 'The second-brightest star in the sky',
    description: 'A yellow-white supergiant 10,000 times more luminous than the Sun. Used by deep-space probes for navigation.',
  },
  {
    id: 'arcturus', name: 'Arcturus', also: 'Alpha Boötis', constellation: 'Boötes',
    distance: '36.7 ly', mass: '1.1 ☉', radius: '25.4 ☉', temp: '4,286 K',
    type: 'K0 III (red giant)', apparentMag: '-0.05', tagline: 'The fourth-brightest star',
    description: 'An aging red giant on the way to becoming a planetary nebula. The first star ever seen in daylight through a telescope (Jean-Baptiste Morin, 1635).',
  },
  {
    id: 'vega', name: 'Vega', also: 'Alpha Lyrae', constellation: 'Lyra',
    distance: '25 ly', mass: '2.1 ☉', radius: '2.4 ☉', temp: '9,602 K',
    type: 'A0V (main sequence)', apparentMag: '0.03', tagline: 'The northern pole star — in 12,000 years',
    description: 'A young, fast-rotating star surrounded by a dusty disk that may contain planets. Earth\'s axial precession will make Vega the pole star around 13,727 AD.',
  },
  {
    id: 'capella', name: 'Capella', also: 'Alpha Aurigae', constellation: 'Auriga',
    distance: '42.9 ly', mass: '2.5 + 2.6 ☉', radius: '11 + 8.8 ☉', temp: '4,970 K',
    type: 'Spectroscopic binary (G + G)', apparentMag: '0.08', tagline: 'A pair posing as one',
    description: 'Actually two pairs — a close binary of yellow giants plus two distant red dwarfs. Appears as a single bright star.',
  },
  {
    id: 'rigel', name: 'Rigel', also: 'Beta Orionis', constellation: 'Orion',
    distance: '~860 ly', mass: '21 ☉', radius: '78.9 ☉', temp: '12,100 K',
    type: 'B8 Ia (blue supergiant)', apparentMag: '0.13', tagline: 'Orion\'s blue-white knee',
    description: 'A blue supergiant 120,000 times more luminous than the Sun. Will end its life as a supernova within a few million years.',
  },
  {
    id: 'betelgeuse', name: 'Betelgeuse', also: 'Alpha Orionis', constellation: 'Orion',
    distance: '~640 ly', mass: '17 ☉', radius: '887 ☉', temp: '3,600 K',
    type: 'M1-2 Ia (red supergiant)', apparentMag: '0.42 (variable)', tagline: 'The shoulder of Orion — and a future supernova',
    description: 'If Betelgeuse were at our Sun\'s position, it would extend past the orbit of Jupiter. Mysteriously dimmed in 2019-20 — eventually it will explode as a supernova, possibly tomorrow, possibly in 100,000 years.',
  },
  {
    id: 'polaris', name: 'Polaris', also: 'Alpha Ursae Minoris', constellation: 'Ursa Minor',
    distance: '433 ly', mass: '5.4 ☉', radius: '37.5 ☉', temp: '6,015 K',
    type: 'F7 Ib (yellow supergiant)', apparentMag: '1.98 (variable)', tagline: 'The North Star',
    description: 'Currently within one degree of the celestial north pole — it appears to barely move while everything else wheels around it. Will lose this distinction over the next millennia due to Earth\'s precession.',
  },
  {
    id: 'antares', name: 'Antares', also: 'Alpha Scorpii', constellation: 'Scorpius',
    distance: '~550 ly', mass: '12 ☉', radius: '680 ☉', temp: '3,660 K',
    type: 'M1 Iab (red supergiant)', apparentMag: '1.06', tagline: 'The heart of the Scorpion',
    description: 'A red supergiant whose name means "rival of Mars" for its red colour. Will end as a supernova.',
  },
  {
    id: 'aldebaran', name: 'Aldebaran', also: 'Alpha Tauri', constellation: 'Taurus',
    distance: '65.3 ly', mass: '1.16 ☉', radius: '44 ☉', temp: '3,910 K',
    type: 'K5 III (red giant)', apparentMag: '0.86', tagline: 'The eye of the Bull',
    description: 'An aging red giant 400 times more luminous than the Sun. Pioneer 10 will pass close to it in about 2 million years.',
  },

  // ───────── Nearest stars
  {
    id: 'proxima', name: 'Proxima Centauri', also: 'V645 Cen', constellation: 'Centaurus',
    distance: '4.246 ly', mass: '0.12 ☉', radius: '0.14 ☉', temp: '3,042 K',
    type: 'M5.5Ve (red dwarf)', apparentMag: '11.13', tagline: 'The closest star to the Sun',
    description: 'A small red dwarf with at least three known planets — including Proxima Centauri b, a roughly Earth-mass world in the habitable zone. Subject of the Breakthrough Starshot proposal to send light-sail probes there.',
  },
  {
    id: 'alpha-cen-a', name: 'Alpha Centauri A', constellation: 'Centaurus',
    distance: '4.37 ly', mass: '1.1 ☉', radius: '1.22 ☉', temp: '5,790 K',
    type: 'G2V (sun-like)', apparentMag: '-0.01', tagline: 'Our nearest sun-like neighbour',
    description: 'Nearly identical to our Sun. Forms a binary with Alpha Centauri B; together with Proxima they form the closest stellar system to ours.',
  },
  {
    id: 'barnard', name: "Barnard's Star", constellation: 'Ophiuchus',
    distance: '5.96 ly', mass: '0.144 ☉', radius: '0.196 ☉', temp: '3,134 K',
    type: 'M4V (red dwarf)', apparentMag: '9.5', tagline: 'The fastest-moving star',
    description: 'Crosses the sky at 10.3 arcseconds per year — half a full moon\'s width per century. Will pass within 3.75 ly of the Sun around 11,800 AD, becoming the closest known star at that time.',
  },

  // ───────── Extreme stars
  {
    id: 'r136a1', name: 'R136a1', constellation: 'Dorado (LMC)',
    distance: '~163,000 ly', mass: '~196 ☉', radius: '~28 ☉', temp: '53,000 K',
    type: 'WN5h (Wolf-Rayet)', apparentMag: '12.23', tagline: 'The most massive known star',
    description: 'Located in the Tarantula Nebula in the Large Magellanic Cloud. Roughly 196 times the Sun\'s mass — close to the theoretical upper limit. Loses mass at the rate of one Earth every month via stellar wind.',
  },
  {
    id: 'uy-scuti', name: 'UY Scuti', constellation: 'Scutum',
    distance: '~5,100 ly', mass: '7-10 ☉', radius: '~1,700 ☉', temp: '3,365 K',
    type: 'M2-M4 Ia (red hypergiant)', apparentMag: '~9 (variable)', tagline: 'One of the largest known stars',
    description: 'If placed at our Sun\'s position, would extend nearly to Saturn\'s orbit. Among the largest stars by radius known to astronomy.',
  },
  {
    id: 'eta-carinae', name: 'Eta Carinae', constellation: 'Carina',
    distance: '~7,500 ly', mass: '~100 + ~30 ☉', radius: '~240 ☉', temp: '~25,000 K',
    type: 'LBV (luminous blue variable)', apparentMag: '4.3 (highly variable)', tagline: 'The next supernova candidate',
    description: 'A wildly unstable supergiant binary that nearly exploded in 1843 — for a decade, the second-brightest star in the sky. Surrounded by the Homunculus Nebula of ejected material. Will explode as a supernova or hypernova at any time.',
  },
];
