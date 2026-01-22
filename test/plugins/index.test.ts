import { describe, expect, it } from 'vitest'
import * as plugins from '../../src/plugins'

describe('plugins/index', () => {
  it('should export persistent', () => {
    expect(plugins.persistent).toBeDefined()
    expect(typeof plugins.persistent).toBe('function')
  })

  it('should export all plugin functions', () => {
    expect('persistent' in plugins).toBe(true)
  })
})
