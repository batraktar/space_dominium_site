import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Animation.css'
import LineNor from './LineNor'

type TabId = 'social' | 'market' | 'sites' | 'retail' | 'apps'
type DottedSide = 'left' | 'right' | 'both'

const assetUrl = (relativePath: string) => {
  const normalizedPath = relativePath.replace(/^\.\.\/\.\.\/assets\//, '../../../../assets/')
  return new URL(normalizedPath, import.meta.url).href
}

interface Variant {
  id: string
  thumb: string
  contentIcon: string
  bullets: string[]
}

interface Tab {
  id: TabId
  label: string
  navIcon: string
  contentIcon: string
  variants: Variant[]
}

// ===== Дані =====
const TABS: Tab[] = [
  {
    id: 'social',
    label: 'Соцмережі',
    navIcon: assetUrl('../../assets/img/icon/famicons_share-social-outline (1).svg'),
    contentIcon: assetUrl('../../assets/img/icon-hover/famicons_share-social-outline.svg'),
    variants: [
      {
        id: 'soc-1',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Stories pack', 'Reels сет', 'Пак іконок highlights'],
      },
      {
        id: 'soc-2',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Місячний контент-план', 'TOV/копірайт', 'Контент-гайд'],
      },
      {
        id: 'soc-3',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Photo-сетап', 'Лайтрум пресети', 'Грід-сітка 3×3'],
      },
      {
        id: 'soc-4',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['UGC пакет', 'Сценарії рілсів', 'Титри/сабтайтли'],
      },
      {
        id: 'soc-5',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['SMM-старт', 'Оформлення профілю', 'Гайд по шрифтам/кольорам'],
      },
      {
        id: 'soc-6',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Таргет запуск', 'Сегментація', 'Креативи A/B'],
      },
    ],
  },
  {
    id: 'market',
    label: 'Маркетплейси',
    navIcon: assetUrl('../../assets/img/icon/Vector (5).svg'),
    contentIcon: assetUrl(
      '../../assets/img/icon-hover/material-symbols-light_dashboard-outline-rounded.svg',
    ),
    variants: [
      {
        id: 'soc-2-1',
        thumb: assetUrl('../../assets/img/Vector (3).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (3).svg'),
        bullets: ['Stories pack', 'Reels сет', 'Пак іконок highlights'],
      },
      {
        id: 'soc-2',
        thumb: assetUrl('../../assets/img/Vector (3).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (3).svg'),
        bullets: ['Місячний контент-план', 'TOV/копірайт', 'Контент-гайд'],
      },
      {
        id: 'soc-3',
        thumb: assetUrl('../../assets/img/Vector (3).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (3).svg'),
        bullets: ['Photo-сетап', 'Лайтрум пресети', 'Грід-сітка 3×3'],
      },
      {
        id: 'soc-4',
        thumb: assetUrl('../../assets/img/Vector (3).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (3).svg'),
        bullets: ['UGC пакет', 'Сценарії рілсів', 'Титри/сабтайтли'],
      },
      {
        id: 'soc-5',
        thumb: assetUrl('../../assets/img/Vector (3).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (3).svg'),
        bullets: ['SMM-старт', 'Оформлення профілю', 'Гайд по шрифтам/кольорам'],
      },
      {
        id: 'soc-6',
        thumb: assetUrl('../../assets/img/Vector (3).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (3).svg'),
        bullets: ['Таргет запуск', 'Сегментація', 'Креативи A/B'],
      },
    ],
  },
  {
    id: 'sites',
    label: 'Сайти',
    navIcon: assetUrl('../../assets/img/icon/cuida_monitor-outline.svg'),
    contentIcon: assetUrl('../../assets/img/icon-hover/cuida_monitor-outline (2).svg'),
    variants: [
      {
        id: 'soc-1',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Stories pack', 'Reels сет', 'Пак іконок highlights'],
      },
      {
        id: 'soc-2',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Місячний контент-план', 'TOV/копірайт', 'Контент-гайд'],
      },
      {
        id: 'soc-3',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Photo-сетап', 'Лайтрум пресети', 'Грід-сітка 3×3'],
      },
      {
        id: 'soc-4',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['UGC пакет', 'Сценарії рілсів', 'Титри/сабтайтли'],
      },
      {
        id: 'soc-5',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['SMM-старт', 'Оформлення профілю', 'Гайд по шрифтам/кольорам'],
      },
      {
        id: 'soc-6',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Таргет запуск', 'Сегментація', 'Креативи A/B'],
      },
    ],
  },
  {
    id: 'retail',
    label: 'Рітейл',
    navIcon: assetUrl('../../assets/img/icon/fluent_building-retail-20-regular.svg'),
    contentIcon: assetUrl('../../assets/img/icon-hover/fluent_building-retail-20-regular (1).svg'),
    variants: [
      {
        id: 'soc-1',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Stories pack', 'Reels сет', 'Пак іконок highlights'],
      },
      {
        id: 'soc-2',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Місячний контент-план', 'TOV/копірайт', 'Контент-гайд'],
      },
      {
        id: 'soc-3',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Photo-сетап', 'Лайтрум пресети', 'Грід-сітка 3×3'],
      },
      {
        id: 'soc-4',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['UGC пакет', 'Сценарії рілсів', 'Титри/сабтайтли'],
      },
      {
        id: 'soc-5',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['SMM-старт', 'Оформлення профілю', 'Гайд по шрифтам/кольорам'],
      },
      {
        id: 'soc-6',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Таргет запуск', 'Сегментація', 'Креативи A/B'],
      },
    ],
  },
  {
    id: 'apps',
    label: 'Додатки',
    navIcon: assetUrl('../../assets/img/icon/proicons_phone.svg'),
    contentIcon: assetUrl('../../assets/img/icon-hover/proicons_phone (1).svg'),
    variants: [
      {
        id: 'soc-1',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Stories pack', 'Reels сет', 'Пак іконок highlights'],
      },
      {
        id: 'soc-2',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Місячний контент-план', 'TOV/копірайт', 'Контент-гайд'],
      },
      {
        id: 'soc-3',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Photo-сетап', 'Лайтрум пресети', 'Грід-сітка 3×3'],
      },
      {
        id: 'soc-4',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['UGC пакет', 'Сценарії рілсів', 'Титри/сабтайтли'],
      },
      {
        id: 'soc-5',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['SMM-старт', 'Оформлення профілю', 'Гайд по шрифтам/кольорам'],
      },
      {
        id: 'soc-6',
        thumb: assetUrl('../../assets/img/Vector (1).svg'),
        contentIcon: assetUrl('../../assets/img/Vector (1).svg'),
        bullets: ['Таргет запуск', 'Сегментація', 'Креативи A/B'],
      },
    ],
  },
]

const dottedByTab: Record<TabId, DottedSide> = {
  social: 'left',
  market: 'both',
  sites: 'left',
  retail: 'right',
  apps: 'both',
}

const Animation: React.FC = () => {
  const [activeId, setActiveId] = useState<TabId>(TABS[0].id)
  const [activeVarIdx, setActiveVarIdx] = useState<number | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const activeTab = useMemo(() => TABS.find((t) => t.id === activeId)!, [activeId])
  const activeVariants = activeTab?.variants ?? []

  useEffect(() => {
    setActiveVarIdx(null)
  }, [activeId])

  const currentVariant: Variant | null =
    activeVarIdx !== null ? (activeTab?.variants?.[activeVarIdx] ?? null) : null

  const centerIcon = currentVariant?.contentIcon ?? activeTab?.contentIcon
  const centerBullets = currentVariant?.bullets ?? []
  const hasText = centerBullets.length > 0
  const contentKey = `${activeId}-${activeVarIdx ?? 'none'}`

  const focusTab = useCallback((index: number) => {
    const next = TABS[index]
    if (!next) return
    setActiveId(next.id)
    tabRefs.current[index]?.focus()
  }, [])

  const handleTabKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const total = TABS.length
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        focusTab((index + 1) % total)
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        focusTab((index - 1 + total) % total)
      }
      if (event.key === 'Home') {
        event.preventDefault()
        focusTab(0)
      }
      if (event.key === 'End') {
        event.preventDefault()
        focusTab(total - 1)
      }
    },
    [focusTab],
  )

  return (
    <div className="page-ani">
      <div className="container">
        <div className="containet-wrapper">
          {/* Верхнє меню */}
          <div className="ani-nav" role="tablist" aria-label="Категорії">
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeId === tab.id}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                tabIndex={activeId === tab.id ? 0 : -1}
                className={`nav-bloks ${activeId === tab.id ? 'is-active' : ''}`}
                onClick={() => setActiveId(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
              >
                <img className="nav-icon" src={tab.navIcon} alt="" />
                <p>{tab.label}</p>
              </button>
            ))}
          </div>

          {/* Центрична вертикальна лінія (твій SVG без змін) */}
          <div className="center-line">
            <svg
              width="6"
              height="61"
              viewBox="0 0 6 61"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="3"
                y1="5"
                x2="3"
                y2="55"
                stroke="url(#paint0_linear_831_4320)"
                strokeWidth="2"
              />
              <circle cx="3" cy="3" r="2" stroke="#1E1E5B" strokeWidth="2" />
              <circle cx="3" cy="58" r="2" stroke="#1E1E5B" strokeWidth="2" />
              <defs>
                <linearGradient
                  id="paint0_linear_831_4320"
                  x1="1.5"
                  y1="5"
                  x2="1.5"
                  y2="55"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#A88AED" />
                  <stop offset="1" stopColor="#0A0A60" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Центральний контент */}
          <div className="content-wrapper">
            <div
              className="content"
              tabIndex={0}
              role="tabpanel"
              aria-label="Деталі категорії"
              aria-labelledby={`tab-${activeId}`}
              id={`panel-${activeId}`}
            >
              <div
                key={contentKey}
                className={`content-inner-fade ${hasText ? 'has-text' : 'no-text'}`}
              >
                <img className="content-icon" src={centerIcon} alt="" />
                {hasText && (
                  <div className="content-text">
                    <ul>
                      {centerBullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Лінії + нижні блоки */}
          <div className="line">
            <LineNor
              dottedSide={dottedByTab[activeId] ?? 'right'}
              variants={activeVariants}
              activeVarIdx={activeVarIdx}
              setActiveVarIdx={setActiveVarIdx}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Animation
export type { TabId, DottedSide, Variant, Tab }
