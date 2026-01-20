import React from 'react'
import { useAffix } from '../hooks/useAffix'
import LogoMenu from '../ui/logo-menu/LogoMenu'
import styles from './affixed-menu-shell.module.scss'

type Props = React.PropsWithChildren<{
  topOffsetPx?: number
  bottomGapPx?: number
}>

const AffixedMenuShell: React.FC<Props> = ({ children, topOffsetPx = 20, bottomGapPx = 20 }) => {
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

  return (
    <section className={styles.shell} ref={setTriggerEl}>
      {children}
      <div ref={setBarEl} className={`${styles.bar} ${affixed ? styles.barFixed : ''}`}>
        <LogoMenu behavior="static" />
      </div>
    </section>
  )
}

export default AffixedMenuShell
