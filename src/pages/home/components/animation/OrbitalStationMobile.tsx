import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Variant } from './data'
import './OrbitalStationMobile.css'

type OrbitalStationMobileProps = {
  hubIcon: string
  hubIconColor?: string
  items: Variant[]
  itemColors?: Array<string | null>
  activeIndex: number | null
  onActiveIndexChange: (index: number) => void
}

const ACTIVE_ANGLE = -90

const normalizeDeltaDeg = (value: number) => {
  let delta = value % 360
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return delta
}

const getClosestIndex = (baseAngles: number[], rotationDeg: number) => {
  if (!baseAngles.length) return 0
  let bestIndex = 0
  let bestDistance = Number.POSITIVE_INFINITY
  for (let i = 0; i < baseAngles.length; i += 1) {
    const distance = Math.abs(normalizeDeltaDeg(baseAngles[i] + rotationDeg - ACTIVE_ANGLE))
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = i
    }
  }
  return bestIndex
}

const OrbitalStationMobile: React.FC<OrbitalStationMobileProps> = ({
  hubIcon,
  hubIconColor,
  items,
  itemColors,
  activeIndex,
  onActiveIndexChange,
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [stageWidth, setStageWidth] = useState(360)
  const [rotationDeg, setRotationDeg] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const rotationRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const dragStateRef = useRef<{ active: boolean; lastX: number }>({ active: false, lastX: 0 })

  const safeItems = useMemo(() => items.filter((item) => item.bullets.length > 0), [items])

  const baseAngles = useMemo(() => {
    if (safeItems.length <= 1) return [ACTIVE_ANGLE]
    const start = -168
    const end = -12
    const step = (end - start) / (safeItems.length - 1)
    return safeItems.map((_, idx) => start + step * idx)
  }, [safeItems])

  const clampedActiveIndex = useMemo(() => {
    if (!safeItems.length) return 0
    const fallback = activeIndex ?? 0
    return Math.min(Math.max(fallback, 0), safeItems.length - 1)
  }, [activeIndex, safeItems.length])

  const orbitRadius = useMemo(
    () => Math.max(126, Math.min(208, stageWidth * 0.42)),
    [stageWidth],
  )
  const stageHeight = useMemo(
    () => Math.max(240, Math.min(310, stageWidth * 0.76)),
    [stageWidth],
  )
  const orbitCenter = useMemo(
    () => ({ x: stageWidth / 2, y: stageHeight + orbitRadius * 0.18 }),
    [stageHeight, stageWidth, orbitRadius],
  )

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const update = () => setStageWidth(el.clientWidth || 360)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const animateRotationTo = useCallback((target: number, onDone?: () => void) => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    const from = rotationRef.current
    const duration = 420
    const startedAt = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = from + (target - from) * eased
      rotationRef.current = next
      setRotationDeg(next)

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(tick)
        return
      }

      animationFrameRef.current = null
      onDone?.()
    }

    animationFrameRef.current = requestAnimationFrame(tick)
  }, [])

  const animateToIndex = useCallback(
    (index: number, notify: boolean) => {
      if (!baseAngles.length) return
      const nextIndex = Math.min(Math.max(index, 0), baseAngles.length - 1)
      const target = ACTIVE_ANGLE - baseAngles[nextIndex]
      animateRotationTo(target, () => {
        if (notify) onActiveIndexChange(nextIndex)
      })
    },
    [animateRotationTo, baseAngles, onActiveIndexChange],
  )

  useEffect(() => {
    if (!safeItems.length || isDragging) return
    animateToIndex(clampedActiveIndex, false)
  }, [animateToIndex, clampedActiveIndex, isDragging, safeItems.length])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const liveClosestIndex = useMemo(
    () => getClosestIndex(baseAngles, rotationDeg),
    [baseAngles, rotationDeg],
  )
  const visualActiveIndex = isDragging ? liveClosestIndex : clampedActiveIndex

  const points = useMemo(
    () =>
      baseAngles.map((baseAngle) => {
        const angle = baseAngle + rotationDeg
        const radians = (angle * Math.PI) / 180
        return {
          x: orbitCenter.x + Math.cos(radians) * orbitRadius,
          y: orbitCenter.y + Math.sin(radians) * orbitRadius,
          angle,
        }
      }),
    [baseAngles, orbitCenter.x, orbitCenter.y, orbitRadius, rotationDeg],
  )

  const hubPoint = useMemo(
    () => ({ x: stageWidth / 2, y: 68 }),
    [stageWidth],
  )
  const activePoint = points[visualActiveIndex] ?? { x: hubPoint.x, y: hubPoint.y + 90 }
  const tetherPath = `M ${hubPoint.x} ${hubPoint.y} Q ${hubPoint.x} ${(hubPoint.y + activePoint.y) / 2} ${activePoint.x} ${activePoint.y}`
  const activeLabel = safeItems[visualActiveIndex]?.bullets?.[0] ?? ''

  if (!safeItems.length) return null

  return (
    <section className="orbital-mobile" aria-label="Орбітальна навігація">
      <div className="orbital-mobile__stage" ref={stageRef} style={{ height: `${stageHeight}px` }}>
        <svg
          className="orbital-mobile__overlay"
          width={stageWidth}
          height={stageHeight}
          viewBox={`0 0 ${stageWidth} ${stageHeight}`}
          aria-hidden="true"
        >
          <path
            d={`M ${orbitCenter.x - orbitRadius} ${orbitCenter.y} A ${orbitRadius} ${orbitRadius} 0 0 1 ${orbitCenter.x + orbitRadius} ${orbitCenter.y}`}
            className="orbital-mobile__arc"
          />
          <path
            d={tetherPath}
            className="orbital-mobile__tether"
            style={{ opacity: isDragging ? 0.08 : 1 }}
          />
        </svg>

        <div className="orbital-mobile__hub">
          {hubIconColor ? (
            <span
              className="orbital-mobile__hub-icon orbital-mobile__hub-icon--mask"
              aria-hidden="true"
              style={
                {
                  '--icon-url': `url("${hubIcon}")`,
                  '--icon-color': hubIconColor,
                } as React.CSSProperties
              }
            />
          ) : (
            <img className="orbital-mobile__hub-icon" src={hubIcon} alt="" />
          )}
        </div>

        <div
          className="orbital-mobile__drag-layer"
          onPointerDown={(event) => {
            dragStateRef.current.active = true
            dragStateRef.current.lastX = event.clientX
            setIsDragging(true)
            if (animationFrameRef.current !== null) {
              cancelAnimationFrame(animationFrameRef.current)
              animationFrameRef.current = null
            }
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            if (!dragStateRef.current.active) return
            const deltaX = event.clientX - dragStateRef.current.lastX
            dragStateRef.current.lastX = event.clientX
            const next = rotationRef.current + deltaX * 0.33
            rotationRef.current = next
            setRotationDeg(next)
          }}
          onPointerUp={() => {
            if (!dragStateRef.current.active) return
            dragStateRef.current.active = false
            setIsDragging(false)
            animateToIndex(getClosestIndex(baseAngles, rotationRef.current), true)
          }}
          onPointerCancel={() => {
            if (!dragStateRef.current.active) return
            dragStateRef.current.active = false
            setIsDragging(false)
            animateToIndex(getClosestIndex(baseAngles, rotationRef.current), true)
          }}
        >
          {safeItems.map((item, idx) => {
            const point = points[idx]
            const isActive = idx === visualActiveIndex
            const iconColor = itemColors?.[idx] ?? null
            const ringColor = iconColor ?? '#b57aff'

            return (
              <button
                key={item.id}
                type="button"
                className={`orbital-mobile__item ${isActive ? 'is-active' : ''}`}
                style={
                  {
                    left: `${point.x}px`,
                    top: `${point.y}px`,
                    '--ring-color': ringColor,
                  } as React.CSSProperties
                }
                onClick={() => {
                  setIsDragging(false)
                  animateToIndex(idx, true)
                }}
                aria-label={item.bullets[0]}
              >
                {iconColor ? (
                  <span
                    className="orbital-mobile__item-icon orbital-mobile__item-icon--mask"
                    aria-hidden="true"
                    style={
                      {
                        '--icon-url': `url("${item.thumb}")`,
                        '--icon-color': iconColor,
                      } as React.CSSProperties
                    }
                  />
                ) : (
                  <img className="orbital-mobile__item-icon" src={item.thumb} alt="" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <p className="orbital-mobile__active-label">{activeLabel}</p>
    </section>
  )
}

export default OrbitalStationMobile
