/* eslint-disable ts/ban-ts-comment */
import type { Actions, ActionsStatus, Getters, GettersReturnType, Store, StoreDefine, StoreOptions } from './types'
import { createElement } from 'react'
import { proxy, ref, subscribe, useSnapshot } from 'valtio'
import { subscribeKey } from 'valtio/utils'
import { proxyWithPersistent } from './persistent'
import { track } from './utils'

/**
 * @description Define a store
 * @example
 * ```tsx
 * const store = defineStore({
 *   state: () => ({ count: 0 }),
 *   actions: {
 *     increment() {
 *       this.count++
 *     },
 *   },
 * })
 *
 * store.increment()
 * console.log(store.$state.count) // 1
 *
 * function Component() {
 *   const store = useStore(store)
 *   return (
 *     <div>
 *       <button onClick={store.increment}>Increment</button>
 *       <div>{store.count}</div>
 *     </div>
 *   )
 * }
 *
 * ```
 */
export function defineStore<S extends object, A extends Actions<S>, G extends Getters<S>>(store: StoreDefine<S, A, G> & StoreOptions<S>): Store<S, A, G> {
  const state = typeof store.state === 'function' ? store.state() : store.state

  const getters: any = store.getters || {}
  const actions: any = store.actions || {}
  const status: any = {}

  status.finished = false
  status.loading = false
  status.error = undefined

  const $status = proxy(status)
  const $state = store.persist
    // @ts-expect-error
    ? proxyWithPersistent(state, store.persist === true ? {} : store.persist)
    : proxy(state)

  const $actions: any = {}
  const $getters: any = {}

  setupActions($state, actions, $actions, $status)
  setupGetters($state, getters, $getters)
  setupStatus($actions, $status)

  function $subscribe(listener: (state: S & GettersReturnType<G>) => void): () => void {
    return subscribe($state, () => listener($state as any))
  }

  $subscribe.status = function (listener: (status: ActionsStatus<A>) => void) {
    return subscribe($status, () => listener($status as any))
  }

  $subscribe.key = function (key: keyof S, listener: (state: S & GettersReturnType<G>) => void): () => void {
    return subscribeKey($state, key, () => listener($state as any))
  }

  function $patch(patch: Partial<S> | ((state: S) => void)): void {
    if (typeof patch === 'function')
      patch($state)
    else
      Object.assign($state, patch)
  }

  function $signal(fn: (state: any) => any): any {
    return createElement(() => fn(useSnapshot($state)))
  }

  $signal.status = function (fn: (status: any) => any) {
    return createElement(() => fn(useSnapshot($status)))
  }

  return {
    $subscribe,
    $patch,
    $state,
    $status,
    $actions,
    $getters,
    $signal,
    ...$actions,
  }
}

function setupActions($state: any, actions: any, $actions: any, $status: any): void {
  for (const key in actions) {
    $status[key] = { finished: false, loading: false, error: undefined }
    $actions[key] = track(actions[key].bind($state), $status[key])
    Object.defineProperty($state, key, {
      get: () => ref($actions[key]),
      enumerable: false,
    })
  }
}

function setupGetters($state: any, getters: any, $getters: any): void {
  for (const key in getters) {
    Object.defineProperty($getters, key, {
      get: () => $state[key],
      enumerable: true,
    })
    Object.defineProperty($state, key, {
      get: () => getters[key].call($state),
      enumerable: true,
    })
  }
}

function setupStatus($actions: any, $status: any): void {
  Object.defineProperty($status, 'loading', {
    get: () => Object.keys($actions).some(key => $status[key].loading),
    enumerable: true,
  })
  Object.defineProperty($status, 'finished', {
    get: () => Object.keys($actions).every(key => $status[key].finished),
    enumerable: true,
  })
  Object.defineProperty($status, 'error', {
    get: () => {
      const key = Object.keys($actions).find(key => $status[key].error)
      return $status[key || '']?.error
    },
    enumerable: true,
  })
}
