import { Link, useParams } from 'react-router-dom';
import { silabasDe } from '../data/espanol.js';
import { useStore } from '../lib/store.jsx';
import { useGrado } from '../lib/grado.js';
import { speak } from '../lib/speech.js';
import DeckView from '../components/DeckView.jsx';

const SILABAS_FIJAS = {
  ce: ['ce', 'ci'],
  qu: ['que', 'qui'],
  gu: ['gue', 'gui'],
  ge: ['ge', 'gi'],
  ch: ['cha', 'che', 'chi', 'cho', 'chu'],
  ll: ['lla', 'lle', 'lli', 'llo', 'llu'],
  rr: ['rra', 'rre', 'rri', 'rro', 'rru'],
  br: ['bra', 'bre', 'bri', 'bro', 'bru', 'bla', 'ble', 'bli', 'blo', 'blu'],
  cr: ['cra', 'cre', 'cri', 'cro', 'cru', 'cla', 'cle', 'cli', 'clo', 'clu'],
  dr: ['dra', 'dre', 'dri', 'dro', 'dru', 'tra', 'tre', 'tri', 'tro', 'tru', 'tla', 'tle'],
  fr: ['fra', 'fre', 'fri', 'fro', 'fru', 'fla', 'fle', 'fli', 'flo', 'flu'],
  gr: ['gra', 'gre', 'gri', 'gro', 'gru', 'gla', 'gle', 'gli', 'glo', 'glu'],
  pr: ['pra', 'pre', 'pri', 'pro', 'pru', 'pla', 'ple', 'pli', 'plo', 'plu'],
};

export default function Letra() {
  const { letra } = useParams();
  const { g, to } = useGrado();
  const { settings } = useStore();
  const data = g.letras.find((l) => l.letra === letra);
  if (!data) return <div className="page"><p>Letra no encontrada. <Link to={to('/letras')}>Volver</Link></p></div>;

  const idx = g.letras.indexOf(data);
  const prev = g.letras[idx - 1];
  const next = g.letras[idx + 1];
  const silabas = SILABAS_FIJAS[letra] || silabasDe(letra);
  const show = (s) => (settings.upper ? s.toUpperCase() : s);
  const etiqueta = (l) => (l.titulo ? l.titulo.split(' ')[0] : l.letra);
  const nombre = data.titulo || `la letra ${show(data.letra)}`;

  const hero = (
    <button className="giant-letter" style={{ '--c': data.color }} onClick={() => speak(data.titulo ? data.titulo.replace(/[·–]/g, ',') : data.letra)}>
      <span className={`gl-main ${etiqueta(data).length > 1 ? 'multi' : ''}`}>{show(etiqueta(data))}</span>
      {data.letra.length === 1 && <span className="gl-pair">{data.letra.toUpperCase()}{data.letra}</span>}
    </button>
  );

  const extra = [];
  if (silabas.length) {
    extra.push({
      label: `🔤 Sílabas ${silabas.slice(0, 3).join(' ')}…`,
      onClick: (open) => open({
        type: 'bits',
        title: `Sílabas · ${nombre}`,
        items: silabas.map((s) => ({ texto: s })),
        props: { renderBack: (it) => <span className="syll-back">{show(it.texto)}<small>{silabas.map(show).join(' · ')}</small></span> },
      }),
    });
  }
  if (letra.length === 1 && !'aeiou'.includes(letra) && !['h', 'k', 'w', 'q', 'ñ', 'x', 'y'].includes(letra)) {
    const inversas = ['a', 'e', 'i', 'o', 'u'].map((v) => v + letra);
    extra.push({
      label: `🔁 Inversas ${inversas.slice(0, 3).join(' ')}…`,
      onClick: (open) => open({ type: 'bits', title: `Sílabas inversas · ${nombre}`, items: inversas.map((s) => ({ texto: s })) }),
    });
  }
  extra.push({
    label: '📝 Frase del libro',
    onClick: (open) => open({ type: 'bits', title: 'Frase del libro', items: [{ texto: data.frase }] }),
  });

  return (
    <div className="page">
      <div className="frase-libro" onClick={() => speak(data.frase)}>
        <span>📖 {g.nombre}</span>
        <b>{data.frase}</b>
      </div>
      <DeckView key={letra} hero={hero} title={data.titulo ? data.titulo : `La letra ${show(data.letra)}`} items={data.palabras} color={data.color} extraActions={extra} />
      <nav className="letter-nav">
        {prev ? <Link to={to(`/letras/${encodeURIComponent(prev.letra)}`)} className="btn btn-white">⟵ {show(etiqueta(prev))}</Link> : <span />}
        <Link to={to('/letras')} className="btn btn-white">Todas las letras</Link>
        <Link to={to('/lector')} className="btn btn-gold">🚀 Lector Cohete</Link>
        {next ? <Link to={to(`/letras/${encodeURIComponent(next.letra)}`)} className="btn btn-white">{show(etiqueta(next))} ⟶</Link> : <span />}
      </nav>
    </div>
  );
}
