// =====================================================================
//  MY QUICK READING BOOK (MQRB) — igual para PJ, Jardín y Transición
//  Cada palabra se lee 4 veces en español (negro) y 4 en inglés (rojo).
//  Formato: [español, [inglés x4], emoji]
// =====================================================================

const S = (es, en, emoji) => ({ es, en: Array.isArray(en) ? en : [en, en, en, en], emoji });

export const MQRB = [
  { semana: 1, palabras: [
    S('mamá', ['mommy', 'mom', 'mother', 'mum'], '👩'),
    S('papá', ['daddy', 'dad', 'father', 'dad'], '👨'),
    S('bebé', ['baby', 'baby', 'infant', 'newborn'], '👶'),
    S('casa', 'house', '🏠'),
    S('feliz', 'happy', '😄'),
  ] },
  { semana: 2, palabras: [
    S('agua', 'water', '💧'),
    S('pies', 'feet', '🦶'),
    S('pato', 'duck', '🦆'),
    S('oso', 'bear', '🐻'),
    S('luna', 'moon', '🌙'),
    S('baño', 'bathroom', '🛁'),
  ] },
  { semana: 3, palabras: [
    S('amor', 'love', '❤️'),
    S('foto', 'photo', '📷'),
    S('niño', 'boy', '🧒'),
    S('ojos', 'eyes', '👀'),
    S('león', 'lion', '🦁'),
    S('bien', 'good', '👍'),
    S('huevo', 'egg', '🥚'),
  ] },
  { semana: 4, palabras: [
    S('corazón', 'heart', '💗'),
    S('gato', 'cat', '🐱'),
    S('leche', 'milk', '🥛'),
    S('éxito', 'success', '🏆'),
    S('dibujo', 'drawing', '🖍️'),
    S('fiesta', 'party', '🎉'),
    S('helado', 'ice cream', '🍦'),
    S('gané', 'I win', '🥇'),
  ] },
  { semana: 5, palabras: [
    S('bueno', 'well', '😊'),
    S('globo', 'balloon', '🎈'),
    S('fácil', 'easy', '👌'),
    S('espejo', 'mirror', '🪞'),
    S('juguetes', 'toy', '🧸'),
    S('lápiz', 'pencil', '✏️'),
    S('Colombia', 'Colombia', '🇨🇴'),
    S('dedo', 'finger', '☝️'),
  ] },
  { semana: 6, palabras: [
    S('jirafa', 'giraffe', '🦒'),
    S('urgente', 'urgent', '🚨'),
    S('kilómetro', 'kilometer', '📏'),
    S('mesa', 'table', '🪑'),
    S('computador', 'computer', '💻'),
    S('adiós', 'bye', '👋'),
    S('karate', 'karate', '🥋'),
    S('cama', 'bed', '🛏️'),
  ] },
  { semana: 7, palabras: [
    S('elefante', 'elephant', '🐘'),
    S('mano', 'hand', '✋'),
    S('balón', 'ball', '⚽'),
    S('ventana', 'window', '🪟'),
    S('sol', 'sun', '☀️'),
    S('plato', 'dish', '🍽️'),
    S('tetero', "baby's bottle", '🍼'),
    S('luz', 'light', '💡'),
  ] },
  { semana: 8, palabras: [
    S('televisor', 'TV', '📺'),
    S('cocina', 'kitchen', '🍳'),
    S('sopa', 'soup', '🍜'),
    S('jabón', 'soap', '🧼'),
    S('cabeza', 'head', '🙆'),
    S('dormir', 'sleep', '😴'),
    S('conejo', 'rabbit', '🐰'),
    S('lluvia', 'rain', '🌧️'),
  ] },
  { semana: 9, palabras: [
    S('quiero', 'wanna', '🙋'),
    S('aleluya', 'hallelujah', '🙌'),
    S('parque', 'park', '🛝'),
    S('médico', 'doctor', '👨‍⚕️'),
    S('estufa', 'stove', '🔥'),
    S('puerta', 'door', '🚪'),
    S('chocolate', 'chocolate', '🍫'),
    S('delicioso', 'delicious', '😋'),
    S('gallina', 'hen', '🐔'),
    S('avión', 'plane', '✈️'),
  ] },
  { semana: 10, palabras: [
    S('zapatos', 'shoes', '👟'),
    S('teléfono', 'phone', '📱'),
    S('policía', 'police', '👮'),
    S('barco', 'ship', '🚢'),
    S('queso', 'cheese', '🧀'),
    S('banano', 'banana', '🍌'),
    S('perro', 'dog', '🐶'),
    S('nariz', 'nose', '👃'),
    S('hermano', 'brother', '👦'),
    S('abajo', 'down', '👇'),
  ] },
];

export const MQRB_TODAS = MQRB.flatMap((s) => s.palabras.map((p) => ({ ...p, semana: s.semana })));
