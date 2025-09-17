import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: '.', // root of project
  plugins: [react()],
  build: {
    outDir: 'dist/public', // output directory for Netlify
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // entry file
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
