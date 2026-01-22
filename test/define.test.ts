import { delay } from '@hairy/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineStore } from '../src/define'

describe('defineStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic store', () => {
    it('should create a store with state', () => {
      const store = defineStore({
        state: { count: 0 },
      })

      expect(store.$state).toBeDefined()
      expect(store.$state.count).toBe(0)
    })

    it('should create a store with state function', () => {
      const store = defineStore({
        state: () => ({ count: 0, name: 'test' }),
      })

      expect(store.$state.count).toBe(0)
      expect(store.$state.name).toBe('test')
    })

    it('should allow state modification', () => {
      const store = defineStore({
        state: { count: 0 },
      })

      store.$state.count = 10
      expect(store.$state.count).toBe(10)
    })
  })

  describe('actions', () => {
    it('should create actions', () => {
      const store = defineStore({
        state: { count: 0 },
        actions: {
          increment() {
            this.count++
          },
        },
      })

      expect(store.increment).toBeDefined()
      expect(typeof store.increment).toBe('function')
    })

    it('should execute actions and modify state', () => {
      const store = defineStore({
        state: { count: 0 },
        actions: {
          increment() {
            this.count++
          },
        },
      })

      store.increment()
      expect(store.$state.count).toBe(1)

      store.increment()
      expect(store.$state.count).toBe(2)
    })

    it('should support actions with parameters', () => {
      const store = defineStore({
        state: { count: 0 },
        actions: {
          increment(by: number) {
            this.count += by
          },
        },
      })

      store.increment(5)
      expect(store.$state.count).toBe(5)

      store.increment(3)
      expect(store.$state.count).toBe(8)
    })

    it('should support multiple actions', () => {
      const store = defineStore({
        state: { count: 0, value: 0 },
        actions: {
          increment() {
            this.count++
          },
          setValue(value: number) {
            this.value = value
          },
        },
      })

      store.increment()
      store.setValue(100)

      expect(store.$state.count).toBe(1)
      expect(store.$state.value).toBe(100)
    })

    it('should return values from actions', () => {
      const store = defineStore({
        state: { count: 0 },
        actions: {
          increment() {
            this.count++
            return this.count
          },
        },
      })

      const result = store.increment()
      expect(result).toBe(1)
      expect(store.$state.count).toBe(1)
    })
  })

  describe('async actions', () => {
    it('should handle async actions', async () => {
      const store = defineStore({
        state: { data: null as any },
        actions: {
          async fetchData() {
            await new Promise(resolve => setTimeout(resolve, 10))
            this.data = { value: 42 }
            return this.data
          },
        },
      })

      const promise = store.fetchData()

      const result = await promise

      expect(result.value).toBe(42)
      expect(store.$state.data.value).toBe(42)
    })

    it('should track concurrent async actions', async () => {
      const store = defineStore({
        state: { count: 0 },
        actions: {
          async delay(ms: number) {
            await new Promise(resolve => setTimeout(resolve, ms))
            this.count++
          },
        },
      })

      const promise1 = store.delay(20)
      const promise2 = store.delay(30)

      await promise1

      expect(store.$state.count).toBe(1)

      await promise2

      expect(store.$state.count).toBe(2)
    })
  })

  describe('getters', () => {
    it('should create getters', () => {
      const store = defineStore({
        state: { count: 0 },
        getters: {
          doubled() {
            return this.count * 2
          },
        },
      })

      expect(store.$getters.doubled).toBe(0)
    })

    it('should compute getters based on state', () => {
      const store = defineStore({
        state: { count: 5 },
        getters: {
          doubled() {
            return this.count * 2
          },
        },
      })

      expect(store.$getters.doubled).toBe(10)
      expect(store.$state.doubled).toBe(10)
    })

    it('should update getters when state changes', () => {
      const store = defineStore({
        state: { count: 5 },
        getters: {
          doubled() {
            return this.count * 2
          },
        },
      })

      expect(store.$getters.doubled).toBe(10)

      store.$state.count = 10
      expect(store.$getters.doubled).toBe(20)
    })

    it('should support multiple getters', () => {
      const store = defineStore({
        state: { count: 5 },
        getters: {
          doubled() {
            return this.count * 2
          },
          tripled() {
            return this.count * 3
          },
        },
      })

      expect(store.$getters.doubled).toBe(10)
      expect(store.$getters.tripled).toBe(15)
      expect(store.$state.doubled).toBe(10)
      expect(store.$state.tripled).toBe(15)
    })

    it('should allow getters to access other getters', () => {
      const store = defineStore({
        state: { count: 5 },
        getters: {
          doubled() {
            return this.count * 2
          },
          quadrupled() {
            return this.count * 4
          },
        },
      })

      expect(store.$getters.doubled).toBe(10)
      expect(store.$getters.quadrupled).toBe(20)
    })
  })

  describe('$subscribe', () => {
    it('should subscribe to state changes', async () => {
      const store = defineStore({
        state: { count: 0 },
      })

      const listener = vi.fn()
      const unsubscribe = store.$subscribe(listener)

      store.$state.count = 1
      await delay(0)
      expect(listener).toHaveBeenCalledTimes(1)

      store.$state.count = 2
      await delay(0)
      expect(listener).toHaveBeenCalledTimes(2)

      unsubscribe()
      store.$state.count = 3
      await delay(0)
      expect(listener).toHaveBeenCalledTimes(2)
    })
  })

  describe('$patch', () => {
    it('should patch state with object', async () => {
      const store = defineStore({
        state: { count: 0, name: 'test' },
      })

      store.$patch({ count: 10, name: 'updated' })
      await delay(0)
      expect(store.$state.count).toBe(10)
      expect(store.$state.name).toBe('updated')
    })

    it('should patch state with function', () => {
      const store = defineStore({
        state: { count: 0, name: 'test' },
      })

      store.$patch((state) => {
        state.count = 20
        state.name = 'patched'
      })

      expect(store.$state.count).toBe(20)
      expect(store.$state.name).toBe('patched')
    })

    it('should trigger subscription on patch', async () => {
      const store = defineStore({
        state: { count: 0 },
      })

      const listener = vi.fn()
      store.$subscribe(listener)

      store.$patch({ count: 10 })

      await delay(0)
      expect(listener).toHaveBeenCalledTimes(1)

      store.$patch((state) => {
        state.count = 20
      })
      await delay(0)
      expect(listener).toHaveBeenCalledTimes(2)
    })
  })

  describe('combined features', () => {
    it('should work with state, actions, and getters together', () => {
      const store = defineStore({
        state: { count: 0 },
        getters: {
          doubled() {
            return this.count * 2
          },
        },
        actions: {
          increment() {
            this.count++
          },
          incrementBy(by: number) {
            this.count += by
          },
        },
      })

      expect(store.$state.count).toBe(0)
      expect(store.$state.doubled).toBe(0)

      store.increment()
      expect(store.$state.count).toBe(1)
      expect(store.$state.doubled).toBe(2)

      store.incrementBy(5)
      expect(store.$state.count).toBe(6)
      expect(store.$state.doubled).toBe(12)
    })

    it('should handle complex async actions with getters', async () => {
      const store = defineStore({
        state: { items: [] as number[] },
        getters: {
          count() {
            return this.items.length
          },
          sum() {
            return this.items.reduce((acc, item) => acc + item, 0)
          },
        },
        actions: {
          async addItem(item: number) {
            await new Promise(resolve => setTimeout(resolve, 10))
            this.items.push(item)
          },
        },
      })

      expect(store.$state.count).toBe(0)
      expect(store.$state.sum).toBe(0)

      await store.addItem(5)
      expect(store.$state.count).toBe(1)
      expect(store.$state.sum).toBe(5)

      await store.addItem(10)
      expect(store.$state.count).toBe(2)
      expect(store.$state.sum).toBe(15)
    })
  })
})
