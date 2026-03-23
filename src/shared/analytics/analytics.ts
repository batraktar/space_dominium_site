import { appEnv } from '../config/app-env'

type EventParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GTAG_SCRIPT_ID = 'sd-gtag-script'
const GTM_SCRIPT_ID = 'sd-gtm-script'

const serviceByPath: Record<string, string> = {
  '/': 'home',
  '/web-develop': 'web-development',
  '/design': 'design',
  '/smm': 'smm',
  '/contacts': 'contacts',
}

const resolveServiceContext = (path: string) => {
  return serviceByPath[path] ?? 'other'
}

const resolveRegionContext = (path: string) => {
  return path.startsWith('/ua/') || path === '/ua' ? 'ua-disabled' : 'none'
}

const setupGtagApi = () => {
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
}

export const initAnalytics = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  if (appEnv.gtmId && !document.getElementById(GTM_SCRIPT_ID)) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    const gtmScript = document.createElement('script')
    gtmScript.id = GTM_SCRIPT_ID
    gtmScript.async = true
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(appEnv.gtmId)}`
    document.head.appendChild(gtmScript)
  }

  const hasGa4 = Boolean(appEnv.ga4MeasurementId)
  const hasAds = Boolean(appEnv.googleAdsId)
  if (!hasGa4 && !hasAds) return

  if (!window.gtag) {
    setupGtagApi()
  }

  const loaderId = appEnv.ga4MeasurementId || appEnv.googleAdsId
  if (!loaderId) return

  if (!document.getElementById(GTAG_SCRIPT_ID)) {
    const script = document.createElement('script')
    script.id = GTAG_SCRIPT_ID
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(loaderId)}`
    document.head.appendChild(script)
  }

  window.gtag?.('js', new Date())

  if (appEnv.ga4MeasurementId) {
    window.gtag?.('config', appEnv.ga4MeasurementId, {
      anonymize_ip: true,
      send_page_view: true,
    })
  }

  if (appEnv.googleAdsId) {
    window.gtag?.('config', appEnv.googleAdsId)
  }
}

export const trackEvent = (eventName: string, params: EventParams = {}) => {
  if (typeof window === 'undefined') return
  window.gtag?.('event', eventName, params)
}

export const trackFormSubmitSuccess = (sourcePath: string) => {
  trackEvent('form_submit_success', {
    source_path: sourcePath,
    service_context: resolveServiceContext(sourcePath),
    region_context: resolveRegionContext(sourcePath),
  })
}

export const trackAdsConversion = (eventId?: string) => {
  if (!appEnv.googleAdsId || !appEnv.googleAdsConversionLabel) return
  const sendTo = `${appEnv.googleAdsId}/${appEnv.googleAdsConversionLabel}`
  const payload: EventParams = {
    send_to: sendTo,
    ...(eventId ? { event_id: eventId } : {}),
  }
  window.gtag?.('event', 'conversion', payload)
}
