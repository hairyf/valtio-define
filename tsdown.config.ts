import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/plugins/**/*.ts',
  ],
  clean: true,
  dts: true,
  exports: {
    enabled: true,
    devExports: true,
  },
})
