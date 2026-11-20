// Efectos de sonido sintetizados (sin archivos): moneda, acierto, error, pop, fanfarria
let ctx = null;
let enabled = true;

export function setSfxEnabled(v) { enabled = v; }

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = 'sine', vol = 0.18, slideTo) {
  const a = ac();
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, a.currentTime + start);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, a.currentTime + start + dur);
  g.gain.setValueAtTime(0.0001, a.currentTime + start);
  g.gain.exponentialRampToValueAtTime(vol, a.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + start + dur);
  o.connect(g).connect(a.destination);
  o.start(a.currentTime + start);
  o.stop(a.currentTime + start + dur + 0.05);
}

export const sfx = {
  coin() { if (!enabled) return; tone(988, 0, 0.08, 'square', 0.08); tone(1319, 0.07, 0.25, 'square', 0.08); },
  pop() { if (!enabled) return; tone(420, 0, 0.12, 'sine', 0.2, 900); },
  tap() { if (!enabled) return; tone(660, 0, 0.06, 'triangle', 0.12); },
  correct() { if (!enabled) return; [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.22, 'triangle', 0.16)); },
  wrong() { if (!enabled) return; tone(320, 0, 0.18, 'sine', 0.18, 180); tone(240, 0.16, 0.25, 'sine', 0.14, 140); },
  whoosh() { if (!enabled) return; tone(200, 0, 0.25, 'sine', 0.08, 1200); },
  fanfare() {
    if (!enabled) return;
    const notes = [523, 523, 523, 659, 784, 659, 784, 1047];
    const times = [0, 0.12, 0.24, 0.36, 0.6, 0.78, 0.9, 1.05];
    notes.forEach((f, i) => tone(f, times[i], i === notes.length - 1 ? 0.7 : 0.16, 'square', 0.07));
  },
  chest() { if (!enabled) return; [392, 494, 587, 784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.06, 0.3, 'triangle', 0.12)); },
};
