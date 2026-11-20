import { useRef, useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { bigCelebration } from '../lib/fx.js';
import BitPlayer from '../components/BitPlayer.jsx';
import QuizGame from '../components/QuizGame.jsx';
import Visual, { Word } from '../components/Visual.jsx';
import Chispa from '../components/Chispa.jsx';

// Reduce la imagen subida para guardarla en el navegador sin ocupar demasiado
function resizeImage(file, max = 520) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Profe() {
  const { settings, setSettings, custom, addCustom, removeCustom, addCoins, resetProgress, coins } = useStore();
  const [texto, setTexto] = useState('');
  const [emoji, setEmoji] = useState('');
  const [img, setImg] = useState('');
  const [lang, setLang] = useState('es');
  const [overlay, setOverlay] = useState(null);
  const fileRef = useRef(null);

  const letra = texto.trim() ? texto.trim()[0].toLowerCase() : '';

  const save = () => {
    if (!texto.trim()) return;
    addCustom({ texto: texto.trim().toLowerCase(), emoji: emoji.trim() || null, img: img || null, letra: lang === 'es' ? letra : null, lang });
    sfx.correct();
    setTexto(''); setEmoji(''); setImg('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try { setImg(await resizeImage(f)); } catch { /* imagen inválida */ }
  };

  const give = (n, e) => { addCoins(n, e.currentTarget); };

  const esBits = custom.filter((b) => b.lang !== 'en');
  const enBits = custom.filter((b) => b.lang === 'en');

  return (
    <div className="page page-profe">
      <section className="world-header wh-profe">
        <div>
          <h1>Rincón de la Profe</h1>
          <p>Crea tus propios bits, ajusta la clase y premia a tus estudiantes.</p>
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

        <section className="panel panel-wide">
          <h2>✨ Crear mis bits</h2>
          <div className="creator">
            <div className="creator-form">
              <div className="seg">
                <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}>Español</button>
                <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
              </div>
              <label className="field">Palabra
                <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ej: mariposa" onKeyDown={(e) => e.key === 'Enter' && save()} />
              </label>
              <label className="field">Emoji (opcional)
                <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🦋" maxLength={8} />
              </label>
              <label className="field">…o sube una foto
                <input ref={fileRef} type="file" accept="image/*" onChange={onFile} />
              </label>
              <button className="btn btn-accent btn-xl" onClick={save} disabled={!texto.trim()}>➕ Guardar bit</button>
            </div>
            <div className="creator-preview">
              <div className="bit-card bit-front mini">
                {letra && lang === 'es' && <span className="bit-letter">{letra}</span>}
                <Word text={texto || 'palabra'} letra={lang === 'es' ? letra : null} upper={settings.upper} className="bit-word" />
              </div>
              <div className="bit-card bit-back mini">
                <Visual item={{ texto, emoji: emoji || (!img ? '🖼️' : null), img }} className="bit-visual" />
              </div>
            </div>
          </div>

          {[['es', esBits, 'Mis bits en español'], ['en', enBits, 'My English bits']].map(([l, list, label]) => list.length > 0 && (
            <div key={l} className="custom-list">
              <div className="row between">
                <h3>{label} ({list.length})</h3>
                <div className="row gap">
                  <button className="btn btn-accent" onClick={() => setOverlay({ type: 'bits', items: list, lang: l })}>⚡ Bits</button>
                  {list.length >= 2 && <button className="btn btn-gold" onClick={() => setOverlay({ type: 'quiz', items: list, lang: l })}>🎯 Juego</button>}
                </div>
              </div>
              <div className="custom-grid">
                {list.map((b) => (
                  <div key={b.id} className="custom-item" onClick={() => speak(b.texto, l)}>
                    <Visual item={b} className="ci-visual" />
                    <b>{b.texto}</b>
                    <button className="ci-del" onClick={(e) => { e.stopPropagation(); removeCustom(b.id); }} aria-label="Borrar">✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
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

      {overlay?.type === 'bits' && <BitPlayer items={overlay.items} lang={overlay.lang} title="Mis bits" onClose={() => setOverlay(null)} />}
      {overlay?.type === 'quiz' && <QuizGame pool={overlay.items} lang={overlay.lang} mode="leer" title="Mis bits" onClose={() => setOverlay(null)} />}
    </div>
  );
}
