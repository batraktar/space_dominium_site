import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Animation.css'
import LineNor from './LineNor'
import emptyDotIcon from './assets/icons/empty-dot.svg'
import { TABS } from './data'
import type { Tab, TabId, Variant } from './data'

type DottedSide = 'left' | 'right' | 'both'

const LINE_ANIM_MS = 1500
const LINE_WIDTH_PX = 1044
const LINE_ICON_SIZE_PX = 120

const dottedByTab: Record<TabId, DottedSide> = {
  social: 'left',
  brandStyle: 'both',
  sites: 'left',
  retail: 'right',
  apps: 'both',
}

const EMPTY_ICON = emptyDotIcon

const makePlaceholder = (id: string, contentIcon: string): Variant => ({
  id,
  thumb: EMPTY_ICON,
  contentIcon,
  bullets: [],
})

const buildVariants = (tab: Tab, dottedSide: DottedSide): Variant[] => {
  const leftEmpty = dottedSide === 'left' || dottedSide === 'both'
  const rightEmpty = dottedSide === 'right' || dottedSide === 'both'
  const result = [...tab.variants]

  if (leftEmpty) {
    result.unshift(makePlaceholder(`${tab.id}-empty-left`, tab.contentIcon))
  }

  if (rightEmpty) {
    result.push(makePlaceholder(`${tab.id}-empty-right`, tab.contentIcon))
  }

  while (result.length < 6) {
    result.push(makePlaceholder(`${tab.id}-empty-${result.length + 1}`, tab.contentIcon))
  }

  return result
}

const Animation: React.FC = () => {
  const [activeId, setActiveId] = useState<TabId>(TABS[0].id)
  const [activeVarIdx, setActiveVarIdx] = useState<number | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const activeTab = useMemo(() => TABS.find((t) => t.id === activeId)!, [activeId])
  const dottedSide = dottedByTab[activeId] ?? 'right'
  const activeVariants = useMemo(
    () => buildVariants(activeTab, dottedSide),
    [activeTab, dottedSide],
  )

  useEffect(() => {
    setActiveVarIdx(null)
  }, [activeId])

  const currentVariant: Variant | null =
    activeVarIdx !== null ? (activeVariants?.[activeVarIdx] ?? null) : null

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
              <React.Fragment key={tab.id}>
                <button
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
                {index < TABS.length - 1 && <span className="nav-divider" aria-hidden="true" />}
              </React.Fragment>
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
          <div
            className="line"
            style={
              {
                '--line-anim-ms': `${LINE_ANIM_MS}ms`,
                '--line-width': `${LINE_WIDTH_PX}px`,
                '--box-size': `${LINE_ICON_SIZE_PX}px`,
              } as React.CSSProperties
            }
          >
            <LineNor
              dottedSide={dottedSide}
              variants={activeVariants}
              activeVarIdx={activeVarIdx}
              setActiveVarIdx={setActiveVarIdx}
              drawDurationMs={LINE_ANIM_MS}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Animation
export type { TabId, DottedSide, Variant, Tab }
