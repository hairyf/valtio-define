import { proxy } from 'valtio'

export const state = proxy({
  dur: 4,
  count: 0,
})

export function incDuration() {
  ++state.dur
}

export function decDuration() {
  --state.dur
}

function incrementCount() {
  ++state.count
  setTimeout(incrementCount, 100 * state.dur)
}

incrementCount()
