import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';
import { useLightbox } from '../components/ui/Lightbox.jsx';
import { api } from '../lib/api.js';
import { TELESCOPES } from '../data/telescopes.js';

const STREAMS = [
  // All entries now use channel-based live_stream embeds — they auto-route
  // to whatever is currently broadcasting, so they don't break when a
  // specific video ID ends.
  { name: 'NASA Live',          channel: 'UCLA_DiR1FfKNvjuUpBHmylQ', desc: 'NASA TV — public channel, around the clock' },
  { name: 'NASA Spaceflight',   channel: 'UCSUu1lih2RifWkKtDOJdsBA', desc: 'Independent space coverage and live launch streams' },
  { name: 'SpaceX',             channel: 'UCtI0Hodo5o5dUb67FeUjDeA', desc: 'Launch streams, mission recaps' },
  { name: 'ESA WebTV',          channel: 'UCIBaDdAbGlFDeS33shmlD0A', desc: 'European Space Agency live broadcasts' },
  { name: 'Virtual Telescope',  channel: 'UCWg5y4ZdW5wQ50tEgkV-1Cw', desc: 'Live telescope feeds of comets and rare events (Italy)' },
  { name: 'Slooh',              channel: 'UCH_GgZQ-pAh4WJlGcVfqg2Q', desc: 'Online community telescope feeds (free viewer)' },
  { name: 'Las Cumbres Obs.',   channel: 'UC8aRT_FmwwDqZIvc8AnsYBQ', desc: 'Las Cumbres Global Telescope Network — free for educators' },
  { name: 'SETI Institute',     channel: 'UCKQ6z9_5UYZc9pH4uHpGE-Q', desc: 'Allen Telescope Array updates and weekly talks' },
];

const FREE_ACCESS = [
  ['Las Cumbres Observatory',  'Global Sky Partners',  'Free observation time for K-12 educators worldwide. 26 robotic telescopes across 6 sites.',  'https://lco.global/education/'],
  ['MicroObservatory',          'Harvard CfA',           'NASA-funded robotic telescopes you control through a web browser. Completely free.',  'https://mo-www.cfa.harvard.edu/MicroObservatory/'],
  ['Faulkes Telescope Project','Cardiff University',    'Free telescope time on 2-metre Faulkes North (Hawaii) and South (Australia) for UK schools and beyond.','https://www.faulkes-telescope.com/'],
  ['SkyServer',                'Sloan Digital Sky Survey','Browse 800 million catalogued objects from the SDSS imaging survey. Search any patch of sky.','https://skyserver.sdss.org/'],
  ['ESA Sky',                  'European Space Agency', 'Free interactive sky atlas pulling from Hubble, XMM-Newton, Herschel, Planck, Gaia, and more.','https://sky.esa.int/'],
  ['Aladin Sky Atlas',         'Strasbourg Observatory','Interactive viewer of catalogued surveys across all wavelengths. Web and desktop versions.','https://aladin.cds.unistra.fr/'],
  ['Stellarium Web',           'Open source',           'Free planetarium in your browser. Shows the exact sky from your location, with deep-sky labels.','https://stellarium-web.org/'],
  ['World Wide Telescope',     'AAS / Microsoft',       'Free virtual observatory combining Hubble, Spitzer, Chandra, and ground-based surveys.','https://worldwidetelescope.org/'],
  ['SkyView',                  'NASA Goddard',          'Free virtual observatory — point at any coordinate, get back imagery from radio to gamma-ray.','https://skyview.gsfc.nasa.gov/'],
  ['JPL Horizons',             'NASA JPL',              'Free system providing the ephemeris of every object in the solar system, with sub-arcsecond accuracy.','https://ssd.jpl.nasa.gov/horizons/'],
];

function TelescopeImage({ q, alt, onClick }) {
  const [src, setSrc] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let alive = true;
    api.library(q, 1).then(d => {
      if (!alive) return;
      const first = d.items?.[0];
      if (first?.src) setSrc(first.src);
      else setErr(true);
    }).catch(() => alive && setErr(true));
    return () => { alive = false; };
  }, [q]);

  if (err) return <div className="scope-img scope-img-err">// No image</div>;
  if (!src) return <div className="scope-img scope-img-loading"><div className="loading">Loading</div></div>;
  return (
    <div className="scope-img" onClick={() => onClick?.(src, alt)}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

export default function Telescopes() {
  useReveal();
  const [filter, setFilter] = useState('all');
  const { openLightbox } = useLightbox();

  const filtered = TELESCOPES.filter(t => filter === 'all' ? true : t.kind === filter);

  return (
    <>
      <PageHero
        kicker="Observatories"
        title="Every Eye on the Sky"
        sub="Live feeds plus a directory of the 25 most important telescopes in operation today."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>▶</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Live Streams</div>
            <h2 className="movement-title">Watching, Right Now</h2>
          </div>
        </header>
        <div className="tv-row reveal">
          {STREAMS.map(s => {
            const embedUrl   = `https://www.youtube.com/embed/live_stream?channel=${s.channel}&autoplay=0`;
            const fallback   = `https://www.youtube.com/channel/${s.channel}/live`;
            return (
              <div key={s.name} className="tv-cell">
                <div className="tv-iframe-wrap">
                  <iframe
                    src={embedUrl}
                    title={s.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <div className="tv-meta">
                  <div className="tv-meta-text">
                    <div className="tv-name">{s.name}</div>
                    <div className="tv-desc">{s.desc}</div>
                  </div>
                  <a className="tv-open" href={fallback} target="_blank" rel="noopener noreferrer">
                    Open on YouTube ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◐</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Free Access</div>
            <h2 className="movement-title">Use a Real Telescope, for Free</h2>
            <p className="movement-sub">Online platforms where you can browse professional survey data — and programmes that grant you actual time on real telescopes at no cost.</p>
          </div>
        </header>
        <div className="agency-grid reveal">
          {FREE_ACCESS.map(([name, by, desc, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="agency-card free-card">
              <div className="agency-h">
                <div>
                  <div className="agency-name">{name}</div>
                  <div className="agency-full">{by}</div>
                </div>
                <div className="agency-country">FREE</div>
              </div>
              <p className="agency-desc">{desc}</p>
              <div className="agency-link">Visit →</div>
            </a>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>+</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Directory</div>
            <h2 className="movement-title">The Great Observatories</h2>
            <p className="movement-sub">Twenty-five major telescopes. Each one has changed how we see the universe.</p>
          </div>
        </header>

        <div className="chip-row reveal">
          {[['all','All'],['space','Space-based'],['ground','Ground-based']].map(([k, label]) => (
            <button key={k}
              className={`chip ${filter === k ? 'active' : ''}`}
              onClick={() => setFilter(k)}>
              {label}
            </button>
          ))}
        </div>

        <div className="scope-grid reveal">
          {filtered.map(t => (
            <article key={t.id} className="scope-card">
              <div className="scope-img-pair">
                <TelescopeImage q={t.imageQuery} alt={`${t.name} instrument`} onClick={openLightbox} />
                <TelescopeImage q={t.sampleQuery} alt={`${t.name} sample image`} onClick={openLightbox} />
              </div>
              <div className="scope-h">
                <div className="scope-kind">{t.kind === 'space' ? 'Space telescope' : 'Ground observatory'}</div>
                <h3 className="scope-name">{t.name}</h3>
                {t.location && <div className="scope-loc">{t.location}</div>}
              </div>
              <p className="scope-desc">{t.description}</p>
              <div className="scope-meta">
                {t.aperture  && <div><span>Aperture</span>{t.aperture}</div>}
                {t.bands     && <div><span>Bands</span>{t.bands}</div>}
                {t.firstLight&& <div><span>First light</span>{t.firstLight}</div>}
                {t.operator  && <div><span>Operator</span>{t.operator}</div>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
