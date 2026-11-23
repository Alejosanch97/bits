import { useState } from 'react';
import { Link } from 'react-router-dom';
import BitPlayer from '../components/BitPlayer.jsx';
import QuizGame from '../components/QuizGame.jsx';
import Chispa from '../components/Chispa.jsx';
import { DotCard } from '../components/Visual.jsx';
import {
  Numeral, NumberExplorer, OperationGame, numberItems, Base10, GroupsVisual, MultiplicationExplorer, MUL_EMOJI,
} from '../components/Numbers.jsx';
import { toSpanish } from '../lib/numbers.js';
import { sfx } from '../lib/sfx.js';

const TABS = [
  { id: 'puntos', label: 'Puntos 1–20', icon: '🔴' },
  { id: 'singapur', label: 'Bloques Singapur', icon: '🧱' },
  { id: 'numerales', label: 'Bits de números', icon: '🔢' },
  { id: 'explorar', label: 'Explorador 0–10.000', icon: '🔭' },
  { id: 'suma', label: 'Sumas', icon: '➕' },
  { id: 'resta', label: 'Restas', icon: '➖' },
  { id: 'multi', label: 'Multiplicar', icon: '✖️' },
  { id: 'cuantos', label: '¿Cuántos hay?', icon: '🎯' },
];

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const sample = (from, to, n) => {
  const s = new Set();
  while (s.size < Math.min(n, to - from + 1)) s.add(from + Math.floor(Math.random() * (to - from + 1)));
  return [...s].map((x) => ({ texto: toSpanish(x), numero: x }));
};

// Los puntos de Doman solo hasta 20: después es muy difícil contarlos
const DOT_SETS = [
  { label: '1 al 10', from: 1, to: 10, c: '#E8412C' },
  { label: '11 al 20', from: 11, to: 20, c: '#F2A20C' },
];

// De ahí en adelante: método Singapur con bloques
const BLOCK_SETS = [
  { label: '21 al 100', items: () => sample(21, 100, 12), demo: 47, c: '#2F8FD8' },
  { label: 'Decenas 10…100', items: () => numberItems(10, 100, 10), demo: 30, c: '#1D2A6B' },
  { label: 'Hasta 1.000', items: () => sample(100, 999, 12), demo: 235, c: '#E8412C' },
  { label: 'Miles 1.000…10.000', items: () => numberItems(1000, 10000, 1000), demo: 2000, c: '#7A4FD6' },
  { label: 'Hasta 10.000', items: () => sample(1000, 9999, 10), demo: 1342, c: '#2E9E5B' },
];

const NUM_SETS = [
  { label: '0 al 20', items: () => numberItems(0, 20) },
  { label: 'Decenas 10…100', items: () => numberItems(10, 100, 10) },
  { label: 'Centenas 100…1.000', items: () => numberItems(100, 1000, 100) },
  { label: 'Miles 1.000…10.000', items: () => numberItems(1000, 10000, 1000) },
  { label: 'Sorpresa hasta 10.000', items: () => sample(1, 10000, 12) },
];

const visualFor = (n, cls = '') => (n <= 20 && n > 0
  ? <DotCard n={n} className={`num-back-dots ${cls}`} />
  : <div className={`bit-blocks ${cls}`}><Base10 n={n} compact /></div>);

function equationBits(op) {
  const out = [];
  for (let i = 0; i < 10; i++) {
    let a = 1 + Math.floor(Math.random() * 9);
    let b = 1 + Math.floor(Math.random() * (10 - a));
    if (op === '-') { a = 2 + Math.floor(Math.random() * 9); b = 1 + Math.floor(Math.random() * (a - 1)); }
    const r = op === '+' ? a + b : a - b;
    out.push({ texto: `${toSpanish(a)} ${op === '+' ? 'más' : 'menos'} ${toSpanish(b)}, ${toSpanish(r)}`, a, b, r, op });
  }
  return out;
}

export default function Numeros() {
  const [tab, setTab] = useState('puntos');
  const [overlay, setOverlay] = useState(null);
  const [order, setOrder] = useState('azar');

  const openDots = (set) => {
    const items = numberItems(set.from, set.to);
    setOverlay({
      title: `Puntos ${set.label}`,
      items: order === 'azar' ? shuffle(items) : items,
      renderFront: (it) => <DotCard n={it.numero} className="bit-dots" />,
      renderBack: (it) => (
        <span className="num-back">
          <Numeral n={it.numero} className="num-back-n" />
          <span className="num-back-w">{it.texto}</span>
        </span>
      ),
    });
  };

  const openBlocks = (set) => {
    setOverlay({
      title: `Bloques ${set.label}`,
      items: set.items(),
      renderFront: (it) => <div className="bit-blocks big"><Base10 n={it.numero} /></div>,
      renderBack: (it) => (
        <span className="num-back">
          <Numeral n={it.numero} className="num-back-n" />
          <span className="num-back-w">{it.texto}</span>
        </span>
      ),
    });
  };

  const openNums = (set) => {
    setOverlay({
      title: set.label,
      items: set.items(),
      renderFront: (it) => <Numeral n={it.numero} className="bit-numeral" />,
      renderBack: (it) => (
        <span className="num-back">
          <span className="num-back-w big">{it.texto}</span>
          {it.numero > 0 && visualFor(it.numero)}
        </span>
      ),
    });
  };

  const openEq = (op) => {
    setOverlay({
      title: op === '+' ? 'Bits de sumas' : 'Bits de restas',
      items: equationBits(op),
      renderFront: (it) => (
        <span className="eq-front">
          <DotCard n={it.a} seed={2} className="eq-dots" />
          <b>{it.op === '+' ? '+' : '−'}</b>
          <DotCard n={it.b} seed={3} className="eq-dots" />
        </span>
      ),
      renderBack: (it) => (
        <span className="eq-back">
          <Numeral n={it.a} /> <b>{it.op === '+' ? '+' : '−'}</b> <Numeral n={it.b} /> <b>=</b> <Numeral n={it.r} />
        </span>
      ),
    });
  };

  const openTabla = (t) => {
    const items = Array.from({ length: 10 }, (_, i) => ({ texto: `${toSpanish(t)} por ${toSpanish(i + 1)}, ${toSpanish(t * (i + 1))}`, t, i: i + 1 }));
    setOverlay({
      title: `Tabla del ${t}`,
      items,
      renderFront: (it) => <GroupsVisual groups={it.i} each={it.t} emoji={MUL_EMOJI[it.t - 1]} compact />,
      renderBack: (it) => (
        <span className="eq-back">
          <Numeral n={it.t} /> <b className="mul">×</b> <Numeral n={it.i} /> <b>=</b> <Numeral n={it.t * it.i} />
        </span>
      ),
    });
  };

  const openCuantos = (mode, max) => {
    const pool = mode === 'puntos' ? numberItems(1, max) : sample(max === 100 ? 11 : max === 1000 ? 100 : 1000, max === 10000 ? 9999 : max, 40);
    setOverlay({ quiz: true, pool, mode });
  };

  return (
    <div className="page page-numeros">
      <section className="world-header wh-numeros">
        <div>
          <h1>Mundo de Números</h1>
          <p>Puntos de Glenn Doman hasta el 20, método Singapur hasta el 10.000, operaciones y tablas</p>
        </div>
        <Chispa size={140} message="¡Contemos juntos!" />
      </section>

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => { sfx.tap(); setTab(t.id); }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
        <Link to="/juegos" className="tab tab-games"><span>🎮</span>Juegos de números</Link>
      </nav>

      <section className="tab-panel" key={tab}>
        {tab === 'puntos' && (
          <div className="panel-grid">
            <div className="panel-intro">
              <h2>Tarjetas de puntos (1 al 20)</h2>
              <p>Los niños ven la cantidad real antes del símbolo. Después del 20 usamos los bloques Singapur, que se pueden contar de 10 en 10.</p>
              <div className="seg">
                <button className={order === 'orden' ? 'on' : ''} onClick={() => setOrder('orden')}>En orden</button>
                <button className={order === 'azar' ? 'on' : ''} onClick={() => setOrder('azar')}>🎲 Al azar</button>
              </div>
            </div>
            {DOT_SETS.map((s, i) => (
              <button key={s.label} className="set-card" style={{ '--c': s.c }} onClick={() => { sfx.pop(); openDots(s); }}>
                <DotCard n={s.from + 2} seed={i} className="set-dots" />
                <b>{s.label}</b>
                <small>▶ Empezar</small>
              </button>
            ))}
            <button className="set-card" style={{ '--c': '#2F8FD8' }} onClick={() => { sfx.tap(); setTab('singapur'); }}>
              <div className="set-blocks"><Base10 n={23} compact showLabels={false} /></div>
              <b>Más de 20</b>
              <small>Ir a bloques ➜</small>
            </button>
          </div>
        )}

        {tab === 'singapur' && (
          <div className="panel-grid">
            <div className="panel-intro">
              <h2>Método Singapur</h2>
              <p>
                <b className="t-u">Cubito</b> = 1 · <b className="t-d">barra</b> = 10 · <b className="t-c">placa</b> = 100 · <b className="t-m">cubo</b> = 1.000.
                Primero aparecen los bloques, luego el número y cómo se lee.
              </p>
            </div>
            {BLOCK_SETS.map((s) => (
              <button key={s.label} className="set-card" style={{ '--c': s.c }} onClick={() => { sfx.pop(); openBlocks(s); }}>
                <div className="set-blocks"><Base10 n={s.demo} compact showLabels={false} /></div>
                <b>{s.label}</b>
                <small>▶ Empezar</small>
              </button>
            ))}
          </div>
        )}

        {tab === 'numerales' && (
          <div className="panel-grid">
            <div className="panel-intro">
              <h2>Así se escriben</h2>
              <p>Cada cifra tiene su color: <b className="t-m">miles</b>, <b className="t-c">centenas</b>, <b className="t-d">decenas</b> y <b className="t-u">unidades</b>.</p>
            </div>
            {NUM_SETS.map((s, i) => (
              <button key={s.label} className="set-card" style={{ '--c': ['#1D2A6B', '#7A4FD6', '#E8412C', '#2E9E5B', '#F26B1D'][i] }} onClick={() => { sfx.pop(); openNums(s); }}>
                <Numeral n={[7, 40, 300, 2000, 8571][i]} className="set-numeral" />
                <b>{s.label}</b>
                <small>▶ Empezar</small>
              </button>
            ))}
          </div>
        )}

        {tab === 'explorar' && <NumberExplorer />}

        {(tab === 'suma' || tab === 'resta') && (
          <>
            <OperationGame op={tab === 'suma' ? '+' : '-'} key={tab} />
            <div className="center-row">
              <button className="btn btn-xl btn-accent" onClick={() => openEq(tab === 'suma' ? '+' : '-')}>⚡ Bits de {tab === 'suma' ? 'sumas' : 'restas'} con puntos</button>
            </div>
          </>
        )}

        {tab === 'multi' && <MultiplicationExplorer onBits={openTabla} />}

        {tab === 'cuantos' && (
          <div className="panel-intro center">
            <h2>¿Cuántos hay?</h2>
            <p>Mira los puntos o los bloques y toca el número correcto.</p>
            <div className="row gap wrap" style={{ justifyContent: 'center' }}>
              <button className="btn btn-xl btn-accent" onClick={() => openCuantos('puntos', 10)}>🔴 Puntos hasta 10</button>
              <button className="btn btn-xl btn-accent" onClick={() => openCuantos('puntos', 20)}>🔴 Puntos hasta 20</button>
              <button className="btn btn-xl btn-blue" onClick={() => openCuantos('bloques', 100)}>🧱 Bloques hasta 100</button>
              <button className="btn btn-xl btn-blue" onClick={() => openCuantos('bloques', 1000)}>🧱 Hasta 1.000</button>
              <button className="btn btn-xl btn-blue" onClick={() => openCuantos('bloques', 10000)}>🧱 Hasta 10.000</button>
            </div>
          </div>
        )}
      </section>

      {overlay && !overlay.quiz && (
        <BitPlayer
          items={overlay.items}
          title={overlay.title}
          renderFront={overlay.renderFront}
          renderBack={overlay.renderBack}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay?.quiz && (
        <QuizGame
          pool={overlay.pool}
          mode="ver"
          rounds={8}
          title="¿Cuántos hay?"
          onClose={() => setOverlay(null)}
          renderVisual={(it) => (overlay.mode === 'puntos'
            ? <DotCard n={it.numero} seed={5} className="quiz-dots" />
            : <div className="quiz-blocks"><Base10 n={it.numero} compact showLabels={false} /></div>)}
          renderLabel={(it) => <Numeral n={it.numero} className="opt-numeral" />}
        />
      )}
    </div>
  );
}
