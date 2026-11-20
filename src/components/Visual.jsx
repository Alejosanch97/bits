import { useMemo } from 'react';
import { baseLetter } from '../lib/slug.js';

// Palabra con la letra protagonista resaltada (método Glenn Doman: letra grande y clara)
export function Word({ text, letra, upper = false, className = '' }) {
  const shown = upper ? text.toUpperCase() : text;
  const style = { '--len': Math.max(4, text.length) };
  let idx = -1;
  if (letra) {
    for (let i = 0; i < text.length; i++) {
      if (baseLetter(text[i]) === letra) { idx = i; break; }
    }
  }
  if (idx < 0) return <span className={`word ${className}`} style={style}>{shown}</span>;
  return (
    <span className={`word ${className}`} style={style}>
      {shown.slice(0, idx)}
      <span className="word-hl">{shown[idx]}</span>
      {shown.slice(idx + 1)}
    </span>
  );
}

// PRNG determinista para que cada número siempre tenga el mismo "dibujo" de puntos
function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tarjeta de puntos rojos de Glenn Doman
export function DotCard({ n, seed = 1, className = '' }) {
  const dots = useMemo(() => {
    const rnd = mulberry(n * 7919 + seed * 104729);
    const r = n <= 5 ? 0.075 : n <= 12 ? 0.06 : n <= 30 ? 0.045 : n <= 60 ? 0.034 : 0.027;
    const min = r * 2.25;
    const pts = [];
    let tries = 0;
    let minD = min;
    while (pts.length < n && tries < 20000) {
      tries += 1;
      if (tries % 3000 === 0) minD *= 0.9;
      const x = r + 0.04 + rnd() * (1 - 2 * r - 0.08);
      const y = r + 0.04 + rnd() * (1 - 2 * r - 0.08);
      if (pts.every((p) => (p.x - x) ** 2 + (p.y - y) ** 2 > minD * minD)) pts.push({ x, y });
    }
    return { pts, r };
  }, [n, seed]);
  return (
    <svg viewBox="0 0 1 1" className={`dotcard ${className}`}>
      <rect x="0" y="0" width="1" height="1" rx="0.04" fill="#fff" />
      {dots.pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={dots.r} fill="#E8412C" className="dot" style={{ animationDelay: `${Math.min(i * 12, 600)}ms` }} />
      ))}
    </svg>
  );
}

// Imagen del bit: foto subida, color, emoji o puntos
export default function Visual({ item, className = '' }) {
  if (item.img) return <img src={item.img} alt={item.texto} className={`visual visual-img ${className}`} draggable={false} />;
  if (item.swatch) {
    return (
      <span className={`visual visual-swatch ${className}`}>
        <svg viewBox="0 0 100 100"><path d="M50 6 C78 6 96 24 94 52 C92 80 74 96 48 94 C22 92 6 76 6 50 C6 24 24 6 50 6 Z" fill={item.swatch} stroke="#1D2A6B" strokeWidth="4" /></svg>
      </span>
    );
  }
  if (item.emoji) return <span className={`visual visual-emoji ${className}`}>{item.emoji}</span>;
  if (item.numero) return <span className={`visual visual-dots ${className}`}><DotCard n={item.numero} /></span>;
  return <span className={`visual ${className}`}>⭐</span>;
}
