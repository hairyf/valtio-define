import type { Snapshot } from 'valtio'
import type { Actions, Getters, GettersReturnType, Store } from './types'
import { useSnapshot } from 'valtio'

export function useStore<S extends object, A extends Actions<S>, G extends Getters<S>>(store: Store<S, A, G>): Snapshot<S & GettersReturnType<G> & A> {
  return useSnapshot(store.$state) as Snapshot<S & GettersReturnType<G> & A>
}
