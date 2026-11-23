# Bits Mágicos · Instituto Pedagógico CREAR

Plataforma de bits (método Glenn Doman) para preescolar: **Lengua Castellana**, **Matemáticas hasta el 1000** e **Inglés**, con juegos, monedas y un álbum de stickers.

## Escudo oficial

El escudo oficial ya viene en **`public/escudo.png`** (con fondo transparente). Para cambiarlo, reemplaza ese archivo con otro del mismo nombre.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera /dist para publicar (Netlify, Vercel, GitHub Pages…)
```

## Qué trae

| Sección | Contenido |
|---|---|
| 🅰️ Letras | 27 letras, ~300 bits por letra en grupos de 20. Bits estilo Doman: **primera letra en MAYÚSCULA roja**, el resto en negro (minúscula o MAYÚSCULA). Sílabas, "Lee y encuentra", "Mira y lee" |
| 🔢 Números | Puntos de Doman del 1 al 20 · método Singapur (cubitos, barras, placas y cubos de mil) hasta el 10.000 · explorador 0–10.000 con tabla UM-C-D-U · sumas y restas con marcos de 10 · tablas del 1 al 9 · "¿Cuántos hay?" |
| 🌴 English | 17 mundos de vocabulario |
| 🎮 Juegos | **22 juegos** en 5 islas (números, operaciones, tablas, palabras, letras) con niveles, combos, monedas y estrellas |
| 🚀 Lector Cohete | Teleprompter: la profe escribe el texto, ajusta tamaño y velocidad; cronómetro, palabras por minuto y cada palabra se colorea. Modo automático o clic a clic |
| ✨ Mis bits | Mazos propios con emoji o foto; Exportar/Importar; "Pasar al archivo" para dejarlos fijos en `src/data/mis-bits.js` |
| 🎁 Premios | Cofre y álbum de 36 stickers |
| 🍎 Profe | Monedas para la clase, velocidad, voz, MAYÚSCULAS |

### Juegos

- **Números:** El tesoro de los números · El tren numérico · Alimenta al monstruo · Misión espacial · Construye el número · El cocodrilo comelón
- **Operaciones:** El mono comelón · Los patitos perdidos · La pastelería matemática · Repara al robot · Cruza el río
- **Tablas:** Las ranas saltarinas · Fábrica de grupos · La heladería multiplicadora · El piano de las tablas
- **Palabras:** Palabras relámpago · Parejas mágicas · El detective de palabras · Construye la palabra
- **Letras:** El camino de las letras (trazar con el dedo) · El zoológico de los sonidos · Explota la letra

Para agregar un juego: crea el componente en `src/games/` y regístralo en `src/games/index.js`.

**En el video beam:** botón ⛶ = pantalla completa · Espacio = pausa / siguiente · ← → = anterior/siguiente · Esc = salir.

## Agregar palabras

- Español: `src/data/vocabulario.js` → escribe `palabra:🦄` (o solo `palabra`) dentro de la letra.
- Bits del colegio (todos los computadores): `src/data/mis-bits.js`.
- Inglés: `src/data/english.js` → añade `['word', '🦄']` en la categoría.

## Voz

Por defecto usa la voz del navegador (en Chrome/Edge suena mejor; Edge trae voces "Natural" de Colombia y México).

### Voces de ElevenLabs (opcional)

1. Copia `.env.example` como `.env.local` y pega tu clave en `ELEVENLABS_API_KEY=` (este archivo **no** se sube a GitHub).
2. `npm run audios:calcular` → muestra cuántos caracteres gastará.
3. `npm run audios` → genera los MP3 en `public/audio/` (letras, sílabas, inglés y números 0–100).
   - `npm run audios -- --numeros=1000` también genera los números hasta 1000 (~26.000 caracteres en total).
   - Puedes cambiar las voces con `ELEVENLABS_VOICE_ES` y `ELEVENLABS_VOICE_EN`.
4. Haz commit de `public/audio/`. La app usa automáticamente esos audios y, si falta alguno, vuelve a la voz del navegador.

Stack: React 18 + Vite, three.js (mundo 3D), GSAP (monedas voladoras), canvas-confetti, fuentes Andika (diseñada para aprender a leer) y Lilita One.
