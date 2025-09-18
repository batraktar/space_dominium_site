import { useState } from 'react'
import './Slider.scss'

const slides = [
  { id: 1, title: 'UI/UX Design', src: 'public/card-template.png' },
  {
    id: 2,
    title: 'App and Web Development',
    src: 'public/card-template.png',
  },
  { id: 3, title: 'Brand Design', src: 'public/card-template.png' },
  { id: 4, title: 'Content Strategy', src: 'public/card-template.png' },
]

export default function Slider() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="slider">
      <img className="slide" src={slides[activeIndex].src} alt="" />

      <div className="pagination">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === activeIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="menu">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            className={`menu-item ${i === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(i)}
          >
            {slide.title}
          </button>
        ))}
      </div>
    </div>
  )
}
