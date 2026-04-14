/* eslint-disable @typescript-eslint/no-unused-expressions */
import valtio, { defineStore, useStore } from 'valtio-define'
import { persist } from 'valtio-define/plugins/persist'

import reactLogo from './assets/react.svg'
import './App.css'
import viteLogo from '/vite.svg'

valtio.use(persist())

const store = defineStore({
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
    delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    current() {
      return this.doublePlusOne
    },
  },
  getters: {
    doubled() {
      return this.count * 2
    },
    // the return type **must** be explicitly set
    doublePlusOne() {
      // autocompletion and typings for the whole store ✨
      return this.doubled + 1
    },
  },
  persist: {
    key: 'counter',
  },
})

store.doublePlusOne
// store.a // Fix:Not define getters this cont is Any
store.$actions.current // Fix: (...args: any[]) => any

function App() {
  const counter = useStore(store)

  store.$persist.mount()

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => counter.increment()} style={{ marginRight: '10px' }}>
          count is
          {' '}
          {counter.count}
        </button>
        <button onClick={() => counter.delay(1000)}>
          delay 1000ms
        </button>
        <p>
          Edit
          {' '}
          <code>src/App.tsx</code>
          {' '}
          and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p>
        doubled is
        {' '}
        {counter.doubled}
      </p>
    </>
  )
}

export default App
