import { useEffect, useState } from 'react';
import { toSpanish } from '../lib/numbers.js';
import { speak } from '../lib/speech.js';
import { sfx } from '../lib/sfx.js';
import { variado } from '../lib/variedad.js';
import { rnd, pick, shuffle, opciones } from './util.js';
import { Reloj, decirHora, textoHora, FORMAS, Forma, Bond, MONEDAS, BILLETES, Plata, pesos } from '../components/Mate.jsx';

const useSay = (text, deps = [], lang = 'es') => {
  useEffect(() => {
    const id = setTimeout(() => speak(text, lang), 450);
    return () => clearTimeout(id);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

// ---------------------------------------------------------------------------
// 24. Figuras geométricas (Shape match)
// ---------------------------------------------------------------------------
export function Formas({ level, onAnswer }) {
  const pool = FORMAS.filter((f) => level.tipos.includes(f.tipo) && (level.modo !== 'objeto' || f.objetos.length));
  const [st] = useState(() => {
    const f = variado(`for${level.id}`, () => pick(pool), (x) => x.id, 4);
    const otras = shuffle(pool.filter((x) => x.id !== f.id)).slice(0, 3);
    return { f, ops: shuffle([f, ...otras]), obj: level.modo === 'objeto' ? pick(f.objetos) : null };
  });
  const [ok, setOk] = useState(false);
  const pregunta = level.modo === 'nombre' ? `Find the ${st.f.en}` : level.modo === 'objeto' ? 'What shape is it?' : 'What shape is it?';
  useSay(pregunta, [], 'en');
  return (
    <div className="g-formas">
      {level.modo === 'nombre' ? (
        <button className="g-pista" onClick={() => speak(st.f.en, 'en')}>
          <span className="g-pista-ico">🔷</span><span><small>Find the…</small><b>{st.f.en}</b></span><span className="g-ear">🔊</span>
        </button>
      ) : (
        <div className="formas-q">
          {st.obj ? <span className="formas-obj">{st.obj}</span> : <Forma id={st.f.id} size={220} />}
          <p className="g-title">What shape is it? · ¿Qué figura es?</p>
        </div>
      )}
      <div className="formas-ops">
        {st.ops.map((f) => (
          <button key={f.id} className={`forma-opt ${ok && f.id === st.f.id ? 'right' : ''}`} disabled={ok} onClick={(e) => {
            const r = f.id === st.f.id;
            speak(f.en, 'en');
            if (r) setOk(true);
            onAnswer(r, e.currentTarget);
          }}>
            {level.modo === 'nombre' ? <Forma id={f.id} size={130} /> : <><b>{f.en}</b><small>{f.es}</small></>}
          </button>
        ))}
      </div>
    </div>
  );
}
Formas.meta = {
  levels: [
    { id: 'f2a', label: 'Find the shape (2D)', modo: 'nombre', tipos: ['2d'] },
    { id: 'f2b', label: 'Name the shape (2D)', modo: 'ver', tipos: ['2d'] },
    { id: 'f3', label: 'Solid shapes (3D)', modo: 'ver', tipos: ['3d'] },
    { id: 'fo', label: 'Objects · ¿Qué forma tiene?', modo: 'objeto', tipos: ['2d', '3d'] },
  ],
};

// ---------------------------------------------------------------------------
// 25. ¿Qué hora es?
// ---------------------------------------------------------------------------
export function QueHora({ level, onAnswer }) {
  const [st] = useState(() => {
    const gen = () => ({ h: rnd(1, 12), m: level.media && Math.random() < 0.5 ? 30 : 0 });
    const t = variado(`hora${level.id}`, gen, (x) => `${x.h}:${x.m}`, 5);
    const ops = new Set([`${t.h}:${t.m}`]);
    while (ops.size < 3) {
      const x = gen();
      ops.add(`${x.h}:${x.m}`);
    }
    return { ...t, ops: shuffle([...ops]).map((k) => k.split(':').map(Number)) };
  });
  const [ok, setOk] = useState(false);
  useSay('¿Qué hora es?');
  return (
    <div className="g-hora">
      <div className="hora-main">
        <Reloj hora={st.h} minuto={st.m} size={280} />
        <p className="g-title">⏰ ¿Qué hora es?</p>
      </div>
      <div className="g-options">
        {st.ops.map(([h, m]) => (
          <button key={`${h}:${m}`} className={`g-opt reloj-opt ${ok && h === st.h && m === st.m ? 'right' : ''}`} disabled={ok} onClick={(e) => {
            const r = h === st.h && m === st.m;
            if (r) { setOk(true); speak(decirHora(h, m)); }
            onAnswer(r, e.currentTarget);
          }}>{textoHora(h, m)}</button>
        ))}
      </div>
    </div>
  );
}
QueHora.meta = {
  levels: [
    { id: 'h1', label: 'En punto', media: false },
    { id: 'h2', label: 'En punto y y media', media: true },
  ],
};

// ---------------------------------------------------------------------------
// 26. Vínculos numéricos (Number bonds)
// ---------------------------------------------------------------------------
export function Vinculos({ level, onAnswer }) {
  const [st] = useState(() => {
    const gen = () => {
      const todo = level.make10 ? rnd(11, 18) : rnd(level.min || 3, level.max);
      if (level.make10) {
        const a = rnd(todo - 9, 9);
        return { todo, a, b: todo - a, hide: 'todo' };
      }
      const a = rnd(1, todo - 1);
      return { todo, a, b: todo - a, hide: pick(['a', 'b', 'b', 'todo']) };
    };
    const x = variado(`bond${level.id}`, gen, (y) => `${y.todo}-${y[y.hide]}`, 5);
    const ans = x[x.hide];
    return { ...x, ans, ops: opciones(ans, 3, { min: 0, max: level.max + 9 }) };
  });
  const [ok, setOk] = useState(false);
  const preg = st.hide === 'todo' ? `${toSpanish(st.a)} y ${toSpanish(st.b)}, ¿cuánto forman?` : `${toSpanish(st.todo)} es ${toSpanish(st.hide === 'a' ? st.b : st.a)} y ¿cuánto más?`;
  useSay(preg);
  return (
    <div className="g-bonds">
      <p className="g-title">🔗 Parte + parte = todo</p>
      <Bond todo={st.todo} a={st.a} b={st.b} hide={ok ? null : st.hide} emoji={st.todo <= 20 ? '🟡' : null} />
      {level.make10 && (
        <p className="g-sub">💡 Haz 10: {st.a} + {10 - st.a} = 10, y sobran {st.b - (10 - st.a)} → 10 + {st.b - (10 - st.a)} = {ok ? st.todo : '?'}</p>
      )}
      <div className="g-options">
        {st.ops.map((v) => (
          <button key={v} className="g-opt" disabled={ok} onClick={(e) => { const r = v === st.ans; if (r) setOk(true); onAnswer(r, e.currentTarget); }}>{v}</button>
        ))}
      </div>
    </div>
  );
}
Vinculos.meta = {
  levels: [
    { id: 'v5', label: 'Hasta 5', max: 5, min: 2 },
    { id: 'v10', label: 'Hasta 10', max: 10 },
    { id: 'v20', label: 'Hasta 20', max: 20, min: 8 },
    { id: 'vm10', label: 'Haz 10 para sumar', make10: true, max: 18 },
  ],
};

// ---------------------------------------------------------------------------
// 27. La tiendita (dinero colombiano · Transición)
// ---------------------------------------------------------------------------
const PRODUCTOS = [
  ['Leche', '🥛'], ['Galletas', '🍪'], ['Chupeta', '🍭'], ['Manzana', '🍎'], ['Pan', '🍞'], ['Jugo', '🧃'], ['Banano', '🍌'],
  ['Helado', '🍦'], ['Lápiz', '✏️'], ['Cuaderno', '📓'], ['Pelota', '⚽'], ['Muñeca', '🪆'], ['Carrito', '🚗'], ['Balón', '🏀'],
  ['Robot', '🤖'], ['Peluche', '🧸'], ['Huevos', '🥚'], ['Queso', '🧀'],
];

export function Tiendita({ level, onAnswer, onStep }) {
  const [st] = useState(() => variado(`tienda${level.id}`, () => {
    const [nombre, emoji] = pick(PRODUCTOS);
    const precio = rnd(level.min / level.paso, level.max / level.paso) * level.paso;
    return { nombre, emoji, precio };
  }, (x) => x.precio, 5));
  const dinero = [...MONEDAS, ...BILLETES].filter((v) => v <= level.maxBillete);
  const [pago, setPago] = useState([]);
  const [ok, setOk] = useState(false);
  const total = pago.reduce((s, v) => s + v, 0);
  useSay(`${st.nombre} cuesta ${toSpanish(st.precio)} pesos. Paga exacto.`);
  return (
    <div className="g-tienda">
      <div className="tienda-prod">
        <span className="tienda-emoji">{st.emoji}</span>
        <b>{st.nombre}</b>
        <span className="precio">{pesos(st.precio)}</span>
      </div>
      <div className="tienda-pago">
        <p className="g-title">Paga exacto con monedas y billetes</p>
        <div className="plata-row">{dinero.map((v) => <Plata key={v} valor={v} onClick={(e) => { if (ok) return; setPago((p) => [...p, v]); sfx.coin(); onStep(e.currentTarget); }} />)}</div>
        <div className="bolsa">
          <span className="bolsa-ico">🧾</span>
          <div className="bolsa-items">{pago.map((v, i) => <Plata key={i} valor={v} small onClick={() => !ok && setPago((p) => p.filter((_, k) => k !== i))} />)}{!pago.length && <span className="muted">Toca el dinero para pagar</span>}</div>
          <div className="bolsa-total"><small>Pagas</small><b className={total > st.precio ? 'over' : ''}>{pesos(total)}</b></div>
        </div>
        <div className="row gap wrap" style={{ justifyContent: 'center' }}>
          <button className="g-btn light" onClick={() => { setPago([]); sfx.tap(); }}>🧽 Volver a contar</button>
          <button className="btn btn-xl btn-gold" disabled={ok} onClick={(e) => {
            if (total === st.precio) { setOk(true); speak('¡Gracias por tu compra!'); onAnswer(true, e.currentTarget); } else {
              speak(total < st.precio ? `Faltan ${toSpanish(st.precio - total)} pesos` : 'Pagaste de más');
              onAnswer(false, e.currentTarget);
            }
          }}>💵 Pagar</button>
        </div>
      </div>
    </div>
  );
}
Tiendita.meta = {
  rounds: 6,
  levels: [
    { id: 'td1', label: 'Monedas (hasta $1.000)', min: 100, max: 1000, paso: 50, maxBillete: 1000 },
    { id: 'td2', label: 'Hasta $5.000', min: 1000, max: 5000, paso: 100, maxBillete: 5000 },
    { id: 'td3', label: 'Hasta $20.000', min: 5000, max: 20000, paso: 500, maxBillete: 20000 },
  ],
};

// ---------------------------------------------------------------------------
// 28. Lee y responde (comprensión lectora · Jardín y Transición)
// ---------------------------------------------------------------------------
export const TEXTOS = {
  j: [
    { t: 'Mi papá usa la pala. La mula se puso mala. Pepe sale a la loma.', q: [['¿Qué usa mi papá?', 'la pala', ['la pelota', 'la moto']], ['¿Quién sale a la loma?', 'Pepe', ['Luis', 'la mula']]] },
    { t: 'La foca toca la pelota. Sofía usa gafas. Federico tiene un delfín.', q: [['¿Qué toca la foca?', 'la pelota', ['el tambor', 'la flauta']], ['¿Quién usa gafas?', 'Sofía', ['Federico', 'la foca']]] },
    { t: 'Juan toma jugo de naranja todos los días. El conejo se esconde en las cajas.', q: [['¿Qué toma Juan?', 'jugo de naranja', ['leche', 'agua']], ['¿Dónde se esconde el conejo?', 'en las cajas', ['en la casa', 'en el árbol']]] },
    { t: 'Toño come piña y no le da a la niña. Doña Toña se pinta las uñas.', q: [['¿Qué come Toño?', 'piña', ['pera', 'pan']], ['¿Qué se pinta doña Toña?', 'las uñas', ['la cara', 'la casa']]] },
    { t: 'Ximena se va en taxi. Miguel lee un texto sencillo.', q: [['¿En qué se va Ximena?', 'en taxi', ['en bus', 'en moto']], ['¿Qué lee Miguel?', 'un texto', ['un mapa', 'una carta']]] },
    { t: 'Mamá gallina cuida sus pollitos. Mi pollito come galletas.', q: [['¿Quién cuida los pollitos?', 'mamá gallina', ['el gato', 'el perro']], ['¿Qué come mi pollito?', 'galletas', ['queso', 'helado']]] },
    { t: 'Kiko el karateca va al kiosco y pide kumis con galletas.', q: [['¿A dónde va Kiko?', 'al kiosco', ['al parque', 'a la playa']], ['¿Qué pide Kiko?', 'kumis', ['jugo', 'café']]] },
    { t: 'Ese marrano lame mi mano. El burro y el marrano están en el corral.', q: [['¿Qué lame el marrano?', 'mi mano', ['mi pie', 'mi cara']], ['¿Dónde están el burro y el marrano?', 'en el corral', ['en la casa', 'en el río']]] },
  ],
  t: [
    { t: 'Tomás es un gato gordo. A él le gusta jugar mucho todo el día. Puede saltar muy alto.', q: [['¿Qué animal es Tomás?', 'un gato', ['un perro', 'un conejo']], ['¿Qué le gusta hacer?', 'jugar', ['dormir', 'nadar']], ['¿Qué puede hacer Tomás?', 'saltar muy alto', ['volar', 'caminar despacio']]] },
    { t: 'Hay una vaca grande en la granja. La vaca es blanca y negra. A la vaca le gusta comer pasto.', q: [['¿Qué hay en la granja?', 'una vaca grande', ['un burro', 'un pollito']], ['¿De qué color es la vaca?', 'blanca y negra', ['café', 'amarilla']], ['¿Qué come la vaca?', 'pasto', ['pollo', 'pan']]] },
    { t: 'Es el cumpleaños de Julia. Ella tiene una fiesta. Ella invitó a sus amigos. Comerán pizza.', q: [['¿Quién cumple años?', 'Julia', ['Sonia', 'Ana']], ['¿A quién invitó?', 'a sus amigos', ['a sus maestros', 'a su abuela']], ['¿Qué comerán?', 'pizza', ['tortas', 'helado']]] },
    { t: 'Tres son los colores primarios: amarillo, azul y rojo. Si los mezclamos salen otros colores.', q: [['¿Cuántos colores primarios hay?', 'tres', ['dos', 'cinco']], ['¿Cuál es un color primario?', 'azul', ['verde', 'morado']]] },
    { t: 'Una ranita verde tomaba el sol en un árbol de mandarina. Una linda mariposa la invitó a volar.', q: [['¿De qué color era la ranita?', 'verde', ['azul', 'roja']], ['¿Dónde tomaba el sol?', 'en un árbol', ['en el río', 'en la casa']], ['¿Quién la invitó a volar?', 'una mariposa', ['un pájaro', 'una abeja']]] },
    { t: 'Las hormiguitas van en silencio al trabajo, vestidas de negro. Cargan hojas verdes a su túnel.', q: [['¿De qué color van vestidas?', 'negro', ['azul', 'blanco']], ['¿Qué cargan?', 'hojas', ['piedras', 'frutas']]] },
    { t: 'El elefante es un animal muy grande. Tiene una nariz muy larga llamada trompa. Con su trompa lanza agua.', q: [['¿Cómo es el elefante?', 'muy grande', ['muy pequeño', 'muy rápido']], ['¿Cómo se llama su nariz?', 'trompa', ['pico', 'cola']], ['¿Qué lanza con la trompa?', 'agua', ['fuego', 'piedras']]] },
    { t: 'La liebre se durmió en la carrera. La tortuga caminó despacio, sin parar, y llegó primero.', q: [['¿Quién se durmió?', 'la liebre', ['la tortuga', 'el león']], ['¿Quién llegó primero?', 'la tortuga', ['la liebre', 'nadie']]] },
    { t: 'Cuando amanece, mamá me despierta. Me baño, me visto y desayuno con papá y mamá. Luego voy a la escuela.', q: [['¿Quién me despierta?', 'mamá', ['papá', 'mi hermano']], ['¿Con quién desayuno?', 'papá y mamá', ['mi abuela', 'mis amigos']], ['¿A dónde voy luego?', 'a la escuela', ['al parque', 'a la playa']]] },
  ],
};

export function LeeResponde({ level, onAnswer, onStep }) {
  const [st] = useState(() => variado(`lee${level.id}`, () => pick(TEXTOS[level.g] || TEXTOS.t), (x) => x.t, 5));
  const [qi, setQi] = useState(0);
  const [hecho, setHecho] = useState([]);
  const q = st.q[qi];
  const [ops] = useState(() => st.q.map((x) => shuffle([x[1], ...x[2]])));
  useEffect(() => { const id = setTimeout(() => speak(st.t), 400); return () => clearTimeout(id); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="g-lee">
      <button className="lee-texto" onClick={() => speak(st.t)}>
        <span className="g-ear">🔊</span>
        <p>{st.t}</p>
      </button>
      {q && (
        <div className="lee-q" key={qi}>
          <p className="g-title">❓ {q[0]}</p>
          <div className="g-options">
            {ops[qi].map((o) => (
              <button key={o} className={`g-opt lee-opt ${hecho.includes(o) ? 'right' : ''}`} onClick={(e) => {
                if (o === q[1]) {
                  speak(o);
                  if (qi + 1 >= st.q.length) onAnswer(true, e.currentTarget);
                  else { onStep(e.currentTarget); setHecho((h) => [...h, o]); setTimeout(() => setQi((i) => i + 1), 700); }
                } else onAnswer(false, e.currentTarget);
              }}>{o}</button>
            ))}
          </div>
          <p className="muted small" style={{ textAlign: 'center' }}>Pregunta {qi + 1} de {st.q.length}</p>
        </div>
      )}
    </div>
  );
}
LeeResponde.meta = {
  rounds: 5,
  levels: [
    { id: 'lj', label: 'Lecturas cortas (Jardín)', g: 'j' },
    { id: 'lt', label: 'Lecturas largas (Transición)', g: 't' },
  ],
};
