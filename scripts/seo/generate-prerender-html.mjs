import fs from 'node:fs'
import path from 'node:path'

const DIST_DIR = path.resolve(process.cwd(), 'dist')
const SITE_URL = (process.env.VITE_SITE_URL || 'https://space.dominium.com.ua').replace(/\/$/, '')
const SITE_NAME = 'Space Dominium'
const GSC_VERIFICATION = (process.env.VITE_GSC_VERIFICATION || '').trim()
const DEFAULT_OG_IMAGE = '/card-template.png'

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/card-template.png`,
  description:
    'Креативна агенція: веб-розробка, дизайн, SMM та автоматизація бізнес-процесів по всій Україні.',
  areaServed: ['UA', 'Київ', 'Львів', 'Закарпатська область'],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: ['uk-UA', 'en'],
}

const serviceSchema = (name, routePath, description, areaServed = ['UA']) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  serviceType: name,
  description,
  url: `${SITE_URL}${routePath}`,
  areaServed,
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
})

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: `Контакти ${SITE_NAME}`,
  url: `${SITE_URL}/contacts`,
  isPartOf: SITE_URL,
}

const routes = [
  {
    path: '/',
    title: 'Space Dominium — Creative агенція | Веб-розробка, дизайн, SMM',
    description:
      'Креативна агенція Space Dominium: веб-розробка, дизайн, SMM та автоматизація для бізнесу в Києві, Львові, Закарпатті та по всій Україні.',
    keywords:
      'creative агенція, веб-розробка, дизайн, smm, автоматизація, київ, львів, закарпаття',
    titleEn: 'Space Dominium — Creative agency | Web Development, Design, SMM',
    descriptionEn:
      'Creative agency for web development, design, SMM and automation across Ukraine with focus on Kyiv, Lviv and Zakarpattia.',
    summaryEn: 'Creative agency delivering web, design and SMM services across Ukraine.',
    schema: [websiteSchema, orgSchema],
  },
  {
    path: '/smm',
    title: 'SMM для бізнесу в Україні | Space Dominium',
    description:
      'SMM-стратегія, контент і таргетована реклама для бізнесу в Києві, Львові, Закарпатті та по всій Україні. Працюємо на результат.',
    titleEn: 'SMM Services in Ukraine | Space Dominium',
    descriptionEn:
      'SMM strategy, content and ad campaigns for businesses in Kyiv, Lviv, Zakarpattia and across Ukraine.',
    summaryEn: 'Result-driven social media marketing services for Ukrainian businesses.',
    schema: serviceSchema(
      'SMM послуги',
      '/smm',
      'Стратегія, контент і просування бренду в соцмережах для бізнесу в Україні.',
      ['UA', 'Київ', 'Львів', 'Закарпатська область'],
    ),
  },
  {
    path: '/design',
    title: 'Графічний дизайн бренду | Space Dominium',
    description:
      'Айдентика, візуальний стиль і креативні дизайн-системи для бізнесу в Києві, Львові, Закарпатті та по всій Україні.',
    titleEn: 'Brand Design Services | Space Dominium',
    descriptionEn:
      'Identity, visual systems and creative design for businesses in Kyiv, Lviv, Zakarpattia and across Ukraine.',
    summaryEn: 'Brand design and identity systems for business growth.',
    schema: serviceSchema(
      'Графічний дизайн',
      '/design',
      'Розробка айдентики та дизайн-систем для брендів і продуктів.',
      ['UA', 'Київ', 'Львів', 'Закарпатська область'],
    ),
  },
  {
    path: '/web-develop',
    title: 'Веб-розробка сайтів та автоматизація | Space Dominium',
    description:
      'Розробка сайтів, веб-сервісів і бізнес-автоматизації під ключ для компаній з Києва, Львова, Закарпаття та всієї України.',
    titleEn: 'Web Development & Automation | Space Dominium',
    descriptionEn:
      'Web development, custom products and business automation for companies in Kyiv, Lviv, Zakarpattia and all Ukraine.',
    summaryEn: 'Custom web development and automation for scalable business results.',
    schema: serviceSchema(
      'Веб-розробка',
      '/web-develop',
      'Розробка сайтів, веб-продуктів та автоматизація бізнес-процесів.',
      ['UA', 'Київ', 'Львів', 'Закарпатська область'],
    ),
  },
  {
    path: '/contacts',
    title: 'Контакти Space Dominium | Звʼяжіться з нами',
    description:
      'Залиште заявку Space Dominium: веб-розробка, дизайн і SMM. Працюємо онлайн по всій Україні, швидко повертаємось з відповіддю.',
    titleEn: 'Contact Space Dominium',
    descriptionEn: 'Send your project request and get a quick response from Space Dominium team.',
    summaryEn: 'Project request and contact page.',
    schema: [orgSchema, contactPageSchema],
  },
  {
    path: '/thanks',
    title: 'Дякуємо за заявку | Space Dominium',
    description: 'Сторінка підтвердження успішної відправки форми.',
    robots: 'noindex, nofollow, noarchive',
  },
  {
    path: '/not-found',
    title: 'Сторінку не знайдено (404) | Space Dominium',
    description: 'Сторінку не знайдено. Поверніться на головну Space Dominium.',
    robots: 'noindex, nofollow',
  },
]

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const upsertTag = (html, pattern, nextTag) => {
  if (pattern.test(html)) return html.replace(pattern, nextTag)
  return html.replace('</head>', `${nextTag}\n  </head>`)
}

const upsertMeta = (html, attr, key, content) => {
  if (!content) return html
  const escapedKey = escapeRegExp(key)
  const pattern = new RegExp(`<meta\\s+${attr}=["']${escapedKey}["'][^>]*>`, 'i')
  const nextTag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`
  return upsertTag(html, pattern, nextTag)
}

const upsertCanonical = (html, href) => {
  const pattern = /<link\s+rel=["']canonical["'][^>]*>/i
  const nextTag = `<link rel="canonical" href="${escapeHtml(href)}" />`
  return upsertTag(html, pattern, nextTag)
}

const toAbsoluteUrl = (pathOrUrl) => {
  if (!pathOrUrl) return SITE_URL
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE_URL}${normalizedPath}`
}

const normalizeSchema = (schema) => {
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

const upsertSchemaScript = (html, schema) => {
  const scriptId = 'sd-route-schema'
  const pattern = new RegExp(`<script[^>]*id=["']${scriptId}["'][^>]*>[\\s\\S]*?<\\/script>`, 'i')
  const normalizedSchema = normalizeSchema(schema)
  if (!normalizedSchema) return html.replace(pattern, '')
  const nextTag = `<script id="${scriptId}" type="application/ld+json">${JSON.stringify(normalizedSchema)}</script>`
  return upsertTag(html, pattern, nextTag)
}

const baseFilePath = path.join(DIST_DIR, 'index.html')
if (!fs.existsSync(baseFilePath)) {
  console.error(`Missing base dist html: ${baseFilePath}`)
  process.exit(1)
}
const baseHtml = fs.readFileSync(baseFilePath, 'utf8')

const renderRouteHtml = (html, routeConfig) => {
  const canonicalUrl = toAbsoluteUrl(routeConfig.path)
  const ogImageUrl = toAbsoluteUrl(routeConfig.ogImage || DEFAULT_OG_IMAGE)

  let next = html
  next = next.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(routeConfig.title)}</title>`)
  next = upsertCanonical(next, canonicalUrl)
  next = upsertMeta(next, 'name', 'description', routeConfig.description)
  next = upsertMeta(next, 'name', 'robots', routeConfig.robots || 'index, follow')
  next = upsertMeta(next, 'name', 'twitter:card', 'summary_large_image')
  next = upsertMeta(next, 'name', 'twitter:title', routeConfig.title)
  next = upsertMeta(next, 'name', 'twitter:description', routeConfig.description)
  next = upsertMeta(next, 'name', 'twitter:image', ogImageUrl)
  next = upsertMeta(next, 'property', 'og:site_name', SITE_NAME)
  next = upsertMeta(next, 'property', 'og:title', routeConfig.title)
  next = upsertMeta(next, 'property', 'og:description', routeConfig.description)
  next = upsertMeta(next, 'property', 'og:type', routeConfig.ogType || 'website')
  next = upsertMeta(next, 'property', 'og:url', canonicalUrl)
  next = upsertMeta(next, 'property', 'og:locale', 'uk_UA')
  next = upsertMeta(next, 'property', 'og:locale:alternate', 'en_US')
  next = upsertMeta(next, 'property', 'og:image', ogImageUrl)
  next = upsertMeta(next, 'property', 'og:image:width', '1200')
  next = upsertMeta(next, 'property', 'og:image:height', '630')
  next = upsertMeta(next, 'name', 'title:en', routeConfig.titleEn)
  next = upsertMeta(next, 'name', 'description:en', routeConfig.descriptionEn)
  next = upsertMeta(next, 'name', 'summary:en', routeConfig.summaryEn)
  next = upsertMeta(next, 'name', 'keywords', routeConfig.keywords)
  next = upsertMeta(next, 'name', 'google-site-verification', GSC_VERIFICATION || undefined)
  next = upsertSchemaScript(next, routeConfig.schema)
  return next
}

for (const routeConfig of routes) {
  const html = renderRouteHtml(baseHtml, routeConfig)
  const outputPath =
    routeConfig.path === '/'
      ? path.join(DIST_DIR, 'index.html')
      : path.join(DIST_DIR, routeConfig.path.replace(/^\//, ''), 'index.html')

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, html, 'utf8')
}

console.log(`Generated prerender-like route HTML for ${routes.length} routes in ${DIST_DIR}`)
