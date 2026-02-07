import React from 'react'
import Bubbles from '../../../shared/ui/contact-button/Bubbles'
import DotsBg from '../../../shared/ui/contact-button/DotsBg'
import FloatingShapes from '../../../shared/ui/floating-shapes/FloatingShapes'
import styles from './hero.module.scss'

const HeroSection: React.FC = () => {
  return (
    <section className={styles.hero}>
      <DotsBg bgColor="#A88AED" dotColor="rgba(255,255,255,.5)" className={styles.heroDots}>
        <FloatingShapes />
        <Bubbles
          bubbleContent={{
            b1: 'Логотипи',
            b2: 'Айдентика',
            b3: 'Веб-дизайн',
            b4: 'Типографія',
            b5: 'Упаковка',
          }}
        />
      </DotsBg>
      <div className={styles.heroSeparator} aria-hidden>
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none">
          <path d="M0 0 L1440 0 L720 300 Z" />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
