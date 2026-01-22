import type { Plugin } from '../src/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineStore } from '../src/define'
import { plugins, use } from '../src/plugin'

describe('plugin', () => {
  beforeEach(() => {
    // 清空插件数组
    plugins.length = 0
  })

  describe('use', () => {
    it('should be a function', () => {
      expect(typeof use).toBe('function')
    })

    it('should add plugin to plugins array', () => {
      const plugin: Plugin = vi.fn()

      use(plugin)

      expect(plugins).toHaveLength(1)
      expect(plugins[0]).toBe(plugin)
    })

    it('should add multiple plugins', () => {
      const plugin1: Plugin = vi.fn()
      const plugin2: Plugin = vi.fn()
      const plugin3: Plugin = vi.fn()

      use(plugin1)
      use(plugin2)
      use(plugin3)

      expect(plugins).toHaveLength(3)
      expect(plugins[0]).toBe(plugin1)
      expect(plugins[1]).toBe(plugin2)
      expect(plugins[2]).toBe(plugin3)
    })
  })

  describe('plugin execution', () => {
    it('should execute plugins when store is created', () => {
      const plugin: Plugin = vi.fn()

      use(plugin)

      const store = defineStore({
        state: { count: 0 },
      })

      expect(plugin).toHaveBeenCalledTimes(1)
      expect(plugin).toHaveBeenCalledWith({
        store,
        options: expect.objectContaining({
          state: { count: 0 },
        }),
      })
    })

    it('should execute multiple plugins in order', () => {
      const callOrder: number[] = []
      const plugin1: Plugin = vi.fn(() => {
        callOrder.push(1)
      })
      const plugin2: Plugin = vi.fn(() => {
        callOrder.push(2)
      })
      const plugin3: Plugin = vi.fn(() => {
        callOrder.push(3)
      })

      use(plugin1)
      use(plugin2)
      use(plugin3)

      defineStore({
        state: { count: 0 },
      })

      expect(callOrder).toEqual([1, 2, 3])
    })

    it('should allow plugins to access store methods', () => {
      const plugin: Plugin = vi.fn((context) => {
        expect(context.store.$state).toBeDefined()
        expect(context.store.$patch).toBeDefined()
        expect(context.store.$subscribe).toBeDefined()
      })

      use(plugin)

      defineStore({
        state: { count: 0 },
      })

      expect(plugin).toHaveBeenCalled()
    })
  })
})
