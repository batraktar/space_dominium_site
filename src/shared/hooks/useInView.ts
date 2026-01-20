import { useEffect, useState } from 'react'

type Options = IntersectionObserverInit & {
  freezeOnceVisible?: boolean
}

export function useInView<T extends Element>(
  ref: React.RefObject<T | null>,
  options: Options = {},
) {
  const [inView, setInView] = useState(false)
  const { root = null, rootMargin = '0px', threshold = 0, freezeOnceVisible = true } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (freezeOnceVisible) observer.disconnect()
        } else if (!freezeOnceVisible) {
          setInView(false)
        }
      },
      { root, rootMargin, threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, root, rootMargin, threshold, freezeOnceVisible])

  return inView
}
