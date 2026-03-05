import { describe, expect, it } from 'vitest'
import * as plugins from '../../src/plugins'

describe('plugins/index', () => {
  it('should export persistent', () => {
    expect(plugins.presist).toBeDefined()
    expect(typeof plugins.presist).toBe('function')
  })

  it('should export all plugin functions', () => {
    expect('presist' in plugins).toBe(true)
  })
})
