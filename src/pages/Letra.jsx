import { Link, useParams } from 'react-router-dom';
import { LETRAS, silabasDe } from '../data/espanol.js';
import { useStore } from '../lib/store.jsx';
import { speak } from '../lib/speech.js';
import DeckView from '../components/DeckView.jsx';

export default function Letra() {
  const { letra } = useParams();
  const { settings } = useStore();
  const data = LETRAS.find((l) => l.letra === letra);
  if (!data) return <div className="page"><p>Letra no encontrada. <Link to="/letras">Volver</Link></p></div>;

  const idx = LETRAS.indexOf(data);
  const prev = LETRAS[idx - 1];
  const next = LETRAS[idx + 1];
  const silabas = silabasDe(letra);
  const show = (s) => (settings.upper ? s.toUpperCase() : s);

  const hero = (
    <button className="giant-letter" style={{ '--c': data.color }} onClick={() => speak(data.letra)}>
      <span className="gl-main">{show(data.letra)}</span>
      <span className="gl-pair">{data.letra.toUpperCase()}{data.letra}</span>
    </button>
  );

  const extra = [];
  if (silabas.length) {
    extra.push({
      label: `🔤 Sílabas ${silabas.slice(0, 3).join(' ')}…`,
      onClick: (open) => open({
        type: 'bits',
        title: `Sílabas con ${data.letra}`,
        items: silabas.map((s) => ({ texto: s, letra: data.letra })),
        props: { renderBack: (it) => <span className="syll-back">{show(it.texto)}<small>{silabas.map(show).join(' · ')}</small></span> },
      }),
    });
  }

  return (
    <div className="page">
      <DeckView key={letra} hero={hero} title={`La letra ${show(data.letra)}`} items={data.palabras} color={data.color} extraActions={extra} />
      <nav className="letter-nav">
        {prev ? <Link to={`/letras/${prev.letra}`} className="btn btn-white">⟵ {show(prev.letra)}</Link> : <span />}
        <Link to="/letras" className="btn btn-white">Todas las letras</Link>
        {next ? <Link to={`/letras/${next.letra}`} className="btn btn-white">{show(next.letra)} ⟶</Link> : <span />}
      </nav>
    </div>
  );
}
