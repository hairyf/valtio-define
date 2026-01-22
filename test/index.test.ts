import { describe, expect, it } from 'vitest'
import defaultExport, { defineStore, use, useStore } from '../src'

describe('index', () => {
  it('should export defineStore', () => {
    expect(typeof defineStore).toBe('function')
  })

  it('should export useStore', () => {
    expect(typeof useStore).toBe('function')
  })

  it('should export use', () => {
    expect(typeof use).toBe('function')
  })

  it('should have default export', () => {
    expect(defaultExport).toBeDefined()
    expect(typeof defaultExport).toBe('object')
  })

  it('should have use in default export', () => {
    expect(defaultExport.use).toBeDefined()
    expect(typeof defaultExport.use).toBe('function')
    expect(defaultExport.use).toBe(use)
  })
})
