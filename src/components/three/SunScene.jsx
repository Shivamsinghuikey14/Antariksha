import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SunScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
    camera.position.set(0, 0, 8);

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

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 96, 96),
      new THREE.MeshBasicMaterial({
        map: loader.load('https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/sunmap.jpg'),
      })
    );
    scene.add(sun);

    const mkGlow = (innerR, outerR, c1, c2, c3, size) => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 256;
      const g = cv.getContext('2d');
      const grd = g.createRadialGradient(128, 128, innerR, 128, 128, outerR);
      grd.addColorStop(0, c1);
      grd.addColorStop(0.4, c2);
      grd.addColorStop(1, c3);
      g.fillStyle = grd;
      g.fillRect(0, 0, 256, 256);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(cv),
        blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
      }));
      sprite.scale.set(size, size, 1);
      return sprite;
    };
    scene.add(mkGlow(40, 128, 'rgba(255, 200, 120, 0.55)', 'rgba(255, 140, 60, 0.35)', 'rgba(255, 100, 40, 0)', 9));
    scene.add(mkGlow(20, 128, 'rgba(255, 230, 180, 0.35)', 'rgba(255, 160, 80, 0.12)', 'rgba(255, 100, 40, 0)', 14));

    let raf;
    let mouseX = 0;
    const onMouse = e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    };
    addEventListener('mousemove', onMouse);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      sun.rotation.y += 0.0015;
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      ro.disconnect();
      removeEventListener('mousemove', onMouse);
      renderer.dispose();
      mount.contains(renderer.domElement) && mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="sun-canvas" style={{ width: '100%', height: 'min(75vh, 720px)' }} />;
}
