import { useRef, useState } from 'react';
import { STICKERS, COSTO_COFRE, stickerAleatorio } from '../data/premios.js';
import { useStore } from '../lib/store.jsx';
import { sfx } from '../lib/sfx.js';
import { speak } from '../lib/speech.js';
import { bigCelebration, shake } from '../lib/fx.js';
import Chispa from '../components/Chispa.jsx';

const RAREZA = { comun: 'Común', raro: 'Raro', legendario: '¡Legendario!' };

export default function Premios() {
  const { coins, totalCoins, stickers, spendCoins, addSticker, stats } = useStore();
  const [state, setState] = useState('idle'); // idle | shaking | open
  const [won, setWon] = useState(null);
  const chestRef = useRef(null);
  const owned = Object.keys(stickers).length;

  const open = () => {
    if (state === 'shaking') return;
    if (coins < COSTO_COFRE) {
      sfx.wrong();
      shake(chestRef.current);
      speak(`Necesitas ${COSTO_COFRE} monedas`);
      return;
    }
    if (!spendCoins(COSTO_COFRE)) return;
    setWon(null);
    setState('shaking');
    sfx.whoosh();
    setTimeout(() => {
      const s = stickerAleatorio();
      addSticker(s.id);
      setWon(s);
      setState('open');
      sfx.chest();
      bigCelebration();
      speak(`¡${s.nombre}!`);
    }, 1500);
  };

  return (
    <div className="page page-premios">
      <section className="treasure">
        <div className="treasure-left">
          <div className="big-coin"><span>★</span></div>
          <div>
            <h1>{coins} monedas</h1>
            <p>Ganadas en total: {totalCoins} · Sesiones de bits: {stats.bits} · Juegos: {stats.juegos}</p>
          </div>
        </div>

        <div className="chest-zone">
          <button ref={chestRef} className={`chest chest-${state}`} onClick={open} aria-label="Abrir cofre">
            <span className="chest-lid" />
            <span className="chest-base"><i className="chest-lock">★</i></span>
            <span className="chest-rays" />
          </button>
          {won && state === 'open' && (
            <div className={`won-sticker r-${won.rareza}`} key={won.id + Date.now()}>
              <span className="won-emoji">{won.emoji}</span>
              <b>{won.nombre}</b>
              <small>{RAREZA[won.rareza]}</small>
            </div>
          )}
          <button className="btn btn-gold btn-xl" onClick={open} disabled={state === 'shaking'}>
            🎁 Abrir cofre · {COSTO_COFRE} ★
          </button>
        </div>
      </section>

      <h2 className="section-title"><span>Álbum de stickers · {owned}/{STICKERS.length}</span></h2>
      <div className="album">
        {STICKERS.map((s) => {
          const n = stickers[s.id];
          return (
            <div key={s.id} className={`sticker ${n ? 'got' : 'locked'} r-${s.rareza}`} onClick={() => n && speak(s.nombre)}>
              <span className="sticker-emoji">{s.emoji}</span>
              <small>{n ? s.nombre : '???'}</small>
              {n > 1 && <i className="sticker-count">x{n}</i>}
            </div>
          );
        })}
      </div>

      {owned === STICKERS.length && (
        <div className="center-row"><Chispa size={160} mood="wow" message="¡Álbum completo! ¡Son unos campeones!" /></div>
      )}
    </div>
  );
}
