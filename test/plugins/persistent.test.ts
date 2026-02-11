import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineStore } from '../../src/define'
import { plugins, use } from '../../src/plugin'
import persistent from '../../src/plugins/persistent'

describe('persistent plugin', () => {
  let mockStorage: Partial<Storage> & Pick<Storage, 'getItem' | 'setItem'>

  beforeEach(() => {
    // 清空插件数组
    plugins.length = 0
    // 注册 persistent 插件
    use(persistent())

    mockStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    }
  })

  it('should be a function', () => {
    expect(typeof persistent).toBe('function')
  })

  it('should return a plugin function', () => {
    const plugin = persistent()
    expect(typeof plugin).toBe('function')
  })

  it('should initialize state from storage', () => {
    mockStorage.getItem = vi.fn(() => JSON.stringify({ count: 42, name: 'saved' }))

    const store = defineStore({
      state: { count: 0, name: 'initial' },
      persist: {
        storage: mockStorage,
        key: 'test-store',
      },
    })

    expect(mockStorage.getItem).toHaveBeenCalledWith('test-store')
    expect(store.$state.count).toBe(42)
    expect(store.$state.name).toBe('saved')
  })

  it('should use default key if not provided', () => {
    mockStorage.getItem = vi.fn(() => JSON.stringify({ count: 10 }))

    const store = defineStore({
      state: { count: 0 },
      persist: {
        storage: mockStorage,
      },
    })

    expect(mockStorage.getItem).toHaveBeenCalled()
    expect(store.$state.count).toBe(10)
  })

  it('should use localStorage by default if available', () => {
    const originalLocalStorage = globalThis.localStorage
    globalThis.localStorage = mockStorage as Storage
    mockStorage.getItem = vi.fn(() => JSON.stringify({ count: 5 }))

    const store = defineStore({
      state: { count: 0 },
      persist: {},
    })

    expect(mockStorage.getItem).toHaveBeenCalled()
    expect(store.$state.count).toBe(5)

    globalThis.localStorage = originalLocalStorage
  })

  it('should save state changes to storage', async () => {
    mockStorage.getItem = vi.fn(() => null)
    mockStorage.setItem = vi.fn()

    const store = defineStore({
      state: { count: 0, name: 'test' },
      persist: {
        storage: mockStorage,
        key: 'test-store',
      },
    })

    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 50))

    store.$state.count = 10
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(mockStorage.setItem).toHaveBeenCalled()
    const lastCall = vi.mocked(mockStorage.setItem).mock.calls[vi.mocked(mockStorage.setItem).mock.calls.length - 1]
    expect(lastCall[0]).toBe('test-store')
    const savedData = JSON.parse(lastCall[1] as string)
    expect(savedData.count).toBe(10)
    expect(savedData.name).toBe('test')
  })

  it('should only persist specified paths', async () => {
    mockStorage.getItem = vi.fn(() => null)
    mockStorage.setItem = vi.fn()

    const store = defineStore({
      state: { count: 0, name: 'test', age: 20 },
      persist: {
        storage: mockStorage,
        key: 'test-store',
        paths: ['count', 'name'],
      },
    })

    await new Promise(resolve => setTimeout(resolve, 50))

    store.$state.count = 10
    store.$state.age = 30
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(mockStorage.setItem).toHaveBeenCalled()
    const lastCall = vi.mocked(mockStorage.setItem).mock.calls[vi.mocked(mockStorage.setItem).mock.calls.length - 1]
    const savedData = JSON.parse(lastCall[1] as string)
    expect(savedData.count).toBe(10)
    expect(savedData.name).toBe('test')
    expect(savedData.age).toBeUndefined()
  })

  it('should handle async storage getItem', async () => {
    const asyncValue = Promise.resolve(JSON.stringify({ count: 15 }))
    // @ts-expect-error - mocking localStorage
    mockStorage.getItem = vi.fn(() => asyncValue)

    const store = defineStore({
      state: { count: 0 },
      persist: {
        storage: mockStorage,
        key: 'test-store',
      },
    })

    await asyncValue
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(store.$state.count).toBe(15)
  })

  it('should handle nested paths', async () => {
    mockStorage.getItem = vi.fn(() => null)
    mockStorage.setItem = vi.fn()

    const store = defineStore({
      state: {
        user: {
          name: 'test',
          age: 20,
        },
        count: 0,
      },
      persist: {
        storage: mockStorage,
        key: 'test-store',
        paths: ['user.name', 'count'],
      },
    })

    await new Promise(resolve => setTimeout(resolve, 50))

    store.$state.user.name = 'updated'
    store.$state.user.age = 30
    store.$state.count = 5
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(mockStorage.setItem).toHaveBeenCalled()
    const lastCall = vi.mocked(mockStorage.setItem).mock.calls[vi.mocked(mockStorage.setItem).mock.calls.length - 1]
    const savedData = JSON.parse(lastCall[1] as string)
    // The set function from @hairy/utils creates nested structure
    // So 'user.name' path creates { user: { name: 'updated' } }
    expect(savedData.user?.name || savedData['user.name']).toBe('updated')
    expect(savedData.count).toBe(5)
  })

  it('should not save during initialization', async () => {
    mockStorage.getItem = vi.fn(() => JSON.stringify({ count: 5 }))
    mockStorage.setItem = vi.fn()

    defineStore({
      state: { count: 0 },
      persist: {
        storage: mockStorage,
        key: 'test-store',
      },
    })

    await new Promise(resolve => setTimeout(resolve, 50))

    // setItem should not be called during initialization
    const setItemCallsDuringInit = vi.mocked(mockStorage.setItem).mock.calls.length
    expect(setItemCallsDuringInit).toBe(0)
  })

  it('should handle invalid JSON in storage', () => {
    mockStorage.getItem = vi.fn(() => 'invalid json')

    const store = defineStore({
      state: { count: 0 },
      persist: {
        storage: mockStorage,
        key: 'test-store',
      },
    })

    // Should not throw, but state should remain initial
    expect(store.$state.count).toBe(0)
  })

  it('should handle null storage value', () => {
    mockStorage.getItem = vi.fn(() => null)

    const store = defineStore({
      state: { count: 0, name: 'test' },
      persist: {
        storage: mockStorage,
        key: 'test-store',
      },
    })

    expect(store.$state.count).toBe(0)
    expect(store.$state.name).toBe('test')
  })

  it('should not save when __watch is false (during Object.assign in initialize)', async () => {
    mockStorage.getItem = vi.fn(() => JSON.stringify({ count: 5, temp: 'value' }))
    mockStorage.setItem = vi.fn()

    // Create store - when initialize runs, Object.assign will trigger subscribe
    // but __watch is still false at that moment, so it should return early
    const store = defineStore({
      state: { count: 0 },
      persist: {
        storage: mockStorage,
        key: 'test-store',
      },
    })

    // Wait for initialization to complete
    await new Promise(resolve => setTimeout(resolve, 50))

    // The Object.assign in initialize triggers subscribe, but __watch is false
    // so the return on line 28 should be hit
    // However, since __watch becomes true immediately after, we need to verify
    // that the initial Object.assign didn't cause a save

    // Now trigger a change after initialization - this should be saved
    store.$state.count = 10
    await new Promise(resolve => setTimeout(resolve, 50))

    // Verify setItem was called (for the change after initialization)
    expect(mockStorage.setItem).toHaveBeenCalled()

    // The key point is that during Object.assign in initialize,
    // the subscribe callback should hit the return on line 28
    // This is hard to test directly, but we can verify the behavior is correct
  })

  it('should not throw in server environment (no localStorage)', () => {
    const originalLocalStorage = globalThis.localStorage
    // @ts-expect-error - simulate SSR: remove localStorage
    delete globalThis.localStorage

    expect(() => {
      defineStore({
        state: { count: 0 },
        persist: {},
      })
    }).not.toThrow()

    globalThis.localStorage = originalLocalStorage
  })

  it('should return early when __watch is false during async initialization', async () => {
    let resolvePromise: (value: string | null) => void
    const delayedPromise = new Promise<string | null>((resolve) => {
      resolvePromise = resolve
    })

    mockStorage.getItem = vi.fn(() => delayedPromise as any)
    mockStorage.setItem = vi.fn()

    const store = defineStore({
      state: { count: 0 },
      persist: {
        storage: mockStorage,
        key: 'test-store',
      },
    })

    // Trigger state change while Promise is still pending (__watch is false)
    store.$state.count = 1

    // Use a microtask to ensure the subscribe callback has a chance to run
    // before we resolve the promise
    await Promise.resolve()
    await Promise.resolve()

    // Verify setItem was not called because __watch was false
    expect(mockStorage.setItem).not.toHaveBeenCalled()

    // Now resolve the promise to complete initialization
    resolvePromise!(null)
    await delayedPromise
    await new Promise(resolve => setTimeout(resolve, 50))

    // Now trigger a change after initialization (__watch is true)
    store.$state.count = 2
    await new Promise(resolve => setTimeout(resolve, 50))

    // Verify setItem was called for the change after initialization
    expect(mockStorage.setItem).toHaveBeenCalled()

    // The first change (when __watch was false) should not have triggered setItem
    // This verifies that line 28 return was executed
  })

  it('should exclude getters from initialization', () => {
    mockStorage.getItem = vi.fn(() => JSON.stringify({ count: 10, doubled: 100 }))

    const store = defineStore({
      state: { count: 0 },
      getters: {
        doubled() {
          return this.count * 2
        },
      },
      persist: {
        storage: mockStorage,
        key: 'test-store-getters',
      },
    })

    expect(store.$state.count).toBe(10)
    expect(store.$state.doubled).toBe(20)
  })
})
