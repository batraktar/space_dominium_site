import styles from './choose-plan.module.scss'
import analysisIcon from '../../../assets/img/smm/analysis-strategy.svg'
import contentPlanIcon from '../../../assets/img/smm/content-plan.svg'
import createContentIcon from '../../../assets/img/smm/create-content.svg'
import publishingIcon from '../../../assets/img/smm/publishing.svg'
import targetAdsIcon from '../../../assets/img/smm/target-ads.svg'
import optimizationIcon from '../../../assets/img/smm/optimiizatiion.svg'
import scalingIcon from '../../../assets/img/smm/scaling-report.svg'
import supportIcon from '../../../assets/img/smm/support.svg'

const steps = [
  {
    title: 'Аналіз і стратегія',
    desc: 'Вивчаємо ваш бізнес, аудиторію та конкурентів. Створюємо стратегію, яка працює на ваші цілі.',
    icon: analysisIcon,
  },
  {
    title: 'Контент-план',
    desc: 'Розробляємо контент-план із цікавими ідеями, що резонують з вашою аудиторією.',
    icon: contentPlanIcon,
  },
  {
    title: 'Створення контенту',
    desc: 'Дизайн постів, тексти, сторіс і рілс — усе, що потрібно для активної присутності в соцмережах.',
    icon: createContentIcon,
  },
  {
    title: 'Публікація та взаємодія',
    desc: 'Розміщуємо контент у оптимальний час і активно спілкуємось із вашою аудиторією.',
    icon: publishingIcon,
  },
  {
    title: 'Таргетована реклама',
    desc: 'Запускаємо рекламні кампанії, які приводять цільових клієнтів.',
    icon: targetAdsIcon,
  },
  {
    title: 'Аналітика та оптимізація',
    desc: 'Відстежуємо результати, аналізуємо ефективність і покращуємо стратегію.',
    icon: optimizationIcon,
  },
  {
    title: 'Звіти та масштабування',
    desc: 'Надаємо детальні звіти та плануємо подальше зростання.',
    icon: scalingIcon,
  },
  {
    title: 'Постійна підтримка',
    desc: 'Завжди на звʼязку — коригуємо стратегію відповідно до змін у бізнесі.',
    icon: supportIcon,
  },
]

function ChoosePlan() {
  return (
    <section className={styles.section} id="choose-plan">
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.title}>
            Here’s how to
            <br />
            get started:
          </h2>
          <button className={styles.cta} type="button">
            <span>See all our plans</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M4 10H16M10 4L16 10L10 16"
                stroke="#F7D9C5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.timelineWrap}>
          <div className={styles.line} />
          <div className={styles.timeline}>
            {steps.map((step) => (
              <div key={step.title} className={styles.step}>
                <div className={styles.node} aria-hidden>
                  <img src={step.icon} alt="" className={styles.nodeIcon} />
                </div>
                <div className={styles.content}>
                  <p className={styles.stepTitle}>{step.title}</p>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChoosePlan
