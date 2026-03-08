#!/usr/bin/env node

import { mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const [, , modeArg = 'mobile', routeArg = '/'] = process.argv
const mode = modeArg === 'desktop' ? 'desktop' : 'mobile'
const route = routeArg.startsWith('/') ? routeArg : `/${routeArg}`
const routeSlug = route === '/' ? 'home' : route.slice(1).replace(/\//g, '-')
const baseUrl = process.env.LH_BASE_URL || 'http://127.0.0.1:4173'
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const outputDir = join('reports', 'lighthouse', mode, routeSlug)

mkdirSync(outputDir, { recursive: true })

const outputPath = join(outputDir, `lh_${mode}_${routeSlug}_${timestamp}.json`)
const url = `${baseUrl}${route}`

const args = [
  '-y',
  'lighthouse',
  url,
  '--output=json',
  `--output-path=${outputPath}`,
  "--chrome-flags=--headless=new --no-sandbox",
  '--only-categories=performance,accessibility,best-practices,seo',
  '--quiet',
]

if (mode === 'desktop') {
  args.splice(4, 0, '--preset=desktop')
}

const result = spawnSync('npx', args, { stdio: 'inherit' })

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}

console.log(`Saved Lighthouse report: ${outputPath}`)
