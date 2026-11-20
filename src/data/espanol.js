// Vocabulario de bits por letra — Lengua Castellana (método Glenn Doman)
// Formato: [palabra, emoji]. Para agregar palabras, solo añade una línea.

const raw = {
  a: [['abeja', '🐝'], ['árbol', '🌳'], ['avión', '✈️'], ['araña', '🕷️'], ['anillo', '💍'], ['ajo', '🧄'], ['ancla', '⚓'], ['aguacate', '🥑'], ['ardilla', '🐿️'], ['abuela', '👵'], ['abuelo', '👴'], ['agua', '💧'], ['arcoíris', '🌈'], ['astronauta', '🧑‍🚀'], ['ambulancia', '🚑'], ['arroz', '🍚']],
  e: [['elefante', '🐘'], ['estrella', '⭐'], ['escalera', '🪜'], ['erizo', '🦔'], ['escoba', '🧹'], ['espejo', '🪞'], ['escuela', '🏫'], ['ensalada', '🥗'], ['empanada', '🥟'], ['enfermera', '👩‍⚕️'], ['escorpión', '🦂'], ['edificio', '🏢'], ['esquí', '⛷️'], ['estrella de mar', '⭐']],
  i: [['isla', '🏝️'], ['iguana', '🦎'], ['imán', '🧲'], ['iglesia', '⛪'], ['insecto', '🪲'], ['invierno', '☃️'], ['idea', '💡'], ['impresora', '🖨️'], ['inodoro', '🚽'], ['indígena', '🪶'], ['iglú', '🛖']],
  o: [['oso', '🐻'], ['oveja', '🐑'], ['ojo', '👁️'], ['oreja', '👂'], ['olla', '🍲'], ['ola', '🌊'], ['oruga', '🐛'], ['ostra', '🦪'], ['oso polar', '🐻‍❄️'], ['oro', '🪙'], ['ovni', '🛸'], ['oliva', '🫒'], ['ocho', '8️⃣'], ['orquesta', '🎻']],
  u: [['uva', '🍇'], ['uña', '💅'], ['unicornio', '🦄'], ['uno', '1️⃣'], ['universo', '🌌'], ['uniforme', '🎽'], ['urna', '🗳️'], ['utensilios', '🍴']],
  b: [['barco', '🚢'], ['ballena', '🐋'], ['banana', '🍌'], ['bebé', '👶'], ['bota', '👢'], ['búho', '🦉'], ['burro', '🫏'], ['bicicleta', '🚲'], ['balón', '🏀'], ['bombero', '🧑‍🚒'], ['brócoli', '🥦'], ['bandera', '🚩'], ['búfalo', '🐃'], ['bolso', '👜'], ['bombillo', '💡'], ['brazo', '💪'], ['bus', '🚌'], ['búmeran', '🪃']],
  c: [['casa', '🏠'], ['carro', '🚗'], ['caballo', '🐴'], ['conejo', '🐰'], ['cama', '🛏️'], ['cocodrilo', '🐊'], ['corazón', '❤️'], ['cohete', '🚀'], ['camello', '🐫'], ['cebolla', '🧅'], ['cereza', '🍒'], ['cerdo', '🐷'], ['cisne', '🦢'], ['coco', '🥥'], ['cangrejo', '🦀'], ['camisa', '👕'], ['cuchara', '🥄'], ['cámara', '📷'], ['caracol', '🐌'], ['cebra', '🦓'], ['corona', '👑'], ['castillo', '🏰']],
  d: [['dado', '🎲'], ['dedo', '☝️'], ['delfín', '🐬'], ['dinosaurio', '🦕'], ['diente', '🦷'], ['dulce', '🍬'], ['dona', '🍩'], ['dragón', '🐉'], ['diamante', '💎'], ['doctor', '👨‍⚕️'], ['durazno', '🍑'], ['dormir', '😴'], ['dinero', '💵']],
  f: [['foca', '🦭'], ['fresa', '🍓'], ['flor', '🌸'], ['fuego', '🔥'], ['fantasma', '👻'], ['flamenco', '🦩'], ['fútbol', '⚽'], ['fideos', '🍝'], ['fiesta', '🎉'], ['familia', '👨‍👩‍👧'], ['feliz', '😄'], ['flauta', '🪈'], ['fresas', '🍓'], ['foto', '🖼️']],
  g: [['gato', '🐱'], ['gallina', '🐔'], ['gallo', '🐓'], ['globo', '🎈'], ['gorila', '🦍'], ['gusano', '🪱'], ['guitarra', '🎸'], ['gafas', '👓'], ['galleta', '🍪'], ['gorra', '🧢'], ['ganso', '🪿'], ['girasol', '🌻'], ['gol', '🥅'], ['granjero', '🧑‍🌾']],
  h: [['helado', '🍦'], ['hoja', '🍃'], ['huevo', '🥚'], ['hormiga', '🐜'], ['hipopótamo', '🦛'], ['hongo', '🍄'], ['hamburguesa', '🍔'], ['hada', '🧚'], ['helicóptero', '🚁'], ['hueso', '🦴'], ['hielo', '🧊'], ['hámster', '🐹'], ['herramienta', '🔧'], ['hospital', '🏥']],
  j: [['jirafa', '🦒'], ['jugo', '🧃'], ['jabón', '🧼'], ['jaguar', '🐆'], ['jardín', '🏡'], ['jamón', '🍖'], ['juguete', '🧸'], ['jinete', '🏇'], ['joya', '💍'], ['jarra', '🫖'], ['jugar', '🤸']],
  k: [['koala', '🐨'], ['kiwi', '🥝'], ['karate', '🥋'], ['kayak', '🛶'], ['kilo', '⚖️'], ['kimono', '👘']],
  l: [['león', '🦁'], ['luna', '🌙'], ['libro', '📖'], ['lápiz', '✏️'], ['limón', '🍋'], ['loro', '🦜'], ['lobo', '🐺'], ['leche', '🥛'], ['lazo', '🎀'], ['langosta', '🦞'], ['lluvia', '🌧️'], ['llave', '🔑'], ['lagarto', '🦎'], ['lechuga', '🥬'], ['lupa', '🔍']],
  m: [['mamá', '👩'], ['mano', '✋'], ['manzana', '🍎'], ['mariposa', '🦋'], ['mono', '🐒'], ['moto', '🏍️'], ['miel', '🍯'], ['mar', '🌊'], ['maleta', '🧳'], ['mapa', '🗺️'], ['mago', '🧙'], ['medusa', '🪼'], ['mora', '🫐'], ['murciélago', '🦇'], ['muñeca', '🪆'], ['maíz', '🌽'], ['mariquita', '🐞'], ['música', '🎵'], ['montaña', '⛰️'], ['mesa', '🪵'], ['mío', '🙋']],
  n: [['nube', '☁️'], ['nariz', '👃'], ['naranja', '🍊'], ['nido', '🪺'], ['niño', '🧒'], ['niña', '👧'], ['nieve', '❄️'], ['noche', '🌃'], ['nuez', '🌰'], ['nadar', '🏊'], ['nota', '🎶'], ['nave', '🛸']],
  ñ: [['ñandú', '🦤'], ['piña', '🍍'], ['araña', '🕷️'], ['uña', '💅'], ['muñeca', '🪆'], ['cabaña', '🛖'], ['montaña', '⛰️'], ['sueño', '😴'], ['castaña', '🌰'], ['leña', '🪵'], ['piñata', '🪅'], ['niño', '🧒'], ['pañal', '🧷']],
  p: [['papá', '👨'], ['pato', '🦆'], ['perro', '🐶'], ['pez', '🐟'], ['pera', '🍐'], ['pelota', '⚽'], ['pizza', '🍕'], ['piña', '🍍'], ['pollito', '🐥'], ['pulpo', '🐙'], ['pingüino', '🐧'], ['payaso', '🤡'], ['paraguas', '☂️'], ['pan', '🍞'], ['palomitas', '🍿'], ['pastel', '🎂'], ['pájaro', '🐦'], ['pie', '🦶'], ['princesa', '👸'], ['perezoso', '🦥'], ['pavo', '🦃'], ['papa', '🥔']],
  q: [['queso', '🧀'], ['mosquito', '🦟'], ['paquete', '📦'], ['raqueta', '🎾'], ['esquí', '⛷️'], ['parque', '🛝'], ['chaqueta', '🧥'], ['quince', '🔢'], ['química', '🧪'], ['quieto', '🧍']],
  r: [['ratón', '🐭'], ['rana', '🐸'], ['rosa', '🌹'], ['reloj', '⏰'], ['regalo', '🎁'], ['robot', '🤖'], ['rey', '🤴'], ['reina', '👑'], ['rinoceronte', '🦏'], ['rueda', '🛞'], ['radio', '📻'], ['rayo', '⚡'], ['río', '🏞️'], ['ropa', '👚'], ['rojo', '🔴']],
  s: [['sol', '☀️'], ['serpiente', '🐍'], ['silla', '🪑'], ['sandía', '🍉'], ['sombrero', '👒'], ['sirena', '🧜‍♀️'], ['sándwich', '🥪'], ['sopa', '🍜'], ['semilla', '🌱'], ['sobre', '✉️'], ['sartén', '🍳'], ['saltamontes', '🦗'], ['sushi', '🍣'], ['sofá', '🛋️'], ['sapo', '🐸'], ['salchicha', '🌭']],
  t: [['tortuga', '🐢'], ['tomate', '🍅'], ['tigre', '🐯'], ['tren', '🚂'], ['taza', '☕'], ['tambor', '🥁'], ['tijeras', '✂️'], ['teléfono', '📱'], ['tiburón', '🦈'], ['tienda', '⛺'], ['tractor', '🚜'], ['trompeta', '🎺'], ['trofeo', '🏆'], ['tenedor', '🍴'], ['toro', '🐂'], ['taxi', '🚕'], ['tortilla', '🫓'], ['tucán', '🦜']],
  v: [['vaca', '🐮'], ['vaso', '🥤'], ['ventana', '🪟'], ['violín', '🎻'], ['volcán', '🌋'], ['vela', '🕯️'], ['venado', '🦌'], ['verde', '🟢'], ['viento', '🌬️'], ['vestido', '👗'], ['vampiro', '🧛'], ['velero', '⛵'], ['vaquero', '🤠']],
  w: [['wafle', '🧇'], ['wifi', '📶'], ['kiwi', '🥝'], ['sándwich', '🥪'], ['wok', '🥘']],
  x: [['saxofón', '🎷'], ['taxi', '🚕'], ['examen', '📝'], ['boxeo', '🥊'], ['explorador', '🧭'], ['rayos x', '🩻'], ['éxito', '🏆'], ['xilófono', '🎼']],
  y: [['yoyo', '🪀'], ['yate', '🛥️'], ['yegua', '🐎'], ['yema', '🍳'], ['playa', '🏖️'], ['payaso', '🤡'], ['rayo', '⚡'], ['yogur', '🥣'], ['yuca', '🍠']],
  z: [['zapato', '👟'], ['zorro', '🦊'], ['zanahoria', '🥕'], ['zapatilla', '🩴'], ['arroz', '🍚'], ['zancudo', '🦟'], ['taza', '☕'], ['lápiz', '✏️'], ['luz', '💡'], ['pez', '🐟'], ['nariz', '👃'], ['maíz', '🌽']],
};

const VOCALES = ['a', 'e', 'i', 'o', 'u'];
const ORDEN = ['a', 'e', 'i', 'o', 'u', 'm', 'p', 's', 'l', 't', 'n', 'd', 'c', 'r', 'f', 'b', 'v', 'g', 'j', 'h', 'ñ', 'q', 'k', 'y', 'z', 'x', 'w'];
const COLORES = ['#E8412C', '#1D2A6B', '#F2A20C', '#2E9E5B', '#2F8FD8', '#E0598B', '#7A4FD6', '#F26B1D'];

export const LETRAS = ORDEN.map((l, i) => ({
  letra: l,
  tipo: VOCALES.includes(l) ? 'vocal' : 'consonante',
  color: COLORES[i % COLORES.length],
  palabras: raw[l].map(([texto, emoji]) => ({ texto, emoji, letra: l })),
}));

export const TODAS_LAS_PALABRAS = LETRAS.flatMap((l) => l.palabras);

// Familias silábicas (ma me mi mo mu)
const SILABAS_ESPECIALES = {
  c: ['ca', 'co', 'cu', 'ce', 'ci'],
  g: ['ga', 'go', 'gu', 'gue', 'gui'],
  q: ['que', 'qui'],
  h: ['ha', 'he', 'hi', 'ho', 'hu'],
};
export function silabasDe(letra) {
  if (VOCALES.includes(letra)) return [];
  if (SILABAS_ESPECIALES[letra]) return SILABAS_ESPECIALES[letra];
  if (['w', 'x', 'k'].includes(letra)) return [];
  return VOCALES.map((v) => letra + v);
}
