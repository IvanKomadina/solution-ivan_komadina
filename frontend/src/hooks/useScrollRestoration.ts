import { useEffect, useRef } from 'react'

const scrollPositions = new Map<string, number>()

export function useScrollRestoration(key: string, ready: boolean) {
  const hasRestored = useRef(false)

  useEffect(() => {
    hasRestored.current = false
  }, [key])

  useEffect(() => {
    if (ready && !hasRestored.current) {
      const saved = scrollPositions.get(key)
      if (saved !== undefined) {
        window.scrollTo(0, saved)
      }
      hasRestored.current = true
    }
  }, [ready, key])

  useEffect(() => {
    function handleScroll() {
      scrollPositions.set(key, window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [key])
}