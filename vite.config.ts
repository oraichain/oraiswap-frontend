import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    svgr({
      include: '**/*.svg'
    })
  ],
  resolve: {
    alias: {
      buffer: 'buffer',
      src: path.resolve('src/'),
      components: path.resolve('src/components'),
      libs: path.resolve('src/libs'),
      hooks: path.resolve('src/hooks'),
      assets: path.resolve('src/assets'),
      config: path.resolve('src/config'),
      context: path.resolve('src/context'),
      helper: path.resolve('src/helper'),
      layouts: path.resolve('src/layouts'),
      pages: path.resolve('src/pages'),
      reducer: path.resolve('src/reducer'),
      rest: path.resolve('src/rest'),
      store: path.resolve('src/store'),
      styles: path.resolve('src/styles'),
      test: path.resolve('src/test'),
      routes: path.resolve('src/routes')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: []
    }
  }
});
