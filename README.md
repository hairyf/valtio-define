![image](./logo.svg)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![coverage][coverage-src]][coverage-href]
[![License][license-src]][license-href].

⚡️ **valtio-define** is a lightweight factory for creating fully functional, robust [Valtio](https://valtio.dev) stores. It simplifies state management in React by providing a structured API for state, actions, and computed getters.

## 📦 Installation

```bash
pnpm add valtio-define
```

## 🚀 Quick Start

### Basic Store

`defineStore` allows you to encapsulate state and logic in one place. Use `useStore` to consume the reactive state in your components.

```tsx
import { defineStore, useStore } from 'valtio-define'

const store = defineStore({
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      // 'this' refers to the reactive state
      this.count++
    },
  },
})

function Counter() {
  const { count } = useStore(store)

  return (
    <div>
      <div>
        Count:
        {count}
      </div>
      <button onClick={store.increment}>Increment</button>
    </div>
  )
}
```

### Derived State (Getters)

Getters are **computed properties**. They automatically re-evaluate when their dependencies change, providing a clean way to derive data.

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
```

-----

## 🛠 Advanced Features

### The Power of `this`

Inside `actions` and `getters`, `this` provides full access to the store's state, other actions, and other getters. This type safety across the entire store.

```tsx
const store = defineStore({
  state: () => ({
    count: 0,
  }),
  actions: {
    // Autocompletion and typings for the whole store ✨
    currentDoubledOne() {
      return this.doublePlusOne
    },
  },
  getters: {
    doubled() {
      return this.count * 2
    },
    // Note: The return type **must** be explicitly set for complex getters
    doublePlusOne() {
      // Access other getters via 'this'
      return this.doubled + 1
    },
  },
})
```

### Persistence

Save and restore your store state using the `persist` plugin.

1.  **Global Registration:**

    ```tsx
    import valtio from 'valtio-define'
    import { persist } from 'valtio-define/plugins'

    valtio.use(persist())
    ```

2.  **Store Configuration:**

    ```tsx
    const store = defineStore({
      state: () => ({ count: 0 }),
      persist: {
        key: 'my-app-storage',
        storage: localStorage,
        paths: ['count'], // Optional: Persist specific keys only
      },
    })
    ```

    > **Tip:** If you set `persist: true`, a unique key is automatically generated using `structure-id`.

### Manual Hydration (SSR Friendly)

To avoid hydration mismatches during Server-Side Rendering, disable automatic hydration and mount it in a `useEffect`.

```tsx
// Register with hydrate disabled
store.use(persist({ hydrate: false }))

// In your Client Entry / App Root
useEffect(() => {
  store.$persist.mount()
}, [])
```

### React-Idiomatic State Hooks

If you prefer the `useState` syntax, use `storeToState` or `storeToStates`. These return `[state, setter]` tuples.

```tsx
function Profile() {
  // Access a single key
  const [name, setName] = storeToState(store, 'name')

  // Access all keys as hooks
  const {
    count: [count, setCount]
  } = storeToStates(store)

  return <input value={name} onChange={e => setName(e.target.value)} />
}
```

-----

## 🛰 Store API

Every store instance created with `defineStore` includes built-in utility methods:

  * **`$patch(obj | fn)`**: Bulk update the state.
  * **`$subscribe(callback)`**: Watch the entire store for changes.
  * **`$subscribeKey(key, callback)`**: Watch a specific property.
  * **`$signal(selector)`**: Use a selector function inside JSX for fine-grained reactivity.

-----

## 🔌 Plugins

### Global vs. Per-Store

Plugins can be applied to all stores or restricted to a single instance.

```tsx
// Global
valtio.use(myPlugin())

// Local
const store = defineStore({ /* ... */ })
store.use(myPlugin())
```

### Creating a Custom Plugin

Extend functionality by accessing the `store` instance and `options` through the plugin context.

```tsx
import type { Plugin } from 'valtio-define'

function loggerPlugin(): Plugin {
  return ({ store, options }) => {
    store.$subscribe((state) => {
      console.log('Update:', state)
    })
  }
}

declare module 'valtio-define' {
  export interface StoreDefineOptions<S extends object> {
    $myPlugin?: {
      someOption?: boolean
    }
  }
}
```

-----

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
