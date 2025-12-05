import { defineStore, useStatus, useStore } from 'valtio-define'
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
    delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms))
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
  const status = useStatus(store)

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
      <p>
        status is
        {' '}
        {status.delay.loading ? 'loading' : 'not loading'}
      </p>
      <p>
        status is
        {' '}
        {status.delay.finished ? 'finished' : 'not finished'}
      </p>
      <p>
        status is
        {' '}
        {status.delay.error ? 'error' : 'not error'}
      </p>
    </>
  )
}

export default App
