import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import Crest from '../components/Crest.jsx';
import Chispa from '../components/Chispa.jsx';
import Scene3D from '../components/Scene3D.jsx';
import { useStore } from '../lib/store.jsx';
import { sfx } from '../lib/sfx.js';
import { speak } from '../lib/speech.js';

const WORLDS = [
  { to: '/letras', title: 'Mundo de Letras', sub: 'Lengua Castellana', icon: 'a', cls: 'w-letras', deco: ['m', 'p', 's'] },
  { to: '/numeros', title: 'Mundo de Números', sub: 'Matemáticas · hasta el 1000', icon: '7', cls: 'w-numeros', deco: ['+', '3', '='] },
  { to: '/english', title: 'English Island', sub: 'Inglés · vocabulario', icon: 'Hi', cls: 'w-english', deco: ['🐮', '🍎', '🚌'] },
];

const SALUDOS = [
  '¡Hola! Soy Chispa. ¿Jugamos?',
  '¡Toca los cubos de colores!',
  '¡Hoy vamos a leer un montón!',
  '¡Gana monedas y abre el cofre!',
];

export default function Home() {
  const { settings, coins } = useStore();
  const [saludo, setSaludo] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.from('.home-crest', { scale: 0, rotate: -25, duration: 1.1, ease: 'elastic.out(1, 0.55)' })
      .from('.home-title .ch', { y: 80, opacity: 0, rotate: () => gsap.utils.random(-30, 30), stagger: 0.035, duration: 0.7, ease: 'back.out(2)' }, '-=0.6')
      .from('.home-sub', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.world', { y: 120, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'back.out(1.6)' }, '-=0.3')
      .from('.home-mini', { scale: 0, stagger: 0.08, duration: 0.5, ease: 'back.out(2)' }, '-=0.4');
    const id = setInterval(() => setSaludo((s) => (s + 1) % SALUDOS.length), 4200);
    return () => { tl.kill(); clearInterval(id); };
  }, []);

  const title = 'Bits Mágicos';

  return (
    <div className="home">
      <Scene3D labels={['a', 'e', 'i', 'o', 'u', 'm', 'p', '1', '2', '3', '+', 'A', 'B', 'C']} />
      <div className="home-paper" />

      <section className="home-hero">
        <div className="home-crest" onClick={() => { sfx.chest(); speak('Instituto Pedagógico Crear'); }}>
          <Crest size={190} />
        </div>
        <p className="home-school">Instituto Pedagógico <b>CREAR</b></p>
        <h1 className="home-title" aria-label={title}>
          {title.split('').map((c, i) => (
            <span key={i} className={`ch ${c === ' ' ? 'sp' : ''}`} style={{ '--i': i }}>{c === ' ' ? ' ' : c}</span>
          ))}
        </h1>
        <p className="home-sub">Leer, contar y jugar · {settings.clase}</p>
      </section>

      <section className="worlds">
        {WORLDS.map((w) => (
          <Link key={w.to} to={w.to} className={`world ${w.cls}`} onMouseEnter={() => sfx.tap()} onClick={() => { sfx.pop(); speak(w.title); }}>
            <span className="world-island">
              <span className="world-icon">{w.icon}</span>
              {w.deco.map((d, i) => <span key={i} className={`world-deco d${i}`}>{d}</span>)}
            </span>
            <span className="world-text">
              <b>{w.title}</b>
              <small>{w.sub}</small>
            </span>
            <span className="world-go">¡Vamos! ➜</span>
          </Link>
        ))}
      </section>

      <section className="home-minis">
        <Link to="/premios" className="home-mini mini-cofre" onClick={() => sfx.pop()}>
          <span className="mini-ico">🎁</span>
          <span><b>Cofre de premios</b><small>{coins} monedas</small></span>
        </Link>
        <Link to="/profe" className="home-mini mini-profe" onClick={() => sfx.pop()}>
          <span className="mini-ico">🍎</span>
          <span><b>Rincón de la profe</b><small>Mis bits y ajustes</small></span>
        </Link>
      </section>

      <div className="home-chispa" onClick={() => { sfx.pop(); speak(SALUDOS[saludo].replace(/[¡!¿?]/g, '')); }}>
        <Chispa size={130} message={SALUDOS[saludo]} />
      </div>
    </div>
  );
}
