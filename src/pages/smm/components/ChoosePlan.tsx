import type { CSSProperties } from 'react'
import { useId } from 'react'
import styles from './choose-plan.module.scss'
import analysisIcon from '../../../assets/img/smm/analysis-strategy.svg?raw'
import contentPlanIcon from '../../../assets/img/smm/content-plan.svg?raw'
import createContentIcon from '../../../assets/img/smm/create-content.svg?raw'
import publishingIcon from '../../../assets/img/smm/publishing.svg?raw'
import targetAdsIcon from '../../../assets/img/smm/target-ads.svg?raw'
import optimizationIcon from '../../../assets/img/smm/optimization.svg?raw'
import scalingIcon from '../../../assets/img/smm/scaling-report.svg?raw'
import supportIcon from '../../../assets/img/smm/support.svg?raw'

const steps = [
  {
    id: 'analysis',
    title: 'Аналіз і стратегія',
    desc: 'Вивчаємо ваш бізнес, аудиторію та конкурентів. Створюємо стратегію, яка працює на ваші цілі.',
    icon: analysisIcon,
  },
  {
    id: 'content-plan',
    title: 'Контент-план',
    desc: 'Розробляємо контент-план із цікавими ідеями, що резонують з вашою аудиторією.',
    icon: contentPlanIcon,
  },
  {
    id: 'create-content',
    title: 'Створення контенту',
    desc: 'Дизайн постів, тексти, сторіс і рілс - усе, що потрібно для активної присутності в соцмережах.',
    icon: createContentIcon,
  },
  {
    id: 'publishing',
    title: 'Публікація та взаємодія',
    desc: 'Розміщуємо контент у оптимальний час і активно спілкуємось із вашою аудиторією.',
    icon: publishingIcon,
  },
  {
    id: 'target-ads',
    title: 'Таргетована реклама',
    desc: 'Запускаємо рекламні кампанії, які приводять цільових клієнтів.',
    icon: targetAdsIcon,
  },
  {
    id: 'optimization',
    title: 'Аналітика та оптимізація',
    desc: 'Відстежуємо результати, аналізуємо ефективність і покращуємо стратегію.',
    icon: optimizationIcon,
  },
  {
    id: 'scaling',
    title: 'Звіти та масштабування',
    desc: 'Надаємо детальні звіти та плануємо подальше зростання.',
    icon: scalingIcon,
  },
  {
    id: 'support',
    title: 'Постійна підтримка',
    desc: 'Завжди на звʼязку - коригуємо стратегію відповідно до змін у бізнесі.',
    icon: supportIcon,
  },
]

type ChoosePlanProps = {
  iconColor?: string
  iconSize?: number | string
  iconThickness?: number
  iconThicknessById?: Record<string, number>
  iconThicknessByIndex?: Partial<Record<number, number>>
  iconThicknessScale?: number
}

const normalizeIcon = (svg: string) =>
  svg
    .replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"')
    .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"')

const resolveThickness = (thickness?: number, scale = 30, max = 6) => {
  if (!thickness || thickness <= 0) return 0
  const resolved = thickness <= 1 ? thickness * scale : thickness
  return Math.min(resolved, max)
}

const applyThickness = (
  svg: string,
  filterId: string,
  thickness?: number,
  scale?: number,
  max?: number
) => {
  const resolved = resolveThickness(thickness, scale, max)
  if (!resolved || resolved <= 0) return svg

  const svgOpenMatch = svg.match(/<svg[^>]*>/)
  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)

  if (!svgOpenMatch || !innerMatch) return svg

  const svgOpen = svgOpenMatch[0]
  const inner = innerMatch[1]
  const defs = `<defs><filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse"><feMorphology operator="erode" radius="${resolved}" in="SourceGraphic" /></filter></defs>`
  const wrapped = `<g filter="url(#${filterId})">${inner}</g>`

  return `${svgOpen}${defs}${wrapped}</svg>`
}

function ChoosePlan({
  iconColor,
  iconSize,
  iconThickness,
  iconThicknessById,
  iconThicknessByIndex,
  iconThicknessScale,
}: ChoosePlanProps) {
  const filterIdBase = useId().replace(/:/g, '')
  const timelineStyle = {
    ...(iconColor ? { '--choose-plan-icon-color': iconColor } : {}),
    ...(iconSize !== undefined
      ? {
          '--choose-plan-icon-size': typeof iconSize === 'number' ? `${iconSize}px` : iconSize,
        }
      : {}),
  } as CSSProperties

  return (
    <section className={styles.section} id="choose-plan">
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.title}>
            Шлях вашого проєкту
            <br />
            
          </h2>
          {/* <button className={styles.cta} type="button">
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
          </button> */}
        </div>

        <div className={styles.timelineWrap} style={timelineStyle}>
          <div className={styles.line} />
          <div className={styles.timeline}>
            {steps.map((step, index) => {
              const resolvedThickness =
                iconThicknessById?.[step.id] ??
                iconThicknessById?.[String(index + 1)] ??
                iconThicknessByIndex?.[index + 1] ??
                iconThickness

              return (
                <div key={step.id} className={styles.step}>
                  <div className={styles.node} aria-hidden>
                    <span
                      className={styles.nodeIcon}
                      aria-hidden
                      dangerouslySetInnerHTML={{
                      __html: applyThickness(
                        normalizeIcon(step.icon),
                        `${filterIdBase}-${step.id}`,
                        resolvedThickness,
                        iconThicknessScale
                      ),
                    }}
                  />
                  </div>
                  <div className={styles.content}>
                    <p className={styles.stepTitle}>{step.title}</p>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChoosePlan
