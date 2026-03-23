import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { appEnv } from '../config/app-env'
import { SITE_NAME } from '../config/site-constants'
import { getSeoRouteConfig } from './seo-config'
import type { JsonLdNode } from './types'

const DEFAULT_OG_IMAGE = '/card-template.png'

const normalizeSiteUrl = (url: string) => {
  const trimmed = (url || '').trim()
  if (!trimmed) return appEnv.siteUrl
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

const toAbsoluteUrl = (siteUrl: string, pathOrUrl: string) => {
  if (!pathOrUrl) return siteUrl
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${siteUrl}${normalizedPath}`
}

const normalizeSchema = (schema: JsonLdNode | JsonLdNode[] | undefined) => {
  if (!schema) return undefined
  if (!Array.isArray(schema)) return schema
  return {
    '@context': 'https://schema.org',
    '@graph': schema.map((entry) => {
      const rest = { ...entry }
      delete rest['@context']
      return rest
    }),
  }
}

export default function SeoHead() {
  const location = useLocation()
  const config = getSeoRouteConfig(location.pathname)
  const siteUrl = normalizeSiteUrl(appEnv.siteUrl)
  const canonicalPath = config.canonical ?? config.path
  const canonicalUrl = toAbsoluteUrl(siteUrl, canonicalPath)
  const ogImageAbsoluteUrl = toAbsoluteUrl(siteUrl, config.ogImage || DEFAULT_OG_IMAGE)
  const schema = normalizeSchema(config.schema)

  return (
    <Helmet htmlAttributes={{ lang: 'uk' }}>
      <title>{config.title}</title>
      <link rel="canonical" href={canonicalUrl} />

      <meta name="description" content={config.description} />
      <meta name="robots" content={config.robots || 'index, follow'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={config.title} />
      <meta name="twitter:description" content={config.description} />
      <meta name="twitter:image" content={ogImageAbsoluteUrl} />

      {config.keywords ? <meta name="keywords" content={config.keywords} /> : null}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={config.title} />
      <meta property="og:description" content={config.description} />
      <meta property="og:type" content={config.ogType || 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="uk_UA" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:image" content={ogImageAbsoluteUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {config.titleEn ? <meta name="title:en" content={config.titleEn} /> : null}
      {config.descriptionEn ? <meta name="description:en" content={config.descriptionEn} /> : null}
      {config.summaryEn ? <meta name="summary:en" content={config.summaryEn} /> : null}

      {appEnv.gscVerification ? (
        <meta name="google-site-verification" content={appEnv.gscVerification} />
      ) : null}

      {schema ? (
        <script id="sd-route-schema" type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ) : null}
    </Helmet>
  )
}
