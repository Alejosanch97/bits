import { useEffect, useRef, useState } from 'react';
import { toSpanish } from '../lib/numbers.js';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { Numeral, Base10 } from '../components/Numbers.jsx';
import { DotCard } from '../components/Visual.jsx';
import { rnd, pick, shuffle, opciones, fmtN } from './util.js';
import { variado } from '../lib/variedad.js';

const useSay = (text, deps = []) => {
  useEffect(() => {
    const id = setTimeout(() => speak(text), 450);
    return () => clearTimeout(id);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};
const stepFor = (max) => (max >= 1000 ? pick([1, 10, 100, 1000]) : max >= 100 ? pick([1, 10, 100]) : max >= 20 ? pick([1, 10]) : 1);

// ---------------------------------------------------------------------------
// 1. El tesoro de los números
// ---------------------------------------------------------------------------
export function Tesoro({ level, onAnswer }) {
  const [st] = useState(() => {
    const n = variado(`tesoro${level.id}`, () => rnd(level.min || 1, level.max), (x) => x, 5);
    return { n, ops: opciones(n, 4, { step: stepFor(level.max), spread: 3, min: 1, max: level.max }) };
  });
  const [abierto, setAbierto] = useState(null);
  const [malos, setMalos] = useState([]);
  useSay(`Encuentra el número ${toSpanish(st.n)}`);

  const elegir = (v, i, el) => {
    if (abierto !== null || malos.includes(i)) return;
    if (v === st.n) { setAbierto(i); sfx.chest(); onAnswer(true, el); } else { setMalos((m) => [...m, i]); onAnswer(false, el); }
  };

  return (
    <div className="g-tesoro">
      <button className="g-pista" onClick={() => speak(`Encuentra el número ${toSpanish(st.n)}`)}>
        <span className="g-pista-ico">🗺️</span>
        <span><small>¡Encuentra el número!</small><b>{toSpanish(st.n)}</b></span>
        <span className="g-ear">🔊</span>
      </button>
      <div className="g-chests">
        {st.ops.map((v, i) => (
          <button key={v} className={`tchest ${abierto === i ? 'open' : ''} ${malos.includes(i) ? 'empty' : ''}`} style={{ animationDelay: `${i * 90}ms` }} onClick={(e) => elegir(v, i, e.currentTarget)}>
            <span className="tc-lid" />
            <span className="tc-base"><b>{fmtN(v)}</b></span>
            {abierto === i && <span className="tc-loot">{['🪙', '⭐', '💎', '🪙', '🦄'].map((x, k) => <i key={k} style={{ '--k': k }}>{x}</i>)}</span>}
            {malos.includes(i) && <span className="tc-web">🕸️</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
Tesoro.meta = {
  levels: [
    { id: 't10', label: 'Hasta 10', max: 10 },
    { id: 't50', label: 'Hasta 50', max: 50, min: 10 },
    { id: 't200', label: 'Hasta 200', max: 200, min: 50 },
    { id: 't20', label: 'Hasta 20', max: 20 },
    { id: 't100', label: 'Hasta 100', max: 100, min: 10 },
    { id: 't1000', label: 'Hasta 1.000', max: 1000, min: 100 },
    { id: 't10000', label: 'Hasta 10.000', max: 10000, min: 1000 },
  ],
};

// ---------------------------------------------------------------------------
// 2. El tren numérico
// ---------------------------------------------------------------------------
const WAGON_COLORS = ['#E8412C', '#2F8FD8', '#2E9E5B', '#F2A20C', '#7A4FD6', '#E0598B'];

export function Tren({ level, onAnswer, onStep }) {
  const [st] = useState(() => {
    if (level.missing) {
      const step = pick(level.steps || [1, 2, 5, 10]);
      const start = rnd(0, Math.max(0, level.max - step * 5));
      const seq = Array.from({ length: 5 }, (_, i) => start + i * step);
      const hole = rnd(1, 3);
      return { seq, hole, ops: opciones(seq[hole], 3, { step, spread: 2, min: 0, max: level.max + 50 }) };
    }
    const s = new Set();
    while (s.size < level.n) s.add(rnd(level.min || 0, level.max));
    const nums = [...s];
    return { nums, sorted: [...nums].sort((a, b) => a - b), yard: shuffle(nums) };
  });
  const [placed, setPlaced] = useState([]);
  const [sale, setSale] = useState(false);
  const trainRef = useRef(null);
  useSay(level.missing ? '¿Qué vagón falta?' : 'Ordena los vagones del más pequeño al más grande');

  if (level.missing) {
    return (
      <div className="g-tren">
        <p className="g-title">¿Qué número falta en el tren?</p>
        <div className={`train ${sale ? 'go' : ''}`} ref={trainRef}>
          <span className="loco">🚂</span>
          {st.seq.map((v, i) => (
            <span key={i} className={`wagon ${i === st.hole ? (sale ? 'filled' : 'hole') : ''}`} style={{ '--wc': WAGON_COLORS[i % 6] }}>
              <b>{i === st.hole && !sale ? '?' : fmtN(v)}</b><i /><i />
            </span>
          ))}
        </div>
        <div className="track" />
        <div className="g-options">
          {st.ops.map((v) => (
            <button key={v} className="g-opt" onClick={(e) => {
              if (v === st.seq[st.hole]) { setSale(true); sfx.whoosh(); onAnswer(true, e.currentTarget); } else onAnswer(false, e.currentTarget);
            }}>{fmtN(v)}</button>
          ))}
        </div>
      </div>
    );
  }

  const click = (v, el) => {
    if (placed.includes(v) || sale) return;
    if (v === st.sorted[placed.length]) {
      const np = [...placed, v];
      setPlaced(np);
      onStep(el);
      speak(toSpanish(v));
      if (np.length === st.nums.length) {
        setTimeout(() => { setSale(true); sfx.whoosh(); onAnswer(true, trainRef.current); }, 500);
      }
    } else onAnswer(false, el);
  };

  return (
    <div className="g-tren">
      <p className="g-title">Ordena los vagones: del <b>más pequeño</b> al <b>más grande</b></p>
      <div className={`train ${sale ? 'go' : ''}`} ref={trainRef}>
        <span className="loco">🚂</span>
        {st.sorted.map((v, i) => (
          <span key={i} className={`wagon ${i < placed.length ? 'filled' : 'hole'}`} style={{ '--wc': WAGON_COLORS[i % 6] }}>
            <b>{i < placed.length ? fmtN(placed[i]) : ''}</b><i /><i />
          </span>
        ))}
      </div>
      <div className="track" />
      <div className="yard">
        {st.yard.map((v, i) => (
          <button key={v} className={`wagon loose ${placed.includes(v) ? 'used' : ''}`} style={{ '--wc': WAGON_COLORS[i % 6], animationDelay: `${i * 80}ms` }} onClick={(e) => click(v, e.currentTarget)}>
            <b>{fmtN(v)}</b><i /><i />
          </button>
        ))}
      </div>
    </div>
  );
}
Tren.meta = {
  levels: [
    { id: 'r4p', label: '4 vagones (hasta 20)', n: 4, max: 20 },
    { id: 'r5j', label: '5 vagones (hasta 200)', n: 5, max: 200 },
    { id: 'rmp', label: 'El vagón perdido (hasta 20)', missing: true, max: 20, steps: [1] },
    { id: 'r3', label: '3 vagones (hasta 10)', n: 3, max: 10 },
    { id: 'r4', label: '4 vagones (hasta 100)', n: 4, max: 100 },
    { id: 'r5', label: '5 vagones (hasta 1.000)', n: 5, max: 1000 },
    { id: 'r6', label: '5 vagones (hasta 10.000)', n: 5, max: 10000, min: 1000 },
    { id: 'rm', label: 'El vagón perdido', missing: true, max: 100 },
  ],
};

// ---------------------------------------------------------------------------
// 3. Alimenta al monstruo
// ---------------------------------------------------------------------------
function Monster({ mood }) {
  return (
    <svg viewBox="0 0 200 200" className={`monster m-${mood}`}>
      <ellipse cx="100" cy="190" rx="60" ry="8" fill="#1D2A6B" opacity=".15" />
      <g className="m-body">
        <path d="M60 40 L48 10 L78 32 Z M140 40 L152 10 L122 32 Z" fill="#7A4FD6" stroke="#1D2A6B" strokeWidth="5" strokeLinejoin="round" />
        <path d="M100 26 C160 26 182 70 182 116 C182 162 150 186 100 186 C50 186 18 162 18 116 C18 70 40 26 100 26 Z" fill="#9B74F2" stroke="#1D2A6B" strokeWidth="6" />
        <circle cx="62" cy="150" r="10" fill="#B89BFA" /><circle cx="140" cy="160" r="7" fill="#B89BFA" />
        <circle cx="100" cy="78" r="28" fill="#fff" stroke="#1D2A6B" strokeWidth="5" />
        <circle className="m-pupil" cx="100" cy="82" r="13" fill="#1D2A6B" /><circle cx="105" cy="76" r="4" fill="#fff" />
        {mood === 'happy' && <path d="M58 122 C76 160 124 160 142 122 Z" fill="#C8352B" stroke="#1D2A6B" strokeWidth="5" strokeLinejoin="round" />}
        {mood === 'hungry' && <ellipse className="m-mouth" cx="100" cy="134" rx="30" ry="20" fill="#5A1E1E" stroke="#1D2A6B" strokeWidth="5" />}
        {mood === 'sad' && <path d="M66 146 C80 126 120 126 134 146" fill="none" stroke="#1D2A6B" strokeWidth="6" strokeLinecap="round" />}
        <path d="M84 122 L92 134 L100 122 M100 122 L108 134 L116 122" fill="#fff" stroke="#1D2A6B" strokeWidth="2" opacity={mood === 'hungry' ? 1 : 0} />
      </g>
    </svg>
  );
}

export function Monstruo({ level, onAnswer, onStep }) {
  const [target] = useState(() => variado(`mon${level.id}`, () => rnd(level.min || 2, level.max), (x) => x, 5));
  const [c, setC] = useState(0);
  const [mood, setMood] = useState('hungry');
  const [msg, setMsg] = useState('');
  const say = () => speak(`¡Tengo hambre! Necesito ${toSpanish(target)} globos`);
  useSay(`¡Tengo hambre! Necesito ${toSpanish(target)} globos`);

  const add = (d, el) => {
    const v = Math.max(0, Math.min(level.max + 20, c + d));
    setC(v);
    if (d > 0) onStep(el); else sfx.tap();
    setMood('hungry'); setMsg('');
  };
  const dar = (el) => {
    if (c === target) { setMood('happy'); setMsg('¡Ñam ñam! ¡Gracias!'); onAnswer(true, el); } else {
      setMood('sad');
      const m = c < target ? '¡Me faltan globos!' : '¡Son demasiados!';
      setMsg(m); speak(m); onAnswer(false, el);
    }
  };
  const packs = Math.floor(c / 10);
  const loose = c % 10;

  return (
    <div className="g-monstruo">
      <div className="mon-left">
        <button className="g-pista" onClick={say}><span className="g-pista-ico">🎈</span><span><small>Necesito</small><b>{target} globos</b></span><span className="g-ear">🔊</span></button>
        <Monster mood={mood} />
        {msg && <div className="mon-msg">{msg}</div>}
      </div>
      <div className="mon-right">
        <div className="plate">
          {packs > 0 && Array.from({ length: packs }, (_, i) => <span key={`p${i}`} className="pack">🎈<b>10</b></span>)}
          {Array.from({ length: loose }, (_, i) => <span key={`l${i}`} className="balloon-1">🎈</span>)}
          {c === 0 && <span className="plate-empty">Plato vacío</span>}
        </div>
        <p className="mon-count">Llevas: <b>{c}</b></p>
        <div className="row gap wrap" style={{ justifyContent: 'center' }}>
          <button className="g-btn" onClick={(e) => add(1, e.currentTarget)}>+1 🎈</button>
          {level.packs && <button className="g-btn blue" onClick={(e) => add(10, e.currentTarget)}>+10 📦</button>}
          <button className="g-btn light" onClick={(e) => add(-1, e.currentTarget)}>↩ −1</button>
          {level.packs && <button className="g-btn light" onClick={(e) => add(-10, e.currentTarget)}>↩ −10</button>}
        </div>
        <button className="btn btn-xl btn-gold" onClick={(e) => dar(e.currentTarget)}>🍽️ ¡Dar de comer!</button>
      </div>
    </div>
  );
}
Monstruo.meta = {
  levels: [
    { id: 'm10', label: 'Hasta 10', max: 10 },
    { id: 'm20', label: 'Hasta 20 (paquetes de 10)', max: 20, min: 11, packs: true },
    { id: 'm30', label: 'Hasta 30 (paquetes de 10)', max: 30, min: 11, packs: true },
    { id: 'm100', label: 'Hasta 100 (paquetes de 10)', max: 100, min: 20, packs: true },
  ],
};

// ---------------------------------------------------------------------------
// 4. Misión espacial: encuentra el número perdido
// ---------------------------------------------------------------------------
const ROCKET_PARTS = 8;
export function Mision({ level, round, onAnswer }) {
  const [st] = useState(() => {
    const step = pick(level.steps);
    const len = 5;
    let start = rnd(0, Math.max(0, level.max - step * (len - 1)));
    start = Math.floor(start / step) * step;
    let seq = Array.from({ length: len }, (_, i) => start + i * step);
    if (level.back) seq = seq.reverse();
    const hole = rnd(1, 3);
    return { seq, hole, step, ops: opciones(seq[hole], 3, { step, spread: 2, min: 0, max: level.max + step * 2 }) };
  });
  const [ok, setOk] = useState(false);
  useSay(`Código de lanzamiento. ¿Qué número falta? Vamos de ${toSpanish(st.step)} en ${toSpanish(st.step)}`);
  const lit = round + (ok ? 1 : 0);

  return (
    <div className="g-mision">
      <div className="rocket-col">
        <div className={`rocket ${ok && round === ROCKET_PARTS - 1 ? 'launch' : ''}`}>
          <span className={`r-nose ${lit >= ROCKET_PARTS ? 'on' : ''}`} />
          {Array.from({ length: ROCKET_PARTS - 2 }, (_, i) => <span key={i} className={`r-seg ${lit >= ROCKET_PARTS - 1 - i ? 'on' : ''}`} />)}
          <span className={`r-fins ${lit >= 1 ? 'on' : ''}`} />
          {ok && round === ROCKET_PARTS - 1 && <span className="r-fire">🔥</span>}
        </div>
        <small>Piezas: {Math.min(lit, ROCKET_PARTS)}/{ROCKET_PARTS}</small>
      </div>
      <div className="mision-main">
        <p className="g-title">🛰️ Código de lanzamiento — {level.back ? 'hacia atrás' : 'hacia adelante'} de <b>{fmtN(st.step)}</b> en <b>{fmtN(st.step)}</b></p>
        <div className="code-row">
          {st.seq.map((v, i) => (
            <span key={i} className={`code-cell ${i === st.hole ? (ok ? 'ok' : 'hole') : ''}`}>{i === st.hole && !ok ? '?' : fmtN(v)}</span>
          ))}
        </div>
        <div className="g-options">
          {st.ops.map((v) => (
            <button key={v} className="g-opt space" onClick={(e) => {
              if (ok) return;
              if (v === st.seq[st.hole]) { setOk(true); onAnswer(true, e.currentTarget); } else onAnswer(false, e.currentTarget);
            }}>{fmtN(v)}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
Mision.meta = {
  rounds: ROCKET_PARTS,
  levels: [
    { id: 's1', label: 'De 1 en 1', steps: [1], max: 20 },
    { id: 's10p', label: 'De 10 en 10 (hasta 50)', steps: [10], max: 50 },
    { id: 's2', label: 'De 2, 5 y 10', steps: [2, 5, 10], max: 100 },
    { id: 's2j', label: 'De 2 en 2 y de 5 en 5 (hasta 200)', steps: [2, 5], max: 200 },
    { id: 's3', label: 'De 100 en 100', steps: [100], max: 1000 },
    { id: 's4', label: 'De 1.000 en 1.000', steps: [1000], max: 10000 },
    { id: 's5', label: 'Hacia atrás', steps: [1, 2, 10], back: true, max: 50 },
  ],
};

// ---------------------------------------------------------------------------
// 5. Construye el número (bloques Singapur)
// ---------------------------------------------------------------------------
const PLACES = [
  { k: 'm', v: 1000, label: 'mil', pl: 'miles', cls: 'd-m', block: 'b10-cube sm' },
  { k: 'h', v: 100, label: 'centena', pl: 'centenas', cls: 'd-c', block: 'b10-hundred sm' },
  { k: 't', v: 10, label: 'decena', pl: 'decenas', cls: 'd-d', block: 'b10-ten sm' },
  { k: 'u', v: 1, label: 'unidad', pl: 'unidades', cls: 'd-u', block: 'b10-unit' },
];
export function Construye({ level, onAnswer }) {
  const places = PLACES.filter((p) => level.places.includes(p.k));
  const [target] = useState(() => variado(`cons${level.id}`, () => rnd(level.min, level.max), (x) => x, 5));
  const [cnt, setCnt] = useState({ m: 0, h: 0, t: 0, u: 0 });
  const built = cnt.m * 1000 + cnt.h * 100 + cnt.t * 10 + cnt.u;
  useSay(`Construye el número ${toSpanish(target)}`);
  const change = (k, d) => { sfx.tap(); setCnt((c) => ({ ...c, [k]: Math.max(0, Math.min(9, c[k] + d)) })); };

  return (
    <div className="g-construye">
      <button className="g-pista" onClick={() => speak(`Construye el número ${toSpanish(target)}`)}>
        <span className="g-pista-ico">🏗️</span><span><small>Construye el</small><b><Numeral n={target} /></b></span><span className="g-ear">🔊</span>
      </button>
      <div className="cons-pads">
        {places.map((p) => (
          <div key={p.k} className="cons-pad">
            <span className={`cons-icon`}><span className={p.block}>{p.k === 'm' && <i />}</span></span>
            <b className={p.cls}>{cnt[p.k]}</b>
            <small>{cnt[p.k] === 1 ? p.label : p.pl}</small>
            <div className="row gap">
              <button className="g-btn light sm" onClick={() => change(p.k, -1)}>−</button>
              <button className="g-btn sm" onClick={() => change(p.k, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cons-work"><Base10 n={built} compact /></div>
      <div className="cons-result">Construiste: <Numeral n={built} className="cons-num" /></div>
      <button className="btn btn-xl btn-gold" onClick={(e) => onAnswer(built === target, e.currentTarget)}>✅ ¡Listo!</button>
    </div>
  );
}
Construye.meta = {
  rounds: 6,
  levels: [
    { id: 'c1', label: 'Hasta 50', places: ['t', 'u'], min: 11, max: 50 },
    { id: 'c2', label: 'Hasta 99', places: ['t', 'u'], min: 11, max: 99 },
    { id: 'c2j', label: 'Hasta 200', places: ['h', 't', 'u'], min: 100, max: 199 },
    { id: 'c3', label: 'Hasta 999', places: ['h', 't', 'u'], min: 101, max: 999 },
    { id: 'c4', label: 'Hasta 9.999', places: ['m', 'h', 't', 'u'], min: 1001, max: 9999 },
  ],
};

// ---------------------------------------------------------------------------
// 6. El cocodrilo comelón (comparar números)
// ---------------------------------------------------------------------------
export function Cocodrilo({ level, onAnswer }) {
  const [st] = useState(() => {
    const a = variado(`croc${level.id}`, () => rnd(level.min || 1, level.max), (x) => x, 4);
    let b = rnd(level.min || 1, level.max);
    if (level.iguales && Math.random() < 0.2) b = a;
    while (b === a && !level.iguales) b = rnd(level.min || 1, level.max);
    return { a, b };
  });
  const [comio, setComio] = useState(null);
  useSay('El cocodrilo siempre se come el número más grande. ¿Cuál se come?');
  const correct = st.a === st.b ? 'igual' : st.a > st.b ? 'a' : 'b';
  const elegir = (k, el) => {
    if (comio) return;
    if (k === correct) { setComio(k); sfx.chest(); onAnswer(true, el); } else onAnswer(false, el);
  };
  const Card = ({ k, n }) => (
    <button className={`croc-card ${comio === k ? 'eaten' : ''}`} onClick={(e) => elegir(k, e.currentTarget)}>
      {level.dots ? <DotCard n={n} className="croc-dots" /> : null}
      <Numeral n={n} className="croc-num" />
    </button>
  );
  return (
    <div className="g-croc">
      <p className="g-title">🐊 El cocodrilo se come el número <b>más grande</b></p>
      <div className="croc-row">
        <Card k="a" n={st.a} />
        <span className={`croc ${comio === 'a' ? 'left' : comio === 'b' ? 'right' : ''}`}>🐊</span>
        <Card k="b" n={st.b} />
      </div>
      {level.iguales && <button className="g-btn blue" onClick={(e) => elegir('igual', e.currentTarget)}>⚖️ Son iguales</button>}
    </div>
  );
}
Cocodrilo.meta = {
  levels: [
    { id: 'k10', label: 'Hasta 10 (con puntos)', max: 10, dots: true },
    { id: 'k20', label: 'Hasta 20', max: 20 },
    { id: 'k50', label: 'Hasta 50', max: 50 },
    { id: 'k100', label: 'Hasta 100', max: 100 },
    { id: 'k200', label: 'Hasta 200', max: 200, iguales: true },
    { id: 'k1000', label: 'Hasta 1.000', max: 1000, min: 100, iguales: true },
    { id: 'k10000', label: 'Hasta 10.000', max: 10000, min: 1000, iguales: true },
  ],
};
