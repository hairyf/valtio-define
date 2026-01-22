export type Actions<S = any> = Record<string, (this: S, ...args: any) => any>
export type ActionsTree = Record<string, (...args: any[]) => any>
export type Getters<S = any> = Record<string, (this: S) => any>

export type ActionsOmitThisParameter<A extends Actions<any>> = {
  [K in keyof A]: (...args: Parameters<A[K]>) => ReturnType<A[K]>
}

export interface Status {
  finished: boolean
  loading: boolean
  error?: Error
}

export type ActionsStatus<A extends Actions<any>> = Status & { [K in keyof A]: Status }
export type GettersReturnType<G extends Getters<any>> = {
  [K in keyof G]: ReturnType<G[K]>
}

export interface StoreDefine<S extends object, A extends ActionsTree, G extends Getters<any>> {
  state: (() => S) | S
  actions?: A & ThisType<A & S & GettersReturnType<G>>
  getters?: G & ThisType<S & GettersReturnType<G>>
}

export interface StoreOptions<S extends object = Record<string, unknown>> {
  persist?: boolean | PersistentOptions<S>
}

export interface StoreSignal<S, A extends Actions<S>, G extends Getters<S>> {
  <T>(fn: (state: S & GettersReturnType<G>) => T): T
  status: <T>(fn: (status: ActionsStatus<A>) => T) => T
}
export interface StoreSubscribe<S, A extends Actions<S>, G extends Getters<S>> {
  (listener: (state: S & GettersReturnType<G>) => void): () => void
  status: (listener: (status: ActionsStatus<A>) => void) => () => void
  key: <K extends keyof S | keyof G>(key: K, listener: (state: (S & GettersReturnType<G>)[K]) => void) => () => void
}
export interface StorePatch<S, G extends Getters<S>> {
  (patch: Partial<S> | ((state: S & GettersReturnType<G>) => void)): void
}

export type Store<S, A extends Actions<S>, G extends Getters<S>> = {
  $subscribe: StoreSubscribe<S, A, G>
  $patch: StorePatch<S, G>
  $state: S & GettersReturnType<G> & ActionsOmitThisParameter<A>
  $actions: ActionsOmitThisParameter<A>
  $getters: GettersReturnType<G>
  $status: ActionsStatus<A>
  $signal: StoreSignal<S, A, G>
} & S & GettersReturnType<G> & ActionsOmitThisParameter<A>

export interface PersistentOptions<S extends object = Record<string, unknown>> {
  key?: string
  storage?: Partial<Storage> & Pick<Storage, 'getItem' | 'setItem'>
  paths?: (keyof S)[]
  initial?: (initialState: S) => any | Promise<any>
}
