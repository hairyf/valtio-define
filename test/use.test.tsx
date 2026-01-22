import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { defineStore, useStore } from '../src'

describe('useStore', () => {
  it('should be a function', () => {
    expect(typeof useStore).toBe('function')
  })

  it('should return a snapshot of store state in server-side rendering', () => {
    const store = defineStore({
      state: { count: 0, name: 'test' },
    })

    function TestComponent() {
      const state = useStore(store)
      return (
        <div>
          <span data-testid="count">{state.count}</span>
          <span data-testid="name">{state.name}</span>
        </div>
      )
    }

    const html = renderToString(<TestComponent />)
    expect(html).toContain('0')
    expect(html).toContain('test')
  })

  it('should return a snapshot with actions in server-side rendering', () => {
    const store = defineStore({
      state: { count: 0 },
      actions: {
        increment() {
          this.count++
        },
      },
    })

    function TestComponent() {
      const state = useStore(store)
      return (
        <div>
          <span data-testid="count">{state.count}</span>
          <span data-testid="has-increment">{typeof state.increment === 'function' ? 'true' : 'false'}</span>
        </div>
      )
    }

    const html = renderToString(<TestComponent />)
    expect(html).toContain('0')
    expect(html).toContain('true')
  })

  it('should return a snapshot with getters in server-side rendering', () => {
    const store = defineStore({
      state: { count: 5 },
      getters: {
        doubled() {
          return this.count * 2
        },
      },
    })

    function TestComponent() {
      const state = useStore(store)
      return (
        <div>
          <span data-testid="count">{state.count}</span>
          <span data-testid="doubled">{state.doubled}</span>
        </div>
      )
    }

    const html = renderToString(<TestComponent />)
    expect(html).toContain('5')
    expect(html).toContain('10')
  })

  it('should return a snapshot with actions and getters in server-side rendering', () => {
    const store = defineStore({
      state: { count: 3 },
      actions: {
        increment() {
          this.count++
        },
      },
      getters: {
        doubled() {
          return this.count * 2
        },
      },
    })

    function TestComponent() {
      const state = useStore(store)
      return (
        <div>
          <span data-testid="count">{state.count}</span>
          <span data-testid="doubled">{state.doubled}</span>
          <span data-testid="has-increment">{typeof state.increment === 'function' ? 'true' : 'false'}</span>
        </div>
      )
    }

    const html = renderToString(<TestComponent />)
    expect(html).toContain('3')
    expect(html).toContain('6')
    expect(html).toContain('true')
  })
})
