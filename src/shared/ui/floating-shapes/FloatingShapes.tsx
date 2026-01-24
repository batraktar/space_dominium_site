import React, { useEffect, useRef, useState } from 'react'
// import arrowsGraphic from '../../../assets/img/design/Графічні елементи_design-41.svg'
import aiIcon from '../../../assets/img/design/ai-svgrepo-com.svg'
import photoshopIcon from '../../../assets/img/design/photoshop-svgrepo-com.svg'
import pinterestIcon from '../../../assets/img/design/pinterest-color-svgrepo-com.svg'
import instagramIcon from '../../../assets/img/design/instagram-svgrepo-com.svg'
import canvaIcon from '../../../assets/img/design/canva-svgrepo-com.svg'
import styles from './floating-shapes.module.scss'

type Shape = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  size: number
  icon: string
}

const FloatingShapes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shapes, setShapes] = useState<Shape[]>([])
  const requestRef = useRef<number | undefined>(undefined)
  const boundsRef = useRef({ maxX: 95, maxY: 95, width: 0, height: 0 })
  const shapeSize = 72
  const icons = [aiIcon, photoshopIcon, pinterestIcon, instagramIcon, canvaIcon]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const count = 8
    const minDistance = 18 // percent fallback
    const maxAttempts = 40
    const positions: Array<{ x: number; y: number }> = []

    const getBounds = () => {
      const rect = container.getBoundingClientRect()
      if (!rect.width || !rect.height) {
        return { maxX: 95, maxY: 95, width: 0, height: 0 }
      }
      const maxX = Math.max(0, 100 - (shapeSize / rect.width) * 100)
      const maxY = Math.max(0, 100 - (shapeSize / rect.height) * 100)
      return { maxX, maxY, width: rect.width, height: rect.height }
    }

    const { maxX, maxY, width, height } = getBounds()
    boundsRef.current = { maxX, maxY, width, height }
    const sizePct = width && height ? Math.max((shapeSize / width) * 100, (shapeSize / height) * 100) : minDistance
    const spacedMinDistance = sizePct * 1.2

    for (let i = 0; i < count; i += 1) {
      let placed = false
      let candidate = { x: 0, y: 0 }

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const x = Math.random() * maxX
        const y = Math.random() * maxY
        const isFarEnough = positions.every((pos) => {
          const dx = pos.x - x
          const dy = pos.y - y
          return Math.hypot(dx, dy) >= spacedMinDistance
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
      icon: icons[i % icons.length],
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
      setShapes((prevShapes) => {
        const next = prevShapes.map((shape) => ({ ...shape }))
        const { maxX, maxY, width, height } = boundsRef.current
        if (!width || !height) return next

        next.forEach((shape) => {
          shape.x += shape.vx
          shape.y += shape.vy

          if (shape.x <= 0 || shape.x >= maxX) shape.vx = -shape.vx
          if (shape.y <= 0 || shape.y >= maxY) shape.vy = -shape.vy

          shape.x = Math.max(0, Math.min(shape.x, maxX))
          shape.y = Math.max(0, Math.min(shape.y, maxY))
        })

        const radius = shapeSize / 2
        for (let i = 0; i < next.length; i += 1) {
          for (let j = i + 1; j < next.length; j += 1) {
            const a = next[i]
            const b = next[j]

            const ax = (a.x / 100) * width + radius
            const ay = (a.y / 100) * height + radius
            const bx = (b.x / 100) * width + radius
            const by = (b.y / 100) * height + radius

            const dx = bx - ax
            const dy = by - ay
            const dist = Math.hypot(dx, dy)
            const minDist = shapeSize

            if (dist > 0 && dist < minDist) {
              const overlap = (minDist - dist) / 2
              const nx = dx / dist
              const ny = dy / dist

              const axNew = ax - nx * overlap
              const ayNew = ay - ny * overlap
              const bxNew = bx + nx * overlap
              const byNew = by + ny * overlap

              a.x = ((axNew - radius) / width) * 100
              a.y = ((ayNew - radius) / height) * 100
              b.x = ((bxNew - radius) / width) * 100
              b.y = ((byNew - radius) / height) * 100

              const tmpVx = a.vx
              const tmpVy = a.vy
              a.vx = b.vx
              a.vy = b.vy
              b.vx = tmpVx
              b.vy = tmpVy
            }
          }
        }

        next.forEach((shape) => {
          shape.x = Math.max(0, Math.min(shape.x, maxX))
          shape.y = Math.max(0, Math.min(shape.y, maxY))
        })

        return next
      })
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
          <img src={shape.icon} alt="" className={styles.shape__icon} />
        </div>
      ))}
    </div>
  )
}

export default FloatingShapes
