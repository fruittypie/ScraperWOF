// vite.config.js
import react from '@vitejs/plugin-react-swc';
import svgrPlugin from 'vite-plugin-svgr';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    
  const env = loadEnv(mode, process.cwd(), '');

    return {
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
        esbuildOptions: {
          loader: {
            '.js': 'jsx',
          },
        },
      },
        define: {
            'process.env.API_URL': JSON.stringify(env.API_URL),
            'process.env.HOST_URL': JSON.stringify(env.HOST_URL),
        },
    };
});