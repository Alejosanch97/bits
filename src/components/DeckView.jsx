import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import BitPlayer from './BitPlayer.jsx';
import QuizGame from './QuizGame.jsx';
import Visual, { Word } from './Visual.jsx';

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);

// Vista de un mazo de bits: héroe, botones de acción y cuadrícula de tarjetas
export default function DeckView({ hero, title, items, lang = 'es', color = '#E8412C', extraActions = [], playerProps = {} }) {
  const { settings } = useStore();
  const [overlay, setOverlay] = useState(null);
  const [flipped, setFlipped] = useState({});
  const [order, setOrder] = useState('orden');

  const tapCard = (it, i) => {
    sfx.pop();
    speak(it.texto, lang);
    setFlipped((f) => ({ ...f, [i]: !f[i] }));
  };

  return (
    <div className="deck" style={{ '--accent': color }}>
      <section className="deck-hero">
        <div className="deck-hero-art">{hero}</div>
        <div className="deck-hero-info">
          <h1 className="deck-title">{title}</h1>
          <p className="deck-sub">{items.length} {lang === 'en' ? 'words' : 'bits'} · toca una tarjeta para escucharla</p>
          <div className="deck-actions">
            <button className="btn btn-xl btn-accent" onClick={() => { sfx.pop(); setOverlay({ type: 'bits', items: order === 'azar' ? shuffle(items) : items }); }}>
              ⚡ {lang === 'en' ? 'Flash bits' : 'Bits rápidos'}
            </button>
            <button className="btn btn-xl btn-gold" onClick={() => { sfx.pop(); setOverlay({ type: 'quiz', mode: 'leer' }); }}>
              🎯 {lang === 'en' ? 'Read & find' : 'Lee y encuentra'}
            </button>
            <button className="btn btn-xl btn-blue" onClick={() => { sfx.pop(); setOverlay({ type: 'quiz', mode: 'ver' }); }}>
              👀 {lang === 'en' ? 'Look & read' : 'Mira y lee'}
            </button>
            {extraActions.map((a) => (
              <button key={a.label} className="btn btn-xl btn-white" onClick={() => { sfx.pop(); a.onClick(setOverlay); }}>{a.label}</button>
            ))}
          </div>
          <div className="seg">
            <button className={order === 'orden' ? 'on' : ''} onClick={() => setOrder('orden')}>En orden</button>
            <button className={order === 'azar' ? 'on' : ''} onClick={() => setOrder('azar')}>🎲 Al azar</button>
          </div>
        </div>
      </section>

      <section className="card-grid">
        {items.map((it, i) => (
          <button
            key={it.texto + i}
            className={`flip-card ${flipped[i] ? 'flipped' : ''}`}
            style={{ animationDelay: `${Math.min(i * 35, 900)}ms` }}
            onClick={() => tapCard(it, i)}
          >
            <span className="flip-inner">
              <span className="flip-face flip-front">
                <Visual item={it} className="card-visual" />
                <Word text={it.texto} letra={it.letra} upper={settings.upper} className="card-word" />
              </span>
              <span className="flip-face flip-back">
                <Word text={it.texto} letra={it.letra} upper={settings.upper} className="card-word-big" />
              </span>
            </span>
          </button>
        ))}
      </section>

      {overlay?.type === 'bits' && (
        <BitPlayer items={overlay.items} lang={lang} title={overlay.title || title} onClose={() => setOverlay(null)} {...playerProps} {...(overlay.props || {})} />
      )}
      {overlay?.type === 'quiz' && (
        <QuizGame pool={items} lang={lang} mode={overlay.mode} title={title} onClose={() => setOverlay(null)} />
      )}
    </div>
  );
}
