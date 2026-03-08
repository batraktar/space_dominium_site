import React from 'react'
import styles from './showcase.module.scss'

const Showcase: React.FC = () => {
  const previewBuildId = '2026-03-05-8'
  const previewBaseUrl = '/showcase/instaauto-demo'
  const previewUrl = `${previewBaseUrl}/index.html?v=${previewBuildId}&embed=1`
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [canLoadPreview, setCanLoadPreview] = React.useState(false)
  const [hasLoadError, setHasLoadError] = React.useState(false)
  const [isMobileViewport, setIsMobileViewport] = React.useState(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return false
    return window.matchMedia('(max-width: 768px)').matches
  })
  const [isLowDataMode, setIsLowDataMode] = React.useState(false)
  const sectionRef = React.useRef<HTMLElement | null>(null)
  const requiresManualStart = isMobileViewport || isLowDataMode

  React.useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return
    const media = window.matchMedia('(max-width: 768px)')
    const apply = (matches: boolean) => setIsMobileViewport(matches)
    apply(media.matches)
    const onChange = (event: MediaQueryListEvent) => apply(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  React.useEffect(() => {
    if (typeof navigator === 'undefined') return
    const nav = navigator as Navigator & {
      connection?: {
        saveData?: boolean
        effectiveType?: string
        addEventListener?: (event: 'change', listener: () => void) => void
        removeEventListener?: (event: 'change', listener: () => void) => void
      }
    }
    const connection = nav.connection

    const syncConnectionState = () => {
      const type = (connection?.effectiveType ?? '').toLowerCase()
      const isSlow = type === 'slow-2g' || type === '2g' || type === '3g'
      setIsLowDataMode(Boolean(connection?.saveData || isSlow))
    }

    syncConnectionState()
    connection?.addEventListener?.('change', syncConnectionState)

    return () => connection?.removeEventListener?.('change', syncConnectionState)
  }, [])

  React.useEffect(() => {
    if (canLoadPreview || requiresManualStart) return
    const target = sectionRef.current
    if (!target || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setCanLoadPreview(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setCanLoadPreview(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px 0px', threshold: 0.05 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [canLoadPreview, requiresManualStart])

  React.useEffect(() => {
    if (!canLoadPreview || isLoaded) return
    const timeoutId = window.setTimeout(() => {
      setHasLoadError(true)
    }, 9000)

    return () => window.clearTimeout(timeoutId)
  }, [canLoadPreview, isLoaded])

  return (
    <section ref={sectionRef} className={styles.showcase}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Ми створюємо сайти, боти та автоматизацію для вашого бізнесу.
          <br />
          Кожен проєкт - це чистий код, структуровані процеси
          <br />
          та результат, який працює на ваші цілі.
        </h2>

        <div className={styles.mockups}>
          <div className={styles.desktop}>

            <div className={`${styles.desktop__body} ${styles.desktop__body_full}`}>
              <div className={styles.desktop__preview_live}>
                {!canLoadPreview && (
                  <div className={styles.desktop__preview_fallback}>
                    <img
                      className={styles.desktop__preview_image}
                      src={`${previewBaseUrl}/images/coffee-hero.svg`}
                      alt="Попередній перегляд демо"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                    <div className={styles.desktop__preview_actions}>
                      <button
                        type="button"
                        className={styles.desktop__preview_button}
                        onClick={() => setCanLoadPreview(true)}
                      >
                        Показати live
                      </button>
                      <a
                        className={styles.desktop__preview_link}
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Відкрити у вкладці
                      </a>
                    </div>
                    {requiresManualStart && (
                      <p className={styles.desktop__preview_label}>
                        Live завантажується вручну для швидшого старту сторінки.
                      </p>
                    )}
                  </div>
                )}
                {canLoadPreview && !isLoaded && (
                  <div className={styles.desktop__preview_loading} aria-hidden="true">
                    Завантажуємо демо…
                  </div>
                )}
                {canLoadPreview && hasLoadError && !isLoaded && (
                  <div className={styles.desktop__preview_error}>
                    <p>Live preview не завантажився вчасно.</p>
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                      Відкрити у вкладці
                    </a>
                  </div>
                )}
                {canLoadPreview && (
                  <iframe
                    src={previewUrl}
                    title="InstaAuto demo preview"
                    loading="lazy"
                    tabIndex={-1}
                    onLoad={() => {
                      setIsLoaded(true)
                      setHasLoadError(false)
                    }}
                  />
                )}
              </div>
              {/* <a
                className={`${styles.desktop__preview_link} ${styles.desktop__preview_link_float}`}
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Відкрити у вкладці
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Showcase
