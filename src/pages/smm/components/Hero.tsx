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
      <div className={styles.heroInner}>
        <div className={styles.content}>
          <h1 className={styles.title}>SMM SPACE</h1>
          <p className={styles.subtitle}>
            Тут ваш бренд нарешті перестане бути тінню в соцмережах. Робимо візуал, слова й меми,
            щоб про вас таки заговорили - і бажано добре.
          </p>

          <div className={styles.actions}>
            <a className={styles.cta} href="#contact">
              хочу так само <span className={styles.ctaArrow}>→</span>
            </a>

            <div className={styles.socials} aria-label="Соціальні мережі">
              <a className={styles.social} href="https://space.dominium.com.ua" aria-label="Facebook">
                <img src={fbIcon} alt="" />
              </a>
              <a className={styles.social} href="https://space.dominium.com.ua" aria-label="TikTok">
                <img src={ttIcon} alt="" />
              </a>
              <a className={styles.social} href="https://space.dominium.com.ua" aria-label="Email">
                <img src={mailIcon} alt="" />
              </a>
              <a className={styles.social} href="https://space.dominium.com.ua" aria-label="Instagram">
                <img src={instIcon} alt="" />
              </a>
              <a className={styles.social} href="https://space.dominium.com.ua" aria-label="YouTube">
                <img src={ytIcon} alt="" />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.logoWrap} aria-hidden>
          <img src={heroLogo} alt="" className={styles.logo} />
        </div>
      </div>
    </section>
  )
}

export default Hero
