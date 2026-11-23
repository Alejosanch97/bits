// Registro de todos los juegos: agrega uno nuevo aquí y aparece en la Isla de Juegos
import { Tesoro, Tren, Monstruo, Mision, Construye, Cocodrilo } from './juegosNumeros.jsx';
import { Mono, Patitos, Pasteleria, Robot, Rio } from './juegosOperaciones.jsx';
import { Ranas, Grupos, Heladeria, Piano } from './juegosTablas.jsx';
import { Relampago, Parejas, Detective, ConstruyePalabra } from './juegosLectura.jsx';
import { Camino, Zoologico, Burbujas } from './juegosLetras.jsx';

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
];

export const JUEGOS = ISLAS.flatMap((i) => i.juegos.map((j) => ({ ...j, isla: i.id })));
export const juegoPorId = (id) => JUEGOS.find((j) => j.id === id);
