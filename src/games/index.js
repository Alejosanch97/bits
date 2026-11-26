// Registro de todos los juegos: agrega uno nuevo aquí y aparece en la Isla de Juegos
import { Tesoro, Tren, Monstruo, Mision, Construye, Cocodrilo } from './juegosNumeros.jsx';
import { Mono, Patitos, Pasteleria, Robot, Rio } from './juegosOperaciones.jsx';
import { Ranas, Grupos, Heladeria, Piano } from './juegosTablas.jsx';
import { Relampago, Parejas, Detective, ConstruyePalabra } from './juegosLectura.jsx';
import { Camino, Zoologico, Burbujas } from './juegosLetras.jsx';
import { Formas, QueHora, Vinculos, Tiendita, LeeResponde } from './juegosNuevos.jsx';
import { vocabGrado, letrasSimples, GRADOS } from '../data/grados.js';

const g = (id, Component, data) => ({ id, Component, ...Component.meta, ...data });

export const ISLAS = [
  {
    id: 'numeros', nombre: 'Isla de los Números', icon: '🔢', guia: '🦉', color: '#2F8FD8',
    historia: 'El búho Sabio guarda los números del 1 al 10.000.',
    juegos: [
      g('tesoro', Tesoro, { titulo: 'El tesoro de los números', icon: '🏴‍☠️', color: '#F2A20C', evalua: 'reconocimiento y lectura de números', como: 'Escucha el número y abre el cofre que lo tiene. ¡Si aciertas salen tesoros!' }),
      g('tren', Tren, { titulo: 'El tren numérico', icon: '🚂', color: '#E8412C', evalua: 'orden numérico, anterior y siguiente', como: 'Engancha los vagones del número más pequeño al más grande. En el nivel difícil encuentra el vagón perdido.' }),
      g('monstruo', Monstruo, { titulo: 'Alimenta al monstruo', icon: '👾', color: '#7A4FD6', evalua: 'conteo y agrupación de 10 en 10', como: 'El monstruo pide una cantidad de globos. Pon globos de uno en uno o en paquetes de 10 y dale de comer.' }),
      g('mision', Mision, { titulo: 'Misión espacial', icon: '🚀', color: '#1D2A6B', evalua: 'secuencias y patrones (de 2 en 2, 5 en 5, 10 en 10…)', como: 'Completa el código de lanzamiento con el número que falta. Cada acierto arma una pieza del cohete.' }),
      g('construye', Construye, { titulo: 'Construye el número', icon: '🧱', color: '#2E9E5B', evalua: 'valor posicional (Singapur)', como: 'Usa cubos de mil, placas de cien, barras de diez y cubitos para construir el número.' }),
      g('cocodrilo', Cocodrilo, { titulo: 'El cocodrilo comelón', icon: '🐊', color: '#2E9E5B', evalua: 'comparación: mayor, menor, igual', como: 'El cocodrilo siempre se come el número más grande. ¿Cuál se va a comer?' }),
    ],
  },
  {
    id: 'operaciones', nombre: 'Isla de las Operaciones', icon: '➕', guia: '🐰', color: '#E8412C',
    historia: 'El conejo Saltarín necesita ayuda con sumas y restas.',
    juegos: [
      g('mono', Mono, { titulo: 'El mono comelón', icon: '🐒', color: '#F2A20C', evalua: 'sumas con objetos y conteo', como: 'Pasa los bananos del árbol a la canasta y descubre cuántos tiene ahora el mono.' }),
      g('patitos', Patitos, { titulo: 'Los patitos perdidos', icon: '🦆', color: '#2F8FD8', evalua: 'restas: quitar cantidades', como: 'Mira cuántos patitos hay, cuántos se van a jugar y descubre cuántos quedan.' }),
      g('pasteleria', Pasteleria, { titulo: 'La pastelería matemática', icon: '🧁', color: '#E0598B', evalua: 'sumas y restas en situaciones de la vida', como: 'Prepara los pedidos de los clientes con la cantidad exacta de ponquecitos.' }),
      g('robot', Robot, { titulo: 'Repara al robot', icon: '🤖', color: '#1D2A6B', evalua: 'cálculo mental', como: 'Resuelve la operación y escoge la pieza correcta. ¡Cada acierto arma una parte del robot!' }),
      g('rio', Rio, { titulo: 'Cruza el río', icon: '🌊', color: '#2F8FD8', evalua: 'sumas y restas seguidas', como: 'Resuelve la operación de cada piedra para que el osito salte hasta el tesoro.' }),
      g('vinculos', Vinculos, { titulo: 'Vínculos numéricos', icon: '🔗', color: '#7A4FD6', evalua: 'componer y descomponer (number bonds)', como: 'Parte + parte = todo. Encuentra el número que falta en el vínculo.' }),
    ],
  },
  {
    id: 'tablas', nombre: 'Isla de las Tablas', icon: '✖️', guia: '🐵', color: '#F26B1D',
    historia: 'El mono Tablitas canta las tablas del 1 al 9.',
    juegos: [
      g('ranas', Ranas, { titulo: 'Las ranas saltarinas', icon: '🐸', color: '#2E9E5B', evalua: 'secuencias de multiplicación', como: 'Escoge una tabla y ayuda a la rana a saltar de hoja en hoja: de 2 en 2, de 3 en 3…' }),
      g('grupos', Grupos, { titulo: 'Fábrica de grupos', icon: '🏭', color: '#7A4FD6', evalua: 'multiplicación como suma repetida', como: 'Arma grupos iguales de globos. Luego verás la suma y la multiplicación.' }),
      g('heladeria', Heladeria, { titulo: 'La heladería multiplicadora', icon: '🍦', color: '#E0598B', evalua: 'multiplicación con dibujos', como: 'Cada pingüino quiere varios helados. ¿Cuántos helados necesitamos en total?' }),
      g('piano', Piano, { titulo: 'El piano de las tablas', icon: '🎹', color: '#1D2A6B', evalua: 'memoria: operación y resultado', como: 'Escucha la tabla en el piano y toca la tecla con el resultado correcto.' }),
    ],
  },
  {
    id: 'palabras', nombre: 'Isla de las Palabras', icon: '📖', guia: '🐻', color: '#2E9E5B',
    historia: 'El oso Lector quiere leer muy rápido.',
    juegos: [
      g('relampago', Relampago, { titulo: 'Palabras relámpago', icon: '⚡', color: '#F2A20C', evalua: 'lectura rápida y reconocimiento visual', como: 'La palabra aparece muy rápido y se esconde. ¿Cuál era? Toca la imagen correcta.' }),
      g('parejas', Parejas, { titulo: 'Parejas mágicas', icon: '🃏', color: '#7A4FD6', evalua: 'asociación palabra–imagen', como: 'Voltea las tarjetas y une cada palabra con su imagen.' }),
      g('detective', Detective, { titulo: 'El detective de palabras', icon: '🕵️', color: '#1D2A6B', evalua: 'discriminación visual y lectura global', como: 'Recibe tu misión y encuentra la palabra escondida entre muchas palabras parecidas.' }),
      g('construye-palabra', ConstruyePalabra, { titulo: 'Construye la palabra', icon: '🔠', color: '#E8412C', evalua: 'letras, orden y formación de palabras', como: 'Mira la imagen y toca las letras en orden para formar la palabra.' }),
      g('lee', LeeResponde, { titulo: 'Lee y responde', icon: '📖', color: '#2E9E5B', evalua: 'comprensión lectora', como: 'Lee la historia (o escúchala) y responde las preguntas.' }),
    ],
  },
  {
    id: 'letras', nombre: 'Isla de las Letras', icon: '🔤', guia: '🐿️', color: '#E0598B',
    historia: 'La ardilla Letrita busca letras por todo el bosque.',
    juegos: [
      g('camino', Camino, { titulo: 'El camino de las letras', icon: '🐞', color: '#E8412C', evalua: 'forma de la letra y dirección del trazo', como: 'Mira cómo se escribe la letra y luego repásala con el dedo o el mouse.' }),
      g('zoologico', Zoologico, { titulo: 'El zoológico de los sonidos', icon: '🦁', color: '#F2A20C', evalua: 'conciencia fonológica: sonido inicial', como: 'Dale de comer al animal: escoge las palabras que empiezan con la letra.' }),
      g('burbujas', Burbujas, { titulo: 'Explota la letra', icon: '🫧', color: '#2F8FD8', evalua: 'identificación de letras y sílabas', como: 'Escucha la letra o la sílaba y explota la burbuja correcta.' }),
    ],
  },
  {
    id: 'mundo', nombre: 'Isla de las Formas y el Tiempo', icon: '🔷', guia: '🦊', color: '#1D2A6B',
    historia: 'El zorro Explorador conoce figuras, relojes y la tiendita.',
    juegos: [
      g('formas', Formas, { titulo: 'Figuras geométricas', icon: '🔷', color: '#2F8FD8', evalua: 'figuras planas y sólidas (inglés y español)', como: 'Encuentra la figura que te piden o di cómo se llama: circle, square, triangle…' }),
      g('quehora', QueHora, { titulo: '¿Qué hora es?', icon: '⏰', color: '#E8412C', evalua: 'lectura del reloj', como: 'Mira el horario y el minutero y escoge la hora correcta.' }),
      g('tiendita', Tiendita, { titulo: 'La tiendita', icon: '🏪', color: '#2E9E5B', evalua: 'dinero colombiano: contar y pagar', como: 'Paga exacto el producto con monedas y billetes.' }),
    ],
  },
];

// Niveles de cada juego según el grado (según lo que trae el libro de cada salón)
const T16 = ['t1', 't2', 't3', 't4', 't5', 't6'];
const NIVELES = {
  tesoro: { pj: ['t10', 't20', 't50'], j: ['t20', 't100', 't200'], t: ['t100', 't1000', 't10000'] },
  tren: { pj: ['r3', 'r4p', 'rmp'], j: ['r4', 'r5j', 'rm'], t: ['r5', 'r6', 'rm'] },
  monstruo: { pj: ['m10', 'm20'], j: ['m20', 'm30', 'm100'], t: ['m30', 'm100'] },
  mision: { pj: ['s1', 's10p'], j: ['s1', 's2', 's2j', 's5'], t: ['s2', 's3', 's4', 's5'] },
  construye: { pj: ['c1'], j: ['c2', 'c2j'], t: ['c2', 'c3', 'c4'] },
  cocodrilo: { pj: ['k10', 'k20', 'k50'], j: ['k20', 'k100', 'k200'], t: ['k100', 'k1000', 'k10000'] },
  mono: { pj: ['mo10'], j: ['mo10', 'mo20'], t: ['mo20'] },
  patitos: { pj: ['p10'], j: ['p10', 'p20'], t: ['p20'] },
  pasteleria: { pj: ['pa1'], j: ['pa1', 'pa2', 'pa3'], t: ['pa2', 'pa3'] },
  robot: { pj: ['o5', 'o5r'], j: ['o10', 'o20', 'o2c'], t: ['o20', 'o2c', 'oll', 'opr', 'o1000'] },
  rio: { pj: ['o5', 'o5r'], j: ['o10', 'o20', 'o2c'], t: ['o20', 'o2c', 'oll', 'opr', 'o1000'] },
  vinculos: { pj: ['v5', 'v10'], j: ['v10', 'v20'], t: ['v10', 'v20', 'vm10'] },
  ranas: { pj: ['t1', 't2'], j: ['t1', 't2', 't3'], t: T16 },
  grupos: { j: ['g1'], t: ['g1', 'g2', 'g3'] },
  heladeria: { j: ['t1', 't2', 't3'], t: [...T16, 'tmix'] },
  piano: { j: ['t2', 't3'], t: T16.slice(1) },
  relampago: { pj: ['f1', 'f2'], j: ['f1', 'f2', 'f3', 'fen'], t: ['f2', 'f3', 'fen'] },
  parejas: { pj: ['pj4'], j: ['pj4', 'pj6', 'pjen'], t: ['pj6', 'pj8', 'pjen'] },
  detective: { pj: ['d8'], j: ['d8', 'd12', 'den'], t: ['d12', 'd16', 'den'] },
  'construye-palabra': { pj: ['cp1'], j: ['cp1', 'cp2'], t: ['cp2', 'cp3'] },
  lee: { j: ['lj'], t: ['lj', 'lt'] },
  camino: { pj: ['cv', 'cc'], j: ['cv', 'cc', 'cu'], t: ['cv', 'cc', 'cu'] },
  zoologico: { pj: ['zv', 'zc'], j: ['zv', 'zc', 'zt'], t: ['zc', 'zt'] },
  burbujas: { pj: ['bv', 'bc'], j: ['bv', 'bc', 'bs'], t: ['bc', 'bu', 'bs'] },
  formas: { pj: ['f2a', 'fo'], j: ['f2a', 'f2b', 'fo'], t: ['f2b', 'f3', 'fo'] },
  quehora: { pj: ['h1'], j: ['h1'], t: ['h1', 'h2'] },
  tiendita: { t: ['td1', 'td2', 'td3'] },
};

function adaptar(juego, grado) {
  const ids = NIVELES[juego.id]?.[grado];
  if (!ids) return null;
  const vocab = vocabGrado(grado);
  const vocabTodo = GRADOS[grado].letras.flatMap((l) => l.palabras);
  const cons = letrasSimples(grado).filter((l) => !'aeiou'.includes(l));
  const levels = ids.map((id) => juego.levels.find((l) => l.id === id)).filter(Boolean)
    .map((l) => ({ ...l, grado, vocab, vocabTodo, cons }));
  if (!levels.length) return null;
  return { ...juego, levels, base: `/g/${grado}/juegos` };
}

export function islasDeGrado(grado) {
  return ISLAS.map((i) => ({ ...i, juegos: i.juegos.map((j) => adaptar(j, grado)).filter(Boolean) })).filter((i) => i.juegos.length);
}
export function juegosDeGrado(grado) {
  return islasDeGrado(grado).flatMap((i) => i.juegos);
}
export function juegoDeGrado(grado, id) {
  return juegosDeGrado(grado).find((j) => j.id === id);
}

export const JUEGOS = ISLAS.flatMap((i) => i.juegos.map((j) => ({ ...j, isla: i.id })));
export const juegoPorId = (id) => JUEGOS.find((j) => j.id === id);
