import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { StoreProvider } from './lib/store.jsx';
import { stopSpeech } from './lib/speech.js';
import Hud from './components/Hud.jsx';
import Home from './pages/Home.jsx';
import Letras from './pages/Letras.jsx';
import Letra from './pages/Letra.jsx';
import Numeros from './pages/Numeros.jsx';
import { EnglishHome, EnglishCategory } from './pages/English.jsx';
import Premios from './pages/Premios.jsx';
import Profe from './pages/Profe.jsx';

function Routed() {
  const loc = useLocation();
  useEffect(() => { window.scrollTo(0, 0); stopSpeech(); }, [loc.pathname]);
  return (
    <>
      <Hud />
      <main className="page-anim" key={loc.pathname}>
        <Routes location={loc}>
          <Route path="/" element={<Home />} />
          <Route path="/letras" element={<Letras />} />
          <Route path="/letras/:letra" element={<Letra />} />
          <Route path="/numeros" element={<Numeros />} />
          <Route path="/english" element={<EnglishHome />} />
          <Route path="/english/:cat" element={<EnglishCategory />} />
          <Route path="/premios" element={<Premios />} />
          <Route path="/profe" element={<Profe />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routed />
      </HashRouter>
    </StoreProvider>
  );
}
