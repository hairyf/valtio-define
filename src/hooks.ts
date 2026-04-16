import type { Snapshot } from 'valtio'
import type { Actions, Getters, GettersReturnType, Store } from './types'
import { useSnapshot } from 'valtio'

export function useStore<S extends object, A extends Actions<S>, G extends Getters<S>>(
  store: Store<S, A, G>,
  options?: { sync?: boolean },
): Snapshot<S & GettersReturnType<G> & A> {
  const snapshot = useSnapshot(store.$state, options)
  return snapshot as Snapshot<S & GettersReturnType<G> & A>
}

export function useGetters<S extends object, G extends Getters<S>>(
  store: Store<S, any, G>,
  options?: { sync?: boolean },
): GettersReturnType<G> {
  const snapshot = useSnapshot(store.$getters, options)
  return snapshot as GettersReturnType<G>
}
