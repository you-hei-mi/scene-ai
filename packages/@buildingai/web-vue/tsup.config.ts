import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    'ui/index': './ui/index.ts',
    'composables/index': './composables/index.ts',
    'stores/index': './stores/index.ts',
    'services/index': './services/index.ts',
    'types/index': './types/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['vue', 'vue-router', 'pinia', '@nuxt/ui'],
})
