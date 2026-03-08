# Audit невикористаних файлів

Дата: 2026-03-08

Статус: це лише аудит. У цьому проході нічого не видалялось.

## Як перевіряв

- Зібрав import-граф від реальних entrypoints: `src/main.tsx`, `vite.config.ts`, `scripts/*`, root `.storybook/*`, `build:showcase`.
- Окремо перевірив абсолютні URL на файли з `public/`.
- Ручно перевірив відключені маршрути, закоментовані імпорти та batch-папки з ассетами.
- Для великих директорій дивився не тільки “є/нема збігів”, а й що саме реально імпортується зараз.

Обмеження: це статичний аудит. Якщо десь є дуже хитра динамічна побудова шляху, її можна пропустити. Для файлів нижче я не знайшов таких місць.

## 1. Висока впевненість: мертвий код або мертві стилі

### 1.1 Регіональний SEO-блок зараз відключений

Файли:

- `src/pages/regional/RegionalLanding.tsx`
- `src/pages/regional/regional.module.scss`
- `src/shared/sections/regions-links/RegionsLinks.tsx`
- `src/shared/sections/regions-links/regions-links.scss`

Чому вважаю невикористаним:

- Регіональні роути закоментовані в `src/app/App.tsx:26-32`.
- Ті ж роути виключені з prerender у `vite.config.ts:23-28`.
- Вставки `RegionsLinks` також закоментовані в:
  - `src/pages/design/Design.tsx:67`
  - `src/pages/smm/Smm.tsx:134`
  - `src/pages/web-development/WebDevelopment.tsx:92`

Нотатка: директорії `src/pages/regional/` і `src/shared/sections/regions-links/` зараз ще й `untracked`, тобто це дуже сильний кандидат на окреме прибирання.

### 1.2 Блок `Portfolio` не підключений ніде

Файли:

- `src/components/Portfolio.tsx`
- `src/components/portfolio.module.scss`

Чому вважаю невикористаним:

- Файл існує сам по собі, але не імпортується з живих сторінок.
- Усередині ще й явно видно placeholder-контент у `src/components/Portfolio.tsx:4-14`.

Побічний наслідок:

- `src/assets/img/cards-main/BD_purple.png` живе тільки через цей мертвий компонент.

### 1.3 SMM-блок `Process` зараз мертвий

Файли:

- `src/pages/smm/components/Process.tsx`
- `src/pages/smm/components/process.module.scss`

Чому вважаю невикористаним:

- У `src/pages/smm/Smm.tsx` реально lazy-load-яться тільки `Tools` і `ChoosePlan`; `Process` там відсутній.
- Пошук по коду не показав жодного імпорту `Process`, окрім його власного файла.

Важливо:

- Іконки з `Process.tsx` не треба видаляти автоматично на цій підставі: ті самі 8 SVG зараз використовує `ChoosePlan.tsx`.

### 1.4 Одинокі orphan-файли

Ці файли не мають активних посилань у коді:

- `src/pages/home/components/slider-line.svg`
- `src/shared/ui/logo-menu/icons/burger.svg`
- `src/assets/SPACE.png`
- `src/assets/faq_plus.svg`
- `src/assets/ei_arrow-up.svg`
- `src/assets/img/ei_arrow-up.svg`
- `src/assets/img/smm/vertical-divider.svg`

Деталі:

- `burger.svg` виглядає як старий залишок: у `src/shared/ui/logo-menu/LogoMenu.tsx` “бургер” малюється `span`-ами, а не через SVG.

### 1.5 Вкладений Storybook scaffold у `src/assets/img/.storybook/` виглядає мертвим

Файли:

- `src/assets/img/.storybook/main.ts`
- `src/assets/img/.storybook/preview.ts`
- `src/assets/img/.storybook/vitest.setup.ts`

Чому вважаю невикористаним:

- Активний Storybook-конфіг лежить у root `.storybook/main.ts`, а не тут.
- Пошук по репозиторію не показав посилань на цей вкладений scaffold.
- Усередині видно типовий шаблонний конфіг, не пов'язаний із поточним Storybook у root.

## 2. Висока впевненість: архівні, дубльовані або застарілі ассети

### 2.1 `src/assets/video/`: зараз використовується тільки 3 файли з 13

Активно використовуються:

- `src/assets/video/laptop_people_crop.mp4`
- `src/assets/video/laptop_people_mobile_1080p_hq.mp4`
- `src/assets/video/laptop_people_poster.webp`

Це видно з імпортів у:

- `src/pages/home/components/Header.tsx`
- `src/pages/contacts/About.tsx`
- `src/main.tsx`

Кандидати на прибирання:

- `src/assets/video/laptop_hq.mp4`
- `src/assets/video/laptop_hq.webm`
- `src/assets/video/laptop_people.mp4`
- `src/assets/video/laptop_people_1080p.mp4`
- `src/assets/video/laptop_people_1920x780.mp4`
- `src/assets/video/laptop_people_mobile_1080p.mp4`
- `src/assets/video/laptop_people_mobile_1080p_12mb.mp4`
- `src/assets/video/laptop_people_poster.png`
- `src/assets/video/output_1920x780.webm`

### 2.2 `src/assets/fonts/gilroy/`: runtime реально бере тільки 6 шрифтів

Активно використовуються через `src/styles/fonts.scss:3-57`:

- `Gilroy-Thin.ttf`
- `Gilroy-Light.ttf`
- `Gilroy-Regular.ttf`
- `Gilroy-Bold.ttf`
- `Gilroy-ExtraBold.ttf`
- `Gilroy-Black.ttf`

Кандидати на прибирання як runtime-unused:

- `Gilroy-BlackItalic.ttf`
- `Gilroy-BoldItalic.ttf`
- `Gilroy-ExtraBoldItalic.ttf`
- `Gilroy-Heavy.ttf`
- `Gilroy-HeavyItalic.ttf`
- `Gilroy-LightItalic.ttf`
- `Gilroy-Medium.ttf`
- `Gilroy-MediumItalic.ttf`
- `Gilroy-RegularItalic.ttf`
- `Gilroy-SemiBold.ttf`
- `Gilroy-SemiBoldItalic.ttf`
- `Gilroy-ThinItalic.ttf`
- `Gilroy-UltraLight.ttf`
- `Gilroy-UltraLightItalic.ttf`

Окремо, не runtime, але може бути корисно для provenance:

- `src/assets/fonts/gilroy/Help - Guide Document.pdf`
- `src/assets/fonts/gilroy/License.txt`
- `src/assets/fonts/gilroy/More Free Fonts on fontshmonts.com.url`

### 2.3 `src/assets/img/cards-main/`: частина картинок мертва

Активно використовуються в `src/pages/home/components/Slider.tsx:5-7`:

- `WD.png`
- `BD_pearl.png`
- `CS.png`

Кандидати на прибирання:

- `src/assets/img/cards-main/BD_purple.png`
- `src/assets/img/cards-main/BD_pearl.svg`
- `src/assets/img/cards-main/BD_purple.svg`
- `src/assets/img/cards-main/CS.svg`
- `src/assets/img/cards-main/WD.svg`

Пояснення:

- `BD_purple.png` живе тільки через мертвий `Portfolio.tsx`.
- SVG-версії не імпортуються взагалі; застосунок бере PNG.

### 2.4 `src/assets/img/design/`: є кілька явних залишків

Активно використовуються:

- `ai-svgrepo-com.svg`
- `canva-svgrepo-com.svg`
- `instagram-svgrepo-com.svg`
- `photoshop-svgrepo-com.svg`
- `pinterest-color-svgrepo-com.svg`
- `bounce.svg`
- `design-triangle.png`
- `logo-without-sign.png`
- `line.svg`

Кандидати на прибирання:

- `src/assets/img/design/arrow+border.svg`
- `src/assets/img/design/hole.svg`
- `src/assets/img/design/Графічні елементи_design-44.svg`

Окремо:

- `src/assets/img/design/Графічні елементи_design-41.svg` згадується тільки в закоментованому імпорті в `src/shared/ui/floating-shapes/FloatingShapes.tsx:2`.

### 2.5 `src/assets/img/smm-tools/`: живі тільки 4 картинки

Активно використовуються в `src/pages/smm/components/Tools.tsx:5-8`:

- `saas.png`
- `amazon.png`
- `startup.png`
- `software.png`

Закоментовано, але не використовується:

- `graphic.png` (`src/pages/smm/components/Tools.tsx:9`, `src/pages/smm/components/Tools.tsx:16`)

Кандидати на прибирання:

- `src/assets/img/smm-tools/33b1594739d0576c3218a8d722175b62aa9a38f5.png`
- `src/assets/img/smm-tools/3D-Instagram-Post-Mockup.png`
- `src/assets/img/smm-tools/422f4229e2df9be78bb5311fce78ea24834a4f7d.png`
- `src/assets/img/smm-tools/4e97fb541ac9e2101eef167c62e568eac52a553a.png`
- `src/assets/img/smm-tools/a7dc600b91e24be0f2392f96773f6893e12f70df.png`
- `src/assets/img/smm-tools/b4b501143ac0e1676e5499a195ae06703df13e3b.png`
- `src/assets/img/smm-tools/e6d366dabc0ec81e4922dd703b5880d6ccf17ba9.png`
- `src/assets/img/smm-tools/f31730bbc5c6242e581446f813bc28d07bf17904.png`
- `src/assets/img/smm-tools/f82c5d49de23a95dcf9e077b3c3f9332ef601bca.png`
- `src/assets/img/smm-tools/graphic.png`

### 2.6 `src/pages/home/components/animation/assets/items/*/*.svg`: raw SVG-пакет замінений на TSX-компоненти

Кандидати на прибирання:

- Усі `.svg` у:
  - `src/pages/home/components/animation/assets/items/social/`
  - `src/pages/home/components/animation/assets/items/brand-style/`
  - `src/pages/home/components/animation/assets/items/sites/`
  - `src/pages/home/components/animation/assets/items/retail/`
  - `src/pages/home/components/animation/assets/items/apps/`

Обсяг:

- 23 raw SVG-файли

Чому вважаю невикористаним:

- У `src/pages/home/components/animation/data.ts:9-35` імпортуються `Icon*.tsx` компоненти.
- У `src/pages/home/components/animation/data.ts:63-125` саме вони підставляються у варіанти.
- Raw SVG-файли з цих папок у живому коді не імпортуються.

### 2.7 `src/assets/img/web-dev/`: велика папка, де реально активні тільки 7 файлів

У папці зараз 53 файли.

Активно використовуються тільки:

- `src/assets/img/web-dev/decorative-shapes.png`
- `src/assets/img/web-dev/3648841d191122a262472dac5cbe23436c16185a.svg`
- `src/assets/img/web-dev/4658d343c3a74c0675f60d2305b2beabe092f7e0.svg`
- `src/assets/img/web-dev/8dd7fe335d15a4793f80c5298d2c048aae186243.svg`
- `src/assets/img/web-dev/9e0e9286c5111031737c9dc4f39bd0b477cf62b1.svg`
- `src/assets/img/web-dev/eae06ff2a124a74202d9673859bb7366169725e6.svg`
- `src/assets/img/web-dev/python.svg`

Джерела використання:

- `src/pages/web-development/components/Hero.tsx`
- `src/pages/web-development/components/Services.tsx`

Висновок:

- Усі інші 46 файлів у `src/assets/img/web-dev/` виглядають як застарілий експортний dump і зараз не доходять до runtime.
- Сюди входить і `graphic-elements.svg`.

### 2.8 Top-level файли в `src/assets/img/` виглядають повністю мертвими

Що маю на увазі:

- Файли, що лежать безпосередньо в `src/assets/img/`, а не в її підпапках

Стан:

- Таких файлів зараз 64
- Активних імпортів на них я не знайшов
- Живий код імпортує ассети з підпапок (`design/`, `logo/`, `smm/`, `smm-tools/`, `web-dev/`), а не з кореня `src/assets/img/`
- Окремо в цій папці лежить `vitest.shims.d.ts`, але я не відношу його до runtime-сміття: це деклараційний файл, а не ассет

Типові приклади з цього dump:

- Хешовані SVG на кшталт `02cf46....svg`, `9f8f35....svg`
- `Frame 37 (1).svg`
- `Group 27.svg`
- `Group 7.svg`
- `Group 8.svg`
- `Group(1).svg`

Нотатка:

- Частина хешованих SVG тут дублює назви з `src/assets/img/web-dev/`, тобто це дуже схоже на старий проміжний експорт до рефакторингу структури ассетів.

### 2.9 Старий IT/robot source-пакет

Кандидати на прибирання:

- `src/assets/img/it/model-robot-it/scene.gltf`
- `src/assets/img/it/model-robot-it/scene.bin`
- `src/assets/img/it/model-robot-it/license.txt`
- `src/assets/img/it_services_chatbot.png`
- `src/assets/img/it_services_mobile.png`
- `src/assets/img/it_services_seo.png`
- `src/assets/img/it_services_ux_ui.png`
- `src/assets/img/it_services_web_apps.png`
- `src/assets/img/it_services_web_dev.png`

Чому вважаю невикористаним:

- Активні 3D-моделі зараз живуть у `public/models/robot/*.glb`.
- Посилань на цей старий source-набір у живому коді немає.

Нотатка:

- `license.txt` може бути корисним як provenance-файл, навіть якщо runtime він не потрібен.

### 2.10 `public/models/`: частина файлів source-only або застарілі fallback-и

Активно використовуються:

- `public/models/house.glb`
- `public/models/robot/Robot-wd.glb`
- `public/models/robot/scene.glb`

Це видно з:

- `src/shared/three/HouseViewer.tsx`
- `src/shared/sections/footer/Footer.tsx`
- `src/pages/not-found/NotFound.tsx`
- `src/pages/web-development/components/Services.tsx`

Кандидати на прибирання:

- `public/models/house.blend`
- `public/models/qr-code-studio.png`
- `public/models/robot/scene.gltf`
- `public/models/robot/scene.bin`

Пояснення:

- `scene.bin` потрібен тільки `scene.gltf`, а сам `scene.gltf` кодом не запитується.
- Runtime зараз бере `scene.glb`, а не `scene.gltf`.
- `house.blend` виглядає як editable source, не runtime-файл.

## 3. Тулінг-тільки або умовно зайве

### 3.1 Storybook starter/demo-пакет не використовується production-сайтом

Файли:

- Увесь `src/assets/img/stories/**` (27 файлів)

Що тут важливо:

- Це не dead-code у буквальному сенсі, бо root `.storybook/main.ts` підхоплює `../src/**/*.stories.*` і `../src/**/*.mdx`.
- Але production-сайт цим не користується взагалі.
- Усередині лежить типовий starter-контент Storybook на кшталт `Example/Button`, `Example/Page`, а не сторі до реальних компонентів проєкту.

Практичний висновок:

- Якщо Storybook не є частиною workflow, цей пакет можна буде видаляти майже цілком разом з пов'язаними залежностями.
- Якщо Storybook потрібен, тоді ці файли не “мертві”, а просто “не runtime”.

## 4. Явно НЕ позначав як сміття

Ці файли перевірив і навмисно не записував у кандидати:

- `public/contact-submit.php`
- `public/faq-cache.php`
- `public/thanks-access.php`
- `public/robots.txt`
- `public/sitemap.xml`
- `public/favicon.svg`
- `public/card-template.png`
- `public/showcase/instaauto-demo/**`
- `.tmp_instaauto_demo_src_v2/**`
- root `.storybook/**`

Чому:

- PHP-файли реально викликаються з фронтенду.
- SEO-файли потрібні build/script-рівню.
- `public/showcase/instaauto-demo/**` використовується через `src/pages/web-development/components/Showcase.tsx`.
- `.tmp_instaauto_demo_src_v2/**` потрібен для `npm run build:showcase`.
- root `.storybook/**` активний, якщо ви лишаєте Storybook у проєкті.

## 5. Repo-local `.DS_Store`

Це гарантовано сміття для репозиторію, не пов'язане з логікою застосунку:

- `./.DS_Store`
- `public/.DS_Store`
- `public/models/.DS_Store`
- `src/.DS_Store`
- `src/assets/.DS_Store`
- `src/assets/img/.DS_Store`
- `src/assets/img/it/.DS_Store`
- `src/assets/img/smm/.DS_Store`
- `src/assets/img/stories/.DS_Store`
- `src/assets/video/.DS_Store`
- `src/pages/.DS_Store`
- `src/pages/home/.DS_Store`
- `src/pages/home/components/.DS_Store`
- `src/pages/home/components/animation/.DS_Store`
- `src/pages/home/components/animation/assets/.DS_Store`
- `src/pages/home/components/animation/assets/items/.DS_Store`

## 6. Що б я чистив першим проходом

Найбезпечніший порядок на потім:

1. `.DS_Store`
2. `Portfolio` і `Process`
3. регіональний SEO-блок (`regional` + `regions-links`)
4. одинокі orphan-файли
5. archive/media duplicates (`video`, `cards-main`, `smm-tools`, `design`)
6. великі batch-папки (`animation raw SVG`, `web-dev dump`, top-level `src/assets/img`)
7. source-only файли на кшталт `house.blend`, `license.txt`, font docs тільки після окремого підтвердження
