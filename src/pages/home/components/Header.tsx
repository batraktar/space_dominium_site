import React, { useEffect, useState } from 'react'
import ContactButton from '../../../shared/ui/contact-button/ContactButton'
import LogoMenu from '../../../shared/ui/logo-menu/LogoMenu'
import videoMp4 from '../../../assets/video/laptop_people_1920x780.mp4'
import videoWebm from '../../../assets/video/output_1920x780.webm'
import styles from './header.module.scss'

const Header: React.FC = () => {
  const [barEl, setBarEl] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!barEl) return
    const update = () => {
      document.documentElement.style.setProperty(
        '--bar-h',
        `${barEl.getBoundingClientRect().height}px`,
      )
    }
    const ro = new ResizeObserver(update)
    ro.observe(barEl)
    update()
    return () => ro.disconnect()
  }, [barEl])

  return (
    <>
      <header className={styles.header}>
        <video className={styles.header__video} autoPlay muted loop playsInline preload="metadata">
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          <source src={videoMp4} type="video/mp4" />
        </video>

        <div ref={setBarEl} className={`${styles.header__bar} ${styles['header__bar--fixedBottom']}`}>
          <div className={styles.header__center}>
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
