import React from 'react'
import AffixedMenuShell from '../../shared/layout/AffixedMenuShell'
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion'
import videoMp4 from '../../assets/video/laptop_people_1920x780.mp4'
import videoWebm from '../../assets/video/output_1920x780.webm'
import styles from './about.module.scss'

const About: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <AffixedMenuShell>
      <section className={styles.about}>
        <video
          className={styles.about__video}
          autoPlay={!prefersReducedMotion}
          muted
          loop={!prefersReducedMotion}
          playsInline
          preload="metadata"
          aria-hidden
        >
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          <source src={videoMp4} type="video/mp4" />
        </video>
        <div className={styles.about__overlay} aria-hidden />

        <div className={styles.about__content}>
          <span className={styles.about__kicker}>Space Dominium</span>
          <h1 className={styles.about__title}>Про нас</h1>
          <p className={styles.about__lead}>
            Тут буде короткий опис про студію, підхід, команду і цінності. Поки що це
            заповнювач, але структура вже готова.
          </p>

          <div className={styles.about__grid}>
            <div className={styles.about__card}>
              <h3>Хто ми</h3>
              <p>
                Липовий текст про команду, досвід та сильні сторони. Пізніше замінимо
                на реальні факти.
              </p>
            </div>
            <div className={styles.about__card}>
              <h3>Як працюємо</h3>
              <p>
                Липовий текст про процес, комунікацію та прозорість. Поки що для
                структури блоку.
              </p>
            </div>
            <div className={styles.about__card}>
              <h3>Що робимо</h3>
              <p>
                Липовий текст про послуги, експертизу та результат. Пізніше підставимо
                готовий контент.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AffixedMenuShell>
  )
}

export default About
