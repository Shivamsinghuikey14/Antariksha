import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const TEX_BASE = 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/';

const PLANETS = [
  { id: 'mercury', radius: 0.32, dist: 4.5,  period: 87.97,    tex: 'mercurymap.jpg' },
  { id: 'venus',   radius: 0.62, dist: 6.5,  period: 224.7,    tex: 'venusmap.jpg' },
  { id: 'earth',   radius: 0.65, dist: 8.8,  period: 365.25,   tex: 'earthmap1k.jpg', clouds: 'earthcloudmap.jpg' },
  { id: 'mars',    radius: 0.45, dist: 11.5, period: 687,      tex: 'marsmap1k.jpg' },
  { id: 'jupiter', radius: 1.65, dist: 16,   period: 4332,     tex: 'jupitermap.jpg' },
  { id: 'saturn',  radius: 1.4,  dist: 21,   period: 10759,    tex: 'saturnmap.jpg',  ring: 'saturnringcolor.jpg' },
  { id: 'uranus',  radius: 0.95, dist: 26,   period: 30688,    tex: 'uranusmap.jpg' },
  { id: 'neptune', radius: 0.92, dist: 30.5, period: 60182,    tex: 'neptunemap.jpg' },
];

export default function Orrery() {
  const mountRef = useRef(null);
  const navigate = useNavigate();
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [clockText, setClockText] = useState('');
  const stateRef = useRef({ speed: 1, paused: false });

  // Keep stateRef in sync so the animation loop can read it
  useEffect(() => { stateRef.current.speed  = speed; }, [speed]);
  useEffect(() => { stateRef.current.paused = paused; }, [paused]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.008);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);
    camera.position.set(0, 22, 38);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width  = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    const resize = () => {
      const w = mount.clientWidth  || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    setTimeout(resize, 50);
    addEventListener('resize', resize);
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 8;
    controls.maxDistance = 120;

    scene.add(new THREE.AmbientLight(0x222233, 0.4));
    const sunLight = new THREE.PointLight(0xfff2cc, 3, 200, 1.2);
    scene.add(sunLight);

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    // Sun + glow
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 64, 64),
      new THREE.MeshBasicMaterial({ map: loader.load(TEX_BASE + 'sunmap.jpg') })
    );
    scene.add(sun);
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 256;
    const g = glowCanvas.getContext('2d');
    const grd = g.createRadialGradient(128, 128, 30, 128, 128, 128);
    grd.addColorStop(0, 'rgba(255, 210, 130, 0.6)');
    grd.addColorStop(0.5, 'rgba(255, 150, 60, 0.2)');
    grd.addColorStop(1, 'rgba(255, 100, 40, 0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(glowCanvas),
      blending: THREE.AdditiveBlending,
      transparent: true, depthWrite: false,
    }));
    glow.scale.set(8, 8, 1);
    scene.add(glow);

    // Planets
    const orbits = [];
    for (const p of PLANETS) {
      const ringGeom = new THREE.RingGeometry(p.dist - 0.01, p.dist + 0.01, 128);
      ringGeom.rotateX(-Math.PI / 2);
      scene.add(new THREE.Mesh(
        ringGeom,
        new THREE.MeshBasicMaterial({ color: 0x4a5a6f, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
      ));

      const pivot = new THREE.Group();
      scene.add(pivot);
      const planetMesh = new THREE.Mesh(
        new THREE.SphereGeometry(p.radius, 48, 48),
        new THREE.MeshPhongMaterial({ map: loader.load(TEX_BASE + p.tex), shininess: 5 })
      );
      planetMesh.position.x = p.dist;
      planetMesh.userData.id = p.id;
      pivot.add(planetMesh);

      let cloudsMesh = null;
      if (p.clouds) {
        cloudsMesh = new THREE.Mesh(
          new THREE.SphereGeometry(p.radius * 1.015, 48, 48),
          new THREE.MeshPhongMaterial({
            map: loader.load(TEX_BASE + p.clouds),
            transparent: true, opacity: 0.5, depthWrite: false,
          })
        );
        planetMesh.add(cloudsMesh);
      }
      if (p.ring) {
        const rings = new THREE.Mesh(
          new THREE.RingGeometry(p.radius * 1.4, p.radius * 2.3, 96),
          new THREE.MeshBasicMaterial({
            map: loader.load(TEX_BASE + p.ring),
            side: THREE.DoubleSide, transparent: true, opacity: 0.9,
          })
        );
        rings.rotation.x = -Math.PI / 2.2;
        planetMesh.add(rings);
      }

      const baseEarthSeconds = 16;
      const earthRads = (Math.PI * 2) / (baseEarthSeconds * 60);
      const omega = earthRads * (365.25 / p.period);
      pivot.rotation.y = Math.random() * Math.PI * 2;
      orbits.push({ pivot, planetMesh, cloudsMesh, omega });
    }

    // Background starfield
    const sg = new THREE.BufferGeometry();
    const sCount = 4000;
    const pos = new Float32Array(sCount * 3);
    for (let i = 0; i < sCount; i++) {
      const r = 120 + Math.random() * 100;
      const t = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i*3]   = r * Math.sin(ph) * Math.cos(t);
      pos[i*3+1] = r * Math.sin(ph) * Math.sin(t);
      pos[i*3+2] = r * Math.cos(ph);
    }
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({
      color: 0xefe9d8, size: 0.18, transparent: true, opacity: 0.65,
    })));

    // Raycast for planet clicks
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const planetMeshes = orbits.map(o => o.planetMesh);

    const onPointerMove = e => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planetMeshes, false);
      renderer.domElement.style.cursor = hits.length ? 'pointer' : 'grab';
    };
    const onClick = e => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planetMeshes, false);
      if (hits.length) navigate(`/planets/${hits[0].object.userData.id}`);
    };
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    let raf;
    let simDays = 0;
    const startDate = new Date();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      sun.rotation.y += 0.0008;
      const st = stateRef.current;
      if (!st.paused) {
        for (const o of orbits) {
          o.pivot.rotation.y += o.omega * st.speed;
          o.planetMesh.rotation.y += 0.005 * st.speed;
          if (o.cloudsMesh) o.cloudsMesh.rotation.y += 0.0015 * st.speed;
        }
        simDays += (365.25 / (16 * 60)) * st.speed;
        const d = new Date(startDate.getTime() + simDays * 86400000);
        setClockText(d.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) + ` · ${st.speed}×`);
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      controls.dispose();
      renderer.dispose();
      mount.contains(renderer.domElement) && mount.removeChild(renderer.domElement);
    };
  }, [navigate]);

  return (
    <>
      <div className="orrery-canvas" ref={mountRef} />
      <div className="orrery-controls-floating">
        <button className="orrery-btn" onClick={() => setSpeed(s => Math.max(0.1, s / 2))}>◂ slower</button>
        <button className="orrery-btn" onClick={() => setPaused(p => !p)}>{paused ? '▶ play' : '⏸ pause'}</button>
        <button className="orrery-btn" onClick={() => setSpeed(s => Math.min(64, s * 2))}>faster ▸</button>
        <button className="orrery-btn" onClick={() => setSpeed(1)}>real-time</button>
        <div className="orrery-clock">⏱ {clockText || 'simulating'}</div>
      </div>
    </>
  );
}
