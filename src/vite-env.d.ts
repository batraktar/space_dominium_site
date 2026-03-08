/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_FAQ_HOME_SHEET_URL?: string
  readonly VITE_FAQ_SMM_SHEET_URL?: string
  readonly VITE_FAQ_DESIGN_SHEET_URL?: string
  readonly VITE_FAQ_WEB_SHEET_URL?: string
  readonly VITE_DESIGN_CARDS_SHEET_URL?: string
  readonly VITE_TELEGRAM_BOT_TOKEN?: string
  readonly VITE_TELEGRAM_CHAT_ID?: string
  readonly VITE_GA4_MEASUREMENT_ID?: string
  readonly VITE_GOOGLE_ADS_ID?: string
  readonly VITE_GOOGLE_ADS_CONVERSION_LABEL?: string
  readonly VITE_GTM_ID?: string
  readonly VITE_GSC_VERIFICATION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
