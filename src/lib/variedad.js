// Evita que los juegos repitan la misma respuesta seguida.
// variado('patitos', generador, (x) => x.respuesta) vuelve a generar si la respuesta
// salió en las últimas rondas de ese juego.
const recientes = new Map();

export function variado(clave, gen, firma, memoria = 4, intentos = 30) {
  const prev = recientes.get(clave) || [];
  let x = gen();
  for (let i = 0; i < intentos && prev.includes(firma(x)); i++) x = gen();
  recientes.set(clave, [firma(x), ...prev].slice(0, memoria));
  return x;
}
