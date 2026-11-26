import { useEffect, useRef, useState } from 'react';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { PALABRAS_CON_IMAGEN, LETRAS } from '../data/espanol.js';
import { ENGLISH } from '../data/english.js';
import Visual, { Word } from '../components/Visual.jsx';
import { baseLetter } from '../lib/slug.js';
import { pick, shuffle } from './util.js';
import { variado } from '../lib/variedad.js';
import { useStore } from '../lib/store.jsx';

const EN_POOL = ENGLISH.flatMap((c) => c.items).filter((i) => i.emoji);
const ES_SIMPLE = PALABRAS_CON_IMAGEN.filter((p) => !p.texto.includes(' ') && p.texto.length <= 9);
const poolDe = (level) => (level.lang === 'en' ? EN_POOL : (level.vocab || ES_SIMPLE).filter((p) => !p.texto.includes(' ')));

// Escoge n palabras distintas (texto e imagen distintos)
function escoger(pool, n, extra = () => true) {
  const out = [];
  const textos = new Set();
  const emojis = new Set();
  for (const p of shuffle(pool)) {
    if (out.length >= n) break;
    if (textos.has(p.texto) || emojis.has(p.emoji) || !extra(p)) continue;
    textos.add(p.texto); emojis.add(p.emoji); out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------------------
// 17. Palabras relámpago
// ---------------------------------------------------------------------------
export function Relampago({ level, onAnswer }) {
  const { settings } = useStore();
  const ms = level.ms || 1500;
  const [st] = useState(() => {
    const ops = variado(`rel${level.id}`, () => escoger(poolDe(level), level.n || 3), (o) => o.map((x) => x.texto).sort().join(), 3);
    return { ops, target: pick(ops) };
  });
  const [fase, setFase] = useState('listos');
  const [ok, setOk] = useState(false);
  const [vez, setVez] = useState(0);

  useEffect(() => {
    setFase('listos');
    const a = setTimeout(() => { setFase('flash'); sfx.whoosh(); }, 900);
    const b = setTimeout(() => setFase('elegir'), 900 + ms);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [vez, ms]);

  return (
    <div className="g-relampago">
      {fase === 'listos' && <div className="flash-ready">⚡ ¡Atentos!</div>}
      {fase === 'flash' && <div className="flash-card"><Word text={st.target.texto} upper={settings.upper} className="flash-word" /></div>}
      {fase === 'elegir' && (
        <>
          <p className="g-title">¿Qué palabra viste? Toca la imagen</p>
          <div className={`g-pics n${st.ops.length}`}>
            {st.ops.map((o) => (
              <button key={o.texto} className={`pic-opt ${ok && o === st.target ? 'right' : ''}`} disabled={ok} onClick={(e) => {
                const r = o === st.target;
                if (r) { setOk(true); speak(o.texto, level.lang || 'es'); }
                onAnswer(r, e.currentTarget);
              }}>
                <Visual item={o} className="pic-visual" />
                {ok && <small>{o.texto}</small>}
              </button>
            ))}
          </div>
          {!ok && <button className="g-btn light" onClick={() => setVez((v) => v + 1)}>👀 Ver otra vez</button>}
        </>
      )}
    </div>
  );
}
Relampago.meta = {
  levels: [
    { id: 'f1', label: 'Lento (2 segundos)', ms: 2000, n: 3 },
    { id: 'f2', label: 'Rápido (1,2 segundos)', ms: 1200, n: 3 },
    { id: 'f3', label: 'Relámpago (0,7 s · 4 imágenes)', ms: 700, n: 4 },
    { id: 'fen', label: 'English (1,5 s)', ms: 1500, n: 3, lang: 'en', icon: '🇺🇸' },
  ],
};

// ---------------------------------------------------------------------------
// 18. Parejas mágicas (memoria palabra ↔ imagen)
// ---------------------------------------------------------------------------
export function Parejas({ level, onAnswer, onStep }) {
  const { settings } = useStore();
  const n = level.n || 4;
  const [cards] = useState(() => {
    const ws = escoger(poolDe(level), n);
    return shuffle(ws.flatMap((w, i) => [{ id: `w${i}`, par: i, tipo: 'palabra', w }, { id: `i${i}`, par: i, tipo: 'imagen', w }]));
  });
  const [abiertas, setAbiertas] = useState([]);
  const [hechas, setHechas] = useState([]);
  const lock = useRef(false);
  const boardRef = useRef(null);
  useEffect(() => { const id = setTimeout(() => speak('Encuentra las parejas: cada palabra con su imagen'), 400); return () => clearTimeout(id); }, []);

  const voltear = (c, el) => {
    if (lock.current || abiertas.includes(c.id) || hechas.includes(c.par)) return;
    sfx.tap();
    const nuevas = [...abiertas, c.id];
    setAbiertas(nuevas);
    if (c.tipo === 'palabra') speak(c.w.texto, level.lang || 'es');
    if (nuevas.length === 2) {
      const [a, b] = nuevas.map((id) => cards.find((x) => x.id === id));
      lock.current = true;
      if (a.par === b.par && a.tipo !== b.tipo) {
        setTimeout(() => {
          const h = [...hechas, a.par];
          setHechas(h); setAbiertas([]); lock.current = false;
          onStep(el);
          if (h.length === n) onAnswer(true, boardRef.current);
        }, 450);
      } else {
        setTimeout(() => { setAbiertas([]); lock.current = false; sfx.wrong(); }, 1000);
      }
    }
  };

  return (
    <div className="g-parejas">
      <p className="g-title">🃏 Parejas encontradas: <b>{hechas.length}</b> de {n}</p>
      <div className={`memo-board n${n}`} ref={boardRef}>
        {cards.map((c, i) => {
          const visible = abiertas.includes(c.id) || hechas.includes(c.par);
          return (
            <button key={c.id} className={`memo ${visible ? 'up' : ''} ${hechas.includes(c.par) ? 'match' : ''}`} style={{ animationDelay: `${i * 40}ms` }} onClick={(e) => voltear(c, e.currentTarget)}>
              <span className="memo-inner">
                <span className="memo-face memo-back">★</span>
                <span className="memo-face memo-front">
                  {c.tipo === 'imagen' ? <Visual item={c.w} className="memo-visual" /> : <Word text={c.w.texto} upper={settings.upper} className="memo-word" />}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
Parejas.meta = {
  rounds: 3,
  pause: 1800,
  levels: [
    { id: 'pj4', label: '4 parejas', n: 4 },
    { id: 'pj6', label: '6 parejas', n: 6 },
    { id: 'pj8', label: '8 parejas', n: 8 },
    { id: 'pjen', label: 'English (6 parejas)', n: 6, lang: 'en', icon: '🇺🇸' },
  ],
};

// ---------------------------------------------------------------------------
// 19. El detective de las palabras
// ---------------------------------------------------------------------------
const ALL_WORDS = LETRAS.flatMap((l) => l.palabras).filter((p) => !p.texto.includes(' ') && p.texto.length <= 9);
export function Detective({ level, onAnswer }) {
  const { settings } = useStore();
  const n = level.n || 8;
  const [st] = useState(() => {
    const target = variado(`det${level.id}`, () => pick(poolDe(level)), (x) => x.texto, 6);
    const base = level.lang === 'en' ? EN_POOL : (level.vocabTodo || ALL_WORDS).filter((p) => !p.texto.includes(' ') && p.texto.length <= 10);
    const ini = baseLetter(target.texto[0]);
    // distractores que se parecen: empiezan con la misma letra
    const parecidas = shuffle(base.filter((p) => p.texto !== target.texto && baseLetter(p.texto[0]) === ini));
    const otras = shuffle(base.filter((p) => p.texto !== target.texto));
    const set = new Map();
    for (const p of [...parecidas.slice(0, Math.floor((n - 1) * 0.6)), ...otras]) {
      if (set.size >= n - 1) break;
      set.set(p.texto, p);
    }
    return { target, words: shuffle([target, ...set.values()]) };
  });
  const [ok, setOk] = useState(false);
  const [malas, setMalas] = useState([]);
  const lang = level.lang || 'es';
  useEffect(() => { const id = setTimeout(() => speak(`${lang === 'en' ? 'Find' : 'Encuentra'} ${st.target.texto}`, lang), 400); return () => clearTimeout(id); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="g-detective">
      <button className="mission" onClick={() => speak(st.target.texto, lang)}>
        <span className="mission-ico">🕵️</span>
        <span><small>Misión: encuentra la palabra</small><Word text={st.target.texto} upper={settings.upper} className="mission-word" /></span>
        <span className="g-ear">🔊</span>
      </button>
      <div className={`word-wall n${n}`}>
        {st.words.map((w, i) => (
          <button key={w.texto} className={`wall-word ${ok && w === st.target ? 'found' : ''} ${malas.includes(w.texto) ? 'bad' : ''}`} style={{ '--r': `${(i * 37) % 7 - 3}deg`, animationDelay: `${i * 40}ms` }}
            disabled={ok}
            onClick={(e) => {
              const r = w === st.target;
              if (r) setOk(true); else setMalas((m) => [...m, w.texto]);
              onAnswer(r, e.currentTarget);
            }}>
            <Word text={w.texto} upper={settings.upper} className="wall-w" />
            {ok && w === st.target && <span className="clue">🔍 {st.target.emoji}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
Detective.meta = {
  levels: [
    { id: 'd8', label: '8 palabras', n: 8 },
    { id: 'd12', label: '12 palabras', n: 12 },
    { id: 'd16', label: '16 palabras', n: 16 },
    { id: 'den', label: 'English (10)', n: 10, lang: 'en', icon: '🇺🇸' },
  ],
};

// ---------------------------------------------------------------------------
// 20. Construye la palabra
// ---------------------------------------------------------------------------
export function ConstruyePalabra({ level, onAnswer, onStep }) {
  const { settings } = useStore();
  const [st] = useState(() => {
    const pool = poolDe(level).filter((p) => p.texto.length >= level.min && p.texto.length <= level.max && !/[A-Z]/.test(p.texto[0]));
    const w = variado(`cpal${level.id}`, () => pick(pool.length ? pool : ES_SIMPLE), (x) => x.texto, 6);
    const letras = [...w.texto];
    const extra = level.extra ? shuffle([...'aeioumpslt']).filter((x) => !letras.includes(x)).slice(0, level.extra) : [];
    return { w, letras, tiles: shuffle([...letras, ...extra].map((ch, i) => ({ ch, id: i }))) };
  });
  const [puestas, setPuestas] = useState([]); // ids de fichas usadas
  const [ok, setOk] = useState(false);
  useEffect(() => { const id = setTimeout(() => speak(`Forma la palabra ${st.w.texto}`), 400); return () => clearTimeout(id); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const formadas = puestas.map((id) => st.tiles.find((t) => t.id === id).ch);
  const show = (ch, i) => (i === 0 ? ch.toUpperCase() : settings.upper ? ch.toUpperCase() : ch);

  const poner = (t, el) => {
    if (ok || puestas.includes(t.id)) return;
    const need = st.letras[formadas.length];
    if (baseLetter(t.ch) === baseLetter(need) && t.ch === need) {
      const np = [...puestas, t.id];
      setPuestas(np);
      onStep(el);
      speak(t.ch);
      if (np.length === st.letras.length) { setOk(true); setTimeout(() => speak(st.w.texto), 300); onAnswer(true, el); }
    } else onAnswer(false, el);
  };

  return (
    <div className="g-cpal">
      <button className="cpal-pic" onClick={() => speak(st.w.texto)}><Visual item={st.w} className="cpal-visual" /><span className="g-ear">🔊</span></button>
      <div className="slots">
        {st.letras.map((ch, i) => (
          <span key={i} className={`slot ${i < formadas.length ? 'filled' : ''} ${i === formadas.length && !ok ? 'next' : ''} ${i === 0 ? 'first' : ''}`}>
            {i < formadas.length ? show(formadas[i], i) : ''}
          </span>
        ))}
      </div>
      <div className="tiles">
        {st.tiles.map((t) => (
          <button key={t.id} className={`tile ${puestas.includes(t.id) ? 'used' : ''}`} onClick={(e) => poner(t, e.currentTarget)}>
            {settings.upper ? t.ch.toUpperCase() : t.ch}
          </button>
        ))}
      </div>
    </div>
  );
}
ConstruyePalabra.meta = {
  rounds: 6,
  levels: [
    { id: 'cp1', label: 'Palabras cortas (3–4 letras)', min: 3, max: 4 },
    { id: 'cp2', label: 'Medianas (5–6 letras)', min: 5, max: 6 },
    { id: 'cp3', label: 'Largas + letras trampa', min: 6, max: 9, extra: 2 },
  ],
};

