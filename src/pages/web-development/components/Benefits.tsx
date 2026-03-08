import React from 'react'
import styles from './benefits.module.scss'
import responsiveIcon from './assets/benefits-icons/responsive.svg?raw'
import growthArrowIcon from './assets/benefits-icons/growth_arrow.svg?raw'
import homelockOffIcon from './assets/benefits-icons/home_lock_off.svg?raw'
import seoIcon from './assets/benefits-icons/seo.svg?raw'
import vrHeadsetIcon from './assets/benefits-icons/vr_headset.svg?raw'
import faceIdIcon from './assets/benefits-icons/face-id.svg?raw'

type BenefitsProps = {
  iconColor?: string
  iconHoverColor?: string
  iconColorsById?: Partial<Record<number, string>>
  iconSize?: number | string
  iconSizeById?: Partial<Record<number, number | string>>
  iconThickness?: number
  iconThicknessById?: Partial<Record<number, number>>
  iconThicknessScale?: number
}

const benefits = [
  {
    id: 1,
    title: 'Адаптивність',
    desc: 'Ваш сайт ідеально виглядає та працює на всіх пристроях - від смартфона до великого монітора.',
    iconSrc: responsiveIcon,
  },
  {
    id: 2,
    title: 'Масштабованість',
    desc: 'Легко додавати нові функції та розширювати можливості сайту в міру зростання вашого бізнесу.',
    iconSrc: growthArrowIcon,
  },
  {
    id: 3,
    title: 'Безпека',
    desc: 'Надійний захист даних ваших клієнтів та бізнесу через сучасні протоколи безпеки.',
    iconSrc: homelockOffIcon,
  },
  {
    id: 4,
    title: 'Унікальність',
    desc: 'Створюємо кастомні рішення без шаблонів - ваш сайт буде таким же унікальним, як ваш бізнес.',
    iconSrc: faceIdIcon,
  },
  {
    id: 5,
    title: 'SEO-готовність',
    desc: 'Оптимізація для пошукових систем з першого дня - ваші клієнти знайдуть вас у Google.',
    iconSrc: seoIcon,
  },
  {
    id: 6,
    title: 'Підтримка',
    desc: 'Завжди на звʼязку після запуску - допомагаємо з оновленнями, виправленнями та покращеннями.',
    iconSrc: vrHeadsetIcon,
  },
]

const applyThickness = (svg: string, filterId: string, thickness?: number, scale = 30) => {
  if (!thickness || thickness <= 0) return svg
  const resolved = thickness <= 1 ? thickness * scale : thickness

  const svgOpenMatch = svg.match(/<svg[^>]*>/)
  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)
  if (!svgOpenMatch || !innerMatch) return svg

  const svgOpen = svgOpenMatch[0]
  const inner = innerMatch[1]
  const defs = `<defs><filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse"><feMorphology operator="erode" radius="${resolved}" in="SourceGraphic" /></filter></defs>`
  const wrapped = `<g filter="url(#${filterId})">${inner}</g>`
  return `${svgOpen}${defs}${wrapped}</svg>`
}

const Benefits: React.FC<BenefitsProps> = ({
  iconColor = '#b5caff',
  iconHoverColor,
  iconColorsById,
  iconSize = 85,
  iconSizeById,
  iconThickness,
  iconThicknessById,
  iconThicknessScale = 10,
}) => {
  const filterIdBase = React.useId().replace(/:/g, '')

  type BenefitsCssVars = React.CSSProperties & {
    '--benefit-icon-color'?: string
    '--benefit-icon-hover-color'?: string
    '--benefit-icon-size'?: string
  }

  const toCssSize = (value: number | string) =>
    typeof value === 'number' ? `${value}px` : value

  return (
    <section className={styles.benefits}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {benefits.map((benefit) => (
            <article key={benefit.id} className={styles.card}>
              <div
                className={styles.icon}
                aria-hidden
                style={
                  {
                    '--benefit-icon-color': iconColorsById?.[benefit.id] ?? iconColor,
                    '--benefit-icon-hover-color': iconHoverColor,
                    '--benefit-icon-size': toCssSize(iconSizeById?.[benefit.id] ?? iconSize),
                  } as BenefitsCssVars
                }
              >
                <span
                  className={styles.iconSvg}
                  dangerouslySetInnerHTML={{
                    __html: applyThickness(
                      benefit.iconSrc,
                      `${filterIdBase}-${benefit.id}`,
                      iconThicknessById?.[benefit.id] ?? iconThickness,
                      iconThicknessScale
                    ),
                  }}
                />
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
