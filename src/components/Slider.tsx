import { useState, useRef } from 'react'
import type { CSSProperties } from 'react'
import './Slider.scss'
import cardWeb from '../assets/img/cards-main/Design_Cards_Space Dominium_Монтажна область 1.svg'
import cardBrand from '../assets/img/cards-main/Design_Cards_Space Dominium-02.png'
import cardContent from '../assets/img/cards-main/Design_Cards_Space Dominium-03.png'

interface Slide {
  id: number
  title: string
  src: string
  innerText: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Веб-розробка',
    src: cardWeb,
    innerText:
      'Створюємо адаптивні сайти та веб-застосунки, що працюють швидко й виглядають сучасно.',
  },
  {
    id: 2,
    title: 'Бренд-дизайн',
    src: cardBrand,
    innerText:
      'Айдентика, що запам’ятовується: від логотипу до презентацій та упаковки.',
  },
  {
    id: 3,
    title: 'Контент-стратегія',
    src: cardContent,
    innerText:
      'Контент-плани, копірайт та продакшн, які підживлюють ваші продажі й ком’юніті.',
  },
]

export default function Slider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const goTo = (index: number) => {
    if (index === activeIndex || rafRef.current) return

    const prevIndex = activeIndex
    setIncomingIndex(index)

    const duration = 500 // ms
    const start = performance.now()

    const animate = (time: number) => {
      const t = Math.min((time - start) / duration, 1)
      const ease = t < 0.5 ? 2 * t * t : 2 + (4 - 2 * t) * t // easeInOutQuad

      document.documentElement.style.setProperty(
        '--prev-stack',
        `${prevIndex * 6 + ease * 20}px`
      )
      document.documentElement.style.setProperty(
        '--next-stack',
        `${index * 6 - ease * 20}px`
      )

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setActiveIndex(index)
        setIncomingIndex(null)
        rafRef.current = null
        document.documentElement.style.removeProperty('--prev-stack')
        document.documentElement.style.removeProperty('--next-stack')
      }
    }

    rafRef.current = requestAnimationFrame(animate)
  }

  return (
    <section className="slider-wrapper">
      <div className="slider">
        <div className="slides">
        {slides.map((slide, i) => {
          const isActive = i === activeIndex
          const isIncoming = i === incomingIndex

          const style: CSSProperties = {
            ['--stack-y' as string]: `${i * 6}px`,
            zIndex: isActive ? 2000 : isIncoming ? 1500 : 100,
          }

          const classes = [
            'slide',
            isActive ? 'slide--active' : '',
            isIncoming ? 'incoming' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div key={slide.id} className={classes} style={style}>
              <div className="slide__picture">
                <img src={slide.src} alt={slide.title} />
              </div>
              <div className="slide__body">
                <h3 className="slide__title">{slide.title}</h3>
                <p className="slide__innerText">{slide.innerText}</p>
              </div>
            </div>
          )
        })}
      </div>

        <div className="pagination">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

        <div className="menu">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            className={`menu-item ${i === activeIndex ? 'active' : ''}`}
            onClick={() => goTo(i)}
          >
            {slide.title}
          </button>
        ))}
        </div>
      </div>
    </section>
  )
}
