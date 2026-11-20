import { useMemo, useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import BitPlayer from './BitPlayer.jsx';
import QuizGame from './QuizGame.jsx';
import Visual, { Word } from './Visual.jsx';

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const TAM_GRUPO = 20;
export const tieneImagen = (it) => !!(it.emoji || it.img || it.swatch || it.numero);

/**
 * Mazo de bits: héroe, acciones y grupos de 20 (método Doman: sesiones cortas).
 * Las palabras sin imagen se muestran como bits de lectura pura.
 */
export default function DeckView({ hero, title, items, lang = 'es', color = '#E8412C', extraActions = [] }) {
  const { settings } = useStore();
  const [overlay, setOverlay] = useState(null);
  const [flipped, setFlipped] = useState({});
  const [grupo, setGrupo] = useState(0);
  const [order, setOrder] = useState('orden');

  const grupos = useMemo(() => {
    const out = [];
    for (let i = 0; i < items.length; i += TAM_GRUPO) out.push(items.slice(i, i + TAM_GRUPO));
    return out;
  }, [items]);
  const actual = grupos[grupo] || [];
  const conImagen = useMemo(() => items.filter(tieneImagen), [items]);
  const en = lang === 'en';

  const abrirBits = (lista, titulo) => {
    sfx.pop();
    setOverlay({ type: 'bits', items: order === 'azar' ? shuffle(lista) : lista, title: titulo });
  };

  const tapCard = (it, key) => {
    sfx.pop();
    speak(it.texto, lang);
    setFlipped((f) => ({ ...f, [key]: !f[key] }));
  };

  return (
    <div className="deck" style={{ '--accent': color }}>
      <section className="deck-hero">
        <div className="deck-hero-art">{hero}</div>
        <div className="deck-hero-info">
          <h1 className="deck-title">{title}</h1>
          <p className="deck-sub">
            {items.length} {en ? 'words' : 'bits'} · {conImagen.length} {en ? 'with picture' : 'con imagen'} · {en ? 'tap a card to hear it' : 'toca una tarjeta para escucharla'}
          </p>
          <div className="deck-actions">
            <button className="btn btn-xl btn-accent" onClick={() => abrirBits(actual, `${title} · ${en ? 'group' : 'grupo'} ${grupo + 1}`)}>
              ⚡ {en ? `Flash group ${grupo + 1}` : `Bits del grupo ${grupo + 1}`}
            </button>
            {items.length > TAM_GRUPO && (
              <button className="btn btn-xl btn-white" onClick={() => { sfx.pop(); setOverlay({ type: 'bits', items: shuffle(items).slice(0, 15), title: `${title} · 15 ${en ? 'random' : 'al azar'}` }); }}>
                🎲 {en ? '15 random' : '15 al azar'}
              </button>
            )}
            {conImagen.length >= 2 && (
              <>
                <button className="btn btn-xl btn-gold" onClick={() => { sfx.pop(); setOverlay({ type: 'quiz', mode: 'leer' }); }}>
                  🎯 {en ? 'Read & find' : 'Lee y encuentra'}
                </button>
                <button className="btn btn-xl btn-blue" onClick={() => { sfx.pop(); setOverlay({ type: 'quiz', mode: 'ver' }); }}>
                  👀 {en ? 'Look & read' : 'Mira y lee'}
                </button>
              </>
            )}
            {extraActions.map((a) => (
              <button key={a.label} className="btn btn-xl btn-white" onClick={() => { sfx.pop(); a.onClick(setOverlay); }}>{a.label}</button>
            ))}
          </div>
          <div className="seg">
            <button className={order === 'orden' ? 'on' : ''} onClick={() => setOrder('orden')}>{en ? 'In order' : 'En orden'}</button>
            <button className={order === 'azar' ? 'on' : ''} onClick={() => setOrder('azar')}>🎲 {en ? 'Shuffle' : 'Mezclar'}</button>
          </div>
        </div>
      </section>

      {grupos.length > 1 && (
        <div className="groups">
          <span className="groups-label">{en ? 'Groups' : 'Grupos'}:</span>
          {grupos.map((g, i) => (
            <button key={i} className={`group-chip ${i === grupo ? 'on' : ''}`} onClick={() => { sfx.tap(); setGrupo(i); setFlipped({}); }}>
              {i * TAM_GRUPO + 1}–{i * TAM_GRUPO + g.length}
            </button>
          ))}
        </div>
      )}

      <section className="card-grid" key={grupo}>
        {actual.map((it, i) => {
          const key = `${grupo}-${i}`;
          const img = tieneImagen(it);
          return (
            <button
              key={key}
              className={`flip-card ${flipped[key] ? 'flipped' : ''} ${img ? '' : 'solo-palabra'}`}
              style={{ animationDelay: `${Math.min(i * 35, 700)}ms` }}
              onClick={() => tapCard(it, key)}
            >
              <span className="flip-inner">
                <span className="flip-face flip-front">
                  {img ? <Visual item={it} className="card-visual" /> : it.letra && <span className="card-letter">{settings.upper ? it.letra.toUpperCase() : it.letra}</span>}
                  <Word text={it.texto} letra={it.letra} upper={settings.upper} className={img ? 'card-word' : 'card-word-big'} />
                </span>
                <span className="flip-face flip-back">
                  <Word text={it.texto} letra={it.letra} upper={settings.upper} className="card-word-big" />
                </span>
              </span>
            </button>
          );
        })}
      </section>

      {grupos.length > 1 && (
        <div className="center-row">
          {grupo < grupos.length - 1 && (
            <button className="btn btn-xl btn-white" onClick={() => { sfx.tap(); setGrupo(grupo + 1); setFlipped({}); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              {en ? 'Next group' : 'Siguiente grupo'} ⟶
            </button>
          )}
        </div>
      )}

      {overlay?.type === 'bits' && (
        <BitPlayer items={overlay.items} lang={lang} title={overlay.title || title} onClose={() => setOverlay(null)} {...(overlay.props || {})} />
      )}
      {overlay?.type === 'quiz' && (
        <QuizGame pool={conImagen} lang={lang} mode={overlay.mode} title={title} onClose={() => setOverlay(null)} />
      )}
    </div>
  );
}
