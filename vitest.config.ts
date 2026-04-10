import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.yaml'],
  test: {
    globals: true,
    server: {
      deps: {
        inline: ['vitest-package-exports'],
      },
    },
    projects: [
      {
        test: {
          name: 'node',
          environment: 'node',
          exclude: [
            ...configDefaults.exclude,
            '**/*.browser.{test,spec}.?(c|m)[jt]s?(x)',
          ],
        },
      },
      {
        test: {
          name: 'browser',
          include: ['**/*.browser.{test,spec}.?(c|m)[jt]s?(x)'],
          exclude: configDefaults.exclude,
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
  },
})
