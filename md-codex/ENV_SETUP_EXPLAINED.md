# ENV Setup

Коротка шпаргалка по env у цьому проєкті: що куди вставляти і що тобі реально потрібно.

## Зараз у тебе

У `.env.local` вже заповнені тільки змінні для Google Sheets:

- `VITE_FAQ_HOME_SHEET_URL`
- `VITE_FAQ_SMM_SHEET_URL`
- `VITE_FAQ_DESIGN_SHEET_URL`
- `VITE_FAQ_WEB_SHEET_URL`
- `VITE_DESIGN_CARDS_SHEET_URL`

Не заповнені:

- `VITE_GA4_MEASUREMENT_ID`
- `VITE_GOOGLE_ADS_ID`
- `VITE_GOOGLE_ADS_CONVERSION_LABEL`
- `VITE_GTM_ID`
- `VITE_GSC_VERIFICATION`

Тобто контент із Google Sheets у тебе вже працює, а Google Analytics / Ads / GTM / Search Console ще ні.

## Де що зберігати

### `.env.local`

Сюди кладеш `VITE_*`.

Це frontend-змінні. Вони потрапляють у збірку, тому секрети сюди в production не кладемо.

### server env

Сюди кладеш:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `THANKS_GATE_SECRET`

Це вже не frontend. Їх треба задавати в cPanel Environment Variables або через `SetEnv` у `public/.htaccess`.

## Найпростіша логіка

### Обов'язковий мінімум

Щоб сайт працював нормально, тобі достатньо:

```env
VITE_SITE_URL=https://space.dominium.com.ua

VITE_FAQ_HOME_SHEET_URL=...
VITE_FAQ_SMM_SHEET_URL=...
VITE_FAQ_DESIGN_SHEET_URL=...
VITE_FAQ_WEB_SHEET_URL=...
VITE_DESIGN_CARDS_SHEET_URL=...
```

### Якщо хочеш просто аналітику

Додаєш:

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Якщо хочеш конверсію для Google Ads

Додаєш:

```env
VITE_GOOGLE_ADS_ID=AW-XXXXXXXXXX
VITE_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXXXXXXXXX
```

### Якщо хочеш підтвердити сайт у Search Console

Додаєш:

```env
VITE_GSC_VERIFICATION=xxxxxxxxxxxxxxxx
```

### GTM поки не чіпай

`VITE_GTM_ID` має сенс тільки якщо ти реально ведеш GA4/Ads через Google Tag Manager.

Якщо не впевнений, лишай порожнім.

## Усі змінні по черзі

## 1. `VITE_SITE_URL`

Куди вставляти:

- `.env.local`

Що це:

- базовий URL сайту

Що вставляти:

```env
VITE_SITE_URL=https://space.dominium.com.ua
```

Для чого використовується:

- canonical URL
- OG image URL
- sitemap
- SEO meta

## 2. `VITE_FAQ_HOME_SHEET_URL`

Куди вставляти:

- `.env.local`

Що це:

- Google Sheet / CSV для FAQ на головній

Що вставляти:

```env
VITE_FAQ_HOME_SHEET_URL=https://docs.google.com/spreadsheets/d/.../pub?gid=0&single=true&output=csv
```

Що має бути в таблиці:

- 1 колонка: питання
- 2 колонка: відповідь

## 3. `VITE_FAQ_SMM_SHEET_URL`

Куди вставляти:

- `.env.local`

Що це:

- FAQ таблиця для `/smm`

Що вставляти:

```env
VITE_FAQ_SMM_SHEET_URL=https://docs.google.com/spreadsheets/d/.../pub?gid=1942219183&single=true&output=csv
```

## 4. `VITE_FAQ_DESIGN_SHEET_URL`

Куди вставляти:

- `.env.local`

Що це:

- FAQ таблиця для `/design`

Що вставляти:

```env
VITE_FAQ_DESIGN_SHEET_URL=https://docs.google.com/spreadsheets/d/.../pub?gid=1925531033&single=true&output=csv
```

## 5. `VITE_FAQ_WEB_SHEET_URL`

Куди вставляти:

- `.env.local`

Що це:

- FAQ таблиця для `/web-develop`

Що вставляти:

```env
VITE_FAQ_WEB_SHEET_URL=https://docs.google.com/spreadsheets/d/.../pub?gid=338318137&single=true&output=csv
```

## 6. `VITE_DESIGN_CARDS_SHEET_URL`

Куди вставляти:

- `.env.local`

Що це:

- Google Sheet для карток на сторінці дизайну

Що вставляти:

```env
VITE_DESIGN_CARDS_SHEET_URL=https://docs.google.com/spreadsheets/d/.../pub?gid=...&single=true&output=csv
```

Що має бути в таблиці:

- текст
- заголовок / ім'я
- підзаголовок / роль

Якщо ця змінна порожня:

- компонент покаже локальні fallback-картки

## 7. `VITE_GA4_MEASUREMENT_ID`

Куди вставляти:

- `.env.local`

Що це:

- Google Analytics 4 Measurement ID

Формат:

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

Де брати:

- у Google Analytics 4
- потрібен саме ID формату `G-...`

Що дає:

- pageview
- базову аналітику відвідувань

## 8. `VITE_GOOGLE_ADS_ID`

Куди вставляти:

- `.env.local`

Що це:

- Google Ads tag ID

Формат:

```env
VITE_GOOGLE_ADS_ID=AW-XXXXXXXXXX
```

Де брати:

- у Google Ads
- потрібен саме ID формату `AW-...`

Важливо:

- сам по собі цей ID ще не завершує налаштування конверсії
- для конверсії ще потрібен `VITE_GOOGLE_ADS_CONVERSION_LABEL`

## 9. `VITE_GOOGLE_ADS_CONVERSION_LABEL`

Куди вставляти:

- `.env.local`

Що це:

- label конверсії Google Ads

Формат:

```env
VITE_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXXXXXXXXX
```

Де брати:

- у conversion action в Google Ads

Для чого:

- у цьому проєкті конверсія стріляє на сторінці `/thanks`

Щоб це працювало, мають бути задані обидві змінні:

- `VITE_GOOGLE_ADS_ID`
- `VITE_GOOGLE_ADS_CONVERSION_LABEL`

## 10. `VITE_GTM_ID`

Куди вставляти:

- `.env.local`

Що це:

- Google Tag Manager container ID

Формат:

```env
VITE_GTM_ID=GTM-XXXXXXX
```

Коли заповнювати:

- тільки якщо ти реально керуєш тегами через GTM

Важливо:

- якщо в GTM у тебе вже стоять GA4 / Ads теги, а ти ще й окремо заповниш `VITE_GA4_MEASUREMENT_ID` або `VITE_GOOGLE_ADS_ID`, можна отримати дублювання подій

Безпечний варіант, якщо ти не впевнений:

- `VITE_GTM_ID` лишити порожнім

## 11. `VITE_GSC_VERIFICATION`

Куди вставляти:

- `.env.local`

Що це:

- verification token для Google Search Console

Що вставляти:

- тільки значення токена
- не весь `<meta ...>`

Правильно:

```env
VITE_GSC_VERIFICATION=abc123def456
```

Неправильно:

```env
VITE_GSC_VERIFICATION=<meta name="google-site-verification" content="abc123def456" />
```

Де брати:

- у Google Search Console
- метод підтвердження через HTML tag
- копіюєш саме значення `content`

## 12. `VITE_TELEGRAM_BOT_TOKEN`

Куди вставляти:

- тільки в `.env.local`, якщо дуже треба локально

Що це:

- токен Telegram бота для dev fallback

Важливо:

- для production краще не використовувати
- це секрет

## 13. `VITE_TELEGRAM_CHAT_ID`

Куди вставляти:

- тільки в `.env.local`, якщо хочеш локально тестити форму напряму

Що це:

- chat ID для dev fallback

## 14. `TELEGRAM_BOT_TOKEN`

Куди вставляти:

- cPanel env
- або `SetEnv` у `public/.htaccess`

Що це:

- production токен Telegram бота

## 15. `TELEGRAM_CHAT_ID`

Куди вставляти:

- cPanel env
- або `SetEnv` у `public/.htaccess`

Що це:

- production chat ID для заявок

## 16. `THANKS_GATE_SECRET`

Куди вставляти:

- cPanel env
- або `SetEnv` у `public/.htaccess`

Що це:

- секрет для доступу до `/thanks`

Що вставляти:

- довгий випадковий рядок

Приклад:

```env
THANKS_GATE_SECRET=change-me-to-a-long-random-secret-string
```

## Готові шаблони

## Варіант 1. Без аналітики

```env
VITE_SITE_URL=https://space.dominium.com.ua

VITE_FAQ_HOME_SHEET_URL=...
VITE_FAQ_SMM_SHEET_URL=...
VITE_FAQ_DESIGN_SHEET_URL=...
VITE_FAQ_WEB_SHEET_URL=...
VITE_DESIGN_CARDS_SHEET_URL=...
```

## Варіант 2. З GA4

```env
VITE_SITE_URL=https://space.dominium.com.ua

VITE_FAQ_HOME_SHEET_URL=...
VITE_FAQ_SMM_SHEET_URL=...
VITE_FAQ_DESIGN_SHEET_URL=...
VITE_FAQ_WEB_SHEET_URL=...
VITE_DESIGN_CARDS_SHEET_URL=...

VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Варіант 3. З GA4 + Google Ads

```env
VITE_SITE_URL=https://space.dominium.com.ua

VITE_FAQ_HOME_SHEET_URL=...
VITE_FAQ_SMM_SHEET_URL=...
VITE_FAQ_DESIGN_SHEET_URL=...
VITE_FAQ_WEB_SHEET_URL=...
VITE_DESIGN_CARDS_SHEET_URL=...

VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GOOGLE_ADS_ID=AW-XXXXXXXXXX
VITE_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXXXXXXXXX
VITE_GSC_VERIFICATION=xxxxxxxxxxxxxxxx
```

## Варіант 4. Через GTM

```env
VITE_SITE_URL=https://space.dominium.com.ua

VITE_FAQ_HOME_SHEET_URL=...
VITE_FAQ_SMM_SHEET_URL=...
VITE_FAQ_DESIGN_SHEET_URL=...
VITE_FAQ_WEB_SHEET_URL=...
VITE_DESIGN_CARDS_SHEET_URL=...

VITE_GTM_ID=GTM-XXXXXXX
VITE_GSC_VERIFICATION=xxxxxxxxxxxxxxxx
```

Цей варіант нормальний тільки якщо ти вже розумієш, що GA4 і Ads у тебе керуються всередині GTM.

## Server env для production

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
THANKS_GATE_SECRET=your-long-random-secret
```

## Що я б радив саме тобі

Зараз найпростіше і найчистіше:

1. Лишити як є всі `VITE_FAQ_*` і `VITE_DESIGN_CARDS_SHEET_URL`
2. Додати `VITE_GA4_MEASUREMENT_ID`, якщо хочеш бачити аналітику
3. Додати `VITE_GOOGLE_ADS_ID` і `VITE_GOOGLE_ADS_CONVERSION_LABEL`, якщо хочеш рахувати заявки як Ads conversion
4. Додати `VITE_GSC_VERIFICATION`, якщо підтверджуєш сайт у Search Console
5. `VITE_GTM_ID` поки лишити порожнім

Це найменш ризиковий варіант без плутанини.
