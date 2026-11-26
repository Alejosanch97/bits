import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useGrado } from '../lib/grado.js';
import { useStore } from '../lib/store.jsx';
import { sfx } from '../lib/sfx.js';
import { speak } from '../lib/speech.js';
import { juegosDeGrado } from '../games/index.js';
import { englishDeGrado } from '../data/english.js';
import Chispa from '../components/Chispa.jsx';

// Menú de un grado: todo lo de ese salón en un solo lugar
export default function GradoHub() {
  const { g, to } = useGrado();
  const { setSettings, settings } = useStore();
  const nJuegos = juegosDeGrado(g.id).length;
  const nPal = g.letras.reduce((s, l) => s + l.palabras.length, 0);

  useEffect(() => { if (settings.grado !== g.id) setSettings({ grado: g.id }); }, [g.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const CARDS = [
    { path: '/letras', titulo: 'Letras', sub: `Lengua Castellana · ${g.letras.length} letras · ${nPal} bits`, icono: 'a', cls: 'hc-letras' },
    { path: '/lector', titulo: 'Lector Cohete', sub: `Lectura rápida · ${g.lecturas.length} lecturas del libro`, icono: '🚀', cls: 'hc-lector' },
    { path: '/numeros', titulo: 'Números', sub: g.numeros.temas, icono: '123', cls: 'hc-numeros' },
    { path: '/juegos', titulo: 'Juegos', sub: `${nJuegos} juegos para ${g.nombre}`, icono: '🎮', cls: 'hc-juegos' },
    { path: '/english', titulo: 'English', sub: `${englishDeGrado(g.id).length} worlds · ${englishDeGrado(g.id).reduce((s, m) => s + m.items.length, 0)} words`, icono: 'Hi!', cls: 'hc-english' },
  ];

  return (
    <div className="page page-grado" style={{ '--gc': g.color, '--gc2': g.color2 }}>
      <section className="grado-head">
        <div className="gh-badge"><span>{g.icono}</span><b>{g.corto}</b></div>
        <div className="gh-text">
          <h1>{g.nombre}</h1>
          <p>{g.ingles} · {g.edad} · Instituto Pedagógico CREAR</p>
        </div>
        <Chispa size={120} message={`¡Hola, ${g.nombre}!`} />
      </section>

      <nav className="grado-grid">
        {CARDS.map((c, i) => (
          <Link
            key={c.path}
            to={to(c.path)}
            className={`grado-card ${c.cls}`}
            style={{ animationDelay: `${i * 70}ms` }}
            onMouseEnter={() => sfx.tap()}
            onClick={() => { sfx.pop(); speak(c.titulo); }}
          >
            <span className="gcard-icon">{c.icono}</span>
            <span className="gcard-text"><b>{c.titulo}</b><small>{c.sub}</small></span>
            <span className="gcard-go">▶</span>
          </Link>
        ))}
        <Link to="/mqrb" className="grado-card hc-mqrb" style={{ animationDelay: '360ms' }} onClick={() => sfx.pop()}>
          <span className="gcard-icon">📘</span>
          <span className="gcard-text"><b>MQRB</b><small>My Quick Reading Book · igual para los tres grados</small></span>
          <span className="gcard-go">▶</span>
        </Link>
      </nav>

      <nav className="grado-switch">
        <span>Cambiar de grado:</span>
        {['pj', 'j', 't'].filter((x) => x !== g.id).map((x) => (
          <Link key={x} to={`/g/${x}`} className="btn btn-white" onClick={() => sfx.tap()}>{x === 'pj' ? 'Pre-Jardín' : x === 'j' ? 'Jardín' : 'Transición'}</Link>
        ))}
        <Link to="/" className="btn btn-white">🏠 Inicio</Link>
      </nav>
    </div>
  );
}
