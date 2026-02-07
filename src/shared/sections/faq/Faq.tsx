import { useEffect, useLayoutEffect, useRef, useState, type FC, type CSSProperties } from 'react'
import Papa from 'papaparse'
import './faq.scss'

type FaqItem = { question: string; answer: string }
type CachePayload = { ts: number; items: FaqItem[] }

const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const GID_REGEX = /[?&]gid=(\d+)/

const resolveSheetUrl = (sheetUrl: string) => {
  if (!import.meta.env.PROD) return sheetUrl
  const match = sheetUrl.match(GID_REGEX)
  if (!match) return sheetUrl
  return `/faq-cache.php?gid=${match[1]}`
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

const saveCache = (key: string, items: FaqItem[]) => {
  if (typeof window === 'undefined') return
  try {
    const payload: CachePayload = { ts: Date.now(), items }
    window.localStorage.setItem(key, JSON.stringify(payload))
  } catch {
    // ignore cache write errors
  }
}

type Props = {
  sheetUrl: string
  plusColor?: string
  titleColor?: string
  textColor?: string
}

const Faq: FC<Props> = ({
  sheetUrl,
  plusColor = '#0A0A60',
  titleColor = '#0A0A60',
  textColor = '#0A0A60',
}) => {
  const [open, setOpen] = useState<Set<number>>(() => new Set())
  const [items, setItems] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [measureTick, setMeasureTick] = useState(0)
  const answerRefs = useRef<Array<HTMLDivElement | null>>([])

  useLayoutEffect(() => {
    setMeasureTick((tick) => tick + 1)
  }, [items.length])

  useEffect(() => {
    const controller = new AbortController()
    const resolvedUrl = resolveSheetUrl(sheetUrl)
    const cacheKey = `faq-cache:${sheetUrl}`
    const cached = loadCache(cacheKey)
    const hasCache = Boolean(cached?.items?.length)
    if (hasCache && cached) {
      setItems(cached.items)
      setLoading(false)
    }

    const isFresh = cached ? Date.now() - cached.ts < CACHE_TTL_MS : false
    if (isFresh) {
      return () => controller.abort()
    }

    ;(async () => {
      try {
        if (!hasCache) setLoading(true)
        setErr(null)
        const res = await fetch(resolvedUrl, { signal: controller.signal })
        if (!res.ok) throw new Error(`Failed to load FAQ (${res.status})`)
        const text = await res.text()

        const result = Papa.parse<string[]>(text, {
          header: false,
          skipEmptyLines: true,
        })

        const rows = result.data
        if (rows.length > 1) {
          // Skip header row
          const [, ...data] = rows
          const nextItems = data
            .map((r) => ({ question: r[0] ?? '', answer: r[1] ?? '' }))
            .filter((x) => x.question && x.answer)
          setItems(nextItems)
          saveCache(cacheKey, nextItems)
        } else {
          setItems([])
          saveCache(cacheKey, [])
        }
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return
        const message = e instanceof Error ? e.message : 'Unknown error'
        if (!hasCache) setErr(message)
      } finally {
        setLoading(false)
      }
    })()
    return () => controller.abort()
  }, [sheetUrl])

  type QuestionCssVars = CSSProperties & {
    '--faq-plus': string
    '--faq-title': string
    '--faq-text': string
  }

  const rootStyle: QuestionCssVars = {
    '--faq-plus': plusColor,
    '--faq-title': titleColor,
    '--faq-text': textColor,
  }

  return (
    <section className="question" style={rootStyle}>
      <div className="ques_wrapper">
        <h2 className="ques_title" style={{ color: 'var(--faq-title)' }}>
          Актуальні питання
        </h2>

        {loading && items.length === 0 && <p>Завантажуємо питання…</p>}
        {err && items.length === 0 && <p>Не вдалося завантажити FAQ: {err}</p>}

        {!loading &&
          !err &&
          items.map((item, idx) => {
            const isActive = open.has(idx)
            const answerId = `ans-${idx}`
            const answerHeight = answerRefs.current[idx]?.scrollHeight ?? 0
            const answerStyle: CSSProperties = {
              maxHeight: isActive ? `${answerHeight}px` : '0px',
            }

            return (
              <div key={idx} className={`faq_item ${isActive ? 'active' : ''}`}>
                <button
                  className="faq_question"
                  onClick={() =>
                    setOpen((prev) => {
                      const next = new Set(prev)
                      if (next.has(idx)) {
                        next.delete(idx)
                      } else {
                        next.add(idx)
                      }
                      return next
                    })
                  }
                  aria-expanded={isActive}
                  aria-controls={answerId}
                  type="button"
                >
                  {item.question}
                  <span className="faq_icon" style={{ color: 'var(--faq-plus)' }}>
                    <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M9 1v16M1 9h16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                <div id={answerId} className="faq_answer" style={answerStyle}>
                  <div
                    className="faq_answer_inner"
                    ref={(node) => {
                      answerRefs.current[idx] = node
                    }}
                    data-measure={measureTick}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </section>
  )
}

export default Faq
