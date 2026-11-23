export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = (a) => a[Math.floor(Math.random() * a.length)];
export function shuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}
// Opciones cercanas a la respuesta (distintas, dentro de [min,max])
export function opciones(ans, n = 3, { step = 1, spread = 3, min = 0, max = 10000 } = {}) {
  const s = new Set([ans]);
  let guard = 0;
  while (s.size < n && guard++ < 200) {
    const d = rnd(1, spread) * step * (Math.random() < 0.5 ? -1 : 1);
    const v = ans + d;
    if (v >= min && v <= max) s.add(v);
  }
  let k = 1;
  while (s.size < n) { s.add(ans + k * step); k += 1; }
  return shuffle([...s]);
}
export const fmtN = (n) => n.toLocaleString('es-CO');
