import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { defineStore, useStore } from '../src'

describe('input', () => {
  it('should not duplicate fullwidth comma', async () => {
    const store = defineStore({
      state: () => ({
        text: '',
      }),
    })

    function TestInput() {
      const { text } = useStore(store)
      return (
        <input
          data-testid="input"
          value={text}
          onChange={e => store.text = e.target.value}
        />
      )
    }

    await render(<TestInput />)

    const input = page.getByTestId('input')
    await input.click()
    await userEvent.type(input, '，')

    await expect.element(input).toHaveValue('，')
    expect(store.text).toBe('，')
  })

  it('should keep the value correct when inserting fullwidth comma in the middle', async () => {
    const store = defineStore({
      state: () => ({
        text: '',
      }),
    })

    function TestInput() {
      const { text } = useStore(store)
      return (
        <input
          data-testid="input"
          value={text}
          onChange={e => store.text = e.target.value}
        />
      )
    }

    await render(<TestInput />)

    const input = page.getByTestId('input')
    await userEvent.fill(input, 'ab')

    const el = await input.element() as HTMLInputElement
    el.focus()
    el.setSelectionRange(1, 1)

    await userEvent.type(input, '，')

    await expect.element(input).toHaveValue('a，b')
    expect(store.text).toBe('a，b')
  })
})
