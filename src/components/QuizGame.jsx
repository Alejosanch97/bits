import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../lib/store.jsx';
import { speak, stopSpeech } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { confettiAt, bigCelebration, shake } from '../lib/fx.js';
import Visual, { Word } from './Visual.jsx';
import Chispa from './Chispa.jsx';

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);

function buildRounds(pool, rounds, nOptions) {
  const targets = shuffle(pool).slice(0, Math.min(rounds, pool.length));
  return targets.map((t) => {
    const others = shuffle(pool.filter((p) => p.texto !== t.texto && (!p.emoji || p.emoji !== t.emoji))).slice(0, nOptions - 1);
    return { target: t, options: shuffle([t, ...others]) };
  });
}

const PRAISE_ES = ['¡Muy bien!', '¡Excelente!', '¡Genial!', '¡Eso es!', '¡Súper!', '¡Bravo!'];
const PRAISE_EN = ['Great!', 'Awesome!', 'Super!', 'Well done!', 'Yes!', 'Amazing!'];

/**
 * Juego de reconocimiento:
 *  mode 'leer' -> se muestra la PALABRA, se elige la IMAGEN
 *  mode 'ver'  -> se muestra la IMAGEN, se elige la PALABRA
 */
export default function QuizGame({ pool, lang = 'es', mode = 'leer', title, rounds = 8, onClose, renderVisual, renderLabel, sayText }) {
  const { addCoins, bumpStat, settings } = useStore();
  const nOptions = pool.length >= 4 ? 4 : pool.length >= 3 ? 3 : 2;
  const [seed, setSeed] = useState(0);
  const game = useMemo(() => buildRounds(pool, rounds, nOptions), [pool, rounds, nOptions, seed]);
  const [r, setR] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [solved, setSolved] = useState(false);
  const [praise, setPraise] = useState('');
  const optRefs = useRef([]);
  const done = r >= game.length;
  const round = game[r];

  const V = (it, cls) => (renderVisual ? renderVisual(it, cls) : <Visual item={it} className={cls} />);
  const L = (it, cls) => (renderLabel ? renderLabel(it, cls) : <Word text={it.texto} letra={it.letra} upper={settings.upper} className={cls} />);
  const say = (it) => speak(sayText ? sayText(it) : it.texto, lang);

  useEffect(() => {
    if (done || !round) return;
    setWrong([]);
    setSolved(false);
    setPraise('');
    if (mode === 'leer') {
      const t = setTimeout(() => say(round.target), 350);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [r, seed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (done && game.length) {
      bumpStat('juegos');
      sfx.fanfare();
      bigCelebration();
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopSpeech(), []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const pick = (opt, i) => {
    if (solved || wrong.includes(i)) return;
    const el = optRefs.current[i];
    if (opt.texto === round.target.texto) {
      setSolved(true);
      sfx.correct();
      const rect = el.getBoundingClientRect();
      confettiAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
      const p = (lang === 'en' ? PRAISE_EN : PRAISE_ES)[Math.floor(Math.random() * 6)];
      setPraise(p);
      if (wrong.length === 0) { setScore((s) => s + 1); addCoins(1, el); }
      setTimeout(() => speak(p, lang), 250);
      setTimeout(() => setR((x) => x + 1), 1500);
    } else {
      sfx.wrong();
      shake(el);
      setWrong((w) => [...w, i]);
      if (mode === 'ver') say(opt);
    }
  };

  const again = () => { setSeed((s) => s + 1); setR(0); setScore(0); };
  const stars = game.length ? Math.round((score / game.length) * 3) : 0;

  return createPortal(
    <div className="player quiz" style={{ '--bg': '#FFF6E6' }}>
      <div className="player-top">
        <span className="player-title">{title}</span>
        <div className="player-progress">
          {game.map((_, i) => <i key={i} className={i < r ? 'on' : i === r ? 'now' : ''} />)}
        </div>
        <button className="player-x" onClick={onClose} aria-label="Cerrar">✕</button>
      </div>

      {!done && round && (
        <div className="quiz-body" key={`${seed}-${r}`}>
          <div className="quiz-prompt" onClick={() => say(round.target)}>
            {mode === 'leer' ? L(round.target, 'quiz-word') : V(round.target, 'quiz-visual')}
            <span className="quiz-ear" title="Escuchar">🔊</span>
          </div>
          <div className={`quiz-options n${round.options.length}`}>
            {round.options.map((o, i) => (
              <button
                key={o.texto + i}
                ref={(el) => { optRefs.current[i] = el; }}
                className={`quiz-opt ${wrong.includes(i) ? 'is-wrong' : ''} ${solved && o.texto === round.target.texto ? 'is-right' : ''}`}
                style={{ animationDelay: `${i * 90}ms` }}
                onClick={() => pick(o, i)}
              >
                {mode === 'leer' ? V(o, 'opt-visual') : L(o, 'opt-word')}
              </button>
            ))}
          </div>
          {praise && <div className="praise">{praise}</div>}
        </div>
      )}

      {done && (
        <div className="player-done">
          <Chispa size={180} mood="wow" message={`${score} de ${game.length}`} />
          <div className="stars-row">
            {[0, 1, 2].map((i) => <span key={i} className={`big-star ${i < stars ? 'on' : ''}`} style={{ animationDelay: `${i * 0.25}s` }}>★</span>)}
          </div>
          <p className="done-msg">¡Ganaste {score} monedas!</p>
          <div className="row gap">
            <button className="btn btn-gold btn-xl" onClick={again}>↻ Jugar otra vez</button>
            <button className="btn btn-white" onClick={onClose}>Terminar</button>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
