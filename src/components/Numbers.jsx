import { useEffect, useMemo, useRef, useState } from 'react';
import { toSpanish, toEnglish } from '../lib/numbers.js';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { confettiAt, shake } from '../lib/fx.js';
import { useStore } from '../lib/store.jsx';
import { DotCard } from './Visual.jsx';

// Número con cada cifra de un color: centenas rojo, decenas azul, unidades amarillo
export function Numeral({ n, className = '' }) {
  const s = String(n);
  const cls = s.length === 4 ? ['d-m', 'd-c', 'd-d', 'd-u'] : s.length === 3 ? ['d-c', 'd-d', 'd-u'] : s.length === 2 ? ['d-d', 'd-u'] : ['d-u'];
  return (
    <span className={`numeral ${className}`}>
      {s.split('').map((d, i) => <span key={`${i}-${d}`} className={`digit ${cls[i]}`}>{d}</span>)}
    </span>
  );
}

// Bloques base 10: centenas (placas), decenas (barras) y unidades (cubitos)
export function Base10({ n }) {
  const h = Math.floor(n / 100) % 10;
  const t = Math.floor(n / 10) % 10;
  const u = n % 10;
  const m = n === 1000;
  let k = 0;
  return (
    <div className="base10">
      {m && <div className="b10-group"><span className="b10-thousand" style={{ animationDelay: '0ms' }}>1000</span><small>mil</small></div>}
      {h > 0 && (
        <div className="b10-group">
          <div className="b10-row">{Array.from({ length: h }, (_, i) => <span key={i} className="b10-hundred" style={{ animationDelay: `${(k++) * 60}ms` }} />)}</div>
          <small>{h} {h === 1 ? 'centena' : 'centenas'}</small>
        </div>
      )}
      {t > 0 && (
        <div className="b10-group">
          <div className="b10-row">{Array.from({ length: t }, (_, i) => <span key={i} className="b10-ten" style={{ animationDelay: `${(k++) * 60}ms` }} />)}</div>
          <small>{t} {t === 1 ? 'decena' : 'decenas'}</small>
        </div>
      )}
      {u > 0 && (
        <div className="b10-group">
          <div className="b10-row b10-units">{Array.from({ length: u }, (_, i) => <span key={i} className="b10-unit" style={{ animationDelay: `${(k++) * 60}ms` }} />)}</div>
          <small>{u} {u === 1 ? 'unidad' : 'unidades'}</small>
        </div>
      )}
      {n === 0 && <div className="b10-group"><small>¡nada! cero</small></div>}
    </div>
  );
}

export function NumberExplorer() {
  const [n, setN] = useState(7);
  const [english, setEnglish] = useState(false);
  const t = useRef(null);

  useEffect(() => {
    clearTimeout(t.current);
    t.current = setTimeout(() => speak(english ? toEnglish(n) : toSpanish(n), english ? 'en' : 'es'), 260);
    return () => clearTimeout(t.current);
  }, [n, english]);

  const add = (d) => { sfx.tap(); setN((x) => Math.max(0, Math.min(1000, x + d))); };

  return (
    <div className="explorer">
      <div className="explorer-display">
        <Numeral n={n} className="explorer-num" key={n} />
        <p className="explorer-word">{english ? toEnglish(n) : toSpanish(n)}</p>
      </div>
      <div className="explorer-pad">
        {[-100, -10, -1].map((d) => <button key={d} className="pad-btn minus" onClick={() => add(d)}>{d}</button>)}
        <button className="pad-btn dice" onClick={() => { sfx.pop(); setN(Math.floor(Math.random() * 1001)); }}>🎲</button>
        {[1, 10, 100].map((d) => <button key={d} className="pad-btn plus" onClick={() => add(d)}>+{d}</button>)}
      </div>
      <input className="explorer-range" type="range" min="0" max="1000" value={n} onChange={(e) => setN(Number(e.target.value))} />
      <div className="seg center">
        <button className={!english ? 'on' : ''} onClick={() => setEnglish(false)}>Español</button>
        <button className={english ? 'on' : ''} onClick={() => setEnglish(true)}>English</button>
      </div>
      <Base10 n={n} />
    </div>
  );
}

const OBJ = ['🍎', '🍓', '⭐', '🐥', '🎈', '🍪', '🐟', '🌸', '🚗', '🦋', '🍌', '🧁'];

const LEVELS = [
  { id: 'l5', label: 'Hasta 5', max: 5 },
  { id: 'l10', label: 'Hasta 10', max: 10 },
  { id: 'l20', label: 'Hasta 20', max: 20 },
  { id: 'l100', label: 'Decenas', tens: true },
  { id: 'l1000', label: 'Centenas', hundreds: true },
];

function makeProblem(op, level) {
  const unit = level.hundreds ? 100 : level.tens ? 10 : 1;
  const max = level.hundreds ? 10 : level.tens ? 10 : level.max;
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
  while (opts.size < 3) {
    const delta = (Math.floor(Math.random() * 3) + 1) * unit * (Math.random() < 0.5 ? -1 : 1);
    const v = ans + delta;
    if (v >= 0 && v <= 1000) opts.add(v);
  }
  return { a, b, ans, opts: [...opts].sort(() => Math.random() - 0.5), emoji: OBJ[Math.floor(Math.random() * OBJ.length)], unit };
}

function Group({ n, unit, emoji, fadeFrom }) {
  if (unit === 1) {
    return (
      <div className={`obj-group ${n > 10 ? 'many' : ''}`}>
        {Array.from({ length: n }, (_, i) => (
          <span key={i} className={`obj ${fadeFrom !== undefined && i >= fadeFrom ? 'obj-out' : ''}`} style={{ animationDelay: `${i * 70}ms` }}>{emoji}</span>
        ))}
      </div>
    );
  }
  const count = n / unit;
  return (
    <div className="obj-group">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`${unit === 10 ? 'b10-ten sm' : 'b10-hundred sm'} ${fadeFrom !== undefined && i >= fadeFrom / unit ? 'obj-out' : ''}`} style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  );
}

export function OperationGame({ op = '+' }) {
  const { addCoins } = useStore();
  const [level, setLevel] = useState(LEVELS[1]);
  const [p, setP] = useState(() => makeProblem(op, LEVELS[1]));
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState([]);
  const [streak, setStreak] = useState(0);
  const refs = useRef([]);

  const sayIt = (pr) => speak(`${toSpanish(pr.a)} ${op === '+' ? 'más' : 'menos'} ${toSpanish(pr.b)}`);

  useEffect(() => { const pr = makeProblem(op, level); setP(pr); setSolved(false); setWrong([]); }, [op, level]);
  useEffect(() => { const id = setTimeout(() => sayIt(p), 500); return () => clearTimeout(id); }, [p]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (v, i) => {
    if (solved) return;
    const el = refs.current[i];
    if (v === p.ans) {
      setSolved(true);
      sfx.correct();
      const r = el.getBoundingClientRect();
      confettiAt(r.left + r.width / 2, r.top + r.height / 2);
      if (!wrong.length) { addCoins(1, el); setStreak((s) => s + 1); }
      speak(`${toSpanish(p.a)} ${op === '+' ? 'más' : 'menos'} ${toSpanish(p.b)}, es igual a ${toSpanish(p.ans)}`);
      setTimeout(() => { setP(makeProblem(op, level)); setSolved(false); setWrong([]); }, 2600);
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
        {LEVELS.map((l) => <button key={l.id} className={level.id === l.id ? 'on' : ''} onClick={() => setLevel(l)}>{l.label}</button>)}
      </div>
      {streak >= 2 && <div className="streak">🔥 {streak} seguidas</div>}
      <div className="op-board" key={`${p.a}${p.b}${p.emoji}`} onClick={() => sayIt(p)}>
        <div className="op-side">
          <Group n={p.a} unit={p.unit} emoji={p.emoji} fadeFrom={op === '-' ? p.a - p.b : undefined} />
          <Numeral n={p.a} className="op-num" />
        </div>
        <span className={`op-sign ${op === '+' ? 'plus' : 'minus'}`}>{op === '+' ? '+' : '−'}</span>
        <div className="op-side">
          {op === '+' ? <Group n={p.b} unit={p.unit} emoji={p.emoji} /> : <div className="obj-group ghost">👋</div>}
          <Numeral n={p.b} className="op-num" />
        </div>
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
            {v}
          </button>
        ))}
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

export function useNumberPool(max) {
  return useMemo(() => numberItems(1, max), [max]);
}

export { DotCard };
