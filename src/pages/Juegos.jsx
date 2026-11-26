import { Link, useNavigate, useParams } from 'react-router-dom';
import { islasDeGrado, juegoDeGrado } from '../games/index.js';
import { useGrado } from '../lib/grado.js';
import GameShell from '../games/GameShell.jsx';
import Chispa from '../components/Chispa.jsx';
import { sfx } from '../lib/sfx.js';
import { speak } from '../lib/speech.js';

export function JuegosHub() {
  const nav = useNavigate();
  const { g, to } = useGrado();
  const ISLAS = islasDeGrado(g.id);
  const JUEGOS = ISLAS.flatMap((i) => i.juegos);
  const sorpresa = () => {
    sfx.chest();
    const j = JUEGOS[Math.floor(Math.random() * JUEGOS.length)];
    nav(to(`/juegos/${j.id}`));
  };
  return (
    <div className="page page-juegos">
      <section className="world-header wh-juegos">
        <div>
          <h1>La Isla del Conocimiento</h1>
          <span className="grado-pill">{g.icono} {g.nombre}</span>
          <p>{JUEGOS.length} juegos en {ISLAS.length} islas, con niveles pensados para {g.nombre}. Combos, monedas y estrellas.</p>
          <div className="deck-actions">
            <button className="btn btn-xl btn-gold" onClick={sorpresa}>🎲 ¡Juego sorpresa!</button>
          </div>
        </div>
        <Chispa size={140} message="¡Escoge una isla!" />
      </section>

      <nav className="isla-map">
        {ISLAS.map((isla, i) => (
          <a key={isla.id} href={`#isla-${isla.id}`} className="isla-pin" style={{ '--c': isla.color, animationDelay: `${i * 0.2}s` }}
            onClick={(e) => { e.preventDefault(); sfx.pop(); speak(isla.nombre); document.getElementById(`isla-${isla.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
            <span className="pin-ico">{isla.icon}</span>
            <small>{isla.nombre.replace('Isla de ', '').replace('las ', '').replace('los ', '')}</small>
          </a>
        ))}
      </nav>

      {ISLAS.map((isla) => (
        <section key={isla.id} id={`isla-${isla.id}`} className="isla" style={{ '--c': isla.color }}>
          <header className="isla-head">
            <span className="isla-guia">{isla.guia}</span>
            <div>
              <h2>{isla.icon} {isla.nombre}</h2>
              <p>{isla.historia}</p>
            </div>
          </header>
          <div className="game-grid">
            {isla.juegos.map((j, k) => (
              <Link key={j.id} to={to(`/juegos/${j.id}`)} className="game-card" style={{ '--gc': j.color, animationDelay: `${k * 60}ms` }} onMouseEnter={() => sfx.tap()} onClick={() => sfx.pop()}>
                <span className="gc-icon">{j.icon}</span>
                <b>{j.titulo}</b>
                <small>{j.evalua}</small>
                <span className="gc-levels">{j.levels.length} niveles · ▶ Jugar</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function JuegoPage() {
  const { id } = useParams();
  const { g, to } = useGrado();
  const game = juegoDeGrado(g.id, id);
  if (!game) return <div className="page"><p>Este juego no está en {g.nombre}. <Link to={to('/juegos')}>Ver los juegos</Link></p></div>;
  return <div className="page page-juego"><GameShell game={game} key={`${g.id}-${id}`} /></div>;
}
