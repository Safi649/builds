import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/public', // output folder for Netlify
    rollupOptions: {
      output: {
        manualChunks: undefined, // optional: you can add chunk splitting here
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src', // optional: if you are using @ as path alias
    },
  },
});
