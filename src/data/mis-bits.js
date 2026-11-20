// =====================================================================
//  BITS DEL COLEGIO — se ven en TODOS los computadores (vienen en el código)
//  Para agregar un mazo copia un bloque y cambia el nombre y las palabras.
//   - lang: 'es' (español) o 'en' (inglés)
//   - palabras: "palabra:emoji" o solo "palabra", separadas por espacio
//   - usa _ para espacios: "buenos_días:☀️"
//  Truco: en la app, Mis bits → "Pasar al archivo" te genera este texto.
// =====================================================================

export const MAZOS_COLEGIO = [
  {
    nombre: 'Nuestro colegio',
    lang: 'es',
    color: '#C8352B',
    palabras: 'colegio:🏫 profesora:👩‍🏫 salón:🚪 recreo:🛝 tablero:🧑‍🏫 cuaderno:📓 lonchera:🍱 uniforme:🎽 amigos:🧑‍🤝‍🧑 biblioteca:📚 bandera:🚩 escudo:🛡️ crear:✨',
  },
  {
    nombre: 'Mi familia',
    lang: 'es',
    color: '#7A4FD6',
    palabras: 'mamá:👩 papá:👨 hermano:👦 hermana:👧 abuela:👵 abuelo:👴 bebé:👶 tío:🧔 tía:👩 primo:🧒 mascota:🐶 casa:🏠',
  },
  {
    nombre: 'Classroom words',
    lang: 'en',
    color: '#2F8FD8',
    palabras: 'hello:👋 goodbye:🤚 please:🙏 thank_you:💐 sit_down:🪑 stand_up:🧍 listen:👂 look:👀 quiet:🤫 line_up:🚶 clean_up:🧹 good_job:🌟',
  },
];

export function parsePalabras(str, lang) {
  return str.split(/\s+/).filter(Boolean).map((tok) => {
    const i = tok.indexOf(':');
    const texto = (i >= 0 ? tok.slice(0, i) : tok).replace(/_/g, ' ');
    return { texto, emoji: i >= 0 ? tok.slice(i + 1) : null, letra: lang === 'es' ? texto[0].toLowerCase() : null };
  });
}
