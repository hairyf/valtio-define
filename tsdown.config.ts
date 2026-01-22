import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/types/index.ts',
    'src/plugins/index.ts',
    'src/plugins/persistent/index.ts',
  ],
  dts: true,
  exports: true,
})
