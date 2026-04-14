import { useCallback, useEffect } from 'react'
import { snapshot, subscribe } from 'valtio'
import { themeState } from '~/state'

export function useCodesandboxTheme(mdxSource: string) {
  const updateCodesandboxEmbeds = useCallback(() => {
    const isDarkMode = snapshot(themeState).isDarkMode
    const codesandboxEmbeds = document.querySelectorAll(
      '[src*="codesandbox.io/embed"]',
    )
    codesandboxEmbeds.forEach((embed) => {
      const frame = embed as HTMLIFrameElement
      const url = new URL(frame.src)
      const currentCodesandboxTheme = url.searchParams.get('theme')
      const newCodesandboxTheme = isDarkMode ? 'dark' : 'light'
      if (currentCodesandboxTheme === newCodesandboxTheme)
        return
      url.searchParams.set('theme', newCodesandboxTheme)
      frame.src = url.toString()
    })
  }, [])
  useEffect(() => {
    updateCodesandboxEmbeds()
    return subscribe(themeState, updateCodesandboxEmbeds)
  }, [mdxSource, updateCodesandboxEmbeds])
}
