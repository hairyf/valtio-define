import type { PersistantOptions } from './types'
import { jsonTryParse } from '@hairy/utils'
import { generateStructureId } from 'structure-id'
import { proxy, subscribe } from 'valtio'

export function proxyWithPersistant<T extends object>(initialObject: T, options: PersistantOptions = {}): T {
  options.key = options.key ??= generateStructureId(initialObject)

  const storage = options.storage || (
    typeof localStorage !== 'undefined' ? localStorage : undefined
  )

  const state = proxy(jsonTryParse(storage?.getItem(options.key)) || initialObject)

  subscribe(state, () => {
    const paths = options.paths || Object.keys(state)
    const statePaths: any = {}
    for (const key of paths)
      statePaths[key] = state[key]
    storage?.setItem(
      options.key!,
      JSON.stringify(statePaths),
    )
  })

  return state
}
