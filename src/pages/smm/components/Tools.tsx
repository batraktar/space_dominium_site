import React from 'react'
import styles from './tools.module.scss'

// Real images from Figma
import imgSaas from '../../../assets/img/smm-tools/saas.png'
import imgAmazon from '../../../assets/img/smm-tools/amazon.png'
import imgStartup from '../../../assets/img/smm-tools/startup.png'
import imgSoftware from '../../../assets/img/smm-tools/software.png'
// import imgGraphic from '../../../assets/img/smm-tools/graphic.png'

const tools = [
  { id: 1, title: 'Креативний дизайн', img: imgSaas, variant: 'dark' },
  { id: 2, title: 'Аналітика даних', img: imgAmazon, variant: 'default' },
  { id: 3, title: 'Таргетована реклама', img: imgStartup, variant: 'dark' },
  { id: 4, title: 'ШI-рішення', img: imgSoftware, variant: 'white' },
  // { id: 5, title: 'Graphic Design', img: imgGraphic, variant: 'dark' },
]
const TRACK_SETS = 3

const Tools: React.FC = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    const speed = 0.8

    const getSetWidth = () => scrollContainer.scrollWidth / TRACK_SETS

    const normalizeLoopPosition = () => {
      const setWidth = getSetWidth()
      if (!setWidth) return

      if (scrollContainer.scrollLeft >= setWidth * 2) {
        scrollContainer.scrollLeft -= setWidth
      } else if (scrollContainer.scrollLeft <= 0) {
        scrollContainer.scrollLeft += setWidth
      }
    }

    const initMiddleSet = () => {
      const setWidth = getSetWidth()
      if (!setWidth) return
      if (scrollContainer.scrollLeft === 0) {
        scrollContainer.scrollLeft = setWidth
      }
    }

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += speed
        normalizeLoopPosition()
      }
      animationFrameId = requestAnimationFrame(scroll)
    }

    const handleScroll = () => normalizeLoopPosition()
    const handleResize = () => {
      const setWidth = getSetWidth()
      if (!setWidth) return
      const localOffset = scrollContainer.scrollLeft % setWidth
      requestAnimationFrame(() => {
        scrollContainer.scrollLeft = setWidth + localOffset
      })
    }

    initMiddleSet()
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationFrameId)
      scrollContainer.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [isPaused])

  return (
    <section className={styles.tools}>
      <div className={styles.tools__container}>
        <h2 className={styles.tools__title}>Інструменти, які ми використовуємо</h2>

        <div
          className={styles.tools__carousel}
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className={styles.tools__track}>
            {Array.from({ length: TRACK_SETS })
              .flatMap((_, setIndex) => tools.map((tool) => ({ ...tool, setIndex })))
              .map((tool, index) => (
                <div
                  key={`${tool.id}-${tool.setIndex}-${index}`}
                  className={`${styles.card} ${styles[`card--${tool.variant}`]}`}
                >
                  <div className={styles.card__image_wrapper}>
                    <img
                      src={tool.img}
                      alt={tool.title}
                      className={styles.card__image}
                      decoding="async"
                    />
                  </div>
                  <div className={styles.card__content}>
                    <h3 className={styles.card__title}>{tool.title}</h3>
                  </div>
                  <div className={styles.card__overlay}></div>
                </div>
              ))}
          </div>
        </div>

        <div className={styles.tools__footer}>
          <a href="#" className={styles.tools__btn}>
            ВСІ НАШІ ІНСТРУМЕНТИ(В ПРОЦЕСІ ФОРМУВАННЯ)
            <svg
              width="24"
              height="12"
              viewBox="0 0 24 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 6H23M23 6L18 1M23 6L18 11"
                stroke="#ffc2cb"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Tools
