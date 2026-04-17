/** @jsxImportSource valtio-define/plugins/signal */

import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineStore } from '../../src/define'
import { plugins, use } from '../../src/plugin'
import { signal } from '../../src/plugins/signal'

describe('signal plugin', () => {
  beforeEach(() => {
    plugins.length = 0
    use(signal())
  })

  it('should render selector result in server-side rendering', () => {
    const store = defineStore({
      state: { count: 0 },
    })

    function TestComponent() {
      return <div>{store.$signal((state: any) => state.count)}</div>
    }

    const html = renderToString(<TestComponent />)
    expect(html).toContain('0')
  })

  it('should render signal state properties in server-side rendering', () => {
    const store = defineStore({
      state: { count: 5 },
      getters: {
        doubled() {
          return this.count * 2
        },
      },
    })

    function TestComponent() {
      return <div>{store.$signal().doubled}</div>
    }

    const html = renderToString(<TestComponent />)
    expect(html).toContain('10')
  })
})
