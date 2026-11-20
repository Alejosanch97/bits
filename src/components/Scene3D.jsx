import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { sfx } from '../lib/sfx.js';
import { speak } from '../lib/speech.js';

// Mundo 3D de juguete: cubos de letras/números que flotan, pelotas, estrellas y donas.
// Al tocar un cubo, rebota y dice su letra.
const PALETTE = ['#E8412C', '#1D2A6B', '#FFC531', '#2E9E5B', '#5EC8F2', '#FF8FB1', '#F26B1D', '#7A4FD6'];

function blockTexture(label, bg) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = bg;
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = 'rgba(255,255,255,0.85)';
  g.lineWidth = 14;
  g.strokeRect(22, 22, 212, 212);
  g.fillStyle = '#fff';
  g.font = `bold ${label.length > 1 ? 130 : 170}px "Lilita One", "Arial Rounded MT Bold", sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.shadowColor = 'rgba(0,0,0,0.25)';
  g.shadowOffsetY = 8;
  g.fillText(label, 128, 140);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function starShape(outer = 0.6, inner = 0.28) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? outer : inner;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

export default function Scene3D({ labels = ['A', 'B', 'C', '1', '2', '3', 'm', 'p', 'E', 'O'], lang = 'es', density = 1, className = '' }) {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    scene.add(new THREE.HemisphereLight('#fff7e6', '#7aa8ff', 1.5));
    const sun = new THREE.DirectionalLight('#ffffff', 2.2);
    sun.position.set(5, 8, 7);
    scene.add(sun);
    const rim = new THREE.DirectionalLight('#ffb3c7', 1.1);
    rim.position.set(-6, -3, 4);
    scene.add(rim);

    const objects = [];
    const blocks = [];
    const textures = [];
    const geos = [];
    const mats = [];

    const boxGeo = new RoundedBoxGeometry(1.5, 1.5, 1.5, 5, 0.22);
    const ballGeo = new THREE.SphereGeometry(0.6, 40, 40);
    const torusGeo = new THREE.TorusGeometry(0.55, 0.24, 24, 60);
    const starGeo = new THREE.ExtrudeGeometry(starShape(), { depth: 0.25, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.08, bevelSegments: 4 });
    starGeo.center();
    geos.push(boxGeo, ballGeo, torusGeo, starGeo);

    const spread = () => {
      const w = Math.max(9, (camera.aspect || 1.6) * 7.5);
      return { x: (Math.random() - 0.5) * w * 1.6, y: (Math.random() - 0.5) * 11, z: -Math.random() * 6 + 1 };
    };

    labels.forEach((label, i) => {
      const color = PALETTE[i % PALETTE.length];
      const tex = blockTexture(label, color);
      textures.push(tex);
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.38, metalness: 0.05 });
      mats.push(mat);
      const m = new THREE.Mesh(boxGeo, mat);
      const p = spread();
      m.position.set(p.x, p.y, p.z);
      m.rotation.set(Math.random() * 0.8, Math.random() * Math.PI, Math.random() * 0.4);
      m.userData = { label, base: m.position.clone(), speed: 0.4 + Math.random() * 0.6, phase: Math.random() * 10, spin: (Math.random() - 0.5) * 0.6, bounce: 0 };
      scene.add(m);
      objects.push(m);
      blocks.push(m);
    });

    const extras = Math.round(14 * density);
    for (let i = 0; i < extras; i++) {
      const kind = i % 3;
      const color = PALETTE[(i * 3 + 1) % PALETTE.length];
      const mat = kind === 0
        ? new THREE.MeshPhysicalMaterial({ color, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.1 })
        : new THREE.MeshStandardMaterial({ color, roughness: 0.35 });
      mats.push(mat);
      const geo = kind === 0 ? ballGeo : kind === 1 ? starGeo : torusGeo;
      const m = new THREE.Mesh(geo, mat);
      const p = spread();
      m.position.set(p.x, p.y, p.z - 1);
      const s = 0.6 + Math.random() * 0.8;
      m.scale.setScalar(s);
      m.userData = { base: m.position.clone(), speed: 0.3 + Math.random() * 0.7, phase: Math.random() * 10, spin: (Math.random() - 0.5) * 1.2, bounce: 0 };
      scene.add(m);
      objects.push(m);
    }

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const mouse = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const ray = new THREE.Raycaster();
    let hovered = null;

    const toNdc = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      return new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    const onMove = (e) => {
      target.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      ray.setFromCamera(toNdc(e), camera);
      const hit = ray.intersectObjects(blocks)[0];
      const obj = hit ? hit.object : null;
      if (obj !== hovered) {
        hovered = obj;
        el.style.cursor = obj ? 'pointer' : '';
      }
    };
    const onDown = (e) => {
      ray.setFromCamera(toNdc(e), camera);
      const hit = ray.intersectObjects(blocks)[0];
      if (hit) {
        hit.object.userData.bounce = 1;
        hit.object.userData.spin += 4;
        sfx.pop();
        speak(hit.object.userData.label.toLowerCase(), lang);
      }
    };
    window.addEventListener('pointermove', onMove);
    el.addEventListener('pointerdown', onDown);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      mouse.lerp(target, 0.04);
      camera.position.x = mouse.x * 1.6;
      camera.position.y = mouse.y * 1.0;
      camera.lookAt(0, 0, 0);
      for (const o of objects) {
        const u = o.userData;
        const mot = reduce ? 0.2 : 1;
        o.position.y = u.base.y + Math.sin(t * u.speed + u.phase) * 0.45 * mot;
        o.position.x = u.base.x + Math.cos(t * u.speed * 0.7 + u.phase) * 0.25 * mot;
        o.rotation.y += (0.2 + u.spin) * dt * mot;
        o.rotation.x += 0.1 * dt * mot;
        if (u.spin > 0.6) u.spin *= 0.97;
        if (u.bounce > 0) {
          u.bounce = Math.max(0, u.bounce - dt * 1.6);
          o.scale.setScalar(1 + Math.sin(u.bounce * Math.PI * 3) * 0.35 * u.bounce);
        } else if (o === hovered) {
          o.scale.lerp(new THREE.Vector3(1.18, 1.18, 1.18), 0.15);
        } else if (blocks.includes(o)) {
          o.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
        }
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerdown', onDown);
      textures.forEach((t) => t.dispose());
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [labels.join('|'), lang, density]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={mount} className={`scene3d ${className}`} />;
}
