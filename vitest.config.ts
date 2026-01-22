import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.yaml'],
  test: {
    globals: true,
    projects: [
      {
        test: {
          name: 'node',
          environment: 'node',
          include: [
            '!test/**/*.browser.test.{ts,tsx,js,jsx}',
            'test/*.test.{ts,js}',
          ],
          server: {
            deps: {
              inline: ['vitest-package-exports'],
            },
          },
        },
      },
      {
        test: {
          name: 'browser',
          include: ['test/**/*.browser.test.{ts,tsx,js,jsx}'],
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
