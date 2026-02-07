import React, { useEffect, useState } from 'react'
import styles from './services.module.scss'
import htmlIcon from '../../../assets/img/web-dev/4658d343c3a74c0675f60d2305b2beabe092f7e0.svg'
import cssIcon from '../../../assets/img/web-dev/3648841d191122a262472dac5cbe23436c16185a.svg'
import jsIcon from '../../../assets/img/web-dev/eae06ff2a124a74202d9673859bb7366169725e6.svg'
import reactIcon from '../../../assets/img/web-dev/8dd7fe335d15a4793f80c5298d2c048aae186243.svg'
import pythonIcon from '../../../assets/img/web-dev/python.svg'
import gitIcon from '../../../assets/img/web-dev/9e0e9286c5111031737c9dc4f39bd0b477cf62b1.svg'
import RobotScene from '../../../shared/three/RobotScene'

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

const Services: React.FC = () => {
  const robotModelUrl = new URL(
    '../../../assets/img/it/model-robot-it/scene.gltf',
    import.meta.url,
  ).href
  const isMobile = useIsMobile(768)
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
  const robotTargetId = isMobile ? 1 : highlightedService?.id

  return (
    <section className={styles.services}>
      <div className={styles.services__container}>
        <div className={styles.services__header}>
          <h2 className={styles.services__title}>Що ми розробляємо?</h2>
        </div>

        <div className={styles.services__grid}>
          {services.map((service) => (
            <article
              key={service.id}
              className={`${styles.card} ${service.highlighted ? styles.cardHighlighted : ''} ${
                service.id === robotTargetId ? styles.cardWithRobot : ''
              }`}
            >
              {service.id === robotTargetId && (
                <div className={styles.card__robot} aria-hidden="true">
                  <RobotScene
                    modelUrl={robotModelUrl}
                    modelScale={0.9}
                    cameraPosition={[0, 0.45, 2]}
                    autoRotate
                    autoRotateSpeed={0.4}
                    enableMouseYaw={false}
                  />
                </div>
              )}
              <div className={styles.card__tag}>{service.tag}</div>
              <div className={styles.card__body}>
                <h3 className={styles.card__title}>{service.title}</h3>
                <p className={styles.card__description}>{service.description}</p>
              </div>
              <div className={styles.card__icons} aria-hidden="true">
                {service.icons.map((icon) => (
                  <span key={`${service.id}-${icon.key}`} className={styles.card__icon}>
                    <img src={icon.src} alt="" />
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
