import { beforeEach, describe, expect, it, vi } from 'vitest'

import { defineStore } from '../src/define'
import { plugins } from '../src/plugin'

const mocked = vi.hoisted(() => {
  const unsub = vi.fn()
  const subscribeMock = vi.fn(() => unsub)
  return { unsub, subscribeMock }
})

vi.mock('valtio/vanilla', async () => {
  const actual = await vi.importActual<any>('valtio/vanilla')
  return {
    ...actual,
    subscribe: mocked.subscribeMock,
  }
})

describe('$dispose', () => {
  beforeEach(() => {
    plugins.length = 0
    mocked.unsub.mockClear()
    mocked.subscribeMock.mockClear()
  })

  it('should call unsubscribe when disposed', () => {
    const store = defineStore({
      state: { count: 0 },
    })

    expect(mocked.subscribeMock).toHaveBeenCalled()

    store.$dispose()
    expect(mocked.unsub).toHaveBeenCalledTimes(1)
  })
})
