import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ENGLISH } from '../data/english.js';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import DeckView from '../components/DeckView.jsx';
import BitPlayer from '../components/BitPlayer.jsx';
import Chispa from '../components/Chispa.jsx';

const ALL = ENGLISH.flatMap((c) => c.items);
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);

export function EnglishHome() {
  const [mix, setMix] = useState(null);
  return (
    <div className="page page-english">
      <section className="world-header wh-english">
        <div>
          <h1>English Island</h1>
          <p>{ENGLISH.length} worlds · {ALL.length} words to learn and play</p>
          <div className="deck-actions">
            <button className="btn btn-xl btn-accent" onClick={() => setMix(shuffle(ALL).slice(0, 15))}>⚡ Magic mix (15 bits)</button>
          </div>
        </div>
        <Chispa size={140} message="Hello, friends!" />
      </section>

      <div className="island-grid">
        {ENGLISH.map((c, i) => (
          <Link
            key={c.id}
            to={`/english/${c.id}`}
            className="island"
            style={{ '--c': c.color, animationDelay: `${i * 50}ms` }}
            onMouseEnter={() => sfx.tap()}
            onClick={() => { sfx.pop(); speak(c.titulo, 'en'); }}
          >
            <span className="island-icon">{c.icon}</span>
            <b>{c.titulo}</b>
            <small>{c.items.length} words</small>
          </Link>
        ))}
      </div>

      {mix && <BitPlayer items={mix} lang="en" title="Magic mix" onClose={() => setMix(null)} />}
    </div>
  );
}

export function EnglishCategory() {
  const { cat } = useParams();
  const data = ENGLISH.find((c) => c.id === cat);
  if (!data) return <div className="page"><p>Not found. <Link to="/english">Back</Link></p></div>;
  const hero = (
    <button className="giant-icon" style={{ '--c': data.color }} onClick={() => speak(data.titulo, 'en')}>
      <span>{data.icon}</span>
    </button>
  );
  return (
    <div className="page">
      <DeckView key={cat} hero={hero} title={data.titulo} items={data.items} lang="en" color={data.color} />
      <nav className="letter-nav"><Link to="/english" className="btn btn-white">⟵ All worlds</Link></nav>
    </div>
  );
}
