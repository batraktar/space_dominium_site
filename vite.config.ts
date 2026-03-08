import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { getSeoRouteConfig } from './src/shared/seo/seo-config'
import type { JsonLdNode } from './src/shared/seo/types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const vitePrerender = require('vite-plugin-prerender')
const siteUrl = (process.env.VITE_SITE_URL || 'https://space.dominium.com.ua').replace(/\/$/, '')
const gscVerification = (process.env.VITE_GSC_VERIFICATION || '').trim()

const prerenderRoutes = [
  '/',
  '/smm',
  '/design',
  '/web-develop',
  '/contacts',
  '/thanks',
  '/not-found',
  // Тимчасово вимкнено:
  // '/ua',
  // '/ua/kyiv',
  // '/ua/lviv',
  // '/ua/zakarpattia',
  // '/ua/ukraine',
]

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const upsertTag = (html: string, pattern: RegExp, nextTag: string) => {
  if (pattern.test(html)) {
    return html.replace(pattern, nextTag)
  }
  return html.replace('</head>', `${nextTag}\n  </head>`)
}

const upsertMeta = (
  html: string,
  attr: 'name' | 'property',
  key: string,
  content: string | undefined,
) => {
  if (!content) return html
  const escapedKey = escapeRegExp(key)
  const pattern = new RegExp(`<meta\\s+${attr}=["']${escapedKey}["'][^>]*>`, 'i')
  const nextTag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`
  return upsertTag(html, pattern, nextTag)
}

const upsertCanonical = (html: string, href: string) => {
  const pattern = /<link\s+rel=["']canonical["'][^>]*>/i
  const nextTag = `<link rel="canonical" href="${escapeHtml(href)}" />`
  return upsertTag(html, pattern, nextTag)
}

const toAbsoluteUrl = (pathOrUrl: string) => {
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

const upsertSchemaScript = (html: string, schema: JsonLdNode | JsonLdNode[] | undefined) => {
  const scriptId = 'sd-route-schema'
  const pattern = new RegExp(`<script[^>]*id=["']${scriptId}["'][^>]*>[\\s\\S]*?<\\/script>`, 'i')
  const normalizedSchema = normalizeSchema(schema)

  if (!normalizedSchema) {
    return html.replace(pattern, '')
  }

  const nextTag = `<script id="${scriptId}" type="application/ld+json">${JSON.stringify(normalizedSchema)}</script>`
  return upsertTag(html, pattern, nextTag)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: prerenderRoutes,
      postProcess: (renderedRoute: { originalRoute: string; html: string }) => {
        const routeConfig = getSeoRouteConfig(renderedRoute.originalRoute)
        const canonicalPath = routeConfig.canonical ?? routeConfig.path
        const canonicalUrl = toAbsoluteUrl(canonicalPath)
        const ogImageUrl = toAbsoluteUrl(routeConfig.ogImage || '/card-template.png')

        let html = renderedRoute.html
        html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(routeConfig.title)}</title>`)
        html = upsertCanonical(html, canonicalUrl)
        html = upsertMeta(html, 'name', 'description', routeConfig.description)
        html = upsertMeta(html, 'name', 'robots', routeConfig.robots || 'index, follow')
        html = upsertMeta(html, 'name', 'twitter:card', 'summary_large_image')
        html = upsertMeta(html, 'name', 'twitter:title', routeConfig.title)
        html = upsertMeta(html, 'name', 'twitter:description', routeConfig.description)
        html = upsertMeta(html, 'name', 'twitter:image', ogImageUrl)
        html = upsertMeta(html, 'property', 'og:site_name', 'Space Dominium')
        html = upsertMeta(html, 'property', 'og:title', routeConfig.title)
        html = upsertMeta(html, 'property', 'og:description', routeConfig.description)
        html = upsertMeta(html, 'property', 'og:type', routeConfig.ogType || 'website')
        html = upsertMeta(html, 'property', 'og:url', canonicalUrl)
        html = upsertMeta(html, 'property', 'og:locale', 'uk_UA')
        html = upsertMeta(html, 'property', 'og:locale:alternate', 'en_US')
        html = upsertMeta(html, 'property', 'og:image', ogImageUrl)
        html = upsertMeta(html, 'property', 'og:image:width', '1200')
        html = upsertMeta(html, 'property', 'og:image:height', '630')
        html = upsertMeta(html, 'name', 'title:en', routeConfig.titleEn)
        html = upsertMeta(html, 'name', 'description:en', routeConfig.descriptionEn)
        html = upsertMeta(html, 'name', 'summary:en', routeConfig.summaryEn)
        html = upsertMeta(html, 'name', 'google-site-verification', gscVerification || undefined)
        html = upsertSchemaScript(html, routeConfig.schema)

        renderedRoute.html = html
        return renderedRoute
      },
    }),
  ],
})
