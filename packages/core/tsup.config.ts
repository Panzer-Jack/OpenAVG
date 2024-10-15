import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  outDir: 'dist',
  format: ['esm'],
  splitting: true,
  sourcemap: true,
  clean: true,
  tsconfig: 'tsconfig.json',
})
