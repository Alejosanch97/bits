import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { useGrado } from '../lib/grado.js';
import { vocabGrado } from '../data/grados.js';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import BitPlayer from '../components/BitPlayer.jsx';
import QuizGame from '../components/QuizGame.jsx';
import Chispa from '../components/Chispa.jsx';

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);

const SECCIONES = [
  { tipo: 'vocal', titulo: 'Vocales' },
  { tipo: 'consonante', titulo: 'Consonantes' },
  { tipo: 'silaba', titulo: 'Sílabas especiales' },
  { tipo: 'combinacion', titulo: 'Combinaciones' },
];

export default function Letras() {
  const { g, to } = useGrado();
  const { settings } = useStore();
  const [overlay, setOverlay] = useState(null);
  const vocab = vocabGrado(g.id);
  const total = g.letras.reduce((s, l) => s + l.palabras.length, 0);
  const L = (s) => (settings.upper ? s.toUpperCase() : s);
  const etiqueta = (l) => (l.titulo ? l.titulo.split(' ')[0] : l.letra);

  const frases = g.letras.map((l) => ({ texto: l.frase, letra: null, frase: true }));

  return (
    <div className="page page-letras" style={{ '--gc': g.color }}>
      <section className="world-header wh-letras">
        <div>
          <span className="grado-pill">{g.icono} {g.nombre}</span>
          <h1>Mundo de Letras</h1>
          <p>Las letras del libro de {g.nombre} · {total} bits</p>
          <div className="deck-actions">
            <button className="btn btn-xl btn-accent" onClick={() => setOverlay({ type: 'bits', title: 'Mezcla mágica', items: shuffle(vocab).slice(0, 15) })}>⚡ Mezcla mágica (15)</button>
            <button className="btn btn-xl btn-gold" onClick={() => setOverlay({ type: 'quiz' })}>🎯 Reto de lectura</button>
            <button className="btn btn-xl btn-white" onClick={() => setOverlay({ type: 'bits', title: 'Frases del libro', items: frases })}>📝 Bits de frases</button>
          </div>
        </div>
        <Chispa size={150} message="¡Toca un globo!" />
      </section>

      {SECCIONES.map((sec) => {
        const lista = g.letras.filter((l) => l.tipo === sec.tipo);
        if (!lista.length) return null;
        return (
          <div key={sec.tipo}>
            <h2 className="section-title"><span>{sec.titulo}</span></h2>
            <div className={`balloons ${sec.tipo === 'vocal' ? 'vowels' : ''} ${sec.tipo === 'combinacion' || sec.tipo === 'silaba' ? 'wide' : ''}`}>
              {lista.map((l, i) => (
                <Link
                  key={l.letra}
                  to={to(`/letras/${encodeURIComponent(l.letra)}`)}
                  className="balloon"
                  style={{ '--c': l.color, animationDelay: `${(i % 9) * 0.18}s` }}
                  onMouseEnter={() => sfx.tap()}
                  onClick={() => { sfx.pop(); speak(l.titulo ? l.titulo.replace(/[·–]/g, ',') : l.letra); }}
                >
                  <span className={`balloon-body ${etiqueta(l).length > 1 ? 'multi' : ''}`}>{L(etiqueta(l))}</span>
                  <span className="balloon-string" />
                  <small>{l.titulo || `${l.palabras.length} bits`}</small>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      <Link to={to('/lector')} className="lector-banner" onClick={() => sfx.pop()}>
        <span className="lb-icon">🚀</span>
        <span className="lb-text">
          <b>Lector Cohete</b>
          <small>Lectura rápida con cronómetro · {g.lecturas.length} lecturas del libro de {g.nombre}</small>
        </span>
        <span className="btn btn-gold">¡A leer! ▶</span>
      </Link>

      {overlay?.type === 'bits' && <BitPlayer items={overlay.items} title={overlay.title} onClose={() => setOverlay(null)} />}
      {overlay?.type === 'quiz' && <QuizGame pool={vocab} rounds={10} mode="leer" title="Reto de lectura" onClose={() => setOverlay(null)} />}
    </div>
  );
}
