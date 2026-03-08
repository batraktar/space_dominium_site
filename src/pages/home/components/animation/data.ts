import type { ComponentType, SVGProps } from 'react'

import appsIcon from './assets/icons/apps.svg'
import brandStyleIcon from './assets/icons/brand-style.svg'
import retailIcon from './assets/icons/retail.svg'
import sitesIcon from './assets/icons/sites.svg'
import socialIcon from './assets/icons/social.svg'

import IconAppsAdsSetup from './assets/items/apps/IconAppsAdsSetup'
import IconAppsCreativeConcepts from './assets/items/apps/IconAppsCreativeConcepts'
import IconAppsLandingAds from './assets/items/apps/IconAppsLandingAds'
import IconAppsReportAnalysis from './assets/items/apps/IconAppsReportAnalysis'

import IconBrandGuidelines from './assets/items/brand-style/IconBrandGuidelines'
import IconBrandIdentity from './assets/items/brand-style/IconBrandIdentity'
import IconBrandLogo from './assets/items/brand-style/IconBrandLogo'
import IconBrandPrintDesign from './assets/items/brand-style/IconBrandPrintDesign'

import IconRetailAutomation from './assets/items/retail/IconRetailAutomation'
import IconRetailCrmBots from './assets/items/retail/IconRetailCrmBots'
import IconRetailSimpleFeatures from './assets/items/retail/IconRetailSimpleFeatures'
import IconRetailTesting from './assets/items/retail/IconRetailTesting'
import IconRetailUserAdminCabinet from './assets/items/retail/IconRetailUserAdminCabinet'

import IconSitesBasicSeo from './assets/items/sites/IconSitesBasicSeo'
import IconSitesDatabase from './assets/items/sites/IconSitesDatabase'
import IconSitesFrontendLayout from './assets/items/sites/IconSitesFrontendLayout'
import IconSitesResponsive from './assets/items/sites/IconSitesResponsive'
import IconSitesUiDesign from './assets/items/sites/IconSitesUiDesign'

import IconSocialContentPlan from './assets/items/social/IconSocialContentPlan'
import IconSocialCopywriting from './assets/items/social/IconSocialCopywriting'
import IconSocialPostsStoriesTemplates from './assets/items/social/IconSocialPostsStoriesTemplates'
import IconSocialProfileVisual from './assets/items/social/IconSocialProfileVisual'
import IconSocialTargetedAds from './assets/items/social/IconSocialTargetedAds'

export type TabId = 'social' | 'brandStyle' | 'sites' | 'retail' | 'apps'
export type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement> & { thickness?: number }>
export type VariantIcon = string | SvgIconComponent

export interface Variant {
  id: string
  thumb: VariantIcon
  contentIcon: VariantIcon
  bullets: string[]
}

export interface Tab {
  id: TabId
  label: string
  navIcon: string
  contentIcon: string
  variants: Variant[]
}

const makeVariant = (id: string, icon: VariantIcon, label: string): Variant => ({
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
      makeVariant('social-01', IconSocialContentPlan, 'Контент-план'),
      makeVariant('social-02', IconSocialProfileVisual, 'Візуальне оформлення профілю'),
      makeVariant('social-03', IconSocialPostsStoriesTemplates, 'Шаблони постів і сторіз'),
      makeVariant('social-04', IconSocialTargetedAds, 'Таргетована реклама'),
      makeVariant('social-05', IconSocialCopywriting, 'Тексти для постів'),
    ],
  },
  {
    id: 'brandStyle',
    label: 'Візуальний стиль бренду',
    navIcon: brandStyleIcon,
    contentIcon: brandStyleIcon,
    variants: [
      makeVariant('brandStyle-01', IconBrandLogo, 'Логотип'),
      makeVariant('brandStyle-02', IconBrandIdentity, 'Айдентика (кольори, шрифти, стиль)'),
      makeVariant('brandStyle-03', IconBrandGuidelines, 'Брендбук'),
      makeVariant('brandStyle-04', IconBrandPrintDesign, 'Дизайн для друку (плакати, вивіски)'),
    ],
  },
  {
    id: 'sites',
    label: 'Сайти',
    navIcon: sitesIcon,
    contentIcon: sitesIcon,
    variants: [
      makeVariant('sites-01', IconSitesUiDesign, 'Дизайн сайту (макет)'),
      makeVariant('sites-02', IconSitesFrontendLayout, 'Верстка сайту'),
      makeVariant('sites-03', IconSitesResponsive, 'Мобільна адаптація'),
      makeVariant('sites-04', IconSitesBasicSeo, 'Базова SEO-оптимізація'),
      makeVariant('sites-05', IconSitesDatabase, 'Бази даних'),
    ],
  },
  {
    id: 'retail',
    label: 'Ритейл',
    navIcon: retailIcon,
    contentIcon: retailIcon,
    variants: [
      makeVariant('retail-01', IconRetailAutomation, 'Автоматизація'),
      makeVariant('retail-02', IconRetailSimpleFeatures, 'Розробка простого функціоналу'),
      makeVariant('retail-03', IconRetailCrmBots, 'Підключення до CRM / ботів'),
      makeVariant('retail-04', IconRetailUserAdminCabinet, 'Кабінет користувача або адміністратора'),
      makeVariant('retail-05', IconRetailTesting, 'Перевірка та тестування'),
    ],
  },
  {
    id: 'apps',
    label: 'Додатки',
    navIcon: appsIcon,
    contentIcon: appsIcon,
    variants: [
      makeVariant('apps-01', IconAppsAdsSetup, 'Налаштування реклами'),
      makeVariant('apps-02', IconAppsCreativeConcepts, 'Креативні концепти'),
      makeVariant('apps-03', IconAppsLandingAds, 'Реклама з лендингом'),
      makeVariant('apps-04', IconAppsReportAnalysis, 'Звіт і аналіз результату'),
    ],
  },
]
