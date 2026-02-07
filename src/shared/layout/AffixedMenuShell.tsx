import React from 'react'
import { useAffix } from '../hooks/useAffix'
import ContactButton from '../ui/contact-button/ContactButton'
import LogoMenu from '../ui/logo-menu/LogoMenu'
import styles from './affixed-menu-shell.module.scss'

type Props = React.PropsWithChildren<{
  topOffsetPx?: number
  bottomGapPx?: number
  fixedPosition?: 'top' | 'bottom'
  alwaysFixed?: boolean
  burgerColor?: string
  contactButtonBg?: string
  contactButtonTextColor?: string
}>

const AffixedMenuShell: React.FC<Props> = ({
  children,
  topOffsetPx = 20,
  bottomGapPx = 20,
  fixedPosition = 'bottom',
  alwaysFixed = true,
  burgerColor,
  contactButtonBg,
  contactButtonTextColor,
}) => {
  const [triggerEl, setTriggerEl] = React.useState<HTMLElement | null>(null)
  const [barEl, setBarEl] = React.useState<HTMLDivElement | null>(null)

  const { affixed, barHeight } = useAffix({
    triggerEl,
    barEl,
    top: topOffsetPx,
    bottomGap: bottomGapPx,
  })

  React.useEffect(() => {
    if (!triggerEl) return
    triggerEl.style.setProperty('--menu-bar-h', `${barHeight || 0}px`)
  }, [barHeight, triggerEl])

  const isFixed = alwaysFixed || affixed
  const fixedClass =
    fixedPosition === 'bottom' ? styles.barFixedBottom : styles.barFixed

  return (
    <section className={styles.shell} ref={setTriggerEl}>
      {children}
      <div ref={setBarEl} className={`${styles.bar} ${isFixed ? fixedClass : ''}`}>
        <LogoMenu behavior="static" burgerColor={burgerColor} />
        <div className={styles.barRight}>
          <ContactButton
            href="#contact"
            text="Зв’язатись ♡"
            bgColor={contactButtonBg}
            textColor={contactButtonTextColor}
          />
        </div>
      </div>
    </section>
  )
}

export default AffixedMenuShell
