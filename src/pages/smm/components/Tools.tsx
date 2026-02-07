import React from 'react'
import styles from './tools.module.scss'

// Real images from Figma
import imgSaas from '../../../assets/img/smm-tools/saas.png'
import imgAmazon from '../../../assets/img/smm-tools/amazon.png'
import imgStartup from '../../../assets/img/smm-tools/startup.png'
import imgSoftware from '../../../assets/img/smm-tools/software.png'
import imgGraphic from '../../../assets/img/smm-tools/graphic.png'

const tools = [
  { id: 1, title: 'Saas Product Design', img: imgSaas, variant: 'default' },
  { id: 2, title: 'Amazon Design', img: imgAmazon, variant: 'dark' },
  { id: 3, title: 'Startup Design', img: imgStartup, variant: 'yellow' },
  { id: 4, title: 'Software Design', img: imgSoftware, variant: 'default' },
  { id: 5, title: 'Graphic Design', img: imgGraphic, variant: 'dark' },
]

const Tools: React.FC = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    const speed = 1 // Pixels per frame

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0
        } else {
          scrollContainer.scrollLeft += speed
        }
      }
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(animationFrameId)
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
            {[...tools, ...tools, ...tools].map(
              (
                tool,
                index, // Tripled for smoother infinite loop
              ) => (
                <div
                  key={`${tool.id}-${index}`}
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
              ),
            )}
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
