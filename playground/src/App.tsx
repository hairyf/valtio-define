import { defineStore, useStore } from 'valtio-define'
import reactLogo from './assets/react.svg'
import './App.css'
import viteLogo from '/vite.svg'

const store = defineStore({
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
  },
  getters: {
    doubled() {
      return this.count * 2
    },
  },
})

function App() {
  const counter = useStore(store)

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
        <button onClick={() => counter.increment()}>
          count is
          {' '}
          {counter.count}
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
