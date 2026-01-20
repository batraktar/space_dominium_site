import { useEffect, useState } from 'react'

type Options = {
  triggerEl: HTMLElement | null // елемент, після якого бар має стати fixed
  barEl: HTMLElement | null // бар
  top?: number // відступ згори у fixed-стані
  bottomGap?: number // наскільки бар відступає від низу хедера у старті
}

export function useAffix({ triggerEl, barEl, top = 0, bottomGap = 20 }: Options) {
  const [affixed, setAffixed] = useState(false)
  const [barHeight, setBarHeight] = useState(0)

  useEffect(() => {
    if (!triggerEl || !barEl) return

    const ro = new ResizeObserver(() => {
      setBarHeight(barEl.getBoundingClientRect().height)
      onScroll()
    })
    ro.observe(triggerEl)
    ro.observe(barEl)

    function onScroll() {
      const triggerRect = triggerEl!.getBoundingClientRect()
      const triggerTop = triggerRect.top + window.scrollY
      const triggerBottom = triggerTop + triggerRect.height
      const threshold = triggerBottom - (barEl!.offsetHeight + bottomGap + top)
      setAffixed(window.scrollY >= threshold)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [triggerEl, barEl, top, bottomGap])

  return { affixed, barHeight }
}
