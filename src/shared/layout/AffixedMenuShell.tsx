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
  reserveBarSpace?: boolean
  burgerColor?: string
  contactButtonBg?: string
  contactButtonTextColor?: string
  contactButtonLiftMobilePx?: number
}>

const AffixedMenuShell: React.FC<Props> = ({
  children,
  topOffsetPx = 20,
  bottomGapPx = 20,
  fixedPosition = 'bottom',
  alwaysFixed = true,
  reserveBarSpace = true,
  burgerColor,
  contactButtonBg,
  contactButtonTextColor,
  contactButtonLiftMobilePx,
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

  type BarRightCssVars = React.CSSProperties & {
    '--contact-btn-lift-mobile'?: string
  }
  type ShellCssVars = React.CSSProperties & {
    '--shell-menu-reserve'?: string
  }

  const barRightStyle: BarRightCssVars = {
    ...(typeof contactButtonLiftMobilePx === 'number'
      ? { '--contact-btn-lift-mobile': `${contactButtonLiftMobilePx}px` }
      : {}),
  }
  const shellStyle: ShellCssVars = {
    '--shell-menu-reserve': reserveBarSpace ? 'var(--menu-bar-h, 0px)' : '0px',
  }

  return (
    <section className={styles.shell} ref={setTriggerEl} style={shellStyle}>
      {children}
      <div ref={setBarEl} className={`${styles.bar} ${isFixed ? fixedClass : ''}`}>
        <LogoMenu behavior="static" burgerColor={burgerColor} />
        <div className={styles.barRight} style={barRightStyle}>
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
