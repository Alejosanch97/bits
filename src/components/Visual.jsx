import { useLayoutEffect, useMemo, useRef } from 'react';
import { baseLetter } from '../lib/slug.js';

// Ajusta el tamaño de letra para que la palabra SIEMPRE quepa en su tarjeta
function useFitText(ref, deps) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      el.style.fontSize = '';
      const parent = el.parentElement;
      if (!parent) return;
      const cs = getComputedStyle(parent);
      const avail = (parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) * 0.92;
      const w = el.scrollWidth;
      if (avail > 0 && w > avail) {
        const size = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = `${Math.floor(size * (avail / w))}px`;
      }
    };
    fit();
    // Volver a ajustar cuando carguen las fuentes o cambie el tamaño de la pantalla
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

// Palabra estilo bit: PRIMERA letra en MAYÚSCULA y roja, el resto en negro
// (el resto en minúscula o en mayúscula según el botón abc / ABC).
// Si la letra que se estudia está dentro de la palabra (p. ej. la ñ de piña), se subraya.
export function Word({ text, letra, upper = false, className = '' }) {
  const ref = useRef(null);
  useFitText(ref, [text, upper, className]);
  const first = text.charAt(0).toUpperCase();
  const rest = upper ? text.slice(1).toUpperCase() : text.slice(1);
  const wrap = text.includes(' ') && text.length > 16;
  const len = wrap ? Math.min(12, Math.ceil(text.length / 2)) : text.length;
  const style = { '--len': Math.max(4, Math.ceil(len * (upper ? 1.35 : 1.08))) };
  let idx = -1;
  if (letra) {
    for (let i = 0; i < text.length; i++) {
      if (baseLetter(text[i]) === letra) { idx = i; break; }
    }
  }
  const restNodes = idx > 0
    ? <>{rest.slice(0, idx - 1)}<span className="word-mark">{rest[idx - 1]}</span>{rest.slice(idx)}</>
    : rest;
  return (
    <span ref={ref} className={`word ${wrap ? 'wrap' : ''} ${className}`} style={style}>
      <span className="word-first">{first}</span>
      <span className="word-rest">{restNodes}</span>
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
