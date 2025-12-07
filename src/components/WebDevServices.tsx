import React from "react";
import styles from "./web-dev-services.module.scss";

const WebDevServices: React.FC = () => {
  const services = [
    {
      id: 1,
      tag: "РОЗРОБКА САЙТІВ",
      title: "Розробка сайтів (WP, HTML, CSS, JS, React)",
      description: "Створюємо сучасні веб-сайти, лендінги та інтернет-магазини. Від візитки до складного порталу - швидко, якісно, без шаблонів.",
    },
    {
      id: 2,
      tag: "АВТОМАТИЗАЦІЯ ПРОЦЕСІВ",
      title: "Автоматизація бізнес-процесів",
      description: "Автоматизуємо рутинні завдання вашого бізнесу. Економте час і ресурси завдяки кастомним рішенням, які працюють за вас.",
    },
    {
      id: 3,
      tag: "БОТИ ДЛЯ БІЗНЕСУ",
      title: "Чат телеграм-боти (Python, Git)",
      description: "Розробляємо розумних ботів для Telegram, Instagram, Facebook. Від приймання замовлень до автоматичної підтримки клієнтів - 24/7 без вихідних.",
    }
  ];

  return (
    <section className={styles.services}>
      <div className={styles.services__container}>
        <div className={styles.services__header}>
          <h2 className={styles.services__title}>Що ми розробляємо?</h2>
        </div>

        <div className={styles.services__grid}>
          {services.map((service) => (
            <article key={service.id} className={styles.card}>
              <div className={styles.card__tag}>{service.tag}</div>
              <h3 className={styles.card__title}>{service.title}</h3>
              <p className={styles.card__description}>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebDevServices;
