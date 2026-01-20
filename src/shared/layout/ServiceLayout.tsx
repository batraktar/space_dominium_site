import type { ReactNode } from 'react'

import AffixedMenuShell from './AffixedMenuShell'
import Contact from '../sections/contact/Contact'
import Footer from '../sections/footer/Footer'
import Faq from '../sections/faq/Faq'

type FaqConfig = {
  sheetUrl: string
  plusColor?: string
  titleColor?: string
}

type ContactConfig = {
  formBg?: string
  inputBorder?: string
  buttonBg?: string
}

type FooterConfig = {
  title?: ReactNode
  buttonLabel?: string
  titleColor?: string
  btnTextColor?: string
  underlineColor?: string
  arrowColor?: string
  arrowCircleColor?: string
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
  return (
    <div className={className}>
      <AffixedMenuShell topOffsetPx={affix?.topOffsetPx} bottomGapPx={affix?.bottomGapPx}>
        {hero}
      </AffixedMenuShell>

      {children}

      <Faq sheetUrl={faq.sheetUrl} plusColor={faq.plusColor} titleColor={faq.titleColor} />
      <Contact
        formBg={contact?.formBg}
        inputBorder={contact?.inputBorder}
        buttonBg={contact?.buttonBg}
      />
      <Footer
        title={footer?.title}
        buttonLabel={footer?.buttonLabel}
        titleColor={footer?.titleColor}
        btnTextColor={footer?.btnTextColor}
        underlineColor={footer?.underlineColor}
        arrowColor={footer?.arrowColor}
        arrowCircleColor={footer?.arrowCircleColor}
      />
    </div>
  )
}
