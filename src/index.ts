import { use } from './plugin'

export * from './define'
export * from './hooks'
export * from './plugin'
export * from './types'
export * from './utils'
export { useSnapshot } from 'valtio'

export { computed, effect } from 'valtio-reactive'

const valtio = { use }

export default valtio
