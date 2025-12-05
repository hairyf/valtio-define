import { describe, expect, it } from 'vitest'
import { defineStore, useStatus } from '../src'

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
})
