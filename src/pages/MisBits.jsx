import { useMemo, useRef, useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import BitPlayer from '../components/BitPlayer.jsx';
import QuizGame from '../components/QuizGame.jsx';
import Visual, { Word } from '../components/Visual.jsx';
import Chispa from '../components/Chispa.jsx';
import { MAZOS_COLEGIO, parsePalabras } from '../data/mis-bits.js';

const COLORES = ['#E8412C', '#2F8FD8', '#2E9E5B', '#7A4FD6', '#F26B1D', '#E0598B'];
const conImagen = (b) => !!(b.emoji || b.img);

function resizeImage(file, max = 480) {
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
        resolve(c.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function MazoCard({ mazo, onPlay, onQuiz, onDelete, i }) {
  const conImg = mazo.items.filter(conImagen);
  return (
    <div className="mazo" style={{ '--c': mazo.color || COLORES[i % COLORES.length], animationDelay: `${i * 60}ms` }}>
      <div className="mazo-head">
        <span className="mazo-emojis">{mazo.items.slice(0, 3).map((b, k) => <span key={k}>{b.emoji || '🔤'}</span>)}</span>
        <div>
          <b>{mazo.nombre}</b>
          <small>{mazo.items.length} bits · {mazo.lang === 'en' ? 'Inglés' : 'Español'}{mazo.origen === 'colegio' ? ' · del colegio' : ''}</small>
        </div>
      </div>
      <div className="mazo-words">
        {mazo.items.slice(0, 14).map((b) => (
          <button key={b.id || b.texto} className="mazo-word" onClick={() => speak(b.texto, mazo.lang)}>
            {b.img ? <img src={b.img} alt="" /> : b.emoji ? <span>{b.emoji}</span> : null}
            {b.texto}
            {onDelete && <i onClick={(e) => { e.stopPropagation(); onDelete(b); }} title="Borrar">✕</i>}
          </button>
        ))}
        {mazo.items.length > 14 && <span className="mazo-more">+{mazo.items.length - 14}</span>}
      </div>
      <div className="row gap wrap">
        <button className="btn btn-accent" style={{ '--accent': mazo.color || COLORES[i % COLORES.length] }} onClick={onPlay}>⚡ Bits</button>
        {conImg.length >= 2 && <button className="btn btn-gold" onClick={onQuiz}>🎯 Juego</button>}
      </div>
    </div>
  );
}

export default function MisBits() {
  const { settings, custom, addCustom, importCustom, removeCustom } = useStore();
  const [texto, setTexto] = useState('');
  const [emoji, setEmoji] = useState('');
  const [img, setImg] = useState('');
  const [lang, setLang] = useState('es');
  const [mazoNombre, setMazoNombre] = useState('Mis bits');
  const [overlay, setOverlay] = useState(null);
  const [codigo, setCodigo] = useState('');
  const fileRef = useRef(null);
  const importRef = useRef(null);

  const letra = texto.trim() ? texto.trim()[0].toLowerCase() : '';

  // Mazos del archivo (todos los computadores) + mazos creados en este computador
  const mazosColegio = useMemo(() => MAZOS_COLEGIO.map((m) => ({ ...m, origen: 'colegio', items: parsePalabras(m.palabras, m.lang) })), []);
  const mazosLocales = useMemo(() => {
    const map = new Map();
    for (const b of custom) {
      const nombre = b.mazo || 'Mis bits';
      const k = `${nombre}|${b.lang || 'es'}`;
      if (!map.has(k)) map.set(k, { nombre, lang: b.lang || 'es', origen: 'local', items: [] });
      map.get(k).items.push(b);
    }
    return [...map.values()];
  }, [custom]);
  const nombresMazos = [...new Set(['Mis bits', ...mazosLocales.map((m) => m.nombre)])];

  const save = () => {
    const t = texto.trim().toLowerCase();
    if (!t) return;
    addCustom({ texto: t, emoji: emoji.trim() || null, img: img || null, letra: lang === 'es' ? t[0] : null, lang, mazo: mazoNombre.trim() || 'Mis bits' });
    sfx.correct();
    speak(t, lang);
    setTexto(''); setEmoji(''); setImg('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try { setImg(await resizeImage(f)); } catch { /* imagen inválida */ }
  };

  const exportar = () => {
    const blob = new Blob([JSON.stringify({ app: 'bits-crear', version: 1, bits: custom }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mis-bits-crear-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importar = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      const list = Array.isArray(data) ? data : data.bits;
      if (!Array.isArray(list)) throw new Error('formato');
      importCustom(list);
      sfx.correct();
      window.alert(`¡Listo! Se importaron ${list.length} bits.`);
    } catch {
      window.alert('Ese archivo no es una copia de Mis bits.');
    }
    e.target.value = '';
  };

  const pasarAlArchivo = () => {
    const bloques = mazosLocales.map((m) => {
      const pal = m.items.map((b) => `${b.texto.replace(/ /g, '_')}${b.emoji ? `:${b.emoji}` : ''}`).join(' ');
      return `  {\n    nombre: '${m.nombre.replace(/'/g, "\\'")}',\n    lang: '${m.lang}',\n    color: '#2E9E5B',\n    palabras: '${pal.replace(/'/g, "\\'")}',\n  },`;
    });
    setCodigo(bloques.join('\n'));
  };

  const borrarBit = (b) => { if (window.confirm(`¿Borrar "${b.texto}"?`)) removeCustom(b.id); };

  return (
    <div className="page page-misbits">
      <section className="world-header wh-misbits">
        <div>
          <h1>Mis bits</h1>
          <p>Crea tus propios mazos de palabras con emoji o foto, y úsalos como bits o como juego.</p>
        </div>
        <Chispa size={130} message="¡Crea tus bits, profe!" />
      </section>

      <section className="panel creator-panel">
        <h2>✨ Crear un bit nuevo</h2>
        <div className="creator">
          <div className="creator-form">
            <div className="seg">
              <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}>Español</button>
              <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
            </div>
            <label className="field">Palabra
              <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ej: mariposa" onKeyDown={(e) => e.key === 'Enter' && save()} />
            </label>
            <div className="two-cols">
              <label className="field">Emoji (opcional)
                <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🦋" maxLength={8} />
              </label>
              <label className="field">Mazo
                <input list="mazos-list" value={mazoNombre} onChange={(e) => setMazoNombre(e.target.value)} placeholder="Ej: Animales de la granja" />
                <datalist id="mazos-list">{nombresMazos.map((n) => <option key={n} value={n} />)}</datalist>
              </label>
            </div>
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
      </section>

      <section className="panel storage-note">
        <div>
          <h3>💾 ¿Dónde se guardan?</h3>
          <p>
            Los bits que creas aquí se guardan <b>en este navegador, en este computador</b> (no necesitan internet ni servidor).
            Para llevarlos a otro computador usa <b>Exportar</b> y luego <b>Importar</b> allá.
            Para que aparezcan en <b>todos</b> los computadores, usa <b>Pasar al archivo</b> y pega el texto en <code>src/data/mis-bits.js</code>.
          </p>
        </div>
        <div className="row gap wrap">
          <button className="btn btn-white" onClick={exportar} disabled={!custom.length}>⬇️ Exportar</button>
          <button className="btn btn-white" onClick={() => importRef.current?.click()}>⬆️ Importar</button>
          <button className="btn btn-blue" onClick={pasarAlArchivo} disabled={!custom.length}>📄 Pasar al archivo</button>
          <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importar} />
        </div>
        {codigo && (
          <div className="code-box">
            <p className="small">Copia esto y pégalo dentro de <code>MAZOS_COLEGIO</code> en <code>src/data/mis-bits.js</code> (las fotos subidas no pasan al archivo; usa emojis o pon la foto en <code>public/</code>):</p>
            <textarea readOnly value={codigo} onFocus={(e) => e.target.select()} />
            <button className="btn btn-gold" onClick={() => navigator.clipboard?.writeText(codigo)}>📋 Copiar</button>
          </div>
        )}
      </section>

      {mazosLocales.length > 0 && (
        <>
          <h2 className="section-title"><span>Creados en este computador</span></h2>
          <div className="mazos-grid">
            {mazosLocales.map((m, i) => (
              <MazoCard
                key={`${m.nombre}-${m.lang}`}
                mazo={m}
                i={i}
                onPlay={() => setOverlay({ type: 'bits', items: m.items, lang: m.lang, title: m.nombre })}
                onQuiz={() => setOverlay({ type: 'quiz', items: m.items.filter(conImagen), lang: m.lang, title: m.nombre })}
                onDelete={borrarBit}
              />
            ))}
          </div>
        </>
      )}

      <h2 className="section-title"><span>Bits del colegio</span></h2>
      <div className="mazos-grid">
        {mazosColegio.map((m, i) => (
          <MazoCard
            key={m.nombre}
            mazo={m}
            i={i + 2}
            onPlay={() => setOverlay({ type: 'bits', items: m.items, lang: m.lang, title: m.nombre })}
            onQuiz={() => setOverlay({ type: 'quiz', items: m.items.filter(conImagen), lang: m.lang, title: m.nombre })}
          />
        ))}
      </div>

      {overlay?.type === 'bits' && <BitPlayer items={overlay.items} lang={overlay.lang} title={overlay.title} onClose={() => setOverlay(null)} />}
      {overlay?.type === 'quiz' && <QuizGame pool={overlay.items} lang={overlay.lang} mode="leer" title={overlay.title} onClose={() => setOverlay(null)} />}
    </div>
  );
}
