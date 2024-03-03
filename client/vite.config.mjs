// vite.config.js
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react-swc';
import svgrPlugin from 'vite-plugin-svgr';

dotenv.config({
  path: `./.env.${process.env.NODE_ENV || 'development'}`,
});

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
  define: {
    'process.env': process.env,
  },
  build: {
    // Add esbuildOptions to handle JSX in react-drag-select library
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
