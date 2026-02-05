import React from 'react'
import heroLogo from '../../../assets/img/smm/hero-logo.svg'
import fbIcon from '../../../assets/img/smm/fb.svg'
import ttIcon from '../../../assets/img/smm/tt.svg'
import mailIcon from '../../../assets/img/smm/mail.svg'
import instIcon from '../../../assets/img/smm/inst.svg'
import ytIcon from '../../../assets/img/smm/yt.svg'
import styles from './hero.module.scss'

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__inner}>
        <div className={styles.hero__content}>
          <h1 className={styles.hero__title}>SMM SPACE</h1>
          <p className={styles.hero__subtitle}>
            Тут ваш бренд нарешті перестане бути тінню в соцмережах. Робимо візуал, слова й меми,
            щоб про вас таки заговорили - і бажано добре.
          </p>

          <div className={styles.hero__actions}>
            <a className={styles.hero__cta} href="#contact">
              хочу так само <span className={styles.hero__ctaArrow}>→</span>
            </a>

            <div className={styles.hero__socials} aria-label="Соціальні мережі">
              <a className={styles.hero__social} href="https://space.dominium.com.ua" aria-label="Facebook">
                <img src={fbIcon} alt="" />
              </a>
              <a className={styles.hero__social} href="https://space.dominium.com.ua" aria-label="TikTok">
                <img src={ttIcon} alt="" />
              </a>
              <a className={styles.hero__social} href="https://space.dominium.com.ua" aria-label="Email">
                <img src={mailIcon} alt="" />
              </a>
              <a className={styles.hero__social} href="https://space.dominium.com.ua" aria-label="Instagram">
                <img src={instIcon} alt="" />
              </a>
              <a className={styles.hero__social} href="https://space.dominium.com.ua" aria-label="YouTube">
                <img src={ytIcon} alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.hero__logoWrap} aria-hidden>
        <img src={heroLogo} alt="" className={styles.hero__logo} />
      </div>
    </section>
  )
}

export default Hero
