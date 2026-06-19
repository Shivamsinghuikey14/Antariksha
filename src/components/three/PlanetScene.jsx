import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const TEX_BASE = 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/';

export default function PlanetScene({ tex, ringTex, cloudsTex }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
    camera.position.set(0, 0, ringTex ? 12 : 7.5);

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
    controls.minDistance = 3.5;
    controls.maxDistance = 30;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enablePan = false;

    scene.add(new THREE.AmbientLight(0x555566, 0.45));
    const key = new THREE.DirectionalLight(0xfff6e0, 1.4);
    key.position.set(5, 2, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x88aaff, 0.35);
    rim.position.set(-5, -1, -3);
    scene.add(rim);

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 128, 128),
      new THREE.MeshPhongMaterial({ map: loader.load(TEX_BASE + tex), shininess: 5 })
    );
    scene.add(sphere);

    let cloudsMesh = null;
    if (cloudsTex) {
      cloudsMesh = new THREE.Mesh(
        new THREE.SphereGeometry(2.44, 128, 128),
        new THREE.MeshPhongMaterial({
          map: loader.load(TEX_BASE + cloudsTex),
          transparent: true, opacity: 0.55, depthWrite: false,
        })
      );
      scene.add(cloudsMesh);
    }

    if (ringTex) {
      const rings = new THREE.Mesh(
        new THREE.RingGeometry(3.2, 5.1, 128),
        new THREE.MeshBasicMaterial({
          map: loader.load(TEX_BASE + ringTex),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.95,
        })
      );
      rings.rotation.x = -Math.PI / 2.1;
      scene.add(rings);
    }

    // backdrop stars
    const sg = new THREE.BufferGeometry();
    const sn = 1500;
    const pos = new Float32Array(sn * 3);
    for (let i = 0; i < sn; i++) {
      const r = 40 + Math.random() * 30;
      const t = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i*3]   = r * Math.sin(ph) * Math.cos(t);
      pos[i*3+1] = r * Math.sin(ph) * Math.sin(t);
      pos[i*3+2] = r * Math.cos(ph);
    }
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({
      color: 0xf2efe6, size: 0.07, transparent: true, opacity: 0.85,
    })));

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      sphere.rotation.y += 0.0008;
      if (cloudsMesh) cloudsMesh.rotation.y += 0.0011;
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
  }, [tex, ringTex, cloudsTex]);

  return <div className="planet-hero-canvas" ref={mountRef} style={{ width: '100%', height: 'min(80vh, 720px)' }} />;
}
