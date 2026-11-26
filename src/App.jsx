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
import MisBits from './pages/MisBits.jsx';
import Lector from './pages/Lector.jsx';
import { JuegosHub, JuegoPage } from './pages/Juegos.jsx';
import GradoHub from './pages/GradoHub.jsx';
import Mqrb from './pages/Mqrb.jsx';

function Routed() {
  const loc = useLocation();
  useEffect(() => { window.scrollTo(0, 0); stopSpeech(); }, [loc.pathname]);
  return (
    <>
      <Hud />
      <main className="page-anim" key={loc.pathname}>
        <Routes location={loc}>
          <Route path="/" element={<Home />} />
          <Route path="/g/:grado" element={<GradoHub />} />
          <Route path="/g/:grado/letras" element={<Letras />} />
          <Route path="/g/:grado/letras/:letra" element={<Letra />} />
          <Route path="/g/:grado/lector" element={<Lector />} />
          <Route path="/g/:grado/numeros" element={<Numeros />} />
          <Route path="/g/:grado/english" element={<EnglishHome />} />
          <Route path="/g/:grado/english/:cat" element={<EnglishCategory />} />
          <Route path="/g/:grado/juegos" element={<JuegosHub />} />
          <Route path="/g/:grado/juegos/:id" element={<JuegoPage />} />
          <Route path="/mqrb" element={<Mqrb />} />
          <Route path="/premios" element={<Premios />} />
          <Route path="/profe" element={<Profe />} />
          <Route path="/mis-bits" element={<MisBits />} />
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
