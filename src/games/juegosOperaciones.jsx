import { useEffect, useState } from 'react';
import { toSpanish } from '../lib/numbers.js';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { Numeral, TenFrames } from '../components/Numbers.jsx';
import { rnd, pick, opciones, fmtN } from './util.js';

const useSay = (text, deps = []) => {
  useEffect(() => {
    const id = setTimeout(() => speak(text), 450);
    return () => clearTimeout(id);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

function Opciones({ ops, ans, onAnswer, disabled, cls = '' }) {
  return (
    <div className="g-options">
      {ops.map((v) => (
        <button key={v} className={`g-opt ${cls}`} disabled={disabled} onClick={(e) => onAnswer(v === ans, e.currentTarget)}>{fmtN(v)}</button>
      ))}
    </div>
  );
}

function genOp(level) {
  const op = pick(level.ops);
  const u = level.unit || 1;
  const max = Math.round(level.max / u);
  let a; let b;
  if (op === '+') { a = rnd(1, max - 1); b = rnd(1, max - a); } else { a = rnd(2, max); b = rnd(1, a - 1); }
  a *= u; b *= u;
  const ans = op === '+' ? a + b : a - b;
  return { op, a, b, ans, ops: opciones(ans, 3, { step: u, spread: 3, min: 0, max: level.max + u * 3 }) };
}

const OP_LEVELS = [
  { id: 'o10', label: 'Sumas hasta 10', ops: ['+'], max: 10 },
  { id: 'o20', label: 'Sumas y restas hasta 20', ops: ['+', '-'], max: 20 },
  { id: 'o100', label: 'Decenas hasta 100', ops: ['+', '-'], max: 100, unit: 10 },
  { id: 'o1000', label: 'Centenas hasta 1.000', ops: ['+', '-'], max: 1000, unit: 100 },
];

// ---------------------------------------------------------------------------
// 7. El mono comelón (suma con objetos)
// ---------------------------------------------------------------------------
export function Mono({ level, onAnswer, onStep }) {
  const [st] = useState(() => {
    const a = rnd(1, Math.floor(level.max / 2));
    const b = rnd(1, level.max - a);
    return { a, b, ops: opciones(a + b, 3, { min: 1, max: level.max + 3 }) };
  });
  const [moved, setMoved] = useState(0);
  const [feliz, setFeliz] = useState(false);
  useSay(`El mono tiene ${toSpanish(st.a)} bananos. Le regalan ${toSpanish(st.b)} más. Pásalos a la canasta.`);
  const listo = moved === st.b;
  const mover = (el) => {
    if (listo) return;
    const m = moved + 1;
    setMoved(m);
    onStep(el);
    speak(toSpanish(st.a + m));
    if (m === st.b) setTimeout(() => speak('¿Cuántos bananos tiene ahora?'), 700);
  };
  return (
    <div className="g-mono">
      <div className="mono-tree">
        <span className="tree-top">🌳</span>
        <div className="tree-bananas">
          {Array.from({ length: st.b - moved }, (_, i) => (
            <button key={i} className="banana-btn" onClick={(e) => mover(e.currentTarget)}>🍌</button>
          ))}
        </div>
        <small>Toca cada banano para pasarlo</small>
      </div>
      <div className="mono-center">
        <span className={`mono-face ${feliz ? 'party' : ''}`}>{feliz ? '🐵' : '🐒'}</span>
        <p className="g-title">{fmtN(st.a)} + {fmtN(st.b)} = <b>{listo && feliz ? st.a + st.b : '?'}</b></p>
        <div className="basket">
          <TenFrames n={st.a + moved} emoji="🍌" size={st.a + moved > 10 ? 'sm' : 'md'} />
          <span className="basket-label">🧺 Canasta</span>
        </div>
      </div>
      {listo && (
        <div className="mono-q">
          <p className="g-title">¿Cuántos bananos tiene ahora?</p>
          <Opciones ops={st.ops} ans={st.a + st.b} disabled={feliz} onAnswer={(ok, el) => { if (ok) setFeliz(true); onAnswer(ok, el); }} />
        </div>
      )}
    </div>
  );
}
Mono.meta = { levels: [{ id: 'mo10', label: 'Hasta 10', max: 10 }, { id: 'mo20', label: 'Hasta 20', max: 20 }] };

// ---------------------------------------------------------------------------
// 8. Los patitos perdidos (resta)
// ---------------------------------------------------------------------------
export function Patitos({ level, onAnswer }) {
  const [st] = useState(() => {
    const n = rnd(3, level.max);
    const k = rnd(1, n - 1);
    return { n, k, ops: opciones(n - k, 3, { min: 0, max: level.max }) };
  });
  const [fase, setFase] = useState('nadan');
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const t0 = setTimeout(() => speak(`Hay ${toSpanish(st.n)} patitos nadando.`), 300);
    const t1 = setTimeout(() => { setFase('se-van'); sfx.whoosh(); speak(`¡${toSpanish(st.k)} se van a jugar!`); }, 2600);
    const t2 = setTimeout(() => { setFase('pregunta'); speak('¿Cuántos patitos quedan?'); }, 4600);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="g-patitos">
      <p className="g-title">Hay <b>{st.n}</b> patitos. {fase !== 'nadan' && <>Se van <b>{st.k}</b>. </>}{ok && <>Quedan <b>{st.n - st.k}</b>.</>}</p>
      <div className="pond">
        {Array.from({ length: st.n }, (_, i) => {
          const leaving = fase !== 'nadan' && i >= st.n - st.k;
          return <span key={i} className={`duck ${leaving ? 'leave' : ''}`} style={{ '--i': i, animationDelay: `${(i % 5) * 0.2}s` }}>🦆</span>;
        })}
        <span className="reed r1">🌾</span><span className="reed r2">🌿</span>
      </div>
      {fase === 'pregunta' && (
        <>
          {ok && <p className="g-eq"><Numeral n={st.n} /> − <Numeral n={st.k} /> = <Numeral n={st.n - st.k} /></p>}
          <Opciones ops={st.ops} ans={st.n - st.k} disabled={ok} onAnswer={(r, el) => { if (r) setOk(true); onAnswer(r, el); }} />
        </>
      )}
    </div>
  );
}
Patitos.meta = { pause: 2200, levels: [{ id: 'p10', label: 'Hasta 10', max: 10 }, { id: 'p20', label: 'Hasta 20', max: 20 }] };

// ---------------------------------------------------------------------------
// 9. La pastelería matemática
// ---------------------------------------------------------------------------
export function Pasteleria({ level, onAnswer, onStep }) {
  const [st] = useState(() => {
    if (level.mode === 'resta') {
      const t = rnd(4, level.max);
      const k = rnd(1, t - 1);
      return { t, k, ops: opciones(t - k, 3, { min: 0, max: level.max }) };
    }
    if (level.mode === 'suma') {
      const a = rnd(1, Math.floor(level.max / 2));
      const b = rnd(1, level.max - a);
      return { a, b, total: a + b };
    }
    const n = rnd(2, level.max);
    return { total: n };
  });
  const [box, setBox] = useState(0);
  const [ok, setOk] = useState(false);
  useSay(level.mode === 'resta'
    ? `Había ${toSpanish(st.t)} ponquecitos. Vendimos ${toSpanish(st.k)}. ¿Cuántos quedan?`
    : level.mode === 'suma'
      ? `Una señora pide ${toSpanish(st.a)} ponquecitos y un señor pide ${toSpanish(st.b)}. Prepara todos en la caja.`
      : `¡Un cliente pide ${toSpanish(st.total)} ponquecitos!`);

  if (level.mode === 'resta') {
    return (
      <div className="g-pasteleria">
        <p className="g-title">Había <b>{st.t}</b> 🧁. Vendimos <b>{st.k}</b>. ¿Cuántos quedan?</p>
        <div className="vitrina"><TenFrames n={st.t} emoji="🧁" crossFrom={st.t - st.k} size={st.t > 10 ? 'sm' : 'md'} /></div>
        <Opciones ops={st.ops} ans={st.t - st.k} disabled={ok} onAnswer={(r, el) => { if (r) setOk(true); onAnswer(r, el); }} />
      </div>
    );
  }

  return (
    <div className="g-pasteleria">
      <div className="tickets">
        {level.mode === 'suma' ? (
          <>
            <div className="ticket"><span>👩</span><b>{st.a}</b> 🧁</div>
            <span className="op-sign plus small">+</span>
            <div className="ticket"><span>👨</span><b>{st.b}</b> 🧁</div>
          </>
        ) : <div className="ticket"><span>🧒</span><b>{st.total}</b> 🧁</div>}
      </div>
      <div className="bakery">
        <button className="tray" onClick={(e) => { setBox((b) => Math.min(30, b + 1)); onStep(e.currentTarget); speak(toSpanish(box + 1)); }}>
          <span>🧁</span><small>Tocar para poner en la caja</small>
        </button>
        <div className={`cake-box ${ok ? 'closed' : ''}`}>
          <TenFrames n={box} emoji="🧁" size={box > 10 ? 'sm' : 'md'} />
          <span className="box-count">En la caja: <b>{box}</b></span>
        </div>
      </div>
      <div className="row gap wrap" style={{ justifyContent: 'center' }}>
        <button className="g-btn light" onClick={() => { sfx.tap(); setBox((b) => Math.max(0, b - 1)); }}>↩ Quitar uno</button>
        <button className="btn btn-xl btn-gold" onClick={(e) => {
          if (ok) return;
          if (box === st.total) { setOk(true); onAnswer(true, e.currentTarget); } else {
            speak(box < st.total ? 'Faltan ponquecitos' : 'Sobran ponquecitos');
            onAnswer(false, e.currentTarget);
          }
        }}>📦 Entregar pedido</button>
      </div>
    </div>
  );
}
Pasteleria.meta = {
  rounds: 6,
  levels: [
    { id: 'pa1', label: 'Un pedido (hasta 10)', mode: 'uno', max: 10 },
    { id: 'pa2', label: 'Dos clientes (suma)', mode: 'suma', max: 12 },
    { id: 'pa3', label: 'Ventas (resta)', mode: 'resta', max: 15 },
  ],
};

// ---------------------------------------------------------------------------
// 10. Repara al robot
// ---------------------------------------------------------------------------
const ROBOT_PARTS = ['pies', 'piernas', 'cuerpo', 'brazo-i', 'brazo-d', 'cabeza', 'ojos', 'antena'];
export function Robot({ level, round, onAnswer }) {
  const [st] = useState(() => genOp(level));
  const [ok, setOk] = useState(false);
  useSay(`${toSpanish(st.a)} ${st.op === '+' ? 'más' : 'menos'} ${toSpanish(st.b)}`);
  const built = round + (ok ? 1 : 0);
  return (
    <div className="g-robot">
      <div className={`robot ${built >= ROBOT_PARTS.length ? 'dance' : ''}`}>
        {ROBOT_PARTS.map((p, i) => <span key={p} className={`rp rp-${p} ${i < built ? 'on' : ''} ${ok && i === built - 1 ? 'new' : ''}`} />)}
      </div>
      <div className="robot-main">
        <p className="g-title">🔧 Elige la pieza correcta para reparar al robot</p>
        <div className="g-eq big">
          <Numeral n={st.a} /> <span className={`op-sign ${st.op === '+' ? 'plus' : 'minus'}`}>{st.op === '+' ? '+' : '−'}</span> <Numeral n={st.b} /> <span className="op-sign eq">=</span> <span className="q-box">{ok ? <Numeral n={st.ans} /> : '?'}</span>
        </div>
        <div className="g-options">
          {st.ops.map((v) => (
            <button key={v} className="gear" disabled={ok} onClick={(e) => { if (v === st.ans) setOk(true); onAnswer(v === st.ans, e.currentTarget); }}>
              <span className="gear-ico">⚙️</span><b>{fmtN(v)}</b>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
Robot.meta = { rounds: ROBOT_PARTS.length, levels: OP_LEVELS };

// ---------------------------------------------------------------------------
// 11. Cruza el río
// ---------------------------------------------------------------------------
const STONES = 6;
export function Rio({ level, round, onAnswer }) {
  const [st] = useState(() => genOp(level));
  const [salto, setSalto] = useState(false);
  const pos = round + (salto ? 1 : 0);
  useSay(`${toSpanish(st.a)} ${st.op === '+' ? 'más' : 'menos'} ${toSpanish(st.b)}`);
  const left = pos === 0 ? 4 : pos > STONES ? 96 : 8 + (pos - 1) * (84 / (STONES - 1));
  return (
    <div className="g-rio">
      <div className="river">
        <span className="bank b-left">🌳</span>
        <span className="bank b-right">{pos >= STONES ? '🏆' : '🎁'}</span>
        {Array.from({ length: STONES }, (_, i) => (
          <span key={i} className={`stone ${i < pos ? 'done' : ''} ${i === pos ? 'next' : ''}`} style={{ left: `${8 + i * (84 / (STONES - 1))}%` }}>{i + 1}</span>
        ))}
        <span className={`hero ${salto ? 'jump' : ''}`} style={{ left: `${left}%` }}>🐻</span>
        <span className="wave w1">〰️</span><span className="wave w2">〰️</span>
      </div>
      <div className="g-eq big">
        <Numeral n={st.a} /> <span className={`op-sign ${st.op === '+' ? 'plus' : 'minus'}`}>{st.op === '+' ? '+' : '−'}</span> <Numeral n={st.b} /> <span className="op-sign eq">=</span> <span className="q-box">{salto ? <Numeral n={st.ans} /> : '?'}</span>
      </div>
      <Opciones ops={st.ops} ans={st.ans} disabled={salto} cls="stone-opt" onAnswer={(r, el) => { if (r) { setSalto(true); sfx.whoosh(); } onAnswer(r, el); }} />
    </div>
  );
}
Rio.meta = { rounds: STONES, levels: OP_LEVELS };

