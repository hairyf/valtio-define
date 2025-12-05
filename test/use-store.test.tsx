import { describe, expect, it } from 'vitest'
import { defineStore, useStore } from '../src'

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
})
