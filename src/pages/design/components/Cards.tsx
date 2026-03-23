import React from 'react'
import Papa from 'papaparse'
import { appEnv } from '../../../shared/config/app-env'
import styles from './cards.module.scss'

export type CardItem = {
  text: string
  name: string
  role: string
}

type Props = {
  items?: CardItem[]
  sheetUrl?: string
  initialIndex?: number
}

type CachePayload = {
  ts: number
  items: CardItem[]
}

const MAX_ACTIVE_CARDS = 6
const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const DEFAULT_SHEET_URL = appEnv.designCardsSheetUrl

const defaultItems: CardItem[] = [
  {
    text:
      "Вибач, Canva, нам треба розійтись. Ти була зручною на старті, але мій бізнес переріс рівень 'картинок з інтернету'. Мені потрібен стиль, який належить тільки мені.",
    name: 'ВАШ ПРОЩАЛЬНИЙ ЛИСТ',
    role: 'До шаблонних рішень',
  },
  {
    text:
      'We believe design is more than aesthetics. It is a tool that connects brands with people and drives growth by combining creativity and functionality. Our process balances strategy, clarity, and visual storytelling to help your product stand out.',
    name: 'IRYNA K.',
    role: 'LEAD BRAND DESIGNER',
  },
  {
    text:
      'From early discovery to final delivery, we build systems that scale: logos, brand guidelines, packaging, and digital experiences that feel cohesive and memorable across every touchpoint.',
    name: 'OLEKSII H.',
    role: 'ART DIRECTOR',
  },
  {
    text:
      'Great design should be useful, honest, and modern. We translate complex ideas into clear visuals, ensuring every detail supports your business goals.',
    name: 'MARIA D.',
    role: 'SENIOR UX/UI DESIGNER',
  },
  {
    text:
      'Коли в бренді є система, команда перестає вигадувати кожен макет з нуля. Ви економите час і отримуєте стабільну якість у всіх каналах.',
    name: 'ANNA S.',
    role: 'BRAND STRATEGIST',
  },
]

const normalizeKey = (value: string) =>
  value.toLowerCase().replace(/[\s\-_[\]{}()"',.:;!?/\\`’]+/g, '')

const resolveSheetUrl = (input: string) => {
  try {
    const url = new URL(input)
    if (url.pathname.endsWith('/pubhtml')) {
      url.pathname = url.pathname.replace('/pubhtml', '/pub')
    }
    if (url.pathname.endsWith('/pub')) {
      url.searchParams.set('output', 'csv')
      url.searchParams.set('single', 'true')
    }
    return url.toString()
  } catch {
    return input
  }
}

const shuffle = <T,>(array: T[]) => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const loadCache = (key: string): CachePayload | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachePayload
    if (!parsed || !Array.isArray(parsed.items)) return null
    return parsed
  } catch {
    return null
  }
}

const saveCache = (key: string, items: CardItem[]) => {
  if (typeof window === 'undefined') return
  try {
    const payload: CachePayload = { ts: Date.now(), items }
    window.localStorage.setItem(key, JSON.stringify(payload))
  } catch {
    // ignore cache write errors
  }
}

const dedupeAndFill = (incoming: CardItem[], fallback: CardItem[], limit: number) => {
  const map = new Map<string, CardItem>()
  ;[...incoming, ...fallback].forEach((item) => {
    const key = `${item.text}|${item.name}|${item.role}`
    if (!map.has(key)) map.set(key, item)
  })
  const merged = Array.from(map.values())
  if (merged.length === 0) return []
  const initialLength = merged.length
  while (merged.length < limit) {
    merged.push(merged[(merged.length - initialLength) % initialLength])
  }
  return merged
}

const pickRowValue = (row: Record<string, unknown>, candidates: string[]) => {
  const values = new Map<string, string>()
  Object.entries(row).forEach(([key, value]) => {
    const text = typeof value === 'string' ? value.trim() : ''
    if (text) values.set(normalizeKey(key), text)
  })

  for (const candidate of candidates) {
    const value = values.get(normalizeKey(candidate))
    if (value) return value
  }
  return ''
}

type ParsedCompareText = {
  client: string
  translation: string
}

const parseCompareText = (text: string): ParsedCompareText | null => {
  const match = text.match(
    /клієнт\s*[:\--]\s*([\s\S]+?)\s*переклад\s*[:\--]\s*([\s\S]+)/i,
  )
  if (!match) return null

  const client = match[1]?.trim()
  const translation = match[2]?.trim()
  if (!client || !translation) return null

  return { client, translation }
}

const Cards: React.FC<Props> = ({ items, sheetUrl = DEFAULT_SHEET_URL, initialIndex = 0 }) => {
  const [sheetItems, setSheetItems] = React.useState<CardItem[] | null>(null)
  const useSheet = !items?.length
  const hasSheetUrl = Boolean(sheetUrl?.trim())

  React.useEffect(() => {
    if (!useSheet || !hasSheetUrl) return
    const controller = new AbortController()
    const resolvedSheetUrl = resolveSheetUrl(sheetUrl)
    const cacheKey = `cards-cache:${sheetUrl}`
    const cached = loadCache(cacheKey)
    const hasCache = Boolean(cached?.items?.length)
    if (hasCache && cached) {
      setSheetItems(cached.items)
    }

    const isFresh = cached ? Date.now() - cached.ts < CACHE_TTL_MS : false
    if (isFresh) {
      return () => controller.abort()
    }

    ;(async () => {
      try {
        const response = await fetch(resolvedSheetUrl, { signal: controller.signal })
        if (!response.ok) throw new Error(`Failed to load cards sheet (${response.status})`)
        const csv = await response.text()
        const parsed = Papa.parse<Record<string, string>>(csv, {
          header: true,
          skipEmptyLines: true,
        })

        const mapped = parsed.data
          .map((row) => ({
            text: pickRowValue(row, [
              'Текст для картки (Цитата)',
              'Текст для картки',
              'Цитата',
              'text',
            ]),
            name: pickRowValue(row, ['Заголовок (Bold)', 'Заголовок', 'name', 'title']),
            role: pickRowValue(row, ['Підзаголовок (Small)', 'Підзаголовок', 'role', 'subtitle']),
          }))
          .filter((item) => item.text && item.name && item.role)

        const pool = dedupeAndFill(mapped, defaultItems, MAX_ACTIVE_CARDS)
        const selected = shuffle(pool).slice(0, MAX_ACTIVE_CARDS)
        setSheetItems(selected)
        saveCache(cacheKey, selected)
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        if (!hasCache) setSheetItems(null)
      }
    })()

    return () => controller.abort()
  }, [sheetUrl, useSheet, hasSheetUrl])

  const baseItems = React.useMemo(
    () => (items?.length ? items : sheetItems?.length ? sheetItems : defaultItems),
    [items, sheetItems],
  )
  const safeItems = React.useMemo(
    () => dedupeAndFill(baseItems, defaultItems, MAX_ACTIVE_CARDS).slice(0, MAX_ACTIVE_CARDS),
    [baseItems],
  )
  const [activeIndex, setActiveIndex] = React.useState(() =>
    Math.min(Math.max(initialIndex, 0), safeItems.length - 1),
  )

  React.useEffect(() => {
    if (activeIndex >= safeItems.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, safeItems.length])

  const total = safeItems.length
  const canCycle = total > 1
  const hasPrev = activeIndex > 0
  const hasNext = activeIndex < total - 1

  const handlePrev = () => {
    if (!hasPrev) return
    setActiveIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    if (!hasNext) return
    setActiveIndex((prev) => Math.min(prev + 1, total - 1))
  }

  const stackClass =
    total <= 1
      ? styles.cards__stackSingle
      : total === 2
        ? styles.cards__stackDouble
        : ''

  return (
    <section className={styles.cards}>
      <div className={styles.cards__inner}>
        <div className={`${styles.cards__stack} ${stackClass}`}>
          <div className={styles.cards__viewport}>
            <div
              className={styles.cards__track}
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {safeItems.map((item, idx) => {
                const parsed = parseCompareText(item.text)
                return (
                  <article className={styles.card} key={`${item.name}-${idx}`}>
                    {!parsed ? (
                      <p className={styles.card__text}>{item.text}</p>
                    ) : (
                      <div className={styles.card__compare}>
                        <div className={styles.card__compareBlock}>
                          <span className={styles.card__compareLabel}>Клієнт</span>
                          <p className={styles.card__compareText}>{parsed.client}</p>
                        </div>

                        <div className={styles.card__compareDivider} aria-hidden>
                          ↓
                        </div>

                        <div className={styles.card__compareBlock}>
                          <span className={styles.card__compareLabel}>Переклад</span>
                          <p className={styles.card__compareText}>{parsed.translation}</p>
                        </div>
                      </div>
                    )}

                    <div className={styles.card__footer}>
                      <div className={styles.card__author}>
                        <span className={styles.card__name}>{item.name}</span>
                        <span className={styles.card__role}>{item.role}</span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          {canCycle && (
            <>
              {hasPrev && (
                <button
                  className={`${styles.cards__arrow} ${styles.cards__arrowLeft}`}
                  type="button"
                  aria-label="Previous card"
                  onClick={handlePrev}
                >
                  <svg viewBox="0 0 20 20" aria-hidden>
                    <path
                      d="M16 10H5.2l4.6-4.6L8.4 4l-7 7 7 7 1.4-1.4-4.6-4.6H16z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              )}
              {hasNext && (
                <button
                  className={`${styles.cards__arrow} ${styles.cards__arrowRight}`}
                  type="button"
                  aria-label="Next card"
                  onClick={handleNext}
                >
                  <svg viewBox="0 0 20 20" aria-hidden>
                    <path
                      d="M4 10h10.8l-4.6-4.6L11.6 4l7 7-7 7-1.4-1.4 4.6-4.6H4z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>

        {canCycle && (
          <div className={styles.cards__nav}>
            {safeItems.map((item, idx) => (
              <button
                key={`${item.name}-${idx}`}
                type="button"
                className={`${styles.cards__dot} ${idx === activeIndex ? styles.cards__dotActive : ''}`}
                aria-label={`Show card ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Cards
