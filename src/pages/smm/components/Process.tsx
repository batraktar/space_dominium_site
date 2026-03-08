import React from 'react'
import styles from './process.module.scss'

import analysisIcon from '../../../assets/img/smm/analysis-strategy.svg'
import contentPlanIcon from '../../../assets/img/smm/content-plan.svg'
import createContentIcon from '../../../assets/img/smm/create-content.svg'
import publishingIcon from '../../../assets/img/smm/publishing.svg'
import targetAdsIcon from '../../../assets/img/smm/target-ads.svg'
import optimizationIcon from '../../../assets/img/smm/optimization.svg'
import scalingIcon from '../../../assets/img/smm/scaling-report.svg'
import supportIcon from '../../../assets/img/smm/support.svg'

const steps = [
  {
    id: 1,
    title: 'Аналіз і стратегія',
    desc: 'Вивчаємо ваш бізнес, аудиторію та конкурентів. Створюємо стратегію, яка працює на ваші цілі.',
    icon: analysisIcon,
  },
  {
    id: 2,
    title: 'Контент-план',
    desc: 'Розробляємо контент-план із цікавими ідеями, що резонують з вашою аудиторією.',
    icon: contentPlanIcon,
  },
  {
    id: 3,
    title: 'Створення контенту',
    desc: 'Дизайн постів, тексти, сторіс і рілс - все, що потрібно для активної присутності в соцмережах.',
    icon: createContentIcon,
  },
  {
    id: 4,
    title: 'Публікація та взаємодія',
    desc: 'Розміщуємо контент у оптимальний час і активно спілкуємось із вашою аудиторією.',
    icon: publishingIcon,
  },
  {
    id: 5,
    title: 'Таргетована реклама',
    desc: 'Запускаємо рекламні кампанії, які приводять цільових клієнтів.',
    icon: targetAdsIcon,
  },
  {
    id: 6,
    title: 'Аналітика та оптимізація',
    desc: 'Відстежуємо результати, аналізуємо ефективність і покращуємо стратегію.',
    icon: optimizationIcon,
  },
  {
    id: 7,
    title: 'Звіти та масштабування',
    desc: 'Надаємо детальні звіти та плануємо подальше зростання.',
    icon: scalingIcon,
  },
  {
    id: 8,
    title: 'Постійна підтримка',
    desc: 'Завжди на звʼязку - коригуємо стратегію відповідно до змін у бізнесі.',
    icon: supportIcon,
  },
]

const Process: React.FC = () => {
  return (
    <section className={styles.process}>
      <div className={styles.process__blur}></div>
      <div className={styles.process__container}>
        <div className={styles.process__left}>
          <button className={styles.process__btn}>Етапи роботи</button>
        </div>

        <div className={styles.process__timeline}>
          <div className={styles.process__line}></div>
          {steps.map((step) => (
            <div key={step.id} className={styles.process__step}>
              <div className={styles.process__node} aria-hidden="true">
                <img src={step.icon} alt="" className={styles.process__icon} />
              </div>
              <div className={styles.process__content}>
                <h3 className={styles.process__title}>{step.title}</h3>
                <p className={styles.process__desc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Process
