import React, { useEffect, useState } from 'react'
import ContactButton from '../../../shared/ui/contact-button/ContactButton'
import LogoMenu from '../../../shared/ui/logo-menu/LogoMenu'
import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion'
import videoMp4 from '../../../assets/video/laptop_people_crop.mp4'
import videoMp4Mobile from '../../../assets/video/laptop_people_mobile_1080p_hq.mp4'
import videoPoster from '../../../assets/video/laptop_people_poster.webp'
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
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return false
    return window.matchMedia('(max-width: 425px)').matches
  })
  const [mobileVideoEnabled, setMobileVideoEnabled] = useState(() => !isMobileViewport)

  useEffect(() => {
    if (!('matchMedia' in window)) return

    const media = window.matchMedia('(max-width: 425px)')
    const apply = (matches: boolean) => {
      setIsMobileViewport(matches)
      if (!matches) {
        setMobileVideoEnabled(true)
      }
    }

    apply(media.matches)
    const onChange = (event: MediaQueryListEvent) => apply(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!isMobileViewport) return
    if (mobileVideoEnabled) return
    if (prefersReducedMotion) return

    const enableVideo = () => {
      setMobileVideoEnabled(true)
    }

    // On small mobile screens we start video only after first user interaction
    // to keep the initial load lightweight.
    const listenerOptions: AddEventListenerOptions = { passive: true, once: true }
    window.addEventListener('touchstart', enableVideo, listenerOptions)
    window.addEventListener('pointerdown', enableVideo, listenerOptions)
    window.addEventListener('scroll', enableVideo, listenerOptions)
    window.addEventListener('keydown', enableVideo, { once: true })

    return () => {
      window.removeEventListener('touchstart', enableVideo)
      window.removeEventListener('pointerdown', enableVideo)
      window.removeEventListener('scroll', enableVideo)
      window.removeEventListener('keydown', enableVideo)
    }
  }, [isMobileViewport, mobileVideoEnabled, prefersReducedMotion])

  const shouldPlayVideo = !prefersReducedMotion && (!isMobileViewport || mobileVideoEnabled)

  return (
    <>
      <header className={styles.header}>
        <img
          className={styles.header__poster}
          src={videoPoster}
          alt=""
          aria-hidden
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <video
          className={styles.header__video}
          autoPlay={shouldPlayVideo}
          muted
          loop={shouldPlayVideo}
          playsInline
          preload={isMobileViewport ? 'none' : 'metadata'}
          poster={videoPoster}
          aria-hidden
        >
          {mobileVideoEnabled && (
            <source src={videoMp4Mobile} type="video/mp4" media="(max-width: 425px)" />
          )}
          {!isMobileViewport && <source src={videoMp4} type="video/mp4" />}
        </video>

        <div ref={setBarEl} className={`${styles.header__bar} ${styles['header__bar--fixedBottom']}`}>
          <div className={styles.header__center}>
            <LogoMenu behavior="static" burgerColor={burgerColor} />
          </div>

          <div className={styles.header__right}>
            <ContactButton
              show={true}
              text="Зв’язатись ♡"
              href="tel:0773213232"
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
