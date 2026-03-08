import React from 'react'
import designLogo from '../../../assets/img/design/logo-without-sign.png'
import designTriangle from '../../../assets/img/design/design-triangle.png'
import styles from './hero.module.scss'

type HeroProps = {
  ctaArrowColor?: string
}

const Hero: React.FC<HeroProps> = ({ ctaArrowColor }) => {
  type HeroCssVars = React.CSSProperties & {
    '--hero-cta-arrow-color'?: string
  }

  const heroStyle: HeroCssVars = {
    ...(ctaArrowColor ? { '--hero-cta-arrow-color': ctaArrowColor } : {}),
  }

  return (
    <div
      className={styles.heroTop}
      style={heroStyle}
    >
      <div className={styles.heroTopInner}>
        <div className={styles.heroCopy}>
          <span className={styles.heroTitle}>DESIGN</span>
          <a className={styles.heroCta} href="#contact">
            почати співпрацю
            <span className={styles.heroCtaIcon} aria-hidden>
              <svg
                width="53"
                height="26"
                viewBox="0 0 53 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0.5" y="0.5" width="52" height="25" rx="12.5" stroke="#000000" />
                <path
                  d="M17.9925 11.4815C17.4444 11.4815 17 11.9375 17 12.5C17 13.0625 17.4444 13.5185 17.9925 13.5185V11.4815ZM35.7093 13.2202C36.0969 12.8224 36.0969 12.1776 35.7093 11.7798L29.3929 5.2983C29.0052 4.90057 28.3768 4.90057 27.9892 5.2983C27.6016 5.69604 27.6016 6.3409 27.9892 6.73864L33.6039 12.5L27.9892 18.2613C27.6016 18.6591 27.6016 19.304 27.9892 19.7017C28.3768 20.0994 29.0052 20.0994 29.3929 19.7017L35.7093 13.2202ZM17.9925 13.5185H35.0075V11.4815H17.9925V13.5185Z"
                  fill="currentColor"
                />
              </svg>
            </span>
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
