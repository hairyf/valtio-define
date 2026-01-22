import { delay } from '@hairy/utils'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { defineStore, useStore } from '../src'
import { testStore, TestUseStore } from './components/test-use-store'

describe('useStore', () => {
  it('should be a function', () => {
    expect(typeof useStore).toBe('function')
  })

  it('should work with defineStore', () => {
    const store = defineStore({
      state: { count: 0 },
      actions: {
        increment() {
          this.count++
        },
      },
    })

    expect(store.$state).toBeDefined()
    expect(store.$state.count).toBe(0)

    // useStore should return the same state snapshot
    // Note: This is a basic test. Full React testing would require @testing-library/react
    expect(typeof useStore).toBe('function')
  })

  it('should work with store that has getters', () => {
    const store = defineStore({
      state: { count: 5 },
      getters: {
        doubled() {
          return this.count * 2
        },
      },
    })

    expect(store.$state.count).toBe(5)
    expect(store.$state.doubled).toBe(10)
  })

  describe('component integration', () => {
    it('should render and display initial state', async () => {
      const { container } = await render(<TestUseStore />)

      const countElement = container.querySelector('[data-testid="count"]')
      const doubledElement = container.querySelector('[data-testid="doubled"]')

      expect(countElement?.textContent).toBe('0')
      expect(doubledElement?.textContent).toBe('0')
    })

    it('should update when actions are called', async () => {
      const { container, getByTestId } = await render(<TestUseStore />)

      const countElement = container.querySelector('[data-testid="count"]')
      const doubledElement = container.querySelector('[data-testid="doubled"]')

      expect(countElement?.textContent).toBe('0')
      expect(doubledElement?.textContent).toBe('0')

      // Click increment button
      const incrementButton = getByTestId('increment')
      await incrementButton.click()

      // Wait for React to re-render
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(countElement?.textContent).toBe('1')
      expect(doubledElement?.textContent).toBe('2')
    })

    it('should work with getters in component', async () => {
      // Reset store state
      testStore.$patch({ count: 5 })

      const { container } = await render(<TestUseStore />)

      const countElement = container.querySelector('[data-testid="count"]')
      const doubledElement = container.querySelector('[data-testid="doubled"]')

      expect(countElement?.textContent).toBe('5')
      expect(doubledElement?.textContent).toBe('10')
    })

    it('should update when store is patched externally', async () => {
      const { container } = await render(<TestUseStore />)

      const countElement = container.querySelector('[data-testid="count"]')
      const doubledElement = container.querySelector('[data-testid="doubled"]')

      // Patch store externally
      testStore.$patch({ count: 10 })

      // Wait for React to re-render
      await delay(50)

      expect(countElement?.textContent).toBe('10')
      expect(doubledElement?.textContent).toBe('20')
    })
  })
})
