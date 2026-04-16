/* eslint-disable ts/no-empty-object-type */
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

export interface StoreDefine<
  S extends object,
  A extends object,
  G extends Getters<any>,
> extends StoreDefineOptions<S> {
  state: (() => S) | S
  actions?: A & ThisType<A & S & GettersReturnType<G>>
  getters?: G & ThisType<S & GettersReturnType<G>>
}

export interface Signal<S, G extends Getters<S>> {
  <T>(fn: (state: S & GettersReturnType<G>) => T): ReactElement
}

export type Path = (string | symbol)[]
export type Op = [op: 'set', path: Path, value: unknown, prevValue: unknown] | [op: 'delete', path: Path, prevValue: unknown]

export interface Subscribe<S, G extends Getters<S>> {
  (listener: (state: S & GettersReturnType<G>, opts: Op[]) => void): () => void
}
export interface SubscribeKey<S, G extends Getters<S>> {
  <T extends keyof S | keyof G>(key: T, listener: (state: (S & GettersReturnType<G>)[T]) => void): () => void
}
export interface Patch<S, G extends Getters<S>> {
  (patch: Partial<S> | ((state: S & GettersReturnType<G>) => void)): void
}

export interface StoreOptions<S, A, G> {

}

export type Store<S, A extends Actions<S> = {}, G extends Getters<S> = {}> = {
  $subscribe: Subscribe<S, G>
  $subscribeKey: SubscribeKey<S, G>
  $patch: Patch<S, G>
  $state: S
  $actions: ActionsOmitThisParameter<A>
  $getters: GettersReturnType<G>
  $dispose: () => void
  use: (plugin: Plugin) => void
} & S & GettersReturnType<G> & ActionsOmitThisParameter<A> & StoreOptions<S, A, G>

export interface PluginContext<S extends object = Record<string, unknown>> {
  store: Store<S, Actions<S>, Getters<S>>
  options: StoreDefine<S, ActionsTree, Getters<S>>
}

export interface Plugin {
  <S extends object = Record<string, unknown>>(context: PluginContext<S>): void
}
