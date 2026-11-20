// Álbum de stickers que se ganan abriendo el cofre mágico
export const STICKERS = [
  { id: 'leon', emoji: '🦁', nombre: 'León valiente', rareza: 'comun' },
  { id: 'panda', emoji: '🐼', nombre: 'Panda dormilón', rareza: 'comun' },
  { id: 'zorro', emoji: '🦊', nombre: 'Zorrito listo', rareza: 'comun' },
  { id: 'pulpo', emoji: '🐙', nombre: 'Pulpo abrazos', rareza: 'comun' },
  { id: 'mariposa', emoji: '🦋', nombre: 'Mariposa', rareza: 'comun' },
  { id: 'delfin', emoji: '🐬', nombre: 'Delfín saltarín', rareza: 'comun' },
  { id: 'flamenco', emoji: '🦩', nombre: 'Flamenco', rareza: 'comun' },
  { id: 'tortuga', emoji: '🐢', nombre: 'Tortuga sabia', rareza: 'comun' },
  { id: 'abeja', emoji: '🐝', nombre: 'Abejita', rareza: 'comun' },
  { id: 'pinguino', emoji: '🐧', nombre: 'Pingüino', rareza: 'comun' },
  { id: 'koala', emoji: '🐨', nombre: 'Koala', rareza: 'comun' },
  { id: 'rana', emoji: '🐸', nombre: 'Rana cantora', rareza: 'comun' },
  { id: 'mariquita', emoji: '🐞', nombre: 'Mariquita', rareza: 'comun' },
  { id: 'loro', emoji: '🦜', nombre: 'Loro parlanchín', rareza: 'comun' },
  { id: 'paleta', emoji: '🍭', nombre: 'Paleta', rareza: 'comun' },
  { id: 'dona', emoji: '🍩', nombre: 'Dona', rareza: 'comun' },
  { id: 'cupcake', emoji: '🧁', nombre: 'Ponquecito', rareza: 'comun' },
  { id: 'globo', emoji: '🎈', nombre: 'Globo', rareza: 'comun' },
  { id: 'girasol', emoji: '🌻', nombre: 'Girasol', rareza: 'comun' },
  { id: 'sandia', emoji: '🍉', nombre: 'Sandía', rareza: 'comun' },
  { id: 'buho', emoji: '🦉', nombre: 'Búho profe', rareza: 'raro' },
  { id: 'ballena', emoji: '🐳', nombre: 'Ballena azul', rareza: 'raro' },
  { id: 'cohete', emoji: '🚀', nombre: 'Cohete', rareza: 'raro' },
  { id: 'arcoiris', emoji: '🌈', nombre: 'Arcoíris', rareza: 'raro' },
  { id: 'guitarra', emoji: '🎸', nombre: 'Guitarra', rareza: 'raro' },
  { id: 'carrusel', emoji: '🎠', nombre: 'Carrusel', rareza: 'raro' },
  { id: 'ovni', emoji: '🛸', nombre: 'Ovni', rareza: 'raro' },
  { id: 'planeta', emoji: '🪐', nombre: 'Planeta', rareza: 'raro' },
  { id: 'unicornio', emoji: '🦄', nombre: 'Unicornio', rareza: 'legendario' },
  { id: 'dragon', emoji: '🐉', nombre: 'Dragón', rareza: 'legendario' },
  { id: 'trex', emoji: '🦖', nombre: 'T-Rex', rareza: 'legendario' },
  { id: 'corona', emoji: '👑', nombre: 'Corona real', rareza: 'legendario' },
  { id: 'trofeo', emoji: '🏆', nombre: 'Gran trofeo', rareza: 'legendario' },
  { id: 'diamante', emoji: '💎', nombre: 'Diamante', rareza: 'legendario' },
  { id: 'escudo', emoji: '🛡️', nombre: 'Escudo CREAR', rareza: 'legendario' },
  { id: 'estrella', emoji: '🌟', nombre: 'Estrella CREAR', rareza: 'legendario' },
];

export const COSTO_COFRE = 5;

export function stickerAleatorio() {
  const r = Math.random();
  const rareza = r < 0.1 ? 'legendario' : r < 0.35 ? 'raro' : 'comun';
  const pool = STICKERS.filter((s) => s.rareza === rareza);
  return pool[Math.floor(Math.random() * pool.length)];
}
