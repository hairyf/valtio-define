/* eslint-disable unused-imports/no-unused-vars */
import type { Getters, Plugin } from '../../types'
import type { SignalStore } from './types'
import { $ } from 'valtio-signal'

export function signal(): Plugin {
  return (context) => {
    function $signal(fn?: (state: any) => any): any {
      const attached = $(context.store.$state)
      return fn ? fn(attached) : attached
    }
    context.store.$signal = $signal
  }
}

declare module 'valtio-define' {
  export interface StoreOptions<S, A, G extends Getters<S>> extends SignalStore<S, G> {
  }
}
