import { useEffect, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import { useReveal } from '../lib/useReveal.js';

/**
 * Carl Sagan's Cosmic Calendar — 13.8 billion years of cosmic history
 * compressed into a single Earth year, so each second of December 31
 * represents about 437 years of real time.
 *
 * Source: scaled from the standard Cosmic Calendar (Sagan, 1977).
 * One day ≈ 37.7 million years; one second ≈ 437.5 years.
 */
const EVENTS = [
  // January
  { date: 'Jan 1',  ago: '13.8 Gya', title: 'Big Bang',
    desc: 'Space, time, and all matter and energy come into existence in a hot, dense singularity. The universe begins expanding.' },
  { date: 'Jan 10', ago: '~13.4 Gya', title: 'First stars ignite',
    desc: 'Population III stars — the first generation, made only of hydrogen and helium — light up the dark cosmos.' },
  { date: 'Jan 14', ago: '~13.2 Gya', title: 'First galaxies form',
    desc: 'Gravity pulls clouds of gas and dark matter into the first proto-galaxies.' },

  // March
  { date: 'Mar 15', ago: '~11 Gya', title: 'Milky Way disk forms',
    desc: 'Our home galaxy organises into a rotating spiral, beginning to look like the Milky Way we know.' },

  // September
  { date: 'Sep 1',  ago: '~4.6 Gya', title: 'The solar system forms',
    desc: 'A cloud of gas and dust collapses. The Sun ignites at the centre, the planets coalesce from the disk.' },
  { date: 'Sep 6',  ago: '~4.54 Gya', title: 'Earth is born',
    desc: 'Our planet finishes accreting from the solar nebula. The crust is molten, the day is only 6 hours long.' },
  { date: 'Sep 14', ago: '~4 Gya', title: 'Earliest life on Earth',
    desc: 'Single-celled organisms appear — simple prokaryotes living in the early oceans.' },
  { date: 'Sep 30', ago: '~3.5 Gya', title: 'Photosynthesis begins',
    desc: 'Cyanobacteria learn to harvest sunlight. Over the next 2 billion years they will oxygenate the atmosphere.' },

  // October & November (a long, slow story)
  { date: 'Nov 9',  ago: '~2.1 Gya', title: 'Complex cells (eukaryotes)',
    desc: 'A larger cell engulfs a bacterium, which becomes a mitochondrion. The ancestor of all plants and animals.' },
  { date: 'Dec 5',  ago: '~1 Gya',  title: 'Multicellular life',
    desc: 'Cells begin to cooperate and specialise. The first multicellular organisms appear in the oceans.' },

  // December — most of life's drama happens in this single month
  { date: 'Dec 14', ago: '~570 Mya', title: 'Cambrian explosion',
    desc: 'Most major animal body plans appear within a few tens of millions of years. The oceans suddenly teem with complex life.' },
  { date: 'Dec 18', ago: '~450 Mya', title: 'Life moves onto land',
    desc: 'First plants colonise the continents, soon followed by arthropods and eventually vertebrates.' },
  { date: 'Dec 21', ago: '~370 Mya', title: 'First amphibians',
    desc: 'Four-legged vertebrates crawl from the water onto land.' },
  { date: 'Dec 23', ago: '~250 Mya', title: 'Permian extinction & age of dinosaurs',
    desc: 'The "Great Dying" wipes out 96% of species. Dinosaurs rise to dominance over the next 180 million years.' },
  { date: 'Dec 26', ago: '~150 Mya', title: 'Mammals diversify',
    desc: 'Small, mostly nocturnal mammals begin to fill ecological niches alongside the dinosaurs.' },
  { date: 'Dec 30, 06:24', ago: '~66 Mya', title: 'Asteroid impact ends the dinosaurs',
    desc: 'A 10 km asteroid strikes near present-day Chicxulub, Mexico. Three-quarters of species die. Mammals inherit the Earth.' },
  { date: 'Dec 31, 14:24', ago: '~6 Mya', title: 'Hominins split from chimpanzees',
    desc: 'Our lineage diverges from our closest living relatives.' },
  { date: 'Dec 31, 22:24', ago: '~2.5 Mya', title: 'First stone tools',
    desc: 'Early Homo species begin shaping stones into tools — the start of human technology.' },
  { date: 'Dec 31, 23:36', ago: '~300 kya', title: 'Modern humans appear',
    desc: 'Homo sapiens emerges in Africa.' },
  { date: 'Dec 31, 23:59:32', ago: '~12,000 ya', title: 'Agriculture begins',
    desc: 'Humans in the Fertile Crescent domesticate wheat and barley. Permanent settlements follow.' },
  { date: 'Dec 31, 23:59:47', ago: '~5,500 ya', title: 'Writing invented',
    desc: 'Cuneiform script appears in Mesopotamia. History begins.' },
  { date: 'Dec 31, 23:59:59.7', ago: '~120 ya', title: 'Powered flight',
    desc: 'Wright brothers take off at Kitty Hawk.' },
  { date: 'Dec 31, 23:59:59.85', ago: '~70 ya', title: 'Sputnik 1',
    desc: 'The space age begins.' },
  { date: 'Dec 31, 23:59:59.88', ago: '~55 ya', title: 'Apollo 11 lands on the Moon',
    desc: 'Humans set foot on another world for the first time.' },
  { date: 'NOW',  ago: 'present', title: 'You read this',
    desc: 'In the last 14 seconds of the cosmic year, humans built the entire body of recorded knowledge.' },
];

export default function CosmicCalendar() {
  useReveal();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 50);
    return () => clearInterval(id);
  }, []);

  // Compute "where in the cosmic year are we right now"
  // The cosmic year compresses 13.8 billion years into a 365.25-day Earth year.
  // We're at midnight Dec 31 — the present moment slides forward by 437.5 years per cosmic second.
  // To make this feel "live", we map real wall-clock time into the final seconds of Dec 31.
  const sec  = now.getSeconds() + now.getMilliseconds() / 1000;
  const yearsAgoNow = (60 - sec) * 437.5;        // years before midnight Dec 31
  const cosmicLabel = sec >= 59.998 ? 'NOW' : `${yearsAgoNow.toFixed(0)} years ago`;
  return (
    <>
      <PageHero
        kicker="Perspective"
        title="The Cosmic Calendar"
        sub="13.8 billion years of cosmic history compressed into a single year. Each second of December 31 represents 437 years."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>1</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Sagan's Compression</div>
            <h2 className="movement-title">A Year of Everything</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">If the entire history of the universe were compressed into a single calendar year, the Big Bang would happen at the very start of January 1, and right now would be midnight on December 31. On that scale, a single human lifetime is shorter than two-tenths of a second.</p>
          <p className="planet-desc-body">Carl Sagan introduced this idea in his 1977 book <em>The Dragons of Eden</em>, and made it famous on the Cosmos television series in 1980. It remains the simplest way to grasp how absurdly recent our species — and our entire civilisation — is on the cosmic timescale.</p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">·</div>
          <div className="movement-title-block">
            <div className="movement-kicker">Live · Right now</div>
            <h2 className="movement-title">{cosmicLabel}</h2>
            <p className="movement-sub">In the cosmic year, every Earth-second equals 437.5 real years sliding past you</p>
          </div>
        </header>
        <div className="cosmic-ticker reveal">
          <div className="cosmic-ticker-bar">
            <div className="cosmic-ticker-fill" style={{ width: `${(sec / 60) * 100}%` }}></div>
            <div className="cosmic-ticker-marker" style={{ left: `${(sec / 60) * 100}%` }}>
              <div className="cosmic-ticker-dot"></div>
              <div className="cosmic-ticker-label">{sec.toFixed(2)}s into the final minute</div>
            </div>
          </div>
          <div className="cosmic-ticker-scale">
            <span>23:59:00</span>
            <span>23:59:30</span>
            <span>00:00:00 (now)</span>
          </div>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num">∞</div>
          <div className="movement-title-block">
            <div className="movement-kicker">The Year So Far</div>
            <h2 className="movement-title">Major Events</h2>
          </div>
        </header>

        <div className="cosmic-timeline reveal">
          {EVENTS.map((e, i) => (
            <div key={i} className={`cosmic-row ${e.date === 'NOW' ? 'now' : ''}`}>
              <div className="cosmic-date">
                <div className="cosmic-date-cal">{e.date}</div>
                <div className="cosmic-date-real">{e.ago}</div>
              </div>
              <div className="cosmic-body">
                <h3 className="cosmic-title">{e.title}</h3>
                <p className="cosmic-desc">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
