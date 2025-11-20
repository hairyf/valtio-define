import type { PersistantOptions } from './types'
import { jsonTryParse } from '@hairy/utils'
import { proxy, subscribe } from 'valtio'

export function proxyWithPersistant<T extends object>(key: string, initialObject?: T): T
export function proxyWithPersistant<T extends object>(options: PersistantOptions, initialObject?: T): T
export function proxyWithPersistant<T extends object>(keyOrOptions: string | PersistantOptions, initialObject?: T): T {
  let options: PersistantOptions
  if (typeof keyOrOptions === 'string') {
    options = { key: keyOrOptions }
  }
  else {
    options = { ...keyOrOptions }
  }
  const storage = options.storage || (
    typeof localStorage !== 'undefined' ? localStorage : undefined
  )
  typeof keyOrOptions === 'string' && (keyOrOptions = { key: keyOrOptions })

  const state = proxy(jsonTryParse(storage?.getItem(options.key)) || initialObject)

  subscribe(state, () => {
    const paths = options.paths || Object.keys(state)
    const statePaths: any = {}
    for (const key of paths)
      statePaths[key] = state[key]
    storage?.setItem(options.key, JSON.stringify(statePaths))
  })

  return state
}
