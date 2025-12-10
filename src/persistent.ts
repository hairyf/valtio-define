import type { PersistentOptions } from './types'
import { tryParseJson } from '@hairy/utils'
import { generateStructureId } from 'structure-id'
import { proxy, subscribe } from 'valtio'
import { get, set } from './utils'

export function proxyWithPersistent<T extends object>(initialObject: T, options: PersistentOptions = {}): T {
  options.key = options.key || generateStructureId(initialObject)

  const storage = options.storage || (
    typeof localStorage !== 'undefined' ? localStorage : undefined
  )

  const state = proxy(tryParseJson(storage?.getItem(options.key)) || initialObject)

  subscribe(state, () => {
    const paths = options.paths || Object.keys(state)
    const statePaths: Record<string, unknown> = {}
    for (const key of paths)
      set(statePaths, key, get(state, key))

    storage?.setItem(
      options.key!,
      JSON.stringify(statePaths),
    )
  })

  return state
}
