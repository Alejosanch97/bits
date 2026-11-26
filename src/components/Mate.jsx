import { useEffect, useState } from 'react';
import { toSpanish } from '../lib/numbers.js';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';

// =====================================================================
//  RELOJ (horas en punto y media hora)
// =====================================================================
export function Reloj({ hora = 3, minuto = 0, size = 260, className = '' }) {
  const angH = ((hora % 12) + minuto / 60) * 30;
  const angM = minuto * 6;
  return (
    <svg viewBox="0 0 200 220" width={size} className={`reloj ${className}`}>
      <circle cx="56" cy="22" r="16" fill="#E8412C" stroke="#1D2A6B" strokeWidth="5" />
      <circle cx="144" cy="22" r="16" fill="#E8412C" stroke="#1D2A6B" strokeWidth="5" />
      <circle cx="100" cy="115" r="92" fill="#FFC531" stroke="#1D2A6B" strokeWidth="6" />
      <circle cx="100" cy="115" r="78" fill="#fff" stroke="#1D2A6B" strokeWidth="3" />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i * 6 * Math.PI) / 180;
        const r1 = i % 5 === 0 ? 68 : 73;
        return <line key={i} x1={100 + Math.sin(a) * r1} y1={115 - Math.cos(a) * r1} x2={100 + Math.sin(a) * 77} y2={115 - Math.cos(a) * 77} stroke="#1D2A6B" strokeWidth={i % 5 === 0 ? 3 : 1} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const a = (n * 30 * Math.PI) / 180;
        return <text key={n} x={100 + Math.sin(a) * 55} y={115 - Math.cos(a) * 55 + 8} textAnchor="middle" className="reloj-num">{n}</text>;
      })}
      <line className="reloj-h" x1="100" y1="115" x2="100" y2="72" stroke="#E8412C" strokeWidth="9" strokeLinecap="round" style={{ transform: `rotate(${angH}deg)`, transformOrigin: '100px 115px' }} />
      <line className="reloj-m" x1="100" y1="115" x2="100" y2="50" stroke="#2F8FD8" strokeWidth="6" strokeLinecap="round" style={{ transform: `rotate(${angM}deg)`, transformOrigin: '100px 115px' }} />
      <circle cx="100" cy="115" r="7" fill="#1D2A6B" />
    </svg>
  );
}

export const decirHora = (h, m) => (m === 30 ? `Son las ${toSpanish(h)} y media` : h === 1 ? 'Es la una en punto' : `Son las ${toSpanish(h)} en punto`);
export const textoHora = (h, m) => `${h}:${m === 0 ? '00' : m}`;

const RUTINA = [
  { h: 6, txt: 'Me levanto', e: '🛏️' },
  { h: 7, txt: 'Llego al colegio', e: '🏫' },
  { h: 9, txt: 'Tomo onces', e: '🍎' },
  { h: 10, txt: 'Juego en el recreo', e: '🛝' },
  { h: 11, txt: 'Estudio', e: '📚' },
  { h: 1, txt: 'Me voy a mi casa', e: '🏠' },
];

export function RelojExplorer({ media = false }) {
  const [h, setH] = useState(7);
  const [m, setM] = useState(0);
  useEffect(() => { const id = setTimeout(() => speak(decirHora(h, m)), 300); return () => clearTimeout(id); }, [h, m]);
  return (
    <div className="relojx">
      <div className="relojx-main">
        <Reloj hora={h} minuto={m} size={300} />
        <div className="relojx-side">
          <div className="reloj-digital">{textoHora(h, m)}</div>
          <p className="relojx-say">{decirHora(h, m)}</p>
          <div className="row gap wrap" style={{ justifyContent: 'center' }}>
            <button className="pad-btn minus" onClick={() => { sfx.tap(); setH((x) => (x === 1 ? 12 : x - 1)); }}>− 1 hora</button>
            <button className="pad-btn plus" onClick={() => { sfx.tap(); setH((x) => (x === 12 ? 1 : x + 1)); }}>+ 1 hora</button>
            {media && <button className="pad-btn dice" onClick={() => { sfx.tap(); setM((x) => (x === 0 ? 30 : 0)); }}>{m === 0 ? 'y media' : 'en punto'}</button>}
          </div>
          <p className="muted small"><b style={{ color: '#E8412C' }}>Horario</b> (corto) marca la hora · <b style={{ color: '#2F8FD8' }}>minutero</b> (largo) marca los minutos</p>
        </div>
      </div>
      <h3 className="relojx-h3">Mi día</h3>
      <div className="rutina">
        {RUTINA.map((r) => (
          <button key={r.h} className={`rutina-item ${h === r.h && m === 0 ? 'on' : ''}`} onClick={() => { sfx.pop(); setH(r.h); setM(0); setTimeout(() => speak(`${decirHora(r.h, 0)}. ${r.txt}`), 50); }}>
            <span>{r.e}</span><Reloj hora={r.h} size={70} /><b>{r.h}:00</b><small>{r.txt}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
//  GEOMETRÍA (libro Geometric Shapes — igual para los tres grados)
// =====================================================================
export const FORMAS = [
  { id: 'circle', en: 'circle', es: 'círculo', tipo: '2d', lados: 0, esquinas: 0, color: '#FFC531', dato: 'It is formed by a curved line.', objetos: ['🍪', '🕐', '🍩', '💿'] },
  { id: 'square', en: 'square', es: 'cuadrado', tipo: '2d', lados: 4, esquinas: 4, color: '#2F8FD8', dato: 'It has four equal straight lines.', objetos: ['🧇', '🪟', '🖼️', '⬛'] },
  { id: 'triangle', en: 'triangle', es: 'triángulo', tipo: '2d', lados: 3, esquinas: 3, color: '#E8412C', dato: 'I have 3 sides and 3 corners.', objetos: ['🍕', '🧀', '📐', '🔺'] },
  { id: 'rectangle', en: 'rectangle', es: 'rectángulo', tipo: '2d', lados: 4, esquinas: 4, color: '#2E9E5B', dato: 'I have 4 sides. My opposite sides are equal.', objetos: ['🚪', '📱', '📺', '💵'] },
  { id: 'oval', en: 'oval', es: 'óvalo', tipo: '2d', lados: 0, esquinas: 0, color: '#F26B1D', dato: 'I am shaped like an egg.', objetos: ['🥚', '🏉', '🎈', '🪞'] },
  { id: 'rhombus', en: 'rhombus', es: 'rombo', tipo: '2d', lados: 4, esquinas: 4, color: '#7A4FD6', dato: 'I have 4 sides. All of them are diagonal lines.', objetos: ['🪁', '🔷', '💎', '♦️'] },
  { id: 'pentagon', en: 'pentagon', es: 'pentágono', tipo: '2d', lados: 5, esquinas: 5, color: '#1D2A6B', dato: 'I have 5 sides and 5 corners.', objetos: ['🏠', '🏡'] },
  { id: 'hexagon', en: 'hexagon', es: 'hexágono', tipo: '2d', lados: 6, esquinas: 6, color: '#F2A20C', dato: 'I have 6 sides and 6 corners.', objetos: ['🐝', '🍯', '🔩'] },
  { id: 'heptagon', en: 'heptagon', es: 'heptágono', tipo: '2d', lados: 7, esquinas: 7, color: '#8B5A2B', dato: 'I have 7 sides and 7 corners.', objetos: [] },
  { id: 'octagon', en: 'octagon', es: 'octágono', tipo: '2d', lados: 8, esquinas: 8, color: '#9AA0A6', dato: 'I have 8 sides and 8 corners. STOP!', objetos: ['🛑'] },
  { id: 'sphere', en: 'sphere', es: 'esfera', tipo: '3d', color: '#2E9E5B', dato: 'I have a curved surface.', objetos: ['⚽', '🌍', '🏀', '🍊'] },
  { id: 'cube', en: 'cube', es: 'cubo', tipo: '3d', color: '#E8412C', dato: 'I have 6 faces and 12 edges.', objetos: ['🎲', '🧊', '📦', '🎁'] },
  { id: 'pyramid', en: 'pyramid', es: 'pirámide', tipo: '3d', color: '#F2A20C', dato: 'I have 5 faces and 8 edges.', objetos: ['⛺', '🏔️'] },
  { id: 'cone', en: 'cone', es: 'cono', tipo: '3d', color: '#F26B1D', dato: 'I have 1 face and 1 curved surface.', objetos: ['🍦', '🥳', '🚧'] },
  { id: 'cylinder', en: 'cylinder', es: 'cilindro', tipo: '3d', color: '#2F8FD8', dato: 'I have curved and flat surfaces.', objetos: ['🥫', '🧻', '🥁', '🕯️'] },
];

function poly(n, r = 80, cx = 100, cy = 105, rot = -90) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((rot + (360 / n) * i) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

export function Forma({ id, color, size = 160, className = '' }) {
  const f = FORMAS.find((x) => x.id === id);
  const c = color || f.color;
  const st = { fill: c, stroke: '#1D2A6B', strokeWidth: 6, strokeLinejoin: 'round' };
  const light = { fill: 'rgba(255,255,255,.35)', stroke: '#1D2A6B', strokeWidth: 5, strokeLinejoin: 'round' };
  let el;
  switch (id) {
    case 'circle': el = <circle cx="100" cy="105" r="82" {...st} />; break;
    case 'square': el = <rect x="28" y="33" width="144" height="144" rx="6" {...st} />; break;
    case 'triangle': el = <polygon points="100,22 182,182 18,182" {...st} />; break;
    case 'rectangle': el = <rect x="12" y="55" width="176" height="104" rx="6" {...st} />; break;
    case 'oval': el = <ellipse cx="100" cy="105" rx="62" ry="88" {...st} />; break;
    case 'rhombus': el = <polygon points="100,15 175,105 100,195 25,105" {...st} />; break;
    case 'pentagon': el = <polygon points={poly(5, 88)} {...st} />; break;
    case 'hexagon': el = <polygon points={poly(6, 88, 100, 105, 0)} {...st} />; break;
    case 'heptagon': el = <polygon points={poly(7, 88)} {...st} />; break;
    case 'octagon': el = <polygon points={poly(8, 88, 100, 105, -67.5)} {...st} />; break;
    case 'sphere': el = (<g><circle cx="100" cy="105" r="82" {...st} /><ellipse cx="100" cy="105" rx="82" ry="24" fill="none" stroke="#1D2A6B" strokeWidth="4" strokeDasharray="10 8" /><ellipse cx="72" cy="72" rx="18" ry="12" fill="rgba(255,255,255,.55)" /></g>); break;
    case 'cube': el = (<g><polygon points="40,70 140,70 140,180 40,180" {...st} /><polygon points="40,70 75,35 175,35 140,70" {...light} /><polygon points="140,70 175,35 175,145 140,180" fill="rgba(0,0,0,.18)" stroke="#1D2A6B" strokeWidth="5" strokeLinejoin="round" /></g>); break;
    case 'pyramid': el = (<g><polygon points="100,18 30,170 120,190" {...st} /><polygon points="100,18 120,190 178,160" fill="rgba(0,0,0,.18)" stroke="#1D2A6B" strokeWidth="5" strokeLinejoin="round" /><line x1="30" y1="170" x2="178" y2="160" stroke="#1D2A6B" strokeWidth="3" strokeDasharray="8 6" /></g>); break;
    case 'cone': el = (<g><path d="M100 18 L178 165 A78 24 0 0 1 22 165 Z" {...st} /><ellipse cx="100" cy="165" rx="78" ry="24" fill="none" stroke="#1D2A6B" strokeWidth="4" strokeDasharray="10 8" /></g>); break;
    case 'cylinder': el = (<g><path d="M30 45 L30 165 A70 22 0 0 0 170 165 L170 45" {...st} /><ellipse cx="100" cy="45" rx="70" ry="22" {...light} /></g>); break;
    default: el = null;
  }
  return <svg viewBox="0 0 200 210" width={size} className={`forma ${className}`}>{el}</svg>;
}

// =====================================================================
//  DINERO COLOMBIANO (Transición)
// =====================================================================
export const MONEDAS = [50, 100, 200, 500, 1000];
export const BILLETES = [2000, 5000, 10000, 20000, 50000, 100000];
const COLOR_DINERO = { 50: '#C9C9C9', 100: '#E7C76B', 200: '#D6D6D6', 500: '#E9D27A', 1000: '#D9B44A', 2000: '#6FA8DC', 5000: '#A3B86C', 10000: '#E79B6B', 20000: '#E5B54D', 50000: '#C98BC2', 100000: '#7FC3A5' };
export const pesos = (n) => `$${n.toLocaleString('es-CO')}`;

export function Plata({ valor, onClick, small = false }) {
  const moneda = valor <= 1000;
  return (
    <button type="button" className={`plata ${moneda ? 'moneda' : 'billete'} ${small ? 'sm' : ''}`} style={{ '--pc': COLOR_DINERO[valor] }} onClick={onClick} aria-label={pesos(valor)}>
      <b>{moneda ? valor : valor.toLocaleString('es-CO')}</b>
      {!moneda && <small>pesos</small>}
    </button>
  );
}

export function DineroExplorer() {
  const [bolsa, setBolsa] = useState([]);
  const total = bolsa.reduce((s, v) => s + v, 0);
  const add = (v) => { sfx.coin(); setBolsa((b) => [...b, v]); speak(`${toSpanish(v)} pesos`); };
  return (
    <div className="dinerox">
      <h3>Monedas</h3>
      <div className="plata-row">{MONEDAS.map((v) => <Plata key={v} valor={v} onClick={() => add(v)} />)}</div>
      <h3>Billetes</h3>
      <div className="plata-row">{BILLETES.map((v) => <Plata key={v} valor={v} onClick={() => add(v)} />)}</div>
      <div className="bolsa">
        <span className="bolsa-ico">👛</span>
        <div className="bolsa-items">{bolsa.map((v, i) => <Plata key={i} valor={v} small />)}{!bolsa.length && <span className="muted">Toca monedas y billetes para guardarlos</span>}</div>
        <div className="bolsa-total"><small>Total</small><b>{pesos(total)}</b></div>
        <div className="row gap">
          <button className="btn btn-white" onClick={() => { setBolsa([]); sfx.tap(); }}>🧽 Vaciar</button>
          <button className="btn btn-gold" onClick={() => speak(`Tienes ${toSpanish(total)} pesos`)}>🔊 ¿Cuánto hay?</button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
//  VÍNCULOS NUMÉRICOS (Number bonds · parte – parte – todo)
// =====================================================================
export function Bond({ todo, a, b, hide, emoji = '🔴' }) {
  const v = (k, val) => (hide === k ? '?' : val);
  return (
    <div className="bond">
      <span className="bond-c bond-todo">{v('todo', todo)}</span>
      <svg className="bond-lines" viewBox="0 0 200 60" preserveAspectRatio="none"><line x1="100" y1="0" x2="40" y2="60" /><line x1="100" y1="0" x2="160" y2="60" /></svg>
      <div className="bond-parts">
        <span className="bond-c">{v('a', a)}</span>
        <span className="bond-c">{v('b', b)}</span>
      </div>
      {emoji && todo <= 20 && (
        <div className="bond-dots">
          {Array.from({ length: todo }, (_, i) => <i key={i} className={i < a ? 'pa' : 'pb'}>{emoji}</i>)}
        </div>
      )}
    </div>
  );
}

export function BondsExplorer({ max = 10 }) {
  const [todo, setTodo] = useState(Math.min(10, max));
  const [a, setA] = useState(4);
  const aa = Math.min(a, todo);
  useEffect(() => { const id = setTimeout(() => speak(`${toSpanish(aa)} y ${toSpanish(todo - aa)} forman ${toSpanish(todo)}`), 300); return () => clearTimeout(id); }, [aa, todo]);
  return (
    <div className="bondsx">
      <div className="seg center wrap">
        {Array.from({ length: max - 1 }, (_, i) => i + 2).filter((n) => n <= 10 || n % 2 === 0 || n === max).map((n) => (
          <button key={n} className={todo === n ? 'on' : ''} onClick={() => { setTodo(n); setA(Math.floor(n / 2)); sfx.tap(); }}>{n}</button>
        ))}
      </div>
      <Bond todo={todo} a={aa} b={todo - aa} emoji="🟡" />
      <input className="explorer-range" type="range" min="0" max={todo} value={aa} onChange={(e) => setA(Number(e.target.value))} />
      <p className="mulx-sum"><b>{aa}</b> + <b>{todo - aa}</b> = {todo} &nbsp;·&nbsp; {todo} = {aa} + {todo - aa}</p>
    </div>
  );
}
