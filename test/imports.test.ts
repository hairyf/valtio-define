import { describe, expect, it } from 'vitest'
import {
  defineStore,
  plugins,
  use,
  useStore,
} from '../src'

describe('exports', () => {
  it('should export defineStore', () => {
    expect(defineStore).toBeDefined()
    expect(typeof defineStore).toBe('function')
  })

  it('should export useStore', () => {
    expect(useStore).toBeDefined()
    expect(typeof useStore).toBe('function')
  })

  it('should export use', () => {
    expect(use).toBeDefined()
    expect(typeof use).toBe('function')
  })

  it('should export plugins', () => {
    expect(plugins).toBeDefined()
    expect(typeof plugins).toBe('object')
  })
})
