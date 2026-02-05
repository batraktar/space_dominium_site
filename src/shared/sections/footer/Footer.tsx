import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './footer.scss'
import { useInView } from '../../hooks/useInView'
import HouseViewer from '../../three/HouseViewer'

type FooterProps = {
  title?: React.ReactNode
  buttonLabel?: string
  titleColor?: string
  btnTextColor?: string
  underlineColor?: string
  arrowColor?: string
  arrowCircleColor?: string
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
  }

  const cssVars: FooterCssVars = {
    ...(titleColor ? { '--footer-title-color': titleColor } : {}),
    ...(btnTextColor ? { '--footer-button-text-color': btnTextColor } : {}),
    ...(underlineColor ? { '--footer-underline-color': underlineColor } : {}),
    ...(arrowColor ? { '--footer-arrow-color': arrowColor } : {}),
    ...(arrowCircleColor ? { '--footer-arrow-circle-color': arrowCircleColor } : {}),
  }

  const modelColors: Record<string, string> = {
    '/': '#A88AED',
    '/smm': '#FFC3CC',
    '/design': '#D2DB76',
    '/web-develop': '#8CCBFF',
    '/contacts': '#F3C7E9',
  }
  const modelColor = modelColors[location.pathname] || '#A88AED'

  return (
    <footer>
      <div className="footer__container">
        <div className="footer_wrapper" style={cssVars}>
          <div className="footer_left">
            <div className="footer_title">
              <h1>{title}</h1>
            </div>

            <div className="footer_button">
              <button type="button" aria-label="Contact us">
                {buttonLabel}
              </button>

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
                  <p>IT-рішення / Веб-розробка</p>
                  <p>Графічний Дизайн</p>
                  <p>SMM</p>
                </div>
              </details>

              <details
                className="footer_menu_item"
                open={isDesktop}
                onToggle={handleDesktopToggle}
              >
                <summary>Компанія</summary>
                <div className="footer_menu_body">
                  <p>Про нас</p>
                  <p>Наша місія</p>
                  <p>Команда</p>
                  <p>Досягнення</p>
                  <p>Вакансії</p>
                </div>
              </details>

              <details
                className="footer_menu_item"
                open={isDesktop}
                onToggle={handleDesktopToggle}
              >
                <summary>Контакти</summary>
                <div className="footer_menu_body">
                  <p>
                    <a href="mailto:hello@space.dominium">Email: hello@space.dominium.com.ua</a>
                  </p>
                  <p>
                    <a href="tel:+380XXXXXXXXX">Телефон: +380XXXXXXXXX</a>
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
              <HouseViewer
                url="/models/house.glb"
                width={520}
                height={400}
                modelScale={1.6}
                modelYOffset={-0.2}
                color={modelColor}
                autoRotate={false}
                enableMouseYaw
                environmentPreset="none"
              />
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
