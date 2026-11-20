import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' permite publicar en Netlify, Vercel, GitHub Pages o abrir desde cualquier carpeta
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
});
