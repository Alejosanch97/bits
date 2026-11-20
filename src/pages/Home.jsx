import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Crest from '../components/Crest.jsx';
import Chispa from '../components/Chispa.jsx';
import { useStore } from '../lib/store.jsx';
import { sfx } from '../lib/sfx.js';
import { speak } from '../lib/speech.js';
import { TODAS_LAS_PALABRAS } from '../data/espanol.js';
import { ENGLISH } from '../data/english.js';

const TOTAL_ES = TODAS_LAS_PALABRAS.length;
const TOTAL_EN = ENGLISH.reduce((s, c) => s + c.items.length, 0);

const PRINCIPALES = [
  { to: '/letras', titulo: 'Letras', sub: 'Lengua Castellana', info: `${TOTAL_ES.toLocaleString('es-CO')} palabras`, icono: 'a', cls: 'm-letras', voz: 'Mundo de letras' },
  { to: '/numeros', titulo: 'Números', sub: 'Matemáticas', info: 'Puntos, 0 al 1000, sumas', icono: '123', cls: 'm-numeros', voz: 'Mundo de números' },
  { to: '/english', titulo: 'English', sub: 'Inglés', info: `${TOTAL_EN} words`, icono: 'Hi!', cls: 'm-english', voz: 'English Island' },
];

const SECUNDARIOS = [
  { to: '/mis-bits', titulo: 'Mis bits', sub: 'Los que crea la profe', icono: '✨', cls: 's-misbits' },
  { to: '/premios', titulo: 'Premios', sub: 'Cofre y stickers', icono: '🎁', cls: 's-premios' },
  { to: '/profe', titulo: 'Profe', sub: 'Ajustes de la clase', icono: '🍎', cls: 's-profe' },
];

const SALUDOS = ['¡Hola! ¿Qué aprendemos hoy?', '¡Escoge un mundo!', '¡Gana monedas jugando!', '¡A leer se ha dicho!'];
const BANDERINES = ['#E8412C', '#FFC531', '#2F8FD8', '#2E9E5B', '#FF8FB1', '#1D2A6B', '#F26B1D', '#7A4FD6'];
const FLOTANTES = ['a', 'm', '3', '+', 'p', '7', 'e', '★', 's', '1', 'o', '★'];

export default function Home() {
  const { coins, settings } = useStore();
  const [saludo, setSaludo] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSaludo((s) => (s + 1) % SALUDOS.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="home">
      {/* Decoración (no se puede tocar) */}
      <div className="home-deco" aria-hidden="true">
        <div className="bunting">
          {Array.from({ length: 22 }, (_, i) => (
            <span key={i} style={{ '--c': BANDERINES[i % BANDERINES.length], animationDelay: `${(i % 6) * 0.2}s` }} />
          ))}
        </div>
        <span className="cloud c1" /><span className="cloud c2" /><span className="cloud c3" />
        {FLOTANTES.map((f, i) => (
          <span key={i} className={`floater f${i}`} style={{ '--i': i }}>{f}</span>
        ))}
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
          <p className="home-sub">{settings.clase} · escoge un mundo para empezar</p>
        </div>
      </header>

      <nav className="menu-main" aria-label="Mundos">
        {PRINCIPALES.map((m, i) => (
          <Link
            key={m.to}
            to={m.to}
            className={`menu-tile ${m.cls}`}
            style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            onMouseEnter={() => sfx.tap()}
            onClick={() => { sfx.pop(); speak(m.voz); }}
          >
            <span className="tile-badge">{m.icono}</span>
            <span className="tile-text">
              <b>{m.titulo}</b>
              <small>{m.sub}</small>
              <em>{m.info}</em>
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
