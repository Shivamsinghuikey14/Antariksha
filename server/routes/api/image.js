/**
 * /api/image?q=...
 *
 * Multi-source image resolver. Tries (in order):
 *   1.  Curated map  →  Wikipedia title (covers all 88 constellations, moons, stars, spacecraft)
 *   2.  Heuristics   →  appends " (constellation)" / " (moon)" / " (galaxy)" if missing
 *   3.  Raw query    →  Wikipedia summary by title
 *   4.  Search       →  Wikipedia full-text search → first hit's title
 *   5.  Commons      →  Wikimedia Commons direct file search
 *   6.  NASA         →  NASA Image and Video Library
 *
 * In-memory cache for 24 h. No API keys required.
 */

import express from 'express';

const router = express.Router();
const CACHE  = new Map();
const TTL    = 24 * 60 * 60 * 1000;
const UA     = { 'User-Agent': 'Aether/2.0 (https://github.com/; educational)', 'Accept': 'application/json' };

/* ── All 88 IAU constellations + popular celestial objects ────────────── */
const CURATED = {
  // Zodiac
  'aries constellation':       'Aries (constellation)',
  'taurus constellation':      'Taurus (constellation)',
  'gemini constellation':      'Gemini (constellation)',
  'cancer constellation':      'Cancer (constellation)',
  'leo constellation':         'Leo (constellation)',
  'virgo constellation':       'Virgo (constellation)',
  'libra constellation':       'Libra (constellation)',
  'scorpius constellation':    'Scorpius',
  'sagittarius constellation': 'Sagittarius (constellation)',
  'capricornus constellation': 'Capricornus',
  'aquarius constellation':    'Aquarius (constellation)',
  'pisces constellation':      'Pisces (constellation)',
  // Ursa Major family
  'ursa major constellation':  'Ursa Major',
  'ursa minor constellation':  'Ursa Minor',
  'draco constellation':       'Draco (constellation)',
  'boötes constellation':      'Boötes',
  'bootes constellation':      'Boötes',
  'canes venatici constellation': 'Canes Venatici',
  'coma berenices constellation': 'Coma Berenices',
  'corona borealis constellation': 'Corona Borealis',
  'leo minor constellation':   'Leo Minor',
  'lynx constellation':        'Lynx (constellation)',
  // Perseus family
  'cassiopeia constellation':  'Cassiopeia (constellation)',
  'cepheus constellation':     'Cepheus (constellation)',
  'andromeda constellation':   'Andromeda (constellation)',
  'perseus constellation':     'Perseus (constellation)',
  'pegasus constellation':     'Pegasus (constellation)',
  'auriga constellation':      'Auriga (constellation)',
  'triangulum constellation':  'Triangulum',
  'cetus constellation':       'Cetus',
  // Orion family
  'orion constellation':       'Orion (constellation)',
  'canis major constellation': 'Canis Major',
  'canis minor constellation': 'Canis Minor',
  'lepus constellation':       'Lepus (constellation)',
  'monoceros constellation':   'Monoceros',
  // Heavenly Waters
  'eridanus constellation':    'Eridanus (constellation)',
  'hydra constellation':       'Hydra (constellation)',
  'carina constellation':      'Carina (constellation)',
  'puppis constellation':      'Puppis',
  'vela constellation':        'Vela (constellation)',
  'columba constellation':     'Columba (constellation)',
  // Hercules family
  'hercules constellation':    'Hercules (constellation)',
  'lyra constellation':        'Lyra',
  'cygnus constellation':      'Cygnus (constellation)',
  'aquila constellation':      'Aquila (constellation)',
  'sagitta constellation':     'Sagitta',
  'delphinus constellation':   'Delphinus',
  'equuleus constellation':    'Equuleus',
  'scutum constellation':      'Scutum (constellation)',
  'centaurus constellation':   'Centaurus',
  'crux constellation':        'Crux',
  'triangulum australe constellation': 'Triangulum Australe',
  'corona australis constellation': 'Corona Australis',
  'ara constellation':         'Ara (constellation)',
  'lupus constellation':       'Lupus (constellation)',
  // Bayer (southern, 1600s)
  'apus constellation':        'Apus',
  'chamaeleon constellation':  'Chamaeleon',
  'dorado constellation':      'Dorado',
  'grus constellation':        'Grus (constellation)',
  'hydrus constellation':      'Hydrus',
  'indus constellation':       'Indus (constellation)',
  'musca constellation':       'Musca',
  'pavo constellation':        'Pavo (constellation)',
  'phoenix constellation':     'Phoenix (constellation)',
  'tucana constellation':      'Tucana',
  'volans constellation':      'Volans',
  // Lacaille (southern, 1750s)
  'antlia constellation':      'Antlia',
  'caelum constellation':      'Caelum',
  'circinus constellation':    'Circinus',
  'fornax constellation':      'Fornax',
  'horologium constellation':  'Horologium (constellation)',
  'mensa constellation':       'Mensa (constellation)',
  'microscopium constellation':'Microscopium',
  'norma constellation':       'Norma (constellation)',
  'octans constellation':      'Octans',
  'pictor constellation':      'Pictor',
  'pyxis constellation':       'Pyxis',
  'reticulum constellation':   'Reticulum',
  'sculptor constellation':    'Sculptor (constellation)',
  'telescopium constellation': 'Telescopium',
  // Other (Hevelius / Plancius)
  'camelopardalis constellation': 'Camelopardalis',
  'lacerta constellation':     'Lacerta',
  'vulpecula constellation':   'Vulpecula',
  'sextans constellation':     'Sextans',
  'ophiuchus constellation':   'Ophiuchus',
  'serpens constellation':     'Serpens',
  'crater constellation':      'Crater (constellation)',
  'corvus constellation':      'Corvus (constellation)',
  'piscis austrinus constellation': 'Piscis Austrinus',

  // Moons (disambiguated Wikipedia titles)
  'europa moon':    'Europa (moon)',
  'titan moon':     'Titan (moon)',
  'io moon':        'Io (moon)',
  'ganymede moon':  'Ganymede (moon)',
  'callisto moon':  'Callisto (moon)',
  'enceladus moon': 'Enceladus',
  'triton moon':    'Triton (moon)',
  'mimas moon':     'Mimas (moon)',
  'iapetus moon':   'Iapetus (moon)',
  'rhea moon':      'Rhea (moon)',
  'dione moon':     'Dione (moon)',
  'tethys moon':    'Tethys (moon)',
  'phobos moon':    'Phobos (moon)',
  'deimos moon':    'Deimos (moon)',
  'miranda moon':   'Miranda (moon)',
  'titania moon':   'Titania (moon)',
  'oberon moon':    'Oberon (moon)',
  'umbriel moon':   'Umbriel',
  'ariel moon':     'Ariel (moon)',
  'charon moon':    'Charon (moon)',

  // Stars
  'sirius star':           'Sirius',
  'betelgeuse star':       'Betelgeuse',
  'vega star':             'Vega',
  'rigel star':            'Rigel',
  'arcturus star':         'Arcturus',
  'aldebaran star':        'Aldebaran',
  'antares star':          'Antares',
  'polaris star':          'Polaris',
  'proxima centauri star': 'Proxima Centauri',
  'alpha centauri star':   'Alpha Centauri',
  'canopus star':          'Canopus',
  'pollux star':           'Pollux',
  'castor star':           'Castor (star)',
  'altair star':           'Altair',
  'deneb star':            'Deneb',
  'capella star':          'Capella',
};

/* ── Source 1+3: Wikipedia REST summary (handles redirects) ─────────────── */
async function fromWikipediaTitle(title) {
  if (!title) return null;
  const t = title.replace(/ /g, '_');
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}?redirect=true`;
  try {
    const r = await fetch(url, { headers: UA });
    if (!r.ok) return null;
    const d = await r.json();
    if (d.type === 'disambiguation') return null;
    const src = d.originalimage?.source || d.thumbnail?.source;
    if (!src) return null;
    return { src, source: 'wikipedia', title: d.title, extract: d.extract };
  } catch { return null; }
}

/* ── Source 4: Wikipedia full-text search ─────────────────────────────── */
async function fromWikipediaSearch(query) {
  try {
    const sUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srlimit=3&origin=*`;
    const sR = await fetch(sUrl, { headers: UA });
    if (!sR.ok) return null;
    const sD = await sR.json();
    const hits = sD.query?.search || [];
    for (const hit of hits) {
      const out = await fromWikipediaTitle(hit.title);
      if (out) return out;
    }
    return null;
  } catch { return null; }
}

/* ── Source 5: Wikimedia Commons direct file search ───────────────────── */
async function fromCommons(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size&iiurlwidth=900&origin=*`;
    const r = await fetch(url, { headers: UA });
    if (!r.ok) return null;
    const d = await r.json();
    const pages = d.query?.pages;
    if (!pages) return null;
    for (const k of Object.keys(pages)) {
      const info = pages[k].imageinfo?.[0];
      if (info && info.width >= 400) {
        return { src: info.thumburl || info.url, source: 'commons', title: pages[k].title };
      }
    }
    return null;
  } catch { return null; }
}

/* ── Source 6: NASA Image and Video Library ───────────────────────────── */
async function fromNasa(query) {
  try {
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
    const r = await fetch(url, { headers: UA });
    if (!r.ok) return null;
    const d = await r.json();
    const item = d.collection?.items?.[0];
    const src = item?.links?.[0]?.href;
    if (!src) return null;
    return { src, source: 'nasa', title: item.data?.[0]?.title };
  } catch { return null; }
}

router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'q required' });
  const qLower = q.toLowerCase();
  const debug  = req.query.debug === '1';
  const trace  = [];
  const log = (step, ok) => { if (debug || process.env.IMAGE_LOG) trace.push(`${ok ? '✓' : '·'} ${step}`); };

  const cached = CACHE.get(qLower);
  if (cached && Date.now() - cached.t < TTL) {
    if (debug) return res.json({ ...cached.data, _trace: ['✓ CACHE'] });
    return res.json(cached.data);
  }

  let result = null;

  if (CURATED[qLower]) {
    result = await fromWikipediaTitle(CURATED[qLower]);
    log(`curated → "${CURATED[qLower]}"`, !!result);
  }

  // 2. Heuristics for un-curated entries
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  if (!result && qLower.endsWith(' constellation')) {
    const base = cap(qLower.replace(/ constellation$/, ''));
    result = await fromWikipediaTitle(`${base} (constellation)`)
          || await fromWikipediaTitle(base);
  }
  if (!result && qLower.endsWith(' moon')) {
    const base = cap(qLower.replace(/ moon$/, ''));
    result = await fromWikipediaTitle(`${base} (moon)`)
          || await fromWikipediaTitle(base);
  }
  if (!result && qLower.endsWith(' galaxy')) {
    const base = cap(qLower.replace(/ galaxy$/, ''));
    result = await fromWikipediaTitle(`${base} Galaxy`)
          || await fromWikipediaTitle(`${base} (galaxy)`)
          || await fromWikipediaTitle(base);
  }
  if (!result && qLower.endsWith(' black hole')) {
    const base = cap(qLower.replace(/ black hole$/, ''));
    result = await fromWikipediaTitle(base);
  }
  if (!result && qLower.endsWith(' asteroid')) {
    const base = cap(qLower.replace(/ asteroid$/, ''));
    result = await fromWikipediaTitle(`${base} (asteroid)`)
          || await fromWikipediaTitle(`${base} (dwarf planet)`)
          || await fromWikipediaTitle(base);
  }
  if (!result && qLower.endsWith(' exoplanet')) {
    const base = cap(qLower.replace(/ exoplanet$/, ''));
    result = await fromWikipediaTitle(base);
  }
  if (!result && qLower.endsWith(' meteor shower')) {
    const base = qLower.replace(/ meteor shower$/, '').split(' ').map(cap).join(' ');
    result = await fromWikipediaTitle(`${base} (meteor shower)`)
          || await fromWikipediaTitle(`${base}s`)
          || await fromWikipediaTitle(base);
  }

  // 3. Raw query as Wikipedia title
  if (!result) { result = await fromWikipediaTitle(q); log('wikipedia title raw', !!result); }

  // 4. Wikipedia search
  if (!result) { result = await fromWikipediaSearch(q); log('wikipedia search', !!result); }

  // 5. Wikimedia Commons
  if (!result) { result = await fromCommons(q); log('wikimedia commons', !!result); }

  // 6. NASA
  if (!result) { result = await fromNasa(q); log('nasa library', !!result); }

  if (!result) {
    if (process.env.IMAGE_LOG) console.log(`[image] 404 q="${q}" tried: ${trace.join(', ')}`);
    res.setHeader('Cache-Control', 'public, max-age=600');
    return res.status(404).json({ error: 'no image found', q, _trace: trace });
  }

  if (process.env.IMAGE_LOG) console.log(`[image] ✓ q="${q}" via ${result.source}`);
  CACHE.set(qLower, { data: result, t: Date.now() });
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.json(debug ? { ...result, _trace: trace } : result);
});

export default router;
