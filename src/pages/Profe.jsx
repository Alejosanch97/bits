import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { bigCelebration } from '../lib/fx.js';
import Chispa from '../components/Chispa.jsx';

export default function Profe() {
  const { settings, setSettings, addCoins, resetProgress, coins } = useStore();
  const give = (n, e) => { addCoins(n, e.currentTarget); };

  return (
    <div className="page page-profe">
      <section className="world-header wh-profe">
        <div>
          <h1>Rincón de la Profe</h1>
          <p>Ajusta la clase, premia a tus estudiantes y aprende a usar los bits.</p>
        </div>
        <Chispa size={130} message="¡Gracias, profe!" />
      </section>

      <div className="profe-grid">
        <section className="panel">
          <h2>🏅 Premiar a la clase</h2>
          <p className="muted">Monedas por buen comportamiento, participación o trabajo en equipo.</p>
          <div className="row gap wrap">
            <button className="btn btn-gold" onClick={(e) => give(1, e)}>+1 ★</button>
            <button className="btn btn-gold" onClick={(e) => give(5, e)}>+5 ★</button>
            <button className="btn btn-gold" onClick={(e) => give(10, e)}>+10 ★</button>
            <button className="btn btn-accent" onClick={() => { sfx.fanfare(); bigCelebration(); speak(`¡Felicitaciones, ${settings.clase}!`); }}>🎉 ¡Celebración!</button>
          </div>
          <p className="muted small">La clase tiene {coins} monedas.</p>
        </section>

        <section className="panel">
          <h2>⚙️ Ajustes de la clase</h2>
          <label className="field">Nombre del grupo
            <input value={settings.clase} onChange={(e) => setSettings({ clase: e.target.value })} placeholder="Ej: Transición A" />
          </label>
          <label className="field">Velocidad de los bits: <b>{(settings.speed / 1000).toFixed(1)} s</b>
            <input type="range" min="600" max="3500" step="100" value={settings.speed} onChange={(e) => setSettings({ speed: Number(e.target.value) })} />
          </label>
          <label className="field">Velocidad de la voz: <b>{settings.rate.toFixed(2)}</b>
            <input type="range" min="0.5" max="1.3" step="0.05" value={settings.rate} onChange={(e) => setSettings({ rate: Number(e.target.value) })} />
          </label>
          <div className="toggles">
            <label><input type="checkbox" checked={settings.voice} onChange={(e) => setSettings({ voice: e.target.checked })} /> Voz</label>
            <label><input type="checkbox" checked={settings.sound} onChange={(e) => setSettings({ sound: e.target.checked })} /> Sonidos</label>
            <label><input type="checkbox" checked={settings.showImage} onChange={(e) => setSettings({ showImage: e.target.checked })} /> Imagen después de la palabra</label>
            <label><input type="checkbox" checked={settings.upper} onChange={(e) => setSettings({ upper: e.target.checked })} /> MAYÚSCULAS</label>
          </div>
          <div className="row gap wrap">
            <button className="btn btn-white" onClick={() => speak('Hola, soy la voz de los bits del Instituto Pedagógico Crear')}>🔊 Probar voz</button>
            <button className="btn btn-white" onClick={() => speak('Hello! Welcome to English Island', 'en')}>🔊 Test English</button>
            <button className="btn btn-danger" onClick={() => { if (window.confirm('¿Reiniciar monedas y stickers de la clase?')) resetProgress(); }}>Reiniciar progreso</button>
          </div>
        </section>

        <section className="panel panel-wide misbits-link">
          <h2>✨ ¿Quieres crear tus propios bits?</h2>
          <p>Ahora están en su propia sección, con mazos, fotos y copia de seguridad.</p>
          <Link to="/mis-bits" className="btn btn-accent btn-xl">Ir a Mis bits ▶</Link>
        </section>

        <section className="panel panel-wide tips">
          <h2>📚 Cómo usar los bits (Glenn Doman)</h2>
          <ul>
            <li><b>Sesiones cortas y alegres:</b> 3 veces al día, 10–15 bits por sesión, siempre terminando antes de que los niños quieran parar.</li>
            <li><b>Rápido es mejor:</b> cada bit dura alrededor de 1 segundo. Usa ⚡ Rayo cuando ya conozcan las palabras.</li>
            <li><b>Primero la palabra, luego la imagen:</b> desactiva “Imagen” para trabajar lectura pura.</li>
            <li><b>Juegos como premio:</b> “Lee y encuentra” y “¿Cuántos hay?” convierten lo aprendido en monedas para el cofre.</li>
            <li><b>Proyección:</b> usa ⛶ para pantalla completa en el video beam. Teclado: espacio = pausa, flechas = avanzar/retroceder, Esc = salir.</li>
          </ul>
        </section>
      </div>

    </div>
  );
}
