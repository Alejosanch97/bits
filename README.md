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

## Organización por grados

En el inicio se escoge el grado y todo queda enfocado a ese salón (contenido tomado de los libros de CREAR):

| Grado | Letras | Números | Juegos |
|---|---|---|---|
| 🐣 **Pre-Jardín (PJ)** | o, i, a, e, u + m, s, p, l, t, n, r, b | 0–50, decena, sumas y restas hasta 10, reloj | 22 |
| 🦁 **Jardín (J)** | abecedario completo, ce-ci, que-qui, gue-gui, ge-gi, combinaciones | 0–200, centena, < > =, series de 2 y 5, tablas 1–3 | 26 |
| 🚀 **Transición (T)** | abecedario, sílabas, combinaciones, poemas, fábulas, comprensión | 0–10.000, llevando, prestando, tablas 1–6, dinero | 27 |

Cada grado tiene: **Letras** (con frase del libro y bits de frases), **Lector Cohete** (con las lecturas del libro), **Números**, **Juegos** y **English**.
Compartido por los tres grados: **MQRB** (My Quick Reading Book, 10 semanas, cada palabra ×4 en español e inglés), **Geometría** (figuras 2D y 3D en inglés), Mis bits, Premios y Profe.

- Puntos de Glenn Doman solo del 1 al 20; del 21 en adelante, bloques del método Singapur.
- Los juegos no repiten la misma respuesta seguida.

### Juegos

- **Números:** tesoro, tren numérico, alimenta al monstruo, misión espacial, construye el número, cocodrilo comelón
- **Operaciones:** mono comelón, patitos, pastelería, repara al robot, cruza el río, vínculos numéricos
- **Tablas:** ranas saltarinas, fábrica de grupos, heladería, piano de las tablas
- **Palabras:** palabras relámpago, parejas mágicas, detective, construye la palabra, lee y responde
- **Letras:** camino de las letras, zoológico de sonidos, explota la letra
- **Formas y tiempo:** figuras geométricas, ¿qué hora es?, la tiendita (pesos colombianos)

Los niveles de cada juego por grado están en `src/games/index.js` (objeto `NIVELES`).

**En el video beam:** botón ⛶ = pantalla completa · Espacio = pausa / siguiente · ← → = anterior/siguiente · Esc = salir.

## Agregar palabras

- Palabras de cada grado: `src/data/grados.js` → escribe `palabra:🦄` (o solo `palabra`) en la letra del grado.
- Lecturas del Lector Cohete por grado: también en `src/data/grados.js` (`PJ_LECTURAS`, `J_LECTURAS`, `T_LECTURAS`).
- MQRB: `src/data/mqrb.js`.
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
