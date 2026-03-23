import type { SeoRouteConfig } from './types'
import { DEFAULT_SITE_URL, SITE_NAME } from '../config/site-constants'

const SITE_URL = DEFAULT_SITE_URL

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

const serviceSchema = (name: string, path: string, description: string, areaServed = ['UA']) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  serviceType: name,
  description,
  url: `${SITE_URL}${path}`,
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

const routes: Record<string, SeoRouteConfig> = {
  '/': {
    path: '/',
    title: 'Space Dominium — Creative агенція | Веб-розробка, дизайн, SMM',
    description:
      'Креативна агенція Space Dominium: веб-розробка, дизайн, SMM та автоматизація для бізнесу в Києві, Львові, Закарпатті та по всій Україні.',
    keywords:
      'creative агенція, веб-розробка, дизайн, smm, автоматизація, київ, львів, закарпаття',
    ogType: 'website',
    ogImage: '/card-template.png',
    schema: [websiteSchema, orgSchema],
    titleEn: 'Space Dominium — Creative agency | Web Development, Design, SMM',
    descriptionEn:
      'Creative agency for web development, design, SMM and automation across Ukraine with focus on Kyiv, Lviv and Zakarpattia.',
    summaryEn: 'Creative agency delivering web, design and SMM services across Ukraine.',
  },
  '/smm': {
    path: '/smm',
    title: 'SMM для бізнесу в Україні | Space Dominium',
    description:
      'SMM-стратегія, контент і таргетована реклама для бізнесу в Києві, Львові, Закарпатті та по всій Україні. Працюємо на результат.',
    ogType: 'website',
    ogImage: '/card-template.png',
    schema: serviceSchema(
      'SMM послуги',
      '/smm',
      'Стратегія, контент і просування бренду в соцмережах для бізнесу в Україні.',
      ['UA', 'Київ', 'Львів', 'Закарпатська область'],
    ),
    titleEn: 'SMM Services in Ukraine | Space Dominium',
    descriptionEn:
      'SMM strategy, content and ad campaigns for businesses in Kyiv, Lviv, Zakarpattia and across Ukraine.',
    summaryEn: 'Result-driven social media marketing services for Ukrainian businesses.',
  },
  '/design': {
    path: '/design',
    title: 'Графічний дизайн бренду | Space Dominium',
    description:
      'Айдентика, візуальний стиль і креативні дизайн-системи для бізнесу в Києві, Львові, Закарпатті та по всій Україні.',
    ogType: 'website',
    ogImage: '/card-template.png',
    schema: serviceSchema(
      'Графічний дизайн',
      '/design',
      'Розробка айдентики та дизайн-систем для брендів і продуктів.',
      ['UA', 'Київ', 'Львів', 'Закарпатська область'],
    ),
    titleEn: 'Brand Design Services | Space Dominium',
    descriptionEn:
      'Identity, visual systems and creative design for businesses in Kyiv, Lviv, Zakarpattia and across Ukraine.',
    summaryEn: 'Brand design and identity systems for business growth.',
  },
  '/web-develop': {
    path: '/web-develop',
    title: 'Веб-розробка сайтів та автоматизація | Space Dominium',
    description:
      'Розробка сайтів, веб-сервісів і бізнес-автоматизації під ключ для компаній з Києва, Львова, Закарпаття та всієї України.',
    ogType: 'website',
    ogImage: '/card-template.png',
    schema: serviceSchema(
      'Веб-розробка',
      '/web-develop',
      'Розробка сайтів, веб-продуктів та автоматизація бізнес-процесів.',
      ['UA', 'Київ', 'Львів', 'Закарпатська область'],
    ),
    titleEn: 'Web Development & Automation | Space Dominium',
    descriptionEn:
      'Web development, custom products and business automation for companies in Kyiv, Lviv, Zakarpattia and all Ukraine.',
    summaryEn: 'Custom web development and automation for scalable business results.',
  },
  '/contacts': {
    path: '/contacts',
    title: 'Контакти Space Dominium | Звʼяжіться з нами',
    description:
      'Залиште заявку Space Dominium: веб-розробка, дизайн і SMM. Працюємо онлайн по всій Україні, швидко повертаємось з відповіддю.',
    ogType: 'website',
    ogImage: '/card-template.png',
    schema: [orgSchema, contactPageSchema],
    titleEn: 'Contact Space Dominium',
    descriptionEn: 'Send your project request and get a quick response from Space Dominium team.',
    summaryEn: 'Project request and contact page.',
  },
  '/thanks': {
    path: '/thanks',
    title: 'Дякуємо за заявку | Space Dominium',
    description: 'Сторінка підтвердження успішної відправки форми.',
    robots: 'noindex, nofollow, noarchive',
    ogType: 'website',
    ogImage: '/card-template.png',
  },
  '/not-found': {
    path: '/not-found',
    title: 'Сторінку не знайдено (404) | Space Dominium',
    description: 'Сторінку не знайдено. Поверніться на головну Space Dominium.',
    robots: 'noindex, nofollow',
    ogType: 'website',
    ogImage: '/card-template.png',
  },
  // Тимчасово вимкнено регіональні SEO-конфіги.
  // '/ua': { ... },
  // '/ua/kyiv': { ... },
  // '/ua/lviv': { ... },
  // '/ua/zakarpattia': { ... },
  // '/ua/ukraine': { ... },
}

const normalizePath = (pathname: string) => {
  if (!pathname) return '/'
  if (pathname === '*') return '/not-found'
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

export const seoRoutes = routes

export const getSeoRouteConfig = (pathname: string): SeoRouteConfig => {
  const normalized = normalizePath(pathname)
  return routes[normalized] ?? routes['/not-found']
}
