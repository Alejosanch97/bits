import { useMemo, useState } from 'react';
import { MQRB, MQRB_TODAS } from '../data/mqrb.js';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import BitPlayer from '../components/BitPlayer.jsx';
import QuizGame from '../components/QuizGame.jsx';
import Chispa from '../components/Chispa.jsx';

// Tarjeta igual a la del libro: la palabra 4 veces en español (negro) y 4 en inglés (rojo)
function LibroCard({ p, big = false }) {
  return (
    <span className={`mq-card ${big ? 'big' : ''}`}>
      <span className="mq-col es">{[0, 1, 2, 3].map((i) => <b key={i}>{i === 0 ? p.es.charAt(0).toUpperCase() + p.es.slice(1) : p.es}</b>)}</span>
      <span className="mq-col en">{p.en.map((w, i) => <b key={i}>{w}</b>)}</span>
    </span>
  );
}

export default function Mqrb() {
  const [semana, setSemana] = useState(1);
  const [overlay, setOverlay] = useState(null);
  const lista = useMemo(() => (semana === 0 ? MQRB_TODAS : MQRB.find((s) => s.semana === semana).palabras), [semana]);
  const nombre = semana === 0 ? 'Todas las semanas' : `Semana ${semana}`;

  const modoLibro = () => setOverlay({
    type: 'bits',
    title: `MQRB · ${nombre}`,
    items: lista.map((p) => ({ texto: p.es, emoji: p.emoji, p })),
    renderFront: (it) => <LibroCard p={it.p} big />,
    renderBack: (it) => (
      <span className="num-back">
        <span className="visual visual-emoji bit-visual">{it.p.emoji}</span>
        <span className="mq-pair"><b>{it.p.es}</b> · <i>{it.p.en[0]}</i></span>
      </span>
    ),
    sayBack: (it) => it.p.en[0],
  });

  // Doman: cada palabra se muestra 4 veces seguidas, rápido
  const cuatroVeces = (lang) => setOverlay({
    type: 'bits',
    title: `${lang === 'en' ? 'English' : 'Español'} ×4 · ${nombre}`,
    lang,
    items: lista.flatMap((p) => (lang === 'en' ? p.en : [p.es, p.es, p.es, p.es]).map((w) => ({ texto: w, emoji: p.emoji }))),
    renderBack: null,
  });

  return (
    <div className="page page-mqrb">
      <section className="world-header wh-mqrb">
        <div>
          <span className="grado-pill">📘 PJ · Jardín · Transición</span>
          <h1>My Quick Reading Book</h1>
          <p>Leer rápidamente: cada palabra 4 veces en español y 4 veces en inglés, semana a semana.</p>
          <div className="deck-actions">
            <button className="btn btn-xl btn-accent" onClick={() => { sfx.pop(); modoLibro(); }}>📖 Modo libro</button>
            <button className="btn btn-xl btn-white" onClick={() => { sfx.pop(); cuatroVeces('es'); }}>⚡ Español ×4</button>
            <button className="btn btn-xl btn-white" onClick={() => { sfx.pop(); cuatroVeces('en'); }}>⚡ English ×4</button>
            <button className="btn btn-xl btn-gold" onClick={() => { sfx.pop(); setOverlay({ type: 'quiz', lang: 'es' }); }}>🎯 Lee y encuentra</button>
            <button className="btn btn-xl btn-blue" onClick={() => { sfx.pop(); setOverlay({ type: 'quiz', lang: 'en' }); }}>🎯 Read & find</button>
          </div>
        </div>
        <Chispa size={140} message="¡Leer rápido!" />
      </section>

      <div className="groups">
        <span className="groups-label">Semana:</span>
        {MQRB.map((s) => (
          <button key={s.semana} className={`group-chip ${semana === s.semana ? 'on' : ''}`} style={{ '--accent': '#1D2A6B' }} onClick={() => { sfx.tap(); setSemana(s.semana); }}>{s.semana}</button>
        ))}
        <button className={`group-chip ${semana === 0 ? 'on' : ''}`} style={{ '--accent': '#1D2A6B' }} onClick={() => setSemana(0)}>Todas</button>
      </div>

      <section className="mq-grid" key={semana}>
        {lista.map((p, i) => (
          <button key={p.es} className="mq-item" style={{ animationDelay: `${i * 50}ms` }} onClick={() => { sfx.pop(); speak(p.es); setTimeout(() => speak(p.en[0], 'en'), 1100); }}>
            <span className="mq-emoji">{p.emoji}</span>
            <LibroCard p={p} />
          </button>
        ))}
      </section>

      {overlay?.type === 'bits' && (
        <BitPlayer
          items={overlay.items}
          title={overlay.title}
          lang={overlay.lang || 'es'}
          renderFront={overlay.renderFront}
          renderBack={overlay.renderBack || undefined}
          sayBack={overlay.sayBack}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay?.type === 'quiz' && (
        <QuizGame
          pool={lista.map((p) => ({ texto: overlay.lang === 'en' ? p.en[0] : p.es, emoji: p.emoji }))}
          lang={overlay.lang}
          rounds={Math.min(8, lista.length)}
          mode="leer"
          title={`MQRB · ${nombre}`}
          onClose={() => setOverlay(null)}
        />
      )}
    </div>
  );
}
