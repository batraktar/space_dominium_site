import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { appEnv } from '../config/app-env'
import { getSeoRouteConfig } from './seo-config'
import type { JsonLdNode } from './types'

const DEFAULT_OG_IMAGE = '/card-template.png'
const ROUTE_SCHEMA_SCRIPT_ID = 'sd-route-schema'

const normalizeSiteUrl = (url: string) => {
  const trimmed = (url || '').trim()
  if (!trimmed) return 'https://space.dominium.com.ua'
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

const toAbsoluteUrl = (siteUrl: string, pathOrUrl: string) => {
  if (!pathOrUrl) return siteUrl
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${siteUrl}${normalizedPath}`
}

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  const selector = `meta[${attr}="${key}"]`
  let node = document.head.querySelector<HTMLMetaElement>(selector)

  if (!node) {
    node = document.createElement('meta')
    node.setAttribute(attr, key)
    document.head.appendChild(node)
  }

  node.setAttribute('content', content)
}

const upsertCanonical = (href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

const upsertSchema = (schema: JsonLdNode | JsonLdNode[] | undefined) => {
  const existing = document.getElementById(ROUTE_SCHEMA_SCRIPT_ID)
  if (!schema) {
    existing?.remove()
    return
  }

  const value = Array.isArray(schema)
    ? {
        '@context': 'https://schema.org',
        '@graph': schema.map((entry) => {
          const rest = { ...entry }
          delete rest['@context']
          return rest
        }),
      }
    : schema

  const script = existing ?? document.createElement('script')
  script.id = ROUTE_SCHEMA_SCRIPT_ID
  script.setAttribute('type', 'application/ld+json')
  script.textContent = JSON.stringify(value)

  if (!existing) {
    document.head.appendChild(script)
  }
}

export default function SeoHead() {
  const location = useLocation()

  useEffect(() => {
    const config = getSeoRouteConfig(location.pathname)
    const siteUrl = normalizeSiteUrl(appEnv.siteUrl)
    const canonicalPath = config.canonical ?? config.path
    const canonicalUrl = toAbsoluteUrl(siteUrl, canonicalPath)
    const ogImageAbsoluteUrl = toAbsoluteUrl(siteUrl, config.ogImage || DEFAULT_OG_IMAGE)

    document.title = config.title
    document.documentElement.lang = 'uk'

    upsertMeta('name', 'description', config.description)
    upsertMeta('name', 'robots', config.robots || 'index, follow')
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', config.title)
    upsertMeta('name', 'twitter:description', config.description)
    upsertMeta('name', 'twitter:image', ogImageAbsoluteUrl)

    if (config.keywords) {
      upsertMeta('name', 'keywords', config.keywords)
    }

    upsertMeta('property', 'og:site_name', 'Space Dominium')
    upsertMeta('property', 'og:title', config.title)
    upsertMeta('property', 'og:description', config.description)
    upsertMeta('property', 'og:type', config.ogType || 'website')
    upsertMeta('property', 'og:url', canonicalUrl)
    upsertMeta('property', 'og:locale', 'uk_UA')
    upsertMeta('property', 'og:locale:alternate', 'en_US')
    upsertMeta('property', 'og:image', ogImageAbsoluteUrl)
    upsertMeta('property', 'og:image:width', '1200')
    upsertMeta('property', 'og:image:height', '630')

    if (config.titleEn) {
      upsertMeta('name', 'title:en', config.titleEn)
    }
    if (config.descriptionEn) {
      upsertMeta('name', 'description:en', config.descriptionEn)
    }
    if (config.summaryEn) {
      upsertMeta('name', 'summary:en', config.summaryEn)
    }

    if (appEnv.gscVerification) {
      upsertMeta('name', 'google-site-verification', appEnv.gscVerification)
    }

    upsertCanonical(canonicalUrl)
    upsertSchema(config.schema)
  }, [location.pathname])

  return null
}
