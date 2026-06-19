import PageHero from '../components/ui/PageHero.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import LazyImage from '../components/ui/LazyImage.jsx';
import { useReveal } from '../lib/useReveal.js';
import { STARS } from '../data/stars.js';

export default function Stars() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Stars"
        title="Stars"
        sub="A guided tour of the stars that matter — the brightest in our sky, the closest to home, the largest known, and the strangest yet found."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">What a Star Is</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">A star is a self-gravitating ball of plasma held in equilibrium by the outward pressure of nuclear fusion at its core. Stars are the engines of cosmic chemistry — every element heavier than helium was forged either in the heart of a star or in its dying explosion. The carbon in your cells, the oxygen in the air, the iron in your blood, the gold on your finger: every atom came from a star. You are made of starlight.</p>
          <p className="planet-desc-body">There are perhaps 200 sextillion stars in the observable universe — a 2 followed by 23 zeroes. The Milky Way alone holds 400 billion. Below is a curated tour of the ones we know best.</p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>★</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Catalogue</div>
            <h2 className="movement-title">Notable Stars</h2>
          </div>
        </header>
        <div className="stars-grid reveal">
          {STARS.map(s => (
            <article key={s.id} className="star-card has-image">
              <LazyImage
                query={`${s.name} star`}
                alt={s.name}
                aspectRatio="16/9"
                className="star-card-img"
              />
              <div className="star-card-body">
                <div className="star-header">
                  <div className="star-h-left">
                    <div className="star-constellation">{s.constellation}</div>
                    <h3 className="star-name">{s.name}</h3>
                    {s.also && <div className="star-also">{s.also}</div>}
                  </div>
                  <div className="star-mag">
                    <div className="star-mag-num">{s.apparentMag}</div>
                    <div className="star-mag-label">mag</div>
                  </div>
                </div>
                <div className="star-tag">— {s.tagline}</div>
                <p className="star-desc">{s.description}</p>
                <div className="star-stats">
                  <div><span>Distance</span>{s.distance}</div>
                  <div><span>Mass</span>{s.mass}</div>
                  <div><span>Radius</span>{s.radius}</div>
                  <div><span>Temp</span>{s.temp}</div>
                  <div><span>Type</span>{s.type}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery · NASA</div>
            <h2 className="movement-title">Stars in Photographs</h2>
          </div>
        </header>
        <TopicGallery query="stellar nursery" limit={14} />
      </section>
    </>
  );
}
