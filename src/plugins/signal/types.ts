import type { Getters, GettersReturnType } from '../../types'

export interface Signal<S> {
  (): S
  <T>(fn: (state: S) => T): T
}

export interface SignalStore<S, G extends Getters<S>> {
  $signal: Signal<S & GettersReturnType<G>>
}
