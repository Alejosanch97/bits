import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { sfx } from '../lib/sfx.js';
import { speak, stopSpeech } from '../lib/speech.js';
import { confettiAt, bigCelebration, shake } from '../lib/fx.js';
import Chispa from '../components/Chispa.jsx';

const PRAISE = ['¡Muy bien!', '¡Excelente!', '¡Genial!', '¡Eso es!', '¡Súper!', '¡Bravo!', '¡Increíble!'];

/**
 * Motor común de los juegos.
 * Cada juego recibe: { level, round, rounds, onAnswer(ok, el), onStep(el), score }
 *  - onAnswer(true, el): ronda superada (suma moneda, combo y pasa a la siguiente)
 *  - onAnswer(false, el): error (sacude y rompe el combo; la ronda sigue)
 *  - onStep(el): acierto parcial dentro de la ronda (sonido y chispitas)
 */
export default function GameShell({ game }) {
  const { addCoins, bumpStat } = useStore();
  const [level, setLevel] = useState(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [praise, setPraise] = useState(null);
  const [run, setRun] = useState(0);
  const missed = useRef(false);
  const done = useRef(false);
  const streakRef = useRef(0);
  const timer = useRef(null);
  const rounds = game.rounds || 8;
  const ended = level !== null && round >= rounds;

  useEffect(() => { missed.current = false; done.current = false; }, [round, run, level]);
  useEffect(() => () => { clearTimeout(timer.current); stopSpeech(); }, []);

  useEffect(() => {
    if (ended) {
      bumpStat('juegos');
      sfx.fanfare();
      bigCelebration();
      speak('¡Lo lograste!');
    }
  }, [ended]); // eslint-disable-line react-hooks/exhaustive-deps

  const onAnswer = useCallback((ok, el) => {
    if (done.current) return;
    if (ok) {
      done.current = true;
      sfx.correct();
      if (el?.getBoundingClientRect) {
        const r = el.getBoundingClientRect();
        confettiAt(r.left + r.width / 2, r.top + r.height / 2, 60);
      }
      const first = !missed.current;
      if (first) setScore((s) => s + 1);
      streakRef.current = first ? streakRef.current + 1 : 0;
      setStreak(streakRef.current);
      addCoins(1, el || undefined);
      let msg = PRAISE[Math.floor(Math.random() * PRAISE.length)];
      if (streakRef.current > 0 && streakRef.current % 3 === 0) {
        msg = `¡Combo x${streakRef.current}! +1 ★`;
        setTimeout(() => addCoins(1, el || undefined), 500);
      }
      setPraise({ msg, k: Date.now() });
      setTimeout(() => speak(msg.replace(/[★+x\d]/g, '')), 200);
      timer.current = setTimeout(() => { setPraise(null); setRound((r) => r + 1); }, game.pause ?? 1600);
    } else {
      missed.current = true;
      streakRef.current = 0;
      setStreak(0);
      sfx.wrong();
      shake(el);
    }
  }, [addCoins, game.pause]);

  const onStep = useCallback((el) => {
    sfx.pop();
    if (el?.getBoundingClientRect) {
      const r = el.getBoundingClientRect();
      confettiAt(r.left + r.width / 2, r.top + r.height / 2, 14);
    }
  }, []);

  const start = (lv) => {
    sfx.pop();
    streakRef.current = 0;
    setStreak(0); setScore(0); setRound(0); setLevel(lv); setRun((x) => x + 1);
  };

  const Comp = game.Component;
  const stars = Math.round((score / rounds) * 3);

  if (level === null) {
    return (
      <div className="gshell-menu" style={{ '--gc': game.color }}>
        <div className="gmenu-card">
          <span className="gmenu-icon">{game.icon}</span>
          <h1>{game.titulo}</h1>
          <p className="gmenu-como">{game.como}</p>
          <p className="gmenu-evalua">🎯 Evalúa: {game.evalua}</p>
          <h3>Escoge el nivel</h3>
          <div className="gmenu-levels">
            {game.levels.map((lv, i) => (
              <button key={lv.id} className="glevel" style={{ animationDelay: `${i * 60}ms` }} onClick={() => start(lv)}>
                <span>{lv.icon || ['🌱', '🌿', '🌳', '🏔️', '🚀'][i] || '⭐'}</span>{lv.label}
              </button>
            ))}
          </div>
          <Link to="/juegos" className="btn btn-white">⟵ Todos los juegos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="gshell" style={{ '--gc': game.color }}>
      <div className="gbar">
        <Link to="/juegos" className="gbar-x" aria-label="Salir">✕</Link>
        <span className="gbar-title">{game.icon} {game.titulo} <small>{level.label}</small></span>
        <div className="gbar-prog">
          {Array.from({ length: rounds }, (_, i) => <i key={i} className={i < round ? 'on' : i === round ? 'now' : ''} />)}
        </div>
        <span className={`gbar-streak ${streak >= 2 ? 'hot' : ''}`}>🔥 {streak}</span>
        <span className="gbar-score">⭐ {score}</span>
      </div>

      {!ended && (
        <div className="gstage" key={`${run}-${round}`}>
          <Comp level={level} round={round} rounds={rounds} onAnswer={onAnswer} onStep={onStep} score={score} />
        </div>
      )}

      {praise && <div className="praise" key={praise.k}>{praise.msg}</div>}

      {ended && (
        <div className="player-done gend">
          <Chispa size={170} mood="wow" message={`${score} de ${rounds} a la primera`} />
          <div className="stars-row">
            {[0, 1, 2].map((i) => <span key={i} className={`big-star ${i < stars ? 'on' : ''}`} style={{ animationDelay: `${i * 0.25}s` }}>★</span>)}
          </div>
          <div className="row gap wrap" style={{ justifyContent: 'center' }}>
            <button className="btn btn-gold btn-xl" onClick={() => start(level)}>↻ Otra vez</button>
            <button className="btn btn-blue btn-xl" onClick={() => setLevel(null)}>Cambiar nivel</button>
            <Link to="/juegos" className="btn btn-white btn-xl">🎮 Más juegos</Link>
          </div>
        </div>
      )}
    </div>
  );
}
