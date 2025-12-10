import React from 'react'
import { defineStore, useStatus } from '../../src'

const store = defineStore({
  state: { count: 0 },
  actions: {
    async increment() {
      await new Promise(resolve => setTimeout(resolve, 10))
      this.count++
    },
    async decrement() {
      await new Promise(resolve => setTimeout(resolve, 10))
      this.count--
    },
  },
})

export function TestUseStatus() {
  const status = useStatus(store)

  return (
    <div data-testid="test-use-status">
      <div data-testid="loading">{String(status.loading)}</div>
      <div data-testid="finished">{String(status.finished)}</div>
      <div data-testid="increment-loading">{String(status.increment?.loading)}</div>
      <div data-testid="increment-finished">{String(status.increment?.finished)}</div>
      <button data-testid="increment" onClick={() => store.increment()}>
        Increment
      </button>
      <button data-testid="decrement" onClick={() => store.decrement()}>
        Decrement
      </button>
    </div>
  )
}

export { store as testStatusStore }
