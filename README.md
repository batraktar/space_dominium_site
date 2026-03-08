# Space Dominium (Vite + React + TS)

## 1) Local start

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 2) ENV config

Use `.env.local` for local development (file is ignored by git).

Base site URL:

```env
VITE_SITE_URL=https://space.dominium.com.ua
```

Required sheet variables:

```env
VITE_FAQ_HOME_SHEET_URL=
VITE_FAQ_SMM_SHEET_URL=
VITE_FAQ_DESIGN_SHEET_URL=
VITE_FAQ_WEB_SHEET_URL=
VITE_DESIGN_CARDS_SHEET_URL=
```

Analytics / SEO variables:

```env
VITE_GA4_MEASUREMENT_ID=
VITE_GOOGLE_ADS_ID=
VITE_GOOGLE_ADS_CONVERSION_LABEL=
VITE_GTM_ID=
VITE_GSC_VERIFICATION=
```

Optional local Telegram direct-send (DEV only):

```env
VITE_TELEGRAM_BOT_TOKEN=
VITE_TELEGRAM_CHAT_ID=
```

## 3) Contact form -> Telegram

### Production (recommended)
- Endpoint: `public/contact-submit.php`
- Set **server env vars** in cPanel (not VITE):

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
THANKS_GATE_SECRET=...
```

If cPanel env UI is unavailable, you can set them in `public/.htaccess`:

```apache
SetEnv TELEGRAM_BOT_TOKEN "..."
SetEnv TELEGRAM_CHAT_ID "..."
SetEnv THANKS_GATE_SECRET "your-long-random-secret"
```

Shared hosting fallback:
- `contact-submit.php` and `thanks-access.php` can also read from `.env` / `.env.local` near the PHP files.
- They accept both key styles:
  - `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` / `THANKS_GATE_SECRET`
  - `VITE_TELEGRAM_BOT_TOKEN` / `VITE_TELEGRAM_CHAT_ID` / `VITE_THANKS_GATE_SECRET` (fallback only)

How it works:
- Frontend sends form data to `/contact-submit.php`.
- PHP sends message to Telegram bot.
- Message includes section source (`/`, `/smm`, `/design`, `/web-develop`, etc).
- After successful submit, PHP sets a short-lived signed cookie for `/thanks` access.
- Frontend redirects user to `/thanks`.

### Local DEV fallback
- If `VITE_TELEGRAM_BOT_TOKEN` + `VITE_TELEGRAM_CHAT_ID` are set, form can send directly to Telegram API in dev mode.
- In dev fallback mode, `/thanks` access is controlled by sessionStorage flag after successful submit.

## 4) Thanks Redirect Gate

Use server env variable:

```env
THANKS_GATE_SECRET=your-long-random-secret
```

How it works:
- `contact-submit.php` signs and sets `sd_thanks_gate` cookie for 30 seconds.
- `/thanks` page checks `/thanks-access.php`.
- Direct opens without valid cookie are redirected to `/`.
- `/thanks` page injects `meta[name="robots"] = noindex, nofollow, noarchive`.
- `public/robots.txt` also blocks `/thanks` from indexing.

## 5) SEO setup

- Route-level SEO is managed in:
  - `src/shared/seo/seo-config.ts`
  - `src/shared/seo/SeoHead.tsx`
- Regional landing pages:
  - `/ua`
  - `/ua/kyiv`
  - `/ua/lviv`
  - `/ua/zakarpattia`
  - `/ua/ukraine`
- Sitemap generation script:
  - `scripts/seo/generate-sitemap.mjs`
- Build-time SEO validation:
  - `scripts/seo/check-seo-build.mjs`
- Canonical + HTTPS redirect rules:
  - `public/.htaccess`

## 6) Google Sheets visibility

- FAQ URLs are taken from ENV.
- In production, FAQ can also be served through `public/faq-cache.php` (`/faq-cache.php?gid=...`) to avoid direct client calls to Google.

## 7) Build

```bash
npm run build
```

SEO validation after build:

```bash
npm run build:seo:check
```

Showcase build + sync:

```bash
npm run build:showcase
```
