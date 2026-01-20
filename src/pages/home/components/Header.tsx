import React, { useEffect, useState } from 'react'
import ContactButton from '../../../shared/ui/contact-button/ContactButton'
import LogoMenu from '../../../shared/ui/logo-menu/LogoMenu'
import { useAffix } from '../../../shared/hooks/useAffix'
import videoMp4 from '../../../assets/video/laptop_people_1920x780.mp4'
import videoWebm from '../../../assets/video/output_1920x780.webm'
import styles from './header.module.scss'

const Header: React.FC = () => {
  const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null)
  const [barEl, setBarEl] = useState<HTMLDivElement | null>(null)

  const { affixed, barHeight } = useAffix({
    triggerEl: headerEl,
    barEl,
    top: 0,
    bottomGap: 20,
  })

  useEffect(() => {
    document.documentElement.style.setProperty('--bar-h', `${barHeight || 0}px`)
  }, [barHeight])

  return (
    <>
      <header className={styles.header} ref={setHeaderEl}>
        <video className={styles.header__video} autoPlay muted loop playsInline preload="metadata">
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          <source src={videoMp4} type="video/mp4" />
        </video>

        <div
          ref={setBarEl}
          className={`${styles.header__bar} ${affixed ? styles['header__bar--fixed'] : ''}`}
        >
          <div className="header__center">
            <LogoMenu behavior="static" />
          </div>

          <div className={styles.header__right}>
            <ContactButton
              show={true}
              text="Зв’язатись ♡"
              href="#contact"
              bgColor="#A88AED"
              textColor="#000000"
            />
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
