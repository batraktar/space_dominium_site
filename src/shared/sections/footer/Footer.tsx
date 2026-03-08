import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './footer.scss'
import { useInView } from '../../hooks/useInView'

const LazyHouseViewer = lazy(() => import('../../three/HouseViewer'))

type FooterProps = {
  title?: React.ReactNode
  buttonLabel?: string
  titleColor?: string
  btnTextColor?: string
  underlineColor?: string
  arrowColor?: string
  arrowCircleColor?: string
  phoneColor?: string
  menuTextColor?: string
  houseColor?: string
  housePartColors?: Record<string, string>
  houseShadowLift?: number
  houseDebugMeshNames?: boolean
}

const Footer: React.FC<FooterProps> = ({
  title = (
    <>
      Створимо візуал
      <br />
      який запамʼятовується
    </>
  ),
  buttonLabel = 'почати співпрацю',
  titleColor,
  btnTextColor,
  underlineColor,
  arrowColor,
  arrowCircleColor,
  phoneColor,
  menuTextColor,
  houseColor,
  housePartColors,
  houseShadowLift,
  houseDebugMeshNames,
}) => {
  const previewRef = useRef<HTMLDivElement>(null)
  const isPreviewVisible = useInView(previewRef, { rootMargin: '200px' })
  const location = useLocation()
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return true
    return window.matchMedia('(min-width: 769px)').matches
  })

  useEffect(() => {
    if (!('matchMedia' in window)) return
    const media = window.matchMedia('(min-width: 769px)')
    const onChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches)
    }
    setIsDesktop(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const handleDesktopToggle = (event: React.SyntheticEvent<HTMLDetailsElement>) => {
    if (!isDesktop) return
    if (!event.currentTarget.open) {
      event.currentTarget.open = true
    }
  }

  type FooterCssVars = React.CSSProperties & {
    '--footer-title-color'?: string
    '--footer-button-text-color'?: string
    '--footer-underline-color'?: string
    '--footer-arrow-color'?: string
    '--footer-arrow-circle-color'?: string
    '--footer-phone-color'?: string
    '--footer-menu-color'?: string
  }

  const cssVars: FooterCssVars = {
    ...(titleColor ? { '--footer-title-color': titleColor } : {}),
    ...(btnTextColor ? { '--footer-button-text-color': btnTextColor } : {}),
    ...(underlineColor ? { '--footer-underline-color': underlineColor } : {}),
    ...(arrowColor ? { '--footer-arrow-color': arrowColor } : {}),
    ...(arrowCircleColor ? { '--footer-arrow-circle-color': arrowCircleColor } : {}),
    ...(phoneColor ? { '--footer-phone-color': phoneColor } : {}),
    ...(menuTextColor ? { '--footer-menu-color': menuTextColor } : {}),
  }

  const modelColors: Record<string, string> = {
    '/': '#A88AED',
    '/smm': '#ffc2cb',
    '/design': '#D2DB76',
    '/web-develop': '#8CCBFF',
    '/contacts': '#F3C7E9',
  }
  const modelColor = houseColor ?? modelColors[location.pathname]

  return (
    <footer>
      <div className="footer__container">
        <div className="footer_wrapper" style={cssVars}>
          <div className="footer_left">
            <div className="footer_title">
              <h1>{title}</h1>
            </div>

            <div className="footer_button">
              <a className="footer_button_link" href="tel:0773213232" aria-label="Зателефонувати">
                {buttonLabel}
              </a>

              <svg
                className="footer_arrow"
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="22"
                  cy="22"
                  r="20.5"
                  stroke="var(--footer-arrow-circle-color, currentColor)"
                  strokeWidth="3"
                />
                <path
                  d="M20 14L28 22L20 30"
                  stroke="var(--footer-arrow-color, currentColor)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="footer_menu">
              <details
                className="footer_menu_item"
                open={isDesktop}
                onToggle={handleDesktopToggle}
              >
                <summary>Послуги</summary>
                <div className="footer_menu_body">
                  <p>
                    <Link to="/web-develop">IT-рішення / Веб-розробка</Link>
                  </p>
                  <p>
                    <Link to="/design">Графічний Дизайн</Link>
                  </p>
                  <p>
                    <Link to="/smm">SMM</Link>
                  </p>
                </div>
              </details>

              <details
                className="footer_menu_item"
                open={isDesktop}
                onToggle={handleDesktopToggle}
              >
                <summary>Компанія</summary>
                <div className="footer_menu_body">
                  {/* <p>Про нас</p> */}
                  <p>Команда</p>
                  <p>Вакансії</p>
                </div>
              </details>

              {/* Тимчасово вимкнено блок "Регіони роботи"
              <details
                className="footer_menu_item"
                open={isDesktop}
                onToggle={handleDesktopToggle}
              >
                <summary>Регіони роботи</summary>
                <div className="footer_menu_body">
                  <p>
                    <Link to="/ua/kyiv">Київ</Link>
                  </p>
                  <p>
                    <Link to="/ua/lviv">Львів</Link>
                  </p>
                  <p>
                    <Link to="/ua/zakarpattia">Закарпаття</Link>
                  </p>
                  <p>
                    <Link to="/ua/ukraine">Вся Україна</Link>
                  </p>
                </div>
              </details>
              */}

              <details
                className="footer_menu_item"
                open={isDesktop}
                onToggle={handleDesktopToggle}
              >
                <summary>Контакти</summary>
                <div className="footer_menu_body">
                  <p>
                    <a href="mailto:hello@space.dominium.com.ua">Email: hello@space.dominium.com.ua</a>
                  </p>
                  <p>
                    <a href="tel:0773213232">Телефон: 0773213232</a>
                  </p>  
                  <p>
                    <a
                      href="https://maps.google.com/?q=м.+Хуст,+Україна"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Адреса: м. Хуст, Україна
                    </a>
                  </p>
                </div>
              </details>
            </div>
          </div>

          <div className="footer_right" ref={previewRef}>
            {isPreviewVisible && (
              <Suspense fallback={<div className="footer_house_skeleton" aria-hidden="true" />}>
                <LazyHouseViewer
                  url="/models/house.glb"
                  width={520}
                  height={400}
                  modelScale={1.65}
                  modelYOffset={0}
                  color={modelColor}
                  partColors={housePartColors}
                  shadowLift={houseShadowLift}
                  debugMeshNames={houseDebugMeshNames}
                  autoRotate={false}
                  enableMouseYaw={true}
                  enableMouseFloat={true}
                  baseYaw={0}
                  basePitch={0}
                  environmentPreset="none"
                />
              </Suspense>
            )}
          </div>
        </div>
{/* 
        <div className="Antoshka">
          <p>Website made by Pylypiuk</p>
        </div> */}
      </div>
    </footer>
  )
}

export default Footer
