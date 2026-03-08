import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Animation.css'
import LineNor from './LineNor'
// import OrbitalStationMobile from './OrbitalStationMobile'
import emptyDotIcon from './assets/icons/empty-dot.svg'
import { TABS } from './data'
import type { SvgIconComponent, Tab, TabId, Variant, VariantIcon } from './data'

type DottedSide = 'left' | 'right' | 'both'

type CategoryOverride = {
  navIcon?: string
  navIconColor?: string
  contentIcon?: string
  contentIconColor?: string
  contentBg?: string
  contentBorder?: string
  subIconColors?: string[]
}

type AnimationProps = {
  categoryOverrides?: Partial<Record<TabId, CategoryOverride>>
  variantIconSize?: number
  variantIconThickness?: number
  variantIconThicknessById?: Partial<Record<string, number>>
  centerVariantIconSize?: number
  centerVariantIconThickness?: number
}

const LINE_ANIM_MS = 1500

const dottedByTab: Record<TabId, DottedSide> = {
  social: 'left',
  brandStyle: 'both',
  sites: 'left',
  retail: 'right',
  apps: 'both',
}

const EMPTY_ICON = emptyDotIcon

const makePlaceholder = (id: string, contentIcon: VariantIcon): Variant => ({
  id,
  thumb: EMPTY_ICON,
  contentIcon,
  bullets: [],
})

const buildVariants = (tab: Tab, dottedSide: DottedSide, placeholderIcon: VariantIcon): Variant[] => {
  const leftEmpty = dottedSide === 'left' || dottedSide === 'both'
  const rightEmpty = dottedSide === 'right' || dottedSide === 'both'
  const result = [...tab.variants]

  if (leftEmpty) {
    result.unshift(makePlaceholder(`${tab.id}-empty-left`, placeholderIcon))
  }

  if (rightEmpty) {
    result.push(makePlaceholder(`${tab.id}-empty-right`, placeholderIcon))
  }

  while (result.length < 6) {
    result.push(makePlaceholder(`${tab.id}-empty-${result.length + 1}`, placeholderIcon))
  }

  return result
}

const isSvgComponent = (icon: VariantIcon): icon is SvgIconComponent =>
  typeof icon !== 'string'

const Animation: React.FC<AnimationProps> = ({
  categoryOverrides,
  variantIconSize = 72,
  variantIconThickness = 0,
  variantIconThicknessById,
  centerVariantIconSize = 72,
  centerVariantIconThickness = 0,
}) => {
  const [activeId, setActiveId] = useState<TabId>(TABS[0].id)
  const [activeVarIdx, setActiveVarIdx] = useState<number | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const subIconColorMapsRef = useRef<
    Partial<Record<TabId, { key: string; map: Record<string, string> }>>
  >({})

  const activeTab = useMemo(() => TABS.find((t) => t.id === activeId)!, [activeId])
  const activeOverride = categoryOverrides?.[activeId]
  const activeContentIcon = activeOverride?.contentIcon ?? activeTab.contentIcon
  const activeContentIconColor = activeOverride?.contentIconColor
  const dottedSide = dottedByTab[activeId] ?? 'right'
  const activeVariants = useMemo(
    () => buildVariants(activeTab, dottedSide, activeContentIcon),
    [activeTab, dottedSide, activeContentIcon],
  )

  useEffect(() => {
    setActiveVarIdx(null)
  }, [activeId])

  const currentVariant: Variant | null =
    activeVarIdx !== null ? (activeVariants?.[activeVarIdx] ?? null) : null

  const centerIcon: VariantIcon = currentVariant?.contentIcon ?? activeContentIcon
  const CenterIconComponent = isSvgComponent(centerIcon) ? centerIcon : null
  const centerBullets: string[] = []
  const hasText = false
  const contentKey = `${activeId}-${activeVarIdx ?? 'none'}`
  const showCategoryIconColor = Boolean(activeContentIconColor) && !CenterIconComponent
  const contentStyle = useMemo<React.CSSProperties>(() => {
    const style: React.CSSProperties = {}
    if (activeOverride?.contentBg) {
      style.background = activeOverride.contentBg
    }
    if (activeOverride?.contentBorder) {
      style.borderColor = activeOverride.contentBorder
    }
    return style
  }, [activeOverride?.contentBg, activeOverride?.contentBorder])

  const subIconColorMap = useMemo(() => {
    const palette = activeOverride?.subIconColors ?? []
    if (palette.length === 0) return null as Record<string, string> | null

    const key = palette.join('|')
    const existing = subIconColorMapsRef.current[activeId]
    if (!existing || existing.key !== key) {
      const map: Record<string, string> = {}
      activeTab.variants.forEach((variant) => {
        const color = palette[Math.floor(Math.random() * palette.length)]
        map[variant.id] = color
      })
      subIconColorMapsRef.current[activeId] = { key, map }
    }

    return subIconColorMapsRef.current[activeId]?.map ?? null
  }, [activeId, activeOverride?.subIconColors, activeTab.variants])

  const subIconColors = useMemo(
    () =>
      activeVariants.map((variant) =>
        variant.bullets.length > 0 ? (subIconColorMap?.[variant.id] ?? null) : null,
      ),
    [activeVariants, subIconColorMap],
  )

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

  // if (isMobile) {
  //   return (
  //     <div className="page-ani-mobile">
  //       <div className="ani-mobile-nav" role="tablist" aria-label="Категорії">
  //         {TABS.map((tab) => (
  //           <button
  //             key={tab.id}
  //             type="button"
  //             role="tab"
  //             aria-selected={activeId === tab.id}
  //             className={`ani-mobile-tab ${activeId === tab.id ? 'is-active' : ''}`}
  //             onClick={() => setActiveId(tab.id)}
  //           >
  //             {tab.label}
  //           </button>
  //         ))}
  //       </div>

  //       <OrbitalStationMobile
  //         hubIcon={activeOverride?.contentIcon ?? activeTab.contentIcon}
  //         hubIconColor={activeOverride?.contentIconColor}
  //         items={activeTab.variants}
  //         itemColors={mobileSubIconColors}
  //         activeIndex={activeVarIdx}
  //         onActiveIndexChange={setActiveVarIdx}
  //       />
  //     </div>
  //   )
  // }

  return (
    <div className="page-ani">
      <div className="container">
        <div className="container-wrapper">
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
                  {categoryOverrides?.[tab.id]?.navIconColor ? (
                    <span
                      className="nav-icon nav-icon--mask"
                      aria-hidden="true"
                      style={
                        {
                          '--icon-url': `url("${categoryOverrides?.[tab.id]?.navIcon ?? tab.navIcon}")`,
                          '--icon-color': categoryOverrides?.[tab.id]?.navIconColor,
                        } as React.CSSProperties
                      }
                    />
                  ) : (
                    <img
                      className="nav-icon"
                      src={categoryOverrides?.[tab.id]?.navIcon ?? tab.navIcon}
                      alt=""
                    />
                  )}
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
              className={`content ${hasText ? 'has-text' : 'no-text'}`}
              tabIndex={0}
              role="tabpanel"
              aria-label="Деталі категорії"
              aria-labelledby={`tab-${activeId}`}
              id={`panel-${activeId}`}
              style={contentStyle}
            >
              <div
                key={contentKey}
                className={`content-inner-fade ${hasText ? 'has-text' : 'no-text'}`}
              >
                {CenterIconComponent ? (
                  <CenterIconComponent
                    className="content-icon"
                    aria-hidden="true"
                    width={centerVariantIconSize}
                    height={centerVariantIconSize}
                    thickness={centerVariantIconThickness}
                    style={
                      activeContentIconColor
                        ? ({ color: activeContentIconColor } as React.CSSProperties)
                        : undefined
                    }
                  />
                ) : showCategoryIconColor ? (
                  <span
                    className="content-icon content-icon--mask"
                    aria-hidden="true"
                    style={
                      {
                        '--icon-url': `url("${centerIcon as string}")`,
                        '--icon-color': activeContentIconColor,
                      } as React.CSSProperties
                    }
                  />
                ) : (
                  <img className="content-icon" src={centerIcon as string} alt="" />
                )}
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
              } as React.CSSProperties
            }
          >
            <LineNor
              dottedSide={dottedSide}
              variants={activeVariants}
              activeVarIdx={activeVarIdx}
              setActiveVarIdx={setActiveVarIdx}
              drawDurationMs={LINE_ANIM_MS}
              subIconColors={subIconColors ?? undefined}
              iconSize={variantIconSize}
              iconThickness={variantIconThickness}
              iconThicknessById={variantIconThicknessById}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Animation
export type { TabId, DottedSide, Variant, Tab, CategoryOverride, AnimationProps }
