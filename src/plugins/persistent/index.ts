import type { Awaitable } from '@hairy/utils'
import type { Plugin } from '../../types'
import { get, set } from '@hairy/utils'
import { destr } from 'destr'
import { generateStructureId } from 'structure-id'
import { subscribe } from 'valtio'

export function persistent(): Plugin {
  return (context) => {
    if (!context.options.persist)
      return
    const options = typeof context.options.persist === 'boolean' ? { } : context.options.persist
    options.key = options.key || generateStructureId(context.store.$state)
    const raw = options.storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined)
    const storage = (raw && typeof raw.getItem === 'function' && typeof raw.setItem === 'function')
      ? raw
      : undefined
    const value = storage ? storage.getItem(options.key) : undefined
    // 记录状态，避免死循环
    let __watch = false

    if (value instanceof Promise)
      value.then(initialize)
    else
      initialize(value)

    function initialize(value: any) {
      const data = destr(value)
      if (data && typeof data === 'object') {
        const getters = context.options.getters
        if (getters) {
          for (const key of Object.keys(getters))
            Reflect.deleteProperty(data, key)
        }
        Object.assign(context.store.$state, data)
      }
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

export type DeepKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? K | `${K}.${DeepKeys<T[K]>}`
        : K
    }[keyof T & string]
  : never

export interface Storage {
  getItem: (key: string) => Awaitable<any>
  setItem: (key: string, value: any) => Awaitable<void>
  [key: string]: any
}

export interface PersistentOptions<S extends object = Record<string, unknown>> {
  key?: string
  storage?: Storage
  paths?: DeepKeys<S>[]
}

declare module 'valtio-define/types' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  export interface StoreDefine<S extends object, A extends ActionsTree, G extends Getters<any>> {
    persist?: PersistentOptions<S> | boolean
  }
}

export default persistent
