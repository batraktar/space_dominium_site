import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { trackAdsConversion, trackEvent } from '../../shared/analytics/analytics'
import AffixedMenuShell from '../../shared/layout/AffixedMenuShell'
import styles from './thanks.module.scss'

type GateStatus = 'checking' | 'allowed' | 'blocked'

type GateResponse = {
  ok?: boolean
  allowed?: boolean
}

const SESSION_TTL_MS = 30 * 1000
const PENDING_CONVERSION_ID_KEY = 'sd_pending_ads_conversion_id'
const PENDING_CONVERSION_TS_KEY = 'sd_pending_ads_conversion_ts'
const PENDING_CONVERSION_TTL_MS = 10 * 60 * 1000

function Thanks() {
  const navigate = useNavigate()
  const [gateStatus, setGateStatus] = useState<GateStatus>('checking')

  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
    }
  }, [])

  useEffect(() => {
    const existing = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
    const previousContent = existing?.getAttribute('content') ?? null
    let created = false
    const robotsTag = existing ?? document.createElement('meta')

    if (!existing) {
      robotsTag.setAttribute('name', 'robots')
      document.head.appendChild(robotsTag)
      created = true
    }

    robotsTag.setAttribute('content', 'noindex, nofollow, noarchive')

    return () => {
      if (created) {
        robotsTag.remove()
        return
      }
      if (previousContent === null) {
        robotsTag.removeAttribute('content')
      } else {
        robotsTag.setAttribute('content', previousContent)
      }
    }
  }, [])

  useEffect(() => {
    let isAlive = true

    const allowFromSession = () => {
      if (typeof window === 'undefined') return false

      const rawTs = window.sessionStorage.getItem('sd_thanks_access_ts')
      if (!rawTs) {
        // Backward compatibility with old flag format.
        return window.sessionStorage.getItem('sd_thanks_access') === '1'
      }

      const ts = Number(rawTs)
      if (!Number.isFinite(ts)) {
        window.sessionStorage.removeItem('sd_thanks_access_ts')
        return false
      }

      const isFresh = Date.now() - ts <= SESSION_TTL_MS
      if (!isFresh) {
        window.sessionStorage.removeItem('sd_thanks_access_ts')
      }

      return isFresh
    }

    const checkAccess = async () => {
      if (allowFromSession()) {
        if (isAlive) setGateStatus('allowed')
        return
      }

      try {
        const response = await fetch('/thanks-access.php', {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const body = (await response.json()) as GateResponse
        if (body.ok && body.allowed) {
          if (isAlive) setGateStatus('allowed')
          return
        }
      } catch {
        // fallback below
      }

      if (!isAlive) return
      setGateStatus('blocked')
      navigate('/', { replace: true })
    }

    void checkAccess()

    return () => {
      isAlive = false
    }
  }, [navigate])

  useEffect(() => {
    if (gateStatus !== 'allowed') return
    trackEvent('thanks_page_view', { page_path: '/thanks' })

    if (typeof window === 'undefined') return

    const conversionId = window.sessionStorage.getItem(PENDING_CONVERSION_ID_KEY)?.trim() ?? ''
    const rawTs = window.sessionStorage.getItem(PENDING_CONVERSION_TS_KEY)
    const conversionTs = rawTs ? Number(rawTs) : NaN
    const isFresh =
      conversionId !== '' && Number.isFinite(conversionTs) && Date.now() - conversionTs <= PENDING_CONVERSION_TTL_MS

    if (!isFresh) {
      window.sessionStorage.removeItem(PENDING_CONVERSION_ID_KEY)
      window.sessionStorage.removeItem(PENDING_CONVERSION_TS_KEY)
      return
    }

    trackAdsConversion(conversionId)
    window.sessionStorage.removeItem(PENDING_CONVERSION_ID_KEY)
    window.sessionStorage.removeItem(PENDING_CONVERSION_TS_KEY)
  }, [gateStatus])

  if (gateStatus === 'checking') {
    return (
      <AffixedMenuShell
        burgerColor="var(--indigo)"
        contactButtonBg="var(--indigo)"
        contactButtonTextColor="#fff"
        fixedPosition="bottom"
        alwaysFixed
        reserveBarSpace={false}
      >
        <section className={styles.page}>
          <div className={styles.card}>
            <h1>Відправляємо…</h1>
            <p>Перевіряємо доступ до сторінки підтвердження.</p>
          </div>
        </section>
      </AffixedMenuShell>
    )
  }

  if (gateStatus === 'blocked') return null

  return (
    <AffixedMenuShell
      burgerColor="var(--indigo)"
      contactButtonBg="var(--indigo)"
      contactButtonTextColor="#fff"
      fixedPosition="bottom"
      alwaysFixed
      reserveBarSpace={false}
    >
      <section className={styles.page}>
        <div className={styles.card}>
          <h1>Дякуємо за заявку</h1>
          <p>Ми отримали ваше повідомлення та звʼяжемося найближчим часом.</p>
          <Link className={styles.link} to="/">
            Повернутись на головну ♡
          </Link>
        </div>
      </section>
    </AffixedMenuShell>
  )
}

export default Thanks
