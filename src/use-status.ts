import type { Snapshot } from 'valtio'
import type { Actions, ActionsStatus, Getters, Store } from './types'
import { useSnapshot } from 'valtio'

export function useStatus<S extends object, A extends Actions<S>, G extends Getters<S>>(store: Store<S, A, G>): Snapshot<ActionsStatus<A>> {
  return useSnapshot(store.$status)
}
