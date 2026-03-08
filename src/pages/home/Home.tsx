import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import Animation from './components/animation/Animation'
import HeroCta from '../../shared/sections/hero-cta/HeroCta'
import Contact from '../../shared/sections/contact/Contact'
import Faq from '../../shared/sections/faq/Faq'
import { appEnv } from '../../shared/config/app-env'
import './home.scss'
import '../../styles/variables.scss'

const LazySlider = lazy(() => import('./components/Slider'))
const LazyFooter = lazy(() => import('../../shared/sections/footer/Footer'))

const useLocalInView = (
  ref: React.RefObject<Element | null>,
  rootMargin = '0px',
  threshold = 0,
) => {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        observer.disconnect()
      },
      { root: null, rootMargin, threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [inView, ref, rootMargin, threshold])

  return inView
}

function Home() {
  const sliderTriggerRef = useRef<HTMLDivElement>(null)
  const footerTriggerRef = useRef<HTMLDivElement>(null)
  const shouldRenderSlider = useLocalInView(sliderTriggerRef, '100px')
  const shouldRenderFooter = useLocalInView(footerTriggerRef, '900px')

  return (
    <div className="wrapper">
      <Header 
      contactButtonBg="var(--indigo)"
      contactButtonTextColor="#fff"
      burgerColor="var(--indigo)"
      />
      <main className="page">
        <div className="page__container home__container">
          <div ref={sliderTriggerRef} className="home__slider-trigger" />
          {shouldRenderSlider ? (
            <Suspense fallback={<div className="home__slider-placeholder" aria-hidden="true" />}>
              <LazySlider />
            </Suspense>
          ) : (
            <div className="home__slider-placeholder" aria-hidden="true" />
          )}
          <HeroCta
            text={<>Досить гуглити інші агенції. Поговоріть з нами. Напишіть прямо зараз!</>}
            ctaLabel="Звʼязатись ♡"
          />
          <Animation
            variantIconSize={120}
            variantIconThickness={0.5}
            variantIconThicknessById={{
              'social-01': 0.2,
              'social-02': 0.5,
              'social-03': 0.1,
              'social-04': 0.9,
              'social-05': 0.5,
              'brandStyle-01': 0.02,
              'brandStyle-02': 0.02,
              'brandStyle-03': 0.6,
              'brandStyle-04': 0.02,
              'sites-01': 0.04,
              'sites-02': 0.04,
              'sites-03': 0.04,
              'sites-04': 0.6,
              'sites-05': 0.09,
              'retail-01': 0.04,
              'retail-02': 0.7,
              'retail-03': 0.04,
              'retail-04': 0.55,
              'retail-05': 0.4,
              'apps-01': 1.2,
              'apps-02': 0.9,
              'apps-03': 0.9,
              'apps-04': 0.9,
            }}
            centerVariantIconSize={128}
            centerVariantIconThickness={0}
            categoryOverrides={{
              social: {
                navIconColor: 'var(--indigo)',
                contentIconColor: 'var(--blush-rose)',
                contentBg: 'var(--deep-olive)',
                contentBorder: 'var(--blush-rose)',
                subIconColors: ['#ffffff', 'var(--pearl)', 'var(--blush-rose)'],
              },
              brandStyle: {
                navIconColor: 'var(--indigo)',
                contentIconColor: 'var(--ivory)',
                contentBg: 'var(--indigo)',
                contentBorder: 'var(--ivory)',
                subIconColors: ['var(--pearl)', 'var(--indigo)', 'var(--ivory)'],
              },
              sites: {
                navIconColor: 'var(--indigo)',
                contentIconColor: 'var(--deep-anthracite)',
                contentBg: 'var(--candy-pink)',
                contentBorder: 'var(--deep-anthracite)',
                subIconColors: ['var(--candy-pink)', 'var(--sky-blue)'],
              },
              retail: {
                navIconColor: 'var(--indigo)',
                contentIconColor: 'var(--deep-anthracite)',
                contentBg: 'var(--sky-blue)',
                contentBorder: 'var(--deep-anthracite)',
                subIconColors: ['var(--candy-pink)', 'var(--sky-blue)', 'var(--lime-green)'],
              },
              apps: {
                navIconColor: 'var(--indigo)',
                contentIconColor: 'var(--ivory)',
                contentBg: 'var(--indigo)',
                contentBorder: 'var(--ivory)',
                subIconColors: ['var(--sky-blue)', 'var(--candy-pink)', 'var(--lime-green)'],
              },
            }}
          />
          <Faq
            sheetUrl={appEnv.faqHomeSheetUrl}
            plusColor="#A88AED"
            titleColor="#A88AED"
            textColor="#000"
          />
          <Contact />
        </div>
      </main>
      <div ref={footerTriggerRef} className="home__footer-trigger" />
      {shouldRenderFooter ? (
        <Suspense fallback={<div className="home__footer-placeholder" aria-hidden="true" />}>
          <LazyFooter
            title={<>Почнемо щось круте?</>}
            titleColor="#000"
            buttonLabel="почати співпрацю"
            btnTextColor="#A88AED"
            underlineColor="#000"
            arrowCircleColor="#000"
            arrowColor="#A88AED"
            houseShadowLift={0.6}
            housePartColors={{
              Floor: '#d1da76',
              Walls: '#A88AED',
              FrontWindow: '#A88AED',
              FrontGlass: '#d1da76',
              FirstLevelWindow: '#A88AED',
              FirstLevelGlass: '#A88AED',
              SecondLevelWindow: '#A88AED',
              SecondLevelGlass: '#A88AED',
              Roof: '#d1da76',
              DoorArch: '#A88AED',
              Ceiling: '#A88AED',
              Foundation: '#A88AED',
              Door: '#A88AED',
              DoorHandle: '#d1da76',
            }}
            houseDebugMeshNames
          />
        </Suspense>
      ) : (
        <div className="home__footer-placeholder" aria-hidden="true" />
      )}
    </div>
  )
}

export default Home
