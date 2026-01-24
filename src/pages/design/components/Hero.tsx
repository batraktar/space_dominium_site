import React from 'react'
import designLogo from '../../../assets/img/design/logo-without-sign.png'
import designTriangle from '../../../assets/img/design/design-triangle.png'
import heroArrow from '../../../assets/img/design/arrow+border.svg'
import styles from './hero.module.scss'

const Hero: React.FC = () => {
  return (
    <div className={styles.heroTop}>
      <div className={styles.heroTopInner}>
        <div className={styles.heroCopy}>
          <span className={styles.heroTitle}>DESIGN</span>
          <a className={styles.heroCta} href="#contact">
            почати співпрацю
            <img src={heroArrow} alt="" className={styles.heroCtaIcon} />
          </a>
        </div>
        <div className={styles.heroMark}>
          <img src={designTriangle} alt="" className={styles.heroTriangle} />
          <img src={designLogo} alt="Space Dominium" className={styles.heroLogo} />
        </div>
      </div>
    </div>
  )
}

export default Hero
