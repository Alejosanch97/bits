import { useState } from 'react';
import BitPlayer from '../components/BitPlayer.jsx';
import QuizGame from '../components/QuizGame.jsx';
import Chispa from '../components/Chispa.jsx';
import { DotCard } from '../components/Visual.jsx';
import { Numeral, NumberExplorer, OperationGame, numberItems } from '../components/Numbers.jsx';
import { toSpanish } from '../lib/numbers.js';
import { sfx } from '../lib/sfx.js';

const TABS = [
  { id: 'puntos', label: 'Bits de puntos', icon: '🔴' },
  { id: 'numerales', label: 'Bits de números', icon: '🔢' },
  { id: 'explorar', label: 'Explorador 0–1000', icon: '🔭' },
  { id: 'suma', label: 'Sumas', icon: '➕' },
  { id: 'resta', label: 'Restas', icon: '➖' },
  { id: 'cuantos', label: '¿Cuántos hay?', icon: '🎯' },
];

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);

const DOT_SETS = [
  { label: '1 al 10', from: 1, to: 10 },
  { label: '11 al 20', from: 11, to: 20 },
  { label: '21 al 50', from: 21, to: 50 },
  { label: '51 al 100', from: 51, to: 100 },
];

const NUM_SETS = [
  { label: '0 al 20', items: () => numberItems(0, 20) },
  { label: 'Decenas 10…100', items: () => numberItems(10, 100, 10) },
  { label: 'Centenas 100…1000', items: () => numberItems(100, 1000, 100) },
  { label: 'Sorpresa hasta 1000', items: () => shuffle(numberItems(1, 1000)).slice(0, 12) },
];

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
  const [cuantosMax, setCuantosMax] = useState(10);

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

  const openNums = (set) => {
    setOverlay({
      title: set.label,
      items: set.items(),
      renderFront: (it) => <Numeral n={it.numero} className="bit-numeral" />,
      renderBack: (it) => (
        <span className="num-back">
          <span className="num-back-w big">{it.texto}</span>
          {it.numero <= 100 && it.numero > 0 && <DotCard n={it.numero} className="num-back-dots" />}
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

  return (
    <div className="page page-numeros">
      <section className="world-header wh-numeros">
        <div>
          <h1>Mundo de Números</h1>
          <p>Puntos rojos de Glenn Doman, números hasta el 1000 y operaciones mágicas</p>
        </div>
        <Chispa size={140} message="¡Contemos juntos!" />
      </section>

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => { sfx.tap(); setTab(t.id); }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      <section className="tab-panel" key={tab}>
        {tab === 'puntos' && (
          <div className="panel-grid">
            <div className="panel-intro">
              <h2>Tarjetas de puntos</h2>
              <p>Los niños ven la cantidad real antes del símbolo. Primero aparecen los puntos, luego el número.</p>
              <div className="seg">
                <button className={order === 'orden' ? 'on' : ''} onClick={() => setOrder('orden')}>En orden</button>
                <button className={order === 'azar' ? 'on' : ''} onClick={() => setOrder('azar')}>🎲 Al azar</button>
              </div>
            </div>
            {DOT_SETS.map((s, i) => (
              <button key={s.label} className="set-card" style={{ '--c': ['#E8412C', '#F2A20C', '#2F8FD8', '#2E9E5B'][i] }} onClick={() => { sfx.pop(); openDots(s); }}>
                <DotCard n={s.from + 2} seed={i} className="set-dots" />
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
              <p>Cada cifra tiene su color: <b className="t-c">centenas</b>, <b className="t-d">decenas</b> y <b className="t-u">unidades</b>.</p>
            </div>
            {NUM_SETS.map((s, i) => (
              <button key={s.label} className="set-card" style={{ '--c': ['#1D2A6B', '#7A4FD6', '#E8412C', '#2E9E5B'][i] }} onClick={() => { sfx.pop(); openNums(s); }}>
                <Numeral n={[7, 40, 300, 857][i]} className="set-numeral" />
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

        {tab === 'cuantos' && (
          <div className="panel-intro center">
            <h2>¿Cuántos puntos hay?</h2>
            <p>Mira los puntos y toca el número correcto.</p>
            <div className="seg center">
              {[5, 10, 20, 50].map((m) => <button key={m} className={cuantosMax === m ? 'on' : ''} onClick={() => setCuantosMax(m)}>Hasta {m}</button>)}
            </div>
            <button className="btn btn-xl btn-gold" onClick={() => setOverlay({ quiz: true, pool: numberItems(1, cuantosMax) })}>🎯 ¡A jugar!</button>
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
          renderVisual={(it) => <DotCard n={it.numero} seed={5} className="quiz-dots" />}
          renderLabel={(it) => <Numeral n={it.numero} className="opt-numeral" />}
        />
      )}
    </div>
  );
}
