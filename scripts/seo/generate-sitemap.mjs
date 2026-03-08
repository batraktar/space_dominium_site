import fs from 'node:fs'
import path from 'node:path'

const SITE_URL = (process.env.VITE_SITE_URL || 'https://space.dominium.com.ua').replace(/\/$/, '')
const OUT_FILE = path.resolve(process.cwd(), 'public', 'sitemap.xml')

const routes = [
  '/',
  '/smm',
  '/design',
  '/web-develop',
  '/contacts',
]

const now = new Date().toISOString()

const urls = routes
  .map((route) => {
    const loc = `${SITE_URL}${route === '/' ? '/' : route}`
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${now}</lastmod>`,
      '    <changefreq>weekly</changefreq>',
      `    <priority>${route === '/' ? '1.0' : '0.8'}</priority>`,
      '  </url>',
    ].join('\n')
  })
  .join('\n')

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urls,
  '</urlset>',
  '',
].join('\n')

fs.writeFileSync(OUT_FILE, xml, 'utf8')
console.log(`Generated sitemap: ${OUT_FILE}`)
