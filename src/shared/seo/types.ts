export type JsonLdNode = Record<string, unknown>

export type SeoRouteConfig = {
  path: string
  title: string
  description: string
  canonical?: string
  keywords?: string
  ogImage?: string
  ogType?: string
  robots?: string
  schema?: JsonLdNode | JsonLdNode[]
  titleEn?: string
  descriptionEn?: string
  summaryEn?: string
}
