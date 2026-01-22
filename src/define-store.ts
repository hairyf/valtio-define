/* eslint-disable ts/ban-ts-comment */
import type {
  Actions,
  ActionsStatus,
  ActionsTree,
  Getters,
  GettersReturnType,
  Store,
  StoreDefine,
  StoreOptions,
} from './types'
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
export function defineStore<S extends object, A extends ActionsTree, G extends Getters<S>>(store: StoreDefine<S, A, G> & StoreOptions<S>): Store<S, A & Actions<S>, G> {
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

  const base = {
    $subscribe,
    $patch,
    $state,
    $status,
    $actions,
    $getters,
    $signal,
  }

  // 创建一个代理，使 store 可以直接访问 $actions、$state 中的 state 和 getters
  return new Proxy(base, {
    get(target, prop) {
      // 如果属性已经在 base 中，直接返回
      if (prop in target) {
        return target[prop as keyof typeof target]
      }
      // 先检查 $actions（actions 不可枚举，所以不会在 $state 的 ownKeys 中）
      if (prop in $actions) {
        return $actions[prop as keyof typeof $actions]
      }
      // 否则从 $state 中获取（包括 state 和 getters）
      return $state[prop as keyof typeof $state]
    },
    has(target, prop) {
      return prop in target || prop in $actions || prop in $state
    },
    ownKeys(target) {
      // 返回所有可枚举的键
      const stateKeys = Object.keys($state).filter((key) => {
        const descriptor = Object.getOwnPropertyDescriptor($state, key)
        return descriptor?.enumerable !== false
      })
      const actionKeys = Object.keys($actions)
      return [...new Set([...Object.keys(target), ...stateKeys, ...actionKeys])]
    },
    getOwnPropertyDescriptor(target, prop) {
      if (prop in target) {
        return Object.getOwnPropertyDescriptor(target, prop)
      }
      if (prop in $actions) {
        return {
          enumerable: true,
          configurable: true,
          value: $actions[prop as keyof typeof $actions],
        }
      }
      const descriptor = Object.getOwnPropertyDescriptor($state, prop)
      if (descriptor && descriptor.enumerable !== false) {
        return descriptor
      }
      return undefined
    },
  }) as Store<S, A & Actions<S>, G>
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
