// Construye los mazos de bits por letra a partir de vocabulario.js
import { VOCABULARIO, VOCABULARIO_EXTRA, EMOJI_EXTRA } from './vocabulario.js';
import { baseLetter } from '../lib/slug.js';

export const META_POR_LETRA = 300;

const VOCALES = ['a', 'e', 'i', 'o', 'u'];
const ORDEN = ['a', 'e', 'i', 'o', 'u', 'm', 'p', 's', 'l', 't', 'n', 'd', 'c', 'r', 'f', 'b', 'v', 'g', 'j', 'h', 'ñ', 'q', 'k', 'y', 'z', 'x', 'w'];
const COLORES = ['#E8412C', '#1D2A6B', '#F2A20C', '#2E9E5B', '#2F8FD8', '#E0598B', '#7A4FD6', '#F26B1D'];

export function parse(str) {
  return str.split(/\s+/).filter(Boolean).map((tok) => {
    const i = tok.indexOf(':');
    const texto = (i >= 0 ? tok.slice(0, i) : tok).replace(/_/g, ' ').trim();
    const emoji = i >= 0 ? tok.slice(i + 1) : null;
    return { texto, emoji };
  }).filter((w) => w.texto);
}

// 1. Diccionario global de imágenes
export const EMOJI = { ...EMOJI_EXTRA };
const parsed = {};
for (const l of ORDEN) {
  parsed[l] = parse(`${VOCABULARIO[l] || ''} ${VOCABULARIO_EXTRA[l] || ''}`);
  for (const w of parsed[l]) if (w.emoji && !EMOJI[w.texto]) EMOJI[w.texto] = w.emoji;
}

// 2. Banco de todas las palabras (sin repetir)
const BANCO = [];
const visto = new Set();
for (const l of ORDEN) for (const w of parsed[l]) {
  if (!visto.has(w.texto)) { visto.add(w.texto); BANCO.push(w.texto); }
}

const contiene = (texto, l) => [...texto].some((ch) => baseLetter(ch) === l);

function mazo(l) {
  const usados = new Set();
  const propias = [];
  for (const w of parsed[l]) {
    if (usados.has(w.texto)) continue;
    usados.add(w.texto);
    propias.push({ texto: w.texto, emoji: w.emoji || EMOJI[w.texto] || null, letra: l });
  }
  // Primero las que tienen imagen (para empezar con bits ilustrados), luego lectura pura
  propias.sort((a, b) => (b.emoji ? 1 : 0) - (a.emoji ? 1 : 0));
  // Completar hasta 300 con palabras del vocabulario que contienen la letra
  const extra = [];
  for (const t of BANCO) {
    if (propias.length + extra.length >= META_POR_LETRA) break;
    if (usados.has(t) || !contiene(t, l)) continue;
    usados.add(t);
    extra.push({ texto: t, emoji: EMOJI[t] || null, letra: l });
  }
  extra.sort((a, b) => (b.emoji ? 1 : 0) - (a.emoji ? 1 : 0));
  return [...propias, ...extra].slice(0, Math.max(META_POR_LETRA, propias.length));
}

export const LETRAS = ORDEN.map((l, i) => ({
  letra: l,
  tipo: VOCALES.includes(l) ? 'vocal' : 'consonante',
  color: COLORES[i % COLORES.length],
  palabras: mazo(l),
}));

const unicas = new Map();
for (const l of LETRAS) for (const p of l.palabras) if (!unicas.has(p.texto)) unicas.set(p.texto, p);
export const TODAS_LAS_PALABRAS = [...unicas.values()];
export const PALABRAS_CON_IMAGEN = TODAS_LAS_PALABRAS.filter((p) => p.emoji);

const SILABAS_ESPECIALES = {
  c: ['ca', 'co', 'cu', 'ce', 'ci'],
  g: ['ga', 'go', 'gu', 'gue', 'gui'],
  q: ['que', 'qui'],
  h: ['ha', 'he', 'hi', 'ho', 'hu'],
};
export function silabasDe(letra) {
  if (VOCALES.includes(letra)) return [];
  if (SILABAS_ESPECIALES[letra]) return SILABAS_ESPECIALES[letra];
  if (['w', 'x', 'k'].includes(letra)) return [];
  return VOCALES.map((v) => letra + v);
}
