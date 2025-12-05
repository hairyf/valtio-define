import { describe, expect, it } from 'vitest'
import {
  defineStore,
  proxyWithPersistent,
  useStatus,
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

  it('should export useStatus', () => {
    expect(useStatus).toBeDefined()
    expect(typeof useStatus).toBe('function')
  })

  it('should export proxyWithPersistent', () => {
    expect(proxyWithPersistent).toBeDefined()
    expect(typeof proxyWithPersistent).toBe('function')
  })
})
