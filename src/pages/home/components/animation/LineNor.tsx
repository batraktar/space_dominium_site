import React, { useLayoutEffect, useMemo, useRef } from 'react'
import './LineNor.css'

export type DottedSide = 'left' | 'right' | 'both'
export interface Variant {
  id: string
  thumb: string
  contentIcon: string
  bullets: string[]
}

interface LineNorProps {
  dottedSide?: DottedSide
  variants: Variant[]
  activeVarIdx: number | null
  setActiveVarIdx: React.Dispatch<React.SetStateAction<number | null>>
  drawDurationMs?: number
}

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()

    if (media.addEventListener) {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }

    media.addListener(update)
    return () => media.removeListener(update)
  }, [])

  return reduced
}

const useStrokeDraw = (
  pathRefs: Array<React.RefObject<SVGPathElement | null>>,
  isActive: boolean,
  opts: { duration?: number; easing?: string } = {},
) => {
  const { duration = 750, easing = 'ease-in-out' } = opts
  const reducedMotion = usePrefersReducedMotion()
  const lengthsRef = useRef(new WeakMap<SVGPathElement, { key: string; length: number }>())
  const animationsRef = useRef(new WeakMap<SVGPathElement, Animation>())
  const activeStateRef = useRef(new WeakMap<SVGPathElement, boolean>())

  useLayoutEffect(() => {
    const lengths = lengthsRef.current
    const animations = animationsRef.current
    const activeState = activeStateRef.current

    pathRefs.forEach((ref, index) => {
      const el = ref.current
      if (!el) return

      const key = el.getAttribute('d') ?? `${index}`
      const cached = lengths.get(el)
      let length = cached?.length

      if (!cached || cached.key !== key) {
        length = el.getTotalLength()
        lengths.set(el, { key, length })
      }

      if (!length) return

      el.style.strokeDasharray = `${length}`

      const prev = animations.get(el)
      if (prev) prev.cancel()

      const wasActive = activeState.get(el) ?? false

      if (!isActive) {
        if (reducedMotion || !wasActive) {
          el.style.strokeDashoffset = `${length}`
          el.style.opacity = '0'
          activeState.set(el, false)
          return
        }

        const hideAnimation = el.animate(
          [
            { strokeDashoffset: 0, opacity: 1 },
            { strokeDashoffset: length, opacity: 0 },
          ],
          { duration, easing, fill: 'forwards' },
        )
        animations.set(el, hideAnimation)
        hideAnimation.onfinish = () => {
          el.style.strokeDashoffset = `${length}`
          el.style.opacity = '0'
          activeState.set(el, false)
        }
        return
      }

      if (reducedMotion) {
        el.style.strokeDashoffset = '0'
        el.style.opacity = '1'
        activeState.set(el, true)
        return
      }

      const showAnimation = el.animate(
        [
          { strokeDashoffset: length, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1 },
        ],
        { duration, easing, fill: 'forwards' },
      )
      animations.set(el, showAnimation)
      showAnimation.onfinish = () => {
        el.style.strokeDashoffset = '0'
        el.style.opacity = '1'
        activeState.set(el, true)
      }
    })

    return () => {
      pathRefs.forEach((ref) => {
        const el = ref.current
        if (!el) return
        const animation = animations.get(el)
        if (animation) animation.cancel()
      })
    }
  }, [pathRefs, isActive, reducedMotion, duration, easing])
}

const LineNor: React.FC<LineNorProps> = ({
  dottedSide = 'left',
  variants,
  activeVarIdx,
  setActiveVarIdx,
  drawDurationMs,
}) => {
  const leftIsDotted = dottedSide === 'left' || dottedSide === 'both'
  const rightIsDotted = dottedSide === 'right' || dottedSide === 'both'

  const drawDuration = drawDurationMs ?? 750

  const slotPositions = useMemo(
    () => [0.287356, 20.114943, 40.229885, 60.383142, 80.785441, 99.664751],
    [],
  )

  const L1 = useRef<SVGPathElement | null>(null)
  const L2 = useRef<SVGPathElement | null>(null)
  const R1 = useRef<SVGPathElement | null>(null)
  const R2 = useRef<SVGPathElement | null>(null)

  const leftRefs = useMemo(() => [L1, L2], [])
  const rightRefs = useMemo(() => [R1, R2], [])

  useStrokeDraw(leftRefs, !leftIsDotted, { duration: drawDuration })
  useStrokeDraw(rightRefs, !rightIsDotted, { duration: drawDuration })

  return (
    <div className="line_wrapper">
      <div className="line-svg">
        <svg width="1044" height="154" viewBox="0 0 1044 154" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ліва частина */}
          <svg width="1044" height="154" viewBox="0 0 1044 154" fill="none" style={{ maxWidth: '100%' }}>
            <circle cx="3" cy="151" r="2.5" stroke="black" />
            <path
              className="line-dotted"
              d="M3 149C3 63 3 63.2333 40 63"
              stroke="#1E1E5B"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
            <path
              className="line-dotted"
              d="M40 63H240"
              stroke="#1E1E5B"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
            <path
              ref={L1}
              className="line-solid"
              d="M3 149C3 63 3 63.2333 40 63"
              stroke="url(#paint4)"
              strokeWidth="2"
              fill="none"
            />
            <path
              ref={L2}
              className="line-solid"
              d="M40 63H240"
              stroke="#A88AED"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Права частина */}
          <svg width="1044" height="154" viewBox="0 0 1044 154" fill="none" style={{ maxWidth: '100%' }}>
            <circle cx="1040.5" cy="151" r="2.5" stroke="black" />
            <path
              className="line-dotted"
              d="M1040.5 149C1040.5 63 1040.5 63.2333 1003.5 63"
              stroke="#1E1E5B"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
            <path
              className="line-dotted"
              d="M1003.5 63H803"
              stroke="#1E1E5B"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
            <path
              ref={R1}
              className="line-solid"
              d="M1040.5 149C1040.5 63 1040.5 63.2333 1003.5 63"
              stroke="url(#paint4)"
              strokeWidth="2"
              fill="none"
            />
            <path
              ref={R2}
              className="line-solid"
              d="M1003.5 63H803"
              stroke="#A88AED"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Центр/горизонталі */}
          <circle cx="524.4" cy="3" r="2" stroke="#1E1E5B" strokeWidth="2" />
          <path d="M524.4 64L524.4 6" stroke="url(#paint0)" strokeWidth="2" />
          <path d="M244.4 63H803.4" stroke="#A88AED" strokeWidth="2" />

          {/* Відгалуження */}
          <circle
            cx="3"
            cy="3"
            r="2"
            transform="matrix(-1 0 0 1 843.4 148)"
            stroke="#1E1E5B"
            strokeWidth="2"
          />
          <circle
            cx="3"
            cy="3"
            r="2"
            transform="matrix(-1 0 0 1 630.4 148)"
            stroke="#1E1E5B"
            strokeWidth="2"
          />
          <circle
            cx="3"
            cy="3"
            r="2"
            transform="matrix(-1 0 0 1 420 148)"
            stroke="#1E1E5B"
            strokeWidth="2"
          />
          <circle
            cx="3"
            cy="3"
            r="2"
            transform="matrix(-1 0 0 1 210 148)"
            stroke="#1E1E5B"
            strokeWidth="2"
          />
          <path d="M840.4 149C840.4 64.5 848.4 63 803.4 63" stroke="url(#paint1)" strokeWidth="2" />
          <path d="M627.4 149C627.4 64.5 635.4 63 590.4 63" stroke="url(#paint2)" strokeWidth="2" />
          <path
            d="M416.957 149C416.957 64.5 408.861 63 454.4 63"
            stroke="url(#paint3)"
            strokeWidth="2"
          />
          <path
            d="M206.957 149C206.957 64.5 198.861 63 244.4 63"
            stroke="url(#paint4)"
            strokeWidth="2"
          />

          <defs>
            <linearGradient
              id="paint0"
              x1="524.9"
              y1="6"
              x2="524.9"
              y2="64"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1E1E5B" />
              <stop offset="1" stopColor="#9B89C0" />
            </linearGradient>
            <linearGradient
              id="paint1"
              x1="821.9"
              y1="63"
              x2="821.9"
              y2="149"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A88AED" />
              <stop offset="1" stopColor="#1E1E5B" />
            </linearGradient>
            <linearGradient
              id="paint2"
              x1="608.9"
              y1="63"
              x2="608.9"
              y2="149"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A88AED" />
              <stop offset="1" stopColor="#1E1E5B" />
            </linearGradient>
            <linearGradient
              id="paint3"
              x1="435.679"
              y1="63"
              x2="435.679"
              y2="149"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A88AED" />
              <stop offset="1" stopColor="#1E1E5B" />
            </linearGradient>
            <linearGradient
              id="paint4"
              x1="225.679"
              y1="63"
              x2="225.679"
              y2="149"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A88AED" />
              <stop offset="1" stopColor="#1E1E5B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* НИЖНІ СЕКТОРИ */}
      <div className="line_icon_wrapper" role="tablist" aria-label="Підменю">
        {variants.map((v, i) => {
          const isActive = i === activeVarIdx
          const isPlaceholder = v.bullets.length === 0
          return (
            <div
              key={v.id}
              className={`line_icon ${isActive ? 'is-active' : ''}`}
              style={{ left: `${slotPositions[i] ?? 0}%` }}
            >
              <button
                type="button"
                className="box_line_icon"
                role="tab"
                aria-selected={isActive}
                aria-disabled={isPlaceholder}
                disabled={isPlaceholder}
                tabIndex={isPlaceholder ? -1 : 0}
                onClick={() => {
                  if (isPlaceholder) return
                  setActiveVarIdx(i)
                }}
                onKeyDown={(e) => {
                  if (isPlaceholder) return
                  if (e.key === 'Enter' || e.key === ' ') setActiveVarIdx(i)
                }}
                aria-label={`Вибрати варіант ${i + 1}`}
              >
                <img src={v.thumb} alt="" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(LineNor)
