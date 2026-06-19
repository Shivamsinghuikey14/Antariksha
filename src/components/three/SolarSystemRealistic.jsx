import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const TEX='https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/';
function logDist(au){return 3+Math.pow(au,0.55)*8;}

function buildSatellite(color,scale=1){
  const g=new THREE.Group();const s=scale;
  g.add(new THREE.Mesh(new THREE.BoxGeometry(0.07*s,0.04*s,0.04*s),new THREE.MeshPhongMaterial({color:0xccccdd,shininess:20})));
  const pMat=new THREE.MeshPhongMaterial({color:0x224488,side:THREE.DoubleSide,shininess:10});
  const lp=new THREE.Mesh(new THREE.PlaneGeometry(0.14*s,0.05*s),pMat);lp.position.x=-0.1*s;g.add(lp);
  const rp=new THREE.Mesh(new THREE.PlaneGeometry(0.14*s,0.05*s),pMat);rp.position.x=0.1*s;g.add(rp);
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.003*s,0.003*s,0.06*s),new THREE.MeshPhongMaterial({color:0xaaaaaa})));
  const dish=new THREE.Mesh(new THREE.SphereGeometry(0.02*s,8,4,0,Math.PI*2,0,Math.PI/2),new THREE.MeshPhongMaterial({color:0xdddddd,side:THREE.DoubleSide}));
  dish.position.y=0.04*s;dish.rotation.x=-Math.PI/2;g.add(dish);
  const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');
  const gr=x.createRadialGradient(16,16,2,16,16,16);
  gr.addColorStop(0,'#'+color.toString(16).padStart(6,'0'));gr.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle=gr;x.fillRect(0,0,32,32);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
  glow.scale.set(0.3*s,0.3*s,1);g.add(glow);
  return g;
}

// Canvas radial sprite helper (for nebulae, star glows, core glow)
function radialSprite(stops,size=128){
  const c=document.createElement('canvas');c.width=c.height=size;
  const x=c.getContext('2d');
  const g=x.createRadialGradient(size/2,size/2,size*0.05,size/2,size/2,size/2);
  for(const [o,col] of stops)g.addColorStop(o,col);
  x.fillStyle=g;x.fillRect(0,0,size,size);
  return new THREE.CanvasTexture(c);
}

// Photoreal galaxy painted on canvas — smooth nebulosity, not dots
function paintGalaxy(size=2048,arms=4,twist=0.0045){
  const c=document.createElement('canvas');c.width=c.height=size;
  const x=c.getContext('2d');
  const cx=size/2,cy=size/2;
  // Core glow
  let g=x.createRadialGradient(cx,cy,0,cx,cy,size*0.5);
  g.addColorStop(0,'rgba(255,238,205,1)');
  g.addColorStop(0.07,'rgba(255,215,160,0.9)');
  g.addColorStop(0.18,'rgba(235,195,155,0.4)');
  g.addColorStop(0.45,'rgba(180,165,175,0.13)');
  g.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle=g;x.fillRect(0,0,size,size);
  // Spiral arms — thousands of soft blobs along log spirals
  x.globalCompositeOperation='lighter';
  for(let arm=0;arm<arms;arm++){
    const phase=arm*(Math.PI*2/arms);
    for(let i=0;i<1500;i++){
      const t=Math.random();
      const r=40+t*size*0.46;
      const theta=phase+r*twist+(Math.random()-0.5)*0.25;
      const px=cx+Math.cos(theta)*r,py=cy+Math.sin(theta)*r;
      const s=(1-t)*20+4+Math.random()*10;
      const k=Math.random();
      let col;
      if(k<0.06)col='rgba(255,150,180,0.10)';
      else if(k<0.7)col='rgba(170,195,255,0.08)';
      else col='rgba(255,230,200,0.07)';
      const gg=x.createRadialGradient(px,py,0,px,py,s);
      gg.addColorStop(0,col);gg.addColorStop(1,'rgba(0,0,0,0)');
      x.fillStyle=gg;x.beginPath();x.arc(px,py,s,0,7);x.fill();
    }
  }
  // Star pinpricks
  for(let i=0;i<3500;i++){
    const a=Math.random()*Math.PI*2,r=Math.pow(Math.random(),0.6)*size*0.48;
    const px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r*0.96;
    const s=Math.random()*1.6+0.3;
    x.fillStyle=`rgba(255,255,255,${0.3+Math.random()*0.5})`;
    x.fillRect(px,py,s,s);
  }
  // Dust lanes — dark arcs carved out
  x.globalCompositeOperation='destination-out';
  for(let arm=0;arm<arms;arm++){
    const phase=arm*(Math.PI*2/arms)+0.16;
    for(let i=0;i<550;i++){
      const t=Math.random();
      const r=85+t*size*0.4;
      const theta=phase+r*twist+(Math.random()-0.5)*0.1;
      const px=cx+Math.cos(theta)*r,py=cy+Math.sin(theta)*r;
      const s=6+Math.random()*16;
      const gg=x.createRadialGradient(px,py,0,px,py,s);
      gg.addColorStop(0,'rgba(0,0,0,0.28)');gg.addColorStop(1,'rgba(0,0,0,0)');
      x.fillStyle=gg;x.beginPath();x.arc(px,py,s,0,7);x.fill();
    }
  }
  x.globalCompositeOperation='source-over';
  return new THREE.CanvasTexture(c);
}

// Black hole accretion disk — doppler-beamed like the EHT Sgr A*/M87 images
function paintAccretion(size=512){
  const c=document.createElement('canvas');c.width=c.height=size;
  const x=c.getContext('2d');const cx=size/2;
  const g=x.createRadialGradient(cx,cx,size*0.16,cx,cx,size*0.5);
  g.addColorStop(0,'rgba(0,0,0,0)');
  g.addColorStop(0.18,'rgba(255,240,210,1)');
  g.addColorStop(0.35,'rgba(255,160,60,0.85)');
  g.addColorStop(0.65,'rgba(200,80,20,0.35)');
  g.addColorStop(1,'rgba(80,20,5,0)');
  x.fillStyle=g;x.fillRect(0,0,size,size);
  // Doppler beaming — approaching side bright, receding dark
  const lg=x.createLinearGradient(0,0,size,0);
  lg.addColorStop(0,'rgba(0,0,0,0.6)');lg.addColorStop(0.5,'rgba(0,0,0,0)');lg.addColorStop(1,'rgba(0,0,0,0)');
  x.globalCompositeOperation='source-atop';x.fillStyle=lg;x.fillRect(0,0,size,size);
  // Event horizon shadow
  x.globalCompositeOperation='destination-out';
  const h=x.createRadialGradient(cx,cx,0,cx,cx,size*0.17);
  h.addColorStop(0,'rgba(0,0,0,1)');h.addColorStop(0.9,'rgba(0,0,0,1)');h.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle=h;x.beginPath();x.arc(cx,cx,size*0.17,0,7);x.fill();
  x.globalCompositeOperation='source-over';
  return new THREE.CanvasTexture(c);
}

const PLANETS=[
  {name:'Mercury',radius:0.30,au:0.387,period:87.97,tex:'mercurymap.jpg',
   info:{mass:'3.30×10²³ kg',gravity:'3.7 m/s²',temp:'−180 to 430°C',day:'58.6 days',year:'88 days',moons:0,atmosphere:'None (traces O₂, Na)',weather:'No atmosphere. 430°C day → −180°C night.'},moons:[],sats:[]},
  {name:'Venus',radius:0.55,au:0.723,period:224.7,tex:'venusmap.jpg',atmos:{color:0xf0d8a0,op:0.3},
   info:{mass:'4.87×10²⁴ kg',gravity:'8.87 m/s²',temp:'462°C',day:'243 days (retro)',year:'225 days',moons:0,atmosphere:'96% CO₂ · 92× pressure',weather:'Sulphuric acid clouds, 360 km/h winds.'},moons:[],sats:[]},
  {name:'Earth',radius:0.60,au:1.0,period:365.25,tex:'earthmap1k.jpg',clouds:'earthcloudmap.jpg',atmos:{color:0x6699ff,op:0.12},
   info:{mass:'5.97×10²⁴ kg',gravity:'9.81 m/s²',temp:'−89 to 57°C',day:'24h',year:'365.25 days',moons:1,atmosphere:'78% N₂, 21% O₂',weather:'Hurricanes, jet streams, monsoons, polar vortex.'},
   moons:[{name:'Moon',r:0.16,d:1.6,sp:1.2,color:0xccccbb,info:'384,400 km. Tidally locked. Apollo 11 Jul 1969. 6th largest moon.'}],
   sats:[
     {name:'ISS',r:0.7,sp:5,color:0x44ff44,scale:1.5,info:'408 km alt. 27,600 km/h. Crew ~7. Since Nov 2000.'},
     {name:'Hubble',r:0.85,sp:4.5,color:0x66aaff,scale:1,info:'547 km. 2.4m mirror. Since 1990. 1.5M observations.'},
     {name:'JWST',r:3.2,sp:0.3,color:0xffaa44,scale:1.2,info:'L2 point. 1.5M km. 6.5m mirror. Since Dec 2021.'},
     {name:'GPS (constellation)',r:1.1,sp:2,color:0x44ddaa,scale:0.6,info:'31 satellites at 20,200 km MEO.'},
     {name:'Starlink (LEO)',r:0.6,sp:6,color:0xaaaaaa,scale:0.4,info:'~6,000 satellites. 550 km. SpaceX.'},
   ]},
  {name:'Mars',radius:0.42,au:1.524,period:687,tex:'marsmap1k.jpg',atmos:{color:0xddaa88,op:0.06},
   info:{mass:'6.42×10²³ kg',gravity:'3.72 m/s²',temp:'−140 to 20°C',day:'24h 37m (1 sol)',year:'687 days',moons:2,atmosphere:'95% CO₂ · 0.6% pressure',weather:'Global dust storms months long. Dust devils 8 km. CO₂ snow.'},
   moons:[
     {name:'Phobos',r:0.06,d:1.1,sp:2.5,color:0x998877,info:'22 km. Stickney crater. Crashing into Mars in ~50M yrs.'},
     {name:'Deimos',r:0.04,d:1.6,sp:1.5,color:0xaa9988,info:'12 km. Smoothest body. Slowly drifting away.'},
   ],
   sats:[
     {name:'MRO',r:0.7,sp:4,color:0x44aaff,scale:1,info:'HiRISE camera. Since 2006.'},
     {name:'MAVEN',r:0.9,sp:3,color:0x88ff44,scale:1,info:'Upper atmosphere study. Since 2014.'},
     {name:'TGO',r:0.8,sp:3.5,color:0xffaa88,scale:0.8,info:'Trace Gas Orbiter. ESA/Roscosmos. Since 2016.'},
   ]},
  {name:'Jupiter',radius:1.50,au:5.203,period:4332,tex:'jupitermap.jpg',
   info:{mass:'1.90×10²⁷ kg',gravity:'24.79 m/s²',temp:'−145°C',day:'9h 56m',year:'11.86 yr',moons:95,atmosphere:'90% H₂, 10% He',weather:'Great Red Spot (350+ yr, 2× Earth, 430 km/h). Lightning 10× Earth.'},
   moons:[
     {name:'Io',r:0.14,d:2.8,sp:3,color:0xeecc44,info:'400+ volcanoes. Lava 1,600°C.'},
     {name:'Europa',r:0.12,d:3.5,sp:2.2,color:0xccddee,info:'100-km ocean under ice. Top life candidate.'},
     {name:'Ganymede',r:0.17,d:4.5,sp:1.5,color:0xaabb99,info:'Largest moon. Bigger than Mercury. Own magnetic field.'},
     {name:'Callisto',r:0.15,d:5.5,sp:1,color:0x887766,info:'Most cratered body known.'},
     {name:'Amalthea',r:0.03,d:2.2,sp:4,color:0xcc6644,info:'250 km. Reddest body in solar system.'},
   ],
   sats:[{name:'Juno',r:3,sp:1.5,color:0xff6644,scale:1,info:'Polar orbit since 2016.'}]},
  {name:'Saturn',radius:1.30,au:9.537,period:10759,tex:'saturnmap.jpg',ring:'saturnringcolor.jpg',
   info:{mass:'5.68×10²⁶ kg',gravity:'10.44 m/s²',temp:'−178°C',day:'10h 42m',year:'29.46 yr',moons:146,atmosphere:'96% H₂, 3% He',weather:'Hexagonal polar vortex. Great White Spots. 1,800 km/h jets.'},
   moons:[
     {name:'Titan',r:0.16,d:3.5,sp:0.8,color:0xcc9944,info:'Methane rain/lakes. Huygens 2005.'},
     {name:'Enceladus',r:0.05,d:2.5,sp:2,color:0xeeeeff,info:'Water geysers. Life candidate.'},
     {name:'Mimas',r:0.04,d:2.0,sp:2.5,color:0xbbbbaa,info:'Death Star crater. 396 km.'},
     {name:'Rhea',r:0.07,d:3.0,sp:1.2,color:0xaaaaaa,info:'1,527 km. Heavily cratered.'},
     {name:'Iapetus',r:0.07,d:5.0,sp:0.4,color:0x665544,info:'Two-tone. 20-km ridge.'},
     {name:'Tethys',r:0.05,d:2.3,sp:2.2,color:0xddddcc,info:'Odysseus crater + Ithaca Chasma.'},
     {name:'Dione',r:0.05,d:2.7,sp:1.5,color:0xccccbb,info:'Ice cliffs. Wispy terrain.'},
     {name:'Hyperion',r:0.03,d:4.2,sp:0.6,color:0xaa9966,info:'Sponge shape. Chaotic rotation.'},
   ],sats:[]},
  {name:'Uranus',radius:0.85,au:19.19,period:30688,tex:'uranusmap.jpg',tilt:97.77,
   info:{mass:'8.68×10²⁵ kg',gravity:'8.87 m/s²',temp:'−224°C',day:'17h 14m (retro)',year:'84 yr',moons:28,atmosphere:'83% H₂, 15% He, 2% CH₄',weather:'98° tilt — 42-yr seasons. Diamond rain deep inside.'},
   moons:[
     {name:'Miranda',r:0.05,d:1.8,sp:2,color:0xaabbbb,info:'Verona Rupes — 20 km cliff.'},
     {name:'Ariel',r:0.06,d:2.2,sp:1.8,color:0xbbcccc,info:'Brightest Uranian moon.'},
     {name:'Umbriel',r:0.06,d:2.6,sp:1.3,color:0x777788,info:'Darkest major moon.'},
     {name:'Titania',r:0.08,d:3.2,sp:1,color:0x998888,info:'Largest Uranian moon. 1,578 km.'},
     {name:'Oberon',r:0.07,d:3.8,sp:0.8,color:0x887777,info:'6-km mountain on limb.'},
   ],sats:[]},
  {name:'Neptune',radius:0.82,au:30.07,period:60182,tex:'neptunemap.jpg',
   info:{mass:'1.02×10²⁶ kg',gravity:'11.15 m/s²',temp:'−218°C',day:'16h 6m',year:'164.8 yr',moons:16,atmosphere:'80% H₂, 19% He, 1% CH₄',weather:'Fastest winds — 2,100 km/h. Supersonic methane storms.'},
   moons:[
     {name:'Triton',r:0.11,d:2.3,sp:1.3,color:0xccddee,info:'Retrograde. N₂ geysers 8 km. −235°C.'},
     {name:'Proteus',r:0.04,d:1.5,sp:2,color:0x889999,info:'420 km. Largest non-round moon.'},
     {name:'Nereid',r:0.03,d:4,sp:0.2,color:0x778888,info:'Most eccentric moon orbit.'},
   ],sats:[]},
];

const DWARFS=[
  {name:'Ceres',radius:0.12,au:2.77,period:1682,color:0x999988,info:'Largest belt object. 940 km. Bright salt deposits.',moons:[]},
  {name:'Pluto',radius:0.16,au:39.5,period:90560,color:0xddccaa,info:'Heart-shaped Tombaugh Regio. New Horizons Jul 2015.',
   moons:[
     {name:'Charon',r:0.08,d:1.5,sp:0.5,color:0x887766,info:'Half Pluto size. Binary system.'},
     {name:'Nix',r:0.02,d:2.2,sp:0.8,color:0xaaaaaa,info:'50 km. Chaotic rotation.'},
     {name:'Hydra',r:0.02,d:2.8,sp:0.6,color:0xbbbbaa,info:'65 km. Discovered 2005.'},
   ]},
  {name:'Haumea',radius:0.10,au:43.1,period:103774,color:0xccccbb,info:'Egg-shaped. 3.9h rotation. Has a ring.',moons:[]},
  {name:'Makemake',radius:0.10,au:45.8,period:112897,color:0xddbbaa,info:'2nd brightest KBO after Pluto.',moons:[]},
  {name:'Eris',radius:0.14,au:67.7,period:204199,color:0xcccccc,info:'Most massive dwarf planet.',
   moons:[{name:'Dysnomia',r:0.03,d:1.8,sp:0.3,color:0x888888,info:'~700 km. Discovered 2005.'}]},
];

const DEEP_SATS=[
  {name:'Voyager 1',au:163,angle:0.8,color:0xff4444,info:'Interstellar since Aug 2012. 24.5 billion km. Launched 1977.'},
  {name:'Voyager 2',au:137,angle:3.5,color:0xff6644,info:'Interstellar since Nov 2018. Only Uranus/Neptune visitor.'},
  {name:'New Horizons',au:58,angle:1.2,color:0x44ddff,info:'Kuiper Belt. Pluto 2015, Arrokoth 2019.'},
  {name:'Parker Solar Probe',au:0.05,angle:0,color:0xffdd00,info:'Touched the corona. 700,000 km/h.'},
  {name:'Solar Orbiter',au:0.28,angle:2.1,color:0xffaa00,info:'First Sun pole photos. ESA/NASA.'},
  {name:'JUICE',au:3.5,angle:4.5,color:0x88aaff,info:'To Jupiter 2031. Europa/Ganymede flybys.'},
  {name:'Europa Clipper',au:2.8,angle:5.2,color:0x66ccff,info:'To Jupiter 2030. 49 Europa flybys.'},
  {name:'Pioneer 10',au:130,angle:1.8,color:0xaa4444,info:'Silent since 2003. Gold plaque aboard.'},
];

// Nearby stars — visible at universe zoom, clickable
const NEARBY_STARS=[
  {name:'Proxima Centauri',d:900,a:0.5,e:0.1,color:0xff8866,size:5,info:{distance:'4.24 light-years',type:'Red dwarf (M5.5)',note:'Closest star to the Sun. Hosts Proxima b — a potentially habitable exoplanet.'}},
  {name:'Alpha Centauri A/B',d:920,a:0.55,e:0.12,color:0xfff4cc,size:8,info:{distance:'4.37 light-years',type:'Binary — G2 + K1',note:'Nearest Sun-like star system. Breakthrough Starshot target.'}},
  {name:'Sirius',d:1100,a:2.2,e:-0.2,color:0xcceeff,size:10,info:{distance:'8.6 light-years',type:'A1 + white dwarf',note:'Brightest star in our night sky. The Dog Star.'}},
  {name:'Vega',d:1400,a:3.8,e:0.4,color:0xddeeff,size:9,info:{distance:'25 light-years',type:'A0 main sequence',note:'Was the pole star ~12,000 BC. First star photographed (1850).'}},
  {name:'Betelgeuse',d:1800,a:4.6,e:0.25,color:0xff6633,size:14,info:{distance:'~550 light-years',type:'Red supergiant (M1)',note:'If placed at the Sun, would engulf Mars. Will go supernova within ~100,000 years.'}},
  {name:'Polaris',d:1600,a:1.4,e:0.8,color:0xffffdd,size:8,info:{distance:'433 light-years',type:'F7 supergiant (Cepheid)',note:'The North Star. Aligned with Earth\'s axis — for now.'}},
];

export default function SolarSystemRealistic({onSelect,ctrlRef}){
  const mountRef=useRef(null);
  useEffect(()=>{
    const mount=mountRef.current;if(!mount)return;
    const scene=new THREE.Scene();
    scene.fog=new THREE.FogExp2(0x020408,0.0004);
    const camera=new THREE.PerspectiveCamera(45,1,0.01,8000);
    camera.position.set(0,25,45);
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.05;
    renderer.domElement.style.cssText='display:block;width:100%;height:100%';
    mount.appendChild(renderer.domElement);
    const composer=new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene,camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(800,600),1.6,0.55,0.78));
    const resize=()=>{const w=mount.clientWidth||innerWidth,h=mount.clientHeight||innerHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();composer.setSize(w,h);};
    setTimeout(resize,50);addEventListener('resize',resize);
    const ro=new ResizeObserver(resize);ro.observe(mount);
    const controls=new OrbitControls(camera,renderer.domElement);
    controls.enableDamping=true;controls.dampingFactor=0.07;controls.minDistance=3;controls.maxDistance=2600;
    scene.add(new THREE.AmbientLight(0x111122,0.25));
    scene.add(new THREE.PointLight(0xfff2cc,4,800,0.8));
    const loader=new THREE.TextureLoader();loader.crossOrigin='anonymous';
    // Soft glow texture so stars render as orbs, NOT square pixels (declared early — used by belts/starfield/galaxy)
    const softStar=radialSprite([[0,'rgba(255,255,255,1)'],[0.35,'rgba(255,255,255,0.4)'],[1,'rgba(255,255,255,0)']],64);
    const labels=[],allClick=[],orbitLines=[],orbitsArr=[];
    function tag(text,color){const el=document.createElement('div');el.className='ss3d-tag';el.textContent=text;el.style.color=color||'#ffd28a';mount.appendChild(el);labels.push(el);return el;}

    const galacticPivot=new THREE.Group();scene.add(galacticPivot);

    // ══ SUN — animated fire shader (like the reference photo) ════════
    const sunUniforms={uTime:{value:0}};
    const sunMat=new THREE.ShaderMaterial({
      uniforms:sunUniforms,
      vertexShader:`varying vec2 vUv;varying vec3 vN;void main(){vUv=uv;vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader:`
        uniform float uTime;varying vec2 vUv;varying vec3 vN;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}
        float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=0.5;}return v;}
        void main(){
          vec2 p=vUv*7.0;
          float n=fbm(p+vec2(uTime*0.12,uTime*0.05))+0.55*fbm(p*2.2-vec2(uTime*0.08,0.0));
          vec3 deep=vec3(0.85,0.25,0.02);
          vec3 mid=vec3(1.0,0.55,0.08);
          vec3 hot=vec3(1.0,0.95,0.62);
          vec3 col=mix(deep,mid,smoothstep(0.25,0.75,n));
          col=mix(col,hot,smoothstep(0.72,1.15,n));
          col+=pow(max(n-0.6,0.0),2.0)*vec3(1.0,0.8,0.4)*2.0;
          float rim=pow(1.0-abs(dot(vN,vec3(0.0,0.0,1.0))),2.2);
          col+=rim*vec3(1.0,0.45,0.08)*1.2;
          gl_FragColor=vec4(col*1.5,1.0);
        }`
    });
    const sun=new THREE.Mesh(new THREE.SphereGeometry(2.2,96,96),sunMat);
    galacticPivot.add(sun);
    // Corona layers — like the photo's fiery halo
    const corona1=new THREE.Sprite(new THREE.SpriteMaterial({map:radialSprite([[0,'rgba(255,230,160,0.9)'],[0.25,'rgba(255,160,50,0.5)'],[0.55,'rgba(255,90,20,0.18)'],[1,'rgba(255,50,10,0)']],256),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
    corona1.scale.set(11,11,1);galacticPivot.add(corona1);
    const corona2=new THREE.Sprite(new THREE.SpriteMaterial({map:radialSprite([[0,'rgba(255,140,40,0.35)'],[0.5,'rgba(255,80,20,0.12)'],[1,'rgba(200,40,5,0)']],256),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
    corona2.scale.set(20,20,1);galacticPivot.add(corona2);
    tag('☉ The Sun','#ffcc44');

    // ── PLANETS ──────────────────────────────────────────────────────
    for(const p of PLANETS){
      const dist=logDist(p.au);
      const og=new THREE.RingGeometry(dist-0.01,dist+0.01,128);og.rotateX(-Math.PI/2);
      const oLine=new THREE.Mesh(og,new THREE.MeshBasicMaterial({color:0x3a4a5f,transparent:true,opacity:0.2,side:THREE.DoubleSide}));
      galacticPivot.add(oLine);orbitLines.push(oLine);
      const pivot=new THREE.Group();galacticPivot.add(pivot);
      if(p.tilt)pivot.rotation.x=p.tilt*Math.PI/180;
      const pMat=new THREE.MeshPhongMaterial({shininess:8});
      const pm=new THREE.Mesh(new THREE.SphereGeometry(p.radius,48,48),pMat);
      pm.position.x=dist;pm.userData={type:'planet',data:p};pivot.add(pm);allClick.push(pm);
      loader.load(TEX+p.tex,t=>{pMat.map=t;pMat.needsUpdate=true;});
      if(p.atmos)pm.add(new THREE.Mesh(new THREE.SphereGeometry(p.radius*1.06,32,32),new THREE.MeshBasicMaterial({color:p.atmos.color,transparent:true,opacity:p.atmos.op,side:THREE.BackSide})));
      let cloudM=null;
      if(p.clouds){const cM=new THREE.MeshPhongMaterial({transparent:true,opacity:0.4,depthWrite:false});cloudM=new THREE.Mesh(new THREE.SphereGeometry(p.radius*1.015,48,48),cM);pm.add(cloudM);loader.load(TEX+p.clouds,t=>{cM.map=t;cM.needsUpdate=true;});}
      if(p.ring){const rM=new THREE.MeshBasicMaterial({side:THREE.DoubleSide,transparent:true,opacity:0.9});const ring=new THREE.Mesh(new THREE.RingGeometry(p.radius*1.4,p.radius*2.3,96),rM);ring.rotation.x=-Math.PI/2.2;pm.add(ring);loader.load(TEX+p.ring,t=>{rM.map=t;rM.needsUpdate=true;});}
      const pLabel=tag(p.name,'#ffd28a');
      const omega=(Math.PI*2/(16*60))*(365.25/p.period);
      pivot.rotation.y=Math.random()*Math.PI*2;
      const moonArr=[],satArr3=[];
      for(const m of(p.moons||[])){
        const mp=new THREE.Group();pm.add(mp);
        const mm=new THREE.Mesh(new THREE.SphereGeometry(m.r,16,16),new THREE.MeshPhongMaterial({color:m.color,shininess:3}));
        mm.position.x=m.d;mm.userData={type:'moon',data:m,parentName:p.name};mp.add(mm);allClick.push(mm);
        const moG=new THREE.RingGeometry(m.d-0.005,m.d+0.005,64);moG.rotateX(-Math.PI/2);
        const moLine=new THREE.Mesh(moG,new THREE.MeshBasicMaterial({color:0x445566,transparent:true,opacity:0.15,side:THREE.DoubleSide}));
        pm.add(moLine);orbitLines.push(moLine);
        moonArr.push({pivot:mp,mesh:mm,speed:m.sp,label:tag(m.name,'#7799bb')});
      }
      for(const s of(p.sats||[])){
        const sp=new THREE.Group();pm.add(sp);
        const satShape=buildSatellite(s.color,s.scale||1);
        satShape.position.x=s.r;sp.add(satShape);
        const hitBox=new THREE.Mesh(new THREE.SphereGeometry(0.1*(s.scale||1),6,6),new THREE.MeshBasicMaterial({visible:false}));
        hitBox.position.x=s.r;hitBox.userData={type:'satellite',data:s};sp.add(hitBox);allClick.push(hitBox);
        satArr3.push({pivot:sp,mesh:satShape,speed:s.sp,label:tag(s.name,'#'+s.color.toString(16).padStart(6,'0'))});
      }
      orbitsArr.push({name:p.name,pivot,mesh:pm,cloudM,omega,label:pLabel,moonArr,satArr:satArr3});
    }

    // ── DWARFS ───────────────────────────────────────────────────────
    for(const d of DWARFS){
      const dist=logDist(d.au);
      const pivot=new THREE.Group();galacticPivot.add(pivot);
      const dm2=new THREE.Mesh(new THREE.SphereGeometry(d.radius,24,24),new THREE.MeshPhongMaterial({color:d.color,shininess:3}));
      dm2.position.x=dist;dm2.userData={type:'dwarf',data:d};pivot.add(dm2);allClick.push(dm2);
      const og2=new THREE.RingGeometry(dist-0.008,dist+0.008,96);og2.rotateX(-Math.PI/2);
      const oL2=new THREE.Mesh(og2,new THREE.MeshBasicMaterial({color:0x2a3a4f,transparent:true,opacity:0.12,side:THREE.DoubleSide}));
      galacticPivot.add(oL2);orbitLines.push(oL2);
      const dLabel=tag(d.name,'#aabbcc');
      const omega2=(Math.PI*2/(16*60))*(365.25/d.period);
      pivot.rotation.y=Math.random()*Math.PI*2;
      const moonArr2=[];
      for(const m of(d.moons||[])){
        const mp2=new THREE.Group();dm2.add(mp2);
        const mm2=new THREE.Mesh(new THREE.SphereGeometry(m.r,12,12),new THREE.MeshPhongMaterial({color:m.color,shininess:2}));
        mm2.position.x=m.d;mm2.userData={type:'moon',data:m,parentName:d.name};mp2.add(mm2);allClick.push(mm2);
        moonArr2.push({pivot:mp2,mesh:mm2,speed:m.sp,label:tag(m.name,'#7799bb')});
      }
      orbitsArr.push({name:d.name,pivot,mesh:dm2,omega:omega2,label:dLabel,moonArr:moonArr2,satArr:[]});
    }

    // ── DEEP PROBES ──────────────────────────────────────────────────
    const deepArr=[];
    for(const s of DEEP_SATS){
      const dist=logDist(s.au);
      const sat=buildSatellite(s.color,1.5);
      sat.position.set(Math.cos(s.angle)*dist,(Math.random()-0.5)*2,Math.sin(s.angle)*dist);
      galacticPivot.add(sat);
      const hb=new THREE.Mesh(new THREE.SphereGeometry(0.15,6,6),new THREE.MeshBasicMaterial({visible:false}));
      hb.position.copy(sat.position);hb.userData={type:'satellite',data:s};galacticPivot.add(hb);allClick.push(hb);
      deepArr.push({group:sat,label:tag(s.name,'#'+s.color.toString(16).padStart(6,'0'))});
    }

    // ── BELTS ────────────────────────────────────────────────────────
    const bI=logDist(2.1),bO=logDist(3.3),AN=8000;
    const aG=new THREE.DodecahedronGeometry(0.04,0),aM2=new THREE.MeshPhongMaterial({color:0x998877,flatShading:true});
    const asteroids=new THREE.InstancedMesh(aG,aM2,AN);const idm=new THREE.Object3D(),aArr=[];
    for(let i=0;i<AN;i++){const r=bI+Math.random()*(bO-bI),a=Math.random()*Math.PI*2,y=(Math.random()-0.5)*0.8,s2=0.5+Math.random()*2;aArr.push({r,a,y,sp:0.06+Math.random()*0.12});idm.position.set(Math.cos(a)*r,y,Math.sin(a)*r);idm.rotation.set(Math.random()*6,Math.random()*6,0);idm.scale.set(s2,s2*0.6,s2*0.8);idm.updateMatrix();asteroids.setMatrixAt(i,idm.matrix);}
    asteroids.instanceMatrix.needsUpdate=true;galacticPivot.add(asteroids);
    const bLabel=tag('ASTEROID BELT','#776655');
    const kI=logDist(30),kO=logDist(50),KN=4000,kP2=new Float32Array(KN*3);
    for(let i=0;i<KN;i++){const r=kI+Math.random()*(kO-kI),a=Math.random()*Math.PI*2;kP2[i*3]=Math.cos(a)*r;kP2[i*3+1]=(Math.random()-0.5)*2;kP2[i*3+2]=Math.sin(a)*r;}
    const kG2=new THREE.BufferGeometry();kG2.setAttribute('position',new THREE.BufferAttribute(kP2,3));
    galacticPivot.add(new THREE.Points(kG2,new THREE.PointsMaterial({color:0x667788,size:0.12,map:softStar,transparent:true,opacity:0.55,blending:THREE.AdditiveBlending,depthWrite:false})));
    const kLabel=tag('KUIPER BELT','#556677');

    // ══ PHOTOGRAPHIC SKYBOX — real Milky Way starfield panorama ═════
    loader.load(TEX+'galaxy_starfield.png',t=>{
      const sky=new THREE.Mesh(
        new THREE.SphereGeometry(4500,48,48),
        new THREE.MeshBasicMaterial({map:t,side:THREE.BackSide,depthWrite:false})
      );
      scene.add(sky);
    });

    // ══ DEEP STARFIELD — dense, multi-color, like real astrophoto ═══
    function starLayer(count,rMin,rMax,sizes){
      const pos=new Float32Array(count*3),col=new Float32Array(count*3);
      for(let i=0;i<count;i++){
        const r=rMin+Math.random()*(rMax-rMin),t=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1);
        pos[i*3]=r*Math.sin(ph)*Math.cos(t);pos[i*3+1]=r*Math.sin(ph)*Math.sin(t);pos[i*3+2]=r*Math.cos(ph);
        // realistic star colors: mostly white, some blue, some warm
        const k=Math.random();
        if(k<0.6){col[i*3]=0.9;col[i*3+1]=0.9;col[i*3+2]=0.95;}
        else if(k<0.8){col[i*3]=0.7;col[i*3+1]=0.8;col[i*3+2]=1.0;}
        else if(k<0.95){col[i*3]=1.0;col[i*3+1]=0.85;col[i*3+2]=0.6;}
        else{col[i*3]=1.0;col[i*3+1]=0.5;col[i*3+2]=0.4;}
      }
      const g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.BufferAttribute(pos,3));
      g.setAttribute('color',new THREE.BufferAttribute(col,3));
      return new THREE.Points(g,new THREE.PointsMaterial({size:sizes,map:softStar,vertexColors:true,transparent:true,opacity:0.85,sizeAttenuation:true,blending:THREE.AdditiveBlending,depthWrite:false}));
    }
    scene.add(starLayer(12000,400,1200,0.5));
    scene.add(starLayer(6000,300,900,1.1));
    scene.add(starLayer(800,250,800,2.2));

    // ══ MILKY WAY — rich photoreal version, Sun in Orion Arm ════════
    const GC_X=-280,GC_Z=-70;
    const mwGroup=new THREE.Group();scene.add(mwGroup);
    // Spiral disk — 50k stars, additive
    const mwCount=50000,mwPos=new Float32Array(mwCount*3),mwCol=new Float32Array(mwCount*3);
    for(let i=0;i<mwCount;i++){
      const r2=Math.pow(Math.random(),0.5)*620+40;
      const arm=i%4,phase=(arm/4)*Math.PI*2;
      const theta=(r2*0.008)+phase+(Math.random()-0.5)*0.5;
      mwPos[i*3]=GC_X+Math.cos(theta)*r2+(Math.random()-0.5)*30;
      mwPos[i*3+2]=GC_Z+Math.sin(theta)*r2+(Math.random()-0.5)*30;
      mwPos[i*3+1]=(Math.random()-0.5)*Math.max(4,28-r2*0.03);
      // Core = warm gold; arms = blue-white; sprinkle pink HII regions
      const coreT=Math.max(0,1-r2/200);
      const k=Math.random();
      if(k<0.04&&r2>150){mwCol[i*3]=1.0;mwCol[i*3+1]=0.5;mwCol[i*3+2]=0.65;}
      else{
        mwCol[i*3]=0.55+coreT*0.45+Math.random()*0.1;
        mwCol[i*3+1]=0.6+coreT*0.3+Math.random()*0.1;
        mwCol[i*3+2]=0.85-coreT*0.35+Math.random()*0.15;
      }
    }
    const mwG=new THREE.BufferGeometry();
    mwG.setAttribute('position',new THREE.BufferAttribute(mwPos,3));
    mwG.setAttribute('color',new THREE.BufferAttribute(mwCol,3));
    const mwMat=new THREE.PointsMaterial({size:1.6,map:softStar,vertexColors:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
    mwGroup.add(new THREE.Points(mwG,mwMat));
    // PAINTED photoreal galaxy plane — smooth nebulosity like real photos
    const galaxyTex=paintGalaxy(2048,4,0.0045);
    const galaxyPlaneMat=new THREE.MeshBasicMaterial({map:galaxyTex,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
    const galaxyPlane=new THREE.Mesh(new THREE.PlaneGeometry(1350,1350),galaxyPlaneMat);
    galaxyPlane.rotation.x=-Math.PI/2;
    galaxyPlane.position.set(GC_X,0,GC_Z);
    mwGroup.add(galaxyPlane);
    // Galactic core glow
    const coreGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:radialSprite([[0,'rgba(255,225,170,0.95)'],[0.3,'rgba(255,190,110,0.45)'],[0.65,'rgba(200,130,70,0.12)'],[1,'rgba(120,70,40,0)']],256),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));
    coreGlow.position.set(GC_X,0,GC_Z);coreGlow.scale.set(260,200,1);mwGroup.add(coreGlow);
    // Nebula patches along arms (pink/blue/orange)
    const nebTexs=[
      radialSprite([[0,'rgba(255,120,160,0.5)'],[0.6,'rgba(200,60,120,0.12)'],[1,'rgba(0,0,0,0)']],128),
      radialSprite([[0,'rgba(110,160,255,0.45)'],[0.6,'rgba(60,90,200,0.1)'],[1,'rgba(0,0,0,0)']],128),
      radialSprite([[0,'rgba(255,170,90,0.4)'],[0.6,'rgba(200,110,40,0.1)'],[1,'rgba(0,0,0,0)']],128),
    ];
    const nebs=[];
    for(let i=0;i<46;i++){
      const r2=120+Math.random()*420;
      const arm=i%4,phase=(arm/4)*Math.PI*2;
      const theta=(r2*0.008)+phase+(Math.random()-0.5)*0.35;
      const sp2=new THREE.Sprite(new THREE.SpriteMaterial({map:nebTexs[i%3],blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));
      sp2.position.set(GC_X+Math.cos(theta)*r2,(Math.random()-0.5)*8,GC_Z+Math.sin(theta)*r2);
      const sc=30+Math.random()*55;sp2.scale.set(sc,sc*0.7,1);
      mwGroup.add(sp2);nebs.push(sp2);
    }
    const sgrLabel=tag('SAGITTARIUS A* · GALACTIC CENTER','#ffbb77');
    const youLabel=tag('☉ YOU ARE HERE · ORION ARM','#88ddff');

    // ══ NEARBY STARS + ANDROMEDA (universe scale) ═══════════════════
    const starGlowTex=radialSprite([[0,'rgba(255,255,255,1)'],[0.3,'rgba(255,255,255,0.4)'],[1,'rgba(255,255,255,0)']],64);
    const nearArr=[];
    for(const st of NEARBY_STARS){
      const x=Math.cos(st.a)*st.d, z=Math.sin(st.a)*st.d, y=st.e*st.d*0.3;
      const sMat2=new THREE.SpriteMaterial({map:starGlowTex,color:st.color,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0});
      const sp3=new THREE.Sprite(sMat2);sp3.position.set(x,y,z);sp3.scale.set(st.size,st.size,1);scene.add(sp3);
      const hb2=new THREE.Mesh(new THREE.SphereGeometry(st.size*0.8,6,6),new THREE.MeshBasicMaterial({visible:false}));
      hb2.position.set(x,y,z);hb2.userData={type:'star',data:{name:st.name,info:st.info}};scene.add(hb2);allClick.push(hb2);
      nearArr.push({sprite:sp3,mat:sMat2,label:tag(st.name,'#ffeecc')});
    }
    // Andromeda — tilted ellipse cloud, far away
    const anCount=4000,anPos=new Float32Array(anCount*3),anCol=new Float32Array(anCount*3);
    for(let i=0;i<anCount;i++){
      const r3=Math.pow(Math.random(),0.6)*90;
      const th=Math.random()*Math.PI*2;
      anPos[i*3]=r3*Math.cos(th);anPos[i*3+1]=(Math.random()-0.5)*6;anPos[i*3+2]=r3*Math.sin(th)*0.42;
      const ct=Math.max(0,1-r3/40);
      anCol[i*3]=0.75+ct*0.25;anCol[i*3+1]=0.7+ct*0.2;anCol[i*3+2]=0.85;
    }
    const anG=new THREE.BufferGeometry();
    anG.setAttribute('position',new THREE.BufferAttribute(anPos,3));
    anG.setAttribute('color',new THREE.BufferAttribute(anCol,3));
    const anMat=new THREE.PointsMaterial({size:1.2,map:softStar,vertexColors:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
    const andromeda=new THREE.Points(anG,anMat);
    // Painted Andromeda disk
    const anPlaneMat=new THREE.MeshBasicMaterial({map:paintGalaxy(512,2,0.009),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
    const anPlane=new THREE.Mesh(new THREE.PlaneGeometry(200,200),anPlaneMat);
    andromeda.add(anPlane);
    andromeda.position.set(1700,500,-1500);
    andromeda.rotation.set(0.9,0.4,0.5);
    scene.add(andromeda);
    const anLabel=tag('ANDROMEDA GALAXY · M31 · 2.5 MILLION LY','#ccbbff');
    const anHit=new THREE.Mesh(new THREE.SphereGeometry(70,6,6),new THREE.MeshBasicMaterial({visible:false}));
    anHit.position.copy(andromeda.position);
    anHit.userData={type:'galaxy',data:{name:'Andromeda (M31)',info:{distance:'2.5 million light-years',type:'Barred spiral · 1 trillion stars',note:'Closest major galaxy. On collision course with the Milky Way — merger in ~4.5 billion years → "Milkomeda".'}}};
    scene.add(anHit);allClick.push(anHit);

    // ══ SAGITTARIUS A* — supermassive black hole at galactic center ══
    const bhGroup=new THREE.Group();bhGroup.position.set(GC_X,0,GC_Z);scene.add(bhGroup);
    bhGroup.add(new THREE.Mesh(new THREE.SphereGeometry(4.2,32,32),new THREE.MeshBasicMaterial({color:0x000000})));
    const bhDiskMat=new THREE.MeshBasicMaterial({map:paintAccretion(512),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
    const bhDisk=new THREE.Mesh(new THREE.PlaneGeometry(42,42),bhDiskMat);
    bhDisk.rotation.x=-Math.PI/2*0.72;bhGroup.add(bhDisk);
    const bhRingMat=new THREE.SpriteMaterial({map:radialSprite([[0,'rgba(0,0,0,0)'],[0.44,'rgba(0,0,0,0)'],[0.5,'rgba(255,225,185,0.95)'],[0.56,'rgba(255,150,60,0.25)'],[1,'rgba(0,0,0,0)']],128),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0});
    const bhRing=new THREE.Sprite(bhRingMat);bhRing.scale.set(13,13,1);bhGroup.add(bhRing);
    const bhHit=new THREE.Mesh(new THREE.SphereGeometry(15,6,6),new THREE.MeshBasicMaterial({visible:false}));
    bhHit.position.copy(bhGroup.position);
    bhHit.userData={type:'blackhole',data:{name:'Sagittarius A*',info:{mass:'4.15 million solar masses',distance:'26,000 light-years',event_horizon:'12 million km radius',note:'The supermassive black hole at our galaxy\'s heart. Imaged by the Event Horizon Telescope in 2022 — the glowing doppler-beamed ring matches their photo. Stars orbit it at up to 24,000 km/s.'}}};
    scene.add(bhHit);allClick.push(bhHit);
    const bhLabel=tag('SAGITTARIUS A* · BLACK HOLE','#ffaa66');

    // ══ LOCAL GROUP & BEYOND — painted galaxies, each clickable ══════
    const GALAXIES=[
      {name:'Triangulum (M33)',pos:[-2100,300,1400],s:140,arms:3,twist:0.007,tint:0x9db8ff,rot:[1.1,0.2,0.3],info:{distance:'2.73 million ly',type:'Spiral · 40 billion stars',note:'Third-largest Local Group galaxy. Possibly a satellite of Andromeda.'}},
      {name:'Large Magellanic Cloud',pos:[900,-350,1900],s:90,arms:1,twist:0.02,tint:0xffd9b0,rot:[1.3,0.5,0.1],info:{distance:'160,000 ly',type:'Irregular satellite of the Milky Way',note:'Home of the Tarantula Nebula — the most active star-forming region in the Local Group. Visible to the naked eye from the southern hemisphere.'}},
      {name:'Small Magellanic Cloud',pos:[700,-430,2150],s:55,arms:1,twist:0.025,tint:0xd9c9ff,rot:[1.2,0.3,0.4],info:{distance:'200,000 ly',type:'Dwarf irregular',note:'Connected to the LMC by a bridge of gas — both are being slowly eaten by the Milky Way.'}},
      {name:'Whirlpool (M51)',pos:[-1600,650,-2050],s:110,arms:2,twist:0.009,tint:0xbfd2ff,rot:[0.9,0.1,0.6],info:{distance:'23 million ly',type:'Grand-design spiral',note:'Interacting with companion NGC 5195 — the gravitational dance drives its perfect spiral arms.'}},
      {name:'Sombrero (M104)',pos:[2300,150,650],s:120,arms:2,twist:0.012,tint:0xffe2bb,rot:[1.45,0.05,0.2],info:{distance:'31 million ly',type:'Edge-on spiral',note:'A billion-solar-mass black hole at its core. The dark dust lane rim gives it the sombrero look.'}},
    ];
    const galArr=[];
    for(const gl of GALAXIES){
      const mat=new THREE.MeshBasicMaterial({map:paintGalaxy(512,gl.arms,gl.twist),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,color:gl.tint});
      const plane=new THREE.Mesh(new THREE.PlaneGeometry(gl.s,gl.s),mat);
      plane.position.set(...gl.pos);plane.rotation.set(...gl.rot);scene.add(plane);
      const hit=new THREE.Mesh(new THREE.SphereGeometry(gl.s*0.45,6,6),new THREE.MeshBasicMaterial({visible:false}));
      hit.position.set(...gl.pos);hit.userData={type:'galaxy',data:{name:gl.name,info:gl.info}};
      scene.add(hit);allClick.push(hit);
      galArr.push({mat,label:tag(gl.name,'#c9bbee'),pos:new THREE.Vector3(...gl.pos)});
    }
    // Hubble-deep-field — dozens of faint distant galaxies
    const dfTexs=[paintGalaxy(128,2,0.012),paintGalaxy(128,3,0.009),paintGalaxy(128,4,0.006)];
    const dfMats=[];
    for(let i=0;i<36;i++){
      const t=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1),r=2300+Math.random()*900;
      const m=new THREE.SpriteMaterial({map:dfTexs[i%3],transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,color:new THREE.Color().setHSL(0.55+Math.random()*0.15,0.3,0.75)});
      const sp4=new THREE.Sprite(m);
      sp4.position.set(r*Math.sin(ph)*Math.cos(t),r*Math.sin(ph)*Math.sin(t)*0.7,r*Math.cos(ph));
      const sc2=8+Math.random()*16;sp4.scale.set(sc2,sc2*(0.4+Math.random()*0.6),1);
      scene.add(sp4);dfMats.push(m);
    }

    // ══ REAL EXOPLANET SYSTEMS — fly to them (double-click the star) ══
    const exoArr=[];
    function exoSystem(starName,sx,sy,sz,starColor,starSize,planets,makeStar){
      let starLabelEl=null;
      if(makeStar){
        const sm=new THREE.SpriteMaterial({map:starGlowTex,color:starColor,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0});
        const sp5=new THREE.Sprite(sm);sp5.position.set(sx,sy,sz);sp5.scale.set(starSize,starSize,1);scene.add(sp5);
        const hb3=new THREE.Mesh(new THREE.SphereGeometry(starSize,6,6),new THREE.MeshBasicMaterial({visible:false}));
        hb3.position.set(sx,sy,sz);hb3.userData={type:'star',data:{name:starName,info:{distance:'40.7 light-years',type:'Ultra-cool red dwarf (M8)',note:'Hosts SEVEN Earth-sized planets — three in the habitable zone. The most studied exoplanet system. JWST is analysing their atmospheres right now.'}}};
        scene.add(hb3);allClick.push(hb3);
        nearArr.push({sprite:sp5,mat:sm,label:tag(starName,'#ffccaa')});
      }
      const sys=new THREE.Group();sys.position.set(sx,sy,sz);scene.add(sys);
      const pivots=[];
      for(const pl of planets){
        const pv=new THREE.Group();sys.add(pv);
        const pmat=new THREE.MeshBasicMaterial({color:pl.color,transparent:true,opacity:0});
        const pmesh=new THREE.Mesh(new THREE.SphereGeometry(pl.size,12,12),pmat);
        pmesh.position.x=pl.r;
        pmesh.userData={type:'exoplanet',data:{name:pl.name,parentName:starName,info:pl.info}};
        pv.add(pmesh);allClick.push(pmesh);
        pv.rotation.y=Math.random()*6.28;
        pivots.push({pv,sp:pl.sp,mat:pmat});
      }
      exoArr.push({pivots,label:starLabelEl});
    }
    // Proxima Centauri system (star already exists in NEARBY_STARS)
    {const d=900,a=0.5,e=0.1;exoSystem('Proxima Centauri',Math.cos(a)*d,e*d*0.3,Math.sin(a)*d,0xff8866,5,[
      {name:'Proxima b',r:2.4,sp:1.4,size:0.5,color:0xcc8866,info:'1.07 Earth masses · habitable zone · 11.2-day year. Closest known exoplanet to Earth.'},
      {name:'Proxima d',r:1.5,sp:2.2,size:0.3,color:0xbb9977,info:'0.26 Earth masses · 5.1-day year. One of the lightest exoplanets ever detected.'},
    ],false);}
    // TRAPPIST-1 — all 7 planets
    {const d=1300,a=5.3,e=-0.08;exoSystem('TRAPPIST-1',Math.cos(a)*d,e*d*0.3,Math.sin(a)*d,0xff7755,4,[
      {name:'TRAPPIST-1b',r:1.3,sp:3.0,size:0.36,color:0xcc7755,info:'1.02 R⊕ · 1.5-day year. Likely airless, 120°C.'},
      {name:'TRAPPIST-1c',r:1.8,sp:2.5,size:0.35,color:0xcc8866,info:'1.10 R⊕ · 2.4-day year. JWST found no thick atmosphere.'},
      {name:'TRAPPIST-1d',r:2.3,sp:2.1,size:0.28,color:0xbb9988,info:'0.78 R⊕ · 4-day year. Inner edge of habitable zone.'},
      {name:'TRAPPIST-1e',r:2.9,sp:1.7,size:0.33,color:0x88aacc,info:'0.92 R⊕ · HABITABLE ZONE. Best candidate for liquid water of the seven.'},
      {name:'TRAPPIST-1f',r:3.5,sp:1.4,size:0.37,color:0x7799bb,info:'1.04 R⊕ · HABITABLE ZONE. Possibly water-rich.'},
      {name:'TRAPPIST-1g',r:4.1,sp:1.1,size:0.40,color:0x6688aa,info:'1.13 R⊕ · HABITABLE ZONE. Largest of the seven.'},
      {name:'TRAPPIST-1h',r:4.7,sp:0.9,size:0.27,color:0x99aabb,info:'0.76 R⊕ · 19-day year. Frozen — likely ice world.'},
    ],true);}

    // ══ DISTANCE HUD ══
    const hud=document.createElement('div');
    hud.style.cssText='position:absolute;right:1.5rem;bottom:4.5rem;font-family:monospace;font-size:0.72rem;letter-spacing:0.15em;color:#ffd28a;text-shadow:0 0 8px rgba(0,0,0,0.9);pointer-events:none;z-index:10;text-align:right;';
    mount.appendChild(hud);labels.push(hud);

    // ── RAYCASTER ────────────────────────────────────────────────────
    const ray=new THREE.Raycaster(),ptr=new THREE.Vector2();
    renderer.domElement.addEventListener('pointermove',e=>{const rc=renderer.domElement.getBoundingClientRect();ptr.x=((e.clientX-rc.left)/rc.width)*2-1;ptr.y=-((e.clientY-rc.top)/rc.height)*2+1;ray.setFromCamera(ptr,camera);renderer.domElement.style.cursor=ray.intersectObjects(allClick,false).length?'pointer':'grab';});
    renderer.domElement.addEventListener('click',e=>{const rc=renderer.domElement.getBoundingClientRect();ptr.x=((e.clientX-rc.left)/rc.width)*2-1;ptr.y=-((e.clientY-rc.top)/rc.height)*2+1;ray.setFromCamera(ptr,camera);const h=ray.intersectObjects(allClick,false);if(h.length)onSelect?.(h[0].object.userData.data);});
    renderer.domElement.addEventListener('pointerdown',()=>{if(ctrlRef?.current)ctrlRef.current.focus=null;});
    // Double-click any object → camera target flies to it (Sun no longer locked center!)
    let retarget=null;
    renderer.domElement.addEventListener('dblclick',e=>{
      const rc=renderer.domElement.getBoundingClientRect();
      ptr.x=((e.clientX-rc.left)/rc.width)*2-1;ptr.y=-((e.clientY-rc.top)/rc.height)*2+1;
      ray.setFromCamera(ptr,camera);
      const h=ray.intersectObjects(allClick,false);
      if(h.length){const tp2=new THREE.Vector3();h[0].object.getWorldPosition(tp2);retarget=tp2;}
    });

    // ── ANIMATE ──────────────────────────────────────────────────────
    let raf;const wp=new THREE.Vector3();const clock=new THREE.Clock();
    const animate=()=>{
      raf=requestAnimationFrame(animate);
      const ctrl=ctrlRef?.current||{speed:1,labels:true,paths:true};
      const spd=ctrl.speed;
      sunUniforms.uTime.value=clock.getElapsedTime();
      galacticPivot.rotation.y+=0.00001*spd;
      sun.rotation.y+=0.0008*spd;
      for(const o of orbitsArr){
        o.pivot.rotation.y+=o.omega*spd;
        o.mesh.rotation.y+=0.005*spd;
        if(o.cloudM)o.cloudM.rotation.y+=0.002*spd;
        for(const md of(o.moonArr||[]))md.pivot.rotation.y+=0.01*md.speed*spd;
        for(const sd of(o.satArr||[])){sd.pivot.rotation.y+=0.03*sd.speed*spd;sd.mesh.rotation.y+=0.05*spd;}
      }
      for(let i=0;i<AN;i++){const d=aArr[i];d.a+=d.sp*0.0003*spd;idm.position.set(Math.cos(d.a)*d.r,d.y,Math.sin(d.a)*d.r);idm.updateMatrix();asteroids.setMatrixAt(i,idm.matrix);}
      asteroids.instanceMatrix.needsUpdate=true;

      // Focus camera on planet (quick-travel)
      if(ctrl.focus){
        const target=orbitsArr.find(o=>o.name===ctrl.focus);
        if(target){
          target.mesh.getWorldPosition(wp);
          controls.target.lerp(wp,0.08);
          const desired=wp.clone().add(new THREE.Vector3(0,2.5,6));
          camera.position.lerp(desired,0.06);
        }
      }

      const showLabels=ctrl.labels;
      for(const l of labels)l.style.display=showLabels?'':'none';
      const showPaths=ctrl.paths;
      for(const ol of orbitLines)ol.visible=showPaths;

      // Camera-distance fades: galaxy + nearby stars + Andromeda
      const camDist=camera.position.length();
      const mwOp=Math.min(0.85,Math.max(0,(camDist-100)/220));
      mwMat.opacity=mwOp*0.7;
      galaxyPlaneMat.opacity=mwOp;
      galaxyPlane.rotation.z+=0.00004*spd;
      anPlaneMat.opacity=anMat.opacity;
      coreGlow.material.opacity=mwOp*0.9;
      for(const nb of nebs)nb.material.opacity=mwOp*0.55;
      const nearOp=Math.min(1,Math.max(0,(camDist-350)/400));
      for(const na of nearArr)na.mat.opacity=nearOp;
      anMat.opacity=Math.min(0.9,Math.max(0,(camDist-700)/700));
      // Black hole — visible with galaxy
      bhDiskMat.opacity=mwOp;bhRingMat.opacity=mwOp*0.9;
      bhDisk.rotation.z+=0.0015*spd;
      // Galaxy shell + deep field
      const galOp=Math.min(0.95,Math.max(0,(camDist-800)/700));
      for(const ga of galArr)ga.mat.opacity=galOp;
      const dfOp=Math.min(0.7,Math.max(0,(camDist-1100)/900));
      for(const dfm of dfMats)dfm.opacity=dfOp;
      // Exoplanet systems — orbit + fade with nearby stars
      for(const ex of exoArr)for(const pp of ex.pivots){pp.pv.rotation.y+=pp.sp*0.004*spd;pp.mat.opacity=nearOp;}
      // Camera retarget lerp (double-click navigation)
      if(retarget){controls.target.lerp(retarget,0.08);if(controls.target.distanceTo(retarget)<0.5)retarget=null;}
      // HUD
      const auNow=Math.pow(Math.max(0.001,(camDist-3))/8,1/0.55);
      hud.textContent=camDist<750?`CAMERA · ${auNow<100?auNow.toFixed(1):Math.round(auNow)} AU FROM SUN`:camDist<1600?'INTERSTELLAR SPACE · LIGHT-YEARS SCALE':'INTERGALACTIC VIEW · MILLIONS OF LIGHT-YEARS';

      // Labels projection
      if(showLabels){
        const w=mount.clientWidth||innerWidth,h=mount.clientHeight||innerHeight;
        const proj=(pos,el,dy=14,minOp=0)=>{
          const v=pos.clone().project(camera);
          el.style.left=`${(v.x*0.5+0.5)*w}px`;el.style.top=`${(-v.y*0.5+0.5)*h-dy}px`;
          return v.z<1;
        };
        for(const o of orbitsArr){
          o.mesh.getWorldPosition(wp);
          o.label.style.opacity=proj(wp,o.label,18)?'1':'0';
          for(const md of(o.moonArr||[])){md.mesh.getWorldPosition(wp);md.label.style.opacity=proj(wp,md.label)?'0.7':'0';}
          for(const sd of(o.satArr||[])){sd.mesh.getWorldPosition(wp);sd.label.style.opacity=proj(wp,sd.label,12)?'0.6':'0';}
        }
        for(const ds of deepArr){ds.label.style.opacity=proj(ds.group.position,ds.label,12)?'0.7':'0';}
        bLabel.style.opacity=proj(new THREE.Vector3((bI+bO)/2,0.5,0),bLabel)?'0.5':'0';
        kLabel.style.opacity=proj(new THREE.Vector3((kI+kO)/2,0.5,0),kLabel)?'0.35':'0';
        // Galaxy labels only when galaxy visible
        sgrLabel.style.opacity=(mwOp>0.3&&proj(new THREE.Vector3(GC_X,0,GC_Z),sgrLabel))?'0.85':'0';
        youLabel.style.opacity=(mwOp>0.3&&proj(new THREE.Vector3(0,4,0),youLabel))?'0.9':'0';
        for(const na of nearArr){na.label.style.opacity=(nearOp>0.3&&proj(na.sprite.position,na.label))?'0.8':'0';}
        anLabel.style.opacity=(anMat.opacity>0.2&&proj(andromeda.position,anLabel,40))?'0.85':'0';
        bhLabel.style.opacity=(mwOp>0.4&&proj(bhGroup.position,bhLabel,28))?'0.85':'0';
        for(const ga of galArr)ga.label.style.opacity=(galOp>0.25&&proj(ga.pos,ga.label,20))?'0.8':'0';
      }
      controls.update();composer.render();
    };
    animate();
    return()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize);ro.disconnect();controls.dispose();renderer.dispose();if(mount.contains(renderer.domElement))mount.removeChild(renderer.domElement);labels.forEach(l=>{if(mount.contains(l))mount.removeChild(l);});};
  },[onSelect,ctrlRef]);
  return <div ref={mountRef} className="ss3d-mount"/>;
}
export{PLANETS,DWARFS,DEEP_SATS,NEARBY_STARS};
