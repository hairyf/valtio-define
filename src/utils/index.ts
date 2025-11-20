import type { AnyFn } from '@hairy/utils'
import type { Status } from '../types'

export function track(action: AnyFn, status: Status) {
  let loadings = 0
  const tracking = (): void => {
    loadings++ === 0 && (status.loading = true)
  }
  const done = (): void => {
    !--loadings && (status.loading = false)
  }
  const fulfilled = (value: any): any => {
    status.finished = true
    done()
    return value
  }
  const rejected = (error: any): never => {
    status.error = error
    done()
    throw error
  }
  return function (...args: any[]) {
    tracking()
    try {
      const value = action(...args)
      return value instanceof Promise
        ? value.then(fulfilled, rejected)
        : fulfilled(value)
    }
    catch (error: any) {
      rejected(error)
    }
  }
}
