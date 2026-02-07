import React, { useEffect, useState } from 'react'
import ContactButton from '../../../shared/ui/contact-button/ContactButton'
import LogoMenu from '../../../shared/ui/logo-menu/LogoMenu'
import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion'
import videoMp4 from '../../../assets/video/laptop_people_crop.mp4'
import videoMp4Mobile from '../../../assets/video/laptop_people_crop.mp4'
import videoWebm from '../../../assets/video/laptop_people_crop.mp4'
import styles from './header.module.scss'

type HeaderProps = {
  burgerColor?: string
  contactButtonBg?: string
  contactButtonTextColor?: string
}

const Header: React.FC<HeaderProps> = ({
  burgerColor,
  contactButtonBg,
  contactButtonTextColor,
}) => {
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

  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <>
      <header className={styles.header}>
        <video
          className={styles.header__video}
          autoPlay={!prefersReducedMotion}
          muted
          loop={!prefersReducedMotion}
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src={videoMp4Mobile} type="video/mp4" media="(max-width: 768px)" />
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          <source src={videoMp4} type="video/mp4" />
        </video>

        <div ref={setBarEl} className={`${styles.header__bar} ${styles['header__bar--fixedBottom']}`}>
          <div className={styles.header__center}>
            <LogoMenu behavior="static" burgerColor={burgerColor} />
          </div>

          <div className={styles.header__right}>
            <ContactButton
              show={true}
              text="Зв’язатись ♡"
              href="#contact"
              bgColor={contactButtonBg ?? '#A88AED'}
              textColor={contactButtonTextColor ?? '#000000'}
            />
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
