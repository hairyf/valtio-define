import type { Status } from '../src/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { get, set, track } from '../src/utils'

describe('utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('track', () => {
    it('should track sync action execution', () => {
      const status: Status = {
        loading: false,
        finished: false,
      }

      const action = vi.fn(() => 42)
      const trackedAction = track(action, status)

      expect(status.loading).toBe(false)
      expect(status.finished).toBe(false)

      const result = trackedAction()

      expect(action).toHaveBeenCalledTimes(1)
      expect(result).toBe(42)
      expect(status.loading).toBe(false)
      expect(status.finished).toBe(true)
      expect(status.error).toBe(undefined)
    })

    it('should track async action execution', async () => {
      const status: Status = {
        loading: false,
        finished: false,
        error: undefined,
      }

      const action = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 42
      })

      const trackedAction = track(action, status)

      expect(status.loading).toBe(false)

      const promise = trackedAction()
      expect(status.loading).toBe(true)
      expect(status.finished).toBe(false)

      const result = await promise

      expect(result).toBe(42)
      expect(status.loading).toBe(false)
      expect(status.finished).toBe(true)
      expect(status.error).toBe(undefined)
    })

    it('should track action errors', () => {
      const status: Status = {
        loading: false,
        finished: false,
      }

      const error = new Error('Test error')
      const action = vi.fn(() => {
        throw error
      })

      const trackedAction = track(action, status)

      expect(() => trackedAction()).toThrow(error)
      expect(status.loading).toBe(false)
      expect(status.finished).toBe(false)
      expect(status.error).toBe(error)
    })

    it('should track async action errors', async () => {
      const status: Status = {
        loading: false,
        finished: false,
      }

      const error = new Error('Test error')
      const action = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        throw error
      })

      const trackedAction = track(action, status)

      expect(status.loading).toBe(false)

      const promise = trackedAction()
      expect(status.loading).toBe(true)

      try {
        await promise
      }
      catch (e) {
        expect(e).toBe(error)
      }

      expect(status.loading).toBe(false)
      expect(status.finished).toBe(false)
      expect(status.error).toBe(error)
    })

    it('should track concurrent action executions', async () => {
      const status: Status = {
        loading: false,
        finished: false,
      }

      const action = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 20))
        return 42
      })

      const trackedAction = track(action, status)

      const promise1 = trackedAction()
      expect(status.loading).toBe(true)

      const promise2 = trackedAction()
      expect(status.loading).toBe(true)

      await promise1
      expect(status.loading).toBe(true)

      await promise2
      expect(status.loading).toBe(false)
      expect(status.finished).toBe(true)
    })

    it('should handle actions with arguments', () => {
      const status: Status = {
        loading: false,
        finished: false,
      }

      const action = vi.fn((a: number, b: number) => a + b)
      const trackedAction = track(action, status)

      const result = trackedAction(5, 3)

      expect(action).toHaveBeenCalledWith(5, 3)
      expect(result).toBe(8)
      expect(status.finished).toBe(true)
    })
  })

  describe('get', () => {
    it('should get nested property', () => {
      const obj = {
        user: {
          name: 'test',
          age: 20,
        },
      }

      expect(get(obj, 'user.name')).toBe('test')
      expect(get(obj, 'user.age')).toBe(20)
    })

    it('should get top-level property', () => {
      const obj = {
        count: 10,
        name: 'test',
      }

      expect(get(obj, 'count')).toBe(10)
      expect(get(obj, 'name')).toBe('test')
    })

    it('should return undefined for non-existent path', () => {
      const obj = {
        user: {
          name: 'test',
        },
      }

      expect(get(obj, 'user.age')).toBeUndefined()
      expect(get(obj, 'nonexistent')).toBeUndefined()
      expect(get(obj, 'user.profile.name')).toBeUndefined()
    })

    it('should handle empty path', () => {
      const obj = { count: 10 }

      expect(get(obj, '')).toBeUndefined()
    })

    it('should handle deeply nested properties', () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              value: 42,
            },
          },
        },
      }

      expect(get(obj, 'level1.level2.level3.value')).toBe(42)
    })
  })

  describe('set', () => {
    it('should set nested property', () => {
      const obj: any = {}

      set(obj, 'user.name', 'test')
      set(obj, 'user.age', 20)

      expect(obj.user.name).toBe('test')
      expect(obj.user.age).toBe(20)
    })

    it('should set top-level property', () => {
      const obj: any = {}

      set(obj, 'count', 10)
      set(obj, 'name', 'test')

      expect(obj.count).toBe(10)
      expect(obj.name).toBe('test')
    })

    it('should create nested objects if they do not exist', () => {
      const obj: any = {}

      set(obj, 'level1.level2.value', 42)

      expect(obj.level1.level2.value).toBe(42)
      expect(typeof obj.level1).toBe('object')
      expect(typeof obj.level1.level2).toBe('object')
    })

    it('should overwrite existing values', () => {
      const obj: any = {
        user: {
          name: 'old',
        },
      }

      set(obj, 'user.name', 'new')

      expect(obj.user.name).toBe('new')
    })

    it('should handle deeply nested paths', () => {
      const obj: any = {}

      set(obj, 'level1.level2.level3.level4.value', 42)

      expect(obj.level1.level2.level3.level4.value).toBe(42)
    })

    it('should handle array indices', () => {
      const obj: any = {
        items: [1, 2, 3],
      }

      set(obj, 'items.0', 10)
      set(obj, 'items.1', 20)

      expect(obj.items[0]).toBe(10)
      expect(obj.items[1]).toBe(20)
      expect(obj.items[2]).toBe(3)
    })
  })
})
