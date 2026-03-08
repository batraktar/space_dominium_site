import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'

import AffixedMenuShell from './AffixedMenuShell'
const Contact = lazy(() => import('../sections/contact/Contact'))
const Footer = lazy(() => import('../sections/footer/Footer'))
const Faq = lazy(() => import('../sections/faq/Faq'))

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
  houseShadowLift?: number
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
  const faqTriggerRef = useRef<HTMLDivElement | null>(null)
  const contactTriggerRef = useRef<HTMLDivElement | null>(null)
  const footerTriggerRef = useRef<HTMLDivElement | null>(null)
  const [shouldRenderFaq, setShouldRenderFaq] = useState(false)
  const [shouldRenderContact, setShouldRenderContact] = useState(false)
  const [shouldRenderFooter, setShouldRenderFooter] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const prev = root.style.scrollBehavior
    root.style.scrollBehavior = 'smooth'
    return () => {
      root.style.scrollBehavior = prev
    }
  }, [])

  useEffect(() => {
    if (shouldRenderFaq) return
    const target = faqTriggerRef.current
    if (!target || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShouldRenderFaq(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRenderFaq(true)
          observer.disconnect()
        }
      },
      { rootMargin: '800px 0px', threshold: 0.01 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [shouldRenderFaq])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleHash = () => {
      if (window.location.hash !== '#contact') return
      setShouldRenderContact(true)
      setShouldRenderFooter(true)
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 0)
      })
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  useEffect(() => {
    if (shouldRenderContact) return
    const target = contactTriggerRef.current
    if (!target || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShouldRenderContact(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRenderContact(true)
          observer.disconnect()
        }
      },
      { rootMargin: '900px 0px', threshold: 0.01 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [shouldRenderContact])

  useEffect(() => {
    if (shouldRenderFooter) return
    const target = footerTriggerRef.current
    if (!target || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShouldRenderFooter(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRenderFooter(true)
          observer.disconnect()
        }
      },
      { rootMargin: '900px 0px', threshold: 0.01 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [shouldRenderFooter])

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

      <div ref={faqTriggerRef} aria-hidden />
      {shouldRenderFaq && (
        <Suspense fallback={null}>
          <Faq
            sheetUrl={faq.sheetUrl}
            plusColor={faq.plusColor}
            titleColor={faq.titleColor}
            textColor={faq.textColor}
          />
        </Suspense>
      )}
      <div
        ref={contactTriggerRef}
        id={shouldRenderContact ? undefined : 'contact'}
        aria-hidden
        style={{ height: shouldRenderContact ? 0 : 1 }}
      />
      {shouldRenderContact && (
        <Suspense fallback={null}>
          <Contact
            formBg={contact?.formBg}
            inputBorder={contact?.inputBorder}
            buttonBg={contact?.buttonBg}
            textColor={contact?.textColor ?? footer?.menuTextColor ?? footer?.phoneColor}
          />
        </Suspense>
      )}

      <div ref={footerTriggerRef} aria-hidden />
      {shouldRenderFooter && (
        <Suspense fallback={null}>
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
            houseShadowLift={footer?.houseShadowLift}
            houseDebugMeshNames={footer?.houseDebugMeshNames}
          />
        </Suspense>
      )}
    </div>
  )
}
