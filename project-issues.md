# Проєкт: аудит проблем (2026-02-05)

Нижче — список проблем, від критичних до бажаних для виправлення.  
Орієнтувався на реальні помилки, lint-результати та консистентність коду.

**Ультра критичні**
- ~~`npm run lint` падає через невикористану змінну `robotTargetId` після того, як блок з роботом закоментований. Це блокує CI/релізи, якщо lint є обовʼязковим. Файл: `src/pages/web-development/components/Services.tsx`.~~ — виправлено, робот повернений, `lint` без помилок.

**Критичні / високі**
- ~~Компонент робота в `Services` закоментований, але логіка/змінні лишилися. Це створює плутанину й розходження між очікуваним UI та кодом. Файл: `src/pages/web-development/components/Services.tsx`.~~ — виправлено, робот активний, логіка узгоджена.
- ~~Потенційна помилка стилів: використовується клас `.containet-wrapper` без відповідних стилів (ймовірна помилка назви). Файл: `src/pages/home/components/animation/Animation.tsx`.~~ — виправлено (перейменовано на `container-wrapper`, додано стилі).
- ~~`FloatingShapes` і `LineNor` мають попередження React Hooks (нестабільні ref/відсутні залежності). Це не ламає зараз, але є ризик некоректної поведінки при зміні даних. Файли: `src/shared/ui/floating-shapes/FloatingShapes.tsx`, `src/pages/home/components/animation/LineNor.tsx`.~~ — виправлено, `lint` без попереджень.

**Середні**
- В `Faq` на проді URL автоматично підміняється на `/faq-cache.php`. Якщо хостинг статичний або без PHP — FAQ перестане працювати. Файл: `src/shared/sections/faq/Faq.tsx`, ресурс: `public/faq-cache.php`.
- Веб-формам бракує семантики та accessibility (немає `label`/`aria-label`, відсутній `<form>`). Файли: `src/pages/web-development/components/Hero.tsx`, `src/pages/smm/components/Hero.tsx`.
- `href="#"` у CTA всередині `Tools` призводить до стрибка в початок сторінки та є поганою практикою (краще кнопка або реальний лінк). Файл: `src/pages/smm/components/Tools.tsx`.

**Низькі / консистентність**
- ~~Різні конвенції найменування класів між секціями: BEM (`hero__title`) у Web Dev, camelCase (`heroInner`, `logoWrap`) у SMM. Це ускладнює підтримку і пошук. Файли: `src/pages/web-development/components/hero.module.scss`, `src/pages/smm/components/hero.module.scss`.~~ — виправлено (SMM hero перейменовано на BEM-стиль).
- ~~У SMM hero сітка має 2 колонки, хоча знак позиціонується абсолютно і не потребує другої колонки — це штучно стискає текстовий блок на широких екранах. Файл: `src/pages/smm/components/hero.module.scss`.~~ — виправлено (1 колонка).
- ~~Неконсистентні / помилкові назви файлів: `optimiizatiion.svg` і подібні (опечатки). Файл: `src/assets/img/smm/optimiizatiion.svg`.~~ — виправлено (файл перейменований на `optimization.svg`).
- У проєкті є файли з пробілами/дужками в іменах (наприклад `Frame 37 (1).svg`), що може створювати проблеми з URL/кешуванням у деяких тулчейнах. Каталог: `src/assets/img`.
- Google Fonts підключаються локально в модульному SCSS (`@import`), що може викликати дублювання та блокування рендера. Файл: `src/pages/web-development/components/hero.module.scss`.

**Варто виправити (якість/оптимізація)**
- У `public/models` є `house.blend` (важкий файл), який не потрібен для фронтенду — можна прибрати з публічної збірки. Файл: `public/models/house.blend`.
- В проєкті є залежності для тестів (`vitest`, `playwright`), але немає базових smoke-тестів/компонентних перевірок. Це ускладнює підтримку при правках UI.
