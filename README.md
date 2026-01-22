# valtio-define

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![coverage][coverage-src]][coverage-href]
[![License][license-src]][license-href]

⚡ Quickly create a fully functional and robust [Valtio](https://valtio.dev) factory

## Installation

```bash
pnpm add valtio-define
```

## Usage

### Basic Store

Create a reactive store with state and actions. The store provides a simple and intuitive API for managing state in React applications, built on top of Valtio.

```tsx
import { defineStore, useStore } from 'valtio-define'

const store = defineStore({
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    },
  },
})

function Counter() {
  const { count } = useStore(store)
  return (
    <div>
      <button onClick={store.increment}>Increment</button>
      <div>{count}</div>
    </div>
  )
}
```

### With Getters

Getters are computed properties that automatically update when their dependencies change. They provide a clean way to derive state without manually tracking dependencies.

```tsx
const store = defineStore({
  state: () => ({ count: 0 }),
  getters: {
    doubled() {
      return this.count * 2
    },
  },
  actions: {
    increment() {
      this.count++
    },
  },
})

function Counter() {
  const state = useStore(store)
  return (
    <div>
      <div>
        Count:
        {state.count}
      </div>
      <div>
        Doubled:
        {state.doubled}
      </div>
      <button onClick={store.increment}>Increment</button>
    </div>
  )
}
```

### Persistence

The persistence plugin allows you to persist store state to storage (e.g., localStorage).

First, register the persistent plugin:

```tsx
import valtio from 'valtio-define'
import { persistent } from 'valtio-define/plugins'

// Register the persistent plugin globally
valtio.use(persistent())
```

Then use it in your store:

```tsx
import { defineStore } from 'valtio-define'

const store = defineStore({
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    },
  },
  persist: {
    key: 'my-store',
    storage: localStorage,
    paths: ['count'], // Only persist 'count', or omit to persist all state
  },
})
```

If `persist` is `true`, it will use `structure-id` to generate a unique key for the store automatically.

```tsx
const store = defineStore({
  state: () => ({ count: 0 }),
  persist: true, // Auto-generates key using structure-id
})
```

### Subscribe to Changes

```tsx
const store = defineStore({
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    },
  },
})

// Subscribe to state changes
const unsubscribe = store.$subscribe((state) => {
  console.log('State changed:', state)
})

// Subscribe to specific key changes
const unsubscribeKey = store.$subscribeKey('count', (value) => {
  console.log('Count changed:', value)
})
```

### Patch State

```tsx
// Patch with object
store.$patch({ count: 10 })

// Patch with function
store.$patch((state) => {
  state.count += 5
})
```

### Signal (JSX Component)

```tsx
function App() {
  return (
    <div>
      Count:
      {' '}
      {store.$signal(state => state.count)}
    </div>
  )
}
```

### Store to State Hooks

Convert store state to React hooks similar to `useState`. This provides a more React-idiomatic way to access and update store state.

#### `storeToState(store, key)`

Returns a tuple `[state, setter]` for a single store key, similar to React's `useState`.

```tsx
import { defineStore, storeToState } from 'valtio-define'

const store = defineStore({
  state: { count: 0, name: 'test' },
})

function Counter() {
  const [count, setCount] = storeToState(store, 'count')
  const [name, setName] = storeToState(store, 'name')

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(prev => prev + 1)}>Increment (functional)</button>
      <div>
        Count:
        {count}
      </div>
      <div>
        Name:
        {name}
      </div>
    </div>
  )
}
```

**Parameters:**
- `store`: Store instance created by `defineStore`
- `key`: Key of the state property to access

**Returns:** `[state, setter]` tuple where:
- `state`: Current value of the state property
- `setter`: Function to update the state (accepts value or updater function)

#### `storeToStates(store)`

Returns an object with all store keys mapped to `[state, setter]` tuples.

```tsx
function Component() {
  const {
    count: [count, setCount],
    name: [name, setName],
    user: [user, setUser],
  } = storeToStates(store)

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <div>
        Count:
        {count}
      </div>
      <div>
        Name:
        {name}
      </div>
      <div>
        User:
        {user.name}
      </div>
    </div>
  )
}
```

**Parameters:**
- `store`: Store instance created by `defineStore`

**Returns:** Object where each key maps to a `[state, setter]` tuple

## API

### `defineStore(store)`

Creates a store with state, actions, and getters.

**Parameters:**
- `store.state`: Initial state object or factory function
- `store.actions`: Object containing action methods
- `store.getters`: Object containing getter methods
- `store.persist`: Persistence plugin configuration (boolean or object) - see [Persistence Plugin](#persistence)

**Returns:** Store instance with reactive state and actions

### `useStore(store)`

React hook that returns a snapshot of the store state.

**Parameters:**
- `store`: Store instance created by `defineStore`

**Returns:** Snapshot of the store state

### `storeToState(store, key)`

React hook that returns a `[state, setter]` tuple for a single store key, similar to React's `useState`.

**Parameters:**
- `store`: Store instance created by `defineStore`
- `key`: Key of the state property to access

**Returns:** `[state, setter]` tuple where:
- `state`: Current value of the state property
- `setter`: Function to update the state (accepts value or updater function like `setState(value)` or `setState(prev => newValue)`)

### `storeToStates(store)`

React hook that returns an object with all store keys mapped to `[state, setter]` tuples.

**Parameters:**
- `store`: Store instance created by `defineStore`

**Returns:** Object where each key maps to a `[state, setter]` tuple, preserving the correct type for each property

### Plugins

Plugins allow you to extend store functionality. You can use plugins globally or per-store.

#### Global Plugin Registration

```tsx
import valtio from 'valtio-define'
import { persistent } from 'valtio-define/plugins'

// Register plugin globally - applies to all stores
valtio.use(persistent())
```

#### Per-Store Plugin Registration

```tsx
import { defineStore } from 'valtio-define'
import { persistent } from 'valtio-define/plugins'

const store = defineStore({
  state: () => ({ count: 0 }),
})

// Register plugin for this specific store
store.use(persistent())
```

#### Creating Custom Plugins

```tsx
import type { Plugin } from 'valtio-define'

function myPlugin() {
  ({ store, options }: PluginContext) => {
    // Access store methods
    store.$subscribe((state) => {
      console.log('State changed:', state)
    })

    // Access store options
    if (options.someOption) {
    // Do something
    }
  }
}

declare module 'valtio-define/types' {
  export interface StoreDefine<S extends object, A extends ActionsTree, G extends Getters<any>> {
    myPlugin?: {
      someOption?: boolean
    }
  }
}

// Use the plugin
use(myPlugin)
```

**Plugin Context:**
- `context.store`: The store instance with all methods (`$state`, `$patch`, `$subscribe`, etc.)
- `context.options`: The original store definition options

## License

[MIT](./LICENSE) License © [Hairyf](https://github.com/hairyf)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/valtio-define?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/valtio-define
[npm-downloads-src]: https://img.shields.io/npm/dm/valtio-define?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/valtio-define
[bundle-src]: https://img.shields.io/bundlephobia/minzip/valtio-define?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=valtio-define
[license-src]: https://img.shields.io/github/license/hairyf/valtio-define.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/hairyf/valtio-define/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/valtio-define
[coverage-src]: https://codecov.io/gh/hairyf/valtio-define/graph/badge.svg?token=PG5YIEEEHJ
[coverage-href]: https://codecov.io/gh/hairyf/valtio-define
