import React, { useRef } from 'react'
import styles from './services.module.scss'
import lineGraphic from '../../../assets/img/design/line.svg'
import BouncingBallsPhysics from '../../../shared/ui/physics/BouncingBallsPhysics'

type LineDecor = {
  id: string
  top: string
  width: string
  rotate: number
  left?: string
  right?: string
}

const lines: LineDecor[] = [
  { id: 'l1', top: '60px', left: '90px', width: '660px', rotate: 5 },
  { id: 'l2', top: '650px', right: '120px', width: '660px', rotate: -30 },
  { id: 'l3', top: '690px', left: '90px', width: '660px', rotate: 5 },
  { id: 'l4', top: '1250px', right: '130px', width: '560px', rotate: -40 },
]

const Services: React.FC = () => {
  const wrapperRef = useRef<HTMLElement | null>(null)

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
                top: line.top,
                left: line.left,
                right: line.right,
                width: line.width,
                transform: `rotate(${line.rotate}deg)`,
              }}
            />
          ))}
        </div>
        <h2 className={styles.services__title}>
          Our Services &<br />
          Expertise
        </h2>

        <div className={styles.services__content}>
          <div className={styles.services__card}>
            <h3>Brand and Marketing Roadmaps</h3>
            <p>Previous or underdeveloped brand? Let's fix it for future.</p>
            <ul>
              <li>Brand Audit & Strategy</li>
              <li>Marketing & Content Strategy</li>
              <li>Communications & Campaign Strategy</li>
              <li>Managing & Tone Strategy</li>
              <li>Trend Analysis</li>
              <li>CJM Analysis & Setup</li>
              <li>SEO / Search Strategy</li>
            </ul>
          </div>

          <div className={`${styles.services__card} ${styles.services__card_right}`}>
            <h3>Brand Development</h3>
            <p>Align and evolve your brand to be noticed, felt, and remembered.</p>
            <ul>
              <li>Logo & Identity Design</li>
              <li>Brand Guidelines & Systems</li>
              <li>Naming & Verbal Identity</li>
              <li>Packaging & Print Design</li>
              <li>Art Direction</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
