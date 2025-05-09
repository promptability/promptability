import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'popup.html'),
        contentScript: resolve(__dirname, './src/content-script.tsx'),
        background: resolve(__dirname, './public/background.js'),
      },
      output: {
        entryFileNames: (chunk) => {
          return chunk.name === 'contentScript' ? 'content-script.js' : '[name].js';
        },
      },
    },
  },
});