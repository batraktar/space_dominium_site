import React from 'react'
import styles from './cards.module.scss'

export type CardItem = {
  text: string
  name: string
  role: string
}

type Props = {
  items?: CardItem[]
  initialIndex?: number
}

const defaultItems: CardItem[] = [
  {
    text:
      'DesignFlow Studio is a passionate creative team that helps businesses of all sizes communicate their ideas through modern and memorable design services. We focus on delivering unique brand experiences, strong branding concepts, and visual identities that explore innovation. Our work includes everything from logo and identity design to full website and mobile app interfaces, marketing campaigns, product presentations, and custom illustrations. We approach every project with deep research, strategic thinking, and a commitment to detail.',
    name: 'ANTON PLYUPIUK',
    role: 'SENIOR CREATIVE PRODUCER',
  },
  {
    text:
      'We believe design is more than aesthetics. It is a tool that connects brands with people and drives growth by combining creativity and functionality. Our process balances strategy, clarity, and visual storytelling to help your product stand out.',
    name: 'IRYNA K.',
    role: 'LEAD BRAND DESIGNER',
  },
  {
    text:
      'From early discovery to final delivery, we build systems that scale: logos, brand guidelines, packaging, and digital experiences that feel cohesive and memorable across every touchpoint.',
    name: 'OLEKSII H.',
    role: 'ART DIRECTOR',
  },
  {
    text:
      'Great design should be useful, honest, and modern. We translate complex ideas into clear visuals, ensuring every detail supports your business goals.',
    name: 'MARIA D.',
    role: 'SENIOR UX/UI DESIGNER',
  },
]

const Cards: React.FC<Props> = ({ items = defaultItems, initialIndex = 0 }) => {
  const safeItems = items.length ? items : defaultItems
  const [activeIndex, setActiveIndex] = React.useState(() =>
    Math.min(Math.max(initialIndex, 0), safeItems.length - 1),
  )

  React.useEffect(() => {
    if (activeIndex >= safeItems.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, safeItems.length])

  const total = safeItems.length
  const active = safeItems[activeIndex]
  const canCycle = total > 1
  const hasPrev = activeIndex > 0
  const hasNext = activeIndex < total - 1

  const handlePrev = () => {
    if (!hasPrev) return
    setActiveIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    if (!hasNext) return
    setActiveIndex((prev) => Math.min(prev + 1, total - 1))
  }

  const stackClass =
    total <= 1
      ? styles.cards__stackSingle
      : total === 2
        ? styles.cards__stackDouble
        : ''

  return (
    <section className={styles.cards}>
      <div className={styles.cards__inner}>
        <div className={`${styles.cards__stack} ${stackClass}`}>
          <div className={styles.cards__viewport}>
            <div
              className={styles.cards__track}
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {safeItems.map((item, idx) => (
                <article className={styles.card} key={`${item.name}-${idx}`}>
                  <p className={styles.card__text}>{item.text}</p>

                  <div className={styles.card__footer}>
                    <div className={styles.card__author}>
                      <span className={styles.card__name}>{item.name}</span>
                      <span className={styles.card__role}>{item.role}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {canCycle && (
            <>
              {hasPrev && (
                <button
                  className={`${styles.cards__arrow} ${styles.cards__arrowLeft}`}
                  type="button"
                  aria-label="Previous card"
                  onClick={handlePrev}
                >
                  <svg viewBox="0 0 20 20" aria-hidden>
                    <path
                      d="M16 10H5.2l4.6-4.6L8.4 4l-7 7 7 7 1.4-1.4-4.6-4.6H16z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              )}
              {hasNext && (
                <button
                  className={`${styles.cards__arrow} ${styles.cards__arrowRight}`}
                  type="button"
                  aria-label="Next card"
                  onClick={handleNext}
                >
                  <svg viewBox="0 0 20 20" aria-hidden>
                    <path
                      d="M4 10h10.8l-4.6-4.6L11.6 4l7 7-7 7-1.4-1.4 4.6-4.6H4z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>

        {canCycle && (
          <div className={styles.cards__nav}>
            {safeItems.map((item, idx) => (
              <button
                key={`${item.name}-${idx}`}
                type="button"
                className={`${styles.cards__dot} ${idx === activeIndex ? styles.cards__dotActive : ''}`}
                aria-label={`Show card ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Cards
