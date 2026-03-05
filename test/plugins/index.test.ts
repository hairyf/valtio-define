import { describe, expect, it } from 'vitest'
import * as plugins from '../../src/plugins'

describe('plugins/index', () => {
  it('should export persistent', () => {
    expect(plugins.persist).toBeDefined()
    expect(typeof plugins.persist).toBe('function')
  })

  it('should export all plugin functions', () => {
    expect('persist' in plugins).toBe(true)
  })
})
