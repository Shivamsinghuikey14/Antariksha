import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TEX_BASE = 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/';

const PLANETS = [
  { tex: 'mercurymap.jpg', size: 0.45, dist: 4,    speed: 0.022 },
  { tex: 'venusmap.jpg',   size: 0.8,  dist: 6,    speed: 0.017 },
  { tex: 'earthmap1k.jpg', size: 0.85, dist: 8.5,  speed: 0.013, clouds: 'earthcloudmap.jpg' },
  { tex: 'marsmap1k.jpg',  size: 0.65, dist: 11,   speed: 0.011 },
  { tex: 'jupitermap.jpg', size: 1.6,  dist: 15,   speed: 0.0065 },
  { tex: 'saturnmap.jpg',  size: 1.35, dist: 19,   speed: 0.005, ring: 'saturnringcolor.jpg' },
  { tex: 'uranusmap.jpg',  size: 0.95, dist: 23,   speed: 0.0036 },
  { tex: 'neptunemap.jpg', size: 0.92, dist: 26.5, speed: 0.003 },
];

export default function SolarSystemHero() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    camera.position.set(0, 12, 28);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width   = '100%';
    renderer.domElement.style.height  = '100%';
    mount.appendChild(renderer.domElement);

    const resize = () => {
      // Fallback to viewport dimensions if mount hasn't computed its size yet.
      // This is the bug that made the hero appear empty: on first paint
      // mount.clientHeight can be 0 while the grid is still resolving.
      const w = mount.clientWidth  || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    addEventListener('resize', resize);

    // Also observe the mount itself — if its size changes (e.g. fonts loading,
    // layout reflow), we resize the canvas without waiting for a window resize.
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    scene.add(new THREE.AmbientLight(0x222233, 0.4));
    const sunLight = new THREE.PointLight(0xfff2cc, 2.4, 200, 1.2);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    // Sun
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 48, 48),
      new THREE.MeshBasicMaterial({ map: loader.load(TEX_BASE + 'sunmap.jpg') })
    );
    scene.add(sun);

    // Sun glow sprite
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

    const orbits = [];
    for (const p of PLANETS) {
      // Faint orbit ring
      const ringGeom = new THREE.RingGeometry(p.dist - 0.015, p.dist + 0.015, 96);
      ringGeom.rotateX(-Math.PI / 2);
      scene.add(new THREE.Mesh(
        ringGeom,
        new THREE.MeshBasicMaterial({ color: 0x3a4a5f, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
      ));

      const pivot = new THREE.Group();
      pivot.rotation.y = Math.random() * Math.PI * 2;
      scene.add(pivot);

      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(p.size, 32, 32),
        new THREE.MeshPhongMaterial({ map: loader.load(TEX_BASE + p.tex), shininess: 4 })
      );
      planet.position.x = p.dist;
      pivot.add(planet);

      if (p.clouds) {
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(p.size * 1.02, 32, 32),
          new THREE.MeshPhongMaterial({
            map: loader.load(TEX_BASE + p.clouds),
            transparent: true, opacity: 0.5, depthWrite: false,
          })
        );
        planet.add(clouds);
      }
      if (p.ring) {
        const rings = new THREE.Mesh(
          new THREE.RingGeometry(p.size * 1.4, p.size * 2.3, 64),
          new THREE.MeshBasicMaterial({
            map: loader.load(TEX_BASE + p.ring),
            side: THREE.DoubleSide, transparent: true, opacity: 0.85,
          })
        );
        rings.rotation.x = -Math.PI / 2.2;
        planet.add(rings);
      }

      orbits.push({ pivot, planet, speed: p.speed });
    }

    // Background stars
    const sg = new THREE.BufferGeometry();
    const sCount = 2400;
    const pos = new Float32Array(sCount * 3);
    for (let i = 0; i < sCount; i++) {
      const r = 90 + Math.random() * 80;
      const t = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i*3]   = r * Math.sin(ph) * Math.cos(t);
      pos[i*3+1] = r * Math.sin(ph) * Math.sin(t);
      pos[i*3+2] = r * Math.cos(ph);
    }
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({
      color: 0xefe9d8, size: 0.18, transparent: true, opacity: 0.6,
    })));

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      sun.rotation.y += 0.001;
      for (const o of orbits) {
        o.pivot.rotation.y += o.speed;
        o.planet.rotation.y += 0.004;
      }
      // slow camera orbit
      const t = performance.now() * 0.00007;
      camera.position.x = Math.sin(t) * 28;
      camera.position.z = Math.cos(t) * 28;
      camera.position.y = 11 + Math.sin(t * 1.4) * 1.4;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      ro.disconnect();
      renderer.dispose();
      mount.contains(renderer.domElement) && mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div id="solar-canvas" ref={mountRef} />;
}
