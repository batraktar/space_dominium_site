import React from 'react'
import decorativeGraphic from '../../../assets/img/web-dev/decorative-shapes.png'
import RobotScene from '../../../shared/three/RobotScene'
import styles from './hero.module.scss'

const Hero: React.FC = () => {
  const robotModelUrl = new URL(
    '../../../assets/img/it/model-robot-it/scene.gltf',
    import.meta.url,
  ).href

  return (
    <section className={styles.hero}>
      <div className={styles.hero__decorative}>
        <img src={decorativeGraphic} alt="" className={styles.hero__graphic} />
      </div>

      <div className={styles.hero__robot} aria-hidden>
        <RobotScene modelUrl={robotModelUrl} />
      </div>

      <div className={styles.hero__container}>
        <div className={styles.hero__content}>
          <h1 className={styles.hero__title}>IT SPACE</h1>

          <div className={styles.hero__form}>
            <p className={styles.hero__cta_text}>
              Досить гуглити інші агенції. Поговоріть з нами.
              <br />
              Напишіть прямо зараз!
            </p>

            <div className={styles.hero__inputs}>
              <input type="text" placeholder="Імʼя" className={styles.hero__input} />
              <input type="tel" placeholder="Номер телефону" className={styles.hero__input} />
            </div>

            <a className={styles.hero__submit_btn} href="#contact">
              Звʼязатись ♡
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
