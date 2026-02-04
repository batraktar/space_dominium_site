import { useState, useRef } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import './Slider.scss'
import cardWeb from '../../../assets/img/cards-main/WD.svg'
import cardBrand from '../../../assets/img/cards-main/BD_pearl.svg'
import cardContent from '../../../assets/img/cards-main/CS.svg'

interface Slide {
  id: number
  title: string
  src: string
  innerText: string
  to: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Веб-розробка',
    src: cardWeb,
    innerText:
      'Створюємо адаптивні сайти та веб-застосунки, що працюють швидко й виглядають сучасно.',
    to: '/web-develop',
  },
  {
    id: 2,
    title: 'Бренд-дизайн',
    src: cardBrand,
    innerText: 'Айдентика, що запам’ятовується: від логотипу до презентацій та упаковки.',
    to: '/design',
  },
  {
    id: 3,
    title: 'Контент-стратегія',
    src: cardContent,
    innerText: 'Контент-плани, копірайт та продакшн, які підживлюють ваші продажі й ком’юніті.',
    to: '/smm',
  },
]

export default function Slider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const ignoreClickRef = useRef(false)
  const swipeLockRef = useRef(false)

  const goTo = (index: number) => {
    if (index === activeIndex || rafRef.current) return

    const prevIndex = activeIndex
    setIncomingIndex(index)

    const duration = 500 // ms
    const start = performance.now()

    const animate = (time: number) => {
      const t = Math.min((time - start) / duration, 1)
      const ease = t < 0.5 ? 2 * t * t : 2 + (4 - 2 * t) * t // easeInOutQuad

      document.documentElement.style.setProperty('--prev-stack', `${prevIndex * 6 + ease * 20}px`)
      document.documentElement.style.setProperty('--next-stack', `${index * 6 - ease * 20}px`)

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

  const goPrev = () => {
    const nextIndex = (activeIndex - 1 + slides.length) % slides.length
    goTo(nextIndex)
  }

  const goNext = () => {
    const nextIndex = (activeIndex + 1) % slides.length
    goTo(nextIndex)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
    swipeLockRef.current = false
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const touch = event.touches[0]
    const deltaX = touch.clientX - touchStartX.current
    const deltaY = touch.clientY - touchStartY.current

    if (!swipeLockRef.current && Math.abs(deltaX) > 6) {
      swipeLockRef.current = true
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        event.preventDefault()
      }
    }
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStartX.current
    const deltaY = touch.clientY - touchStartY.current

    touchStartX.current = null
    touchStartY.current = null
    swipeLockRef.current = false

    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return
    }

    ignoreClickRef.current = true
    if (deltaX > 0) {
      goPrev()
    } else {
      goNext()
    }
  }

  return (
    <section className="slider-wrapper">
      <div className="slider">
        <div
          className="slides"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, i) => {
            const isActive = i === activeIndex
            const isIncoming = i === incomingIndex

            const style: CSSProperties = {
              ['--stack-y' as string]: `${i * 6}px`,
              zIndex: isActive ? 2000 : isIncoming ? 1500 : 100,
            }

            const classes = ['slide', isActive ? 'slide--active' : '', isIncoming ? 'incoming' : '']
              .filter(Boolean)
              .join(' ')

            return (
              <Link
                key={slide.id}
                className={classes}
                style={{
                  ...style,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
                to={slide.to}
                aria-label={`Перейти до сторінки: ${slide.title}`}
                onClick={(event) => {
                  if (ignoreClickRef.current) {
                    event.preventDefault()
                    ignoreClickRef.current = false
                  }
                }}
              >
                <div className="slide__picture">
                  <img src={slide.src} alt={slide.title} decoding="async" />
                </div>
                <div className="slide__body">
                  <h3 className="slide__title">{slide.title}</h3>
                  <p className="slide__innerText">{slide.innerText}</p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="pagination">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Перейти до слайду ${i + 1}`}
              aria-current={i === activeIndex ? 'true' : undefined}
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
