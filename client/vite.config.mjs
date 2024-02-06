// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  build: {
    // Add esbuildOptions to handle JSX in react-drag-select library
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
