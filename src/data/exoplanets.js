/**
 * Curated catalogue of notable exoplanets — confirmed habitable-zone
 * candidates, record-holders, and famous discoveries.
 * Data from NASA Exoplanet Archive.
 */

export const EXOPLANETS = [
  // ───────── Habitable zone candidates
  {
    id: 'proxima-b', name: 'Proxima Centauri b',
    star: 'Proxima Centauri', distance: '4.24 ly',
    discovered: '2016', method: 'Radial velocity',
    mass: '1.07 ⊕', radius: '~1.1 ⊕', period: '11.2 days',
    type: 'Rocky · habitable zone', tagline: 'The closest exoplanet',
    description: 'In the habitable zone of the closest star to Earth. Could host liquid water — but Proxima\'s flares may strip the atmosphere away. The target of the Breakthrough Starshot proposal.',
  },
  {
    id: 'trappist-1e', name: 'TRAPPIST-1e',
    star: 'TRAPPIST-1', distance: '40 ly',
    discovered: '2017', method: 'Transit',
    mass: '0.69 ⊕', radius: '0.92 ⊕', period: '6.10 days',
    type: 'Rocky · prime habitable candidate', tagline: 'A nearly Earth-sized world',
    description: 'One of seven roughly Earth-sized planets orbiting a single ultracool dwarf star. TRAPPIST-1e sits squarely in the habitable zone — the most Earth-like in the system.',
  },
  {
    id: 'trappist-1f', name: 'TRAPPIST-1f',
    star: 'TRAPPIST-1', distance: '40 ly',
    discovered: '2017', method: 'Transit',
    mass: '1.04 ⊕', radius: '1.04 ⊕', period: '9.21 days',
    type: 'Rocky · habitable zone', tagline: 'Another TRAPPIST candidate',
    description: 'Slightly more massive than Earth. Sister planet to TRAPPIST-1e and 1g, all of which lie within the habitable zone.',
  },
  {
    id: 'kepler-186f', name: 'Kepler-186f',
    star: 'Kepler-186', distance: '579 ly',
    discovered: '2014', method: 'Transit',
    mass: '~1.4 ⊕', radius: '1.17 ⊕', period: '129.9 days',
    type: 'Rocky · habitable zone', tagline: 'First Earth-size world in HZ',
    description: 'The first Earth-sized planet found in the habitable zone of another star. Orbits a red dwarf.',
  },
  {
    id: 'kepler-452b', name: 'Kepler-452b',
    star: 'Kepler-452', distance: '1,400 ly',
    discovered: '2015', method: 'Transit',
    mass: '~5 ⊕', radius: '1.63 ⊕', period: '385 days',
    type: 'Super-Earth · habitable zone', tagline: 'Earth\'s "cousin"',
    description: 'Orbits a star very similar to our Sun, with a year almost identical to Earth\'s. Slightly larger than Earth — possibly a super-Earth.',
  },
  {
    id: 'kepler-22b', name: 'Kepler-22b',
    star: 'Kepler-22', distance: '587 ly',
    discovered: '2011', method: 'Transit',
    mass: '~36 ⊕', radius: '2.4 ⊕', period: '290 days',
    type: 'Sub-Neptune · habitable zone', tagline: 'NASA\'s first confirmed HZ planet',
    description: 'The first exoplanet NASA confirmed in the habitable zone of a Sun-like star. Likely a "water world" or sub-Neptune.',
  },
  {
    id: 'toi-700d', name: 'TOI-700 d',
    star: 'TOI-700', distance: '101.4 ly',
    discovered: '2020', method: 'Transit (TESS)',
    mass: '~1.7 ⊕', radius: '1.19 ⊕', period: '37.4 days',
    type: 'Rocky · habitable zone', tagline: 'TESS\'s first habitable world',
    description: 'The first habitable-zone Earth-sized planet discovered by NASA\'s TESS mission. The host star is relatively quiet — no destructive flares like Proxima\'s.',
  },
  {
    id: 'k2-18b', name: 'K2-18 b',
    star: 'K2-18', distance: '124 ly',
    discovered: '2015', method: 'Transit',
    mass: '8.92 ⊕', radius: '2.61 ⊕', period: '32.94 days',
    type: 'Hycean candidate', tagline: 'A hydrogen-ocean world?',
    description: 'In 2023, JWST detected methane and carbon dioxide — and possibly dimethyl sulfide, a molecule made on Earth only by life. May be a "Hycean" world with a hydrogen atmosphere over a global ocean.',
  },

  // ───────── Record-holders
  {
    id: 'hd-189733b', name: 'HD 189733 b',
    star: 'HD 189733', distance: '64.5 ly',
    discovered: '2005', method: 'Transit',
    mass: '358 ⊕', radius: '~13 ⊕', period: '2.22 days',
    type: 'Hot Jupiter', tagline: 'Where it rains glass — sideways',
    description: 'A deep azure-blue gas giant where wind speeds reach 8,700 km/h. Silicate clouds form droplets of molten glass that rain horizontally in the gale.',
  },
  {
    id: '51-peg-b', name: '51 Pegasi b',
    star: '51 Pegasi', distance: '50.45 ly',
    discovered: '1995', method: 'Radial velocity',
    mass: '149 ⊕', radius: '~21 ⊕', period: '4.23 days',
    type: 'Hot Jupiter', tagline: 'The first exoplanet around a sun-like star',
    description: 'The discovery that launched the field. Mayor and Queloz received the 2019 Nobel Prize in Physics for finding it.',
  },
  {
    id: 'wasp-12b', name: 'WASP-12 b',
    star: 'WASP-12', distance: '870 ly',
    discovered: '2008', method: 'Transit',
    mass: '~450 ⊕', radius: '~21 ⊕', period: '1.09 days',
    type: 'Doomed hot Jupiter', tagline: 'Being eaten by its star',
    description: 'So close to its star that tidal forces have distorted it into an egg shape, and it is being slowly torn apart. Estimated 10 million years remaining.',
  },
  {
    id: 'gj-1214b', name: 'GJ 1214 b',
    star: 'GJ 1214', distance: '47.5 ly',
    discovered: '2009', method: 'Transit',
    mass: '8.41 ⊕', radius: '2.85 ⊕', period: '1.58 days',
    type: 'Water world / sub-Neptune', tagline: 'A waterworld candidate',
    description: 'A "water world" — much of its mass appears to be water. Studied extensively by Hubble and JWST.',
  },
  {
    id: 'gj-1132b', name: 'GJ 1132 b',
    star: 'GJ 1132', distance: '40.7 ly',
    discovered: '2015', method: 'Transit',
    mass: '1.66 ⊕', radius: '1.13 ⊕', period: '1.63 days',
    type: 'Rocky · likely barren', tagline: 'Earth-sized but scorched',
    description: 'An Earth-mass rocky planet just outside the habitable zone — too close to its red dwarf for liquid water. Hot, dry, possibly atmosphere-stripped.',
  },
  {
    id: 'lhs-1140b', name: 'LHS 1140 b',
    star: 'LHS 1140', distance: '48.94 ly',
    discovered: '2017', method: 'Transit',
    mass: '5.6 ⊕', radius: '1.43 ⊕', period: '24.74 days',
    type: 'Super-Earth · habitable zone', tagline: 'Dense and rocky',
    description: 'A super-Earth in the habitable zone of a quiet red dwarf — an ideal target for atmospheric characterisation by JWST.',
  },

  // ───────── Strange + significant
  {
    id: 'psr-b1257-12-c', name: 'PSR B1257+12 c',
    star: 'PSR B1257+12 (pulsar)', distance: '2,300 ly',
    discovered: '1992', method: 'Pulsar timing',
    mass: '~4.3 ⊕', radius: '—', period: '66.5 days',
    type: 'Pulsar planet', tagline: 'The first exoplanet ever confirmed',
    description: 'Orbits a pulsar — the spinning remnant of a supernova. The first exoplanet discovered, three years before 51 Peg b. Bathed in lethal radiation.',
  },
  {
    id: 'kepler-16b', name: 'Kepler-16 b',
    star: 'Kepler-16 (A+B binary)', distance: '245 ly',
    discovered: '2011', method: 'Transit',
    mass: '105.8 ⊕', radius: '8.45 ⊕', period: '228.8 days',
    type: 'Circumbinary gas giant', tagline: 'Tatooine, real',
    description: 'A planet with two suns — orbiting both stars of a binary system. Sees two sunsets, just like Luke Skywalker\'s home world.',
  },
  {
    id: 'kelt-9b', name: 'KELT-9 b',
    star: 'KELT-9', distance: '~670 ly',
    discovered: '2016', method: 'Transit',
    mass: '~885 ⊕', radius: '~21 ⊕', period: '1.48 days',
    type: 'Ultra-hot Jupiter', tagline: 'The hottest planet ever found',
    description: 'Day-side temperature: 4,300 °C — hotter than most stars. Hot enough that molecules in its atmosphere are torn apart.',
  },
];

export const EXOPLANET_COUNT_TOTAL = 5793; // NASA Exoplanet Archive, approximate live total
