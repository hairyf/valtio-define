import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { defineStore } from '../src'
import { storeToState, storeToStates } from '../src/utils'

describe('storeToState', () => {
  it('should be a function', () => {
    expect(typeof storeToState).toBe('function')
  })

  it('should return state and setter for a single key', () => {
    const store = defineStore({
      state: { count: 0, name: 'test' },
    })

    function TestComponent() {
      const [count] = storeToState(store, 'count')
      const [name] = storeToState(store, 'name')

      return (
        <div>
          <span data-testid="count">{count}</span>
          <span data-testid="name">{name}</span>
        </div>
      )
    }

    const html = renderToString(<TestComponent />)
    expect(html).toContain('0')
    expect(html).toContain('test')
  })

  it('should update state when setter is called with value', () => {
    const store = defineStore({
      state: { count: 0 },
    })

    function TestComponent() {
      const [count, setCount] = storeToState(store, 'count')

      // Test setter with direct value
      setCount(10)

      return (
        <div>
          <span data-testid="count">{count}</span>
        </div>
      )
    }

    renderToString(<TestComponent />)
    expect(store.$state.count).toBe(10)
  })

  it('should update state when setter is called with function', () => {
    const store = defineStore({
      state: { count: 5 },
    })

    function TestComponent() {
      const [count, setCount] = storeToState(store, 'count')

      // Test setter with function
      setCount(prev => prev + 3)

      return (
        <div>
          <span data-testid="count">{count}</span>
        </div>
      )
    }

    renderToString(<TestComponent />)
    expect(store.$state.count).toBe(8)
  })

  it('should work with multiple keys independently', () => {
    const store = defineStore({
      state: { count: 0, name: 'initial', value: 100 },
    })

    function TestComponent() {
      const [count, setCount] = storeToState(store, 'count')
      const [name, setName] = storeToState(store, 'name')
      const [value, setValue] = storeToState(store, 'value')

      setCount(5)
      setName('updated')
      setValue(prev => prev * 2)

      return (
        <div>
          <span data-testid="count">{count}</span>
          <span data-testid="name">{name}</span>
          <span data-testid="value">{value}</span>
        </div>
      )
    }

    renderToString(<TestComponent />)
    expect(store.$state.count).toBe(5)
    expect(store.$state.name).toBe('updated')
    expect(store.$state.value).toBe(200)
  })
})

describe('storeToStates', () => {
  it('should be a function', () => {
    expect(typeof storeToStates).toBe('function')
  })

  it('should return state and setters for all keys', () => {
    const store = defineStore({
      state: { count: 0, name: 'test', value: 42 },
    })

    function TestComponent() {
      const states = storeToStates(store)

      return (
        <div>
          <span data-testid="count">{states.count[0]}</span>
          <span data-testid="name">{states.name[0]}</span>
          <span data-testid="value">{states.value[0]}</span>
        </div>
      )
    }

    const html = renderToString(<TestComponent />)
    expect(html).toContain('0')
    expect(html).toContain('test')
    expect(html).toContain('42')
  })

  it('should allow updating all states through setters', () => {
    const store = defineStore({
      state: { count: 0, name: 'initial', value: 10 },
    })

    function TestComponent() {
      const states = storeToStates(store)

      // Update all states
      states.count[1](5)
      states.name[1]('updated')
      states.value[1](prev => +prev * 3)

      return (
        <div>
          <span data-testid="count">{states.count[0]}</span>
          <span data-testid="name">{states.name[0]}</span>
          <span data-testid="value">{states.value[0]}</span>
        </div>
      )
    }

    renderToString(<TestComponent />)
    expect(store.$state.count).toBe(5)
    expect(store.$state.name).toBe('updated')
    expect(store.$state.value).toBe(30)
  })

  it('should work with empty state object', () => {
    const store = defineStore({
      state: {},
    })

    function TestComponent() {
      const states = storeToStates(store)

      return (
        <div>
          <span data-testid="empty">{Object.keys(states).length}</span>
        </div>
      )
    }

    const html = renderToString(<TestComponent />)
    expect(html).toContain('0')
  })

  it('should work with complex state structure', () => {
    const store = defineStore({
      state: {
        user: { name: 'John', age: 30 },
        items: [1, 2, 3],
        count: 0,
      },
    })

    function TestComponent() {
      const {
        count: [count, setCount],
        user: [user, setUser],
        items: [items, setItems],
      } = storeToStates(store)

      setCount(10)
      setUser({ name: 'Jane', age: 25 })
      setItems([4, 5, 6])

      return (
        <div>
          <span data-testid="count">{count}</span>
          <span data-testid="user">{user.name}</span>
          <span data-testid="items">{items.join(',')}</span>
        </div>
      )
    }

    renderToString(<TestComponent />)
    expect(store.$state.count).toBe(10)
    expect(store.$state.user).toEqual({ name: 'Jane', age: 25 })
    expect(store.$state.items).toEqual([4, 5, 6])
  })
})
