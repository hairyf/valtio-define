import { beforeEach, describe, expect, it, vi } from 'vitest'
import { proxyWithPersistent } from '../src/persistent'

describe('proxyWithPersistent', () => {
  let mockStorage: Storage

  beforeEach(() => {
    mockStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    }
    vi.clearAllMocks()
  })

  it('should create persistent proxy', () => {
    const state = proxyWithPersistent({ count: 0 }, { storage: mockStorage })

    expect(state.count).toBe(0)
  })

  it('should load state from storage', () => {
    const storedData = { count: 42 }
    mockStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(storedData))

    const state = proxyWithPersistent({ count: 0 }, {
      key: 'test-key',
      storage: mockStorage,
    })

    expect(mockStorage.getItem).toHaveBeenCalledWith('test-key')
    expect(state.count).toBe(42)
  })

  it('should use initial state if storage is empty', () => {
    mockStorage.getItem = vi.fn().mockReturnValue(null)

    const state = proxyWithPersistent({ count: 0, name: 'test' }, {
      key: 'test-key',
      storage: mockStorage,
    })

    expect(state.count).toBe(0)
    expect(state.name).toBe('test')
  })

  it('should save state to storage on changes', async () => {
    const state = proxyWithPersistent({ count: 0 }, {
      key: 'test-key',
      storage: mockStorage,
    })

    state.count = 10

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(mockStorage.setItem).toHaveBeenCalled()
    const callArgs = (mockStorage.setItem as any).mock.calls[0]
    expect(callArgs[0]).toBe('test-key')
    const savedData = JSON.parse(callArgs[1])
    expect(savedData.count).toBe(10)
  })

  it.skip('should auto-generate key if not provided', () => {
    const state = proxyWithPersistent({ count: 0 }, { storage: mockStorage })

    state.count = 10

    expect(mockStorage.setItem).toHaveBeenCalled()
    const callArgs = (mockStorage.setItem as any).mock.calls[0]
    expect(callArgs[0]).toBeDefined()
    expect(typeof callArgs[0]).toBe('string')
  })

  it('should persist only specified paths', async () => {
    const state = proxyWithPersistent(
      { count: 0, name: 'test', age: 20 },
      {
        key: 'test-key',
        storage: mockStorage,
        paths: ['count', 'age'],
      },
    )

    state.count = 10
    state.name = 'updated'
    state.age = 25

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(mockStorage.setItem).toHaveBeenCalled()
    const callArgs = (mockStorage.setItem as any).mock.calls[0]
    const savedData = JSON.parse(callArgs[1])
    expect(savedData.count).toBe(10)
    expect(savedData.age).toBe(25)
    expect(savedData.name).toBeUndefined()
  })

  it('should persist all paths by default', async () => {
    const state = proxyWithPersistent(
      { count: 0, name: 'test' },
      {
        key: 'test-key',
        storage: mockStorage,
      },
    )

    state.count = 10
    state.name = 'updated'

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(mockStorage.setItem).toHaveBeenCalled()
    const callArgs = (mockStorage.setItem as any).mock.calls[0]
    const savedData = JSON.parse(callArgs[1])
    expect(savedData.count).toBe(10)
    expect(savedData.name).toBe('updated')
  })

  it('should handle nested objects', async () => {
    const state = proxyWithPersistent(
      { user: { name: 'test', age: 20 } },
      {
        key: 'test-key',
        storage: mockStorage,
      },
    )

    state.user.name = 'updated'
    state.user.age = 25

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(mockStorage.setItem).toHaveBeenCalled()
    const callArgs = (mockStorage.setItem as any).mock.calls[0]
    const savedData = JSON.parse(callArgs[1])
    expect(savedData.user.name).toBe('updated')
    expect(savedData.user.age).toBe(25)
  })

  it('should use localStorage by default when available', () => {
    const originalLocalStorage = globalThis.localStorage
    const mockLocalStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    }

    Object.defineProperty(globalThis, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

    const state = proxyWithPersistent({ count: 0 })

    expect(state.count).toBe(0)

    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    })
  })

  it('should handle invalid JSON in storage gracefully', () => {
    mockStorage.getItem = vi.fn().mockReturnValue('invalid json{')

    const state = proxyWithPersistent({ count: 0 }, {
      key: 'test-key',
      storage: mockStorage,
    })

    // Should fall back to initial state
    expect(state.count).toBe(0)
  })

  it('should persist multiple changes', async () => {
    const state = proxyWithPersistent({ count: 0 }, {
      key: 'test-key',
      storage: mockStorage,
    })

    state.count = 1
    await new Promise(resolve => setTimeout(resolve, 10))

    state.count = 2
    await new Promise(resolve => setTimeout(resolve, 10))

    state.count = 3
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(mockStorage.setItem).toHaveBeenCalledTimes(3)
    const lastCall = (mockStorage.setItem as any).mock.calls[2]
    const savedData = JSON.parse(lastCall[1])
    expect(savedData.count).toBe(3)
  })

  it('should work with arrays', async () => {
    const state = proxyWithPersistent({ items: [1, 2, 3] }, {
      key: 'test-key',
      storage: mockStorage,
    })

    state.items.push(4)

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(mockStorage.setItem).toHaveBeenCalled()
    const callArgs = (mockStorage.setItem as any).mock.calls[0]
    const savedData = JSON.parse(callArgs[1])
    expect(savedData.items).toEqual([1, 2, 3, 4])
  })
})
