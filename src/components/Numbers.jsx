import { useEffect, useRef, useState } from 'react';
import { toSpanish, toEnglish } from '../lib/numbers.js';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { confettiAt, shake } from '../lib/fx.js';
import { useStore } from '../lib/store.jsx';
import { DotCard } from './Visual.jsx';

// ---------------------------------------------------------------------------
// Número con cada cifra de un color (método Singapur):
// unidades amarillo · decenas azul · centenas rojo · miles morado · decenas de mil verde
// ---------------------------------------------------------------------------
const PLACE = ['d-u', 'd-d', 'd-c', 'd-m', 'd-dm'];
export function Numeral({ n, className = '' }) {
  const s = String(n);
  return (
    <span className={`numeral ${className}`}>
      {s.split('').map((d, i) => <span key={`${i}-${d}`} className={`digit ${PLACE[s.length - 1 - i]}`}>{d}</span>)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Bloques base 10 (Singapur): cubos de mil, placas de cien, barras de diez, cubitos
// ---------------------------------------------------------------------------
export function Base10({ n, compact = false, showLabels = true }) {
  const m = Math.floor(n / 1000);
  const h = Math.floor(n / 100) % 10;
  const t = Math.floor(n / 10) % 10;
  const u = n % 10;
  let k = 0;
  const d = () => ({ animationDelay: `${Math.min((k++) * 45, 1400)}ms` });
  const lab = (q, s, p) => showLabels && <small>{q} {q === 1 ? s : p}</small>;
  return (
    <div className={`base10 ${compact ? 'compact' : ''}`}>
      {m > 0 && (
        <div className="b10-group">
          <div className="b10-row b10-cubes">{Array.from({ length: m }, (_, i) => <span key={i} className="b10-cube" style={d()}><i /></span>)}</div>
          {lab(m, 'mil', 'miles')}
        </div>
      )}
      {h > 0 && (
        <div className="b10-group">
          <div className="b10-row">{Array.from({ length: h }, (_, i) => <span key={i} className="b10-hundred" style={d()} />)}</div>
          {lab(h, 'centena', 'centenas')}
        </div>
      )}
      {t > 0 && (
        <div className="b10-group">
          <div className="b10-row">{Array.from({ length: t }, (_, i) => <span key={i} className="b10-ten" style={d()} />)}</div>
          {lab(t, 'decena', 'decenas')}
        </div>
      )}
      {u > 0 && (
        <div className="b10-group">
          <div className="b10-row b10-units">{Array.from({ length: u }, (_, i) => <span key={i} className="b10-unit" style={d()} />)}</div>
          {lab(u, 'unidad', 'unidades')}
        </div>
      )}
      {n === 0 && <div className="b10-group"><small>cero</small></div>}
    </div>
  );
}

// Tabla de valor posicional (UM · C · D · U)
export function PlaceTable({ n }) {
  const cols = [
    { k: 'UM', v: Math.floor(n / 1000), c: 'd-m', show: n >= 1000 },
    { k: 'C', v: Math.floor(n / 100) % 10, c: 'd-c', show: n >= 100 },
    { k: 'D', v: Math.floor(n / 10) % 10, c: 'd-d', show: n >= 10 },
    { k: 'U', v: n % 10, c: 'd-u', show: true },
  ].filter((c) => c.show);
  return (
    <div className="place-table">
      {cols.map((c) => (
        <div key={c.k} className="pt-col">
          <b>{c.k}</b>
          <span className={`digit ${c.c}`}>{c.v}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Explorador 0 – 10.000
// ---------------------------------------------------------------------------
export function NumberExplorer() {
  const [n, setN] = useState(7);
  const [english, setEnglish] = useState(false);
  const t = useRef(null);

  useEffect(() => {
    clearTimeout(t.current);
    t.current = setTimeout(() => speak(english ? toEnglish(n) : toSpanish(n), english ? 'en' : 'es'), 260);
    return () => clearTimeout(t.current);
  }, [n, english]);

  const add = (d) => { sfx.tap(); setN((x) => Math.max(0, Math.min(10000, x + d))); };

  return (
    <div className="explorer">
      <div className="explorer-display">
        <Numeral n={n} className="explorer-num" key={n} />
        <p className="explorer-word">{english ? toEnglish(n) : toSpanish(n)}</p>
        <PlaceTable n={n} />
      </div>
      <div className="explorer-pad">
        {[-1000, -100, -10, -1].map((d) => <button key={d} className="pad-btn minus" onClick={() => add(d)}>{d}</button>)}
        <button className="pad-btn dice" onClick={() => { sfx.pop(); setN(Math.floor(Math.random() * 10001)); }}>🎲</button>
        {[1, 10, 100, 1000].map((d) => <button key={d} className="pad-btn plus" onClick={() => add(d)}>+{d}</button>)}
      </div>
      <input className="explorer-range" type="range" min="0" max="10000" value={n} onChange={(e) => setN(Number(e.target.value))} />
      <div className="seg center">
        <button className={!english ? 'on' : ''} onClick={() => setEnglish(false)}>Español</button>
        <button className={english ? 'on' : ''} onClick={() => setEnglish(true)}>English</button>
      </div>
      <Base10 n={n} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Marcos de 10 (ten-frames, Singapur) para sumas y restas con objetos
// crossFrom: desde qué posición los objetos "se van" (se tachan en la resta)
// ---------------------------------------------------------------------------
export function TenFrames({ n, emoji = '⭐', crossFrom, size = 'md', delay = 0 }) {
  const frames = Math.max(1, Math.ceil(n / 10));
  return (
    <div className={`tenframes tf-${size}`}>
      {Array.from({ length: frames }, (_, f) => (
        <div key={f} className="tenframe">
          {Array.from({ length: 10 }, (_, c) => {
            const i = f * 10 + c;
            const filled = i < n;
            const crossed = filled && crossFrom !== undefined && i >= crossFrom;
            return (
              <span key={c} className={`tf-cell ${filled ? 'on' : ''} ${crossed ? 'gone' : ''}`}>
                {filled && <span className="tf-obj" style={{ animationDelay: `${delay + i * 55}ms` }}>{emoji}</span>}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Bloques (decenas, centenas o miles) con opción de tachar los que se quitan
function BlockGroup({ n, unit, crossFrom }) {
  const count = Math.round(n / unit);
  const cls = unit === 10 ? 'b10-ten sm' : unit === 100 ? 'b10-hundred sm' : 'b10-cube sm';
  return (
    <div className="block-group">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`blk-wrap ${crossFrom !== undefined && i >= crossFrom / unit ? 'gone' : ''}`}>
          <span className={cls} style={{ animationDelay: `${i * 70}ms` }}>{unit === 1000 && <i />}</span>
        </span>
      ))}
    </div>
  );
}

function Visual({ n, unit, emoji, crossFrom }) {
  if (unit === 1) return <TenFrames n={n} emoji={emoji} crossFrom={crossFrom} size={n > 10 ? 'sm' : 'md'} />;
  return <BlockGroup n={n} unit={unit} crossFrom={crossFrom} />;
}

const OBJ = ['🍎', '🍓', '⭐', '🐥', '🎈', '🍪', '🐟', '🌸', '🚗', '🦋', '🍌', '🧁'];

export const OP_LEVELS = [
  { id: 'l5', label: 'Hasta 5', max: 5, unit: 1 },
  { id: 'l10', label: 'Hasta 10', max: 10, unit: 1 },
  { id: 'l20', label: 'Hasta 20', max: 20, unit: 1 },
  { id: 'l100', label: 'Decenas', max: 10, unit: 10 },
  { id: 'l1000', label: 'Centenas', max: 10, unit: 100 },
  { id: 'l10000', label: 'Miles', max: 10, unit: 1000 },
];

export function makeProblem(op, level) {
  const { unit, max } = level;
  let a; let b;
  if (op === '+') {
    a = 1 + Math.floor(Math.random() * (max - 1));
    b = 1 + Math.floor(Math.random() * (max - a));
  } else {
    a = 2 + Math.floor(Math.random() * (max - 1));
    b = 1 + Math.floor(Math.random() * (a - 1));
  }
  a *= unit; b *= unit;
  const ans = op === '+' ? a + b : a - b;
  const opts = new Set([ans]);
  let guard = 0;
  while (opts.size < 3 && guard++ < 50) {
    const delta = (Math.floor(Math.random() * 3) + 1) * unit * (Math.random() < 0.5 ? -1 : 1);
    const v = ans + delta;
    if (v >= 0 && v <= 10000) opts.add(v);
  }
  return { a, b, ans, opts: [...opts].sort(() => Math.random() - 0.5), emoji: OBJ[Math.floor(Math.random() * OBJ.length)], unit };
}

export function OperationGame({ op = '+' }) {
  const { addCoins } = useStore();
  const [level, setLevel] = useState(OP_LEVELS[1]);
  const [p, setP] = useState(() => makeProblem(op, OP_LEVELS[1]));
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState([]);
  const [streak, setStreak] = useState(0);
  const [crossed, setCrossed] = useState(false);
  const refs = useRef([]);
  const palabra = op === '+' ? 'más' : 'menos';

  const sayIt = (pr) => speak(`${toSpanish(pr.a)} ${palabra} ${toSpanish(pr.b)}`);

  useEffect(() => { setP(makeProblem(op, level)); setSolved(false); setWrong([]); }, [op, level]);
  useEffect(() => {
    setCrossed(false);
    const id = setTimeout(() => sayIt(p), 500);
    // En la resta, los objetos que se van se tachan después de que los niños los vean
    const id2 = op === '-' ? setTimeout(() => { setCrossed(true); sfx.whoosh(); }, 1600) : null;
    return () => { clearTimeout(id); clearTimeout(id2); };
  }, [p]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (v, i) => {
    if (solved) return;
    const el = refs.current[i];
    if (v === p.ans) {
      setSolved(true);
      setCrossed(true);
      sfx.correct();
      const r = el.getBoundingClientRect();
      confettiAt(r.left + r.width / 2, r.top + r.height / 2);
      if (!wrong.length) { addCoins(1, el); setStreak((s) => s + 1); }
      speak(`${toSpanish(p.a)} ${palabra} ${toSpanish(p.b)}, es igual a ${toSpanish(p.ans)}`);
      setTimeout(() => { setP(makeProblem(op, level)); setSolved(false); setWrong([]); }, 3000);
    } else {
      sfx.wrong();
      shake(el);
      setStreak(0);
      setWrong((w) => [...w, i]);
    }
  };

  return (
    <div className="opgame">
      <div className="seg center wrap">
        {OP_LEVELS.map((l) => <button key={l.id} className={level.id === l.id ? 'on' : ''} onClick={() => setLevel(l)}>{l.label}</button>)}
      </div>
      {streak >= 2 && <div className="streak">🔥 {streak} seguidas</div>}
      <div className={`op-grid ${op === '-' ? 'is-minus' : ''}`} key={`${p.a}${p.b}${p.emoji}`} onClick={() => sayIt(p)}>
        <div className="og-vis">
          <Visual n={p.a} unit={p.unit} emoji={p.emoji} crossFrom={op === '-' && crossed ? p.a - p.b : undefined} />
        </div>
        <div />
        <div className="og-vis">
          {op === '+'
            ? <Visual n={p.b} unit={p.unit} emoji={p.emoji} />
            : (
              <div className={`bye-box ${crossed ? 'show' : ''}`}>
                <span className="bye-label">Se van {p.b} 👋</span>
                <Visual n={p.b} unit={p.unit} emoji={p.emoji} crossFrom={0} />
              </div>
            )}
        </div>
        <div />
        <div className="og-vis">
          {solved && <Visual n={p.ans} unit={p.unit} emoji={p.emoji} />}
        </div>

        <Numeral n={p.a} className="op-num" />
        <span className={`op-sign ${op === '+' ? 'plus' : 'minus'}`}>{op === '+' ? '+' : '−'}</span>
        <Numeral n={p.b} className="op-num" />
        <span className="op-sign eq">=</span>
        <div className={`op-answer ${solved ? 'show' : ''}`}>{solved ? <Numeral n={p.ans} /> : '?'}</div>
      </div>
      <div className="op-options">
        {p.opts.map((v, i) => (
          <button
            key={`${p.a}-${p.b}-${v}`}
            ref={(el) => { refs.current[i] = el; }}
            className={`op-opt ${wrong.includes(i) ? 'is-wrong' : ''} ${solved && v === p.ans ? 'is-right' : ''}`}
            onClick={() => pick(v, i)}
          >
            {v.toLocaleString('es-CO')}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Multiplicación: grupos iguales (Singapur) — tablas del 1 al 9
// ---------------------------------------------------------------------------
export function GroupsVisual({ groups, each, emoji = '🍓', compact = false }) {
  return (
    <div className={`mul-groups ${compact ? 'compact' : ''}`}>
      {Array.from({ length: groups }, (_, g) => (
        <div key={g} className="mul-plate" style={{ animationDelay: `${g * 90}ms` }}>
          {Array.from({ length: each }, (_, i) => <span key={i} className="mul-obj">{emoji}</span>)}
        </div>
      ))}
    </div>
  );
}

const MUL_EMOJI = ['🍓', '🍎', '⭐', '🐞', '🍪', '🎈', '🐟', '🌸', '🍩'];

export function MultiplicationExplorer({ onBits }) {
  const [tabla, setTabla] = useState(2);
  const [veces, setVeces] = useState(3);
  const emoji = MUL_EMOJI[tabla - 1];
  const r = tabla * veces;

  useEffect(() => {
    const id = setTimeout(() => speak(`${toSpanish(tabla)} por ${toSpanish(veces)}, ${toSpanish(r)}`), 300);
    return () => clearTimeout(id);
  }, [tabla, veces, r]);

  return (
    <div className="mulx">
      <div className="mulx-tables">
        <span>Tabla del</span>
        {Array.from({ length: 9 }, (_, i) => i + 1).map((t) => (
          <button key={t} className={`mulx-chip ${t === tabla ? 'on' : ''}`} onClick={() => { sfx.tap(); setTabla(t); }}>{t}</button>
        ))}
      </div>
      <div className="mulx-body">
        <div className="mulx-step">
          <button className="pad-btn minus" onClick={() => { sfx.tap(); setVeces((v) => Math.max(1, v - 1)); }}>−</button>
          <b>{veces} {veces === 1 ? 'grupo' : 'grupos'} de {tabla}</b>
          <button className="pad-btn plus" onClick={() => { sfx.tap(); setVeces((v) => Math.min(10, v + 1)); }}>+</button>
        </div>
        <GroupsVisual groups={veces} each={tabla} emoji={emoji} key={`${tabla}-${veces}`} />
        <p className="mulx-sum">{Array.from({ length: veces }, () => tabla).join(' + ')} = <b>{r}</b></p>
        <div className="mulx-eq">
          <Numeral n={tabla} /> <span className="op-sign mul">×</span> <Numeral n={veces} /> <span className="op-sign eq">=</span> <Numeral n={r} />
        </div>
        <div className="mulx-list">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
            <button key={i} className={`mulx-row ${i === veces ? 'on' : ''}`} onClick={() => { sfx.tap(); setVeces(i); }}>
              {tabla} × {i} = <b>{tabla * i}</b>
            </button>
          ))}
        </div>
        {onBits && <button className="btn btn-xl btn-accent" onClick={() => onBits(tabla)}>⚡ Bits de la tabla del {tabla}</button>}
      </div>
    </div>
  );
}

// Utilidades para BitPlayer de números
export function numberItems(from, to, step = 1) {
  const out = [];
  for (let n = from; n <= to; n += step) out.push({ texto: toSpanish(n), numero: n });
  return out;
}

export { DotCard, MUL_EMOJI };
