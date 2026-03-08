import React, { useEffect, useId, useRef, useState } from 'react'
import styles from './services.module.scss'
import htmlIcon from '../../../assets/img/web-dev/4658d343c3a74c0675f60d2305b2beabe092f7e0.svg?raw'
import cssIcon from '../../../assets/img/web-dev/3648841d191122a262472dac5cbe23436c16185a.svg?raw'
import jsIcon from '../../../assets/img/web-dev/eae06ff2a124a74202d9673859bb7366169725e6.svg?raw'
import reactIcon from '../../../assets/img/web-dev/8dd7fe335d15a4793f80c5298d2c048aae186243.svg?raw'
import pythonIcon from '../../../assets/img/web-dev/python.svg?raw'
import gitIcon from '../../../assets/img/web-dev/9e0e9286c5111031737c9dc4f39bd0b477cf62b1.svg?raw'
import { useInView } from '../../../shared/hooks/useInView'
const RobotScene = React.lazy(() => import('../../../shared/three/RobotScene'))

const useIsMobile = (maxWidth = 768) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia(`(max-width: ${maxWidth}px)`)
    const update = () => setIsMobile(media.matches)
    update()

    if (media.addEventListener) {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }

    media.addListener(update)
    return () => media.removeListener(update)
  }, [maxWidth])

  return isMobile
}

type ServicesProps = {
  iconThickness?: number
  iconThicknessByKey?: Record<string, number>
}

const applyThickness = (svg: string, filterId: string, thickness?: number) => {
  if (!thickness || thickness <= 0) return svg

  const svgOpenMatch = svg.match(/<svg[^>]*>/)
  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)

  if (!svgOpenMatch || !innerMatch) return svg

  const svgOpen = svgOpenMatch[0]
  const inner = innerMatch[1]
  const defs = `<defs><filter id="${filterId}"><feMorphology operator="erode" radius="${thickness}" in="SourceGraphic" /></filter></defs>`
  const wrapped = `<g filter="url(#${filterId})">${inner}</g>`

  return `${svgOpen}${defs}${wrapped}</svg>`
}

const Services: React.FC<ServicesProps> = ({ iconThickness, iconThicknessByKey }) => {
  const filterIdBase = useId().replace(/:/g, '')
  const sectionRef = useRef<HTMLElement | null>(null)
  const robotModelUrl = '/models/robot/Robot-wd.glb'
  const robotFallbackModelUrl = '/models/robot/scene.glb'
  const isTabletOrDown = useIsMobile(1024)
  const isServicesVisible = useInView(sectionRef, {
    rootMargin: isTabletOrDown ? '100px 0px' : '240px 0px',
  })
  const [resolvedRobotModelUrl, setResolvedRobotModelUrl] = useState<string | null>(null)
  const [shouldRenderRobot, setShouldRenderRobot] = useState(false)

  useEffect(() => {
    if (!isServicesVisible) return

    let isCancelled = false

    const resolveRobotModel = async () => {
      const candidates = [robotModelUrl, robotFallbackModelUrl]

      for (const url of candidates) {
        try {
          const response = await fetch(url, { method: 'HEAD', cache: 'no-store' })
          if (response.ok || response.status === 405) {
            if (!isCancelled) setResolvedRobotModelUrl(url)
            return
          }
        } catch {
          // continue checking next candidate
        }
      }

      if (!isCancelled) setResolvedRobotModelUrl(null)
    }

    resolveRobotModel()
    return () => {
      isCancelled = true
    }
  }, [robotModelUrl, robotFallbackModelUrl, isServicesVisible])

  useEffect(() => {
    if (!isServicesVisible || !resolvedRobotModelUrl) return
    if (!isTabletOrDown) {
      setShouldRenderRobot(true)
      return
    }

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let idleId: number | null = null
    let isActivated = false

    const enable = () => {
      if (!cancelled && !isActivated) {
        isActivated = true
        setShouldRenderRobot(true)
      }
    }

    if (typeof window !== 'undefined') {
      const onFirstInteraction = () => {
        if (timeoutId !== null) clearTimeout(timeoutId)
        enable()
      }

      window.addEventListener('scroll', onFirstInteraction, { passive: true, once: true })
      window.addEventListener('touchstart', onFirstInteraction, { passive: true, once: true })
      window.addEventListener('pointerdown', onFirstInteraction, { passive: true, once: true })

      // Safety fallback: render even without interaction, but later.
      timeoutId = setTimeout(enable, 4500)

      if ('requestIdleCallback' in window) {
        idleId = (
          window as Window & {
            requestIdleCallback: (cb: IdleRequestCallback, opts?: { timeout: number }) => number
          }
        ).requestIdleCallback(
          () => {
            if (!isActivated) enable()
          },
          { timeout: 2200 },
        )
      }

      return () => {
        cancelled = true
        window.removeEventListener('scroll', onFirstInteraction)
        window.removeEventListener('touchstart', onFirstInteraction)
        window.removeEventListener('pointerdown', onFirstInteraction)
        if (idleId !== null && 'cancelIdleCallback' in window) {
          ;(window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId)
        }
        if (timeoutId !== null) clearTimeout(timeoutId)
      }
    }
    timeoutId = setTimeout(enable, 4500)
    return () => {
      cancelled = true
      if (timeoutId !== null) clearTimeout(timeoutId)
    }
  }, [resolvedRobotModelUrl, isTabletOrDown, isServicesVisible])

const robotPartColors: Record<string, string> = {
  Head: '#F0F0F0',
  Body: '#F0F0F0',
  Power_Pack: '#454545',
  Glass: '#FFB2F7',

  Neck: '#333333',
  Neck_Joint_Ring: '#FFB2F7', // Змінено із зеленого на рожевий

  Eye_L: '#8CCBFF', // Залишено блакитний
  Eye_R: '#8CCBFF', // Залишено блакитний
  Ear_L: '#FFB2F7', // Змінено із зеленого на рожевий
  Ear_R: '#FFB2F7', // Змінено із зеленого на рожевий
  Radiator_L: '#8CCBFF', // Залишено блакитний
  Radiator_R: '#8CCBFF', // Залишено блакитний

  Shoulder_L: '#454545',
  Shoulder_R: '#454545',
  Shoulder_Armor_L: '#F0F0F0',
  Shoulder_Armor_R: '#F0F0F0',
  Shoulder_Ring_L: '#FFB2F7', // Змінено із зеленого на рожевий
  Shoulder_Ring_R: '#FFB2F7', // Змінено із зеленого на рожевий

  Forearm_L: '#FFFFFF',
  Forearm_R: '#FFFFFF',
  Elbow_L: '#333333',
  Elbow_R: '#333333',
  Elbow_Armor_L: '#F0F0F0',
  Elbow_Armor_R: '#F0F0F0',
  Elbow_Ring_L: '#8CCBFF', // Залишено блакитний
  Elbow_Ring_R: '#8CCBFF', // Залишено блакитний

  Wrist_L: '#454545',
  Wrist_R: '#454545',
  Wrist_Ring_L: '#FFB2F7', // Змінено із зеленого на рожевий
  Wrist_Ring_R: '#FFB2F7', // Змінено із зеленого на рожевий

  Finger_Inner_L: '#F0F0F0',
  Finger_Middle_L: '#F0F0F0',
  Finger_Outer_L: '#FFFFFF',
  Finger_Inner_Joint_L: '#454545',
  Finger_Middle_Joint_L: '#454545',
  Finger_Outer_Joint_L: '#454545',
  Finger_Outer_Joint_L_1: '#454545',

  Finger_Inner_R: '#F0F0F0',
  Finger_Middle_R: '#F0F0F0',
  Finger_Inner_Joint_R: '#454545',
  Finger_Middle_Joint_R: '#454545',
  Finger_Outer_Joint_R: '#454545',
  'Finger_Outer_Joint_R.001': '#454545',
  Finger_Outer_Joint_R001: '#454545',
  Finger_Outer_Joint_R_1: '#454545',

  ERROR_404: '#A88AED',
}

  const services = [
    {
      id: 1,
      tag: 'РОЗРОБКА САЙТІВ',
      title: 'Розробка сайтів (WP, HTML, CSS, JS, React)',
      description:
        'Створюємо сучасні веб-сайти, лендінги та інтернет-магазини. Від візитки до складного порталу - швидко, якісно, без шаблонів.',
      icons: [
        { key: 'html', src: htmlIcon },
        { key: 'css', src: cssIcon },
        { key: 'js', src: jsIcon },
        { key: 'react', src: reactIcon },
      ],
    },
    {
      id: 2,
      tag: 'ЕФЕКТИВНІСТЬ',
      title: 'Автоматизація бізнес-процесів',
      description:
        'Автоматизуємо рутинні завдання вашого бізнесу. Економте час і ресурси завдяки кастомним рішенням, які працюють за вас.',
      icons: [
        { key: 'html', src: htmlIcon },
        { key: 'css', src: cssIcon },
        { key: 'js', src: jsIcon },
      ],
    },
    {
      id: 3,
      tag: 'БОТИ ДЛЯ БІЗНЕСУ',
      title: 'Чат телеграм-боти (Python, Git)',
      description:
        'Розробляємо розумних ботів для Telegram, Instagram, Facebook. Від приймання замовлень до автоматичної підтримки клієнтів - 24/7 без вихідних.',
      highlighted: true,
      icons: [
        { key: 'python', src: pythonIcon },
        { key: 'git', src: gitIcon },
      ],
    },
  ]
  const highlightedService = services.find((service) => service.highlighted)
  const robotTargetId = isTabletOrDown ? 1 : highlightedService?.id

  return (
    <section ref={sectionRef} className={styles.services}>
      <div className={styles.services__container}>
        <div className={styles.services__header}>
          <h2 className={styles.services__title}>Що ми <br /> розробляємо?</h2>
        </div>

        <div className={styles.services__grid}>
          {services.map((service) => (
            <article
              key={service.id}
              className={`${styles.card} ${service.highlighted ? styles.cardHighlighted : ''} ${
                service.id === robotTargetId ? styles.cardWithRobot : ''
              }`}
            >
              {service.id === robotTargetId && resolvedRobotModelUrl && shouldRenderRobot && (
                <div className={styles.card__robot} aria-hidden="true">
                  <React.Suspense fallback={null}>
                    <RobotScene
                      modelUrl={resolvedRobotModelUrl}
                      modelScale={1.2}
                      modelYOffset={0.25}
                      partColors={robotPartColors}
                      cameraPosition={[0, 0.45, 2]}
                      walkOnCard
                      hiddenNodeNames={['ERROR_404']}
                      autoRotate={false}
                      autoRotateSpeed={0}
                      enableMouseYaw={false}
                    />
                  </React.Suspense>
                </div>
              )}
              <div className={styles.card__tag}>{service.tag}</div>
              <div className={styles.card__body}>
                <h3 className={styles.card__title}>{service.title}</h3>
                <p className={styles.card__description}>{service.description}</p>
              </div>
              <div className={styles.card__icons} aria-hidden="true">
                {service.icons.map((icon) => {
                  const resolvedThickness = iconThicknessByKey?.[icon.key] ?? iconThickness

                  return (
                    <span
                      key={`${service.id}-${icon.key}`}
                      className={styles.card__icon}
                      dangerouslySetInnerHTML={{
                        __html: applyThickness(
                          icon.src,
                          `${filterIdBase}-${service.id}-${icon.key}`,
                          resolvedThickness
                        ),
                      }}
                    />
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
