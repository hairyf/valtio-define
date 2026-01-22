import type {
  Actions,
  ActionsTree,
  Getters,
  Plugin,
  Store,
  StoreDefine,
} from './types'
import { createElement } from 'react'
import { proxy, ref, subscribe, useSnapshot } from 'valtio'
import { subscribeKey } from 'valtio/utils'
import { plugins } from './plugin'

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
export function defineStore<S extends object, A extends ActionsTree, G extends Getters<S>>(define: StoreDefine<S, A, G>): Store<S, A & Actions<S>, G> {
  const state = typeof define.state === 'function' ? define.state() : define.state

  const getters: any = define.getters || {}
  const actions: any = define.actions || {}
  const $state = proxy<any>(state)

  const $actions: any = {}
  const $getters: any = {}
  const $plugins = new WeakSet<Plugin>()

  for (const key in actions) {
    $actions[key] = ref(actions[key].bind($state))
    $state[key] = $actions[key]
  }

  for (const key in getters) {
    Object.defineProperty($state, key, {
      get: () => getters[key].call($state),
      enumerable: true,
    })
    Object.defineProperty($getters, key, {
      get: () => $state[key],
      enumerable: true,
    })
  }

  function $subscribe(listener: (state: any, opts: any) => void): () => void {
    return subscribe($state, opts => listener($state, opts))
  }

  function $subscribeKey(key: keyof S, listener: (state: any) => void): () => void {
    return subscribeKey($state, key, value => listener(value), true)
  }

  function $patch(patch: Partial<S> | ((state: S) => void)): void {
    typeof patch === 'function' ? patch($state) : Object.assign($state, patch)
  }

  function $signal(fn: (state: any) => any): any {
    return createElement(() => fn(useSnapshot($state)))
  }

  function use(plugin: Plugin): void {
    plugins.push(plugin)
    apply(plugin)
  }

  const base = {
    $subscribe,
    $subscribeKey,
    $patch,
    $state,
    $actions,
    $getters,
    $signal,
    use,
  }

  const store = new Proxy<any>(base as any, {
    get(target, prop) {
      if (prop in $actions)
        return $actions[prop as keyof typeof $actions]
      if (prop in target)
        return target[prop as keyof typeof target]
      return $state[prop as keyof typeof $state]
    },
    has(target, prop) {
      return prop in target || prop in $actions || prop in $state
    },
    set(target, prop, value) {
      prop in $state
        ? $state[prop as keyof typeof $state] = value
        : target[prop as keyof typeof base] = value
      return true
    },
  })

  function apply(plugin: Plugin) {
    if ($plugins.has(plugin))
      return
    $plugins.add(plugin)
    plugin({ store, options: define })
  }

  for (const plugin of plugins)
    apply(plugin)

  subscribe(plugins, () => {
    for (const plugin of plugins)
      apply(plugin)
  })
  return store
}
