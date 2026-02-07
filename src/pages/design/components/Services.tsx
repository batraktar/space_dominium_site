import React, { useEffect, useRef, useState } from 'react'
import styles from './services.module.scss'
import lineGraphic from '../../../assets/img/design/line.svg'
import BouncingBallsPhysics from '../../../shared/ui/physics/BouncingBallsPhysics'

type LineDecor = {
  id: string
  top: { desktop: number; tablet: number; mobile: number }
  width: { desktop: number; tablet: number; mobile: number }
  rotate: number
  left?: { desktop: number; tablet: number; mobile: number }
  right?: { desktop: number; tablet: number; mobile: number }
}

const DESKTOP_BP = 1440
const TABLET_BP = 768
const MOBILE_BP = 375

const fluidClamp3 = (desktop: number, tablet: number, mobile: number) => {
  const desktopRange = DESKTOP_BP - TABLET_BP
  const mobileRange = TABLET_BP - MOBILE_BP

  return `calc(
    clamp(${tablet}px, calc(${tablet}px + (${desktop - tablet}) * ((100vw - ${TABLET_BP}px) / ${desktopRange})), ${desktop}px)
    +
    clamp(${mobile}px, calc(${mobile}px + (${tablet - mobile}) * ((100vw - ${MOBILE_BP}px) / ${mobileRange})), ${tablet}px)
    -
    ${tablet}px
  )`
}

const useIsMobile = (maxWidth = TABLET_BP) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia(`(max-width: ${maxWidth}px)`)
    const update = () => setIsMobile(media.matches)
    update()

    if (media.addEventListener) {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }

    media.addListener(update)
    return () => media.removeListener(update)
  }, [maxWidth])

  return isMobile
}

const lines: LineDecor[] = [
  {
    id: 'l1',
    top: { desktop: 60, tablet: 92, mobile: 70 },
    left: { desktop: 90, tablet: 48, mobile: 18 },
    width: { desktop: 660, tablet: 352, mobile: 380 },
    rotate: 5,
  },
  {
    id: 'l2',
    top: { desktop: 650, tablet: 580, mobile: 400 },
    right: { desktop: 120, tablet: 64, mobile: 20 },
    width: { desktop: 660, tablet: 300, mobile: 290 },
    rotate: -30,
  },
  {
    id: 'l3',
    top: { desktop: 690, tablet: 880, mobile: 420 },
    left: { desktop: 90, tablet: 48, mobile: 14 },
    width: { desktop: 660, tablet: 320, mobile: 220 },
    rotate: 5,
  },
  {
    id: 'l4',
    top: { desktop: 1250, tablet: 1307, mobile: 815 },
    right: { desktop: 130, tablet: 69, mobile: 160 },
    width: { desktop: 560, tablet: 299, mobile: 198 },
    rotate: -40,
  },
]

const Services: React.FC = () => {
  const wrapperRef = useRef<HTMLElement | null>(null)
  const isMobile = useIsMobile(TABLET_BP)

  return (
    <section className={styles.services} ref={wrapperRef}>
      <BouncingBallsPhysics wrapperRef={wrapperRef} />

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
                top: isMobile
                  ? `${line.top.mobile}px`
                  : fluidClamp3(line.top.desktop, line.top.tablet, line.top.mobile),
                width: isMobile
                  ? `${line.width.mobile}px`
                  : fluidClamp3(line.width.desktop, line.width.tablet, line.width.mobile),
                ...(line.left
                  ? {
                      left: isMobile
                        ? `${line.left.mobile}px`
                        : fluidClamp3(line.left.desktop, line.left.tablet, line.left.mobile),
                    }
                  : {}),
                ...(line.right
                  ? {
                      right: isMobile
                        ? `${line.right.mobile}px`
                        : fluidClamp3(line.right.desktop, line.right.tablet, line.right.mobile),
                    }
                  : {}),
                transform: `rotate(${line.rotate}deg)`,
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
