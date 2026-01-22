import type { Plugin } from './types'

export const plugins: Plugin[] = []

export function use(plugin: Plugin) {
  plugins.push(plugin)
}
