import type { Dispatch, SetStateAction } from 'react'
import type { Store } from './types'
import { useStore } from './use'

export function storeToState<
  S extends object,
  K extends keyof S,
>(store: Store<S>, key: K): [S[K], Dispatch<SetStateAction<S[K]>>] {
  const state = useStore(store)
  function set(value: S[K] | ((prev: S[K]) => S[K])) {
    if (typeof value === 'function') {
      store.$patch((state) => {
        state[key] = (value as (prev: S[K]) => S[K])(state[key])
      })
    }
    else {
      store.$patch((state) => {
        state[key] = value
      })
    }
  }
  return [state[key as keyof typeof state] as unknown as S[K], set]
}

export function storeToStates<S extends object>(store: Store<S>): {
  [K in keyof S]: [S[K], Dispatch<SetStateAction<S[K]>>]
} {
  return Object.fromEntries(Object.keys(store.$state).map(key => [key, storeToState(store, key as keyof S)])) as any
}
