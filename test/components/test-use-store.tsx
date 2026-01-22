import { defineStore, useStore } from '../../src'

const store = defineStore({
  state: { count: 0 },
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
  },
  getters: {
    doubled() {
      return this.count * 2
    },
  },
})

export function TestUseStore() {
  const state = useStore(store)

  return (
    <div data-testid="test-use-store">
      <div data-testid="count">{state.count}</div>
      <div data-testid="doubled">{state.doubled}</div>
      <button data-testid="increment" onClick={() => state.increment()}>
        Increment
      </button>
      <button data-testid="decrement" onClick={() => state.decrement()}>
        Decrement
      </button>
    </div>
  )
}

export { store as testStore }
