import type { Plugin } from '../../types'
import type { PersistentOptions } from './types'
import { get, set } from '@hairy/utils'
import { destr } from 'destr'
import { generateStructureId } from 'structure-id'
import { subscribe } from 'valtio'

export interface PersistentMountOptions {
  automount?: boolean
}

export function persist({ automount = true }: PersistentMountOptions = {}): Plugin {
  return (context) => {
    const { persist, getters } = context.options
    const { $state } = context.store

    if (!persist)
      return

    const options = persist === true ? {} : persist
    const key = options.key || generateStructureId($state)
    const storage = options.storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined)

    if (!storage?.getItem || !storage?.setItem)
      return

    let hydrated = false

    function initialize(value: any) {
      const data = destr<Record<string, any>>(value)
      if (data && typeof data === 'object') {
        Object.keys(getters || {}).forEach(k => Reflect.deleteProperty(data, k))
        Object.assign($state, data)
      }
      hydrated = true
    }

    function mount() {
      const value = storage!.getItem(key)
      value instanceof Promise ? value.then(initialize) : initialize(value)
    }

    function watch() {
      subscribe($state, () => {
        if (!hydrated)
          return
        const paths = options.paths || Object.keys($state)
        // 使用 reduce 替代 for 循环，更加函数式和紧凑
        const statePaths = paths.reduce((acc, p) => set(acc, p, get($state, p)), {})
        storage!.setItem(key, JSON.stringify(statePaths))
      })
    }

    context.store.persist = { mount }
    automount && mount()
    watch()
  }
}

declare module 'valtio-define' {
  export interface StoreDefineOptions<S extends object> {
    persist?: PersistentOptions<S> | boolean
  }
  export interface StoreOptions {
    persist: { mount: () => void }
  }
}
