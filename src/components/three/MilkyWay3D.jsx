import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural Milky Way model.
 *
 * 40,000 stars sampled along a 4-arm logarithmic spiral, plus a bulge of
 * 8,000 stars at the centre. The Sun is marked with a gold sphere at
 * 26,000 light-years from the centre, in the Orion Spur.
 */
export default function MilkyWay3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width  = mount.clientWidth  || window.innerWidth;
    const height = mount.clientHeight || 600;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
    camera.position.set(0, 350, 700);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    // ---- Disk stars (4 spiral arms) -------------------------------------
    const diskCount = 40000;
    const positions = new Float32Array(diskCount * 3);
    const colors    = new Float32Array(diskCount * 3);
    const armCount  = 4;
    const armSpread = 0.6;

    for (let i = 0; i < diskCount; i++) {
      const r   = Math.pow(Math.random(), 0.5) * 500 + 30;
      const arm = i % armCount;
      const phase = (arm / armCount) * Math.PI * 2;
      const theta = (r * 0.012) + phase + (Math.random() - 0.5) * armSpread;
      const x  = Math.cos(theta) * r + (Math.random() - 0.5) * 25;
      const z  = Math.sin(theta) * r + (Math.random() - 0.5) * 25;
      const y  = (Math.random() - 0.5) * Math.max(8, 35 - r * 0.05);
      positions[i*3]     = x;
      positions[i*3 + 1] = y;
      positions[i*3 + 2] = z;
      // Bluer in arms, whiter elsewhere
      const t = Math.random();
      colors[i*3]     = 0.65 + t * 0.35;
      colors[i*3 + 1] = 0.7  + t * 0.3;
      colors[i*3 + 2] = 0.9  + t * 0.1;
    }

    const diskGeom = new THREE.BufferGeometry();
    diskGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    diskGeom.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
    const diskMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const disk = new THREE.Points(diskGeom, diskMat);
    scene.add(disk);

    // ---- Central bulge -------------------------------------------------
    const bulgeCount = 8000;
    const bulgePos = new Float32Array(bulgeCount * 3);
    const bulgeCol = new Float32Array(bulgeCount * 3);
    for (let i = 0; i < bulgeCount; i++) {
      const r = Math.pow(Math.random(), 1.5) * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      bulgePos[i*3]     = r * Math.sin(phi) * Math.cos(theta);
      bulgePos[i*3 + 1] = r * Math.cos(phi) * 0.55;
      bulgePos[i*3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      // Yellow / orange bulge
      bulgeCol[i*3]     = 1.0;
      bulgeCol[i*3 + 1] = 0.85;
      bulgeCol[i*3 + 2] = 0.55;
    }
    const bulgeGeom = new THREE.BufferGeometry();
    bulgeGeom.setAttribute('position', new THREE.BufferAttribute(bulgePos, 3));
    bulgeGeom.setAttribute('color',    new THREE.BufferAttribute(bulgeCol, 3));
    const bulgeMat = new THREE.PointsMaterial({ size: 2.2, vertexColors: true, transparent: true, opacity: 0.9 });
    const bulge = new THREE.Points(bulgeGeom, bulgeMat);
    scene.add(bulge);

    // ---- Sgr A* (black hole at centre, marked) -------------------------
    const sgr = new THREE.Mesh(
      new THREE.SphereGeometry(4, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
    );
    scene.add(sgr);

    // ---- Sun marker, at 26,000 light-years from centre -----------------
    // Scale: 500 units = 50,000 ly, so 26,000 ly = ~260 units
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(3.5, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffd28a }),
    );
    sun.position.set(260, 2, 60);
    scene.add(sun);

    // Glowing halo around sun
    const sunHalo = new THREE.Mesh(
      new THREE.SphereGeometry(10, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffd28a, transparent: true, opacity: 0.18 }),
    );
    sunHalo.position.copy(sun.position);
    scene.add(sunHalo);

    // Sun label
    const sunLabel = document.createElement('div');
    sunLabel.className = 'mw3d-label';
    sunLabel.textContent = '☉ You are here';
    mount.appendChild(sunLabel);

    // ---- Drag rotation + scroll zoom -----------------------------------
    let theta = 0, phi = 0.45, radius = 700;
    let isDragging = false, lastX = 0, lastY = 0;

    function updateCamera() {
      camera.position.x = Math.cos(theta) * Math.cos(phi) * radius;
      camera.position.y = Math.sin(phi) * radius;
      camera.position.z = Math.sin(theta) * Math.cos(phi) * radius;
      camera.lookAt(0, 0, 0);
    }
    updateCamera();

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', e => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
    addEventListener('mouseup',   () => { isDragging = false; });
    addEventListener('mousemove', e => {
      if (!isDragging) return;
      theta -= (e.clientX - lastX) * 0.005;
      phi    = Math.max(-1.3, Math.min(1.3, phi + (e.clientY - lastY) * 0.005));
      lastX = e.clientX; lastY = e.clientY;
      updateCamera();
    });
    dom.addEventListener('wheel', e => {
      e.preventDefault();
      radius = Math.max(150, Math.min(2000, radius + e.deltaY * 0.8));
      updateCamera();
    }, { passive: false });

    // ---- Render loop ---------------------------------------------------
    let frameId;
    let baseTheta = 0;
    function animate() {
      if (!isDragging) {
        baseTheta += 0.0008;
        theta = baseTheta;
        updateCamera();
      }
      // Project Sun position to screen for label
      const v = sun.position.clone().project(camera);
      const x = (v.x * 0.5 + 0.5) * width;
      const y = (-v.y * 0.5 + 0.5) * height;
      sunLabel.style.left = `${x}px`;
      sunLabel.style.top  = `${y}px`;
      sunLabel.style.opacity = (v.z < 1) ? '1' : '0';

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    // Resize
    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      if (mount.contains(sunLabel))            mount.removeChild(sunLabel);
    };
  }, []);

  return <div ref={mountRef} className="mw3d-mount" />;
}
