import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../lib/store.jsx';
import { speak, stopSpeech } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { bigCelebration } from '../lib/fx.js';
import Visual, { Word } from './Visual.jsx';

const tieneImagen = (it) => !!(it && (it.emoji || it.img || it.swatch || it.numero));
import Chispa from './Chispa.jsx';

const BGS = ['#FFF3D6', '#E4F4FF', '#FFE4EC', '#E6F7EA', '#EFE8FF', '#FFEBDD'];
const SPEEDS = [
  { label: 'Rayo', ms: 800, icon: '⚡' },
  { label: 'Rápido', ms: 1300, icon: '🐇' },
  { label: 'Calma', ms: 2200, icon: '🐢' },
];

/**
 * Presentador de bits a pantalla completa (método Glenn Doman).
 * Muestra la palabra grande, dice la palabra y luego revela la imagen.
 * items: [{ texto, emoji?, img?, swatch?, numero?, letra? }]
 * renderFront(item) / renderBack(item): personalizar (p. ej. tarjetas de puntos)
 */
export default function BitPlayer({ items, lang = 'es', title, onClose, renderFront, renderBack, sayText, sayBack, langBack = 'en', reward = 3 }) {
  const { settings, setSettings, addCoins, bumpStat } = useStore();
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('front');
  const [playing, setPlaying] = useState(true);
  const [done, setDone] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const timer = useRef(null);
  const claimRef = useRef(null);

  const item = items[idx];
  const hasBack = !!renderBack || (settings.showImage && tieneImagen(item));

  const next = useCallback(() => {
    clearTimeout(timer.current);
    if (phase === 'front' && hasBack) { setPhase('back'); return; }
    if (idx + 1 >= items.length) { setDone(true); return; }
    setIdx((i) => i + 1);
    setPhase('front');
  }, [phase, hasBack, idx, items.length]);

  const prev = useCallback(() => {
    clearTimeout(timer.current);
    setDone(false);
    setPhase('front');
    setIdx((i) => Math.max(0, i - 1));
  }, []);

  // Voz y efecto al mostrar cada bit
  useEffect(() => {
    if (done || !item) return;
    if (phase === 'front') {
      sfx.whoosh();
      speak(sayText ? sayText(item) : item.texto, lang);
    } else if (sayBack) {
      speak(sayBack(item), langBack);
    }
  }, [idx, phase, done]); // eslint-disable-line react-hooks/exhaustive-deps

  // Avance automático
  useEffect(() => {
    if (!playing || done) return undefined;
    const ms = phase === 'front' ? settings.speed : settings.speed * 0.85;
    timer.current = setTimeout(next, ms);
    return () => clearTimeout(timer.current);
  }, [playing, done, phase, idx, settings.speed, next]);

  useEffect(() => {
    if (done) {
      bumpStat('bits');
      sfx.fanfare();
      bigCelebration();
      speak(lang === 'en' ? 'Great job!' : '¡Muy bien!', lang);
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === ' ') { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onClose]);

  useEffect(() => () => stopSpeech(), []);

  const restart = () => { setIdx(0); setPhase('front'); setDone(false); setPlaying(true); setClaimed(false); };

  const bg = BGS[idx % BGS.length];

  return createPortal(
    <div className="player" style={{ '--bg': bg }}>
      <div className="player-top">
        <span className="player-title">{title}</span>
        <div className="player-progress">
          {items.length <= 40
            ? items.map((_, i) => <i key={i} className={i < idx || done ? 'on' : i === idx ? 'now' : ''} />)
            : <b>{idx + 1} / {items.length}</b>}
        </div>
        <button className="player-x" onClick={onClose} aria-label="Cerrar">✕</button>
      </div>

      {!done && item && (
        <div className="player-stage" onClick={next}>
          {phase === 'front' ? (
            <div key={`f${idx}`} className="bit-card bit-front">
              {renderFront ? renderFront(item) : (
                <>
                  {item.letra && <span className="bit-letter">{settings.upper ? item.letra.toUpperCase() : item.letra}</span>}
                  <Word text={item.texto} letra={item.letra} upper={settings.upper} className="bit-word" />
                </>
              )}
            </div>
          ) : (
            <div key={`b${idx}`} className="bit-card bit-back">
              {renderBack ? renderBack(item) : (
                <>
                  <Visual item={item} className="bit-visual" />
                  <Word text={item.texto} letra={item.letra} upper={settings.upper} className="bit-word-small" />
                </>
              )}
            </div>
          )}
        </div>
      )}

      {done && (
        <div className="player-done">
          <Chispa size={190} mood="wow" message={lang === 'en' ? 'Great job!' : `¡Bravo, ${settings.clase}!`} />
          <h2>{items.length} bits</h2>
          {!claimed ? (
            <button ref={claimRef} className="btn btn-gold btn-xl pulse" onClick={() => { setClaimed(true); addCoins(reward, claimRef.current); }}>
              Recoger {reward} ★
            </button>
          ) : <p className="done-msg">¡Monedas guardadas en el cofre!</p>}
          <div className="row gap">
            <button className="btn btn-blue" onClick={restart}>↻ Otra vez</button>
            <button className="btn btn-white" onClick={onClose}>Terminar</button>
          </div>
        </div>
      )}

      {!done && (
        <div className="player-controls">
          <button className="ctl" onClick={prev} aria-label="Anterior">⏮</button>
          <button className="ctl ctl-main" onClick={() => setPlaying((p) => !p)} aria-label="Pausa">{playing ? '❚❚' : '▶'}</button>
          <button className="ctl" onClick={next} aria-label="Siguiente">⏭</button>
          <span className="ctl-sep" />
          {SPEEDS.map((s) => (
            <button key={s.ms} className={`chip ${settings.speed === s.ms ? 'on' : ''}`} onClick={() => setSettings({ speed: s.ms })}>
              {s.icon} {s.label}
            </button>
          ))}
          {!renderBack && (
            <button className={`chip ${settings.showImage ? 'on' : ''}`} onClick={() => setSettings({ showImage: !settings.showImage })}>
              🖼️ Imagen
            </button>
          )}
          <button className={`chip ${settings.upper ? 'on' : ''}`} onClick={() => setSettings({ upper: !settings.upper })}>
            {settings.upper ? 'ABC' : 'abc'}
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}
