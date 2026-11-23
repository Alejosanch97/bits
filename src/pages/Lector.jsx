import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../lib/store.jsx';
import { speak, stopSpeech } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { bigCelebration } from '../lib/fx.js';
import Chispa from '../components/Chispa.jsx';

// =====================================================================
//  LECTOR COHETE — teleprompter de lectura rápida
//  La profe pega un texto, escoge tamaño y velocidad, y cada palabra se va
//  coloreando mientras corre el cronómetro.
// =====================================================================

const KEY = 'crear-lector-v1';

const EJEMPLOS = [
  { id: 'ej1', titulo: 'Mi mamá', texto: 'Mi mamá me mima.\nMi mamá me ama.\nYo amo a mi mamá.\nMamá me da un beso.' },
  { id: 'ej2', titulo: 'El sapo Pepe', texto: 'Pepe es un sapo verde.\nPepe salta en el lago.\nEl sapo come una mosca.\n¡Qué rico, dice Pepe!' },
  { id: 'ej3', titulo: 'La luna', texto: 'La luna sale de noche.\nLa luna es blanca y bonita.\nLas estrellas juegan con la luna.\nBuenas noches, luna.' },
  { id: 'ej4', titulo: 'Mi colegio', texto: 'Mi colegio se llama CREAR.\nEn mi colegio tengo muchos amigos.\nMi profe me enseña a leer.\nMe gusta jugar en el recreo.' },
  { id: 'ej5', titulo: 'My cat (English)', texto: 'I have a cat.\nMy cat is black.\nMy cat likes milk.\nI love my cat!', lang: 'en' },
];

const VELOCIDADES = [
  { label: 'Tortuga', icon: '🐢', ppm: 30 },
  { label: 'Conejo', icon: '🐇', ppm: 60 },
  { label: 'Cohete', icon: '🚀', ppm: 100 },
];

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    return { textos: [], tamano: 72, ppm: 45, modo: 'auto', voz: false, ...(d || {}) };
  } catch {
    return { textos: [], tamano: 72, ppm: 45, modo: 'auto', voz: false };
  }
}

function tokenizar(texto) {
  const parrafos = texto.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const palabras = [];
  parrafos.forEach((p, pi) => p.split(/\s+/).filter(Boolean).forEach((w) => palabras.push({ w, p: pi })));
  return { parrafos: parrafos.length, palabras };
}

const fmt = (ms) => {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}.${Math.floor((ms % 1000) / 100)}`;
};

// ---------------------------------------------------------------------
// Pantalla de lectura (pantalla completa)
// ---------------------------------------------------------------------
function Lectura({ texto, titulo, lang = 'es', cfg, setCfg, onClose }) {
  const { addCoins, settings } = useStore();
  const { palabras } = useMemo(() => tokenizar(texto), [texto]);
  const [idx, setIdx] = useState(-1); // -1 = aún no empieza
  const [playing, setPlaying] = useState(false);
  const [cuenta, setCuenta] = useState(cfg.modo === 'auto' ? 3 : 0);
  const [ms, setMs] = useState(0);
  const [fin, setFin] = useState(false);
  const [cobrado, setCobrado] = useState(false);
  const startRef = useRef(0);
  const accRef = useRef(0);
  const wordRefs = useRef([]);
  const lastTop = useRef(-1);
  const claimRef = useRef(null);

  // Cuenta regresiva 3, 2, 1 ¡despegue!
  useEffect(() => {
    if (cuenta <= 0) return undefined;
    sfx.tap();
    const id = setTimeout(() => {
      if (cuenta === 1) { sfx.whoosh(); setPlaying(true); setIdx(0); }
      setCuenta((c) => c - 1);
    }, 800);
    return () => clearTimeout(id);
  }, [cuenta]);

  // Cronómetro
  useEffect(() => {
    if (!playing || fin) return undefined;
    startRef.current = performance.now();
    const id = setInterval(() => setMs(accRef.current + performance.now() - startRef.current), 100);
    return () => {
      clearInterval(id);
      accRef.current += performance.now() - startRef.current;
    };
  }, [playing, fin]);

  const terminar = useCallback(() => {
    setPlaying(false);
    setFin(true);
    sfx.fanfare();
    bigCelebration();
  }, []);

  const avanzar = useCallback(() => {
    setIdx((i) => {
      const n = i + 1;
      if (n >= palabras.length) { terminar(); return i; }
      return n;
    });
  }, [palabras.length, terminar]);

  // Avance automático según palabras por minuto (las pausas de puntuación duran un poco más)
  useEffect(() => {
    if (cfg.modo !== 'auto' || !playing || fin || idx < 0) return undefined;
    const w = palabras[idx]?.w || '';
    const base = 60000 / cfg.ppm;
    const pausa = /[.!?¡¿]$/.test(w) ? 1.7 : /[,;:]$/.test(w) ? 1.3 : 1;
    const id = setTimeout(avanzar, base * pausa);
    return () => clearTimeout(id);
  }, [idx, playing, fin, cfg.modo, cfg.ppm, palabras, avanzar]);

  // Voz opcional, palabra por palabra
  useEffect(() => {
    if (idx >= 0 && cfg.voz && palabras[idx]) speak(palabras[idx].w.replace(/[^\p{L}\p{N}']/gu, ''), lang, { rate: Math.min(1.3, 0.7 + cfg.ppm / 200) });
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mantener la palabra actual centrada (solo cuando cambia de línea)
  useEffect(() => {
    const el = wordRefs.current[idx];
    if (!el) return;
    if (el.offsetTop !== lastTop.current) {
      lastTop.current = el.offsetTop;
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [idx]);

  const manualPaso = () => {
    if (fin) return;
    if (cfg.modo === 'manual') {
      if (!playing) setPlaying(true);
      if (idx < 0) setIdx(0); else avanzar();
    } else if (cuenta <= 0) {
      setPlaying((p) => !p);
    }
  };

  const reiniciar = () => {
    lastTop.current = -1;
    // el cronómetro se pone en cero después de que se detiene
    setTimeout(() => { accRef.current = 0; setMs(0); }, 0);
    setIdx(-1); setFin(false); setPlaying(false); setCobrado(false);
    setCuenta(cfg.modo === 'auto' ? 3 : 0);
    wordRefs.current[0]?.scrollIntoView({ block: 'center' });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); manualPaso(); }
      else if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => () => stopSpeech(), []);

  const ppmReal = ms > 1500 && idx > 0 ? Math.round(((idx + 1) / ms) * 60000) : 0;
  const prog = palabras.length ? ((fin ? palabras.length : Math.max(0, idx)) / palabras.length) * 100 : 0;
  const estrellas = ppmReal >= 80 ? 3 : ppmReal >= 40 ? 2 : 1;
  const show = (w) => (settings.upper ? w.toUpperCase() : w);

  let pAnterior = 0;
  return createPortal(
    <div className="lector">
      <div className="lector-top">
        <span className="player-title">🚀 {titulo}</span>
        <div className="lector-stats">
          <span className="crono">⏱️ {fmt(ms)}</span>
          <span className="ppm">{ppmReal || '—'} <small>pal/min</small></span>
          <span className="cnt">{Math.max(0, fin ? palabras.length : idx + 1)}/{palabras.length}</span>
        </div>
        <button className="player-x" onClick={onClose} aria-label="Cerrar">✕</button>
      </div>
      <div className="lector-progress"><i style={{ width: `${prog}%` }} /><span className="rocket" style={{ left: `${prog}%` }}>🚀</span></div>

      <div className="lector-text" style={{ fontSize: `${cfg.tamano}px` }} onClick={manualPaso}>
        <div className="lector-inner">
          {palabras.map((pw, i) => {
            const salto = pw.p !== pAnterior;
            pAnterior = pw.p;
            const st = i < idx || fin ? 'done' : i === idx ? 'now' : 'next';
            return (
              <span key={i} className="lw-wrap">
                {salto && <span className="lector-br" />}
                <span ref={(el) => { wordRefs.current[i] = el; }} className={`lw ${st}`}>{show(pw.w)}</span>{' '}
              </span>
            );
          })}
        </div>
      </div>

      {cuenta > 0 && (
        <div className="lector-count" key={cuenta}>
          <span>{cuenta}</span>
        </div>
      )}

      {fin && (
        <div className="lector-fin">
          <div className="lector-fin-card">
            <Chispa size={130} mood="wow" message="¡Leíste como un cohete!" />
            <div className="stars-row">
              {[0, 1, 2].map((i) => <span key={i} className={`big-star ${i < estrellas ? 'on' : ''}`} style={{ animationDelay: `${i * 0.25}s` }}>★</span>)}
            </div>
            <div className="fin-stats">
              <div><b>{fmt(ms)}</b><small>tiempo</small></div>
              <div><b>{palabras.length}</b><small>palabras</small></div>
              <div><b>{ppmReal}</b><small>palabras por minuto</small></div>
            </div>
            {!cobrado
              ? <button ref={claimRef} className="btn btn-gold btn-xl pulse" onClick={() => { setCobrado(true); addCoins(3, claimRef.current); }}>Recoger 3 ★</button>
              : <p className="done-msg">¡Monedas guardadas!</p>}
            <div className="row gap">
              <button className="btn btn-blue" onClick={reiniciar}>↻ Leer otra vez</button>
              <button className="btn btn-white" onClick={onClose}>Terminar</button>
            </div>
          </div>
        </div>
      )}

      {!fin && (
        <div className="player-controls">
          <button className="ctl" onClick={reiniciar} title="Reiniciar">⏮</button>
          <button className="ctl" onClick={() => setIdx((i) => Math.max(0, i - 1))} title="Palabra anterior">◀</button>
          <button className="ctl ctl-main" onClick={manualPaso} title={cfg.modo === 'manual' ? 'Siguiente palabra' : 'Pausa'}>
            {cfg.modo === 'manual' ? '👆' : playing ? '❚❚' : '▶'}
          </button>
          <button className="ctl" onClick={avanzar} title="Palabra siguiente">▶</button>
          <span className="ctl-sep" />
          {cfg.modo === 'auto' && (
            <>
              <button className="chip" onClick={() => setCfg({ ppm: Math.max(10, cfg.ppm - 10) })}>🐢 −</button>
              <span className="chip on">{cfg.ppm} pal/min</span>
              <button className="chip" onClick={() => setCfg({ ppm: Math.min(240, cfg.ppm + 10) })}>🚀 +</button>
            </>
          )}
          <button className="chip" onClick={() => setCfg({ tamano: Math.max(28, cfg.tamano - 8) })}>A−</button>
          <button className="chip" onClick={() => setCfg({ tamano: Math.min(180, cfg.tamano + 8) })}>A+</button>
          <button className={`chip ${cfg.voz ? 'on' : ''}`} onClick={() => setCfg({ voz: !cfg.voz })}>🗣️ Voz</button>
        </div>
      )}
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------
// Página: escribir / escoger texto y ajustes
// ---------------------------------------------------------------------
export default function Lector() {
  const [st, setSt] = useState(load);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState(EJEMPLOS[0].texto);
  const [lang, setLang] = useState('es');
  const [leyendo, setLeyendo] = useState(false);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* lleno */ } }, [st]);
  const setCfg = (patch) => setSt((s) => ({ ...s, ...patch }));

  const nPal = useMemo(() => tokenizar(texto).palabras.length, [texto]);
  const segundos = Math.round((nPal / st.ppm) * 60);

  const guardar = () => {
    if (!texto.trim()) return;
    const t = titulo.trim() || texto.trim().split(/\s+/).slice(0, 3).join(' ');
    setSt((s) => ({ ...s, textos: [{ id: Date.now().toString(36), titulo: t, texto, lang }, ...s.textos.filter((x) => x.titulo !== t)] }));
    sfx.correct();
  };
  const cargar = (x) => { sfx.tap(); setTitulo(x.titulo); setTexto(x.texto); setLang(x.lang || 'es'); };
  const borrar = (id) => setSt((s) => ({ ...s, textos: s.textos.filter((x) => x.id !== id) }));

  return (
    <div className="page page-lector">
      <section className="world-header wh-lector">
        <div>
          <h1>Lector Cohete</h1>
          <p>Teleprompter de lectura rápida: escribe un texto, escoge el tamaño y la velocidad, y cada palabra se ilumina mientras corre el cronómetro.</p>
        </div>
        <Chispa size={130} message="¡3, 2, 1… a leer!" />
      </section>

      <div className="lector-setup">
        <section className="panel">
          <h2>✏️ Texto para leer</h2>
          <div className="two-cols">
            <label className="field">Título
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: El sapo Pepe" />
            </label>
            <div className="field">Idioma
              <div className="seg" style={{ marginTop: 0 }}>
                <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}>Español</button>
                <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
              </div>
            </div>
          </div>
          <label className="field">Escribe o pega el texto (cada renglón es una línea nueva)
            <textarea className="lector-area" value={texto} onChange={(e) => setTexto(e.target.value)} rows={8} placeholder="Escribe aquí las palabras o el cuento…" />
          </label>
          <p className="muted small">{nPal} palabras · a {st.ppm} palabras por minuto dura unos {segundos} segundos</p>
          <div className="row gap wrap">
            <button className="btn btn-xl btn-accent" style={{ '--accent': '#E8412C' }} disabled={!nPal} onClick={() => { sfx.pop(); setLeyendo(true); }}>🚀 ¡Despegar!</button>
            <button className="btn btn-gold" onClick={guardar} disabled={!nPal}>💾 Guardar texto</button>
            <button className="btn btn-white" onClick={() => { setTexto(''); setTitulo(''); }}>🧽 Borrar</button>
          </div>
        </section>

        <section className="panel">
          <h2>⚙️ Ajustes</h2>
          <label className="field">Tamaño de letra: <b>{st.tamano}px</b>
            <input type="range" min="28" max="180" step="4" value={st.tamano} onChange={(e) => setCfg({ tamano: Number(e.target.value) })} />
          </label>
          <div className="lector-sample" style={{ fontSize: `${Math.min(st.tamano, 90)}px` }}><span className="lw done">Mi</span> <span className="lw now">mamá</span> <span className="lw next">me</span></div>
          <div className="field">Modo
            <div className="seg" style={{ marginTop: 0 }}>
              <button className={st.modo === 'auto' ? 'on' : ''} onClick={() => setCfg({ modo: 'auto' })}>⏩ Automático</button>
              <button className={st.modo === 'manual' ? 'on' : ''} onClick={() => setCfg({ modo: 'manual' })}>👆 Clic a clic</button>
            </div>
            <small className="muted">{st.modo === 'auto' ? 'Las palabras avanzan solas a la velocidad elegida.' : 'Cada clic (o barra espaciadora) avanza una palabra; el cronómetro mide cuánto tardan.'}</small>
          </div>
          {st.modo === 'auto' && (
            <>
              <label className="field">Velocidad: <b>{st.ppm} palabras por minuto</b> ({(60 / st.ppm).toFixed(1)} s por palabra)
                <input type="range" min="10" max="240" step="5" value={st.ppm} onChange={(e) => setCfg({ ppm: Number(e.target.value) })} />
              </label>
              <div className="row gap wrap">
                {VELOCIDADES.map((v) => (
                  <button key={v.ppm} className={`chip ${st.ppm === v.ppm ? 'on' : ''}`} onClick={() => setCfg({ ppm: v.ppm })}>{v.icon} {v.label} · {v.ppm}</button>
                ))}
              </div>
            </>
          )}
          <div className="toggles" style={{ marginTop: 14 }}>
            <label><input type="checkbox" checked={st.voz} onChange={(e) => setCfg({ voz: e.target.checked })} /> Leer cada palabra en voz alta</label>
          </div>
        </section>

        <section className="panel panel-wide">
          <h2>📚 Textos</h2>
          <div className="textos-grid">
            {st.textos.map((x) => (
              <div key={x.id} className="texto-card mine" onClick={() => cargar(x)}>
                <b>{x.titulo}</b>
                <small>{x.texto.slice(0, 70)}{x.texto.length > 70 ? '…' : ''}</small>
                <button className="ci-del" onClick={(e) => { e.stopPropagation(); borrar(x.id); }} aria-label="Borrar">✕</button>
              </div>
            ))}
            {EJEMPLOS.map((x) => (
              <div key={x.id} className="texto-card" onClick={() => cargar(x)}>
                <b>{x.titulo}</b>
                <small>{x.texto.slice(0, 70)}…</small>
                <i>ejemplo</i>
              </div>
            ))}
          </div>
          <p className="muted small">Los textos guardados quedan en este navegador.</p>
        </section>
      </div>

      {leyendo && (
        <Lectura texto={texto} titulo={titulo || 'Lectura'} lang={lang} cfg={st} setCfg={setCfg} onClose={() => setLeyendo(false)} />
      )}
    </div>
  );
}
