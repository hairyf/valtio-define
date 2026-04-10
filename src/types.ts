/* eslint-disable unused-imports/no-unused-vars */
import type { ReactElement } from 'react'

export type ActionsTree = Record<string, (...args: any[]) => any>
export type Actions<S = any> = Record<string, (this: S, ...args: any) => any>
export type Getters<S = any> = Record<string, (this: S) => any>

export type ActionsOmitThisParameter<A extends Actions<any>> = {
  [K in keyof A]: (...args: Parameters<A[K]>) => ReturnType<A[K]>
}

export type GettersReturnType<G extends Getters<any>> = {
  [K in keyof G]: ReturnType<G[K]>
}

export interface StoreDefineOptions<S> {

}

export interface StoreDefine<S extends object, A extends Actions<S>, G extends Getters<any>> extends StoreDefineOptions<S> {
  state: (() => S) | S
  actions?: A & ThisType<A & S>
  getters?: G & ThisType<S>
}

export interface Signal<S, G extends Getters<S>> {
  <T>(fn: (state: S & GettersReturnType<G>) => T): ReactElement
}

type Path = (string | symbol)[]
type Op = [op: 'set', path: Path, value: unknown, prevValue: unknown] | [op: 'delete', path: Path, prevValue: unknown]

export interface Subscribe<S, G extends Getters<S>> {
  (listener: (state: S & GettersReturnType<G>, opts: Op) => void): () => void
}
export interface SubscribeKey<S, G extends Getters<S>> {
  <T extends keyof S | keyof G>(key: T, listener: (state: (S & GettersReturnType<G>)[T]) => void): () => void
}
export interface Patch<S, G extends Getters<S>> {
  (patch: Partial<S> | ((state: S & GettersReturnType<G>) => void)): void
}

export interface StoreOptions {

}

export type Store<S, A extends Actions<S> = Actions<S>, G extends Getters<S> = Getters<S>> = {
  $subscribe: Subscribe<S, G>
  $subscribeKey: SubscribeKey<S, G>
  $patch: Patch<S, G>
  $state: S & GettersReturnType<G> & ActionsOmitThisParameter<A>
  $actions: ActionsOmitThisParameter<A>
  $getters: GettersReturnType<G>
  use: (plugin: Plugin) => void
  $signal: Signal<S, G>
} & S & GettersReturnType<G> & ActionsOmitThisParameter<A> & StoreOptions

export interface PluginContext<S extends object = Record<string, unknown>> {
  store: Store<S, Actions<S>, Getters<S>>
  options: StoreDefine<S, ActionsTree, Getters<S>>
}

export interface Plugin {
  <S extends object = Record<string, unknown>>(context: PluginContext<S>): void
}
