/** @jsxImportSource valtio-define/plugins/signal */



import valtio, { defineStore, useStore } from 'valtio-define'
import { persist } from 'valtio-define/plugins/persist'
import { signal } from 'valtio-define/plugins/signal'
import './App.css'

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
  getters: {
    doubled() {
      return this.count * 2
    },
    tripled() {
      return this.doubled * 3
    },
  },
})


function App() {
  const { count, doubled, tripled, increment } = useStore(store)

  console.log('---')
  return (
    <div>
      <button onClick={increment}>Increment</button>
      <div>Count: {count}</div>
      <div>Doubled: {doubled}</div>
      <div>Tripled: {tripled}</div>
    </div>
  )
}

export default App
