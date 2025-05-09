import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contentScript: resolve(__dirname, 'src/content/contentScript.ts'),
        background: resolve(__dirname, 'src/background/serviceWorker.ts')
      },
      output: {
        entryFileNames: chunk => {
          if (chunk.name === 'contentScript') {
            return 'contentScript.js';
          }
          if (chunk.name === 'background') {
            return 'background.js';
          }
          return 'assets/[name]-[hash].js';
        }
      }
    }
  }
});