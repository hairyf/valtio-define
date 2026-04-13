---
name: use-store
description: React hook for accessing store state in components
---

# useStore

React hook that returns a reactive snapshot of the store state. Automatically re-renders components when accessed state changes.

`useStore` is a thin wrapper around Valtio's `useSnapshot`, but it returns a snapshot that includes:

* State
* Getters
* Actions (as stable function references)

## Usage

```tsx
import { defineStore, useStore } from 'valtio-define'

const store = defineStore({
  state: () => ({ count: 0 }),
  actions: {
    increment() { this.count++ },
  },
  getters: {
    doubled() { return this.count * 2 },
  },
})

function Counter() {
  const state = useStore(store)
  
  return (
    <div>
      <div>Count: {state.count}</div>
      <div>Doubled: {state.doubled}</div>
      <button onClick={() => state.increment()}>Increment</button>
    </div>
  )
}
```

## Key Points

* **Reactive**: Component automatically re-renders when accessed state properties change.
* **Snapshot**: Returns a snapshot (read-only) of the state. Use actions or `$patch` to modify state.
* **Getters Included**: Getters are automatically included in the returned snapshot.
* **Actions Included**: Actions are included in the snapshot (and are safe to call).

## Options

`useStore(store, options)` accepts the same options as Valtio's `useSnapshot`:

```tsx
const state = useStore(store, { sync: true })
```

`sync: true` is useful for controlled inputs that may lose caret position due to batched updates (see Valtio issue: https://github.com/pmndrs/valtio/issues/270):

```tsx
function Input() {
  const state = useStore(store, { sync: true })

  return (
    <input
      value={state.text}
      onChange={e => store.text = e.target.value}
    />
  )
}
```
