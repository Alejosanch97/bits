import { useCallback, useEffect, useRef, useState } from 'react';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { LETRAS, silabasDe } from '../data/espanol.js';
import Visual from '../components/Visual.jsx';
import { baseLetter } from '../lib/slug.js';
import { pick, shuffle } from './util.js';
import { variado } from '../lib/variedad.js';

// Letras del nivel según el grado (level.cons las trae el grado)
const letrasDe = (level) => {
  const cons = level.cons || CONSONANTES;
  return level.set === 'v' ? VOCALES : level.set === 'c' ? cons : [...VOCALES, ...cons];
};

const VOCALES = 'aeiou'.split('');
const CONSONANTES = 'mpsltndcrfbvgj'.split('');

// ---------------------------------------------------------------------------
// 21. El camino de las letras (mira cómo se escribe y repásala con el dedo)
// ---------------------------------------------------------------------------
const SIZE = 420;
const FONT = (px) => `700 ${px}px Andika, "Century Gothic", sans-serif`;

export function Camino({ level, onAnswer }) {
  const [letra] = useState(() => {
    const l = variado(`cam${level.id}`, () => pick(letrasDe(level).filter((x) => x !== 'ñ' || !level.upper)), (x) => x, 4);
    return level.upper ? l.toUpperCase() : l;
  });
  const guide = useRef(null);
  const draw = useRef(null);
  const [geo, setGeo] = useState(null);
  const [fase, setFase] = useState('mira');
  const [demo, setDemo] = useState(0);
  const drawing = useRef(false);
  const last = useRef(null);
  const fontPx = level.upper ? 330 : 400;

  // Dibujar la letra guía (punteada) cuando la fuente esté lista
  useEffect(() => {
    let alive = true;
    const paint = () => {
      if (!alive || !guide.current) return;
      const dpr = window.devicePixelRatio || 1;
      for (const c of [guide.current, draw.current]) {
        c.width = SIZE * dpr; c.height = SIZE * dpr;
        c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      const g = guide.current.getContext('2d');
      g.font = FONT(fontPx);
      const m = g.measureText(letra);
      const asc = m.actualBoundingBoxAscent;
      const desc = m.actualBoundingBoxDescent;
      const y = SIZE / 2 + (asc - desc) / 2;
      g.textAlign = 'center';
      g.fillStyle = '#F1EADB';
      g.fillText(letra, SIZE / 2, y);
      g.setLineDash([14, 10]);
      g.lineWidth = 5;
      g.strokeStyle = '#1D2A6B';
      g.strokeText(letra, SIZE / 2, y);
      setGeo({ y });
    };
    (document.fonts?.load(FONT(fontPx)) || Promise.resolve()).then(paint);
    return () => { alive = false; };
  }, [letra]);

  useEffect(() => {
    setFase('mira');
    speak(`Mira cómo se escribe la ${letra}`);
    const id = setTimeout(() => { setFase('tu'); speak('¡Ahora tú! Repasa la letra con el dedo'); }, 3200);
    return () => clearTimeout(id);
  }, [demo, letra]);

  const pos = (e) => {
    const r = draw.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SIZE, y: ((e.clientY - r.top) / r.height) * SIZE };
  };
  const down = (e) => {
    if (fase !== 'tu') return;
    drawing.current = true;
    last.current = pos(e);
    draw.current.setPointerCapture?.(e.pointerId);
    line(last.current, last.current);
  };
  const line = (a, b) => {
    const c = draw.current.getContext('2d');
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.lineWidth = 34;
    c.strokeStyle = 'rgba(232, 65, 44, .85)';
    c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
  };
  const move = (e) => {
    if (!drawing.current) return;
    const p = pos(e);
    line(last.current, p);
    last.current = p;
  };
  const up = () => { drawing.current = false; };

  const borrar = () => {
    const c = draw.current;
    c.getContext('2d').clearRect(0, 0, SIZE, SIZE);
    sfx.tap();
  };

  // Revisar: qué parte de la letra quedó cubierta por el trazo
  const revisar = useCallback((el) => {
    const dpr = window.devicePixelRatio || 1;
    const mask = document.createElement('canvas');
    mask.width = SIZE; mask.height = SIZE;
    const mc = mask.getContext('2d');
    mc.font = FONT(fontPx); mc.textAlign = 'center'; mc.fillStyle = '#000';
    mc.fillText(letra, SIZE / 2, geo?.y || SIZE * 0.7);
    const md = mc.getImageData(0, 0, SIZE, SIZE).data;
    const W = draw.current.width;
    const ud = draw.current.getContext('2d').getImageData(0, 0, W, draw.current.height).data;
    let total = 0; let cubierto = 0; let usuario = 0; let fuera = 0;
    for (let y = 0; y < SIZE; y += 5) {
      for (let x = 0; x < SIZE; x += 5) {
        const enLetra = md[(y * SIZE + x) * 4 + 3] > 100;
        const ux = Math.floor(x * dpr); const uy = Math.floor(y * dpr);
        const pintado = ud[(uy * W + ux) * 4 + 3] > 50;
        if (enLetra) { total += 1; if (pintado) cubierto += 1; }
        if (pintado) { usuario += 1; if (!enLetra) fuera += 1; }
      }
    }
    const cobertura = total ? cubierto / total : 0;
    const desorden = usuario ? fuera / usuario : 1;
    if (cobertura >= 0.55 && desorden < 0.62) {
      setFase('ok');
      onAnswer(true, el);
    } else {
      speak(cobertura < 0.55 ? 'Te faltó repasar un poquito más' : 'Intenta seguir el camino de la letra');
      onAnswer(false, el);
    }
  }, [geo, letra, onAnswer]);

  return (
    <div className="g-camino">
      <div className="camino-board">
        <canvas ref={guide} className="cam-guide" style={{ width: SIZE, height: SIZE }} />
        {fase === 'mira' && geo && (
          <svg className="cam-demo" viewBox={`0 0 ${SIZE} ${SIZE}`} key={demo}>
            <text x={SIZE / 2} y={geo.y} textAnchor="middle" style={{ font: FONT(fontPx) }} className="cam-demo-text">{letra}</text>
          </svg>
        )}
        <canvas
          ref={draw}
          className={`cam-draw ${fase === 'tu' ? 'active' : ''}`}
          style={{ width: SIZE, height: SIZE }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={up}
        />
        <span className={`ladybug ${fase}`}>🐞</span>
        {fase === 'ok' && <span className="cam-star">⭐</span>}
      </div>
      <div className="camino-side">
        <div className="cam-letter">{letra}</div>
        <p className="g-title">{fase === 'mira' ? '👀 Mira cómo se escribe…' : fase === 'tu' ? '✍️ ¡Ahora tú! Repasa la letra' : '¡Muy bien!'}</p>
        <div className="row gap wrap" style={{ justifyContent: 'center' }}>
          <button className="g-btn light" onClick={() => { borrar(); setDemo((d) => d + 1); }}>👀 Ver otra vez</button>
          <button className="g-btn light" onClick={borrar}>🧽 Borrar</button>
        </div>
        <button className="btn btn-xl btn-gold" disabled={fase !== 'tu'} onClick={(e) => revisar(e.currentTarget)}>✅ ¡Terminé!</button>
      </div>
    </div>
  );
}
Camino.meta = {
  rounds: 5,
  levels: [
    { id: 'cv', label: 'Vocales', set: 'v' },
    { id: 'cc', label: 'Consonantes', set: 'c' },
    { id: 'cu', label: 'MAYÚSCULAS', set: 't', upper: true },
  ],
};

// ---------------------------------------------------------------------------
// 22. El zoológico de los sonidos (sonido inicial)
// ---------------------------------------------------------------------------
const ANIMALES = ['🦁', '🐘', '🐼', '🦒', '🐵', '🐻', '🐯', '🦛'];
const conImgDe = (vocab) => (l) => (vocab || LETRAS.flatMap((x) => x.palabras)).filter((p) => p.emoji && !p.texto.includes(' ') && baseLetter(p.texto[0]) === l);

export function Zoologico({ level, onAnswer, onStep }) {
  const [st] = useState(() => {
    const conImg = conImgDe(level.vocab);
    const set = letrasDe(level);
    const l = variado(`zoo${level.id}`, () => pick(set.filter((x) => conImg(x).length >= 3)), (x) => x, 4);
    const buenas = shuffle(conImg(l)).slice(0, pick([1, 2, 2]));
    const malas = shuffle(set.filter((x) => x !== l).flatMap((x) => conImg(x))).filter((p) => !buenas.some((b) => b.emoji === p.emoji)).slice(0, 4 - buenas.length);
    return { l, cards: shuffle([...buenas, ...malas]), n: buenas.length, animal: pick(ANIMALES) };
  });
  const [hechas, setHechas] = useState([]);
  const [malas, setMalas] = useState([]);
  const pedir = () => speak(`¿Qué palabras empiezan con la ${st.l}?`);
  useEffect(() => { const id = setTimeout(pedir, 400); return () => clearTimeout(id); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const lleno = hechas.length === st.n;
  const tocar = (c, el) => {
    if (lleno || hechas.includes(c.texto) || malas.includes(c.texto)) return;
    speak(c.texto);
    if (baseLetter(c.texto[0]) === st.l) {
      const h = [...hechas, c.texto];
      setHechas(h);
      onStep(el);
      if (h.length === st.n) setTimeout(() => onAnswer(true, el), 600);
    } else {
      setMalas((m) => [...m, c.texto]);
      onAnswer(false, el);
    }
  };
  return (
    <div className="g-zoo">
      <div className="zoo-head">
        <button className="zoo-letter" onClick={pedir}>{st.l.toUpperCase()}{st.l}</button>
        <div className={`zoo-animal ${lleno ? 'full' : ''}`}>
          <span>{st.animal}</span>
          <small>{lleno ? '¡Ñam! ¡Gracias!' : `Dame comida que empiece con ${st.l.toUpperCase()}`}</small>
          <div className="zoo-food">{hechas.map((h) => <i key={h}>🍖</i>)}</div>
        </div>
      </div>
      <div className="zoo-cards">
        {st.cards.map((c) => (
          <button key={c.texto} className={`zoo-card ${hechas.includes(c.texto) ? 'ok' : ''} ${malas.includes(c.texto) ? 'bad' : ''}`} onClick={(e) => tocar(c, e.currentTarget)}>
            <Visual item={c} className="zoo-visual" />
            <span className="zoo-word">{c.texto}</span>
            <span className="g-ear sm">🔊</span>
          </button>
        ))}
      </div>
    </div>
  );
}
Zoologico.meta = {
  levels: [
    { id: 'zv', label: 'Vocales', set: 'v' },
    { id: 'zc', label: 'Consonantes', set: 'c' },
    { id: 'zt', label: 'Todas las letras', set: 't' },
  ],
};

// ---------------------------------------------------------------------------
// 23. Explota la letra (burbujas)
// ---------------------------------------------------------------------------
export function Burbujas({ level, onAnswer }) {
  const [st] = useState(() => {
    let items;
    const cons = (level.cons || CONSONANTES).filter((x) => silabasDe(x).length >= 5);
    if (level.silabas) {
      const c = pick(cons);
      items = shuffle([...silabasDe(c), ...silabasDe(pick(cons.filter((x) => x !== c)))]).slice(0, 7);
    } else {
      items = shuffle(letrasDe(level)).slice(0, 7);
    }
    const target = variado(`bub${level.id}`, () => pick(items), (x) => x, 3);
    const pos = items.map((_, i) => ({ left: 6 + ((i * 13.5) % 86), dur: 4 + (i % 3), delay: (i * 0.37) % 2 }));
    return { items, target, pos };
  });
  const [pop, setPop] = useState(null);
  const [malas, setMalas] = useState([]);
  const show = (x) => (level.upper ? x.toUpperCase() : x);
  const pedir = () => speak(level.silabas ? `Encuentra la sílaba ${st.target}` : `Encuentra la letra ${st.target}`);
  useEffect(() => { const id = setTimeout(pedir, 400); return () => clearTimeout(id); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="g-burbujas">
      <button className="g-pista" onClick={pedir}>
        <span className="g-pista-ico">🫧</span>
        <span><small>¡Explota la {level.silabas ? 'sílaba' : 'letra'}!</small><b className="bub-target">{show(st.target)}</b></span>
        <span className="g-ear">🔊</span>
      </button>
      <div className="bubble-sea">
        {st.items.map((x, i) => (
          <button
            key={x + i}
            className={`bubble ${pop === i ? 'pop' : ''} ${malas.includes(i) ? 'wob' : ''}`}
            style={{ left: `${st.pos[i].left}%`, animationDuration: `${st.pos[i].dur}s`, animationDelay: `${st.pos[i].delay}s` }}
            onClick={(e) => {
              if (pop !== null) return;
              if (x === st.target) { setPop(i); sfx.pop(); onAnswer(true, e.currentTarget); } else { setMalas((m) => [...m, i]); onAnswer(false, e.currentTarget); }
            }}
          >
            {show(x)}
          </button>
        ))}
      </div>
    </div>
  );
}
Burbujas.meta = {
  levels: [
    { id: 'bv', label: 'Vocales', set: 'v' },
    { id: 'bc', label: 'Consonantes', set: 'c' },
    { id: 'bu', label: 'MAYÚSCULAS', set: 't', upper: true },
    { id: 'bs', label: 'Sílabas (ma, me, mi…)', silabas: true },
  ],
};
