import ServiceLayout from '../../shared/layout/ServiceLayout'
import Bubbles from '../../shared/ui/contact-button/Bubbles'
import DotsBg from '../../shared/ui/contact-button/DotsBg'
import FloatingShapes from '../../shared/ui/floating-shapes/FloatingShapes'
import designLogo from '../../assets/img/design/logo-without-sign.png'
import designTriangle from '../../assets/img/design/design-triangle.png'
import heroArrow from '../../assets/img/design/arrow+border.svg'

import Quote from './components/Quote'
import Cards from './components/Cards'
import Services from './components/Services'
import styles from './design.module.scss'

function Design() {
  return (
    <ServiceLayout
      className="wrapper"
      hero={
        <section className={styles.hero}>
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
          <DotsBg bgColor="#A88AED" dotColor="rgba(255,255,255,.5)" className={styles.heroDots}>
            <FloatingShapes />
            <Bubbles
              bubbleContent={{
                b1: 'Логотипи',
                b2: 'Айдентика',
                b3: 'Веб-дизайн',
                b4: 'Типографія',
                b5: 'Упаковка',
                // b6..b10 з'являться на 1024-му брейкпоінті
              }}
            />
          </DotsBg>
          <div className={styles.heroSeparator} aria-hidden>
            <svg viewBox="0 0 1440 300" preserveAspectRatio="none">
              <path d="M0 0 L1440 0 L720 300 Z" />
            </svg>
          </div>
        </section>
      }
      faq={{
        sheetUrl:
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=1925531033&single=true&output=csv',
        plusColor: '#B5CAFF',
        titleColor: '#B5CAFF',
      }}
      contact={{
        formBg: 'rgba(0, 0, 0, 0.10)',
        inputBorder: '#CBD83B',
        buttonBg: '#CBD83B',
      }}
      footer={{
        titleColor: '#000',
        buttonLabel: 'почати співпрацю',
        btnTextColor: '#CBD83B',
        underlineColor: '#000',
        arrowColor: '#CBD83B',
        arrowCircleColor: '#000',
      }}
    >
      <Services />
      <Cards />
    </ServiceLayout>
  )
}

export default Design
