import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'client', // <-- root is the client folder
  build: {
    outDir: 'dist/public', // build output
    rollupOptions: {
      input: path.resolve(__dirname, 'client/src/main.tsx'), // <-- correct entry
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
});
