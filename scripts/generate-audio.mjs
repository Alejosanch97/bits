// Genera los audios de todos los bits con ElevenLabs y los guarda en public/audio/
// Uso:  npm run audios                       (letras + inglés + sílabas + números 0–100)
//       npm run audios -- --numeros=1000     (números hasta 1000, gasta más créditos)
//       npm run audios -- --solo=es          (solo español)  |  --solo=en  (solo inglés)
//       npm run audios -- --dry              (solo calcula cuántos caracteres gastaría)
// La clave se lee de .env.local (ELEVENLABS_API_KEY=...). Nunca la pongas en el código.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LETRAS, silabasDe } from '../src/data/espanol.js';
import { ENGLISH } from '../src/data/english.js';
import { toSpanish } from '../src/lib/numbers.js';
import { slug } from '../src/lib/slug.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'audio');
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));

const KEY = process.env.ELEVENLABS_API_KEY;
// Voces: cámbialas en .env.local por las que más te gusten de tu biblioteca de ElevenLabs
const VOICE_ES = process.env.ELEVENLABS_VOICE_ES || 'EXAVITQu4vr4xnSDxMaL';
const VOICE_EN = process.env.ELEVENLABS_VOICE_EN || 'EXAVITQu4vr4xnSDxMaL';
const MODEL = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
const maxNum = Number(args.numeros || 100);

const jobs = new Map();
const add = (lang, text) => { const k = `${lang}/${slug(text)}`; if (!jobs.has(k)) jobs.set(k, { lang, text, file: `${k}.mp3` }); };

if (args.solo !== 'en') {
  LETRAS.forEach((l) => { add('es', l.letra); l.palabras.forEach((p) => add('es', p.texto)); silabasDe(l.letra).forEach((s) => add('es', s)); });
  for (let n = 0; n <= maxNum; n++) add('es', toSpanish(n));
  ['¡Muy bien!', '¡Excelente!', '¡Genial!', '¡Eso es!', '¡Súper!', '¡Bravo!', 'Instituto Pedagógico Crear'].forEach((t) => add('es', t));
}
if (args.solo !== 'es') {
  ENGLISH.forEach((c) => { add('en', c.titulo); c.items.forEach((i) => add('en', i.texto)); });
  ['Great!', 'Awesome!', 'Super!', 'Well done!', 'Yes!', 'Amazing!', 'Great job!'].forEach((t) => add('en', t));
}

const manifestPath = path.join(OUT, 'manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
const pending = [...jobs.entries()].filter(([k, j]) => !(manifest[k] && fs.existsSync(path.join(OUT, j.file))));
const chars = pending.reduce((s, [, j]) => s + j.text.length, 0);
console.log(`Bits totales: ${jobs.size} · Pendientes: ${pending.length} · Caracteres a gastar: ~${chars}`);
if (args.dry) process.exit(0);
if (!KEY) { console.error('Falta ELEVENLABS_API_KEY en .env.local'); process.exit(1); }

async function tts(text, voice) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true } }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

let done = 0;
const CONCURRENCY = 3;
const queue = [...pending];
async function worker() {
  while (queue.length) {
    const [k, j] = queue.shift();
    try {
      const buf = await tts(j.text, j.lang === 'en' ? VOICE_EN : VOICE_ES);
      fs.mkdirSync(path.dirname(path.join(OUT, j.file)), { recursive: true });
      fs.writeFileSync(path.join(OUT, j.file), buf);
      manifest[k] = j.file;
      done += 1;
      process.stdout.write(`\r✔ ${done}/${pending.length}  ${j.text.padEnd(30)}`);
      if (done % 20 === 0) fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
    } catch (e) {
      console.error(`\n✖ ${j.text}: ${e.message}`);
      if (String(e.message).startsWith('401') || String(e.message).includes('quota')) { queue.length = 0; }
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
console.log(`\nListo. Audios en public/audio (${Object.keys(manifest).length} en el manifest).`);
