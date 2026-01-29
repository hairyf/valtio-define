// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'app',
    pnpm: true,
    rules: {
      'yaml/sort-keys': 'off',
    },
    ignores: [
      '**/skills/**',
    ],
  },
)
