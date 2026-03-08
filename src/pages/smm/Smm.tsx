import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import ServiceLayout from '../../shared/layout/ServiceLayout'
import { appEnv } from '../../shared/config/app-env'
import Hero from './components/Hero'
import styles from './smm.module.scss'

const Tools = lazy(() => import('./components/Tools'))
const ChoosePlan = lazy(() => import('./components/ChoosePlan'))

function Smm() {
  const toolsTriggerRef = useRef<HTMLDivElement | null>(null)
  const choosePlanTriggerRef = useRef<HTMLDivElement | null>(null)
  const [renderTools, setRenderTools] = useState(false)
  const [renderChoosePlan, setRenderChoosePlan] = useState(false)

  useEffect(() => {
    const target = toolsTriggerRef.current
    if (!target || !('IntersectionObserver' in window)) {
      setRenderTools(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRenderTools(true)
          observer.disconnect()
        }
      },
      { rootMargin: '500px 0px', threshold: 0.01 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!renderTools) return
    const target = choosePlanTriggerRef.current
    if (!target || !('IntersectionObserver' in window)) {
      setRenderChoosePlan(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRenderChoosePlan(true)
          observer.disconnect()
        }
      },
      { rootMargin: '500px 0px', threshold: 0.01 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [renderTools])

  return (
    <ServiceLayout
    affix={{
      burgerColor: 'var(--blush-rose)',
      contactButtonBg: 'var(--blush-rose)',
      contactButtonTextColor: 'var(--deep-olive)',
      contactButtonLiftMobilePx: 20,
    }}
      className={styles.smm}
      hero={<Hero />}
      faq={{
        sheetUrl: appEnv.faqSmmSheetUrl,
        plusColor: '#FFCDC3',
        titleColor: '#FFCDC3',
        textColor: '#FFF',
      }}
      contact={{
        formBg: 'rgba(255, 255, 255, 0.20)',
        inputBorder: '#ffc2cb',
        buttonBg: '#ffc2cb',
        textColor: '#fff',

      }}
      footer={{
        title: (
          <>
            Давай створимо контент, <br />
            який не соромно показати
          </>
        ),
        titleColor: '#FFF',
        buttonLabel: 'почати співпрацю',
        btnTextColor: '#ffc2cb',
        underlineColor: '#FFF',
        arrowCircleColor: '#FFF',
        arrowColor: '#ffc2cb',
        menuTextColor: '#fff', 
        houseShadowLift: 0.45,
        phoneColor: '#FFFFFF',
        housePartColors: {
          Floor: '#fdeb9f',
          Walls: '#ffc2cb',
          FrontWindow: '#ffc2cb',
          FrontGlass: '#fdeb9f',
          FirstLevelWindow: '#ffc2cb',
          FirstLevelGlass: '#ffc2cb',
          SecondLevelWindow: '#ffc2cb',
          SecondLevelGlass: '#ffc2cb',
          Roof: '#fdeb9f',
          DoorArch: '#ffc2cb',
          Ceiling: '#ffc2cb',
          Foundation: '#ffc2cb',
          Door: '#ffc2cb',
          DoorHandle: '#fdeb9f',
        },
      }}
    >
      <div ref={toolsTriggerRef} aria-hidden />
      {renderTools && (
        <Suspense fallback={null}>
          <Tools />
        </Suspense>
      )}

      <div ref={choosePlanTriggerRef} aria-hidden />
      {renderChoosePlan && (
        <Suspense fallback={null}>
          <ChoosePlan
            iconColor="#ffc2cb"
            iconThickness={0.001}
            iconThicknessById={{
              3: 0.025,
              4: 0.025,
              5: 0.025,
            }}
          />
        </Suspense>
      )}

      {/* <RegionsLinks tone="dark" /> */}
    </ServiceLayout>
  )
}

export default Smm
