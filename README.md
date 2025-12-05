# valtio-define

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

⚡ Quickly create a fully functional and robust Valtio factory

## Installation

```bash
npm install valtio-define
```

## Usage

### Basic Store

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
  const { count, increment } = useStore(store)
  return (
    <div>
      <button onClick={increment}>Increment</button>
      <div>{count}</div>
    </div>
  )
}
```

### With Getters

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

### Async Actions with Status

```tsx
import { defineStore, useStatus, useStore } from 'valtio-define'

const store = defineStore({
  state: () => ({ data: null }),
  actions: {
    async fetchData() {
      const response = await fetch('/api/data')
      this.data = await response.json()
    },
  },
})

function DataComponent() {
  const state = useStore(store)
  const status = useStatus(store)

  return (
    <div>
      {status.loading && <div> Store all actions are loading...</div>}
      {status.finished && <div> Store all actions are finished...</div>}
      {status.error && <div> Store all actions are error...</div>}

      {status.fetchData.finished && <div> Data fetched successfully...</div>}
      {status.fetchData.error && (
        <div>
          {' '}
          Error fetching data:
          {status.fetchData.error.message}
        </div>
      )}
      {state.data && <div>{JSON.stringify(state.data)}</div>}
      <button onClick={store.fetchData}>Fetch Data</button>
    </div>
  )
}
```

### Persistence

```tsx
const store = defineStore({
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    },
  },
  persist: true // or { key: 'my-store', storage: localStorage, paths: ['count'] }
})
```

If the persist is a boolean value, it will use `structure-id` to generate a unique key for the store.

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

// Subscribe to status changes
const unsubscribeStatus = store.$subscribe.status((status) => {
  console.log('Status changed:', status)
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
      {store.$signal(state => (
        <div>
          Count:
          {state.count}
        </div>
      ))}
      {store.$signal.status(status => (
        status.loading && <div>Loading...</div>
      ))}
    </div>
  )
}
```

## API

### `defineStore(store)`

Creates a store with state, actions, and getters.

**Parameters:**
- `store.state`: Initial state object or factory function
- `store.actions`: Object containing action methods
- `store.getters`: Object containing getter methods
- `store.persist`: Persistence configuration (boolean or object)

**Returns:** Store instance with reactive state and actions

### `useStore(store)`

React hook that returns a snapshot of the store state.

**Parameters:**
- `store`: Store instance created by `defineStore`

**Returns:** Snapshot of the store state

### `useStatus(store)`

React hook that returns the status of all actions.

**Parameters:**
- `store`: Store instance created by `defineStore`

**Returns:** Status object with loading, finished, and error states

### `proxyWithPersistent(initialObject, options?)`

Creates a persistent proxy state.

**Parameters:**
- `initialObject`: Initial state object
- `options.key`: Storage key (auto-generated if not provided)
- `options.storage`: Storage instance (defaults to localStorage)
- `options.paths`: Array of paths to persist (defaults to all)

**Returns:** Persistent proxy state

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
