import { defineConfig } from 'tsup';

export default defineConfig({
  target: 'es2015',
  platform: 'browser',
  format: ['cjs', 'esm'],
  splitting: false,
  shims: false,
  minify: false,
  sourcemap: true,
  clean: true,
  external: ['http-wizard'],
});
