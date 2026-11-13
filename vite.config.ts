import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'externalize-three-importmap',
        resolveId(source) {
          if (source === 'three') {
            return {
              id: 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js',
              external: true,
            };
          }
          if (source.startsWith('three/addons/')) {
            return {
              id: 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/' + source.slice('three/addons/'.length),
              external: true,
            };
          }
          return null;
        },
      },
    ],
    build: {
      rolldownOptions: {
        external: [/^https:\/\/cdn\.jsdelivr\.net\/npm\/three@0\.160\.0\//],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
