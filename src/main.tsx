import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import { initAnalytics } from './shared/analytics/analytics'
import './styles/main.scss'
import homePoster from './assets/video/laptop_people_poster.webp'
import smmToolsHeroImage from './assets/img/smm-tools/saas.png'

import { BrowserRouter as Router } from 'react-router-dom'

if (typeof document !== 'undefined') {
  initAnalytics()

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
    addPreload('home-poster', homePoster, 'image')
  }

  if (pathname === '/smm') {
    addPreload('smm-lcp-image', smmToolsHeroImage, 'image')
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)
