import PageHero from '../components/ui/PageHero.jsx';
import TopicGallery from '../components/widgets/TopicGallery.jsx';
import { useReveal } from '../lib/useReveal.js';

const AGENCIES = [
  {
    name: 'NASA', full: 'National Aeronautics and Space Administration',
    country: 'United States', founded: '1958', budget: '$25.4B (2024)',
    tagline: 'For the benefit of all',
    notable: 'Apollo, Voyager, Hubble, JWST, Mars rovers, Artemis programme, ISS partner. The largest civilian space agency in history.',
    site: 'https://www.nasa.gov',
  },
  {
    name: 'Roscosmos', full: 'State Corporation for Space Activities',
    country: 'Russia', founded: '1992 (heir to Soviet space programme, 1955)',
    budget: '~$3B', tagline: 'Готов к работе и обороне',
    notable: 'Sputnik (1957), Vostok 1 (Gagarin, 1961), Mir, Soyuz crew vehicle, ISS partner. Operates Baikonur Cosmodrome.',
    site: 'https://www.roscosmos.ru/',
  },
  {
    name: 'ESA', full: 'European Space Agency',
    country: '22 European member states', founded: '1975', budget: '€7.79B (2024)',
    tagline: 'United space in Europe',
    notable: 'Ariane launcher family, Rosetta (first comet landing), Gaia (mapping the galaxy), JUICE (to Jupiter\'s moons), ExoMars, partner on JWST and ISS.',
    site: 'https://www.esa.int',
  },
  {
    name: 'JAXA', full: 'Japan Aerospace Exploration Agency',
    country: 'Japan', founded: '2003 (predecessors from 1955)',
    budget: '¥246.4B (~$1.7B)', tagline: 'Explore to realize',
    notable: 'Hayabusa & Hayabusa 2 (returned asteroid samples), Akatsuki (Venus orbiter), SLIM (lunar lander, 2024), Kibō module on ISS, H-II rocket family.',
    site: 'https://global.jaxa.jp/',
  },
  {
    name: 'ISRO', full: 'Indian Space Research Organisation',
    country: 'India', founded: '1969', budget: '~$1.6B',
    tagline: 'Mānav kalyāṇ ke liye antariksh prauddyogikī',
    notable: 'Chandrayaan-3 (first soft-landing near lunar south pole, 2023), Mangalyaan (Mars, first try, lowest cost), Aditya-L1 (solar), Gaganyaan (crewed, upcoming), PSLV workhorse.',
    site: 'https://www.isro.gov.in/',
  },
  {
    name: 'CNSA', full: 'China National Space Administration',
    country: 'China', founded: '1993',
    budget: '~$12B (estimated)', tagline: '航天报国',
    notable: 'Tiangong space station, Chang\'e lunar series (Chang\'e 6 returned far-side samples, 2024), Tianwen-1 Mars orbiter + rover, BeiDou satellite constellation.',
    site: 'http://www.cnsa.gov.cn/english/',
  },
  {
    name: 'CSA', full: 'Canadian Space Agency',
    country: 'Canada', founded: '1989', budget: 'C$615M (2024)',
    tagline: 'Inspiring through space',
    notable: 'Canadarm (Shuttle), Canadarm2 (ISS), Canadarm3 (Lunar Gateway, upcoming), Radarsat constellation, key partner on JWST (NIRISS).',
    site: 'https://www.asc-csa.gc.ca/',
  },
  {
    name: 'ISA', full: 'Italian Space Agency (Agenzia Spaziale Italiana)',
    country: 'Italy', founded: '1988', budget: '~€2.3B',
    notable: 'Major contributor to ESA. BeppoSAX (gamma-ray bursts), Mars Express HRSC camera, ExoMars, AMS-02 cosmic-ray detector on ISS.',
    site: 'https://www.asi.it/',
  },
  {
    name: 'DLR', full: 'German Aerospace Center',
    country: 'Germany', founded: '1969',
    notable: 'Largest single contributor to ESA. SOFIA airborne observatory (joint with NASA), MASCOT asteroid lander, BIROS satellite.',
    site: 'https://www.dlr.de/en',
  },
  {
    name: 'CNES', full: 'Centre national d\'études spatiales',
    country: 'France', founded: '1961',
    notable: 'Second-largest ESA contributor. CoRoT (first space exoplanet hunter), Microscope (Einstein equivalence test), SVOM gamma-ray mission, major role in Ariane.',
    site: 'https://cnes.fr/en',
  },
  {
    name: 'UK Space Agency',
    full: 'United Kingdom Space Agency',
    country: 'United Kingdom', founded: '2010',
    notable: 'ESA member, hosting the European Centre for Space Applications. Skynet military comms, Solar Orbiter instruments, Aeolus wind-measuring satellite.',
    site: 'https://www.gov.uk/government/organisations/uk-space-agency',
  },
  {
    name: 'KASA', full: 'Korea AeroSpace Administration',
    country: 'South Korea', founded: '2024 (predecessor KARI, 1989)',
    notable: 'Nuri (KSLV-II) launcher, Danuri lunar orbiter (2022), Korea Pathfinder Lunar Orbiter, future KSLV-III heavy rocket.',
    site: 'https://www.kasa.go.kr/',
  },
  {
    name: 'UAE Space Agency',
    full: 'United Arab Emirates Space Agency',
    country: 'United Arab Emirates', founded: '2014',
    notable: 'Hope Probe (Mars orbiter, 2021 — first Arab interplanetary mission), Rashid lunar rover (2023), MBR-SC satellite programme.',
    site: 'https://space.gov.ae/',
  },
  {
    name: 'AEB', full: 'Agência Espacial Brasileira',
    country: 'Brazil', founded: '1994',
    notable: 'Alcântara Launch Centre, CBERS Earth-observation satellites (with China), participation in Artemis Accords.',
    site: 'https://www.gov.br/aeb/',
  },
  {
    name: 'ASA', full: 'Australian Space Agency',
    country: 'Australia', founded: '2018',
    notable: 'Moon to Mars programme, deep-space communications (Canberra DSN station), Trailblazer lunar rover, hosting Square Kilometre Array.',
    site: 'https://www.space.gov.au/',
  },
];

const COMMERCIAL = [
  ['SpaceX',       'Falcon 9 (most reliable rocket in history), Falcon Heavy, Starship (largest rocket ever built), Crew Dragon (carrying astronauts since 2020), Starlink (over 6,000 satellites), reusable boosters.'],
  ['Blue Origin',  'New Shepard (suborbital tourism + research), New Glenn (orbital, first launch 2025), Blue Moon lunar lander (selected for Artemis 5).'],
  ['Rocket Lab',   'Electron rocket — the most successful small launcher in history. Neutron coming. Photon spacecraft platform.'],
  ['ULA',          'United Launch Alliance — Atlas V (workhorse since 2002), Delta IV Heavy (retired 2024), Vulcan Centaur (new flagship). Most reliable launch record in history.'],
  ['ISRO Commercial / NSIL', 'New Space India Ltd — the commercial arm of ISRO. PSLV/GSLV launches for global customers at industry-low prices.'],
  ['Arianespace',  'Commercial spinoff of ESA. Ariane 5 (retired 2023), Ariane 6 (new heavy lifter), Vega-C small launcher.'],
  ['Sierra Space', 'Dream Chaser spaceplane (cargo, then crew). Joint Orbital Reef commercial space station with Blue Origin.'],
  ['Axiom Space',  'Operating private astronaut missions to the ISS. Building Axiom Station — the first commercial successor to ISS.'],
];

export default function Agencies() {
  useReveal();
  return (
    <>
      <PageHero
        kicker="Who's Out There"
        title="Space Agencies of Earth"
        sub="Fifteen national space agencies and the commercial industry. All actively launching, exploring, or hosting humans in orbit today."
      />

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>i</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">In Depth</div>
            <h2 className="movement-title">A Civilisation in Orbit</h2>
          </div>
        </header>
        <div className="planet-description reveal">
          <p className="planet-desc-body">For the first half-century of the space age, only two nations could reach orbit. The Soviet Union got there first with Sputnik in 1957, and a four-year human-spaceflight gap (Gagarin 1961, Glenn 1962, Tereshkova 1963, Armstrong 1969) was followed by decades of bilateral competition.</p>
          <p className="planet-desc-body">Today, fourteen nations have launched satellites on their own rockets, dozens more have national space programmes, and a robust commercial industry has fundamentally rewritten the economics of access to space. SpaceX alone now launches more mass to orbit each year than every other operator combined.</p>
          <p className="planet-desc-body">The International Space Station — the most complex engineering project in history — is operated by NASA, Roscosmos, ESA, JAXA, and CSA together. The Artemis programme, returning humans to the Moon, includes signatories from over 40 nations. We have begun to act, very tentatively, like a planetary species.</p>
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>★</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">National Agencies</div>
            <h2 className="movement-title">The Fifteen</h2>
          </div>
        </header>
        <div className="agency-grid reveal">
          {AGENCIES.map(a => (
            <article key={a.name} className="agency-card">
              <div className="agency-h">
                <div>
                  <div className="agency-name">{a.name}</div>
                  <div className="agency-full">{a.full}</div>
                </div>
                <div className="agency-country">{a.country}</div>
              </div>
              <div className="agency-meta">
                {a.founded && <div><span>Founded</span>{a.founded}</div>}
                {a.budget  && <div><span>Budget</span>{a.budget}</div>}
              </div>
              {a.tagline && <div className="agency-tag">— {a.tagline}</div>}
              <p className="agency-desc">{a.notable}</p>
              {a.site && (
                <a className="agency-link" href={a.site} target="_blank" rel="noopener noreferrer">
                  Official site →
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◆</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Commercial</div>
            <h2 className="movement-title">Private Industry</h2>
            <p className="movement-sub">The companies launching rockets, satellites, and humans in 2026 — many for less than nations spent in 1990.</p>
          </div>
        </header>
        <div className="moons-grid reveal">
          {COMMERCIAL.map(([name, desc]) => (
            <article key={name} className="moon-card">
              <div className="moon-card-h">
                <h3 className="moon-name">{name}</h3>
              </div>
              <p className="moon-notable">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="movement">
        <header className="movement-header reveal">
          <div className="movement-num"><em>◉</em></div>
          <div className="movement-title-block">
            <div className="movement-kicker">Imagery</div>
            <h2 className="movement-title">Around the World</h2>
          </div>
        </header>
        <TopicGallery query="rocket launch" limit={12} />
      </section>
    </>
  );
}
