import { useEffect, type ReactNode } from 'react'

import AffixedMenuShell from './AffixedMenuShell'
import Contact from '../sections/contact/Contact'
import Footer from '../sections/footer/Footer'
import Faq from '../sections/faq/Faq'

type FaqConfig = {
  sheetUrl: string
  plusColor?: string
  titleColor?: string
  textColor?: string
}

type ContactConfig = {
  formBg?: string
  inputBorder?: string
  buttonBg?: string
  textColor?: string
}

type FooterConfig = {
  title?: ReactNode
  buttonLabel?: string
  titleColor?: string
  btnTextColor?: string
  underlineColor?: string
  arrowColor?: string
  arrowCircleColor?: string
  phoneColor?: string
  menuTextColor?: string
  houseColor?: string
  housePartColors?: Record<string, string>
  houseDebugMeshNames?: boolean
}

type Props = {
  className?: string
  hero: ReactNode
  children?: ReactNode
  faq: FaqConfig
  contact?: ContactConfig
  footer?: FooterConfig
  affix?: {
    topOffsetPx?: number
    bottomGapPx?: number
    fixedPosition?: 'top' | 'bottom'
    alwaysFixed?: boolean
    burgerColor?: string
    contactButtonBg?: string
    contactButtonTextColor?: string
    contactButtonLiftMobilePx?: number
  }
}

export default function ServiceLayout({
  className,
  hero,
  children,
  faq,
  contact,
  footer,
  affix,
}: Props) {
  useEffect(() => {
    const root = document.documentElement
    const prev = root.style.scrollBehavior
    root.style.scrollBehavior = 'smooth'
    return () => {
      root.style.scrollBehavior = prev
    }
  }, [])

  return (
    <div className={className}>
      <AffixedMenuShell
        topOffsetPx={affix?.topOffsetPx}
        bottomGapPx={affix?.bottomGapPx}
        fixedPosition={affix?.fixedPosition}
        alwaysFixed={affix?.alwaysFixed}
        burgerColor={affix?.burgerColor}
        contactButtonBg={affix?.contactButtonBg}
        contactButtonTextColor={affix?.contactButtonTextColor}
        contactButtonLiftMobilePx={affix?.contactButtonLiftMobilePx}
      >
        {hero}
      </AffixedMenuShell>

      {children}

      <Faq
        sheetUrl={faq.sheetUrl}
        plusColor={faq.plusColor}
        titleColor={faq.titleColor}
        textColor={faq.textColor}
      />
      <Contact
        formBg={contact?.formBg}
        inputBorder={contact?.inputBorder}
        buttonBg={contact?.buttonBg}
        textColor={contact?.textColor ?? footer?.menuTextColor ?? footer?.phoneColor}
      />
      <Footer
        title={footer?.title}
        buttonLabel={footer?.buttonLabel}
        titleColor={footer?.titleColor}
        btnTextColor={footer?.btnTextColor}
        underlineColor={footer?.underlineColor}
        arrowColor={footer?.arrowColor}
        arrowCircleColor={footer?.arrowCircleColor}
        phoneColor={footer?.phoneColor}
        menuTextColor={footer?.menuTextColor}
        houseColor={footer?.houseColor}
        housePartColors={footer?.housePartColors}
        houseDebugMeshNames={footer?.houseDebugMeshNames}
      />
    </div>
  )
}
