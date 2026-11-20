import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { setSpeechConfig } from './speech.js';
import { setSfxEnabled } from './sfx.js';
import { flyCoins } from './fx.js';

const KEY = 'crear-bits-v1';

const DEFAULTS = {
  coins: 0,
  totalCoins: 0,
  stickers: {},
  custom: [],
  stats: { bits: 0, juegos: 0 },
  settings: {
    speed: 1300,
    voice: true,
    sound: true,
    rate: 0.85,
    showImage: true,
    upper: false,
    clase: 'Transición',
  },
};

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (!s) return DEFAULTS;
    return { ...DEFAULTS, ...s, settings: { ...DEFAULTS.settings, ...s.settings }, stats: { ...DEFAULTS.stats, ...s.stats } };
  } catch {
    return DEFAULTS;
  }
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);
  const ref = useRef(state);
  ref.current = state;

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      window.alert('El navegador se quedó sin espacio para guardar. Usa fotos más pequeñas o borra algunos bits con foto.');
    }
  }, [state]);

  useEffect(() => {
    setSpeechConfig({ enabled: state.settings.voice, rate: state.settings.rate });
    setSfxEnabled(state.settings.sound);
  }, [state.settings]);

  const addCoins = useCallback((n, from) => {
    const apply = () => setState((s) => ({ ...s, coins: s.coins + n, totalCoins: s.totalCoins + Math.max(0, n) }));
    if (from && n > 0) {
      const r = from.getBoundingClientRect ? from.getBoundingClientRect() : from;
      const x = r.left !== undefined ? r.left + (r.width || 0) / 2 : r.x;
      const y = r.top !== undefined ? r.top + (r.height || 0) / 2 : r.y;
      flyCoins(x, y, n, apply);
    } else apply();
  }, []);

  const spendCoins = useCallback((n) => {
    if (ref.current.coins < n) return false;
    ref.current = { ...ref.current, coins: ref.current.coins - n };
    setState((s) => ({ ...s, coins: s.coins - n }));
    return true;
  }, []);

  const addSticker = useCallback((id) => {
    setState((s) => ({ ...s, stickers: { ...s.stickers, [id]: (s.stickers[id] || 0) + 1 } }));
  }, []);

  const setSettings = useCallback((patch) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  const bumpStat = useCallback((k) => {
    setState((s) => ({ ...s, stats: { ...s.stats, [k]: (s.stats[k] || 0) + 1 } }));
  }, []);

  const addCustom = useCallback((bit) => {
    setState((s) => ({ ...s, custom: [...s.custom, { ...bit, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5) }] }));
  }, []);
  const importCustom = useCallback((list) => {
    setState((s) => {
      const ids = new Set(s.custom.map((b) => b.id));
      const nuevos = list.filter((b) => b && b.texto && !ids.has(b.id)).map((b) => ({ ...b, id: b.id || Math.random().toString(36).slice(2) }));
      return { ...s, custom: [...s.custom, ...nuevos] };
    });
  }, []);
  const removeCustom = useCallback((id) => {
    setState((s) => ({ ...s, custom: s.custom.filter((b) => b.id !== id) }));
  }, []);

  const resetProgress = useCallback(() => {
    setState((s) => ({ ...s, coins: 0, totalCoins: 0, stickers: {}, stats: { bits: 0, juegos: 0 } }));
  }, []);

  const value = useMemo(() => ({
    ...state, addCoins, spendCoins, addSticker, setSettings, bumpStat, addCustom, importCustom, removeCustom, resetProgress,
  }), [state, addCoins, spendCoins, addSticker, setSettings, bumpStat, addCustom, importCustom, removeCustom, resetProgress]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
