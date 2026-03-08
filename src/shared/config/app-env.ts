const readEnv = (value: string | undefined) => (typeof value === 'string' ? value.trim() : '')

export const appEnv = {
  siteUrl: readEnv(import.meta.env.VITE_SITE_URL) || 'https://space.dominium.com.ua',
  faqHomeSheetUrl: readEnv(import.meta.env.VITE_FAQ_HOME_SHEET_URL) || '/faq-cache.php?gid=0',
  faqSmmSheetUrl: readEnv(import.meta.env.VITE_FAQ_SMM_SHEET_URL) || '/faq-cache.php?gid=1942219183',
  faqDesignSheetUrl:
    readEnv(import.meta.env.VITE_FAQ_DESIGN_SHEET_URL) || '/faq-cache.php?gid=1925531033',
  faqWebSheetUrl: readEnv(import.meta.env.VITE_FAQ_WEB_SHEET_URL) || '/faq-cache.php?gid=338318137',
  designCardsSheetUrl: readEnv(import.meta.env.VITE_DESIGN_CARDS_SHEET_URL),
  telegramBotToken: readEnv(import.meta.env.VITE_TELEGRAM_BOT_TOKEN),
  telegramChatId: readEnv(import.meta.env.VITE_TELEGRAM_CHAT_ID),
  ga4MeasurementId: readEnv(import.meta.env.VITE_GA4_MEASUREMENT_ID),
  googleAdsId: readEnv(import.meta.env.VITE_GOOGLE_ADS_ID),
  googleAdsConversionLabel: readEnv(import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL),
  gtmId: readEnv(import.meta.env.VITE_GTM_ID),
  gscVerification: readEnv(import.meta.env.VITE_GSC_VERIFICATION),
}
