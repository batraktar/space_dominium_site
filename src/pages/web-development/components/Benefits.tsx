import React from 'react'
import styles from './benefits.module.scss'

const benefits = [
  {
    id: 1,
    title: 'Адаптивність',
    desc: 'Ваш сайт ідеально виглядає та працює на всіх пристроях – від смартфона до великого монітора.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden focusable="false">
        <rect x="8" y="12" width="48" height="32" rx="8" fill="#6E85FF" />
        <rect x="22" y="48" width="20" height="6" rx="3" fill="#6E85FF" />
        <rect x="28" y="42" width="8" height="6" rx="3" fill="#6E85FF" />
        <circle cx="26" cy="28" r="3" fill="#F7F7FF" />
        <circle cx="32" cy="28" r="3" fill="#F7F7FF" />
        <circle cx="38" cy="28" r="3" fill="#F7F7FF" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Масштабованість',
    desc: 'Легко додавати нові функції та розширювати можливості сайту в міру зростання вашого бізнесу.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden focusable="false">
        <rect x="10" y="10" width="44" height="44" rx="10" fill="#FFB2F7" />
        <rect x="18" y="20" width="28" height="4" rx="2" fill="#342447" />
        <rect x="18" y="30" width="20" height="4" rx="2" fill="#342447" />
        <rect x="18" y="40" width="12" height="4" rx="2" fill="#342447" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Безпека',
    desc: 'Надійний захист даних ваших клієнтів та бізнесу через сучасні протоколи безпеки.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden focusable="false">
        <rect x="10" y="8" width="44" height="28" rx="12" fill="#B5CAFF" />
        <rect x="8" y="24" width="48" height="26" rx="10" fill="#7088FF" />
        <circle cx="32" cy="36" r="3" fill="#E8EEFF" />
        <rect x="30" y="36" width="4" height="8" rx="2" fill="#E8EEFF" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Унікальність',
    desc: 'Створюємо кастомні рішення без шаблонів – ваш сайт буде таким же унікальним, як ваш бізнес.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden focusable="false">
        <path d="M18 36V20c0-5.523 4.477-10 10-10h8c5.523 0 10 4.477 10 10v16" fill="#FFB2F7" />
        <rect x="12" y="22" width="40" height="12" rx="4" fill="#F7F7FF" />
        <circle cx="32" cy="24" r="4" fill="#C05DFF" />
        <rect x="20" y="34" width="8" height="8" rx="2" fill="#C05DFF" />
        <rect x="36" y="34" width="8" height="8" rx="2" fill="#C05DFF" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'SEO-готовність',
    desc: 'Оптимізація для пошукових систем з першого дня – ваші клієнти знайдуть вас у Google.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden focusable="false">
        <rect x="8" y="18" width="48" height="28" rx="8" fill="#B5CAFF" />
        <rect x="16" y="24" width="20" height="4" rx="2" fill="#3B3663" />
        <rect x="16" y="32" width="16" height="4" rx="2" fill="#3B3663" />
        <circle cx="44" cy="32" r="9" fill="#F7F7FF" />
        <rect
          x="46"
          y="38"
          width="10"
          height="3"
          rx="1.5"
          fill="#3B3663"
          transform="rotate(45 46 38)"
        />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Підтримка',
    desc: 'Завжди на звʼязку після запуску – допомагаємо з оновленнями, виправленнями та покращеннями.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden focusable="false">
        <circle cx="32" cy="32" r="22" fill="#FFB2F7" />
        <path
          d="M24 30c0-5 4-9 9-9s9 4 9 9c0 3-1.5 5.7-3.8 7.3l2.3 4.2c.4.7-.3 1.5-1.1 1.2l-5-1.9c-.5.1-1 .2-1.6.2-5 0-9-4-9-9Z"
          fill="#3B3663"
        />
      </svg>
    ),
  },
]

const Benefits: React.FC = () => {
  return (
    <section className={styles.benefits}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {benefits.map((benefit) => (
            <article key={benefit.id} className={styles.card}>
              <div className={styles.icon} aria-hidden>
                {benefit.icon}
              </div>
              <h3 className={styles.title}>{benefit.title}</h3>
              <p className={styles.text}>{benefit.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
