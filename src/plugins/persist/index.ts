/* eslint-disable unused-imports/no-unused-vars */
import type { Plugin } from '../../types'
import type { PersistentMeta, PersistentOptions, PersistentStore } from './types'
import { get, set } from '@hairy/utils'
import { destr } from 'destr'
import { generateStructureId } from 'structure-id'
import { proxy, subscribe } from 'valtio'

export interface PersistentMountOptions {
  /**
   * Whether to automatically mount the persist plugin when the store is created
   */
  hydrate?: boolean
}

export function persist({ hydrate = true }: PersistentMountOptions = {}): Plugin {
  return (context) => {
    const { persist, getters } = context.options
    const { $state } = context.store

    context.store.$persist?.dehydrate?.()

    if (!persist)
      return

    const getterKeys = new Set(Object.keys(getters || {}))
    const options = persist === true ? {} : persist
    const key = options.key || generateStructureId($state)
    const storage = options.storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined)

    if (!storage?.getItem || !storage?.setItem)
      return

    const meta: PersistentMeta = context.store.$persist?.meta ?? proxy({ mounted: false, hydrated: false })

    function initialize(value: any) {
      const data = destr<Record<string, any>>(value)
      if (data && typeof data === 'object') {
        for (const key of Object.keys(data))
          getterKeys.has(key) && delete data[key]
        Object.assign($state, data)
      }
      meta.hydrated = true
    }

    function rehydrate() {
      meta.mounted = true
      const value = storage!.getItem(key)
      return value instanceof Promise
        ? value.then(initialize)
        : initialize(value)
    }

    function dehydrate() {
      meta.unsubscribe?.()
      meta.unsubscribe = undefined
    }

    function watch() {
      dehydrate()
      meta.unsubscribe = subscribe($state, () => {
        if (!meta.hydrated)
          return
        const paths = (options.paths || Object.keys($state)).filter(p => !getterKeys.has(p))
        const statePaths = paths.reduce((acc, p) => set(acc, p, get($state, p)), {})
        storage!.setItem(key, JSON.stringify(statePaths))
      })
    }

    context.store.$persist = { rehydrate, dehydrate, meta }
    hydrate && !meta.mounted && rehydrate()
    watch()
  }
}

declare module 'valtio-define' {
  export interface StoreDefineOptions<S extends object> {
    persist?: PersistentOptions<S> | boolean
  }
  export interface StoreOptions<S, A, G> extends PersistentStore {

  }
}
