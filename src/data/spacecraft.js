/**
 * The 30 most important spacecraft in the history of solar system exploration.
 *
 * Grouped by era and ordered chronologically. Each entry includes a hero
 * image query (resolved via /api/image — Wikipedia first, NASA fallback),
 * launch year, agency, target, status, and a substantial dossier.
 */

export const SPACECRAFT = [
  // ─── Pioneering era (1957-1980) ──────────────────────────────────────
  {
    name: 'Sputnik 1', agency: 'USSR', launched: 1957, target: 'Earth orbit',
    status: 'Reentered Jan 1958', era: 'Pioneering',
    image: 'Sputnik 1',
    tagline: 'The world\'s first artificial satellite.',
    detail: 'A 58 cm aluminium sphere with four whip antennas, weighing 83.6 kg. Sputnik 1 orbited Earth every 96 minutes, broadcasting a simple radio beep that could be received by amateur operators worldwide. Its launch on 4 October 1957 stunned the world, triggered the space race, and led directly to the founding of NASA the following year.',
  },
  {
    name: 'Vostok 1', agency: 'USSR', launched: 1961, target: 'Earth orbit',
    status: 'Returned safely', era: 'Pioneering',
    image: 'Vostok 1',
    tagline: 'The first human spaceflight.',
    detail: '12 April 1961: Yuri Gagarin became the first person to leave the Earth, orbiting once at altitudes between 169 and 327 km in a 108-minute flight. He ejected from the capsule at 7 km altitude and landed by parachute. His call sign was Кедр — Cedar.',
  },
  {
    name: 'Apollo 11', agency: 'NASA', launched: 1969, target: 'The Moon',
    status: 'Mission complete', era: 'Pioneering',
    image: 'Apollo 11',
    tagline: 'The first humans to walk on another world.',
    detail: '20 July 1969, 20:17 UTC: Neil Armstrong and Buzz Aldrin landed the lunar module Eagle on the Sea of Tranquility, with Michael Collins orbiting overhead in Columbia. Armstrong stepped onto the lunar surface six and a half hours later, declaring "That\'s one small step for [a] man, one giant leap for mankind." They returned to Earth four days later with 21.5 kg of lunar samples that are still being studied today.',
  },
  {
    name: 'Mariner 9', agency: 'NASA', launched: 1971, target: 'Mars',
    status: 'Decommissioned 1972', era: 'Pioneering',
    image: 'Mariner 9',
    tagline: 'First spacecraft to orbit another planet.',
    detail: 'Beat the Soviet Mars 2 and 3 to Mars orbit by a few weeks. Mapped 85% of the Martian surface, revealed Olympus Mons (the largest volcano in the solar system), Valles Marineris (the canyon system that bears its name), and the dry river beds that hinted at Mars\'s wet past. It transformed Mars from a smudge into a world.',
  },

  // ─── Outer planets era (1970s-1990s) ────────────────────────────────
  {
    name: 'Pioneer 10', agency: 'NASA', launched: 1972, target: 'Jupiter & beyond',
    status: 'Last contact 2003', era: 'Outer planets',
    image: 'Pioneer 10',
    tagline: 'The first spacecraft to traverse the asteroid belt.',
    detail: 'And the first to reach Jupiter — Pioneer 10 flew past in December 1973, returning the first close-up images of the giant planet and its radiation environment. It carries a famous gold plaque designed by Carl Sagan and Frank Drake, depicting a man and woman against a star map, in case any extraterrestrial civilisation ever finds it. Now drifting toward Aldebaran, which it will reach in about 2 million years.',
  },
  {
    name: 'Voyager 1', agency: 'NASA', launched: 1977, target: 'Jupiter, Saturn, interstellar space',
    status: 'OPERATIONAL — in interstellar space', era: 'Outer planets',
    image: 'Voyager 1',
    tagline: 'The farthest human-made object from Earth.',
    detail: 'Currently 24 billion kilometres away, travelling at 17 km/s. Voyager 1 visited Jupiter (1979) and Saturn (1980), where it studied Titan\'s atmosphere up close. It crossed the heliopause into interstellar space on 25 August 2012 — the first human-made object to leave the Sun\'s influence. It still phones home: a 22-watt transmitter, weaker than a refrigerator light, reaching across more than 22 light-hours of space. NASA has stated they hope to maintain contact until around 2030.',
  },
  {
    name: 'Voyager 2', agency: 'NASA', launched: 1977, target: 'All four giant planets',
    status: 'OPERATIONAL — in interstellar space', era: 'Outer planets',
    image: 'Voyager 2',
    tagline: 'The only spacecraft ever to visit Uranus or Neptune.',
    detail: 'Launched two weeks before Voyager 1 on a slower, more thorough trajectory. Visited Jupiter (1979), Saturn (1981), Uranus (1986) — discovering 11 new moons and the planet\'s ring system — and Neptune (1989), where it photographed the Great Dark Spot and Triton\'s geysers of nitrogen. The 12-year planetary tour was made possible by a rare alignment that occurs once every 175 years. Both Voyagers carry the Golden Record: a phonograph disc with sounds and images of Earth.',
  },
  {
    name: 'Viking 1 & 2', agency: 'NASA', launched: 1975, target: 'Mars',
    status: 'Operations ended 1980s', era: 'Outer planets',
    image: 'Viking program',
    tagline: 'The first successful Mars landers.',
    detail: 'Each mission had two parts — an orbiter and a lander. The landers touched down on Mars in 1976 and operated for years, returning the first colour pictures from the surface, characterising the soil and atmosphere, and conducting the first biological experiments to search for life. The results were inconclusive but tantalising. The orbiters photographed the entire surface in unprecedented detail, including the famous "Face on Mars" in Cydonia.',
  },
  {
    name: 'Galileo', agency: 'NASA', launched: 1989, target: 'Jupiter',
    status: 'Plunged into Jupiter 2003', era: 'Outer planets',
    image: 'Galileo (spacecraft)',
    tagline: 'Eight years in orbit around Jupiter.',
    detail: 'The first spacecraft to orbit Jupiter (rather than just fly past). Released a probe into Jupiter\'s atmosphere in 1995 that survived for 58 minutes at depths reaching 23 atmospheres of pressure. Discovered evidence of a subsurface ocean on Europa beneath its icy crust, found Ganymede has its own magnetic field, and observed the impact of Comet Shoemaker-Levy 9 into Jupiter in 1994. Intentionally crashed into Jupiter to prevent contamination of Europa.',
  },

  // ─── Hubble & friends ───────────────────────────────────────────────
  {
    name: 'Hubble Space Telescope', agency: 'NASA / ESA', launched: 1990, target: 'Low Earth orbit',
    status: 'OPERATIONAL', era: 'Observatories',
    image: 'Hubble Space Telescope',
    tagline: 'The most productive scientific instrument ever built.',
    detail: 'A 2.4-metre optical telescope orbiting 547 km above Earth. After a near-disastrous launch with a misshapen mirror (corrected by the 1993 servicing mission), Hubble has produced 1.5 million observations of 50,000 celestial targets and over 19,000 published scientific papers. Its Deep Field images revealed thousands of galaxies in a patch of sky no larger than a grain of sand at arm\'s length. Still going strong 35 years after launch, with no planned retirement.',
  },
  {
    name: 'Cassini-Huygens', agency: 'NASA / ESA / ASI', launched: 1997, target: 'Saturn',
    status: 'Plunged into Saturn 2017', era: 'Observatories',
    image: 'Cassini–Huygens',
    tagline: 'Thirteen years orbiting Saturn.',
    detail: 'Arrived at Saturn in July 2004 after a seven-year journey through the inner solar system (with gravity-assist flybys of Venus, Earth, and Jupiter). Released the Huygens probe to land on Titan on 14 January 2005 — the first landing in the outer solar system. Discovered water-ice plumes erupting from Enceladus, hydrocarbon lakes on Titan, and the hexagonal jet stream at Saturn\'s north pole. Ended its mission on 15 September 2017 with a deliberate plunge into Saturn\'s atmosphere — the Grand Finale.',
  },

  // ─── Mars rovers era ────────────────────────────────────────────────
  {
    name: 'Sojourner', agency: 'NASA', launched: 1996, target: 'Mars',
    status: 'Mission ended 1997', era: 'Mars rovers',
    image: 'Sojourner (rover)',
    tagline: 'The first wheels on Mars.',
    detail: 'Part of the Mars Pathfinder mission. A 10.6 kg, microwave-sized rover that operated for 83 sols (Martian days) — far exceeding its 7-sol design lifetime. Drove 100 m and sent back 550 photographs along with chemical analyses of 16 rocks. Proved that low-cost Mars landing was possible and paved the way for every rover since.',
  },
  {
    name: 'Spirit & Opportunity', agency: 'NASA', launched: 2003, target: 'Mars',
    status: 'Spirit stuck 2009; Opportunity died 2018', era: 'Mars rovers',
    image: 'Mars Exploration Rover',
    tagline: 'The twin rovers that drove for years.',
    detail: 'Designed for 90 sols each. Spirit operated for 2,208 sols (over 6 years) before becoming stuck in soft sand. Opportunity operated for 5,498 sols (over 14 years) and travelled 45 kilometres — a marathon on another planet — before a global dust storm finally silenced it in 2018. They found definitive evidence that Mars once had liquid water and hospitable conditions.',
  },
  {
    name: 'Curiosity', agency: 'NASA', launched: 2011, target: 'Mars',
    status: 'OPERATIONAL', era: 'Mars rovers',
    image: 'Curiosity (rover)',
    tagline: 'A nuclear-powered car-sized chemistry lab.',
    detail: 'Touched down in Gale Crater on 6 August 2012 using the audacious Sky Crane manoeuvre — a rocket-powered platform lowered the rover on cables, then flew off to crash a safe distance away. Curiosity has been climbing Mount Sharp ever since, finding ancient lake beds, organic molecules, and methane fluctuations that may have biological origin. Travels on six wheels powered by a plutonium-238 RTG.',
  },
  {
    name: 'Perseverance & Ingenuity', agency: 'NASA', launched: 2020, target: 'Mars',
    status: 'OPERATIONAL', era: 'Mars rovers',
    image: 'Perseverance (rover)',
    tagline: 'Caching samples for return to Earth + the first interplanetary helicopter.',
    detail: 'Landed in Jezero Crater on 18 February 2021, an ancient river delta thought to be one of the best places to find evidence of past Martian life. Carries 43 sample tubes that it is filling with carefully selected rocks for a future Mars Sample Return mission to bring home. Brought along Ingenuity — a 1.8 kg helicopter that flew 72 times before its rotor was damaged on landing in January 2024. The first powered flight on another world.',
  },

  // ─── Modern explorers ──────────────────────────────────────────────
  {
    name: 'New Horizons', agency: 'NASA', launched: 2006, target: 'Pluto, Kuiper Belt',
    status: 'OPERATIONAL — in the Kuiper Belt', era: 'Modern explorers',
    image: 'New Horizons',
    tagline: 'The fastest spacecraft ever launched.',
    detail: 'Reached 16 km/s on its way out of the solar system. Flew past Pluto on 14 July 2015 — a nine-and-a-half year journey culminating in a single hour of close approach. Revealed Pluto as a geologically active world with nitrogen ice glaciers, blue skies, and a heart-shaped plain now called Tombaugh Regio. Then continued to Kuiper Belt object Arrokoth on 1 January 2019, the most distant object ever visited by a spacecraft. Carries some of the ashes of Pluto\'s discoverer, Clyde Tombaugh.',
  },
  {
    name: 'Juno', agency: 'NASA', launched: 2011, target: 'Jupiter',
    status: 'OPERATIONAL', era: 'Modern explorers',
    image: 'Juno (spacecraft)',
    tagline: 'Orbiting Jupiter in a long elliptical loop.',
    detail: 'A solar-powered spacecraft (the first to operate beyond the asteroid belt without nuclear power) studying Jupiter\'s composition, gravity field, magnetic field, and polar magnetosphere. Its highly elliptical orbit takes it from 4,000 km above the cloud tops out to millions of km, minimising radiation exposure. Has returned breathtaking images of Jupiter\'s swirling cyclones and the planet\'s deep structure. Extended mission now studying Europa, Ganymede, and Io.',
  },
  {
    name: 'Hayabusa 2', agency: 'JAXA', launched: 2014, target: 'Asteroid Ryugu',
    status: 'Samples returned 2020; extended mission ongoing', era: 'Modern explorers',
    image: 'Hayabusa2',
    tagline: 'Brought home pieces of an asteroid.',
    detail: 'Arrived at the diamond-shaped near-Earth asteroid Ryugu in June 2018. Deployed multiple small rovers and a lander, fired a copper projectile to create an artificial crater, and collected samples from inside that crater. Returned 5.4 grams of pristine asteroid material to Earth in December 2020. Analysis revealed organic molecules, amino acids, and water — building blocks of life delivered by asteroids billions of years ago.',
  },
  {
    name: 'OSIRIS-REx', agency: 'NASA', launched: 2016, target: 'Asteroid Bennu',
    status: 'Samples returned 2023; extended mission OSIRIS-APEX ongoing', era: 'Modern explorers',
    image: 'OSIRIS-REx',
    tagline: 'Brought home pieces of a potentially hazardous asteroid.',
    detail: 'Spent two years mapping Bennu in extraordinary detail, then performed a touch-and-go sample collection on 20 October 2020 — the surface was so loosely packed that the spacecraft would have sunk into Bennu if it hadn\'t fired its thrusters to back away. Returned 121.6 grams to Earth on 24 September 2023, far more than the 60-gram requirement. Now en route to asteroid Apophis under the renamed OSIRIS-APEX mission.',
  },
  {
    name: 'James Webb Space Telescope', agency: 'NASA / ESA / CSA', launched: 2021, target: 'Sun-Earth L2 point',
    status: 'OPERATIONAL', era: 'Modern explorers',
    image: 'James Webb Space Telescope',
    tagline: 'The largest space telescope ever built.',
    detail: 'A 6.5-metre segmented mirror cooled to -223°C, parked at the L2 Lagrange point 1.5 million km from Earth. Designed to see in infrared, allowing it to peer through dust clouds and detect the most distant — and therefore most redshifted — galaxies in the universe. Has already revealed galaxies forming just 300 million years after the Big Bang, analysed the atmospheres of exoplanets, and produced the deepest images of the universe ever captured. Fuel sufficient for at least 20 years of operation.',
  },
  {
    name: 'DART', agency: 'NASA', launched: 2021, target: 'Asteroid Dimorphos',
    status: 'Impact successful Sep 2022', era: 'Modern explorers',
    image: 'Double Asteroid Redirection Test',
    tagline: 'The first planetary defence test.',
    detail: 'Double Asteroid Redirection Test — a 570 kg spacecraft that deliberately crashed into the small moonlet Dimorphos (160 m across) of the larger asteroid Didymos on 26 September 2022. The impact altered Dimorphos\'s orbit by 33 minutes — far more than the 73-second threshold for "success." Proved humanity can deflect an asteroid if we ever need to. ESA\'s Hera mission, launched 2024, will arrive at Dimorphos in 2026 to study the impact site in detail.',
  },
  {
    name: 'Chandrayaan-3', agency: 'ISRO', launched: 2023, target: 'Lunar south pole',
    status: 'Mission complete', era: 'Modern explorers',
    image: 'Chandrayaan-3',
    tagline: 'India\'s first successful soft landing on the Moon.',
    detail: 'Landed near the lunar south pole on 23 August 2023, making India the fourth nation to soft-land on the Moon and the first to land in the polar region. The Pragyan rover operated for 14 Earth days (one lunar day), confirming the presence of sulphur, iron, titanium, and other elements, and measuring temperature variations 8 cm below the surface. The mission cost roughly $75 million — less than several Hollywood films. Total triumph for the Indian space programme.',
  },

  // ─── Living spacecraft (operational ISS, recent launches) ───────────
  {
    name: 'International Space Station', agency: 'NASA, Roscosmos, ESA, JAXA, CSA', launched: 1998, target: 'Low Earth orbit',
    status: 'OPERATIONAL until ~2030', era: 'Living spacecraft',
    image: 'International Space Station',
    tagline: 'The most expensive engineering project in history — and the longest continuously inhabited place off Earth.',
    detail: 'Construction began with the Zarya module in November 1998. Humans have lived on board continuously since 2 November 2000 — 25 years and counting. The station orbits Earth every 92 minutes at 28,000 km/h, 400 km up. Its pressurised volume is roughly that of a Boeing 747. Has hosted over 270 individual visitors from 21 countries. Scheduled to be deorbited around 2030, replaced by a constellation of commercial stations.',
  },
  {
    name: 'Solar Orbiter', agency: 'ESA / NASA', launched: 2020, target: 'The Sun',
    status: 'OPERATIONAL', era: 'Living spacecraft',
    image: 'Solar Orbiter',
    tagline: 'Photographing the Sun\'s poles for the first time.',
    detail: 'A joint ESA-NASA mission that uses repeated Venus gravity assists to gradually tilt its orbit out of the ecliptic plane — allowing it to look down on the Sun\'s poles for the first time in history. Carries 10 instruments behind a heat shield that withstands 500°C. Has already returned the highest-resolution images of the Sun ever taken, revealing tiny "campfires" — miniature solar flares that may explain why the corona is hotter than the surface.',
  },
  {
    name: 'Parker Solar Probe', agency: 'NASA', launched: 2018, target: 'The Sun\'s corona',
    status: 'OPERATIONAL', era: 'Living spacecraft',
    image: 'Parker Solar Probe',
    tagline: 'The fastest object ever made by humans, "touching" the Sun.',
    detail: 'Will eventually swing within 6.1 million km of the Sun\'s surface — closer than any spacecraft has ever come — at speeds of nearly 700,000 km/h. Has already "touched" the Sun\'s corona in 2021. Protected by a 11.4 cm thick carbon-composite shield that endures temperatures of 1,377°C while the instruments behind it stay at room temperature. Named after Eugene Parker, the astrophysicist who predicted the solar wind in 1958.',
  },
  {
    name: 'JUICE', agency: 'ESA', launched: 2023, target: 'Jupiter system',
    status: 'In transit — arrives 2031', era: 'Living spacecraft',
    image: 'Jupiter Icy Moons Explorer',
    tagline: 'JUpiter ICy moons Explorer — heading for Europa, Ganymede, and Callisto.',
    detail: 'A flagship ESA mission to study Jupiter\'s three largest icy moons, all of which are believed to harbour subsurface oceans. Will perform 35 flybys of these moons before settling into orbit around Ganymede in 2034 — the first spacecraft ever to orbit a moon of another planet. Will help determine whether any of these worlds could host life.',
  },
  {
    name: 'Europa Clipper', agency: 'NASA', launched: 2024, target: 'Jupiter\'s moon Europa',
    status: 'In transit — arrives 2030', era: 'Living spacecraft',
    image: 'Europa Clipper',
    tagline: 'The mission to one of the most promising worlds for life beyond Earth.',
    detail: 'Will fly past Europa 49 times between 2030 and 2034, studying its icy shell and the global ocean beneath — which contains twice as much water as Earth\'s oceans combined. Carries ice-penetrating radar, magnetometers, and a thermal imager to characterise the moon and identify the best future landing sites. The largest planetary spacecraft NASA has ever built, with solar panels spanning 30 metres.',
  },
  {
    name: 'Artemis I, II, III', agency: 'NASA + partners', launched: '2022, 2026, 2027+', target: 'The Moon',
    status: 'Artemis I complete; Artemis II crewed flyby 2026; Artemis III crewed landing 2027+',
    era: 'Living spacecraft',
    image: 'Artemis program',
    tagline: 'Humans returning to the Moon, this time to stay.',
    detail: 'Artemis I (Nov 2022) was an uncrewed test flight of the Space Launch System and Orion capsule. Artemis II will carry four astronauts around the Moon. Artemis III — when it flies — will land the first woman and the next man near the lunar south pole. The programme aims to establish a sustained presence on and around the Moon, including the Lunar Gateway space station, as a stepping stone to Mars.',
  },
  {
    name: 'Tiangong Space Station', agency: 'CNSA', launched: 2021, target: 'Low Earth orbit',
    status: 'OPERATIONAL', era: 'Living spacecraft',
    image: 'Tiangong space station',
    tagline: 'China\'s permanently crewed space station.',
    detail: 'Sometimes called "Heavenly Palace." Three modules — Tianhe (core), Wentian (lab), and Mengtian (lab) — operate at 340-450 km altitude with a crew of three. Smaller than the ISS but fully operational and supporting a full research programme. Currently the only space station operated by a single nation.',
  },
];
