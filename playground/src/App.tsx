/** @jsxImportSource valtio-define/plugins/signal */
 

 
import valtio, { defineStore } from 'valtio-define'
import { persist } from 'valtio-define/plugins/persist'
import { signal } from 'valtio-define/plugins/signal'

import reactLogo from './assets/react.svg'
import './App.css'
import viteLogo from '/vite.svg'

valtio.use(persist())
valtio.use(signal())

const store = defineStore({
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
  },
})


function App() {

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
        <button onClick={() => store.increment()} style={{ marginRight: '10px' }}>
          count is
          {' '}
          {store.$signal(state => state.count)}
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
    </>
  )
}

export default App
