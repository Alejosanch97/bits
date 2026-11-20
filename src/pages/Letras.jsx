import { Link } from 'react-router-dom';
import { useState } from 'react';
import { LETRAS, TODAS_LAS_PALABRAS, PALABRAS_CON_IMAGEN } from '../data/espanol.js';
import { useStore } from '../lib/store.jsx';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import BitPlayer from '../components/BitPlayer.jsx';
import QuizGame from '../components/QuizGame.jsx';
import Chispa from '../components/Chispa.jsx';

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);

export default function Letras() {
  const { settings } = useStore();
  const [overlay, setOverlay] = useState(null);
  const vocales = LETRAS.filter((l) => l.tipo === 'vocal');
  const consonantes = LETRAS.filter((l) => l.tipo === 'consonante');
  const L = (l) => (settings.upper ? l.toUpperCase() : l);

  const Balloon = ({ l, i }) => (
    <Link
      to={`/letras/${l.letra}`}
      className="balloon"
      style={{ '--c': l.color, animationDelay: `${(i % 9) * 0.18}s` }}
      onMouseEnter={() => sfx.tap()}
      onClick={() => { sfx.pop(); speak(l.letra); }}
    >
      <span className="balloon-body">{L(l.letra)}</span>
      <span className="balloon-string" />
      <small>{l.palabras.length} bits</small>
    </Link>
  );

  return (
    <div className="page page-letras">
      <section className="world-header wh-letras">
        <div>
          <h1>Mundo de Letras</h1>
          <p>Escoge una letra y descubre sus palabras mágicas · {TODAS_LAS_PALABRAS.length.toLocaleString('es-CO')} palabras</p>
          <div className="deck-actions">
            <button className="btn btn-xl btn-accent" onClick={() => setOverlay({ type: 'bits', items: shuffle(PALABRAS_CON_IMAGEN).slice(0, 15) })}>⚡ Mezcla mágica (15 bits)</button>
            <button className="btn btn-xl btn-gold" onClick={() => setOverlay({ type: 'quiz' })}>🎯 Reto de lectura</button>
            <button className="btn btn-xl btn-white" onClick={() => setOverlay({ type: 'bits', items: vocales.map((v) => ({ texto: v.letra, letra: v.letra, emoji: v.palabras[0].emoji })) })}>🅰️ Bits de vocales</button>
          </div>
        </div>
        <Chispa size={150} message="¡Toca un globo!" />
      </section>

      <h2 className="section-title"><span>Vocales</span></h2>
      <div className="balloons vowels">
        {vocales.map((l, i) => <Balloon key={l.letra} l={l} i={i} />)}
      </div>

      <h2 className="section-title"><span>Consonantes</span></h2>
      <div className="balloons">
        {consonantes.map((l, i) => <Balloon key={l.letra} l={l} i={i + 5} />)}
      </div>

      {overlay?.type === 'bits' && (
        <BitPlayer items={overlay.items} title="Mezcla mágica" onClose={() => setOverlay(null)} />
      )}
      {overlay?.type === 'quiz' && (
        <QuizGame pool={PALABRAS_CON_IMAGEN} rounds={10} mode="leer" title="Reto de lectura" onClose={() => setOverlay(null)} />
      )}
    </div>
  );
}
