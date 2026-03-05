import type { Awaitable } from '@hairy/utils'

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

export interface PersistentOptions<S extends object> {
  key?: string
  storage?: Storage
  paths?: DeepKeys<S>[]
}
