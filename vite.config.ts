import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',               // ensure root is client folder
  publicDir: 'public',     // where your _redirects lives
  build: {
    outDir: 'dist/public', // Netlify publish folder
    emptyOutDir: true,
  }
});
