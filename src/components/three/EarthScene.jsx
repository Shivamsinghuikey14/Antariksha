import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const TEX_BASE = 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/';

export default function EarthScene({ lat, lon }) {
  const mountRef = useRef(null);
  const issGroupRef = useRef(null);

  // Position the ISS marker every time lat/lon updates
  useEffect(() => {
    if (!issGroupRef.current || lat == null || lon == null) return;
    // Convert lat/lon to 3D position on a sphere of radius 2.6 (slightly above Earth radius 2.5)
    const phi   = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    const R = 2.62;
    issGroupRef.current.position.set(
      -R * Math.sin(phi) * Math.cos(theta),
       R * Math.cos(phi),
       R * Math.sin(phi) * Math.sin(theta),
    );
  }, [lat, lon]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

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
    controls.minDistance = 4;
    controls.maxDistance = 18;
    controls.enablePan = false;

    scene.add(new THREE.AmbientLight(0x335577, 0.55));
    const sun = new THREE.DirectionalLight(0xfff6e0, 1.7);
    sun.position.set(5, 2, 4);
    scene.add(sun);

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 128, 128),
      new THREE.MeshPhongMaterial({ map: loader.load(TEX_BASE + 'earthmap1k.jpg'), shininess: 12 })
    );
    scene.add(earth);

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(2.54, 128, 128),
      new THREE.MeshPhongMaterial({
        map: loader.load(TEX_BASE + 'earthcloudmap.jpg'),
        transparent: true, opacity: 0.55, depthWrite: false,
      })
    );
    scene.add(clouds);

    // Subtle blue atmosphere
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.62, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x4488ff, transparent: true, opacity: 0.07, side: THREE.BackSide,
      })
    );
    scene.add(atmosphere);

    // ISS marker group (parented to scene so it follows lat/lon updates)
    const issGroup = new THREE.Group();
    scene.add(issGroup);
    issGroupRef.current = issGroup;

    // Pulsing dot
    const issDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffd28a })
    );
    issGroup.add(issDot);

    const issGlowCanvas = document.createElement('canvas');
    issGlowCanvas.width = issGlowCanvas.height = 128;
    const g = issGlowCanvas.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 6, 64, 64, 64);
    grd.addColorStop(0,    'rgba(255, 220, 140, 0.9)');
    grd.addColorStop(0.4,  'rgba(255, 180, 90, 0.4)');
    grd.addColorStop(1,    'rgba(255, 100, 40, 0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const issGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(issGlowCanvas),
      blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    }));
    issGlow.scale.set(0.55, 0.55, 1);
    issGroup.add(issGlow);

    // Background stars
    const sg = new THREE.BufferGeometry();
    const sCount = 1800;
    const pos = new Float32Array(sCount * 3);
    for (let i = 0; i < sCount; i++) {
      const r = 35 + Math.random() * 30;
      const t = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i*3]   = r * Math.sin(ph) * Math.cos(t);
      pos[i*3+1] = r * Math.sin(ph) * Math.sin(t);
      pos[i*3+2] = r * Math.cos(ph);
    }
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({
      color: 0xefe9d8, size: 0.08, transparent: true, opacity: 0.7,
    })));

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      earth.rotation.y  += 0.0005;
      clouds.rotation.y += 0.0007;
      // pulse the ISS glow
      const s = 0.5 + Math.sin(performance.now() * 0.004) * 0.15;
      issGlow.scale.set(s, s, 1);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      mount.contains(renderer.domElement) && mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="earth-canvas" ref={mountRef} style={{ width: '100%', height: 'min(75vh, 700px)' }} />;
}
