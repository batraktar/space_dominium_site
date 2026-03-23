import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './app/App'
import { initAnalytics } from './shared/analytics/analytics'
import './styles/main.scss'
import homePoster from './assets/video/laptop_people_poster.webp'
import homePosterMobile from './assets/video/laptop_people_poster_mobile_q86.jpg'
import smmToolsHeroImage from './assets/img/smm-tools/saas.png'

import { BrowserRouter as Router } from 'react-router-dom'

if (typeof document !== 'undefined') {
  initAnalytics()

  const isLowDataConnection = () => {
    const nav = navigator as Navigator & {
      connection?: {
        saveData?: boolean
        effectiveType?: string
      }
    }
    const connection = nav.connection
    const effectiveType = (connection?.effectiveType ?? '').toLowerCase()
    const isSlow = effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g'
    return Boolean(connection?.saveData || isSlow)
  }

  const pathname = window.location.pathname
  const addPreload = (key: string, href: string, as: string) => {
    const existing = document.querySelector(`link[data-preload-key="${key}"]`)
    if (existing) return
    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = as
    preload.href = href
    preload.setAttribute('fetchpriority', 'high')
    preload.setAttribute('data-preload-key', key)
    document.head.appendChild(preload)
  }

  if (pathname === '/') {
    const isMobilePoster = window.matchMedia('(max-width: 425px)').matches
    const useHighQualityMobilePoster = isMobilePoster && !isLowDataConnection()
    addPreload('home-poster', useHighQualityMobilePoster ? homePosterMobile : homePoster, 'image')
  }

  if (pathname === '/smm') {
    addPreload('smm-lcp-image', smmToolsHeroImage, 'image')
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </React.StrictMode>,
)
