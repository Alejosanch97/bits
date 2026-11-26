import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Crest from '../components/Crest.jsx';
import Chispa from '../components/Chispa.jsx';
import { useStore } from '../lib/store.jsx';
import { sfx } from '../lib/sfx.js';
import { speak } from '../lib/speech.js';
import { LISTA_GRADOS } from '../data/grados.js';

const SECUNDARIOS = [
  { to: '/mqrb', titulo: 'Lectura rápida MQRB', sub: 'My Quick Reading Book', icono: '📘', cls: 's-mqrb' },
  { to: '/mis-bits', titulo: 'Mis bits', sub: 'Los que crea la profe', icono: '✨', cls: 's-misbits' },
  { to: '/premios', titulo: 'Premios', sub: 'Cofre y stickers', icono: '🎁', cls: 's-premios' },
  { to: '/profe', titulo: 'Profe', sub: 'Ajustes de la clase', icono: '🍎', cls: 's-profe' },
];

const SALUDOS = ['¡Hola! ¿En qué salón estamos?', '¡Escoge tu grado!', '¡Gana monedas jugando!', '¡A leer se ha dicho!'];
const BANDERINES = ['#E8412C', '#FFC531', '#2F8FD8', '#2E9E5B', '#FF8FB1', '#1D2A6B', '#F26B1D', '#7A4FD6'];
const FLOTANTES = ['a', 'm', '3', '+', 'p', '7', 'e', '★', 's', '1', 'o', '★'];

export default function Home() {
  const { coins, setSettings } = useStore();
  const [saludo, setSaludo] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSaludo((s) => (s + 1) % SALUDOS.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="home">
      <div className="home-deco" aria-hidden="true">
        <div className="bunting">
          {Array.from({ length: 22 }, (_, i) => (
            <span key={i} style={{ '--c': BANDERINES[i % BANDERINES.length], animationDelay: `${(i % 6) * 0.2}s` }} />
          ))}
        </div>
        <span className="cloud c1" /><span className="cloud c2" /><span className="cloud c3" />
        {FLOTANTES.map((f, i) => <span key={i} className={`floater f${i}`} style={{ '--i': i }}>{f}</span>)}
        <div className="hills" />
      </div>

      <header className="home-head">
        <div className="home-crest" onClick={() => { sfx.chest(); speak('Instituto Pedagógico Crear'); }}>
          <Crest size={150} />
        </div>
        <div className="home-titles">
          <p className="home-school">Instituto Pedagógico <b>CREAR</b></p>
          <h1 className="home-title">
            {'Bits Mágicos'.split('').map((c, i) => (
              <span key={i} className={`ch ${c === ' ' ? 'sp' : ''}`} style={{ '--i': i }}>{c === ' ' ? ' ' : c}</span>
            ))}
          </h1>
          <p className="home-sub">¿Qué grado vamos a ver hoy?</p>
        </div>
      </header>

      <nav className="menu-main grados" aria-label="Grados">
        {LISTA_GRADOS.map((g, i) => (
          <Link
            key={g.id}
            to={`/g/${g.id}`}
            className={`menu-tile grado-tile g-${g.id}`}
            style={{ '--gc': g.color, '--gc2': g.color2, animationDelay: `${0.1 + i * 0.1}s` }}
            onMouseEnter={() => sfx.tap()}
            onClick={() => { sfx.pop(); speak(g.nombre); setSettings({ grado: g.id }); }}
          >
            <span className="tile-badge grado-badge">
              <span className="gb-icon">{g.icono}</span>
              <b>{g.corto}</b>
            </span>
            <span className="tile-text">
              <b>{g.nombre}</b>
              <small>{g.ingles} · {g.edad}</small>
              <em>{g.letras.length} letras · números hasta {g.numeros.max.toLocaleString('es-CO')}</em>
            </span>
            <span className="tile-go">Entrar ▶</span>
          </Link>
        ))}
      </nav>

      <nav className="menu-sec" aria-label="Más">
        {SECUNDARIOS.map((m, i) => (
          <Link key={m.to} to={m.to} className={`sec-tile ${m.cls}`} style={{ animationDelay: `${0.45 + i * 0.08}s` }} onClick={() => sfx.pop()}>
            <span className="sec-icon">{m.icono}</span>
            <span className="sec-text"><b>{m.titulo}</b><small>{m.to === '/premios' ? `${coins} monedas` : m.sub}</small></span>
          </Link>
        ))}
      </nav>

      <div className="home-chispa" onClick={() => { sfx.pop(); speak(SALUDOS[saludo].replace(/[¡!¿?]/g, '')); }}>
        <Chispa size={110} message={SALUDOS[saludo]} />
      </div>
    </div>
  );
}
