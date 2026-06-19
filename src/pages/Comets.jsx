import PageHero from '../components/ui/PageHero.jsx';
import LazyImage from '../components/ui/LazyImage.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import { useReveal } from '../lib/useReveal.js';

const SHOWERS = [
  ['Quadrantids',  'Jan 3-4',    "Up to 120 meteors/hour at peak. Origin: extinct comet 2003 EH₁."],
  ['Lyrids',       'Apr 22',     "10-20 meteors/hour. Long, bright trails. Origin: Comet Thatcher."],
  ['Eta Aquariids','May 5',      "50/hour in southern hemisphere. Origin: Halley's Comet."],
  ['Perseids',     'Aug 11-13',  "Up to 100/hour, very bright. Origin: Comet Swift-Tuttle. The most famous summer shower."],
  ['Draconids',    'Oct 8',      "Usually quiet, but capable of meteor storms. Origin: Comet Giacobini-Zinner."],
  ['Orionids',     'Oct 21',     "20/hour. Origin: Halley's Comet (second pass through its trail)."],
  ['Leonids',      'Nov 17',     "Normally 15/hour, but capable of historic storms (1833, 1966). Origin: Comet Tempel-Tuttle."],
  ['Geminids',     'Dec 13-14',  "120-160/hour. Most reliable major shower of the year. Origin: asteroid 3200 Phaethon."],
];

export default function Comets() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Travellers"
        title="Comets & Meteors"
        sub="Comets are dirty snowballs from the outer dark. When they fall near the sun, they grow tails light-years long."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">Visitors from the Cold</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">A comet is a small body of ice, dust, and rock — typically a few kilometres across — that spends most of its life in the frigid outer solar system. When its eccentric orbit brings it close to the Sun, the ice sublimates directly to vapour, dragging dust with it and forming the glowing coma and dramatic tail.</p>
          <p className="planet-desc-body">Comets come from two main reservoirs: the Kuiper Belt (just beyond Neptune), source of short-period comets like Halley's; and the Oort Cloud, a spherical shell of icy bodies extending nearly a light-year from the Sun, source of long-period comets that may appear only once in tens of thousands of years.</p>
          <p className="planet-desc-body">Meteor showers occur when Earth passes through a debris trail left by a comet. Most of what burns up in the atmosphere is no bigger than a grain of sand.</p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>★</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Calendar</div>
            <h2 className="movement-title">Annual Meteor Showers</h2>
          </div>
        </header>
        <div className="moons-grid reveal">
          {SHOWERS.map(([name, when, desc]) => (
            <article key={name} className="moon-card has-image">
              <LazyImage query={`${name} meteor shower`} alt={name} aspectRatio="16/9" />
              <div className="moon-card-body">
                <div className="moon-card-h">
                  <h3 className="moon-name">{name}</h3>
                  <div className="moon-diameter">{when}</div>
                </div>
                <p className="moon-notable">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery</div>
            <h2 className="movement-title">Comets in Flight</h2>
          </div>
        </header>
        <TopicGallery query="comet" limit={12} />
      </section>
    </>
  );
}
