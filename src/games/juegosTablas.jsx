import { useEffect, useRef, useState } from 'react';
import { toSpanish } from '../lib/numbers.js';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { Numeral } from '../components/Numbers.jsx';
import { rnd, shuffle, opciones } from './util.js';
import { variado } from '../lib/variedad.js';

const useSay = (text, deps = []) => {
  useEffect(() => {
    const id = setTimeout(() => speak(text), 450);
    return () => clearTimeout(id);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

export const TABLE_LEVELS = Array.from({ length: 9 }, (_, i) => ({ id: `t${i + 1}`, label: `Tabla del ${i + 1}`, t: i + 1, icon: `${i + 1}️⃣` }));
const TABLE_LEVELS_MIX = [...TABLE_LEVELS, { id: 'tmix', label: 'Todas mezcladas', mix: true, icon: '🎲' }];
const tablaDe = (level) => (level.mix ? rnd(2, 9) : level.t);

// Notas musicales para el piano y las ranas
let actx = null;
function nota(freq, dur = 0.35, type = 'triangle', vol = 0.2) {
  try {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.connect(g).connect(actx.destination);
    o.start();
    o.stop(actx.currentTime + dur + 0.05);
  } catch { /* sin audio */ }
}
const ESCALA = [262, 294, 330, 349, 392, 440, 494, 523, 587, 659];

// ---------------------------------------------------------------------------
// 13. Las ranas saltarinas
// ---------------------------------------------------------------------------
export function Ranas({ level, round, onAnswer }) {
  const t = level.t;
  const pos = round; // la rana está en t × round
  const [st] = useState(() => ({ ops: opciones(t * (pos + 1), 3, { step: 1, spread: Math.max(2, t), min: 1, max: t * 10 + t }) }));
  const [salto, setSalto] = useState(false);
  useSay(round === 0 ? `Salta de ${toSpanish(t)} en ${toSpanish(t)}. ¿A qué número salta la rana?` : '¿Y ahora?');
  const at = pos + (salto ? 1 : 0);
  return (
    <div className="g-ranas">
      <p className="g-title">🐸 Salta de <b>{t}</b> en <b>{t}</b></p>
      <div className="lily-row">
        {Array.from({ length: 11 }, (_, i) => (
          <span key={i} className={`lily ${i < at ? 'past' : ''} ${i === at ? 'here' : ''}`}>
            <b>{i <= at ? t * i : '?'}</b>
            {i === at && <span className={`frog ${salto ? 'landed' : ''}`}>🐸</span>}
          </span>
        ))}
      </div>
      <p className="g-sub">{pos > 0 ? `${t} × ${pos} = ${t * pos}` : 'La rana empieza en 0'}</p>
      <div className="g-options">
        {st.ops.map((v) => (
          <button key={v} className="g-opt lily-opt" disabled={salto} onClick={(e) => {
            const ok = v === t * (pos + 1);
            if (ok) { setSalto(true); nota(ESCALA[pos % 10]); speak(toSpanish(v)); }
            onAnswer(ok, e.currentTarget);
          }}>{v}</button>
        ))}
      </div>
    </div>
  );
}
Ranas.meta = { rounds: 10, pause: 1200, levels: TABLE_LEVELS };

// ---------------------------------------------------------------------------
// 14. Fábrica de grupos
// ---------------------------------------------------------------------------
export function Grupos({ level, onAnswer, onStep }) {
  const [st] = useState(() => {
    return variado(`gru${level.id}`, () => ({ n: rnd(2, level.nmax || 5), g: rnd(2, level.gmax || 4) }), (y) => y.n * y.g, 4);
  });
  const [cajas, setCajas] = useState(() => Array(st.g).fill(0));
  const [ok, setOk] = useState(false);
  useSay(`Necesitamos ${toSpanish(st.g)} grupos de ${toSpanish(st.n)} globos`);
  const tocar = (i, el, d = 1) => {
    if (ok) return;
    setCajas((c) => c.map((x, k) => (k === i ? Math.max(0, Math.min(12, x + d)) : x)));
    if (d > 0) onStep(el); else sfx.tap();
  };
  const revisar = (el) => {
    if (cajas.every((x) => x === st.n)) {
      setOk(true);
      speak(`${toSpanish(st.g)} grupos de ${toSpanish(st.n)}, son ${toSpanish(st.g * st.n)}`);
      onAnswer(true, el);
    } else {
      speak('Revisa: cada grupo debe tener la misma cantidad');
      onAnswer(false, el);
    }
  };
  return (
    <div className="g-grupos">
      <p className="g-title">🏭 Necesitamos <b>{st.g} grupos</b> de <b>{st.n} globos</b></p>
      <div className="factory">
        {cajas.map((c, i) => (
          <div key={i} className={`fbox ${c === st.n ? 'full' : c > st.n ? 'over' : ''}`}>
            <button className="fbox-add" onClick={(e) => tocar(i, e.currentTarget)}>
              <div className="fbox-items">{Array.from({ length: c }, (_, k) => <span key={k}>🎈</span>)}</div>
              <b>{c}</b>
            </button>
            <button className="fbox-minus" onClick={(e) => tocar(i, e.currentTarget, -1)}>−</button>
          </div>
        ))}
      </div>
      {ok ? (
        <div className="g-result">
          <p className="mulx-sum">{Array(st.g).fill(st.n).join(' + ')} = <b>{st.g * st.n}</b></p>
          <div className="mulx-eq small"><Numeral n={st.n} /> <span className="op-sign mul">×</span> <Numeral n={st.g} /> <span className="op-sign eq">=</span> <Numeral n={st.g * st.n} /></div>
        </div>
      ) : <button className="btn btn-xl btn-gold" onClick={(e) => revisar(e.currentTarget)}>✅ ¡Revisar grupos!</button>}
    </div>
  );
}
Grupos.meta = {
  rounds: 6,
  pause: 2800,
  levels: [
    { id: 'g1', label: 'Grupos pequeños', gmax: 3, nmax: 4, mix: true },
    { id: 'g2', label: 'Grupos medianos', gmax: 4, nmax: 6, mix: true },
    { id: 'g3', label: 'Grupos grandes', gmax: 5, nmax: 9, mix: true },
  ],
};

// ---------------------------------------------------------------------------
// 15. La heladería multiplicadora
// ---------------------------------------------------------------------------
export function Heladeria({ level, onAnswer }) {
  const [st] = useState(() => {
    const { h, p } = variado(`hel${level.id}`, () => ({ h: tablaDe(level), p: rnd(2, level.mix ? 5 : 6) }), (y) => y.h * y.p, 4);
    return { p, h, ops: opciones(p * h, 3, { step: Math.max(1, Math.round(h / 2)), spread: 3, min: 1, max: 100 }) };
  });
  const [ok, setOk] = useState(false);
  useSay(`Hay ${toSpanish(st.p)} pingüinos. Cada uno quiere ${toSpanish(st.h)} helados. ¿Cuántos helados necesitamos?`);
  return (
    <div className="g-helados">
      <p className="g-title">🐧 <b>{st.p}</b> pingüinos · cada uno quiere <b>{st.h}</b> 🍦</p>
      <div className="penguins">
        {Array.from({ length: st.p }, (_, i) => (
          <div key={i} className="peng" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="peng-cones">{Array.from({ length: st.h }, (_, k) => <span key={k}>🍦</span>)}</div>
            <span className="peng-ico">🐧</span>
          </div>
        ))}
      </div>
      {ok && <div className="mulx-eq small"><Numeral n={st.h} /> <span className="op-sign mul">×</span> <Numeral n={st.p} /> <span className="op-sign eq">=</span> <Numeral n={st.p * st.h} /></div>}
      <p className="g-sub">¿Cuántos helados en total?</p>
      <div className="g-options">
        {st.ops.map((v) => (
          <button key={v} className="g-opt" disabled={ok} onClick={(e) => { const r = v === st.p * st.h; if (r) setOk(true); onAnswer(r, e.currentTarget); }}>{v}</button>
        ))}
      </div>
    </div>
  );
}
Heladeria.meta = { rounds: 6, pause: 2200, levels: TABLE_LEVELS_MIX };

// ---------------------------------------------------------------------------
// 16. El piano de las tablas
// ---------------------------------------------------------------------------
export function Piano({ level, round, onAnswer }) {
  const t = level.t;
  const [orden] = useState(() => shuffle(Array.from({ length: 10 }, (_, i) => i + 1)));
  const i = orden[round % 10];
  const [lit, setLit] = useState(null);
  const [ok, setOk] = useState(false);
  const playing = useRef(false);
  useSay(`${toSpanish(t)} por ${toSpanish(i)}`);

  const escuchar = async () => {
    if (playing.current) return;
    playing.current = true;
    for (let k = 1; k <= 10; k++) {
      setLit(k);
      nota(ESCALA[k - 1], 0.3);
      await new Promise((r) => setTimeout(r, 420));
    }
    setLit(null);
    playing.current = false;
  };

  return (
    <div className="g-piano">
      <div className="piano-q">
        <span className="q-pill"><Numeral n={t} /> <span className="op-sign mul">×</span> <Numeral n={i} /> <span className="op-sign eq">=</span> <span className="q-box">{ok ? <Numeral n={t * i} /> : '?'}</span></span>
        <button className="g-btn blue" onClick={escuchar}>🎵 Escuchar la tabla</button>
      </div>
      <div className="piano">
        {Array.from({ length: 10 }, (_, k) => k + 1).map((k) => (
          <button
            key={k}
            className={`pkey ${lit === k ? 'lit' : ''} ${ok && k === i ? 'right' : ''}`}
            onClick={(e) => {
              if (ok) return;
              const r = k === i;
              nota(ESCALA[k - 1], 0.4, r ? 'triangle' : 'sawtooth', r ? 0.22 : 0.08);
              if (r) {
                setOk(true);
                [0, 2, 4, 7].forEach((n, x) => setTimeout(() => nota(ESCALA[n], 0.25), 200 + x * 130));
              }
              onAnswer(r, e.currentTarget);
            }}
          >
            <b>{t * k}</b>
          </button>
        ))}
      </div>
    </div>
  );
}
Piano.meta = { rounds: 8, levels: TABLE_LEVELS };

