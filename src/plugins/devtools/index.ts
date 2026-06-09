import type { Plugin } from '../../types'
import { devtools as valtioDevtools } from 'valtio/utils'

export interface DevtoolsOptions {
  enabled?: boolean
  name?: string
  [key: string]: any
}

export function devtools(options?: DevtoolsOptions): Plugin {
  return context => valtioDevtools(context.store.$state, options)
}
