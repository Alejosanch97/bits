# Bits Mágicos · Instituto Pedagógico CREAR

Plataforma de bits (método Glenn Doman) para preescolar: **Lengua Castellana**, **Matemáticas hasta el 1000** e **Inglés**, con mundo 3D, juegos, monedas y un álbum de stickers.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera /dist para publicar (Netlify, Vercel, GitHub Pages…)
```

## Qué trae

| Mundo | Contenido |
|---|---|
| 🅰️ Mundo de Letras | 27 letras (vocales primero), ~330 bits con letra protagonista resaltada, sílabas (ma me mi mo mu), "Lee y encuentra", "Mira y lee", mezcla mágica |
| 🔢 Mundo de Números | Tarjetas de puntos rojos (1–100), bits de numerales con colores por posición, explorador 0–1000 con bloques base 10, sumas y restas (hasta 5, 10, 20, decenas, centenas), "¿Cuántos hay?" |
| 🌴 English Island | 17 mundos: farm, school, colors, numbers, animals, ocean, fruits, food, body, family, transport, clothes, weather, toys, feelings, actions, shapes |
| 🎁 Cofre de premios | Las monedas ganadas abren un cofre con 36 stickers (comunes, raros y legendarios) |
| 🍎 Rincón de la profe | Crear bits propios con emoji o foto, dar monedas a la clase, velocidad de bits y voz, MAYÚSCULAS/minúsculas |

**En el video beam:** botón ⛶ = pantalla completa · Espacio = pausa · ← → = anterior/siguiente · Esc = salir.

## Agregar palabras

- Español: `src/data/espanol.js` → añade `['palabra', '🦄']` en la letra.
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
