import { useState } from 'react'
import './Slider.scss'

const slides = [
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

  const goTo = (index: number) => {
    if (index === activeIndex) return

    // поставити incoming — елемент отримає клас .incoming (з translateY(-220px))
    setIncomingIndex(index)

    // через короткий тік робимо його активним — це викличе перехід incoming -> slide--active
    // timeout 20ms дає браузеру час "намалювати" початковий стан incoming
    window.setTimeout(() => {
      setActiveIndex(index)
      setIncomingIndex(null)
    }, 20)
  }

  return (
    <div className="slider">
      <div className="slides" aria-hidden={false}>
        {slides.map((slide, i) => {
          const stackOffset = i * 6 // px — відстань шарів у стеку (регулюй)
          const style: React.CSSProperties = {
            ['--stack-y' as any]: `${stackOffset}px`,
          }

          const classes = [
            'slide',
            i === activeIndex ? 'slide--active' : '',
            i === incomingIndex ? 'incoming' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={slide.id}
              className={classes}
              style={style}
              aria-hidden={i === activeIndex ? false : true}
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
