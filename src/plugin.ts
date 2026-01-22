import type { Plugin } from './types'
import { proxy } from 'valtio'

export const plugins = proxy<Plugin[]>([])

export function use(plugin: Plugin) {
  plugins.push(plugin)
}
