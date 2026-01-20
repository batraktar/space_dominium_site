import React, { useEffect, useRef, useState } from 'react'
import arrowsGraphic from '../../../assets/img/design/Графічні елементи_design-41.svg'
import styles from './floating-shapes.module.scss'

type Shape = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  size: number
}

const FloatingShapes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shapes, setShapes] = useState<Shape[]>([])
  const requestRef = useRef<number | undefined>(undefined)
  const boundsRef = useRef({ maxX: 95, maxY: 95 })
  const shapeSize = 200

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const count = 8
    const minDistance = 18 // percent
    const maxAttempts = 40
    const positions: Array<{ x: number; y: number }> = []

    const getBounds = () => {
      const rect = container.getBoundingClientRect()
      if (!rect.width || !rect.height) return { maxX: 95, maxY: 95 }
      const maxX = Math.max(0, 100 - (shapeSize / rect.width) * 100)
      const maxY = Math.max(0, 100 - (shapeSize / rect.height) * 100)
      return { maxX, maxY }
    }

    const { maxX, maxY } = getBounds()
    boundsRef.current = { maxX, maxY }

    for (let i = 0; i < count; i += 1) {
      let placed = false
      let candidate = { x: 0, y: 0 }

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const x = Math.random() * maxX
        const y = Math.random() * maxY
        const isFarEnough = positions.every((pos) => {
          const dx = pos.x - x
          const dy = pos.y - y
          return Math.hypot(dx, dy) >= minDistance
        })

        if (isFarEnough) {
          candidate = { x, y }
          placed = true
          break
        }
      }

      if (!placed) {
        candidate = { x: Math.random() * maxX, y: Math.random() * maxY }
      }

      positions.push(candidate)
    }

    const initialShapes: Shape[] = positions.map((pos, i) => ({
      id: i,
      x: pos.x,
      y: pos.y,
      vx: (Math.random() - 0.5) * 0.15, // velocity
      vy: (Math.random() - 0.5) * 0.15,
      rotation: 0,
      size: shapeSize,
    }))
    setShapes(initialShapes)

    const ro = new ResizeObserver(() => {
      boundsRef.current = getBounds()
    })
    ro.observe(container)

    return () => {
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    const animate = () => {
      setShapes((prevShapes) =>
        prevShapes.map((shape) => {
          const { maxX, maxY } = boundsRef.current
          let { x, y, vx, vy } = shape

          x += vx
          y += vy

          // Bounce logic (using percentage 0-100)
          if (x <= 0 || x >= maxX) vx = -vx
          if (y <= 0 || y >= maxY) vy = -vy

          x = Math.max(0, Math.min(x, maxX))
          y = Math.max(0, Math.min(y, maxY))

          return { ...shape, x, y, vx, vy }
        }),
      )
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current!)
  }, [])

  return (
    <div className={styles.floating_container} ref={containerRef}>
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={styles.shape}
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            transform: `rotate(${shape.rotation}deg)`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
          }}
        >
          <img src={arrowsGraphic} alt="" className={styles.shape__icon} />
        </div>
      ))}
    </div>
  )
}

export default FloatingShapes
