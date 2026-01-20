import React from 'react'
import styles from './process.module.scss'

const steps = [
  { id: 1, title: 'Аналіз', desc: 'Вивчаємо ваш бізнес, нішу та конкурентів.' },
  { id: 2, title: 'Стратегія', desc: 'Розробляємо план дій та контент-стратегію.' },
  { id: 3, title: 'Контент', desc: 'Створюємо візуали, тексти та відео.' },
  { id: 4, title: 'Запуск', desc: 'Публікуємо контент та запускаємо рекламу.' },
  { id: 5, title: 'Аналітика', desc: 'Відстежуємо результати та оптимізуємо.' },
  { id: 6, title: 'Масштабування', desc: 'Розширюємо охоплення та покращуємо ROI.' },
  { id: 7, title: 'Підтримка', desc: 'Постійний моніторинг та комунікація.' },
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
              <div className={styles.process__node}></div>
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
