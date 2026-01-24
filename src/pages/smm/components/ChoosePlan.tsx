import styles from './choose-plan.module.scss'

const steps = [
  {
    title: 'Аналіз і стратегія',
    desc: 'Вивчаємо ваш бізнес, аудиторію та конкурентів. Створюємо стратегію, яка працює на ваші цілі.',
  },
  {
    title: 'Контент-план',
    desc: 'Розробляємо контент-план із цікавими ідеями, що резонують з вашою аудиторією.',
  },
  {
    title: 'Створення контенту',
    desc: 'Дизайн постів, тексти, сторіс і рілс — усе, що потрібно для активної присутності в соцмережах.',
  },
  {
    title: 'Публікація та взаємодія',
    desc: 'Розміщуємо контент у оптимальний час і активно спілкуємось із вашою аудиторією.',
  },
  {
    title: 'Таргетована реклама',
    desc: 'Запускаємо рекламні кампанії, які приводять цільових клієнтів.',
  },
  {
    title: 'Аналітика та оптимізація',
    desc: 'Відстежуємо результати, аналізуємо ефективність і покращуємо стратегію.',
  },
  {
    title: 'Звіти та масштабування',
    desc: 'Надаємо детальні звіти та плануємо подальше зростання.',
  },
  {
    title: 'Постійна підтримка',
    desc: 'Завжди на звʼязку — коригуємо стратегію відповідно до змін у бізнесі.',
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
                  <div className={styles.nodeInner} />
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
