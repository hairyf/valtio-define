---
name: feature-plugin-signal
description: Signal plugin that enables `$signal` and a custom JSX runtime for inline reactive values
---

# Signal Plugin

Enable `$signal` and a custom JSX runtime that renders reactive values inline. Useful for simple reactive expressions without creating separate components.

## Setup

Enable the Signal plugin globally:

```tsx
import valtio from 'valtio-define'
import { signal } from 'valtio-define/plugins/signal'

valtio.use(signal())
```

Add `jsxImportSource` at the beginning of your `.tsx` file:

```tsx
/** @jsxImportSource valtio-define/plugins/signal */
```

## Usage

```tsx
/** @jsxImportSource valtio-define/plugins/signal */

import { defineStore } from 'valtio-define'

const store = defineStore({
  state: () => ({ count: 0 }),
  getters: {
    doubled() { return this.count * 2 },
  },
})

function App() {
  return (
    <div>
      Count: {store.$signal(state => state.count)}
      {' '}
      Doubled: {store.$signal().doubled}
    </div>
  )
}
```

## Key Points

* **Inline Reactivity**: Renders reactive values directly in JSX
* **Automatic Updates**: Component re-renders when accessed state changes
* **Access to State and Getters**: Selector receives full state including getters (or call `store.$signal()` to get the signal state)
* **No Hook Required**: Can be used inline in JSX without calling `useStore` in the same component

## When to Use

**Use $signal when:**
* Simple inline reactive expressions
* Don't want to extract to separate component
* Displaying computed values inline

**Use useStore when:**
* Need multiple state values
* Need to pass state to child components
* More complex component logic

## Pattern Comparison

```tsx
// Using $signal
<div>
  {store.$signal(s => s.count)}
</div>

// Using useStore (more flexible)
function Component() {
  const state = useStore(store)
  return <div>{state.count}</div>
}
```
