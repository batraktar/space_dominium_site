import fs from 'node:fs'
import path from 'node:path'

const DIST_DIR = path.resolve(process.cwd(), 'dist')
const SITE_URL = (process.env.VITE_SITE_URL || 'https://space.dominium.com.ua').replace(/\/$/, '')

const routes = ['/', '/smm', '/design', '/web-develop', '/contacts']

const routeToFilePath = (route) => {
  if (route === '/') return path.join(DIST_DIR, 'index.html')
  return path.join(DIST_DIR, route.replace(/^\//, ''), 'index.html')
}

const extractTagContent = (html, pattern) => {
  const match = html.match(pattern)
  return match?.[1]?.trim() || ''
}

const errors = []
const titles = new Set()
const descriptions = new Set()

for (const route of routes) {
  const filePath = routeToFilePath(route)
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing prerendered file: ${filePath}`)
    continue
  }

  const html = fs.readFileSync(filePath, 'utf8')
  const title = extractTagContent(html, /<title>([^<]+)<\/title>/i)
  const description = extractTagContent(
    html,
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
  )
  const canonical = extractTagContent(
    html,
    /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i,
  )
  const ogUrl = extractTagContent(
    html,
    /<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i,
  )

  if (!title) errors.push(`Missing <title> on ${route}`)
  if (!description) errors.push(`Missing meta description on ${route}`)

  const expectedCanonical = `${SITE_URL}${route === '/' ? '/' : route}`
  if (canonical !== expectedCanonical) {
    errors.push(`Canonical mismatch on ${route}: expected ${expectedCanonical}, got ${canonical || 'EMPTY'}`)
  }

  if (ogUrl !== expectedCanonical) {
    errors.push(`og:url mismatch on ${route}: expected ${expectedCanonical}, got ${ogUrl || 'EMPTY'}`)
  }

  if (title) {
    if (titles.has(title)) errors.push(`Duplicate title found: "${title}"`)
    titles.add(title)
  }
  if (description) {
    if (descriptions.has(description)) errors.push(`Duplicate description found: "${description}"`)
    descriptions.add(description)
  }
}

const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
if (!fs.existsSync(sitemapPath)) {
  errors.push('Missing public/sitemap.xml')
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8')
  if (sitemap.includes('/thanks')) {
    errors.push('sitemap.xml must not include /thanks')
  }
}

const robotsPath = path.join(process.cwd(), 'public', 'robots.txt')
if (!fs.existsSync(robotsPath)) {
  errors.push('Missing public/robots.txt')
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8')
  if (!robots.includes('Disallow: /thanks')) {
    errors.push('robots.txt must include "Disallow: /thanks"')
  }
  if (!robots.includes('Sitemap: https://space.dominium.com.ua/sitemap.xml')) {
    errors.push('robots.txt must include Sitemap line')
  }
}

if (errors.length > 0) {
  console.error('SEO build check failed:\n')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log('SEO build check passed')
