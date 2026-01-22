import type { Plugin } from '../../types'
import { get, set } from '@hairy/utils'
import { destr } from 'destr'
import { generateStructureId } from 'structure-id'
import { subscribe } from 'valtio'

export function persistent(): Plugin {
  return (context) => {
    const options = context.options.persist || {}
    options.key = options.key || generateStructureId(context.store.$state)
    const storage = options.storage || (typeof localStorage !== 'undefined' ? localStorage : undefined)
    const value: any = storage?.getItem(options.key)
    // 记录状态，避免死循环
    let __watch = false

    if (value instanceof Promise)
      value.then(initialize)
    else
      initialize(value)

    function initialize(value: any) {
      Object.assign(context.store.$state, destr(value))
      __watch = true
    }

    subscribe(context.store.$state, () => {
      if (!__watch)
        return
      const paths = options.paths || Object.keys(context.store.$state)
      const statePaths: Record<string, unknown> = {}
      for (const key of paths)
        set(statePaths, key, get(context.store.$state, key))

      const value = JSON.stringify(statePaths)
      storage?.setItem(options.key!, value)
    })
  }
}

export type DeepKeys<T> = T extends object ? (keyof T & string) | `${DeepKeys<T[keyof T & string]>}.${string}` : never
export interface PersistentOptions<S extends object = Record<string, unknown>> {
  key?: string
  storage?: Partial<Storage> & Pick<Storage, 'getItem' | 'setItem'>
  paths?: DeepKeys<S>[]
}

declare module 'valtio-define/types' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  export interface StoreDefine<S extends object, A extends ActionsTree, G extends Getters<any>> {
    persist?: PersistentOptions<S>
  }
}
