import { delay } from '@hairy/utils'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { defineStore, useStatus } from '../src'
import { TestUseStatus } from './components/TestUseStatus'

describe('useStatus', () => {
  it('should be a function', () => {
    expect(typeof useStatus).toBe('function')
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

    expect(store.$status).toBeDefined()
    expect(store.$status.loading).toBe(false)
    expect(store.$status.finished).toBe(false)
    expect(store.$status.error).toBe(undefined)
    expect(store.$status.increment).toBeDefined()
  })

  it('should track action status', async () => {
    const store = defineStore({
      state: { count: 0 },
      actions: {
        async increment() {
          await new Promise(resolve => setTimeout(resolve, 10))
          this.count++
        },
      },
    })

    expect(store.$status.increment.loading).toBe(false)

    const promise = store.increment()
    expect(store.$status.increment.loading).toBe(true)

    await promise
    expect(store.$status.increment.loading).toBe(false)
    expect(store.$status.increment.finished).toBe(true)
  })

  describe('component integration', () => {
    it('should render and display initial status', async () => {
      const { container } = await render(<TestUseStatus />)

      const loadingElement = container.querySelector('[data-testid="loading"]')
      const finishedElement = container.querySelector('[data-testid="finished"]')
      const incrementLoadingElement = container.querySelector('[data-testid="increment-loading"]')
      const incrementFinishedElement = container.querySelector('[data-testid="increment-finished"]')

      expect(loadingElement?.textContent).toBe('false')
      expect(finishedElement?.textContent).toBe('false')
      expect(incrementLoadingElement?.textContent).toBe('false')
      expect(incrementFinishedElement?.textContent).toBe('false')
    })

    it.skip('should update status when async action is called', async () => {
      const { container, getByTestId } = await render(<TestUseStatus />)

      const incrementLoadingElement = container.querySelector('[data-testid="increment-loading"]')
      const loadingElement = container.querySelector('[data-testid="loading"]')
      const incrementFinishedElement = container.querySelector('[data-testid="increment-finished"]')
      const finishedElement = container.querySelector('[data-testid="finished"]')

      expect(incrementLoadingElement?.textContent).toBe('false')

      // Click increment button
      const incrementButton = getByTestId('increment')
      await incrementButton.click()

      // Wait for loading state
      await delay(0)
      expect(incrementLoadingElement?.textContent).toBe('true')
      expect(loadingElement?.textContent).toBe('true')

      // Wait for action to complete
      await new Promise(resolve => setTimeout(resolve, 20))

      expect(incrementLoadingElement?.textContent).toBe('false')
      expect(incrementFinishedElement?.textContent).toBe('true')
      expect(loadingElement?.textContent).toBe('false')
      expect(finishedElement?.textContent).toBe('true')
    })

    it.skip('should track multiple actions status', async () => {
      const { container, getByTestId } = await render(<TestUseStatus />)

      const incrementButton = getByTestId('increment')
      const decrementButton = getByTestId('decrement')
      const loadingElement = container.querySelector('[data-testid="loading"]')
      const finishedElement = container.querySelector('[data-testid="finished"]')

      // Start increment
      await incrementButton.click()
      await delay(0)
      expect(loadingElement?.textContent).toBe('true')

      // Start decrement while increment is still running
      await decrementButton.click()
      await delay(0)
      expect(loadingElement?.textContent).toBe('true')

      // Wait for both to complete
      await delay(0)
      expect(loadingElement?.textContent).toBe('false')
      expect(finishedElement?.textContent).toBe('true')
    })
  })
})
