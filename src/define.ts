/* eslint-disable ts/no-empty-object-type */
import type {
  Actions,
  Getters,
  Op,
  Plugin,
  Store,
  StoreDefine,
} from './types'
import { batch } from 'valtio-reactive'
import { $ } from 'valtio-signal'
import { subscribeKey } from 'valtio/utils'
import { proxy, ref, subscribe } from 'valtio/vanilla'
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
export function defineStore<
  S extends object = {},
  A extends Actions<S> = {},
  G extends Getters<S> = {},
>(options: StoreDefine<S, A, G>): Store<S, A, G> {
  const state = typeof options.state === 'function' ? options.state() : options.state

  const getters: any = options.getters || {}
  const actions: any = options.actions || {}
  const $state = proxy<any>(state)

  const $actions: any = {}
  const $getters: any = proxy({})
  const $plugins = new WeakSet<Plugin>()

  let unsub: undefined | (() => void)

  for (const key of Object.keys(getters)) {
    defineProperty($state, key, getters[key].bind($state), { enumerable: false })
    defineProperty($getters, key, () => $state[key])
  }

  for (const key of Object.keys(actions)) {
    $actions[key] = ref(actions[key].bind($state))
    defineProperty($state, key, () => $actions[key], { enumerable: false })
  }

  function $subscribe(listener: (state: S, ops: Op[]) => void): () => void {
    return subscribe($state, ops => listener($state, ops))
  }

  function $subscribeKey(key: keyof S, listener: (state: any) => void): () => void {
    return subscribeKey($state, key, value => listener(value), true)
  }

  function $patch(patch: Partial<S> | ((state: S) => void)): void {
    typeof patch === 'function'
      ? batch(() => patch($state))
      : Object.assign($state, patch)
  }

  function $signal(fn: (state: any) => any): any {
    return fn($($state))
  }

  function $dispose(): void {
    unsub?.()
  }

  function use(plugin: Plugin): void {
    apply(plugin)
  }

  const base = {
    $subscribe,
    $subscribeKey,
    $patch,
    $state,
    $actions,
    $getters,
    $dispose,
    $signal,
    use,
  }

  const store = new Proxy<any>(base, {
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
        ? $state[prop] = value
        : target[prop] = value
      return true
    },
  })

  function apply(plugin: Plugin) {
    if ($plugins.has(plugin))
      return
    $plugins.add(plugin)
    plugin({ store, options })
  }

  for (const plugin of plugins)
    apply(plugin)

  unsub = subscribe(plugins, () => {
    for (const plugin of plugins)
      apply(plugin)
  })

  return store
}

function defineProperty(
  target: any,
  prop: string | symbol,
  getter: () => any,
  descriptor?: PropertyDescriptor,
) {
  Object.defineProperty(target, prop, { get: getter, enumerable: true, ...descriptor })
}
