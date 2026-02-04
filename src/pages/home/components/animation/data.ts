import appsIcon from './assets/icons/apps.svg'
import brandStyleIcon from './assets/icons/brand-style.svg'
import retailIcon from './assets/icons/retail.svg'
import sitesIcon from './assets/icons/sites.svg'
import socialIcon from './assets/icons/social.svg'

import appsAdsSetup from './assets/items/apps/apps-ads-setup.svg'
import appsCreativeConcepts from './assets/items/apps/apps-creative-concepts.svg'
import appsLandingAds from './assets/items/apps/apps-landing-ads.svg'
import appsReportAnalysis from './assets/items/apps/apps-report-analysis.svg'

import brandGuidelines from './assets/items/brand-style/brand-guidelines.svg'
import brandIdentity from './assets/items/brand-style/brand-identity.svg'
import brandLogo from './assets/items/brand-style/brand-logo.svg'
import brandPrintDesign from './assets/items/brand-style/brand-print-design.svg'

import retailAutomation from './assets/items/retail/retail-automation.svg'
import retailCrmBots from './assets/items/retail/retail-crm-bots.svg'
import retailSimpleFeatures from './assets/items/retail/retail-simple-features.svg'
import retailTesting from './assets/items/retail/retail-testing.svg'
import retailUserAdminCabinet from './assets/items/retail/retail-user-admin-cabinet.svg'

import sitesBasicSeo from './assets/items/sites/sites-basic-seo.svg'
import sitesDatabase from './assets/items/sites/sites-database.svg'
import sitesFrontendLayout from './assets/items/sites/sites-frontend-layout.svg'
import sitesResponsive from './assets/items/sites/sites-responsive.svg'
import sitesUiDesign from './assets/items/sites/sites-ui-design.svg'

import socialContentPlan from './assets/items/social/social-content-plan.svg'
import socialCopywriting from './assets/items/social/social-copywriting.svg'
import socialPostsStoriesTemplates from './assets/items/social/social-posts-stories-templates.svg'
import socialProfileVisual from './assets/items/social/social-profile-visual.svg'
import socialTargetedAds from './assets/items/social/social-targeted-ads.svg'

export type TabId = 'social' | 'brandStyle' | 'sites' | 'retail' | 'apps'

export interface Variant {
  id: string
  thumb: string
  contentIcon: string
  bullets: string[]
}

export interface Tab {
  id: TabId
  label: string
  navIcon: string
  contentIcon: string
  variants: Variant[]
}

const makeVariant = (id: string, icon: string, label: string): Variant => ({
  id,
  thumb: icon,
  contentIcon: icon,
  bullets: [label],
})

export const TABS: Tab[] = [
  {
    id: 'social',
    label: 'Соцмережі',
    navIcon: socialIcon,
    contentIcon: socialIcon,
    variants: [
      makeVariant('social-01', socialContentPlan, 'Контент-план'),
      makeVariant('social-02', socialProfileVisual, 'Візуальне оформлення профілю'),
      makeVariant('social-03', socialPostsStoriesTemplates, 'Шаблони постів і сторіз'),
      makeVariant('social-04', socialTargetedAds, 'Таргетована реклама'),
      makeVariant('social-05', socialCopywriting, 'Тексти для постів'),
    ],
  },
  {
    id: 'brandStyle',
    label: 'Візуальний стиль бренду',
    navIcon: brandStyleIcon,
    contentIcon: brandStyleIcon,
    variants: [
      makeVariant('brandStyle-01', brandLogo, 'Логотип'),
      makeVariant('brandStyle-02', brandIdentity, 'Айдентика (кольори, шрифти, стиль)'),
      makeVariant('brandStyle-03', brandGuidelines, 'Брендбук'),
      makeVariant('brandStyle-04', brandPrintDesign, 'Дизайн для друку (плакати, вивіски)'),
    ],
  },
  {
    id: 'sites',
    label: 'Сайти',
    navIcon: sitesIcon,
    contentIcon: sitesIcon,
    variants: [
      makeVariant('sites-01', sitesUiDesign, 'Дизайн сайту (макет)'),
      makeVariant('sites-02', sitesFrontendLayout, 'Верстка сайту'),
      makeVariant('sites-03', sitesResponsive, 'Мобільна адаптація'),
      makeVariant('sites-04', sitesBasicSeo, 'Базова SEO-оптимізація'),
      makeVariant('sites-05', sitesDatabase, 'Бази даних'),
    ],
  },
  {
    id: 'retail',
    label: 'Ритейл',
    navIcon: retailIcon,
    contentIcon: retailIcon,
    variants: [
      makeVariant('retail-01', retailAutomation, 'Автоматизація'),
      makeVariant('retail-02', retailSimpleFeatures, 'Розробка простого функціоналу'),
      makeVariant('retail-03', retailCrmBots, 'Підключення до CRM / ботів'),
      makeVariant('retail-04', retailUserAdminCabinet, 'Кабінет користувача або адміністратора'),
      makeVariant('retail-05', retailTesting, 'Перевірка та тестування'),
    ],
  },
  {
    id: 'apps',
    label: 'Додатки',
    navIcon: appsIcon,
    contentIcon: appsIcon,
    variants: [
      makeVariant('apps-01', appsAdsSetup, 'Налаштування реклами'),
      makeVariant('apps-02', appsCreativeConcepts, 'Креативні концепти'),
      makeVariant('apps-03', appsLandingAds, 'Реклама з лендингом'),
      makeVariant('apps-04', appsReportAnalysis, 'Звіт і аналіз результату'),
    ],
  },
]
