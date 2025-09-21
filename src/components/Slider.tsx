import { useState, useRef } from 'react'
import './Slider.scss'

interface Slide {
  id: number
  title: string
  src: string
  innerText: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'UI/UX Design',
    src: 'public/card-template.png',
    innerText: '',
  },
  {
    id: 2,
    title: 'App and Web Development',
    src: 'public/card-template.png',
    innerText: '',
  },
  {
    id: 3,
    title: 'Brand Design',
    src: 'public/card-template.png',
    innerText: '',
  },
  {
    id: 4,
    title: 'Content Strategy',
    src: 'public/card-template.png',
    innerText: '',
  },
]

export default function Slider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const prevIndexRef = useRef<number>(0)

  const goTo = (index: number) => {
    if (index === activeIndex || rafRef.current) return

    const prevIndex = activeIndex
    prevIndexRef.current = prevIndex
    setIncomingIndex(index)

    const duration = 500 // ms
    const start = performance.now()

    const animate = (time: number) => {
      const t = Math.min((time - start) / duration, 1)
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // easeInOutQuad

      // оновлюємо CSS-перемінні для плавного стеку
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
    <div className="slider">
      <div className="slides" aria-hidden={false}>
        {slides.map((slide, i) => {
          const stackOffset = i * 6
          const isActive = i === activeIndex
          const isIncoming = i === incomingIndex
          const zIndex = isActive ? 2000 : isIncoming ? 1500 : 100

          const style: React.CSSProperties = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ['--stack-y' as any]: `${stackOffset}px`,
            zIndex,
          }

          const classes = [
            'slide',
            isActive ? 'slide--active' : '',
            isIncoming ? 'incoming' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={slide.id}
              className={classes}
              style={style}
              aria-hidden={!isActive}
            >
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
  )
}
