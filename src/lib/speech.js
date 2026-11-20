// Voz: usa audios de ElevenLabs si existen en /public/audio (manifest.json);
// si no, usa la voz del navegador (Web Speech API).
import { slug } from './slug.js';

const BASE = import.meta.env.BASE_URL;
let manifest = null;
let current = null;
const config = { enabled: true, rate: 0.85 };

fetch(`${BASE}audio/manifest.json`)
  .then((r) => (r.ok ? r.json() : null))
  .then((m) => { manifest = m; })
  .catch(() => {});

export function setSpeechConfig(c) {
  Object.assign(config, c);
}

const PREFERRED = {
  es: ['es-CO', 'es-MX', 'es-US', 'es-419', 'es-ES'],
  en: ['en-US', 'en-GB', 'en-AU'],
};

function pickVoice(lang) {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  let best = null;
  let bestScore = -1;
  for (const v of voices) {
    if (!v.lang.toLowerCase().startsWith(lang)) continue;
    let score = 1;
    const idx = PREFERRED[lang].findIndex((p) => v.lang.toLowerCase() === p.toLowerCase());
    if (idx >= 0) score += 10 - idx;
    if (/natural|neural|online/i.test(v.name)) score += 20;
    if (/google/i.test(v.name)) score += 8;
    if (/salome|paulina|dalia|sabina|elvira|helena|jenny|aria|samantha|ana/i.test(v.name)) score += 6;
    if (score > bestScore) { best = v; bestScore = score; }
  }
  return best;
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

export function stopSpeech() {
  if (current) { current.pause(); current = null; }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function tts(text, lang, rate) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice(lang);
  if (v) u.voice = v;
  u.lang = v ? v.lang : lang === 'en' ? 'en-US' : 'es-CO';
  u.rate = rate;
  u.pitch = 1.15;
  window.speechSynthesis.speak(u);
}

export function speak(text, lang = 'es', opts = {}) {
  if (!config.enabled || !text) return;
  stopSpeech();
  const rate = opts.rate ?? config.rate;
  const key = `${lang}/${slug(text)}`;
  if (manifest && manifest[key]) {
    current = new Audio(`${BASE}audio/${manifest[key]}`);
    current.play().catch(() => tts(text, lang, rate));
    return;
  }
  tts(text, lang, rate);
}
