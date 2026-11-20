import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { sfx } from '../lib/sfx.js';
import Crest from './Crest.jsx';

export default function Hud() {
  const { coins, settings, setSettings } = useStore();
  const loc = useLocation();
  const nav = useNavigate();
  const [full, setFull] = useState(false);
  const home = loc.pathname === '/';

  useEffect(() => {
    const f = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', f);
    return () => document.removeEventListener('fullscreenchange', f);
  }, []);

  const toggleFull = () => {
    sfx.tap();
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  };

  return (
    <header className={`hud ${home ? 'hud-home' : ''}`}>
      <div className="hud-left">
        {!home && (
          <button className="hud-btn hud-back" onClick={() => { sfx.tap(); nav(-1); }} aria-label="Volver">⟵</button>
        )}
        <Link to="/" className="hud-brand" onClick={() => sfx.tap()}>
          <Crest size={46} interactive={false} className="crest-mini" />
          <span className="hud-brand-text">
            <b>Bits CREAR</b>
            <small>Instituto Pedagógico CREAR</small>
          </span>
        </Link>
      </div>
      <div className="hud-right">
        <Link to="/premios" className="coin-counter" id="coin-target" onClick={() => sfx.tap()} title="Cofre de premios">
          <span className="coin-icon">★</span>
          <b>{coins}</b>
        </Link>
        <button className={`hud-btn ${settings.voice ? '' : 'off'}`} onClick={() => setSettings({ voice: !settings.voice })} title="Voz">
          {settings.voice ? '🗣️' : '🤐'}
        </button>
        <button className={`hud-btn ${settings.sound ? '' : 'off'}`} onClick={() => setSettings({ sound: !settings.sound })} title="Sonidos">
          {settings.sound ? '🔔' : '🔕'}
        </button>
        <button className="hud-btn hud-full" onClick={toggleFull} title="Pantalla completa (video beam)">{full ? '🗗' : '⛶'}</button>
        <Link to="/profe" className="hud-btn hud-profe" onClick={() => sfx.tap()} title="Rincón de la profe">🍎</Link>
      </div>
    </header>
  );
}
