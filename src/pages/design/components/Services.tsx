import React, { useEffect, useRef, useState } from 'react'
import styles from './services.module.scss'
import lineGraphic from '../../../assets/img/design/line.svg'
import BouncingBallsPhysics from '../../../shared/ui/physics/BouncingBallsPhysics'

type LineDecor = {
  id: string
  top: { desktop: number; tablet: number; mobile: number }
  width: { desktop: number; tablet: number; mobile: number }
  // Optional fine-tuning for per-breakpoint line scale/height.
  scale?: { desktop: number; tablet: number; mobile: number }
  height?: { desktop: number; tablet: number; mobile: number }
  rotate: number | { desktop: number; tablet: number; mobile: number }
  left?: { desktop: number; tablet: number; mobile: number }
  right?: { desktop: number; tablet: number; mobile: number }
}

const DESKTOP_BP = 1440
const TABLET_BP = 768
const MOBILE_BP = 375

const lerp = (from: number, to: number, t: number) => from + (to - from) * t
const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

const interpolateByViewport = (
  value: { desktop: number; tablet: number; mobile: number },
  viewportWidth: number,
) => {
  if (viewportWidth <= MOBILE_BP) return value.mobile

  if (viewportWidth <= TABLET_BP) {
    const t = clamp01((viewportWidth - MOBILE_BP) / (TABLET_BP - MOBILE_BP))
    return lerp(value.mobile, value.tablet, t)
  }

  if (viewportWidth <= DESKTOP_BP) {
    const t = clamp01((viewportWidth - TABLET_BP) / (DESKTOP_BP - TABLET_BP))
    return lerp(value.tablet, value.desktop, t)
  }

  return value.desktop
}

const adaptiveValue = (
  value: { desktop: number; tablet: number; mobile: number },
  viewportWidth: number,
  unit = 'px',
) => `${interpolateByViewport(value, viewportWidth)}${unit}`

const adaptiveRotate = (
  value: number | { desktop: number; tablet: number; mobile: number },
  viewportWidth: number,
) => `${typeof value === 'number' ? value : interpolateByViewport(value, viewportWidth)}deg`

const useViewportWidth = () => {
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window === 'undefined' ? DESKTOP_BP : window.innerWidth,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const update = () => setViewportWidth(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return viewportWidth
}

const lines: LineDecor[] = [
  {
    id: 'l1',
    top: { desktop: 60, tablet: 100, mobile: 90 },
    left: { desktop: 90, tablet: 48, mobile: 18 },
    width: { desktop: 660, tablet: 352, mobile: 180 },
    rotate: { desktop: 5, tablet: 5, mobile: 11 },
  },
  {
    id: 'l2',
    top: { desktop: 650, tablet: 750, mobile: 450 },
    right: { desktop: 120, tablet: 64, mobile: 10 },
    width: { desktop: 660, tablet: 300, mobile: 180 },
    rotate: { desktop: -30, tablet: -30, mobile: -35 },
  },
  {
    id: 'l3',
    top: { desktop: 690, tablet: 700, mobile: 500 },
    left: { desktop: 90, tablet: 48, mobile: 14 },
    width: { desktop: 660, tablet: 320, mobile: 220 },
    rotate: { desktop: 10, tablet: 10, mobile: 10 },
  },
  {
    id: 'l4',
    top: { desktop: 1350, tablet: 1250, mobile: 980 },
    right: { desktop: 130, tablet: 69, mobile: 16 },
    width: { desktop: 560, tablet: 299, mobile: 220 },
    rotate: { desktop: -40, tablet: -40, mobile: -40 },
  },
]

const ballsConfig = {
  radius: { desktop: 18, tablet: 14, mobile: 11 },
}

const Services: React.FC = () => {
  const wrapperRef = useRef<HTMLElement | null>(null)
  const viewportWidth = useViewportWidth()

  return (
    <section className={styles.services} ref={wrapperRef}>
      <BouncingBallsPhysics wrapperRef={wrapperRef} ballRadiusPx={ballsConfig.radius} />

      <div className={styles.services__container}>
        <div className={styles.services__decor} aria-hidden>
          {lines.map((line) => (
            <img
              key={line.id}
              id={line.id}
              src={lineGraphic}
              alt=""
              className={styles.services__line}
              style={{
                top: adaptiveValue(line.top, viewportWidth),
                width: adaptiveValue(line.width, viewportWidth),
                ...(line.height ? { height: adaptiveValue(line.height, viewportWidth) } : {}),
                ...(line.left
                  ? {
                      left: adaptiveValue(line.left, viewportWidth),
                    }
                  : {}),
                ...(line.right
                  ? {
                      right: adaptiveValue(line.right, viewportWidth),
                    }
                  : {}),
                transform: `rotate(${adaptiveRotate(line.rotate, viewportWidth)}) scale(${line.scale ? interpolateByViewport(line.scale, viewportWidth) : 1})`,
              }}
            />
          ))}
        </div>
        <h2 className={styles.services__title}>
          Робимо красиво, але зі змістом
        </h2>

        <div className={styles.services__content}>
          <div className={styles.services__card}>
            <h3>Спочатку думаємо, потім малюємо</h3>
            <ul>
              Дизайн має вирішувати проблему, 
              а не просто "бути гарним". 
              Ми прибираємо візуальний шум і залишаємо тільки те, 
              що реально працює. Щоб клієнт не розгадував ребуси, 
              а одразу бачив: це крутий продукт.
            </ul>
          </div>

          <div className={`${styles.services__card} ${styles.services__card_right}`}>
            <h3>Логотипчик вас не врятує</h3>
            <ul>
              Потрібен масштаб. Ми робимо так, щоб 
              ваш бренд виглядав круто на будь-якому носії: 
              чи то екран айфона, чи худі на вашому працівнику. 
              Ніяких випадкових картинок - тільки продуманий стиль.
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
