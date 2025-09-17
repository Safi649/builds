// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: '.', // project root
  build: {
    outDir: 'dist/public', // matches Netlify publish folder
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.tsx'), // <-- your main entry
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
