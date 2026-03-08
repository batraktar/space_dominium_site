import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AffixedMenuShell from '../../shared/layout/AffixedMenuShell'
import Contact from '../../shared/sections/contact/Contact'
import Footer from '../../shared/sections/footer/Footer'
import styles from './regional.module.scss'

type RegionKey = 'ua' | 'kyiv' | 'lviv' | 'zakarpattia' | 'ukraine'

type RegionalLandingProps = {
  region: RegionKey
}

type RegionFaq = {
  question: string
  answer: string
}

type RegionData = {
  title: string
  subtitle: string
  ctaLabel: string
  faqs: RegionFaq[]
}

const servicePillars = [
  {
    title: 'Веб-розробка',
    text: 'Сайти та веб-сервіси під задачі бізнесу: швидко, адаптивно, з чіткою логікою конверсії.',
  },
  {
    title: 'Дизайн',
    text: 'Айдентика, візуальні системи та креативні рішення, які роблять бренд впізнаваним і цілісним.',
  },
  {
    title: 'SMM',
    text: 'Контент і просування в соцмережах із фокусом на заявки, охоплення та довгострокову взаємодію.',
  },
]

const regionData: Record<RegionKey, RegionData> = {
  ua: {
    title: 'Креативна агенція Space Dominium для бізнесу по Україні',
    subtitle:
      'Працюємо з компаніями з різних регіонів: запускаємо сайти, дизайн-системи та SMM-стратегії з вимірюваним результатом.',
    ctaLabel: 'Отримати консультацію по проєкту',
    faqs: [
      {
        question: 'Чи працюєте ви тільки з великими містами?',
        answer:
          'Ні. Ми працюємо онлайн по всій Україні та адаптуємо процес під ваш формат комунікації.',
      },
      {
        question: 'Які напрямки можна замовити одночасно?',
        answer:
          'Можна комплексно: веб-розробка + дизайн + SMM, або окремо будь-який напрямок.',
      },
      {
        question: 'Скільки триває старт проєкту?',
        answer:
          'Після брифу та узгодження задач старт зазвичай займає 2-5 робочих днів.',
      },
      {
        question: 'Чи берете проєкти з інших часових зон?',
        answer:
          'Так, узгоджуємо зручний графік і працюємо асинхронно, якщо це потрібно команді.',
      },
    ],
  },
  kyiv: {
    title: 'Веб-розробка, дизайн і SMM для бізнесу Києва та області',
    subtitle:
      'Space Dominium допомагає компаніям Києва будувати сильну цифрову присутність: від сайтів до контент-стратегій.',
    ctaLabel: 'Обговорити проєкт для Києва',
    faqs: [
      {
        question: 'Чи працюєте з бізнесом у Київській області?',
        answer: 'Так, супроводжуємо проєкти як з Києва, так і з усіх міст Київської області.',
      },
      {
        question: 'Чи можна почати зі швидкого MVP сайту?',
        answer:
          'Так. Часто стартуємо з MVP, щоб швидко перевірити гіпотези й масштабувати успішний сценарій.',
      },
      {
        question: 'Які KPI ставите для SMM?',
        answer:
          'Визначаємо KPI під задачу: охоплення, ліди, CTR, вартість заявки та повторні взаємодії.',
      },
      {
        question: 'Чи є підтримка після запуску?',
        answer: 'Так, можемо вести технічну та маркетингову підтримку на постійній основі.',
      },
    ],
  },
  lviv: {
    title: 'Креативні послуги у Львові: веб, дизайн, SMM',
    subtitle:
      'Працюємо з локальними брендами та компаніями зі Львова: допомагаємо масштабувати маркетинг і цифрові продукти.',
    ctaLabel: 'Запустити проєкт у Львові',
    faqs: [
      {
        question: 'Чи робите редизайн існуючих сайтів?',
        answer:
          'Так, проводимо аудит, оновлюємо UX/UI та технічну частину без втрати поточного трафіку.',
      },
      {
        question: 'Можна замовити тільки брендинг?',
        answer:
          'Так. Окремо робимо айдентику, гайдлайни, візуальні носії та дизайн-систему бренду.',
      },
      {
        question: 'Чи працюєте з нішевими бізнесами?',
        answer:
          'Так, адаптуємо контент і комунікацію під конкретну нішу: від локальних сервісів до B2B.',
      },
      {
        question: 'Як організована комунікація по проєкту?',
        answer:
          'Працюємо спринтами з регулярними апдейтами, щоб ви завжди бачили прогрес і наступні кроки.',
      },
    ],
  },
  zakarpattia: {
    title: 'Веб-розробка, дизайн і SMM на Закарпатті',
    subtitle:
      'Допомагаємо бізнесам Закарпаття будувати сучасну присутність онлайн: стратегія, креатив і стабільна реалізація.',
    ctaLabel: 'Обговорити проєкт на Закарпатті',
    faqs: [
      {
        question: 'Чи працюєте з локальним малим бізнесом?',
        answer:
          'Так, формуємо рішення під реальні бюджети та цілі малого й середнього бізнесу.',
      },
      {
        question: 'Чи можна запускати проєкт поетапно?',
        answer:
          'Так, ділимо роботи на етапи: стратегія, дизайн, розробка, просування — з прозорим пріоритетом задач.',
      },
      {
        question: 'Який мінімальний стартовий пакет?',
        answer:
          'Найчастіше стартуємо з аналізу задач, прототипу та базового маркетингового плану під регіон.',
      },
      {
        question: 'Чи робите контент двома мовами?',
        answer:
          'Так, готуємо структуру й контент українською та за потреби англійською або іншою мовою.',
      },
    ],
  },
  ukraine: {
    title: 'Space Dominium по всій Україні: веб-розробка, дизайн, SMM',
    subtitle:
      'Працюємо від локальних запусків до національних кампаній. Фокус — бізнес-результат і контроль якості на кожному етапі.',
    ctaLabel: 'Отримати план для всієї України',
    faqs: [
      {
        question: 'Чи ведете проєкти одночасно в кількох регіонах?',
        answer:
          'Так, будуємо масштабовану стратегію з урахуванням локальних відмінностей і загальної бренд-логіки.',
      },
      {
        question: 'Чи можна інтегрувати рекламу і сайт в єдину аналітику?',
        answer:
          'Так, налаштовуємо єдину воронку аналітики для відстеження шляху користувача від реклами до заявки.',
      },
      {
        question: 'Чи працюєте з B2B і B2C одночасно?',
        answer:
          'Так, маємо окремі сценарії для B2B і B2C, а також комбіновані стратегії для змішаних моделей.',
      },
      {
        question: 'Що потрібно для старту?',
        answer:
          'Базовий бриф, доступні матеріали та 30-40 хвилин на kickoff-дзвінок для фіксації цілей і KPI.',
      },
    ],
  },
}

const regionLinks = [
  { to: '/ua/kyiv', label: 'Київ' },
  { to: '/ua/lviv', label: 'Львів' },
  { to: '/ua/zakarpattia', label: 'Закарпаття' },
  { to: '/ua/ukraine', label: 'Вся Україна' },
]

export default function RegionalLanding({ region }: RegionalLandingProps) {
  const data = regionData[region]

  useEffect(() => {
    const scriptId = 'sd-regional-faq-schema'
    const existing = document.getElementById(scriptId)
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }

    const script = existing ?? document.createElement('script')
    script.id = scriptId
    script.setAttribute('type', 'application/ld+json')
    script.textContent = JSON.stringify(schema)
    if (!existing) {
      document.head.appendChild(script)
    }

    return () => {
      script.remove()
    }
  }, [data])

  return (
    <div className={styles.pageRoot}>
      <AffixedMenuShell
        burgerColor="var(--indigo)"
        contactButtonBg="var(--indigo)"
        contactButtonTextColor="#fff"
        fixedPosition="bottom"
        alwaysFixed
      >
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <h1>{data.title}</h1>
            <p>{data.subtitle}</p>
            <a href="#contact" className={styles.ctaButton}>
              {data.ctaLabel}
            </a>
          </div>
        </section>
      </AffixedMenuShell>

      <section className={styles.servicesSection}>
        <div className={styles.servicesGrid}>
          {servicePillars.map((item) => (
            <article key={item.title} className={styles.serviceCard}>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.regionsSection}>
        <h2>Регіони роботи</h2>
        <div className={styles.regionsLinks}>
          {regionLinks.map((item) => (
            <Link key={item.to} to={item.to} className={styles.regionLink}>
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.faqSection}>
        <h2>Поширені питання по регіону</h2>
        <div className={styles.faqList}>
          {data.faqs.map((item) => (
            <details key={item.question} className={styles.faqItem}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <Contact
        formBg="rgba(168, 138, 237, 0.12)"
        inputBorder="var(--indigo)"
        buttonBg="var(--indigo)"
        textColor="#0a0a60"
      />

      <Footer
        title={
          <>
            Працюємо з бізнесами <br />
            по всій Україні
          </>
        }
        titleColor="#000"
        btnTextColor="#A88AED"
        underlineColor="#000"
        arrowCircleColor="#000"
        arrowColor="#A88AED"
        menuTextColor="#222"
      />
    </div>
  )
}
