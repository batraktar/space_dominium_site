import { useEffect, useState } from 'react'

const query = '(prefers-reduced-motion: reduce)'

const getInitialValue = () => {
  if (typeof window === 'undefined' || !('matchMedia' in window)) return false
  return window.matchMedia(query).matches
}

export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialValue)

  useEffect(() => {
    if (!('matchMedia' in window)) return undefined
    const media = window.matchMedia(query)
    const onChange = () => setPrefersReducedMotion(media.matches)

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    }

    const legacy = media as MediaQueryList & {
      addListener?: (listener: () => void) => void
      removeListener?: (listener: () => void) => void
    }
    if (typeof legacy.addListener === 'function') {
      legacy.addListener(onChange)
      return () => legacy.removeListener?.(onChange)
    }

    return undefined
  }, [])

  return prefersReducedMotion
}
