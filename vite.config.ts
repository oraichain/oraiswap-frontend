import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import wasm from 'vite-plugin-wasm';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  // depending on your application, base can also be "/"
  base: '',
  plugins: [react(), wasm(), viteTsconfigPaths(), svgr(), nodePolyfills()],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000
  },
  define: {
    // here is the main update
    global: 'globalThis',
    exports: {}
  },
  test: {
    server: {
      deps: {
        inline: ['@cosmjs/tendermint-rpc']
      }
    },
    globals: true,
    setupFiles: './setupTest.ts',
    environment: 'jsdom',
    // coverage: {
    //   enabled: false,
    //   reporter: ['cobertura', 'html'],
    //   provider: 'v8',
    //   reportsDirectory: './coverage',
    //   exclude: []
    // },
    exclude: []
  }
});
