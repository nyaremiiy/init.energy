# Журнал змін (для AI-агентів і власника)

Нові записи — **зверху**. Кожен агент після задачі додає запис.

Шаблон:

```
## YYYY-MM-DD — <коротка назва> 
- **Агент:** Claude Code | Codex | власник
- **Гілка:** feature/...  (статус: в роботі / змерджено в develop)
- **Що зроблено:** ...
- **Файли:** ...
- **Нотатки / що далі:** ...
```

---

## 2026-11-25 — Фото-картки «Що вам потрібно живити?»: чіткі фото й назви продуктів
- **Агент:** Claude Code
- **Гілка:** fix/solution-cards-names-photos (статус: змерджено в develop)
- **Що зроблено:** за зауваженням власника:
  - **Фото розмите.** Причина — `sizes="(min-width: 1024px) 33vw, 100vw"`: горизонтальне фото у високій картці обрізається по висоті й рендериться ~1 400 px завширшки, а браузер за `33vw` брав файл 640–750 px і розтягував удвічі. Тепер `sizes="1440px"` і `quality={90}` — віддається оригінал (`home.avif` 1919 px, `factory.avif` і фото квартири 1280 px).
  - **Назви не вміщались** («SVIT PLUS 5000 × 16» переносилось). Назва й ємність тепер без розривів; якщо разом не вміщаються — ємність переходить під назву.
- **Перевірено:** 360 / 390 (DPR 3), 1024, 1280, 1440 (DPR 2), uk і en — жодна назва не обрізана й не переноситься, без горизонтального скролу; розкрита картка на 1280–1920 вміщається у 768 px. Lint, build.
- **Що далі:** джерела фото квартири й заводу — 1280 px, на екранах із DPR 2–3 вони все одно трохи м'якші. Фото заводу спільне з карткою «Бізнес» на `/cec/` (`solutions.ts`), тому не замінене. Для повної чіткості потрібні оригінали від власника (≥ 2 000 px по висоті, бо картка вертикальна).
- **Файли:** src/components/ui/solution-photo-card.tsx, docs/ai/CHANGELOG.md

## 2026-11-25 — Іконки «що живить» на мобільному
- **Агент:** Claude Code
- **Гілка:** fix/solution-loads-layout (статус: змерджено в develop)
- **Що зроблено:** за зауваженням власника: на телефоні у сітці 2×2 підписи стояли праворуч від іконки й обрізались («Виробництво», «Холодильник»); тепер скрізь іконка над підписом, по центру колонки. «Сонце вдень» / "Solar by day" і "Critical site" більше не переносяться (`whitespace-nowrap`), мінімальний проміжок у ряду — 4 px.
- **Перевірено:** 320 / 360 / 390 / 768 / 1024 / 1280 / 1440 / 1920, uk і en — підписи в межах ряду, без накладань і горизонтального скролу; розкрита картка на 1280–1440 вміщається у 768 px, як і раніше. Lint, build.
- **Файли:** src/components/ui/solution-photo-card.tsx, docs/ai/{CONTEXT,CHANGELOG}.md

## 2026-11-25 — «Що вам потрібно живити?» на фото-картках
- **Агент:** Claude Code
- **Гілка:** feature/solutions-photo-cards (статус: змерджено в develop)
- **Що зроблено:** за `design/home-solutions-photo-cards` (варіант B) три картки секції на головній — фото на всю картку з градієнтом, зверху `CardLabel` і номер, унизу ємність, підпис, H3, опис, 4 іконки «що живить», рекомендовані продукти й біла кнопка.
  - Новий `SolutionPhotoCard` (`ui/solution-photo-card.tsx`, Server Component, лише CSS): на десктопі з мишею рекомендації й кнопка відкриваються на hover / `focus-within`, у спокої — підкреслене посилання; на сенсорних екранах і вужче 1280 px рекомендації й кнопка видно завжди. Розмітка `ul > li > article`.
  - `solutions.ts`: `image` обов'язкове (квартира — фото з хабу резервного живлення, alt з `backup.ts`), нове `loads` (4 іконки з підписами uk/en з описів карток), прибрано `tone`; `getSolutionCapacity` повертає `{ value, unit }`; посилання на продукти й CTA тепер локалізовані (на `/en/` раніше вели на українські сторінки).
  - `segments.ts`: `LoadIconId` і `loadIcons` (Wifi, Lightbulb, Laptop, Smartphone, Flame, Droplets, Refrigerator, Sun, Factory, Warehouse, Hotel, Server — усі є в lucide-react 1.69).
  - `globals.css`: `.scrim-solution`, `.scrim-solution-active`, `@custom-variant can-hover` (≥ 1280 px, `hover: hover`, `pointer: fine`).
  - Режим `showcase` у `SegmentCard` видалено (використовувався лише тут) разом із невикористаними класами тонів.
- **Відхилення від брифу:**
  - Розкриття на наведення — з 1280 px (`xl`), а не з `lg`: на 1024–1279 px картки ~300 px завширшки, розкрита картка не вміщалась би без зміни висоти ряду; там рекомендації видно завжди, як на планшеті.
  - Висота `min-h-192` (768 px) на десктопі з мишею: розкрита картка потребує 768 px на 1280 і 738 px від 1366, тож наведення не змінює висоту ряду (перевірено: 768 px у спокої й при наведенні на 1280 / 1440 / 1920).
  - Градієнт спокою темніший угорі, ніж у референсі (82 % → 50 % → 10 % на 0 / 15 / 30 %): з `.35` пігулка «Приватний будинок» на світлому даху мала контраст 2,2 : 1.
  - Іконки «що живить»: на вузьких картках (вужче 288 px вмісту — телефон 360 px, ряд 1024–1279) — 2×2; ширше — ряд (див. виправлення вище), бо «Холодильник» і «Виробництво» (~91 px) не вміщаються в 4 рівні колонки.
- **Перевірено** (production-збірка, headless Edge): контраст тексту на найсвітлішій ділянці (98-й перцентиль пікселів під текстом) у спокої ≥ 4,78 : 1 (найнижче — великі цифри «5–16», для решти ≥ 5,5), у відкритому стані й на телефоні ≥ 6,5 : 1; один H2 і три H3; 360 / 768 / 1024 / 1280 / 1440 / 1920 без горизонтального скролу; Tab на посиланні продукту розкриває картку, фокус видно, «посилання спокою» поза Tab-порядком; reduced motion — без масштабування фото й анімацій; `/en/` — англійські підписи й посилання `/en/…`. Lint (з `lint:tokens`), build.
- **Файли:** src/components/ui/{solution-photo-card,segment-card}.tsx, src/components/sections/home/solutions-by-segment.tsx, src/content/{solutions,segments}.ts, src/app/globals.css, docs/ai/{CONTEXT,CHANGELOG}.md

## 2026-11-24 — Власний лічильник відвідувачів прибрано
- **Агент:** Claude Code
- **Гілка:** chore/remove-visit-counter (статус: змерджено в develop)
- **Що зроблено:** за `design/remove-visit-counter` (рішення власника: сайт переходить за Cloudflare, статистика — Cloudflare Web Analytics і GA4 після згоди) лічильник видалено повністю:
  - видалено `src/components/layout/visit-beacon.tsx` (і його підключення в `SiteChrome`), `src/app/api/visit/route.ts` (папка `src/app/api/` теж зникла), `src/lib/visits/` (`visits-core.ts`, `visits-store.ts`, `visits-scheduler.ts`, `visits.test.mjs`), `src/instrumentation.ts` (запускав лише звіти);
  - `.gitignore` — без `/storage/visits/`; README — без `VISITS_DIR` і розділу «Лічильник відвідувачів»;
  - «Політика cookie» (uk/en): прибрано розділ «Статистика без cookie» / "Statistics without cookies" (`statsTitle`, `statsText`), дата оновлення політики — 2026-11-24. Таблиця cookie, GA4 і згода без змін, `CONSENT_VERSION` не змінювали (нових cookie немає).
  - `next.config.ts`, `robots.ts`, `package.json` (тести за маскою) змін не потребували; `allowImportingTsExtensions` лишився.
- **Перевірено:** `npm test` (43), lint, build — маршруту `/api/visit` немає, усі сторінки статичні як раніше; production: `/`, `/en/`, `/polityka-cookie/`, `/en/polityka-cookie/` — 200 (prerender), у бандлах і мережі жодного запиту на `/api/visit/`, `POST /api/visit/` → 404; у консолі лише відомі 404 prefetch запланованих сторінок (`/svit/`, `/pro-nas/`, правові).
- **Що далі:** папку `storage/visits/` на сервері (поза Git) можна видалити вручну.
- **Файли:** src/components/layout/{site-chrome,visit-beacon}.tsx, src/app/api/visit/route.ts, src/lib/visits/*, src/instrumentation.ts, src/content/cookies.ts, src/components/pages/cookie-policy-page.tsx, .gitignore, README.md, docs/ai/{CONTEXT,CHANGELOG}.md

## 2026-11-23 — Оптимізація фото hero на інших сторінках
- **Агент:** Claude Code
- **Гілка:** perf/hero-images-all (статус: змерджено в develop)
- **Що зроблено:** як на головній — мобільне фото hero перекодовано q40 і додано обрізану середину для вертикальних телефонів (`mobilePortrait`, 720 px):
  - `/cec/` і 52 сторінки областей (uk/en) — `cec/hero/01-750.avif` 67 → 37 КБ, `01-portrait.avif` 27 КБ;
  - `/rishennya/ses-dlya-gotelyu/` (uk/en) — `hotel/01-750.avif` 113 → 72 КБ, `01-portrait.avif` 53 КБ.
  Не чіпали: `/rezervne-zhyvlennya/` (фото вже 10 КБ), продукти, калькулятор, політика cookie (LCP там — текст, не фото).

| Сторінка (360×780, CPU ×4, ~1,6 Мбіт/с, медіана з 5) | LCP до | LCP після |
|---|---|---|
| `/cec/` | 2 624 мс | 1 736 мс |
| `/cec/lvivska-oblast/` | 2 488 мс | 1 588 мс |
| `/en/cec/kyiv/` | 2 348 мс | 1 364 мс |
| `/rishennya/ses-dlya-gotelyu/` | 3 180 мс | 2 160 мс |

- **Перевірка вигляду:** перший екран з новими й попередніми файлами на 360 / 390 / 412 / 600 / 740×360 px — середня різниця 0,02–0,53 з 255 (≤ 0,22 % пікселів > 8). CLS 0,0001 без змін. Lint, build, `npm test` (47).
- **Помічено:** HTML `/cec/` — 146 КБ у gzip (789 КБ без стиснення): SVG-карта областей (152 КБ) у розмітці й ще раз у RSC-даних. Не змінювали.
- **Файли:** public/images/cec/hero/01-{750,portrait}.avif, public/images/cec/rishennya/hotel/01-{750,portrait}.avif, src/components/sections/home/hero-slides.ts, src/content/solutions.ts, docs/ai/{CONTEXT,CHANGELOG}.md

## 2026-11-23 — Обрізане фото героя для вертикальних телефонів
- **Агент:** Claude Code
- **Гілка:** perf/hero-portrait (статус: змерджено в develop)
- **Діагностика (production, HTTP/2):** LCP — фото `01-750.avif` (59 КБ), вантажиться 0,33 → 2,67 с, бо ділить канал з HTML (63 КБ), шрифтами (123 КБ) і JS (105 КБ). PageSpeed: 2,7–3,0 с. Шрифти не чіпали: на першому екрані потрібні всі 4 файли (латинський набір дає пробіли й розділові знаки й українському тексту), без preload вони вантажились би майже одночасно.
- **Що зроблено:** на вертикальному телефоні фото масштабується за висотою, і видно лише ~60 % ширини. Нове поле `HeroImage.mobilePortrait` — окреме `<source media="(max-width: 767px) and (max-aspect-ratio: 3/5)">`; для першого слайда головної — `01-portrait.avif`: середина того самого фото 720×1314 (з 980), q40, 59 → 44 КБ. Ширші й горизонтальні екрани отримують попередній файл.
- **Результат:** LCP головної в лабораторному профілі (360×780, CPU ×4, ~1,6 Мбіт/с, HTTP/1.1, медіана з 5) 2 364 → **1 928 мс**, CLS 0,0001. Знімки першого екрана з обома файлами: 360/390/412 px — середня різниця 0,34–0,37 з 255; 600 px і горизонтальний 740×360 — той самий файл, 0 %.
- **Файли:** src/components/sections/hero/hero-picture.tsx, src/components/sections/home/hero-slides.ts, public/images/home/hero/01-portrait.avif, docs/ai/{CONTEXT,CHANGELOG}.md

## 2026-11-23 — 500 замість 404 на production: запуск з `-H 127.0.0.1`
- **Агент:** Claude Code
- **Гілка:** chore/doc-server-host (статус: змерджено в develop)
- **Проблема:** на production усі адреси, які переписує `src/proxy.ts` (неіснуючі, «в розробці», `/en/…` без версії), відповідали 500. Юніт запускав `npm run start -- -H 127.0.0.1 -p 3001`; Next будує базову адресу запиту з `127.0.0.1`, а `request.nextUrl` у proxy нормалізує його до `localhost`, тож ціль переписування має «інше» походження й обробляється як зовнішня → 500 (`x-middleware-rewrite: https://localhost:3001/ne-znaideno/`). Відтворено локально: `-H 127.0.0.1` → 500, без `-H` або з `-H localhost` → 404 і `x-middleware-rewrite: /ne-znaideno/`. Для `/pro-nas/` і `/en/…` вада існувала й раніше; після попередньої задачі під неї потрапили й неіснуючі українські адреси.
- **Що зроблено (власник на сервері):** `ExecStart=… -H localhost -p 3001` + `Environment=NODE_OPTIONS=--dns-result-order=ipv4first`; nginx без змін (`proxy_pass http://127.0.0.1:3001`). Перша спроба без `ipv4first` дала 502 на ~хвилину: Node прив'язався до `::1`; відкочено. Записано в README («Деплой») і CONTEXT.
- **Перевірено на production:** `/`, `/en/`, `/svit-600/`, `/cec/lvivska-oblast/`, `llms.txt`, `sitemap.xml` — 200; `/abc/`, `/cec/xyz/`, `/ne-znaideno/`, `/en/abc/` — 404 «не знайдено»; `/pro-nas/`, `/en/pro-nas/` — 404 «в розробці»; `/ses/` — 308.
- **Файли:** README.md, docs/ai/{CONTEXT,CHANGELOG}.md

## 2026-11-23 — HTML кожної сторінки на ~94 КБ менший: 404 без шапки в RSC-даних
- **Агент:** Claude Code
- **Гілка:** perf/home-html (статус: змерджено в develop)
- **Діагностика:** у RSC-даних головної (221 тис. символів) шапка (меню 10,7 КБ) і футер були тричі: сама сторінка і дві копії кореневого `not-found.tsx` з `SiteChrome` — Next вбудовує дерево `not-found` у проп `notFound` кореневої й мовної розкладки на кожній сторінці.
- **Що зроблено:** невідомі українські адреси `src/proxy.ts` тепер переписує на нову статичну `/ne-znaideno/` (404, noindex, шапка й футер), як англійські — на `/en/ne-znaideno/`; список відомих сторінок — той самий `localizedPaths`. Кореневий `not-found.tsx` — запасний, той самий `NotFoundView` без `SiteChrome`. `routes.notFoundEn` → `routes.notFound`, robots.txt закриває обидві адреси.
- **Результат (HTML головної):** 510 → 424 КБ, gzip 74,8 → 63,3 КБ (−15 %); те саме зменшення на всіх сторінках з розкладками. LCP у локальному профілі (HTTP/1.1) 2 376 → 2 364 мс — у межах шуму: фото там стартує незалежно від HTML; на production з HTTP/2 фото ділить канал з HTML, тож виграш ~50–70 мс при 1,6 Мбіт/с. Менше також розбору й гідратації.
- **Перевірено:** усі 74 адреси sitemap — 200; `/abc/`, `/cec/xyz/`, `/a/b/c/`, `/svit-xyz/` → 404 «Сторінку не знайдено» з шапкою й футером, `/en/abc/` → 404 «Page not found», `/pro-nas/` (uk/en) → «в розробці», `/ses/` → 308, `/maintenance/`, файли (`llms.txt`, `robots.txt`, `sitemap.xml`, маніфест, `og-image.png`, google…html) і `POST /api/visit/` — як раніше; усі сторінки статичні. Lint, build.
- **Файли:** src/proxy.ts, src/app/not-found.tsx, src/app/(uk)/ne-znaideno/page.tsx, src/content/routes.ts, src/app/robots.ts, docs/ai/{CONTEXT,CHANGELOG}.md
- **Що далі:** якщо LCP у Lighthouse лишиться > 2,5 с — прибрати preload другорядних шрифтів (4 файли, 123 КБ ділять канал із фото героя).

## 2026-11-23 — Кешування фото з public/images
- **Агент:** Claude Code
- **Гілка:** chore/image-cache (статус: змерджено в develop)
- **Що зроблено:** `next.config.ts` віддає для `/images/*` `Cache-Control: public, max-age=604800, stale-while-revalidate=604800` (було `max-age=0`, і браузер перепитував сервер на кожній сторінці). Тиждень фото береться з кешу без запиту, ще тиждень — з кешу з фоновою перевіркою. Назви фото без хешу: замінене фото з тією самою назвою дійде до відвідувачів, що повертаються, максимум за тиждень; для миттєвої заміни — нова назва файлу. На перше відкриття й оцінку Lighthouse не впливає; `/_next/static` і `/_next/image` мають власне кешування.
- **Також (поза кодом):** власник увімкнув HTTP/2 у nginx. На production (360 px, CPU ×4, ~1,6 Мбіт/с, медіана з 5) запит фото героя стартує на ~300 мс замість ~930 мс; LCP головної ≈ 2,78 с — тепер його обмежує ширина каналу (фото ділить її зі шрифтами 123 КБ, HTML 74 КБ і JS). «Legacy JavaScript» у Lighthouse (14 КіБ) — вбудований polyfill-module Next.js, налаштуваннями не прибирається, на оцінку не впливає.
- **Перевірено:** lint, build; на `next start` — новий заголовок на `/images/…`, у HTML і `og-image.png` без змін.
- **Що далі:** якщо LCP у Lighthouse лишиться > 2,5 с — зменшити HTML головної (242 КБ RSC-даних без стиснення) і/або preload шрифтів.
- **Файли:** next.config.ts, docs/ai/{CONTEXT,CHANGELOG}.md

## 2026-11-23 — LCP головної на мобільному: 3,24 → 2,38 с
- **Агент:** Claude Code
- **Гілка:** perf/home-lcp (статус: змерджено в develop)
- **Діагностика** (production `next start`, headless Chrome 360×780, CPU ×4, ~1,6 Мбіт/с, затримка 150 мс): LCP-елемент — фото першого слайда `01-750.avif` (не текст; текст-кандидат — лід на ~1,5 с). Розклад до змін: TTFB 151 мс → затримка запиту фото до ~800 мс (знайдене на 205 мс, але на локальному HTTP/1.1 шість з'єднань зайняті HTML, CSS і чотирма шрифтами) → завантаження 98 КБ ~2,35 с (канал ділиться з 221 КБ JS, 123 КБ шрифтів, 74 КБ HTML) → рендер ~50 мс. Тобто LCP упирається в обсяг байтів до LCP, а не в JS чи рендер.
- **Знайдена вада:** перше фото слайдера рендерилось без `fetchpriority="high"` і з `decoding="async"` — `HeroMediaSlider` не передавав `priority` (у звіті Modern Web Guidance я помилково вважав, що hero вже з високим пріоритетом — так було лише на сторінках з одним фото).

| Зміна | LCP `/`, медіана з 5 |
|---|---|
| До змін | 3 244 мс |
| `priority` для першого слайда (`fetchpriority="high"`, `decoding="sync"`) | 3 208 мс |
| `01-750.avif` перекодовано q45: 98 → 73 КБ (перевірка) | 2 772 мс |
| `01-750.avif` q40: 98 → 59 КБ (застосовано) | **2 376 мс** |

  CLS 0,0001 без змін. Сторінка області — 2 528 мс (не змінювалась).
- **Чому фото можна стиснути без зміни вигляду:** джерело `(max-width: 767px)` завжди лежить під затемненням `.hero::after` 74 %; після нього середня різниця з оригіналом 0,9/255 (3,5 % пікселів > 4/255), на фрагменті з людьми в натуральному розмірі оригінал, q45 і q40 не відрізнити; знімки 6 сторінок × uk/en × 1440/360 — 0 % різниці. Роздільність та сама (980×1314), перекодовано з наявного AVIF (оригіналу в репозиторії немає). Інші слайди (`02-750`, `03-750`) не чіпав: вони вантажаться лише при перемиканні.
- **Що ще заважає / не робили:** 221 КБ JS до LCP — це React, Next і Motion (слайдер, `Reveal`), без зміни компонентів не відкласти; калькулятор (30 КБ gz) нижче екрана, але React 19 не гідратує острівці пізніше без втрати серверного HTML. Шрифти (4 preload, 123 КБ) не чіпав — інакше текст миготить при завантаженні. На production за nginx з HTTP/2 затримка старту запиту фото (~0,6 с черги на HTTP/1.1) має бути меншою — варто переміряти Lighthouse після деплою. Hero сторінок областей (`/cec/` фото, 2,5 с) можна полегшити так само.
- **Перевірено:** `npm test` (47), lint, build; сторінка лишилась статичною.
- **Файли:** src/components/sections/home/{hero-media-slider,hero-slider}.tsx, public/images/home/hero/01-750.avif, docs/ai/{CONTEXT,CHANGELOG}.md

## 2026-11-23 — Калькулятори: коротке зведення для скрінрідера
- **Агент:** Claude Code
- **Гілка:** fix/calc-live-summary (статус: змерджено в develop)
- **Що зроблено:** з карток результату `QuickCalculator` і `ses-payback-calculator` прибрано `aria-live` (вся картка зачитувалась при кожному кроці повзунка). Замість цього — один `sr-only` `<p role="status">` (`components/calculator/result-summary.tsx`), завжди в DOM, оновлюється через 500 мс після останньої зміни (`use-debounced-value.ts`). Рядок будує чиста `buildCalculatorSummary` (`lib/calculator-summary.ts`, тест `calculator-summary.test.mjs`): частини без значення пропускаються, перша літера велика. Тексти — `calculator.summary` і `sesPayback.summary` (uk/en), числа через `formatNumber`:
  - головна: «СЕС 5 кВт, накопичувач SVIT HOME, резерв близько 15 год.» / "Solar plant 5 kW, battery SVIT HOME, about 15 h of backup.";
  - калькулятор окупності: «СЕС {kw} кВт, окупність близько {years} років, накопичувач {product}.» — окупність лише коли введено бюджет, інакше «СЕС 5 кВт, накопичувач SVIT HOME.».
- **Перевірено:** на головній і калькуляторі (uk, en) 10 змін повзунка за 300 мс → одне оновлення зведення через ~0,5 с; у `main` немає жодного `aria-live`. Знімки 6 сторінок × uk/en × 1440/360 — 0 % різниці. `npm test` (47), lint, build.
- **Файли:** src/lib/calculator-summary.ts (+ тест), src/components/calculator/{result-summary.tsx,use-debounced-value.ts,QuickCalculator.tsx,ses-payback-calculator.tsx}, messages/{uk,en}.json, docs/ai/{CONTEXT,CHANGELOG}.md

## 2026-11-23 — Керування hero-слайдером: лічильник, смуги, пауза
- **Агент:** Claude Code
- **Гілка:** feature/hero-slider-controls (статус: змерджено в develop)
- **Що зроблено:** за `design/hero-pause-perf` (рішення власника за звітом Modern Web Guidance, WCAG 2.2.2) у hero зі слайдами (головна, `/cec/`, uk/en) — група `role="group"` «Слайди» / "Slides": лічильник «01 / 03» (Montserrat 500, `tabular-nums`, « / 03» `text-muted-dark`, для скрінрідера `sr-only` «Слайд 1 з 3» без `aria-live`), смуга-кнопка на кожен слайд (новий `ui/progress-bar-button.tsx`: ціль 44 px, видима смуга 40×3 px — `w-10 h-0.75`, `aria-label` «Слайд N: {заголовок}», `aria-current`), кнопка паузи `IconButton` (нові гліфи `pause` / `play`, підпис «Зупинити / Відновити перемикання слайдів»). На lg — праворуч у рядку CTA (низ групи = низ кнопок), нижче — окремим рядком під кнопками. Тексти — `messages.hero.controls`.
  - Перемикання тепер рахує сама CSS-анімація активної смуги: кінець анімації (`animationend`) → наступний слайд, пауза — `animation-play-state: paused` (той самий патерн і ключові кадри `tab-progress`, що у вкладках накопичувачів). `setInterval` прибрано, заповнення й перемикання не розходяться після паузи.
  - `paused = userPaused || hovered || focused || pageHidden`; пауза кнопкою тримається, доки людина не натисне «Відновити». Наведення й фокус ставлять на паузу лише текст слайда, не контроли — інакше «Відновити» не діяло б, поки фокус на кнопці.
  - Контроли поза анімованим текстом: фокус на смузі не губиться при зміні слайда.
  - `prefers-reduced-motion`: ротації немає → немає кнопки паузи й заповнення; активна смуга повна, перемикання вручну.
  - На телефонах текст hero зі слайдами тепер у потоці (`flex-1` у колонці `.hero`): поки вміщається — та сама висота, на коротких екранах hero росте. На 568 px раніше eyebrow заходив під логотип (вада була й до цієї задачі), а контроли лягали б на індикатор прокрутки.
- **Відхилення від макета:** заповнення — `scaleX`, а не ширина (той самий вигляд, без перерахунку layout); hover кнопки паузи — наявний варіант `IconButton outline-dark` (рамка біла + `bg-line-dark`), а не `bg-fill-dark`, щоб усі круглі кнопки на темному були однакові.
- **Перевірено** (production-збірка): клавіатура — Tab: CTA → 3 смуги → пауза; Enter на паузі → «Відновити», заповнення стоїть; Esc нічого не робить; Space на смузі 2 → слайд 2, фокус лишається; пауза тримається 11 с; після «Відновити» за 10 с — слайд 3. Reduced motion (EN, 360): кнопки паузи й анімації немає, ручне перемикання працює. Група в серверному HTML; на сторінках з одним слайдом її немає. Знімки 6 сторінок × uk/en × 1440/360: зміни лише в hero головної й `/cec/`, висоти сторінок ті самі; без горизонтального скролу; 568 / 640 / 780 px — текст і контроли вміщаються. LCP головної 3 188 → 3 208 мс (шум), CLS 0,0001. `npm test`, lint, build.
- **Файли:** src/components/ui/{progress-bar-button,icon-button}.tsx, src/components/sections/home/{hero-slider,hero-slider-controls,hero-content-slider}.tsx, src/components/sections/PageHero.tsx, messages/{uk,en}.json, docs/ai/{CONTEXT,CHANGELOG}.md

## 2026-11-23 — Modern Web Guidance: сканування й покращення
- **Агент:** Claude Code
- **Гілка:** fix/modern-web-scan (статус: змерджено в develop)
- **Що зроблено:** `legacy-scan src` (3 знахідки) + ручний прохід гайдів `optimize-image-priority`, `dialog`, `light-dismiss-a-dialog`, `prevent-page-scroll-under-modal-dialog`, `navbar`, `menu`, `navigation-drawer`, `accordion`, `search-hidden-content`, `forms`, `accessible-error-announcement`, `required-field-feedback`, `persistent-toast-notifications`, `responsive-table`, `accessibility`, `motion`, `parallax-scroll-effects`, `scroll-entry-exit-effects`, `security`, `performance`, `visually-stable-font-fallbacks`, `switch`, `slider`. Вигляд сторінок не змінився (крім виправленого скролу на калькуляторі).

| Знахідка | Файл | Що радить гайд | Рішення |
|---|---|---|---|
| `[...arr].sort()` ×3 | `projects-showcase.tsx`, `content/insolation.ts` | `toSorted()` (js/copying-array-methods) | застосовано (лише код функцій, дані не змінено) |
| `priority` у `next/image` застарів у Next 16 | `PageHero`, `hero-video`, `product-hero` | LCP-зображенню — високий пріоритет | застосовано: `preload` (той самий preload + `fetchpriority=high`) |
| Вікно налаштувань cookie — `div role=dialog` з ручною пасткою фокусу | `CookieBanner.tsx` | нативний `<dialog>` + `showModal()`: inert-сторінка, Esc, top layer | застосовано; вигляд той самий (діалог — повноекранний шар, панель усередині) |
| Блокування скролу через `body { overflow: hidden }` | `CookieBanner.tsx`, `mobile-menu.tsx` | `overscroll-behavior: contain` на `dialog`/`::backdrop` | **ні**: у Safari `overscroll-behavior` не працює на неспрокручуваних елементах — сторінка під вікном прокручувалась би |
| Мобільне меню на весь екран, але Tab і скрінрідер ідуть на сторінку під ним | `mobile-menu.tsx` | модальний шар з inert-фоном | застосовано: усе поза шапкою `inert`, поки меню відкрите (UA і EN); Esc повертає фокус на бургер. На `<dialog>` не переводили — кнопка меню в шапці мусить лишатись активною |
| `aria-haspopup="true"` на мега-меню (= «menu») | `mega-menu-item.tsx` | навігація — disclosure без `aria-haspopup`, з `aria-controls` | застосовано; Esc тепер лишає фокус на кнопці (раніше фокус зникав разом із панеллю), Enter знову відкриває |
| Закриті відповіді FAQ (`visibility: hidden`) не знаходить Ctrl+F і текстові фрагменти | `FaqAccordion.tsx` | `hidden="until-found"` + `beforematch` | застосовано там, де підтримується (Chrome, Edge, Firefox); у Safari — як раніше. `<details name>` не беремо: кілька відкритих, фільтр тем і анімація |
| `aria-live="polite"` на hero-слайдері, що сам перемикається кожні 10 с | `hero-content-slider.tsx` | не оголошувати автоматичну ротацію | застосовано; ротація стає на паузу при наведенні, фокусі в тексті й прихованій вкладці |
| `role="alert"` на кожному повідомленні поля | `ui/form/field.tsx` | при submit — фокус на перше поле з помилкою, без окремого live-регіону на кожне поле | застосовано; `focusFirstInvalid` тепер шукає лише контроли (не `fieldset`) |
| Live-регіон тосту створювався разом із текстом | `toast.tsx` | постійний регіон | застосовано: контейнер `role="status"` завжди в DOM, помилка — `alert` |
| Прихована кнопка «вгору» лишалась у дереві доступності | `back-to-top.tsx` | — | застосовано: `inert`, поки кнопка схована |
| Перша клітинка шапки таблиць порівняння на мобільному `display:none` → для скрінрідера колонки зсунуті на одну | `comparison-table.tsx`, `backup-runtime.tsx`, `ses-plant-types.tsx` | `responsive-table`: заголовки мають відповідати клітинкам | застосовано: `sr-only md:not-sr-only` |
| Власне `.sr-only` у `globals.css` (з першого коміту, застаріла `clip`) поза шарами перебивало всі утиліти, зокрема `md:not-sr-only` | `globals.css` | `clip-path` замість `clip` | застосовано: дубль видалено, працює вбудований `sr-only` Tailwind (ідентичний вигляд) |
| Горизонтальний скрол на `/kalkulyator/okupnist-ses/` при 360 px (наявна вада) | `ses-payback-calculator.tsx` | — | застосовано: `ArrowLink wrap` для посилання «Детальніше про сонячні панелі у … області» |
| Немає `frame-ancestors`, COOP | `next.config.ts` | `Content-Security-Policy: frame-ancestors 'self'` + `X-Frame-Options`, `Cross-Origin-Opener-Policy: same-origin-allow-popups` | застосовано (CSP лише з `frame-ancestors` не обмежує скрипти) |
| Повна CSP з nonce, HSTS | `next.config.ts` | обов'язкові заголовки | **рішення власника** (див. нижче) |
| `Reveal` / паралакс на Motion | `reveal.tsx`, hero | CSS scroll-driven animations | **ні**: заміна наших компонентів; `animation-timeline` у Safari обмежений |
| Кольори в `oklch`, `:user-invalid`, `<input switch>`, `accent-color` | — | сучасні CSS-можливості | **ні**: токени в `@theme`; помилки форм — за нашою схемою (після submit); `switch` — лише Safari |
| Шрифти: стабільні fallback | `layout.tsx` | `size-adjust` для fallback | не потрібно: `next/font` уже робить `adjustFontFallback` |
| Посилання `target="_blank"` | футер, соцмережі, віджет | `noopener` | уже є |

- **Вимірювання** (production-збірка, headless Chrome, 360×780, CPU ×4, ~1,6 Мбіт/с, медіана з 3; Lighthouse не запускали):

| | LCP до → після | CLS до → після | тап по FAQ (тривалість події) |
|---|---|---|---|
| `/` | 3 144 → 3 188 мс | 0,0001 → 0,0001 | 24 → 16 мс |
| `/cec/lvivska-oblast/` | 2 540 → 2 544 мс | 0,0001 → 0,0001 | 16 → 24 мс |

  Різниця — у межах шуму; ці зміни не стосувались LCP (hero вже мав `fetchpriority=high`).
- **Перевірено:** `npm test` (44), `npm run lint` (з `lint:tokens`), `npm run build` — маршрути ті самі, усі статичні. Знімки 6 сторінок (головна, `/cec/`, Львівська область, резервне живлення, калькулятор, SVIT HOME) × uk/en × 1440/360 до й після: 22 з 24 — 0 % різниці пікселів; калькулятор 360 — +21 px (посилання переноситься), горизонтального скролу більше немає. Клавіатура (22 перевірки, uk і en): мобільне меню (inert, Esc → бургер), мега-меню (Esc → кнопка, Enter відкриває), вікно cookie (модальне, Tab не виходить на сторінку, Esc закриває й повертає фокус), FAQ відкривається за текстовим фрагментом, порожня заявка → фокус на «Ім'я» без `alert`. Заявка відправлена (тестовий рядок з `storage/leads.jsonl` прибрано). Повторний `legacy-scan src` — 0 знахідок.
- **Потрібне рішення власника:**
  - кнопка паузи для hero-слайдера (WCAG 2.2.2 вимагає видимого керування для автоматичного руху довше 5 с; зараз — пауза при наведенні й фокусі);
  - повна `Content-Security-Policy` з nonce: у Next nonce робить усі сторінки динамічними, плюс треба погодити домени GTM, GA4, Ads, Meta, TikTok;
  - `Strict-Transport-Security`: залежить від nginx і HTTPS на сервері; почати з короткого `max-age`;
  - калькулятори: `aria-live` на всьому блоці результату зачитує його при кожному русі повзунка — краще коротке зведення (потрібен новий текст у `messages`);
  - заміна `Reveal` / паралакса на CSS scroll-driven animations — не робили.
- **Файли:** src/components/{consent/CookieBanner,faq/FaqAccordion,calculator/ses-payback-calculator}.tsx, src/components/layout/header/{mobile-menu,mega-menu-item,mega-menu-panel}.tsx, src/components/sections/{PageHero,projects-showcase}.tsx, src/components/sections/hero/hero-video.tsx, src/components/sections/home/{hero-slider,hero-content-slider}.tsx, src/components/sections/{backup/backup-runtime,ses/ses-plant-types}.tsx, src/components/product-page/product-hero.tsx, src/components/ui/{arrow-link,back-to-top,comparison-table,toast}.tsx, src/components/ui/form/{field,focus}.ts(x), src/content/insolation.ts, src/app/globals.css, next.config.ts, docs/ai/{CONTEXT,CHANGELOG}.md

## 2026-11-23 — Плагін Modern Web Guidance (Google Chrome)
- **Агент:** Claude Code
- **Гілка:** chore/modern-web-guidance (статус: змерджено в develop)
- **Що зроблено:** у `.claude/settings.json` додано маркетплейс `googlechrome` і плагін `modern-web-guidance@googlechrome` (наявні плагіни без змін). В AGENTS.md — розділ «Modern Web Guidance»: Baseline target Widely available, поради довідкові, AGENTS.md має пріоритет, без нових залежностей і поліфілів, коли викликати плагін. CONTEXT.md — рядок у «Прийняті рішення».
- **Файли:** .claude/settings.json, AGENTS.md, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** плагін підхоплюється з нової сесії Claude Code (trust-запит). Сканування й покращення — окрема гілка `fix/modern-web-scan`.

## 2026-11-20 — Опис у блоці областей і на сторінках областей
- **Агент:** Claude Code
- **Гілка:** fix/region-links-text (статус: змерджено в develop)
- **Що зроблено:** за проханням власника речення «Генерація, приклад станції й окупність для кожної області.» / "Generation, an example plant and payback for every region." показується під заголовком `RegionLinks` і на сторінках областей («Сонячні панелі в інших областях»). Ключ `regionLinks.allText` → `regionLinks.text`.
- **Файли:** src/components/sections/region-links.tsx, messages/{uk,en}.json, docs/ai/{CONTEXT,CHANGELOG}.md

## 2026-11-20 — Мега-меню, мобільне меню й плаваючі кнопки
- **Агент:** Claude Code
- **Гілка:** fix/menu-floating-buttons (статус: змерджено в develop)
- **Що зроблено:**
  - Мега-меню: картка «Не знаєте, що обрати?» більше не розтягується на висоту колонок (`self-start`): 199 px замість 299 px при відкритих «Рішеннях».
  - Мобільне меню (і бургер на lg–xl): прокручується лише область під шапкою (`top-20` / `lg:top-32`, лінія `line-dark` зверху, `overscroll-contain`), тож розгорнутий список більше не їде під прозорий логотип і кнопки.
  - Плаваючі кнопки «вгору» й телефон: світла обводка `ring-1 ring-faint-dark`, при наведенні — біла обводка й `navy`; на темних секціях (hero, панелі, футер) кнопки більше не зливаються з фоном.
- **Файли:** src/components/layout/header/{mega-menu-panel,mobile-menu}.tsx, src/components/ui/{back-to-top,contact-widget}.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** перевірено на production-збірці: 375 і 1100 px — після прокрутки меню на 400 px вміст починається під шапкою (80 / 128 px); знімки — `.tmp/menu`.

## 2026-11-20 — Блок «Сонячні панелі по областях» на основних сторінках
- **Агент:** Claude Code
- **Гілка:** feature/region-links-sitewide (статус: змерджено в develop)
- **Що зроблено:** блок зі сторінки області винесено в спільний `RegionLinks` (`components/sections/region-links.tsx`) без зміни вигляду: лінія зверху (тепер по ширині вмісту, як в еталоні), заголовок H2 ліворуч (4/12), 26 пігулок праворуч (8/12), `<nav aria-label>`. Варіант `all` («Сонячні панелі по областях України» + «Генерація, приклад станції й окупність для кожної області.») — головна, хаб резервного живлення, калькулятор окупності, сторінка готелю, 5 сторінок продуктів (uk/en); `other` + `exclude` — сторінки областей (замість `region-others.tsx`, видалено). Тексти — `messages.regionLinks` (uk/en), `regionPage.others` прибрано.
- **Нотатки / що далі:**
  - Перевірено на production-збірці: блок на 13 сторінках (uk і en), 26 посилань (на сторінці області — 25, без неї самої), усі посилання тією ж мовою, блок після заявки й перед футером, один H1; на `/cec/`, `/polityka-cookie/` і «в розробці» блоку немає. Відступ від картки заявки до лінії — один токен секції (128 / 64 px), без подвоєння; 1440 і 360 px без горизонтального скролу. Знімки — `.tmp/region-links`.

## 2026-11-20 — Сторінки областей, карта на /cec/, title під живі запити
- **Агент:** Claude Code
- **Гілка:** feature/ses-regions (статус: змерджено в develop)
- **Що зроблено:**
  - Один список областей: `content/insolation.ts` розширено до 26 записів (дані з `design/seo-regions/data/regions.json`); головний калькулятор переведено на нього, `regions` у `content/calculator.ts` видалено. Значення 22 областей не змінювались; м. Київ = Київська (1 120); Донецька 1 230, Луганська 1 200 (колишні оцінки калькулятора), Крим 1 330 (приклад) — позначені `yieldEstimate`, на сторінці «Оцінка генерації».
  - 52 сторінки `/cec/{область}/` і `/en/cec/{область}/` (`region-page.tsx`, `sections/regions/*`): hero з крихтами, 4 картки (станція 5 кВт за рік, відхилення від середнього по Україні, найкращий місяць і грудень, потужність для 450 / 900 кВт·год через `pickSolarPlan`), графік по місяцях + `sr-only` таблиця, «Де працюємо» (міста, телефон офісу у Львові / Києві або основний), калькулятор окупності з вибраною областю, FAQ з відповідями з даних, заявка, «Сонячні панелі в інших областях». JSON-LD Service (AdministrativeArea / City), BreadcrumbList, FAQPage.
  - На `/cec/` — секція «Сонячні панелі у вашій області»: SVG-карта (кожна область — посилання, 5 відтінків шкали, підказка при hover / фокусі), Південь · Середнє · Захід, 26 пігулок, картка «Працюємо по всій Україні». Пункт «По областях» у шапці `/cec/` і в «На цій сторінці» футера; «Про компанію» з шапки `/cec/` прибрано — на 1280 px п'ять пунктів перекривались (у футері лишився).
  - Перелінковка: мега-меню «Рішення» → «СЕС по областях»; у калькуляторі окупності під вибором області — «Детальніше про сонячні панелі {в області}»; `llms.txt` — рядок на кожну область.
  - Нове: `lib/calc/region-yield.ts` (+ тести), `lib/region-stats.ts`, `lib/region-copy.ts`, `content/ukraine-map.ts`, токени `--color-scale-1…5`, `PillLink size="compact"`, `FaqSection questions`, `serviceSchema` з `areaServed` області, `formatDate`, `nationwideService` у `company.ts` («Працюємо по всій Україні», 2026-11-20).
  - Рядок «Дані оновлено …» на калькуляторі тепер бере дату з `insolation.ts`; шаблони «{region} область» → повна назва області.
- **Title (було → стало):**

| Сторінка | Було | Стало |
|---|---|---|
| `/` | СЕС і резервне живлення під ключ — INIT ENERGY | Сонячні панелі й резервне живлення під ключ по Україні |
| `/cec/` | Сонячні електростанції під ключ для дому й бізнесу | Сонячні панелі під ключ: СЕС для дому й бізнесу |
| `/rezervne-zhyvlennya/` | Резервне живлення під ключ для дому й бізнесу | Резервне живлення від відключень світла під ключ |
| `/kalkulyator/okupnist-ses/` | Калькулятор СЕС: потужність і окупність станції | Калькулятор сонячних панелей: потужність і окупність |
| `/svit-600/` | SVIT 600 — портативна зарядна станція 865 Вт·год | Зарядна станція для квартири SVIT 600 — 865 Вт·год |
| `/svit-home/` | SVIT HOME — комплект резервного живлення 6,2 кВт, 5,12 кВт·год | Інвертор з батареєю для дому SVIT HOME — 6,2 кВт |
| `/svit-plus-5000/` | SVIT PLUS 5000 — батарея LiFePO₄ 5,12 кВт·год | Батарея LiFePO₄ для дому SVIT PLUS 5000 — 5,12 кВт·год |
| `/svit-plus-16000/` | SVIT PLUS 16000 — батарея LiFePO₄ 16,07 кВт·год | Акумулятор LiFePO₄ 16 кВт·год для СЕС — SVIT PLUS 16000 |
| `/bess/` | LITHIUMVALLEY BESS — накопичення 208–1 044 кВт·год | Промислова система накопичення енергії BESS — LITHIUMVALLEY |

  EN — те саме за змістом. H1 калькулятора: «Калькулятор сонячних панелей і СЕС»; у лід hero й секції сегментів `/cec/` додано «сонячні панелі».
- **Нотатки / що далі:**
  - Перевірено на production-збірці: усі 52 сторінки областей 200, один H1, title ≤ 60 і description 140–160 (усі унікальні), canonical, 3 hreflang, JSON-LD (Service + BreadcrumbList + FAQPage), усі 52 у sitemap і `llms.txt`; 360 px без горизонтального скролу (`/cec/`, сторінки областей, калькулятор, головна); шапка без перекриттів на 1280 / 1366; карта: Tab фокусує область (заливка ink + підказка), клік відкриває сторінку області. Рівненська й Волинська відрізняються числами, графіком, містами, FAQ, H1, title і description. Знімки — `.tmp/regions`.
  - Англійські адреси — `/en/cec/{український slug}/`, а не англійські slug з `regions.json`: перемикач мов, hreflang і `localizePath` на всьому сайті побудовані на однаковому шляху.
  - Англійські назви міст — транслітерація агента (у `regions.json` були лише українські).
  - H1 сторінок продуктів — назва продукту (макет hero); нові ключі є в title, у H1 їх не додавали — потрібне рішення щодо макета.
  - TODO(content) для власника:
    - Донецька (1 230), Луганська (1 200), Крим (1 330) — перевірити в PVGIS;
    - формулювання для Донецької, Луганської й Криму («Дані про генерацію — для розрахунку станції. Можливість виїзду інженер уточнить телефоном.»), title Криму «— генерація СЕС»;
    - списки міст (і районів Києва) у `insolation.ts`, їхні англійські назви;
    - атрибуція карти (MapSVG, CC BY 4.0) — підпис під картою на `/cec/`, прибирати не можна.

## 2026-11-20 — Дані калькулятора в заявці лише з вибраних полів; одне джерело даних накопичувачів
- **Агент:** Claude Code
- **Гілка:** fix/calc-lead-data (статус: змерджено в develop)
- **Що зроблено:**
  - Причина «зайвих» даних у заявці: кнопка результату завжди передавала всі значення за замовчуванням. Тепер обидва калькулятори (головна й `/kalkulyator/okupnist-ses/`) рахують змінені поля; без змін кнопка лише прокручує до форми й ставить курсор у «Ім'я», `calculatorData` порожнє, подія CTA має `interacted: false`.
  - Формат `calculatorData`: `calculator`, `changedFields`, `selected` (лише змінене), `assumed` (решта, з чим порахована рекомендація), `sources` (`?type=` → `url`), `recommendation`, `objectTypeOverridden` (інший тип у формі). Поля, що не стосуються мети, не передаються. Після прикріплення кожна зміна калькулятора оновлює дані й підсумок у формі; підсумок — лише вибрані поля + рекомендація («Квартира · 260 кВт·год/міс. · 12 год → Накопичувач SVIT HOME»). Після відправки форма й лічильник змін скидаються. `generate_lead` — `calculator` і `calculatorFields` замість усього JSON.
  - Новий `content/storage.ts`: одна корисна ємність 0,9 (замість 0,9 / 0,9 / 1 у трьох місцях), порядок кандидатів за сегментом, `capacityWh`, `outputLimitW` (перенесено з `backup.ts`), `svitModelCount`. У `products.ts` — `maxParallel` (SVIT PLUS 5000 — 16 замість 3 / 6; SVIT PLUS 16000 — 1 замість 2 / 4; LITHIUMVALLEY — 5 блоків замість 5 / 4) і `inverter`.
  - Калькулятор окупності рахує години тією самою `runtimeHours`, що й хаб резервного живлення; продукт із виходом, меншим за навантаження, не рекомендується (SVIT HOME — 6,2 кВт з `products.ts` замість 6). Кандидати — у порядку сегмента, а не за ємністю.
  - Калькулятор головної: якщо нічого не вміщається — найбільший варіант (раніше — останній у списку, і рекомендація могла зменшитись). Посилання «Рішення»: «Резерв» → `/rezervne-zhyvlennya/`, інші цілі → `/cec/` (раніше для резерву посилання не було).
  - Тексти uk/en: `calculator.summaryKwh`; примітка під кнопкою — «параметри, які ви змінили, підставляться в заявку»; формула накопичувача в «Як ми рахуємо» — «… ÷ корисна частка ємності (90%)».
- **Як змінились рекомендації (було → стало):**
  - Головна, за замовчуванням (будинок, СЕС + резерв, 450 кВт·год, Львівська, 8 год): СЕС 5 кВт + SVIT HOME, ≈ 15 год → без змін. Квартира за замовчуванням: SVIT 600 → без змін.
  - Головна, бізнес за замовчуванням (5 000 кВт·год, 8 год): 3 × SVIT PLUS 16000 (48,2 кВт·год, ≈ 10 год) → 8 × SVIT PLUS 5000 (41 кВт·год, ≈ 9 год).
  - Головна, будинок 1 200 кВт·год × 24 год: 2 × SVIT PLUS 16000 → 5 × SVIT PLUS 5000 (25,6 кВт·год).
  - Калькулятор окупності за замовчуванням: SVIT HOME 16,1 год → 14,5 год (90 % замість 100 % номіналу); приклад у «Як ми рахуємо» — «близько 16 год» → «близько 14 год». Для набору хабу «будинок» (1 068 Вт) SVIT HOME дає 4,3 год на обох сторінках.
  - Калькулятор окупності, квартира з великим навантаженням (плита, кондиціонер, насос, 24 год): «потрібна індивідуальна конфігурація» → 14 × SVIT PLUS 5000 + гібридний інвертор (SVIT PLUS 5000 тепер кандидат і для квартири, як на головній).
- **Файли:** src/content/{storage,products,calculator,ses-calculator,backup}.ts, src/lib/{calculator,calculator-lead,calculator-bridge}.ts, src/lib/calc/{ses-core,ses}.ts, src/components/calculator/{QuickCalculator,ses-payback-calculator,ses-payback-state,use-lead-attachment}.tsx, src/components/forms/LeadForm.tsx, src/components/sections/backup/backup-runtime.tsx, src/components/sections/ses-payback/{ses-payback-hero,ses-payback-method}.tsx, тести `calculator.test.mjs`, `calculator-lead.test.mjs`, `calc/ses.test.mjs`, messages/{uk,en}.json, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:**
  - Перевірено: `npm test` (38), lint, build. На production-збірці в headless Edge (головна й калькулятор окупності, uk і en): одразу кнопка → без плашки, у заявці `calculatorData` порожнє; 2 поля → кнопка → плашка з цими полями й фокус на «Ім'я»; третє поле → плашка оновилась; відправка → у `storage/leads.jsonl` `changedFields` із 3 полів; після відправки дані відкріплено. `?type=business` → `sources.objectType = "url"`, інший тип у формі → `objectTypeOverridden: true`.
  - SVIT PLUS 16000 для будинку тепер фактично не рекомендується: SVIT PLUS 5000 × n (до 81,9 кВт·год) вміщає все, що він покриває, раніше в порядку. Якщо власник хоче 16000 між SVIT HOME і SVIT PLUS 5000 × n — змінити порядок у `storageOrder`.
  - Подія CTA калькулятора окупності лишилась `calculator_cta_click` (додано `interacted`), щоб не ламати наявну аналітику.
  - TODO(content): DoD 0,9 для кожного продукту; паралельне підключення SVIT PLUS 16000; кількість блоків LITHIUMVALLEY за конфігурацією.

## 2026-11-18 — Оптимізація завантаження hero та зображення SVIT HOME
- **Агент:** Codex
- **Гілка:** fix/image-delivery (статус: змерджено в develop)
- **Що зроблено:** додано проміжний AVIF 1440 px до всіх responsive-наборів `HeroPicture` (головна, хаб СЕС, резервне живлення та сторінка готелю) і новий breakpoint 1280–1599 px; на viewport 1362 px головний hero тепер передає 81 КБ замість 123 КБ. Для фото SVIT HOME у картці ємності прибрано `unoptimized`, уточнено `sizes` і відновлено адаптивний `srcset` Next Image: перевірений AVIF 640 px важить 8 КБ замість оригінальних 16,5 КБ. `npm run lint` і `npm run build` проходять.
- **Файли:** src/components/sections/hero/hero-picture.tsx, src/components/sections/home/hero-slides.ts, src/components/products/CapacityCard.tsx, src/content/backup.ts, src/content/solutions.ts, public/images/{home/hero,cec/hero,cec/rishennya/hotel,rezervne-zhyvlennya}/*-1440.avif, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** після production-деплою повторити Lighthouse для головної сторінки; точна оцінка економії залежить від viewport і DPR браузера.

## 2026-11-18 — Видалення некоректної Product JSON-LD розмітки
- **Агент:** Codex
- **Гілка:** fix/remove-product-schema (статус: змерджено в develop)
- **Що зроблено:** зі спільного шаблону всіх сторінок продуктів uk/en видалено `Product` JSON-LD без обов’язкових для Google полів `offers`, `review` або `aggregateRating`; невикористовуваний builder `productSchema` і залежний мертвий код також видалено. `BreadcrumbList`, `Organization` та `HowTo` для BESS залишено без змін.
- **Файли:** src/components/pages/product-page.tsx, src/lib/seo/schema.ts, src/content/product-pages.ts, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** після production-деплою запустити перевірку виправлення в Google Search Console; звіт оновиться лише після повторного сканування сторінок Google.

## 2026-11-18 — Файл верифікації Google
- **Агент:** Codex
- **Гілка:** chore/google-site-verification (статус: змерджено в develop)
- **Що зроблено:** додано наданий власником HTML-файл для підтвердження права власності на сайт у Google; Next.js публікує його за кореневою адресою `/google668e1d92f8f590b1.html`.
- **Файли:** public/google668e1d92f8f590b1.html, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** після production-деплою адресу можна використати для завершення перевірки в Google Search Console.

## 2026-11-18 — Нове фото hero на сторінці «Резервне живлення»
- **Агент:** Claude Code
- **Гілка:** fix/backup-hero-photo (статус: змерджено в develop)
- **Що зроблено:** фото власника (інвертор, накопичувач і щиток на стіні гаража, 5504×3072 JPEG) нарізано в AVIF через `sharp` (уже є в проєкті як залежність Next.js, нових пакетів не додано): `public/images/rezervne-zhyvlennya/hero-{750,1280,1920,2560}.avif` — 10 / 19 / 33 / 55 КБ, якість 62 (на великих однотонних стінах нижча якість дає смуги). Старі файли hero замінено. Alt оновлено uk/en: «Інвертор, накопичувач і щиток системи резервного живлення на стіні гаража». Позиція кадру лишилась `right` (70 % 50 %) — обладнання праворуч.
- **Файли:** public/images/rezervne-zhyvlennya/hero-*.avif, src/content/backup.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** перевірено на production-збірці: на 1440 завантажується hero-1920.avif, на 390 — hero-750.avif, alt правильний, текст читається на затемненні; на телефоні в кадрі накопичувач.

## 2026-11-18 — Кроки рядками замість карток на всьому сайті
- **Агент:** Claude Code
- **Гілка:** fix/steps-rows (статус: змерджено в develop)
- **Що зроблено:**
  - Новий `StepsList` (`components/ui/steps-list.tsx`) за `design/steps-rows`: рядки з лініями `line`, без карток і тіней — номер «01» (light, `text-number-sm`), кружок з іконкою 48 px, назва H3 напівжирна, опис `text-body text-muted`; `Reveal` на рядок із невеликим stagger. lg: 4 колонки; md і вузькі колонки — опис під назвою; мобільний — номер та іконка в рядку, далі назва й опис.
  - Шаблони сіток — іменовані токени `--grid-template-columns-steps` (`auto auto minmax(0, 4fr) minmax(0, 6fr)`) і `-compact` у `@theme` (довільні `grid-cols-[…]` заборонені лінтером).
  - Застосовано: `StepsSection` (`/cec/`, `/rezervne-zhyvlennya/`), етапи на `/rishennya/ses-dlya-gotelyu/` (`layout="compact"`, назва 20 px, `<p>` під H3 «Етапи»), процес на `/bess/` (`HowToSteps`, HowTo JSON-LD без змін). Тексти й дані не змінювались.
  - Рішення щодо схожих блоків: вузли гібридної СЕС (`ses-how-hybrid`), «Як працює резервне живлення» (`backup-how`) і аргументи «Про компанію» (`trust-block`) лишились картками зі `StepMarker` — це вузли схеми й аргументи на темній панелі, а не послідовність етапів, і візуально вони не дублюють старі картки етапів. `StepMarker` тому не видалено.
- **Нотатки / що далі:**
  - Перевірено на production-збірці: 4 сторінки × uk / en × 1440 / 820 / 360 — 24 з 24: без горизонтального скролу, на 1440 жодна назва кроку не переноситься. Знімки — `.tmp/steps`.
  - На сторінці готелю при 24 px назви «Запуск і підключення» / "Consumption analysis" переносились у вузькій колонці поруч із фото — для компактного варіанта назва 20 px і менший відступ між колонками.

## 2026-11-18 — Хаб «Резервне живлення» /rezervne-zhyvlennya/
- **Агент:** Claude Code
- **Гілка:** feature/backup-hub (статус: змерджено в develop)
- **Що зроблено:**
  - Нова сторінка `/rezervne-zhyvlennya/` і `/en/rezervne-zhyvlennya/` за `design/rezervne-zhyvlennya`: hero з фото власника, «Для кого» (3 фото-картки), «Як працює» (темна панель + посилання на СЕС), «Обладнання» (SVIT + Deye / Victron / Huawei), «Скільки протримається» (таблиця автономності), промо-банер СЕС, «Генератор, ДБЖ чи система з накопичувачем», «Про компанію», етапи, FAQ (6 питань), заявка.
  - Години автономності рахуються в коді: `lib/calc/backup-runtime.ts` (тести `backup-runtime.test.mjs` відтворюють усі 9 значень макета), набори з `content/appliances.ts`, місткості й обмеження потужності з `products.ts`.
  - Нові спільні компоненти: `ComparisonTable` (`ui/comparison-table.tsx`) і `StepsSection` (`sections/steps-section.tsx`, на ньому тепер і `SesSteps` на `/cec/`). `RowLink` отримав `bordered`, `HeroPicture` — позицію `right` (утиліта `object-hero-right`).
  - SEO: `buildMetadata` (title 45, description 155 / 158), canonical + hreflang, `localizedPaths`, sitemap; JSON-LD Service, BreadcrumbList, FAQPage. Шапка (4 розділи), футер («На цій сторінці», «Розділи сайту»), мега-меню «Рішення» (колонка «Резервне живлення», `services.backupHub`). CTA карток сегментів на головній ведуть на хаб.
  - FAQ: 6 нових питань (`pages: ["backup"]`); з чотирьох старих записів знято мітку `backup` (на головній вони лишились), щоб на хабі були питання макета без дублів.
  - Фото: `public/images/rezervne-zhyvlennya/{hero,segment-apartment,segment-business}-*.avif`.
- **Нотатки / що далі:**
  - Перевірено на production-збірці: обидві мови 200, один H1, 9 H2 у порядку макета, JSON-LD Service + BreadcrumbList + FAQPage, canonical і hreflang, обидві адреси в sitemap, 360 і 1440 без горизонтального скролу; доступність — без зображень без alt, посилань / кнопок / полів без імені, дублікатів id і пропусків рівнів заголовків. Знімки — `.tmp/backup`.
  - Lighthouse не запускали: встановлення пакета через npx заблоковано дозволами середовища; натомість — перевірка вище.
  - TODO(content) — не опубліковано до підтвердження власником:
    - «Власне виробництво в Україні» для всієї лінійки SVIT (підтверджено лише SVIT PLUS 5000 і SVIT HOME) — ярлик картки SVIT нейтральний «Лінійка INIT ENERGY», замість переваг — моделі з місткостями;
    - «Гарантія напряму від виробника»;
    - чи підключаються SVIT до інверторів Deye / Victron / Huawei і чи обслуговуємо системи, встановлені іншими, — смугу «Вже маєте систему іншого бренду?» і питання FAQ «Чи обслуговуєте системи, які встановили не ви?» прибрано;
    - «5 моделей SVIT» у блоці «Про компанію» — використано спільний блок з даними `company.ts` (4 моделі SVIT).
  - Поправка до макета: «SVIT HOME — вбудована система» → «SVIT HOME — комплект з інвертором» (комплект на стійці без настінного монтажу).
  - Кнопка «Усі накопичувачі SVIT» веде на секцію накопичувачів головної, бо `/svit/` ще не створена.
  - Таблицю типів СЕС на `/cec/` на `ComparisonTable` не переносили: її дані — так/ні й текст без статусів.

## 2026-11-18 — Картка результату калькуляторів з фоном футера
- **Агент:** Claude Code
- **Гілка:** fix/calc-result-glow (статус: змерджено в develop)
- **Що зроблено:** темна картка результату в `QuickCalculator` (головна) і `ses-payback-calculator` (/kalkulyator/okupnist-ses/) замість суцільного `bg-ink` отримала `bg-ink-glow` — той самий фон, що у футера (ink із синім світінням з верхніх кутів). Тексти, лінії, кнопки й `aria-live` без змін.
- **Файли:** src/components/calculator/{QuickCalculator,ses-payback-calculator}.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:**
  - Перевірено на production-збірці: головна й калькулятор, uk і en, 1440 і 360 — у правому верхньому куті картки rgb(7, 16, 51) проти rgb(0, 2, 23) унизу (світіння видно). Знімки — `.tmp/calc-glow`.
  - Контраст: `text-muted-dark` на найсвітлішій точці (`navy`) ≈ 10 : 1; тексту `text-faint-dark` у картках результату немає (на `navy` він дав би лише ≈ 4,4 : 1).
  - Інших темних карток саме з результатом на `bg-ink` немає. Не змінено (не результати): картки планів у «Типових СЕС» (`ses-payback-plans`, тон `ink`), темні картки продуктів і проєктів, спливаюча картка віджета контактів, підказка.

## 2026-11-18 — Два телефони в секції заявки; фокус полів без кільця
- **Агент:** Claude Code
- **Гілка:** fix/lead-phones-input-focus (статус: змерджено в develop)
- **Що зроблено:**
  - `LeadContactCard` за `design/lead-phones-focus`: під «Не хочете чекати? Зателефонуйте» — телефон кожного офісу (`offices.map`, Львів, потім Київ, `gap-3`), білий кружок 44 px (`IconButton size="sm"`), номер на крок менший (18 → 24 → 30 px за шириною контейнера); `contact_click` і `aria-label` для кожного номера; рядок з адресою й посиланням на карту прибрано, email лишився. Невикористаний варіант `card` і пропс `variant` видалено. Нових текстів немає; ключів для адреси в повідомленнях не було.
  - `inputClasses`: фокус без сірого кільця — на світлому рамка `ink` + `shadow-card`, на темному рамка `white` без тіні; `transition-colors` → `transition`, щоб тінь з'являлася плавно. Діє на всі поля (заявка, калькулятори). Чекбокс, перемикач, пігулки й плитки — без змін.
- **Нотатки / що далі:**
  - Перевірено на production-збірці: `/`, `/en/`, `/svit-plus-5000/`, `/kalkulyator/okupnist-ses/` на 360 і 1440 — два номери вміщуються, посилань на карту немає, один email, без горизонтального скролу; поле «Ім'я» після Tab: рамка ink, `box-shadow` = shadow-card, кільця й outline немає; наведення — рамка ink 40 %, тож перехід до фокуса помітний. Знімки — `.tmp/lead-phones`.

## 2026-11-17 — Секція заявки: картка з фото й форма з плитками
- **Агент:** Claude Code
- **Гілка:** feature/lead-section-redesign (статус: змерджено в develop)
- **Що зроблено:**
  - `LeadSection` за `design/lead-form`: одна картка `rounded-panel` з рамкою, 5 : 6 з 11 колонок. Ліворуч фото даху під `.scrim-lead`, шапка секції на темному, вертикальні кроки `LeadSteps` (на сторінках продуктів — картка «У заявці вже вказано»: `rounded-tile`, `bg-fill-dark`, `ring-line-dark`, мініатюра 64 px), контакти `LeadContactCard variant="inline"`. Праворуч форма на `bg-surface`.
  - Форма: шапка H3 «Заявка на розрахунок» / "Request a quote" + «Передзвонимо протягом робочого часу» (`leadSection.form.cardTitle`, `cardNote`); тип об'єкта — плитки 84 px з іконками (`RadioPills variant="tiles"`, нативні радіо, обрана — `ink` з білим кружком-галочкою); ім'я й телефон в одному рядку з `sm`; відступи між групами 24 px (`FormCard stackClassName`). Валідація, Server Action, honeypot, UTM, міст калькулятора, тост, `#contacts` — без змін.
  - Блакитну панель (`panel`) прибрано: сторінки продуктів використовують той самий макет. Пропс `cardTone` у LeadForm видалено.
  - `content/segments.ts`: `objectTypeIcons` (квартира, будинок, бізнес — ті самі іконки, що й `segmentIcons`; готель `Hotel`, інфраструктура `Landmark`, інше `Ellipsis`). globals.css: `.scrim-lead`. Водяний знак CONTACT у секції прибрано.
- **Нотатки / що далі:**
  - Перевірено на production-збірці 36 комбінацій (головна, `/cec/`, сторінка готелю, калькулятор, 5 сторінок продуктів; uk і en; 360 і 1440): без горизонтального скролу, один H1, у секції H2 → H3, номер телефону вміщується, фото завантажується, підписи кнопки відправки як раніше. Знімки — `.tmp/lead`.
  - На 360 px номер у контактах спершу не вміщався (кружок 48 px тепер у тому ж рядку) — розміри за контейнером зменшено на крок (18 → 24 → 30 → 36 px).
  - Контраст на фото оцінено розрахунком для найгіршого випадку (біле фото під 72 % ink): `text-muted-dark` ≈ 5,7 : 1, білий текст вище.
  - Кружок телефону 48 px (`IconButton md`), у макеті 52 px — розміру 52 немає.

## 2026-11-17 — Промо-банер «Сонячні електростанції під ключ» на головній
- **Агент:** Claude Code
- **Гілка:** feature/promo-banner (статус: змерджено в develop)
- **Що зроблено:**
  - Новий `PromoBanner` (`src/components/ui/promo-banner.tsx`) за `design/promo-handoff`: текст ліворуч (11/24 ширини), фото праворуч (7/12) з вигнутим краєм і напівпрозорим обідком через CSS-маску; тони `light` / `dark`; на мобільному фото 200 px угорі з вигнутим низом, кнопка на всю ширину; без фото — `MediaPlaceholder`. Заголовок — `<p>`, посилання лише кнопка.
  - globals.css: `.bg-ink-glow-start` (світіння з лівого верхнього кута), утиліти `mask-promo-curve`, `mask-promo-curve-bottom`, `object-promo` (позиція фото 60 % 22 %) через `@utility`, щоб працював варіант `lg:`.
  - Головна: банер між «Що вам потрібно живити?» і «Накопичувачами» (`pt-section-sm lg:pt-section`, у `Reveal`), веде на `/cec/` і `/en/cec/`. Смугу «Сонячні електростанції під ключ» під картками видалено разом із `hub.details`; додано `hub.cta` і `hub.imageAlt` (uk/en).
  - Фото власника: `public/images/home/promo/ses-roof-{750,1280,1920}.avif`.
- **Нотатки / що далі:**
  - Перевірено на production-збірці (`/` і `/en/`, 1440 і 360): висота банера 320 px на десктопі, у банері 0 заголовків і одне посилання, фото завантажується з локалізованим alt, 360 px без горизонтального скролу, один H1. Знімки — `.tmp/promo`.
  - Заголовок банера: `text-h3` → `text-h2-md` (24 → 36 px) як найближчі токени.
  - `next/image` бере файл 1920 і сам віддає потрібні розміри (як інші фото сайту); файли 750 / 1280 лежать поруч на майбутнє.

## 2026-11-17 — Футер v2: рядок заклику й колонка «Контакти»
- **Агент:** Claude Code
- **Гілка:** feature/footer-v2 (статус: змерджено в develop)
- **Що зроблено:**
  - За `design/footer-v2` до футера додано два блоки, решта без змін:
    - `FooterCta` угорі панелі: «Почнемо з розрахунку», `<p>` «Підберемо СЕС або резервне живлення під ваш об'єкт» (`text-h2-sm` → `text-h2-md`), «або зателефонуйте» + телефон `offices[0]` (`contact_click`, `location: footer_cta`), кнопка «Розрахувати систему» на калькулятор окупності; на мобільному кнопка на всю ширину, телефон під нею.
    - `FooterContacts`: «Контакти» — кожен офіс з `offices` («місто · адреса» + `tel:`), потім email з `companyContacts`; `<address>`; ті самі дані, що в JSON-LD.
  - Сітка колонок: 4 : 3 : 3 : 3 (13 треків, `gap-14`), без якорів сторінки 6 : 3 : 3.
  - `Button`: новий розмір `lg` (56 px).
  - `formatPhone` тепер дає «+380 67 198 55 50» (було «+38 067 198 55 50») — **змінилось на всьому сайті**: шапка, мобільне меню, картка контактів заявки, FAQ, віджет контактів, `llms.txt`.
  - Тексти uk/en: `footer.cta` (`eyebrow`, `title`, `callCaption`, `button`), `footer.contactsTitle`.
- **Нотатки / що далі:**
  - Перевірено на production-збірці: `/`, `/cec/`, `/svit-plus-5000/`, `/en/`, `/polityka-cookie/`, `/kalkulyator/okupnist-ses/` — 360 px без горизонтального скролу, один H1, у футері 0 заголовків, 3 `tel:` і 1 `mailto:`, кнопка веде на калькулятор поточною мовою. Знімки 1440 / 768 / 390 — `.tmp/footer-v2`.
  - Розміри за найближчими токенами: заголовок заклику 36 px на lg (у макеті 40), 30 px на мобільному (у макеті 28); номер телефону 18 px (`text-lead`); номери в «Контактах» 14 px (у макеті 15).
  - Підпис «місто · адреса» — `text-muted-dark`: `text-faint-dark` дає контраст нижче 4,5 : 1 для дрібного тексту на ink.
  - Окремої події кліку по кнопці заклику немає, нову не додавали (як у handoff).

## 2026-11-17 — Футер за handoff власника; правило папки `design/`
- **Агент:** Claude Code
- **Гілка:** feature/footer-handoff (статус: змерджено в develop)
- **Що зроблено:**
  - Футер переверстано за `design/footer-handoff` (замінює варіант «З закликом» з feature/footer-cta): колонки бренд · «На цій сторінці» · «Розділи сайту» 6 : 3 : 3 (без якорів 9 : 3), логотип 88 px, опис, кружки соцмереж з рамкою `faint-dark`; поточний розділ білий; нижній рядок — «© {рік} INIT ENERGY», «Конфіденційність · Cookie · Умови» (повна назва в `aria-label`/`title`), «Налаштування cookie» з іконкою 14 px, «UA | EN», авторство; великий напис `FooterMark` повернуто й підтягнуто (viewBox 0 0 1408 170, y 200, `text-line-dark`, `-mt-2`), літери обрізані нижніми кутами.
  - Перемикач мов: спільний хук `useLanguageLinks` (`src/i18n/use-language-links.ts`) і текстовий `LanguageSwitcher` «UA | EN» з тонами `dark` / `light` — у шапці, мобільному меню й футері; варіант `pill` прибрано.
  - Видалено розсилку (`newsletter-form.tsx`, `app/actions/newsletter.ts`, `lib/newsletter.ts`, тексти `footer.newsletter`), `InputAction` (використовувався лише нею), заклик і офіси з попереднього варіанта (`footer.cta`, `officesLabel`, `callOffice`, `cityIn` у `company.ts`).
  - `SocialLinks variant="circle"`: рамка `faint-dark`, hover — біла рамка й іконка (так само у віджеті контактів).
  - Нове правило в AGENTS.md «Дизайн-handoff»: власник кладе задачі в `design/`, агент виконує й очищає папку; `design/` у `.gitignore`.
- **Нотатки / що далі:**
  - Перевірено на production-збірці: 360 px без горизонтального скролу на `/`, `/cec/`, `/svit-plus-5000/`, `/en/`, `/polityka-cookie/`; перемикач веде на ту саму сторінку іншою мовою (шапка й футер); на сторінці без якорів колонки «На цій сторінці» немає; знімки 1440 / 768 / 390 — `.tmp/footer-handoff`.
  - Розміри: в еталоні посилання й опис 15 px, у нас `text-small` = 14 px (токена 15 px немає після рефакторингу типографіки); `white/12` для напису → `text-line-dark` (16 %) як найближчий токен — як і просить handoff.
  - Посилання колонок — `NavLink` (спільний компонент навігації), а не `footerLinkClasses`: так вимагає розділ «Кнопки й посилання».
  - У «Розділах сайту» на макеті є «Резервне живлення» — такої сторінки ще немає, тому пункт не додано (дані — `getSiteSections`, як у handoff).

## 2026-11-17 — Футер «З закликом» і видимість Reveal при reduced motion
- **Агент:** Claude Code
- **Гілка:** feature/footer-cta (статус: змерджено в develop)
- **Що зроблено:**
  - Футер переверстано за варіантом 2 «З закликом»: рядок заклику (Eyebrow «Консультація», `<p>` «Розрахуємо систему під ваш об'єкт» — `text-hero` на lg як найближчий токен до 64 px, кнопка `HeaderLeadCta`); офіси Львів і Київ із `company.ts` — кожна клітинка є `ContactLink` (`tel:`, `contact_click`, `location: footer`) з декоративним `IconButton` телефону, що заповнюється при hover; навігація (сітка 11 колонок 5/3/3, `NavLink size="body"`, поточна сторінка в «Розділах сайту» біла); розсилка 5/6; нижній рядок з короткими правовими посиланнями, `CookieSettingsLink`, новим `LanguageSwitcher variant="pill"` і авторством.
  - Мобільний: усе стовпчиком, офіси через горизонтальну лінію, нижній рядок — копірайт → правові → мова й автор; цілі натискання ≥ 44 px. md: заклик стовпчиком, офіси 2 колонки, навігація 2 колонки з брендом угорі.
  - Нові тексти uk/en: `footer.label`, `footer.cta`, `footer.officesLabel`, `footer.callOffice`, `footer.legalShort`; оновлено `footer.newsletter.text` і `footer.copyright`. `company.ts`: `cityIn` («у Львові», «in Lviv»).
  - Видалено `footer-mark.tsx` (великий напис), `footerLinkClasses` і старий макет у 24 колонки.
  - **Вада, знайдена під час перевірки (була й раніше):** при `prefers-reduced-motion: reduce` уміст у `Reveal` лишався невидимим на всьому сайті — сервер віддавав `opacity: 0`, а клієнт підміняв `motion.div` на такий самий `div`, і React не виправляв атрибут `style`. Тепер `Reveal` має один шлях рендеру з `data-reveal`, а CSS у globals.css при reduced motion примусово показує кінцевий стан.
- **Файли:** src/components/layout/footer/{footer,footer-columns,footer-styles}.tsx, src/components/layout/footer/footer-mark.tsx (видалено), src/components/layout/header/language-switcher.tsx, src/components/ui/{nav-link,reveal}.tsx, src/app/globals.css, src/content/company.ts, messages/{uk,en}.json, scripts/lint-tokens.mjs, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:**
  - Перевірено на production-збірці: знімки футера `/`, `/cec/`, `/svit-plus-5000/` на 1440, 768 і 390 (`.tmp/footer-after`); 27 зупинок Tab по футеру з видимим фокусом; `contact_click` для телефонів — 0 до згоди, 1 після «Прийняти всі»; з reduced motion усі блоки футера видимі.
  - Знімки «до» (`.tmp/footer-before`) не показують уміст у `Reveal` через ту саму ваду, тому попіксельне порівняння тут не має сенсу (футер переверстано повністю).
  - Розмір офісного телефону — `text-h3` → `text-h2-sm` (24 → 30 px), найближче до ≈32 px; розміру `IconButton` 56 px немає, використано `md` (48 px).
  - 404 у консолі — prefetch запланованих сторінок (/pro-nas/, /svit/, правові) — очікувано.

## 2026-11-17 — Форми й поля: спільні компоненти
- **Агент:** Claude Code
- **Гілка:** feature/forms-system (статус: змерджено в develop)
- **Що зроблено:**
  - Новий каталог `src/components/ui/form/`: `Field` і `FieldGroup` (підпис, контрол, рядок повідомлення; id, `aria-describedby`, `aria-invalid` через контекст), `TextInput` / `NumberInput` / `Textarea` / `Select` (стилі лише з `inputClasses`, іконка `AlertCircle` при помилці), `Checkbox` (20 px, радіус 6 px), `Switch` (винесено з cookie-баннера без змін), `RadioPills`, `PillRadio` (перенесено), `CheckChip`, `RangeField` (перенесено), `InputAction`, `FormCard`, `focusFirstInvalid`.
  - LeadForm: `FormCard`, `Field`, `RadioPills`, `Checkbox`, `Button loading`; прибрано `autoComplete="off"` у формі, ім'я — `name`, телефон — `tel` (автозаповнення на мобільному). Власний спінер прибрано.
  - Калькулятори: `Group`, `SelectField`, `NumberField` у `calculator-fields.tsx` тепер обгортки над `FieldGroup` / `Field` + `Select` / `NumberInput`; чіпи приладів — `CheckChip`. Віджет масштабування — `RadioPills`. Розсилка — `InputAction` з `autoComplete="email"`. Налаштування cookie — `Switch`.
  - `lint:tokens`: правило `control` (голі `<input>`, `<select>`, `<textarea>` поза `ui/form/`); виняток `radius` для `checkbox.tsx` (6 px за макетом).
- **Нотатки / що далі:**
  - Порівняння (1440 і 390): налаштування cookie — 0 px; головна — висота −4 / −2 px; калькулятор — −29 / −38 px (у полів калькулятора відступ підпис → поле 8 px замість 12 px за специфікацією).
  - `FormStatus` (`ui/form/form-status.tsx`): копія результату вгорі форми поруч із тостом — успіх на `sky` з `Check`, помилка на `ink` з `AlertCircle` і телефоном Львівського офісу з `company.ts`; без червоного. Підключено в LeadForm.
  - Виправлено під час перевірки: `focusFirstInvalid` шукав `aria-invalid` до рендеру помилок, і фокус не переходив — тепер чекає один кадр; `NumberInput` примусово ставив `inputMode="numeric"` (на iOS без коми для тарифу 4,32) — тепер `decimal` за замовчуванням.
  - Автоматична перевірка на production-збірці (14 з 14): стрілки в радіо-пігулках, пробіл на чекбоксі (радіус 6 px), порожня відправка → фокус на «Ім'я», 2 помилки з `role=alert`, `aria-describedby` → текст помилки, іконка в полі; `autoComplete` name/tel/email, без `off` на формі; Enter у розсилці; Tab і пробіл на перемикачах cookie; на 390 px усі поля 16 px (головна 5, калькулятор 10), числові поля — `decimal`.
  - Не перевірено наскрізно: показ `FormStatus` після реальної відправки (записало б справжню заявку в `storage/leads.jsonl`) і автозаповнення на фізичному телефоні.

## 2026-11-17 — Кнопки й посилання: єдині компоненти
- **Агент:** Claude Code
- **Гілка:** feature/buttons-links-system (статус: змерджено в develop)
- **Що зроблено:**
  - Нові компоненти: `PillLink` (пігулка-посилання з `meta` і стрілкою), `RowLink` (рядок списку: назва, опис, значення, декоративна кругла стрілка), `NavLink` (текстова навігація з `active` / `aria-current`), `InlineLink` (посилання в тексті: зовнішні відкриваються у новій вкладці, `mailto:` і `tel:` — звичайний `<a>`).
  - `Button`: розмір `wide` замінено на `sm` (40 px, лише для десктопних банерів) і `md` (за замовчуванням); `fullWidth` — булевий прапорець; `loading` — спінер і `disabled` з `aria-busy`.
  - `IconButton`: prop `icon` (`arrow`, `close`, `menu`, `phone`); зсув при hover лише у стрілки.
  - Замінено вручну стилізовані елементи: рядки сегментів (`SegmentLinks` → `PillLink`), ліва колонка FAQ (→ `PillLink`), бургер шапки і кнопка закриття cookie-діалогу (→ `IconButton`), кругла кнопка телефону в `LeadContactCard` і в шапці (→ `IconButton`), ряди пов'язаних продуктів (→ `RowLink`), посилання в тексті форми, баннера cookie, сторінки cookie й методології СЕС (→ `InlineLink`), телефон у FAQ (→ `InlineLink`).
  - `scripts/lint-tokens.mjs`: правило `link` падає на `<a|Link|button>` з `rounded-full` або `underline` поза `components/ui/`; задокументовані винятки друкуються при кожному запуску.
  - Винятки (з TODO): кредит-ссылка в футері (кругла іконка бренду), триґер мега-меню (кнопка з `aria-expanded`), активна секційна пігулка в шапці (потрібен `NavLink variant="pill"`), кнопка «Налаштування» в баннері cookie (дія, що виглядає як текстове посилання).
- **Файли:** src/components/ui/{pill-link,row-link,nav-link,inline-link,button,icon-button,segment-card}.tsx, src/components/consent/CookieBanner.tsx, src/components/forms/LeadForm.tsx, src/components/pages/cookie-policy-page.tsx, src/components/layout/header/{mobile-menu,header-main-bar}.tsx, src/components/product-page/related-products.tsx, src/components/sections/{LeadContactCard.tsx,home/faq-section.tsx,hero/hero-copy.tsx}, src/components/pages/ses-payback-page.tsx, scripts/lint-tokens.mjs, AGENTS.md, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:**
  - Попиксельне порівняння (1440 і 390, 5 сторінок): відмінності до 0,02% на головній, /cec/, /kalkulyator/, /rishennya/; на `/svit-plus-5000/` на 1440 висота на 26 px менша (`PillLink` 14 px замість 16 px у сегментних посиланнях на `sm+` — за специфікацією). Мобільна версія цієї сторінки — 0,2%.
  - Hero: `size="wide"` замінено на стандартний `md`, бо `fullWidth` розтягнув би кнопки; відступи трохи менші.
  - Клавіатурний прохід по `/` і `/cec/` ще не виконано. Футер, `section-nav-link`, `mega-menu-item` поки не переведені на `NavLink` (див. винятки).

## 2026-11-17 — Дизайн-токени: один набір кольорів, розмірів і радіусів
- **Агент:** Claude Code
- **Гілка:** feature/design-tokens-refactor (статус: змерджено в develop)
- **Що зроблено:**
  - Прозорість `ink`/`white` замінено на токени: `muted`, `faint`, `line`, `hover`, `muted-dark`, `faint-dark`, `line-dark`, `fill-dark`. Прибрано `--color-heading` (два місця → `ink`).
  - Типографіка: `text-lead` 18 px, `text-body` 16 px, `text-small` 14 px (було 15), `text-caption` 13 px. `text-xs/sm/base/lg` замінено на них; `Eyebrow` compact — на `text-eyebrow-sm`.
  - Радіуси: `rounded-card` 24 px (було `rounded-3xl`), `rounded-tile` 16 px (`rounded-2xl/xl/lg/md`). `rounded-sm` лишився лише для фокус-обводки посилань.
  - Шрифти: Montserrat — 300/500/600, Inter — 400/500/600 (менше файлів у завантаженні).
  - Градієнти фото винесено в `globals.css` (`scrim-capacity-x`, `scrim-capacity-y`, `scrim-segment`, `scrim-project`), hex у `layout.tsx` і `manifest.ts` замінено на `rgb(...)`.
  - `scripts/lint-tokens.mjs` (вбудований у `npm run lint`) падає на `/NN` для ink/white, `text-xs/sm/base/lg`, `rounded-md…3xl`, `font-bold/extrabold`, hex у `.ts/.tsx` і довільні значення `-[…]` (крім `grid-rows`, `transition`, `group-has`).
  - AGENTS.md: новий розділ «Дизайн-токени» (кольори, шрифти, розміри, радіуси, три тіні). CONTEXT.md: оновлено посилання на токени.
- **Файли:** src/app/globals.css, src/app/layout.tsx, src/app/manifest.ts, scripts/lint-tokens.mjs, package.json, .gitignore, AGENTS.md, docs/ai/{CONTEXT,CHANGELOG}.md, ~80 файлів у src/components, src/app, src/content (автозаміна).
- **Нотатки / що далі:**
  - Лічильники в `src/` до → після: `ink/NN` і `white/NN` — 373 → 1 (лишився `FooterMark` за списком винятків); `text-xs/sm/base/lg/heading` — 212 → 0; `rounded-md…3xl` — 73 → 0; hex у `.ts/.tsx` — 3 → 0; `font-bold/extrabold` — 0 → 0; тіней — 3 токени (`soft`, `card`, `glass`), інших немає.
  - Значення нових токенів (з таблиці не було): `muted` ink 70%, `faint` ink 40%, `hover` ink 6%, `muted-dark` white 75%, `faint-dark` white 45%, `line-dark` white 16%, `fill-dark` white 8%. `line` лишився ink 12%, як був.
  - Відступи від таблиці: `hover:bg-ink/90` → `hover:bg-navy` (hover темних кнопок); `hover:bg-white/90` → `hover:bg-surface` (hover білих кнопок); тег на фото `bg-ink/60` → `bg-ink`; фон модального затемнення `bg-ink/35` → `bg-faint`; `bg-white/30` (шкала ємності) → `bg-faint-dark`; `hover:border-white/60|40|45` → `hover:border-white`.
  - Видимі зміни через розміри й ваги: висота всіх сторінок змінилась на кілька десятків–сотень px (`text-xs` 12→13 px у верхній смузі й дрібних мітках; `text-small` 15→14 px; `line-height` 1.6→1.5 для `small`). Це значення з токенів власника, я їх не коригував.
  - `font-mono` (системний моноширинний) лишився поза токенами: він не входить у набір шрифтів; вирішити окремо, якщо потрібен токен.
  - `Montserrat` без ваги 400: текст з `font-heading` без явної ваги рендериться як 500 (найближча доступна).
  - Скриншоти до/після в `.tmp/ds-before` і `.tmp/ds-after` (папка в .gitignore). Попіксельне порівняння можливе лише там, де висота не змінилась; на всіх 19 знімках висота змінилась, тому перевірка візуальна (головна, SVIT 600, картки, теги, шапка).

## 2026-11-13 — Англійська сторінка 404
- **Агент:** Claude Code
- **Гілка:** fix/english-404 (статус: змерджено в develop)
- **Що зроблено:**
  - Сторінка 404 вже була (`src/app/not-found.tsx`: статус 404, noindex, кнопки на головну й до заявки, швидкі посилання), але для `/en/…` показувалась українською.
  - `src/proxy.ts` тепер переписує `/en/…` адреси без англійської версії (`hasEnglish`) на нову статичну `/en/ne-znaideno/` зі статусом 404: англійські title, H1, текст, шапка й футер з посиланнями `/en/`. Адреса в рядку браузера лишається введеною.
  - `routes.notFoundEn`, `Disallow: /en/ne-znaideno/` у robots.txt. Пряме відкриття `/en/ne-znaideno/` теж віддає 404.
- **Файли:** src/proxy.ts, src/app/en/ne-znaideno/page.tsx, src/content/routes.ts, src/app/robots.ts, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:**
  - Перевірено на production-збірці: `/en/a/b/c/`, `/en/svit-xyz/`, `/en/rishennya/xyz/` → 404 «Page not found»; `/en/pro-nas/` → 404 «Page in progress»; українські 404 без змін; усі 10 англійських сторінок → 200 з `index, follow`; помилок у консолі браузера немає. Новий маршрут статичний (○).
  - Спроба з вкладеним `en/not-found.tsx` + catch-all `[...missing]` працювала лише в dev: на production Next віддає кореневий 404.
  - У dev-режимі на вкладеному not-found React попереджав про `<script>` згоди в `<head>`; у production цієї проблеми немає, а з proxy-підходом вкладений not-found не використовується.

## 2026-11-13 — Світліший фон іконки авторства
- **Агент:** Claude Code
- **Гілка:** fix/footer-credit-icon-bg (статус: змерджено в develop)
- **Що зроблено:** кружок з іконкою `CodeXml` у кредиті футера отримав постійну заливку `white/8`, при hover — `white/14`.
- **Файли:** src/components/layout/footer/footer.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** lint проходить; перевірено знімком 1440 px.

## 2026-11-13 — Акуратний блок авторства у футері
- **Агент:** Claude Code
- **Гілка:** fix/footer-credit-polish (статус: змерджено в develop)
- **Що зроблено:** кредит «Розроблено / Nazar Yaremiiy» — одне посилання на https://nyaremiiy.com: іконка lucide `CodeXml` у круглій рамці 36 px (стиль кнопок соцмереж футера: рамка `white/22` → `white/60`, фон `white/8` при hover), праворуч підпис `text-caption white/75` і ім'я `font-medium` зі стрілкою `ArrowUpRight`, що зсувається при hover (`motion-safe`). Ряд правових посилань вирівняно по центру (`items-center`). `ArrowLink` у футері більше не використовується.
- **Файли:** src/components/layout/footer/footer.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** lint і типи проходять; перевірено знімками 1440 і 360 px.

## 2026-11-13 — Стиль авторства у футері
- **Агент:** Claude Code
- **Гілка:** fix/footer-credit-style (статус: змерджено в develop)
- **Що зроблено:** блок «Розроблено / Nazar Yaremiiy ↗» перенесено в ряд правових посилань футера, одразу після «Налаштувати cookie». Підпис «Розроблено» (uk) / «Developed by» (en) — звичайний текст у нижньому регістрі, без верхнього регістру; ім'я — `ArrowLink` (`tone="dark"`) з посиланням на https://nyaremiiy.com у новій вкладці.
- **Файли:** src/components/layout/footer/footer.tsx, messages/{uk,en}.json, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** lint і типи проходять; знімок футера на 1440 px перевірено на dev-сервері (порт 3000). `ArrowLink` має підкреслення й жирний шрифт — на знімку користувача їх немає; за потреби пригасимо спільний компонент.

## 2026-11-13 — Авторство в футері
- **Агент:** Claude Code
- **Гілка:** feature/footer-developer-credit (статус: змерджено в develop)
- **Що зроблено:** у нижню смугу футера під копірайтом додано рядок «Розробка сайту: Nazar Yaremiiy» (uk) / «Website by: Nazar Yaremiiy» (en) з посиланням на https://nyaremiiy.com (`target="_blank"`, `rel="noopener noreferrer"`, стиль `footerLinkClasses`). Ключ `footer.developedBy` додано в обидві мови.
- **Файли:** src/components/layout/footer/footer.tsx, messages/{uk,en}.json, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** lint, типи й build проходять. Рядок показується на всіх сторінках з футером (uk і en).

## 2026-11-13 — Нова ліва колонка секції заявки
- **Агент:** Claude Code
- **Гілка:** feature/lead-section-left-column (статус: змерджено в develop)
- **Що зроблено:**
  - Ліву колонку спільної `LeadSection` переверстано за макетом (варіант A): шапка без змін → таймлайн із трьох кроків `LeadSteps` (кружки 48 px з іконками Phone / Calculator / FileText, перший — ink, лінія `line` між центрами) → темна картка `LeadContactCard` (телефон великим кеглем + біле коло 52 px, під лінією `white/14` — email і адреса Львівського офісу з посиланням на карту). Відступ між блоками 40 px. Стару нумеровану таблицю кроків і рядок телефон/email прибрано. Форму праворуч не змінено.
  - Таймлайн вертикальний нижче `lg`, рядок із трьох — з `lg` (на 768–1023 px ліва колонка ~290 px, три колонки там не вміщаються). Розмір номера телефону — container queries за шириною картки: 20 px на 360 px → 48 px на 1440 px, завжди в один рядок.
  - Аналітика: `ContactLink` (`components/ui/contact-link.tsx`, клієнтський) шле `contact_click` `{ method: phone|email, location: lead_section }` через `trackEvent` (лише з аналітичною згодою).
  - Тексти: `leadSection.steps` (EN оновлено за брифом) і новий `leadSection.contactCard` в uk/en. Контакти — з `offices[0]` і `companyContacts` у `company.ts`.
- **Файли:** src/components/sections/{LeadSection,LeadSteps,LeadContactCard}.tsx, src/components/ui/contact-link.tsx, src/content/company.ts, messages/{uk,en}.json, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:**
  - lint і build проходять. Перевірено в headless Edge: 1440 (uk, en), 820, 360 (en) — без горизонтального скролу. Форму тестово не надсилали (код форми не змінювався).
  - Відхилення від брифу: тексти лежать у наявному `leadSection.*`, а не `lead.*`; адреса — наявне поле `offices[].address` (нового `address` не додано); компонента `Card` у проєкті немає — картка `rounded-3xl bg-ink p-card-sm lg:p-card`; «ink-muted» → `white/75`.
  - TODO(content): офіційне англійське написання адреси (`317b Shevchenka St., Lviv`).
  - На сторінках продуктів `summary` і далі замінює кроки; контактна картка показується скрізь.

## 2026-11-12 — Вищий мобільний hero сторінки готелю
- **Агент:** Codex
- **Гілка:** fix/hotel-mobile-hero-height (статус: змерджено в develop)
- **Що зроблено:** у спільний `PageHero` додано модульний режим `spaciousMobile`; на нішевій сторінці готелю мобільний контент hero тепер перебуває в потоці з більшими вертикальними відступами, тому довгі крихти, опис і дві кнопки збільшують секцію замість стискання в один viewport. З `md` layout не змінено.
- **Файли:** `src/components/sections/PageHero.tsx`, `src/components/pages/niche-page.tsx`, `docs/ai/{CONTEXT,CHANGELOG}.md`
- **Нотатки / що далі:** використано стандартні Tailwind utility-класи без довільних значень і нових CSS-токенів.

## 2026-11-12 — CTA хедера веде до форми поточної сторінки
- **Агент:** Codex
- **Гілка:** fix/header-lead-cta (статус: змерджено в develop)
- **Що зроблено:** кнопку «Залишити заявку» у desktop-хедері відв’язано від калькулятора. Якщо на поточній сторінці є `#contacts`, CTA прокручує саме до локальної форми й оновлює hash; на сторінках без форми резервно веде до форми головної у поточній мові.
- **Файли:** `src/components/layout/header/{header-lead-cta,header-main-bar}.tsx`, `docs/ai/{CONTEXT,CHANGELOG}.md`
- **Нотатки / що далі:** логіку винесено в окремий клієнтський компонент; тексти CTA лишилися зі спільних `messages/uk.json` і `messages/en.json`.

## 2026-11-11 — Спрощена команда релізу
- **Агент:** Codex
- **Гілка:** chore/simplify-release-command (статус: змерджено в develop)
- **Що зроблено:** з `npm run deploy` прибрано запуск `npm run lint` і `npm run build`; команда тепер лише оновлює гілки, мерджить `develop` у `main`, пушить `origin/main` і повертається на `develop`.
- **Файли:** `scripts/release.mjs`, `README.md`, `docs/ai/{CONTEXT,CHANGELOG}.md`
- **Нотатки / що далі:** production-збірка й перезапуск сервісу залишаються відповідальністю серверного `deploy.sh`.

## 2026-11-11 — Команда релізу develop у main
- **Агент:** Codex
- **Гілка:** chore/release-command (статус: змерджено в develop)
- **Що зроблено:** додано `npm run deploy` для власника: команда перевіряє чистоту tracked-файлів, оновлює `develop`, запускає lint/build, оновлює `main`, мерджить `develop` через `--no-ff`, пушить `origin/main` і повертається на `develop`. При конфлікті merge не приховує стан і зупиняється для ручного вирішення.
- **Файли:** `scripts/release.mjs`, `package.json`, `README.md`, `docs/ai/{CONTEXT,CHANGELOG}.md`
- **Нотатки / що далі:** команда лише додана й перевірена статично; агент її не запускав, тому `main` не змінено.

## 2026-11-11 — Більші мобільні відступи на всіх сторінках
- **Агент:** Codex
- **Гілка:** fix/mobile-section-gutters (статус: змерджено в develop)
- **Що зроблено:** глобальний мобільний відступ контенту від краю екрана збільшено з 18 до 24 px через спільний `Container`; для секцій усередині панелей враховано зовнішні 8 px панелі. Узгоджено мобільне меню, екран технічних робіт і внутрішній padding форми заявки. Відступи `sm`/`lg` не змінено.
- **Файли:** `src/components/layout/container.tsx`, `src/components/layout/header/mobile-menu.tsx`, `src/components/pages/maintenance-page.tsx`, `src/components/forms/LeadForm.tsx`, `docs/ai/{CONTEXT,CHANGELOG}.md`
- **Нотатки / що далі:** зміна охоплює всі 59 використань `Container` на українських і англійських сторінках.

## 2026-11-11 — Видима межа випадаючого меню
- **Агент:** Codex
- **Гілка:** fix/mega-menu-separator (статус: змерджено в develop)
- **Що зроблено:** для десктопного мега-меню додано світлу нижню hairline-межу з наявного `white/15`, щоб панель не зливалася з темно-синіми секціями сторінок; верхня межа приведена до тієї самої прозорості.
- **Файли:** `src/components/layout/header/mega-menu-panel.tsx`, `docs/ai/CHANGELOG.md`
- **Нотатки / що далі:** нових кольорів, тіней або CSS-токенів не додано.

## 2026-11-11 — Одне прев’ю для соцмереж на весь сайт
- **Агент:** Claude Code
- **Гілка:** chore/single-og-image (статус: змерджено в develop)
- **Що зроблено:**
  - Прев’ю для соцмереж — один файл власника `public/og-image.png` (1200×630). Власник поклав його в `public/images/og/`, перенесено в корінь `public/`, щоб адреса була `/og-image.png`.
  - `buildMetadata` завжди віддає `og:image` і `twitter:image` = `https://init.energy/og-image.png`, `twitter:card` = `summary_large_image`, alt залежить від мови. og:title і og:description лишились свої в кожної сторінки.
  - Прибрано параметр `image` у `buildMetadata`, поля `ogImage` у `products.ts` / `product-pages.ts`, окремі прев’ю в головної, `/cec/`, калькулятора, сторінки готелю й політики cookie, а також 10 JPEG у `public/images/og/` (більше не використовуються).
- **Файли:** public/og-image.png, public/images/og/*.jpg (видалено), src/lib/seo/metadata.ts, src/app/{(uk),en}/{page,cec/page}.tsx, src/components/pages/{product-page,niche-page,ses-payback-page,cookie-policy-page}.tsx, src/content/{products,product-pages}.ts, README.md, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:**
  - lint і build проходять. Перевірено `curl` на /, /ses/ (308 → /cec/), /en/, /cec/, /svit-home/, сторінці готелю, /en/kalkulyator/okupnist-ses/ і /polityka-cookie/: усюди `og:image` = `https://init.energy/og-image.png`; сам файл віддається з кодом 200 (`image/png`).
  - `metadataBase` = `https://init.energy` уже був у кореневій розкладці. Файлів `opengraph-image.tsx` у проєкті не було.
  - Розділу §7 у `CLAUDE.md` немає, правило записано в `docs/ai/CONTEXT.md`.

## 2026-11-11 — Підсвічування пунктів мега-меню і бургер на lg
- **Агент:** Claude Code
- **Гілка:** fix/mega-menu-hover (статус: змерджено в develop)
- **Що зроблено:**
  - Пункти випадаючого меню («Каталог», «Рішення») стали плитками: при наведенні й фокусі з клавіатури з’являється фон `white/8`, назва й опис світлішають, праворуч стрілка. У мобільному меню ті самі пункти підсвічуються під час натискання (`active:bg-white/8`).
  - Між 1024 і 1280 px пункти розділів сторінки в шапці сховані (не вміщаються), тому там тепер лишається бургер після кнопки «Залишити заявку». Лише на сторінках, де є пункти розділів: головна, /cec/, калькулятор, готель, продукти. Відкрите меню на десктопі починається під логотипом (`lg:pt-40`), бічні відступи як у контейнера.
- **Файли:** src/components/layout/header/{mega-menu-panel,mobile-menu}.tsx, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** перевірено на dev-сервері: наведення на 1440 px, бургер і відкрите меню на 1100 px.

## 2026-11-11 — Банер згоди на cookie, теги лише після згоди, політика cookie
- **Агент:** Claude Code
- **Гілка:** feature/cookie-consent (статус: змерджено в develop)
- **Що зроблено:**
  - Банер згоди за макетом власника. Десктоп: скляна плаваюча картка внизу; телефон: картка на всю ширину з безпечною зоною знизу. Налаштування: на десктопі вікно над затемненням, на телефоні нижня шторка. Три категорії з перемикачами `role="switch"`: «Необхідні» (завжди активні), «Аналітичні», «Маркетингові». «Відхилити» і «Прийняти всі» однакові, хрестика на банері немає. Банер з’являється через ~0,8 с після гідратації (не LCP, без CLS) і не перехоплює фокус. Вікно утримує фокус, Esc або клік по фону закривають його, фокус повертається.
  - `lib/consent/`: cookie `init_consent` (версія, 12 міс., резервна копія в localStorage), `ConsentProvider`, Consent Mode v2: за замовчуванням denied (інлайн-скрипт у `<head>`), потім update. Події `consent_default` / `consent_update`, `consent:change`. При відкликанні видаляються `_ga*`, `_gid`, `_gcl_*`, `_fbp`, `_ttp`.
  - `ConsentScripts`: GTM, GA4, Google Ads, Meta Pixel, TikTok Pixel — лише для дозволених категорій і лише якщо задано `NEXT_PUBLIC_*` ID. Досі тегів у коді не було.
  - UTM і click ID для заявки тепер не губляться між сторінками: sessionStorage, а cookie лише з маркетинговою згодою (`lib/consent/tracking.ts`).
  - Нова сторінка «Політика cookie» `/polityka-cookie/` і `/en/polityka-cookie/` (таблиця cookie з `content/cookies.ts`, як змінити згоду, контакт). Додано в sitemap і hreflang, прибрано з «в розробці». Посилання «Налаштування cookie» у футері.
  - Токени `--shadow-glass` і утиліта `bg-glass` (лише для плаваючих скляних елементів), утиліта `pb-safe`.
- **Файли:** src/lib/consent/{consent.ts,tracking.ts,ConsentProvider.tsx}, src/components/consent/{CookieBanner,ConsentScripts,CookieSettingsLink}.tsx, src/components/pages/cookie-policy-page.tsx, src/app/{(uk),en}/polityka-cookie/page.tsx, src/app/layout.tsx, src/app/globals.css, src/app/sitemap.ts, src/components/layout/{site-chrome.tsx,footer/footer.tsx}, src/components/forms/LeadForm.tsx, src/lib/analytics.ts, src/content/{cookies,routes}.ts, src/i18n/config.ts, messages/{uk,en}.json, README.md, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:**
  - Перевірено на продакшн-збірці з тестовими ID усіх п’яти тегів (через DevTools Protocol). До вибору й після «Відхилити» немає жодного запиту до googletagmanager / google-analytics / facebook.net / tiktok, Consent Mode = denied. Після «Прийняти всі» теги завантажились, Consent Mode = granted, подія `consent_update:accept_all`. Посилання у футері відкриває збережений стан; фокус утримується (12×Tab), Esc закриває й повертає фокус. Знімки 1440 / 820 / 360 px, горизонтального скролу немає.
  - Відхилення від брифу:
    - EN-адреса політики — `/en/polityka-cookie/`, бо всі EN-сторінки повторюють український slug;
    - вікно налаштувань 704 px замість 640, бо інакше кнопки не вміщаються в рядок;
    - розкладка «в один рядок» з `lg`, на планшеті кнопки під текстом;
    - шрифт Montserrat замість Onest, бо Onest на сайті немає.
  - TODO(content): юридична перевірка тексту політики (зокрема про UTM/click ID). Сторінки «Політика конфіденційності» досі немає, а форма заявки на неї посилається. Lighthouse не запускався: банер `fixed` і з’являється після гідратації, тому CLS і LCP не змінюються за конструкцією.

## 2026-11-11 — Лічильник відвідувачів зі щоденним звітом о 03:00
- **Агент:** Claude Code
- **Гілка:** feature/visit-counter (статус: змерджено в develop)
- **Що зроблено:**
  - Власний лічильник без cookie і сторонніх сервісів. `VisitBeacon` у `SiteChrome` після кожної сторінки (і при клієнтських переходах) шле шлях і зовнішнє джерело першої сторінки на `POST /api/visit/`. Сервер записує подію з хешем IP+браузера на денній солі; IP не зберігається. Боти, DNT/GPC і режим розробки не рахуються.
  - `instrumentation.ts` запускає планувальник: щодня о 03:00 за Києвом, а також одразу після старту сервера, пишуться звіти за завершені дні: `storage/visits/reports/YYYY-MM-DD.json` (відвідувачі, перегляди, сторінки, джерела) і рядок у `reports.jsonl`. Сирі події й сіль після цього видаляються.
  - `allowImportingTsExtensions` у tsconfig, щоб тести (`node --test`) завантажували модулі з імпортами. `storage/visits/` у `.gitignore`.
- **Файли:** src/lib/visits/{visits-core,visits-store,visits-scheduler}.ts, src/lib/visits/visits.test.mjs, src/app/api/visit/route.ts, src/instrumentation.ts, src/components/layout/{visit-beacon,site-chrome}.tsx, tsconfig.json, .gitignore, README.md, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:**
  - lint, test (24, з них 4 нові) і build проходять. Перевірено на продакшн-збірці: візити пишуться (бот і сміттєвий запит відкинуто, IP у файлі немає); після перезапуску звіт за «вчора» з’явився одразу; маячок у браузері записав першу сторінку й клієнтський перехід.
  - Далі: Telegram-бот читатиме `reports.jsonl` або `reports/*.json`.
  - Якщо сайт за nginx, він має передавати `X-Forwarded-For` або `X-Real-IP`, інакше всі відвідувачі матимуть один IP.

## 2026-11-11 — Підготовка до деплою: аудит, SEO/GEO, README, прибирання
- **Агент:** Claude Code
- **Гілка:** chore/pre-deploy (статус: змерджено в develop)
- **Що зроблено:**
  - Виправлено `matcher` у `src/proxy.ts`: після додавання режиму обслуговування `"\."` у звичайному рядку став `"."`, і проксі ловив картинки й favicon. У режимі технічних робіт вони отримали б HTML-сторінку замість файлу. Відновлено подвійне екранування.
  - Прев’ю для соцмереж (JPEG 1200×630) тепер є в усіх сторінок з sitemap. Нові: головна, `/cec/`, SVIT 600, LITHIUMVALLEY (uk і en).
  - Додано `/llms.txt` (GEO, з контенту), `/manifest.webmanifest`, підтвердження Search Console / Bing через змінні середовища, `Disallow` службових екранів у robots.txt, базові заголовки безпеки.
  - `README.md` замість шаблонного: команди, змінні середовища, деплой (`deploy.sh`, `maintenance.sh`), SEO/GEO, структура. У `package.json` — `engines.node >= 22.18`.
  - Видалено застарілий `design-qa.md` (звіт перевірки однієї секції з посиланнями на файли поза проєктом).
- **Файли:** src/proxy.ts, src/app/{layout.tsx,robots.ts,manifest.ts,llms.txt/route.ts,(uk)/page.tsx,en/page.tsx,(uk)/cec/page.tsx,en/cec/page.tsx}, src/content/products.ts, public/images/og/{home,cec,svit-600,bess}.jpg, next.config.ts, package.json, README.md, design-qa.md (видалено), docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:**
  - Перевірка: lint, test (20), build. Аудит усіх 18 URL із sitemap без зауважень (статус 200, title ≤ 65, description 129–160, canonical, hreflang, прев’ю, один H1, alt у картинок, JSON-LD). Обхід посилань: битих немає, 404 лише в 12 запланованих сторінок (екран «в розробці»). На 360 px у жодній сторінці немає горизонтального скролу. Усі сторінки статичні, динамічна лише `/maintenance/`.
  - Перед запуском: сторінка «Політика конфіденційності» — форма збирає персональні дані з посиланням на неї. Також `icon.png` 512 і `apple-icon.png` 180, GA4/GTM — лише разом із банером згоди на cookie.
  - Локальні непотрібні папки поза Git (`output/` зі знімками Playwright, порожня `.worktrees/`, `tsconfig.tsbuildinfo`) не видалено: потрібен дозвіл власника.

## 2026-11-11 — Серверний перемикач технічних робіт
- **Агент:** Codex
- **Гілка:** chore/maintenance-toggle (статус: змерджено в develop)
- **Що зроблено:** додано `maintenance.sh`: один запуск у корені репозиторію на сервері перемикає режим технічних робіт, збирає production-бандл і перезапускає systemd-юнит `init.energy`; наступний запуск повертає сайт у звичайний режим.
- **Файли:** `maintenance.sh`, `src/config/site-status.ts`, `docs/ai/{CONTEXT,CHANGELOG}.md`
- **Нотатки / що далі:** скрипт використовує `sudo systemctl`, як і `deploy.sh`; за потреби назву юніта можна передати через `SERVICE_NAME`.

## 2026-11-11 — Режим технічних робіт
- **Агент:** Codex
- **Гілка:** feature/maintenance-mode (статус: змерджено в develop)
- **Що зроблено:** додано глобальний перемикач доступності сайту й окремий локалізований екран технічних робіт з ілюстрацією. Увімкнений режим переписує всі публічні сторінки на екран робіт, віддає HTTP 503 і `Retry-After: 3600`, тому пошукові системи не вважають сторінки зниклими.
- **Файли:** `src/config/site-status.ts`, `src/proxy.ts`, `src/app/maintenance/page.tsx`, `src/components/pages/maintenance-page.tsx`, `messages/{uk,en}.json`, `src/content/routes.ts`, `docs/ai/{CONTEXT,CHANGELOG}.md`
- **Нотатки / що далі:** на сервері режим перемикає `./maintenance.sh`; ручна зміна `maintenance.enabled` не потрібна.

## 2026-11-11 — Скрипт production-деплою
- **Агент:** Codex
- **Гілка:** chore/deploy-script (статус: змерджено в develop)
- **Що зроблено:** додано виконуваний `deploy.sh`: перевіряє інструменти й чистоту робочого дерева, оновлює `main` через fast-forward, встановлює залежності, збирає Next.js і перезапускає systemd-юнит `init.energy`.
- **Файли:** `deploy.sh`, `docs/ai/{CONTEXT,CHANGELOG}.md`
- **Нотатки / що далі:** на сервері потрібні git, Node.js/npm, systemd і право `sudo` на `systemctl`.

## 2026-11-11 — Favicon сайту
- **Агент:** Claude Code
- **Гілка:** chore/favicon (статус: змерджено в develop)
- **Що зроблено:** стандартну іконку Next.js у `src/app/favicon.ico` замінено іконкою власника (літера «Е» з логотипу). Власник додав `favicon_32x32.jpg`, але Next підхоплює лише `favicon.ico` / `icon.*` / `apple-icon.*`, тому файл перетворено на ICO (32×32, PNG усередині, RGBA — RGB Next не декодує й падає з 500), а `.jpg` видалено.
- **Файли:** src/app/favicon.ico, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** TODO(content): для Google у пошуку (≥ 48×48) і для iPhone потрібні більші файли — `src/app/icon.svg` або `icon.png` 512×512 і `src/app/apple-icon.png` 180×180.

## 2026-11-11 — Фото в блоці «Обладнання й етапи» на сторінці готелю
- **Агент:** Claude Code
- **Гілка:** feature/hotel-build-photo (статус: змерджено в develop)
- **Що зроблено:** у блоці «Що входить у СЕС і як ми її будуємо» замість заглушки — фото власника `public/images/cec/rishennya/hotel/hotel.avif` (2674×2730, через next/image, alt uk/en). Джерело майже квадратне: на `md+` воно кадрується в 3:4 з фокусом праворуч (там сонячні панелі), на телефоні — 4:3. На телефоні фото тепер видно (заглушка там була прихована). Нове поле `build.image` у `solutionPages`; без нього лишається заглушка.
- **Файли:** src/content/solutions.ts, src/components/sections/niche/niche-build.tsx, public/images/cec/rishennya/hotel/hotel.avif, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** перевірено на 1440 і 390 px. Заглушок фото на сторінці готелю більше немає.

## 2026-11-11 — Шапка без переносів, меню калькулятора й продуктів, плавна поява сторінок
- **Агент:** Claude Code
- **Гілка:** fix/header-no-wrap (статус: змерджено в develop)
- **Що зроблено:**
  - Пункти шапки переносились у 2–3 рядки (близько 1024–1400 px). Тепер усі пункти, «Каталог», «Рішення» й кнопка мають `whitespace-nowrap`. Пункти розділів сторінки видно з `xl` (1280 px); нижче вони є в бургер-меню й колонці футера. Перевірено скриптом на 10 сторінках (uk/en) і ширинах 1024, 1152, 1280, 1366, 1440, 1536 px: переносів і накладань немає.
  - На калькуляторі в шапці — «Калькулятор», «Виробіток по місяцях», «Як ми рахуємо», «Питання й відповіді».
  - На сторінках продуктів у шапці — «Сонячні електростанції» (/cec/) і «Калькулятор окупності СЕС».
  - Під активним пунктом на мить спалахувала чорна лінія (колір підкреслення плавно переходив з темного тексту пігулки в прозорий). Підкреслення тепер завжди прозоре, крім наведення.
  - Перехід між сторінками: вміст плавно проявляється (`animate-enter`, 300 мс). Шапка й футер не блимають. На першому завантаженні й при reduced motion анімації немає.
- **Файли:** src/components/layout/header/{header-data.ts,desktop-nav.tsx,mobile-menu.tsx,header-section-links.tsx,section-nav-link.tsx,mega-menu-item.tsx,header-main-bar.tsx}, src/components/layout/page-transition.tsx (нове), src/app/{(uk),en}/template.tsx (нові), docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** lint і build проходять, сторінки статичні.

## 2026-11-11 — Фото hero і меню в шапці на сторінці готелю
- **Агент:** Claude Code
- **Гілка:** feature/hotel-hero-photo (статус: змерджено в develop)
- **Що зроблено:**
  - У hero `/rishennya/ses-dlya-gotelyu/` замість заглушки — фото власника (`public/images/cec/rishennya/hotel/01-{750,1280,1920,2560}.avif`, alt uk/en). Розмітку фото hero винесено в спільний `HeroPicture`; його використовують і слайдер головної, і нова медіа `picture` у `PageHero` (`fetchPriority=high` для LCP).
  - Прев’ю для соцмереж uk/en перероблено на це фото.
  - У шапці сторінки готелю (десктоп і мобільне меню) з’явились пункти розділів: «СЕС у цифрах», «Яка СЕС потрібна», «Робота під час відключень», «Питання й відповіді». Механізм узагальнено: `headerSectionKeys` у `header-data.ts` (шлях → розділи), `/cec/` працює як раніше.
- **Файли:** src/components/sections/hero/hero-picture.tsx (нове), src/components/sections/{PageHero.tsx,home/hero-media-slider.tsx,home/hero-slides.ts}, src/components/pages/niche-page.tsx, src/components/layout/header/{header-data.ts,desktop-nav.tsx,mobile-menu.tsx}, src/content/solutions.ts, public/images/cec/rishennya/hotel/*, public/images/og/ses-dlya-gotelyu{,-en}.jpg, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** перевірено на dev-сервері (1440 і 390 px), головна без змін. Фото в блоці «Що входить у СЕС» — досі заглушка (TODO(content)).

## 2026-11-11 — Проєкти на сторінці готелю без порожнього місця
- **Агент:** Claude Code
- **Гілка:** fix/niche-projects-fill (статус: змерджено в develop)
- **Що зроблено:** на `/rishennya/ses-dlya-gotelyu/` блок проєктів показував лише 2 бізнесові проєкти, тож третє місце в сітці (1 велика + 2 малі картки) стояло порожнім. `segment` у `ProjectsShowcase` тепер ставить проєкти сегмента першими, а решту місць до трьох заповнює іншими видимими проєктами.
- **Файли:** src/components/sections/projects-showcase.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** перевірено на dev-сервері, на сторінці 3 картки. Кейс готелю — досі TODO(content).

## 2026-11-11 — Сторінка готелю на старій адресі /rishennya/ses-dlya-gotelyu/
- **Агент:** Claude Code
- **Гілка:** fix/hotel-page-url (статус: змерджено в develop)
- **Що зроблено:** за рішенням власника сторінка «СЕС для готелю» лишається на адресі з init.energy: `/rishennya/ses-dlya-gotelyu/` і `/en/rishennya/ses-dlya-gotelyu/`. Маршрут `ses/[segment]` перейменовано на `rishennya/[segment]`, slug — `ses-dlya-gotelyu`, ключ `routes.sesNiche` → `routes.solutions`. Редирект на `/ses/dlya-gotelyu/` прибрано (адреса не виходила в production). Canonical, hreflang, sitemap, крихти, посилання з `/cec/`, меню й BESS ведуть на нову адресу.
- **Файли:** src/app/{(uk),en}/rishennya/[segment]/page.tsx (перенесено з ses/[segment]), src/components/pages/niche-page.tsx, src/components/sections/ses/ses-segments.tsx, src/content/{routes,solutions,navigation,services,product-pages}.ts, src/i18n/config.ts, src/app/sitemap.ts, next.config.ts, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** lint і build проходять, сторінка статична. Перевірено на сервері: 200 для обох мов, canonical і sitemap з новою адресою.

## 2026-11-11 — Сторінка «СЕС для готелю» і спільний PageHero
- **Агент:** Claude Code
- **Гілка:** feature/ses-hotel-page (статус: змерджено в develop)
- **Що зроблено:**
  - Спільний `PageHero` (стиль головної) з варіантами `slides` і одна сторінка (media `image` / `video` / `placeholder`, крихти + BreadcrumbList). Головна й `/cec/` переведені на нього без зміни вигляду. `Hero` видалено. Текст hero — спільний `HeroCopy`, паралакс — `HeroParallax`.
  - Нова сторінка `/ses/dlya-gotelyu/` і `/en/ses/dlya-gotelyu/` за макетом власника, маршрут `ses/[segment]`, дані в `solutionPages` (`content/solutions.ts`, parent `dlya-biznesu`). Секції:
    - hero із заглушкою фото;
    - «СЕС для готелю в цифрах» (пряма відповідь, 7 параметрів, 4 картки, дата оновлення);
    - «Куди йде енергія в готелі» (6 карток з іконками);
    - «Яка СЕС потрібна вашому готелю» (`<table>` зі скролом на мобільному і фактори ефективності);
    - «Готель працює й під час відключень» (пріоритети, 3 режими, гібридний виділено, SVIT PLUS 16000 і LITHIUMVALLEY);
    - «Що входить у СЕС і як ми її будуємо» (компоненти, заглушка фото 3:4, 4 етапи);
    - проєкти бізнес-сегмента, FAQ (7 питань), заявка з типом «Готель».
  - Стара адреса `/rishennya/ses-dlya-gotelyu/` → 308 на нову; посилання в меню, на сторінці BESS і в `services.ts` оновлено.
  - З `/cec/` у картці «Бізнес» з’явилось посилання «СЕС для готелю».
  - SEO: title 45 символів, description 141, canonical, hreflang uk/en/x-default; JSON-LD Service (`serviceType`, `areaServed` з `company.serviceArea`), FAQPage, BreadcrumbList; JPEG-прев’ю uk/en; sitemap.
  - `MediaPlaceholder`: пунктирна рамка, `fill`, `aspect`, `align`, `captionClassName`; світлий тон тепер surface.
  - `ProjectsShowcase` отримав фільтр `segment`, `FaqSection` — `links`, `serviceSchema` — `serviceType`.
  - Калькулятор читає `?type=` для вибору сегмента.
- **Файли:** src/components/sections/{PageHero.tsx,hero/*,niche/*,projects-showcase.tsx,home/{hero-content-slider,hero-media-slider,faq-section}.tsx,ses/ses-segments.tsx}, src/components/sections/home/hero.tsx (видалено), src/components/pages/{niche-page,home-page,ses-page}.tsx, src/app/{(uk),en}/ses/[segment]/page.tsx, src/components/ui/media-placeholder.tsx, src/components/forms/LeadForm.tsx, src/components/calculator/ses-payback-state.tsx, src/content/{solutions,faq,routes,navigation,services,product-pages}.ts, src/lib/seo/schema.ts, src/i18n/config.ts, src/app/sitemap.ts, next.config.ts, messages/{uk,en}.json, public/images/og/ses-dlya-gotelyu{,-en}.jpg, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:**
  - lint, test (20) і build проходять; усі сторінки статичні. Перевірено в headless Edge на 1440 і 360 px: горизонтального скролу сторінки немає, таблиця прокручується у своєму блоці. Головна виглядає як раніше.
  - TODO(content):
    - площа даху на 100 кВт: 450–550 чи 500–550 м²;
    - окупність 3–5 років;
    - фото даху готелю (hero, блок обладнання);
    - кейс готелю і сегмент «hotel» у проєктах;
    - стаття «Мережева чи гібридна СЕС» і статті для бізнесу/готелів (посилання в FAQ);
    - сторінка `/cec/dlya-biznesu/` і зворотне посилання з неї на нішу.
  - Адреса `/ses/dlya-gotelyu/` — як у завданні, хоча хаб СЕС на `/cec/`. Змінюється одним slug у `routes.ts`.
  - `docs/SEO-GEO.md` і розділів §2/§9 у CLAUDE.md немає; правила додано в CONTEXT.md.

## 2026-11-11 — Сторінка калькулятора окупності СЕС за макетом
- **Агент:** Claude Code
- **Гілка:** feature/ses-payback-polish (статус: змерджено в develop)
- **Що зроблено:**
  - Сторінку `/kalkulyator/okupnist-ses/` (uk, en) переверстано за макетом власника:
    - hero з крихтами, H1, вкладками «Сонячна станція й окупність» / «Автономність під час відключень» і 4 плитками фактів;
    - калькулятор заходить у низ hero;
    - секції «Скільки енергії дасть станція по місяцях» (графік, надлишок і дефіцит), «Як ми рахуємо» (темна панель із формулами, джерелами й прикладом розрахунку) і нова «Типові СЕС за потужністю»;
    - FAQ і стандартна `LeadSection`.
  - Параметри в URL (`?object=…&kwh=…&loads=…`) прибрано:
    - вони дублювали значення за замовчуванням;
    - кожна зміна повзунка робила запит до сервера;
    - сторінка була динамічною і мала безліч варіантів адреси.
    Тепер сторінка статична, стан калькулятора живе в клієнтському контексті.
  - Стиль сайту:
    - поля винесено в спільні `RangeField`, `Group`, `SelectField`, `NumberField`, а частини результату — у `Stat`, `ResultLink`, `ProductLink`; їх використовують обидва калькулятори;
    - замість власних класів — `PillRadio`, `chipClasses`, `inputClasses`, `.range-input`, `Panel`, `SectionHeader`, токени відступів;
    - числа форматуються через `formatNumber`;
    - прибрано фіксовану мобільну плашку, яка перекривала кнопку дзвінка, і дублі «Дані оновлено» та підпису графіка.
  - SEO і GEO:
    - один H1 і логічні H2, `<main>`;
    - крихти JSON-LD у 2 рівні замість 3 з дублем URL;
    - WebApplication із `featureList` і `dateModified`;
    - прев’ю JPEG 1200×630 замість SVG, якого не показують соцмережі;
    - у HTML є самодостатній приклад розрахунку з числами.
  - Виправлено регресію з аудиту сайту: `not-found.tsx` читав `headers()`, і через це всі сторінки сайту стали динамічними. Тепер `src/proxy.ts` переписує заплановані адреси на статичну `/v-rozrobtsi/` (404, noindex), а `not-found.tsx` знову статичний. Усі сторінки знову ○/●.
- **Файли:** src/app/(uk)/kalkulyator/okupnist-ses/page.tsx, src/app/en/kalkulyator/okupnist-ses/page.tsx, src/app/{(uk),en}/v-rozrobtsi/page.tsx, src/app/not-found.tsx, src/proxy.ts, src/components/calculator/{calculator-fields,calculator-result-parts,ses-payback-state,ses-payback-calculator,QuickCalculator}.tsx, src/components/calculator/ses-payback-details.tsx (видалено), src/components/sections/ses-payback/*, src/components/pages/ses-payback-page.tsx, src/content/{routes,navigation,ses-calculator}.ts, src/lib/request-path.ts (видалено), messages/{uk,en}.json, public/images/og/ses-calculator.jpg (нове), public/images/og/ses-calculator.svg (видалено), docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:**
  - lint, test (20) і build проходять. Перевірено в headless Edge на 1440 і 390 px, горизонтального скролу немає. Калькулятор на головній після рефакторингу виглядає як раніше.
  - TODO(content): власнику підтвердити рівні споживання й накопичувачі в «Типових СЕС» (потужність рахує калькулятор).
  - «Усі проєкти» веде на /proekty/ (сторінка «в розробці»). Статті з лівої колонки FAQ на макеті ще не створено, тому їх не додано.
  - Невідомі `/en/…` адреси показують український 404: статичний not-found не знає мови.
  - Калькулятори дають різний резерв для SVIT HOME: головна ≈ 15 год (частка критичного навантаження), ця сторінка ≈ 16 год (вибрані прилади).

## 2026-11-11 — Посилання на калькулятор у меню й футері
- **Агент:** Codex
- **Гілка:** feature/calculator-navigation (статус: у роботі)
- **Що зроблено:** додано локалізоване посилання на калькулятор окупності у випадаюче меню «Рішення» та до розділів сайту у футері.
- **Файли:** `src/components/layout/header/header-data.ts`, `src/content/navigation.ts`, `messages/{uk,en}.json`, `docs/ai/{CONTEXT,CHANGELOG}.md`
- **Нотатки / що далі:** посилання використовують локалізований маршрут `/kalkulyator/okupnist-ses/` та `/en/kalkulyator/okupnist-ses/`.

## 2026-11-11 — Калькулятор окупності СЕС
- **Агент:** Codex
- **Гілка:** feature/ses-payback-calculator (статус: змерджено в develop)
- **Що зроблено:** додано адаптивну сторінку-калькулятор українською й англійською з оцінкою потужності, генерації, економії, резерву, накопичувача та окупності; параметри синхронізуються з URL і передаються у спільну форму заявки. Додано методику, помісячний графік, FAQ, metadata/JSON-LD та навігаційні CTA.
- **Файли:** `src/app/(uk)/kalkulyator/okupnist-ses/page.tsx`, `src/app/en/kalkulyator/okupnist-ses/page.tsx`, `src/components/{calculator/ses-payback-calculator.tsx,calculator/ses-payback-details.tsx,pages/ses-payback-page.tsx}`, `src/content/{appliances,insolation,ses-calculator,tariffs}.ts`, `src/lib/calc/{ses-core.ts,ses.ts,ses.test.mjs}`, `messages/{uk,en}.json`, маршрути, FAQ, sitemap, CTA, SEO schema, `public/images/og/ses-calculator.svg`
- **Нотатки / що далі:** розрахунок є орієнтовним; бізнес-тариф вводить користувач. `npm test` (20 тестів), `npm run lint` і `npm run build` проходять.

## 2026-11-11 — Аудит сайту: посилання, сторінка «в розробці», іконки, стиль
- **Агент:** Claude Code
- **Гілка:** feature/site-audit (статус: змерджено в develop)
- **Що зроблено:**
  - Обійдено всі внутрішні посилання на продакшн-збірці (uk і en).
  - 12 запланованих сторінок (/svit/, /pro-nas/, /proekty/, три правові, три /rezervne-zhyvlennya/…, /rishennya/ses-dlya-gotelyu/, /cec/dlya-domu/, /cec/dlya-biznesu/) тепер відкривають екран «Ця сторінка ще в розробці» з шапкою, футером, кнопками «На головну» / «Залишити заявку» і швидкими посиланнями (СЕС, накопичувачі, калькулятор). Інші невідомі адреси показують «Сторінку не знайдено». Статус 404 і noindex збережено. Для `/en/…` екран англійською.
  - Посилання «СЕС для дому/бізнесу» вели на /ses/ через редирект 308, тепер ведуть прямо на /cec/ (маршрут `services.solar` видалено). На /cec/ кнопка hero «Реалізовані проєкти» вела на якір, якого немає на сторінці, тепер це «Етапи робіт».
  - Додано іконки lucide до нумерованих кроків через новий `StepMarker`: етапи СЕС, вузли гібридної СЕС, аргументи «Про компанію» (головна й /cec/), процес LITHIUMVALLEY.
  - Під стиль сайту підігнано:
    - посилання в секторних картках LITHIUMVALLEY стали пігулками, як на інших продуктах (`SegmentLinks`);
    - номери кроків тепер одним шрифтом замість mono;
    - `text-2xl` у мобільному меню замінено на токен `text-h3`;
    - на мобільному вирівняно першу колонку таблиці типів СЕС.
  - Прибрано дубль `/svit-plus-16000/` у `localizedPaths`.
- **Файли:** src/proxy.ts, src/lib/request-path.ts, src/app/not-found.tsx, src/components/pages/not-found-view.tsx, src/components/ui/{step-marker,segment-card}.tsx, src/components/sections/{trust-block,ses/*,home/hero-slides.ts,home/solutions-by-segment}.tsx, src/components/product-page/{product-applications,product-bess-sections}.tsx, src/components/layout/header/mobile-menu.tsx, src/content/{routes,ses,products}.ts, src/i18n/config.ts, messages/{uk,en}.json, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:**
  - lint, test і build проходять. Перевірено в headless Edge на 1440 і 390 px: усі сторінки без горизонтального скролу.
  - Однорівневі адреси (/svit/ тощо) потрапляють у `[product]` з `dynamicParams=false`, тому текст екрана «в розробці» на них дорендерюється на клієнті (у сирому HTML його немає). Для 404 з noindex це не критично.
  - `shadow-card` — токен у globals.css, у CONTEXT він ще не описаний.

## 2026-11-11 — Зсув шапки таблиці типів СЕС
- **Агент:** Claude Code
- **Гілка:** fix/ses-plant-types-header (статус: змерджено в develop)
- **Що зроблено:** назви колонок («Мережева», «Гібридна», «Автономна») стояли на одну колонку лівіше за значення: порожня перша клітинка шапки з `sr-only md:not-sr-only` не займала місце в сітці. Замінено на `hidden md:block`.
- **Файли:** src/components/sections/ses/ses-plant-types.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** у браузері не перевірено.

## 2026-11-11 — Нова таблиця «Мережева, гібридна чи автономна» на /cec/
- **Агент:** Claude Code
- **Гілка:** feature/ses-plant-types-table (статус: змерджено в develop)
- **Що зроблено:** секцію переверстано за макетом власника: таблиця без білої картки, колонка «Гібридна» виділена (темна шапка з «рекомендуємо», білі клітинки), так/ні — іконки в кружечках (check / cross, з sr-only «Так/Ні»), тексти з малої літери, рядок «Кому підходить». Новий лід секції uk/en. Без горизонтального скролу: на мобільному назва рядка над трьома значеннями, з md — 4 колонки; ARIA-ролі table/row/cell. Значення `plantRows` тепер `boolean | Localized`.
- **Файли:** src/components/sections/ses/ses-plant-types.tsx, src/content/ses.ts, messages/{uk,en}.json, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** посилання «Детальніше: мережева чи гібридна СЕС» з макета не додано — статті ще немає (TODO(content)). У браузері не перевірено.

## 2026-11-11 — Контраст і кадрування фото карток СЕС
- **Агент:** Codex
- **Гілка:** fix/ses-card-media-position (статус: готово до merge у develop)
- **Що зроблено:** затемнення на фото-картках СЕС посилено для стабільного контрасту тексту; фото першої картки приватного будинку вирівняно по верхньому краю.
- **Файли:** `src/components/sections/ses/ses-segments.tsx`, `docs/ai/CHANGELOG.md`
- **Нотатки / що далі:** градієнт застосовується до обох карток секції, позиціонування `object-top` — лише до картки будинку.

## 2026-11-11 — Фото для бізнес-картки СЕС
- **Агент:** Codex
- **Гілка:** feature/business-solution-photo (статус: готово до merge у develop)
- **Що зроблено:** `public/images/cec/factory.avif` додано як фонове фото картки бізнесу у секції «СЕС для дому й для бізнесу» сторінок `/cec/` та `/en/cec/`.
- **Файли:** `public/images/cec/factory.avif`, `src/content/solutions.ts`, `docs/ai/CHANGELOG.md`
- **Нотатки / що далі:** підписи й alt задані в локалізованих даних рішення.

## 2026-11-11 — Виправлено розташування фото рішення для будинку
- **Агент:** Codex
- **Гілка:** fix/house-photo-cec-section (статус: готово до merge у develop)
- **Що зроблено:** фото `public/images/cec/home.avif` прибрано з картки головної сторінки та додано у картку «Весь будинок без перебоїв» секції «СЕС для дому й для бізнесу» на `/cec/` і `/en/cec/`.
- **Файли:** `src/components/sections/home/solutions-by-segment.tsx`, `src/components/ui/segment-card.tsx`, `src/components/sections/ses/ses-segments.tsx`, `docs/ai/CHANGELOG.md`
- **Нотатки / що далі:** інші картки СЕС лишаються із `MediaPlaceholder`, доки для них не буде надано фото.

## 2026-11-11 — Фото для рішення приватного будинку
- **Агент:** Codex
- **Гілка:** feature/house-solution-photo (статус: готово до merge у develop)
- **Що зроблено:** картка «Весь будинок без перебоїв» у секції рішень отримала фото СЕС для приватного будинку з контрастним затемненням; зображення та альтернативний текст зберігаються в `content/solutions.ts`. Оновлено набори hero сторінки СЕС за іменами `01`, `02`, `03` і fallback відповідно до наявних файлів.
- **Файли:** `src/content/solutions.ts`, `src/components/sections/home/solutions-by-segment.tsx`, `src/components/ui/segment-card.tsx`, `src/components/sections/home/hero-slides.ts`, `public/images/cec/*`, `docs/ai/CHANGELOG.md`
- **Нотатки / що далі:** формат імен hero: `01-*` — перший слайд, `02-*` — другий, `03-*` — третій.

## 2026-11-11 — Фото для hero сторінки СЕС
- **Агент:** Codex
- **Гілка:** fix/locale-aware-navigation (статус: готово до merge у develop)
- **Що зроблено:** hero-слайдер сторінок `/cec/` і `/en/cec/` переведено на окремі адаптивні фотографії для СЕС; усі три слайди мають власні набори 750/1280/1920/2560 AVIF, а другий — WebP fallback.
- **Файли:** `public/images/cec/hero/*`, `src/components/sections/home/hero-slides.ts`, `docs/ai/CHANGELOG.md`
- **Нотатки / що далі:** медіа головної сторінки не змінювалися.

## 2026-11-11 — Більше питань і відповідей на сторінці СЕС
- **Агент:** Claude Code
- **Гілка:** feature/ses-faq-more (статус: змерджено в develop)
- **Що зроблено:** на сторінці СЕС (/cec/ і /en/cec/) додано 5 питань у FAQ: мережева чи гібридна СЕС, СЕС без мережі, як працює гібридна, етапи створення СЕС під ключ, обслуговування після запуску. Було 3 питання, стало 8. Відповіді опираються на типи станцій і етапи з `content/ses.ts`, без нових цифр.
- **Файли:** src/content/faq.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** питання з'являються також у JSON-LD FAQPage сторінки. Відповідь про умови гарантії — загальна; конкретні строки уточнити у власника. Тривалість етапів і порядок гарантії — TODO(content).

## 2026-11-11 — Видимі посилання в картках застосувань на сторінках продуктів
- **Агент:** Claude Code
- **Гілка:** fix/product-applications-link-tone (статус: змерджено в develop)
- **Що зроблено:** на сторінках продуктів (наприклад LITHIUMVALLEY) посилання в картках «Промисловість і агро», «Комерція й офіси», «Критична інфраструктура» були білими на світлій картці та темними на темній. Причина — інвертоване значення `tone` у `ArrowLink` (`sky` → `dark`, navy/ink → `light`). Виправлено відповідність: світла картка → `light`, темна → `dark`.
- **Файли:** src/components/product-page/product-applications.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** lint і build проходять; у браузері не перевірено (варто глянути на /bess/ і /en/bess/).

## 2026-11-10 — Обов'язкові переклади всіх сторінок
- **Агент:** Codex
- **Гілка:** chore/require-page-translations (статус: готова до merge у develop)
- **Що зроблено:** Перевірено всі реалізовані маршрути: головна та п'ять продуктових сторінок мають українські й англійські версії. В `AGENTS.md` зафіксовано обов'язкове правило: кожна нова публічна сторінка виходить одразу двома мовами з повним EN-текстом, локалізованими metadata, canonical/hreflang і sitemap.
- **Файли:** AGENTS.md, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** Правило стосується реалізованих сторінок; заплановані URL перекладаються під час їх фактичної розробки.

## 2026-11-10 — Сторінка продукту SVIT 600
- **Агент:** Codex
- **Гілка:** feature/svit-600-product-page (статус: готова до merge у develop)
- **Що зроблено:** Додано серверно-рендерені `/svit-600/` і `/en/svit-600/` у спільний product-page pipeline: локалізовані metadata, hero, sticky-навігація, переваги, модуль 9 виходів/3 способів заряджання, картки автономності, згруповані характеристики, 4 сценарії застосування, 7 FAQ з FAQPage JSON-LD, пов'язані продукти та заявка з попередньо вибраною квартирою. Сторінки включено в sitemap/hreflang; факти зберігаються у `content/`.
- **Файли:** src/content/{products,product-pages,faq,navigation,routes}.ts, src/components/pages/product-page.tsx, src/components/product-page/{product-portable,product-hero,product-specs,product-applications}.tsx, src/i18n/config.ts, messages/{uk,en}.json, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** TODO(content): підтвердити 865/864 Вт·год і LiFePO₄/Li-ion; додати вагу, габарити, робочу температуру, гарантію, потужність заряджання від мережі, IP, сертифікати, типові навантаження runtime-карток та окреме OG 1200×630.

## 2026-11-10 — Видалення секції режимів LITHIUMVALLEY
- **Агент:** Codex
- **Гілка:** fix/remove-bess-modes (статус: готова до merge у develop)
- **Що зроблено:** Повністю видалено секцію «Режими роботи» зі сторінки LITHIUMVALLEY BESS, її контентний тип і дані, компонент рендерингу, пункт sticky-навігації та відповідне посилання у футері. Режими роботи в секції складу SVIT HOME залишено без змін.
- **Файли:** src/components/pages/product-page.tsx, src/components/product-page/product-bess-sections.tsx, src/content/{products,product-pages,navigation,routes}.ts, messages/{uk,en}.json, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** `npm run lint` і `npm run build` проходять.

## 2026-11-10 — Фото на сторінці LITHIUMVALLEY BESS
- **Агент:** Codex
- **Гілка:** fix/lithiumvalley-visual-details (статус: готова до merge у develop)
- **Що зроблено:** Прибрано примусовий `MediaPlaceholder` для LITHIUMVALLEY: hero, технічні характеристики, metadata та Product schema тепер використовують наявне фото й alt з `content/products.ts`. Спільний hero враховує `mediaAspect` і застосовує квадратну композицію тільки до продуктів, які її явно задають.
- **Файли:** src/content/products.ts, src/components/product-page/{product-hero,product-specs}.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** Окреме OG-зображення 1200×630 і непідтверджені технічні поля LITHIUMVALLEY залишаються TODO(content). `npm run lint` і `npm run build` проходять.

## 2026-11-10 — Сторінка LITHIUMVALLEY BESS
- **Агент:** Codex
- **Гілка:** feature/lithiumvalley-bess-page (статус: готова до merge у develop)
- **Що зроблено:** Додано `/bess/` і `/en/bess/` у спільний product-page pipeline. Шаблон узагальнено data-driven секціями конфігурацій, п'яти режимів EMS, секторними списками застосувань і reusable `HowToSteps`; додано grouped specs, 8 FAQ, спеціальну BESS-форму, пов'язані рішення та Product/BreadcrumbList/FAQPage/HowTo JSON-LD. Усі медіа повної сторінки — `MediaPlaceholder`.
- **Файли:** src/content/{products,product-pages,faq,navigation,routes}.ts, src/components/pages/product-page.tsx, src/components/product-page/{product-bess-sections,product-applications,product-hero,product-specs,related-products}.tsx, src/components/{forms/LeadForm,sections/LeadSection}.tsx, src/i18n/config.ts, src/lib/seo/schema.ts, messages/{uk,en}.json, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** TODO(content): уточнити 100 кВт у PCS-конфігураціях і належність IP54/IP55; додати номінальну напругу, DoD, round-trip efficiency, габарити, вагу, моделі EMS/PCS, тип вогнегасної речовини, сертифікати, datasheet, фото й OG. Непідтверджені поля не рендеряться; dev-only notice відсутній у production.

## 2026-11-10 — Наявне фото на сторінці SVIT PLUS 16000
- **Агент:** Codex
- **Гілка:** fix/svit-plus-16000-media (статус: готова до merge у develop)
- **Що зроблено:** За уточненням власника прибрано примусовий режим `MediaPlaceholder` для повної сторінки SVIT PLUS 16000. Hero та секція характеристик тепер беруть наявне фото й alt безпосередньо з об'єкта продукту в `content/products.ts`.
- **Файли:** src/content/products.ts, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** Окреме OG-зображення 1200×630 залишається TODO(content).

## 2026-11-10 — Сторінка продукту SVIT PLUS 16000
- **Агент:** Codex
- **Гілка:** feature/svit-plus-16000-page (статус: готова до merge у develop)
- **Що зроблено:** Додано серверно-рендерені `/svit-plus-16000/` і `/en/svit-plus-16000/` у спільний шаблон продуктів. Шаблон узагальнено новою data-driven секцією `ProductInside` для комірок/BMS/сумісності та згрупованими характеристиками. Додано hero, переваги, 29 видимих характеристик у п'яти групах, застосування, 7 FAQ, пов'язані продукти, локалізовану форму, навігацію, sitemap і Product/BreadcrumbList/FAQPage JSON-LD. Усі медіа повної сторінки поки є `MediaPlaceholder`.
- **Файли:** src/content/{products,product-pages,faq,navigation,routes}.ts, src/components/pages/product-page.tsx, src/components/product-page/{product-inside,product-hero,product-specs,product-applications}.tsx, src/components/{forms/LeadForm,sections/LeadSection}.tsx, src/i18n/config.ts, src/lib/seo/schema.ts, messages/{uk,en}.json, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** TODO(content): затверджені фото й OG 1200×630, уточнення `IP20 – IP44`, точного струму BMS у діапазоні 100–200 А; підтвердження паралельного підключення, монтажу та PDF datasheet. Останні три поля не рендеряться. lint/build і статичні SEO-перевірки проходять.

## 2026-11-10 — Менші цифри в картках переваг товару
- **Агент:** Claude Code
- **Гілка:** fix/advantage-figure-size (статус: змерджено в develop)
- **Що зроблено:** велика цифра/слово в картках переваг сторінок продуктів зменшено з number (40/60 px) до hero-sm / number-sm (32 / 40 px), щоб «Мобільна» не виходила за межі картки. Змінено лише цей компонент; ємності, статистика й індекси лишаються в погоджених розмірах.
- **Файли:** src/components/product-page/product-advantages.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** перевірено збіркою й лінтером; візуально — на сторінках /svit-home/ і /svit-plus-5000/ (1440 і 360 px).

## 2026-11-10 — SVIT HOME: опора на ніжках, без коліщаток
- **Агент:** Claude Code
- **Гілка:** fix/svit-home-legs (статус: змерджено в develop)
- **Що зроблено:** за словами власника колес у комплекті немає, формулювання «стійка на колесах» на init.energy вважаємо помилкою. Скрізь «стійка на колесах» / «мобільна стійка» замінено на «стійку на ніжках». Прибрано твердження про легке переміщення (воно трималося на колесах): переваги «Мобільна/Мобільність» стали «Ніжки/Установка», рядок «Переміщення» — «Опора: ніжки». Лишилися «без настінного монтажу» і відсік для щитка.
- **Файли:** src/content/{products,faq}.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** на init.energy /svit-home/ досі написано про колеса — власнику варто виправити сайт, інакше джерело розходиться з сайтом. Розмір ніжок і можливість переміщення не підтверджені — TODO(content).

## 2026-11-10 — Батарея SVIT PLUS 5000: 48 В, 100 Аг, понад 10 000 циклів
- **Агент:** Claude Code
- **Гілка:** fix/svit-plus-5000-cycles (статус: змерджено в develop)
- **Що зроблено:** за даними власника оновлено SVIT PLUS 5000 скрізь: ресурс 6 000+ → понад 10 000 циклів (картка й фокус-характеристика на головній, сторінка продукту: hero, переваги, характеристики, метадані, FAQ), номінальна напруга 51,2 → 48 В, ємність 5,12 кВт·год (100 Аг). Прибрано «≈ 15 років» і «при 80% DOD» та діапазон робочої напруги 45–57,6 В, бо вони були прив'язані до старих цифр і не підтверджені для нових.
- **Файли:** src/content/{products,product-pages,faq}.ts, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** строк служби в роках не публікуємо, доки власник не підтвердить. Діапазон робочої напруги батареї 48 В — TODO(content). Перевірка: lint, test і build проходять.

## 2026-11-10 — Сповіщення нижче
- **Агент:** Claude Code
- **Гілка:** fix/toast-lower (статус: змерджено в develop)
- **Що зроблено:** сповіщення опущено з `top-20` до `top-32` (8 rem від верху), щоб не було під шапкою.
- **Файли:** src/components/ui/toast.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** перевірити в браузері на десктопі й телефоні.

## 2026-11-10 — Англійська мова зберігається при переходах
- **Агент:** Claude Code
- **Гілка:** fix/keep-english-navigation (статус: змерджено в develop)
- **Що зроблено:** посилання в мега-меню і мобільному меню на продукти та рішення, у футері, на картках застосувань і в результаті калькулятора тепер ведуть на англійську версію, якщо вона є (через `localizePath`). Додано /svit-plus-16000/ до `localizedPaths`: англійська сторінка вже збиралась, але перемикач, hreflang і посилання її не бачили.
- **Файли:** src/i18n/config.ts, src/components/layout/header/header-data.ts, src/content/navigation.ts, src/components/product-page/product-applications.tsx, src/components/calculator/QuickCalculator.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** англійська є для головної, SVIT PLUS 5000, SVIT HOME і SVIT PLUS 16000. Сторінок /cec/, /svit/, /rishennya/…, /svit-600/, /bess/ немає в збірці: посилання на них ведуть на українські адреси (і 404). Потрібне рішення власника: прибрати їх з меню або створити сторінки.

## 2026-11-10 — Фото першого слайда СЕС
- **Агент:** Claude Code
- **Гілка:** fix/ses-first-slide-photo (статус: змерджено в develop)
- **Що зроблено:** на першому слайді сторінки СЕС (/cec/) стоїть фото з другого слайда (сонячні панелі, набір 02) замість загального фото 01.
- **Файли:** src/components/sections/home/hero-slides.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** другий слайд має те саме фото; коли прийдуть три фото з панелями, розвести їх по слайдах.

## 2026-11-10 — Коротше меню шапки на /cec/
- **Агент:** Claude Code
- **Гілка:** fix/cec-header-main-links (статус: змерджено в develop)
- **Що зроблено:** у шапці сторінки СЕС лишилось 4 основні розділи: СЕС для дому й бізнесу, Накопичувачі SVIT, Калькулятор, Про компанію. Решта розділів — у колонці «На цій сторінці» футера. Список у шапці (десктоп і мобільне меню) тепер короткий.
- **Файли:** src/components/layout/header/header-data.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** на головній список розділів у шапці ще повний — скажіть, якщо його теж скоротити.

## 2026-11-10 — Меню шапки на сторінці СЕС (/cec/)
- **Агент:** Claude Code
- **Гілка:** feat/cec-header-menu (статус: змерджено в develop)
- **Що зроблено:** на сторінці СЕС у шапці (десктоп і мобільне меню) з'явились пункти її розділів: СЕС для дому й бізнесу, Типи СЕС, Гібридна СЕС, Про компанію, Етапи робіт, Накопичувачі SVIT, Калькулятор, Питання й відповіді, Консультація. Підписи й якорі — ті самі, що в колонці футера. На інших сторінках, крім головної, пункти розділів не показуються. Компонент HomeOnly замінено на HeaderSectionLinks (вибір списку за адресою).
- **Файли:** src/components/layout/header/{header-data,header-section-links,desktop-nav,mobile-menu}.tsx, src/components/layout/header/home-only.tsx (видалено), docs/ai/CHANGELOG.md
- **Нотатки / що далі:** перевірити в браузері на десктопі й на телефоні; пункт «Реалізовані проєкти» з'явиться разом із секцією.

## 2026-11-10 — Сторінка СЕС лишається на /cec/
- **Агент:** Claude Code
- **Гілка:** fix/cec-link (статус: змерджено в develop)
- **Що зроблено:** власник попросив, щоб посилання було /cec/. Сторінку перенесено з /ses/ на /cec/ (uk і en), пункт меню, футер, sitemap і англійська версія ведуть на /cec/. Редирект тепер /ses/ → /cec/ (308); /cec/ більше не перенаправляється, щоб не було петлі.
- **Файли:** src/app/(uk)/cec/page.tsx, src/app/en/cec/page.tsx, src/content/{routes,ses}.ts, src/i18n/config.ts, next.config.ts, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** перевірити редирект /ses/ → /cec/ на запущеному сервері; посилання на сторінки сегментів оновлено на /cec/dlya-domu/ і /cec/dlya-biznesu/ (їх ще немає).

## 2026-11-10 — Меню «На цій сторінці» на /ses/
- **Агент:** Claude Code
- **Гілка:** feat/ses-footer-nav (статус: змерджено в develop)
- **Що зроблено:** у футері на сторінці СЕС з'явилась колонка «На цій сторінці»: СЕС для дому й бізнесу, Типи СЕС, Гібридна СЕС, Про компанію, Етапи робіт, Накопичувачі SVIT, Калькулятор, Питання й відповіді, Консультація. Підписи взяті з уже наявних і чотирьох нових ключів `footer.links`. Порядок — як на сторінці; якір «Реалізовані проєкти» з'явиться разом із секцією.
- **Файли:** src/content/navigation.ts, messages/{uk,en}.json, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** перевірено збіркою, лінтером і типами; посилання в HTML обох мов ведуть на /ses/#… і /en/ses/#….

## 2026-11-10 — Сторінка «Сонячні електростанції» /ses/
- **Агент:** Claude Code
- **Гілка:** feat/ses-page (статус: змерджено в develop)
- **Що зроблено:** нова сторінка /ses/ (uk) і /en/ses/ (en). Секції: hero зі своїми трьома слайдами (тексти написано, фото ті самі, що на головній, поки не прийдуть три фото з панелями), «СЕС для дому й для бізнесу» (два картки з плейсхолдером фото), таблиця «Мережева, гібридна чи автономна», «Як працює гібридна СЕС» (чотири вузли), спільний блок «Про компанію» (той самий компонент, що на головній), «Як ми будуємо СЕС» (5 етапів), спільні з головною: SVIT, проєкти, калькулятор, FAQ (відкрито тему «СЕС»), форма заявки. Старий /cec/ тепер 308 на /ses/. Пункт меню «Сонячні електростанції» веде на /ses/. Service, BreadcrumbList, FAQPage JSON-LD, sitemap з /en/ses/.
- **Файли:** src/content/ses.ts, src/content/{routes}.ts, src/components/pages/{ses-page,home-page}.tsx, src/components/sections/{trust-section}.tsx, src/components/sections/ses/*, src/components/sections/home/{hero,hero-slider,hero-slides,faq-section}.tsx, src/components/faq/FaqAccordion.tsx, src/app/(uk)/ses/page.tsx, src/app/en/ses/page.tsx, src/app/sitemap.ts, next.config.ts, src/i18n/config.ts, src/lib/seo/schema.ts, messages/{uk,en}.json, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** TODO(content): фото для двох карток сегментів і трьох фото з панелями для hero; тривалість етапів; перевірити таблицю типів СЕС і тексти вузлів власником; сторінки /ses/dlya-domu/ і /ses/dlya-biznesu/ ще не створені (посилання з карток ведуть на неіснуючі сторінки); блок статей не виведено (немає 3 статей); секція «Реалізовані проєкти» не показується, бо немає видимих проєктів (так само, як на головній); фото hero-слайдів — з головної. Перевірено збіркою, лінтером, типами; редирект /cec/ перевірено на запущеному сервері. У браузері не перевірено (360 px).

## 2026-11-10 — SEO і GEO сторінки SVIT PLUS 16000
- **Агент:** Claude Haiku 5.5
- **Гілка:** feat/svit-plus-16000-seo (статус: змерджено в develop)
- **Що зроблено:** перевірено згенерований HTML обох мов: один H1, canonical, опис 152/130 символів, Product (брендинг, категорія), BreadcrumbList, Organization, FAQ (7 питань). Додано OG-зображення: JPEG 1200×630 `public/images/og/svit-plus-16000.jpg` з фото батареї (раніше в соцмережах не було прев'ю).
- **Файли:** src/content/products.ts, public/images/og/svit-plus-16000.jpg, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** після публікації — Rich Results Test і Search Console. Крихта «Продукти SVIT» веде на якір #products головної, бо сторінки /svit/ ще немає.

## 2026-11-10 — SEO і GEO сторінки SVIT HOME
- **Агент:** Claude Code
- **Гілка:** feat/svit-home-seo (статус: змерджено в develop)
- **Що зроблено:** title доповнено запитом «комплект резервного живлення»; опис скорочено з 176/182 до ≤ 155 символів. FAQ сторінки: додано відповідь «скільки працюватиме» (раніше лише на головній; прибрано посилання на «калькулятор вище», якого на сторінці продукту немає), «який інвертор і батарея в комплекті», «чим відрізняється від SVIT PLUS 5000». Загальні покращення шаблону (крихти без 404, Product @id/brand/manufacturer, Organization, OG JPEG) уже діють.
- **Файли:** src/content/{products,faq}.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** перевірено згенерований HTML обох мов. Після публікації — Rich Results Test і Search Console.

## 2026-11-10 — Якісніші фото складу SVIT HOME та батареї
- **Агент:** Claude Code
- **Гілка:** feat/svit-home-photo-quality (статус: змерджено в develop)
- **Що зроблено:** фото стійки, інвертора та батареї SVIT PLUS 5000 перекодовано з оригіналів PNG з Downloads (1448×1086 / 1254×1254) в AVIF якістю 80. Раніше файли важили 12–18 КБ і були сильно стиснуті; тепер 64–111 КБ. Розміри й пропорції не змінено. Також додано до git папку `public/images/products/svit-home/`, яка раніше не була закомічена: без неї фото складу не потрапили б на сервер.
- **Файли:** public/images/products/svit-home/{standalone,invertor}.avif, public/images/products/svit-plus-5000.avif, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** hero-фото SVIT HOME (svit-home.avif, 16 КБ) досі стиснуте; оригінал більшої роздільної здатності не знайдено. Якщо є, перекодувати так само.

## 2026-11-10 — Фото складу комплекту SVIT HOME
- **Агент:** Claude Code
- **Гілка:** feat/svit-home-composition-photos (статус: змерджено в develop)
- **Що зроблено:** у блок «Що входить у SVIT HOME» додано фото: інвертор (invertor.avif), стійка на ніжках (standalone.avif) і батарея — фото SVIT PLUS 5000, бо окремого фото батареї в комплекті немає. Блок вміє показувати фото (поле `image` у складі), без фото лишається заглушка.
- **Файли:** src/components/product-page/product-composition.tsx, src/content/{products,product-pages}.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** на фото інвертора він змонтований на стіні — переконайтесь, що це ок, бо комплект у цілому без настінного монтажу. Фото батареї SVIT PLUS 5000 можна замінити, якщо з'явиться окреме фото комплектної батареї.

## 2026-11-10 — Фото на сторінці SVIT HOME
- **Агент:** Claude Code
- **Гілка:** feat/svit-home-photo (статус: змерджено в develop)
- **Що зроблено:** на сторінці SVIT HOME вставлено фото з продукту замість заглушки (прибрано `mediaPlaceholder`). Для соцмереж додано JPEG 1200×630 `public/images/og/svit-home.jpg`.
- **Файли:** src/content/products.ts, public/images/og/svit-home.jpg, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** фото комплекту, інвертора і батареї на сторінці ще не підготовлені (TODO(content)); розмір файлу фото 16 КБ — якщо будуть оригінали, перекодувати.


- **Агент:** Claude Code
- **Гілка:** feat/svit-plus-5000-seo (статус: змерджено в develop)
- **Що зроблено:** крихта «Каталог» вела на неіснуючу /svit/ (404) — тепер видима крихта веде на секцію накопичувачів головної, а з JSON-LD BreadcrumbList цей рівень прибрано. Product: стабільний `@id`, один бренд SVIT, `manufacturer` → Organization (підтверджено власником лише для SVIT PLUS 5000 і SVIT HOME), `category`. На сторінки продуктів додано JSON-LD Organization. Опис скорочено до 150/148 символів (було 167). Додано прев'ю для соцмереж: JPEG 1200×630 `public/images/og/svit-plus-5000.jpg` (AVIF соцмережі не показують). FAQ: два нові питання з прямими відповідями — сумісність з інверторами (48 В, RS485/CAN, VICTOR у SVIT HOME) і скільки годин працює одна батарея.
- **Файли:** src/lib/seo/{schema,metadata}.ts, src/components/pages/product-page.tsx, src/components/product-page/product-hero.tsx, src/content/{product-pages,faq}.ts, public/images/og/svit-plus-5000.jpg, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** перевірено згенерований HTML обох мов: один H1, canonical, hreflang, og:image JPEG, Product/BreadcrumbList/Organization/FAQPage (9 питань). Після публікації — Rich Results Test і подати URL у Search Console. TODO(content): PDF паспорт, гарантія строку служби в роках, діапазон робочої напруги для 48 В.

## 2026-11-10 — Бічні відступи картки форми заявки
- **Агент:** Claude Code
- **Гілка:** fix/lead-form-side-padding (статус: змерджено в develop)
- **Що зроблено:** на телефоні бічні відступи картки форми заявки зменшено з 24 до 18 px (`px-4.5`, як бічні поля сторінки); з `sm` — як раніше (`px-card-sm`, з `lg` — `p-card`). Вертикальні відступи не змінено.
- **Файли:** src/components/forms/LeadForm.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** калькулятор і картки рішень мають той самий `p-card-sm` — якщо потрібно і там, скажіть.

## 2026-11-10 — Зелений токен success для сповіщення
- **Агент:** Claude Code
- **Гілка:** feat/success-color-token (статус: змерджено в develop)
- **Що зроблено:** додано токен `--color-success` (#15803D) у globals.css. Використано лише для іконки успіху в сповіщенні; помилка лишилась нейтральною. Токен задокументовано в CONTEXT.md, щоб не використовувати його для тексту й кнопок.
- **Файли:** src/app/globals.css, src/components/ui/toast.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** відтінок призначений для іконки; якщо власник захоче інший, змінити тільки токен.

## 2026-11-10 — Сповіщення з рамкою і видимим виїздом
- **Агент:** Claude Code
- **Гілка:** fix/toast-border-slide (статус: змерджено в develop)
- **Що зроблено:** у сповіщення додано рамку `line` і тінь `shadow-soft` (попередня `shadow-card` на білому майже не було видно). Виїзд справа збільшено з 48 до 120 px і тривалість з 0,3 до 0,5 с, щоб рух було видно; при `prefers-reduced-motion` лишається лише поява.
- **Файли:** src/components/ui/toast.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** перевірити в браузері на вашій ширині, чи виїзд справді видно.

## 2026-11-10 — Сповіщення праворуч, без вбудованої подяки
- **Агент:** Claude Code
- **Гілка:** fix/toast-right-no-inline-success (статус: змерджено в develop)
- **Що зроблено:** сповіщення про відправку переміщено вгору праворуч і виїжджає з правого краю. Вбудовану картку подяки після заявки прибрано (форма лишається, очищається, а результат показує сповіщення). Так само в підписці футера: прибрано вбудований текст успіху, лишилось сповіщення.
- **Файли:** src/components/ui/toast.tsx, src/components/forms/LeadForm.tsx, src/components/layout/footer/newsletter-form.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** помилки полів (валідація) лишаються під полями. Візуально ще не перевірено в браузері.

## 2026-11-10 — Шапка на сторінках продуктів без посилань на секції головної
- **Агент:** Claude Code
- **Гілка:** fix/header-hide-section-links (статус: змерджено в develop)
- **Що зроблено:** пункти шапки, що ведуть на секції головної (Рішення, Накопичувачі, Про нас, Проєкти, Контакти) з роздільником показуються лише на головній (/ і /en/). На сторінках продуктів і послуг їх немає ні в десктопній шапці, ні в мобільному меню. Каталог і «Рішення» лишаються скрізь.
- **Файли:** src/components/layout/header/{header-data,home-only,desktop-nav,mobile-menu}.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** кнопка «Залишити заявку» в шапці досі веде на /#contacts, тобто з продукту на головну. Чи міняти її на якір заявки на сторінці продукту — рішення власника.

## 2026-11-10 — Сповіщення про результат відправки форм
- **Агент:** Claude Code
- **Гілка:** feat/form-toast (статус: змерджено в develop)
- **Що зроблено:** додано спільне сповіщення `ToastProvider` / `useToast()` (`src/components/ui/toast.tsx`), підключене в `SiteChrome`. Сповіщення з’являється зліва вгорі, виїжджає з лівого краю, через 5 с зникає; при `prefers-reduced-motion` лише з’являється. Заявка: успіх і помилка відправки йдуть у сповіщення. Підписка в футері: так само. Вбудований блок помилки заявки прибрано, помилки полів (валідація) лишаються під полями.
- **Файли:** src/components/ui/toast.tsx, src/components/layout/site-chrome.tsx, src/components/forms/LeadForm.tsx, src/components/layout/footer/newsletter-form.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** позиція `top-20` — під шапкою; якщо шапка вища або нижча, підігнати. Візуально ще не перевірено в браузері.

## 2026-11-10 — Мега-меню закривається після переходу
- **Агент:** Claude Code
- **Гілка:** fix/megamenu-close-on-navigate (статус: змерджено в develop)
- **Що зроблено:** після кліку на посилання в мега-меню шапки (і на кнопку CTA панелі) меню тепер закривається. Раніше шапка лишалась змонтованою між сторінками, і меню залишалось відкритим, поки курсор або фокус були над ним.
- **Файли:** src/components/layout/header/{mega-menu-item,mega-menu-panel}.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** мобільне меню не змінювалось. Перевірено лінтером і збіркою; у браузері — на десктопі після переходу з пункту SVIT і Рішення.

## 2026-11-10 — Фото в hero сторінки продукту 4:3
- **Агент:** Claude Code
- **Гілка:** fix/product-hero-ratio (статус: змерджено в develop)
- **Що зроблено:** фото й заглушку в hero сторінок продуктів переведено з квадрата (1:1) на 4:3, як у фото продуктів (1448×1086) і в правилах проєкту. Змінено лише `product-hero.tsx`.
- **Файли:** src/components/product-page/product-hero.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** перевірено збіркою й лінтером; візуально — на /svit-home/ і /svit-plus-5000/.

## 2026-11-10 — Оновлення характеристик і складу SVIT HOME
- **Агент:** Claude Code
- **Гілка:** fix/svit-home-kit-specs (статус: змерджено в develop)
- **Що зроблено:** за даними власника оновлено комплект SVIT HOME: інвертор VICTOR NM-ECO-6.2 kW PLUS (6,2 кВт замість 6 кВт, 48 В, контролер 120 А, UPS), батарея SVIT PLUS 5000 у складі (48 В, 100 Аг, понад 10 000 циклів замість 6 000+; «≈ 15 років» прибрано, бо прив'язане до старої цифри циклів). Сегменти «Для кого» приведено до списку власника: квартира, будинок, соцоб'єкти, ОСББ, підприємства (три картки). Оновлено всі місця: `products.ts` (картка, hero, переваги, склад, характеристики, резюме, консультація, метадані, focus), `faq.ts` (цикли, гарантія комплекту, термін служби), `CONTEXT.md`. Іконку `lab` прибрано як непотрібну.
- **Файли:** src/content/{products,faq}.ts, src/content/product-pages.ts, src/components/product-page/product-applications.tsx, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** конфлікт: сторінки SVIT PLUS 5000 (`product-pages.ts`, `faq.ts`, `products.ts`) досі пишуть 6 000+ циклів для тієї самої батареї, напруга в них 51,2 В, а в комплекті — 48 В. Потрібне рішення власника. Назва «SVIT HOME 5kW» з повідомлення не змінена: інвертор у комплекті 6,2 кВт. Гарантія інвертора і PDF лишаються TODO(content).

## 2026-11-10 — Сторінка продукту SVIT HOME
- **Агент:** Codex
- **Гілка:** feature/svit-home-page (статус: готова до merge у develop)
- **Що зроблено:** Створено повну серверно-рендерену сторінку `/svit-home/` та англійську `/en/svit-home/` на спільному шаблоні сторінок продуктів. Контент SVIT HOME винесено в `products.ts`; додано hero, переваги, data-driven композицію комплекту, характеристики, застосування, FAQ, пов'язані продукти й форму консультації. Сторінки продуктів узагальнено в один reusable Server Component, додано локалізовані URL, навігацію, canonical/hreflang, sitemap та Product/BreadcrumbList/FAQPage JSON-LD. До затвердження фото всі медіаблоки SVIT HOME показують `MediaPlaceholder`.
- **Файли:** src/app/{(uk),en}/[product]/page.tsx, src/components/pages/product-page.tsx, src/components/product-page/{product-composition,product-hero,product-advantages,product-applications,product-scaling,product-specs,related-products}.tsx, src/content/{products,product-pages,faq,navigation,routes}.ts, src/i18n/config.ts, src/lib/seo/schema.ts, messages/{uk,en}.json, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** TODO(content): затверджені фото комплекту, інвертора й накопичувача; OG-зображення 1200×630; системна напруга, габарити, вага, інтерфейси, гарантія на інвертор і PDF datasheet. Непідтверджені характеристики не рендеряться. `npm run lint` і `npm run build` проходять.

## 2026-11-10 — Автоматичний push завершених задач у develop
- **Агент:** Codex
- **Гілка:** chore/auto-push-develop (статус: змерджено в develop)
- **Що зроблено:** У спільних правилах для Codex і Claude Code зафіксовано обов'язковий workflow: після перевірки закомітити задачу в окремій гілці, змерджити її в `develop` і без додаткового запиту запушити `origin/develop`. `main` залишається недоторканним. Також зафіксовано видалення невикористовуваного `svit600.png` і прибрано його застарілу згадку з актуального контексту.
- **Файли:** AGENTS.md, public/images/products/svit600.png, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** Це правило діє для всіх наступних завершених задач і для обох AI-агентів.

---

## 2026-11-10 — Системні анімації сторінки
- **Агент:** Codex
- **Гілка:** feature/page-motion-system (статус: змерджено в develop)
- **Що зроблено:** Наявний `Reveal` поширено на всі основні композиційні елементи головної: вкладки накопичувачів, калькулятор, FAQ, фільтр проєктів, ключові слова рішень, окремі блоки заявки та футер. У блоці довіри заголовок, статистика, аргументи й фото відкриваються поетапно зі stagger. Hero та інтерактивні стани зберегли власні анімації; `prefers-reduced-motion` надалі повністю вимикає reveal-рух.
- **Файли:** src/components/sections/{LeadSection,projects-showcase,trust-block}.tsx, src/components/sections/home/{calculator-section,faq-section,product-line,solutions-by-segment}.tsx, src/components/layout/footer/footer.tsx, docs/ai/{CONTEXT,CHANGELOG}.md
- **Нотатки / що далі:** Анімації застосовані до змістових груп, а не кожної літери чи іконки, щоб не збільшувати візуальний шум. lint і build проходять; видалений власником `public/images/products/svit600.png` не включено в коміт.

---

## 2026-11-10 — Чистіші й вищі картки ємності
- **Агент:** Codex
- **Гілка:** style/simplify-capacity-cards (статус: змерджено в develop)
- **Що зроблено:** Прибрано графічний блок комірок також для SVIT PLUS 16000; усі картки ємності залишають фото на весь фон, дані й шкалу. Картки з фото стали вищими (`min-h-80` / `lg:min-h-96`), а контент рівномірно розподіляється по висоті.
- **Файли:** src/components/products/CapacityCard.tsx, src/components/sections/home/product-line.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** Дані `cellCount` у `products.ts` збережені для інших сценаріїв продукту, але більше не передаються до картки лінійки.

---

## 2026-11-10 — Без умовної синьої смуги в картці ємності
- **Агент:** Codex
- **Гілка:** style/remove-capacity-fallback-bar (статус: змерджено в develop)
- **Що зроблено:** з `CapacityCard` прибрано синю смугу-заглушку та її білу плашку. Графічний блок тепер рендериться лише коли в контенті є реальні `cellCount` або `modules`; підтверджені 16 комірок SVIT PLUS 16000 залишилися.
- **Файли:** src/components/products/CapacityCard.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** lint і build проходять.

## 2026-11-10 — Фото продукту як фон картки ємності
- **Агент:** Codex
- **Гілка:** style/product-image-card-background (статус: змерджено в develop)
- **Що зроблено:** у `CapacityCard` мініатюру прибрано, а фото продукту розгорнуто на весь фон картки. Два лінійні ink-градієнти забезпечують контраст для білого тексту й шкали; число, хімія, графічний індикатор та межі лінійки залишилися поверх фото. На hover фон плавно масштабується з урахуванням `prefers-reduced-motion`. Для продуктів без фото збережено світлий fallback.
- **Файли:** src/components/products/CapacityCard.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** lint і build проходять.

## 2026-11-10 — Більші фото й мікровзаємодії накопичувачів
- **Агент:** Codex
- **Гілка:** style/product-capacity-interactions (статус: змерджено в develop)
- **Що зроблено:** фото в `CapacityCard` збільшено з 56 до 80/96 px і переведено на `object-contain`, щоб показувати виріб повністю. Картка реагує на hover/focus підсвіченням і легкою тінню; фото, графічний блок, індикатор і шкала отримали стримані переходи, окремі комірки/модулі — реакцію на наведення. Рядки характеристик праворуч також підсвічують лінію, підпис і значення. Рух застосовується лише через `motion-safe`.
- **Файли:** src/components/products/{CapacityCard,ProductFocusTabs}.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** lint і build проходять.

## 2026-11-10 — Компактні заголовки колонок футера
- **Агент:** Codex
- **Гілка:** fix/footer-heading-density (статус: змерджено в develop)
- **Що зроблено:** `Eyebrow` отримав компактний варіант для службових заголовків футера: менший розмір і щільніший трекінг. На телефонах навігаційні колонки футера займають повну ширину, тому їхні заголовки й пункти більше не стискаються у дві вузькі колонки.
- **Файли:** src/components/ui/eyebrow.tsx, src/components/layout/footer/{footer,footer-columns}.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** lint і build проходять.

## 2026-11-10 — Внутрішні відступи футера
- **Агент:** Codex
- **Гілка:** fix/footer-panel-padding (статус: змерджено в develop)
- **Що зроблено:** синя панель футера отримала стандартні вертикальні внутрішні відступи `panel-y` зверху й знизу. Заголовки колонок та пункти меню тепер мають потрібний простір у межах панелі.
- **Файли:** src/components/layout/footer/footer.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** lint і build проходять.

## 2026-11-10 — Вкладки накопичувачів без мобільного скролу
- **Агент:** Codex
- **Гілка:** fix/product-tabs-mobile-wrap (статус: змерджено в develop)
- **Що зроблено:** на мобільних вкладки секції «Лінійка накопичувачів» тепер переносяться на наступний рядок у межах контейнера. Горизонтальний скрол, snap і програмна прокрутка до активної вкладки прибрані; клавіатурна навігація, ARIA та автоперемикання лишилися.
- **Файли:** src/components/products/ProductFocusTabs.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** lint і build проходять.

## 2026-11-10 — Плавні якорі та тимчасове збереження заявок
- **Агент:** Codex
- **Гілка:** feature/smooth-scroll-lead-storage (статус: змерджено в develop)
- **Що зроблено:** для переходів до секцій увімкнено плавний нативний скрол із вимкненням при `prefers-reduced-motion`; валідація телефону тепер приймає локальні й міжнародні номери з `+`, пробілами, дужками, дефісами, крапками та `/`, після чого прибирає розділювачі. Валідовані заявки разом із локаллю, URL, UTM, рекламними ідентифікаторами та даними калькулятора Server Action додає до приватного `storage/leads.jsonl`; файл із персональними даними виключено з Git. Додано тести форматів телефону й реального запису JSONL.
- **Файли:** src/app/{globals.css,actions/lead.ts}, src/lib/{lead-form-schema,lead-storage}.ts, src/lib/*.test.mjs, storage/README.md, .gitignore, docs/ai/*
- **Нотатки / що далі:** локальний файл розрахований на постійний Node.js-сервер із доступом до диска; перед serverless-деплоєм замінити на CRM/БД або задати постійний writable-шлях через `LEAD_STORAGE_FILE`. `npm test`, lint і build проходять.

## 2026-11-10 — Компактніші картки проєктів
- **Агент:** Claude Code
- **Гілка:** style/projects-smaller (статус: змерджено в develop)
- **Що зроблено:** висоту блоку задає aspect-ratio замість фіксованих `lg:h-180` / `h-105`: велика картка `lg:aspect-16/10`, дві малі ділять її висоту (≈ 16/7), планшет `md:aspect-video`, телефон `aspect-4/3`. На 1440 px блок 486 px (було 720). Назва — `text-h3-sm` на великій і `text-base` на малих; padding `p-card-sm` на всіх екранах; рядок даних `mt-4 pt-3`, на телефоні — у ряд за шириною вмісту (`flex-wrap`), `text-sm`, «Регіон» прихований до `sm`. Поле `image.position` у `projects.ts` (object-position, за замовчуванням center).
- **Файли:** src/components/ui/project-card.tsx, src/components/sections/projects-showcase.tsx, src/content/projects.ts, docs/ai/CHANGELOG.md

## 2026-11-10 — Накопичувачі: світлий варіант з карткою ємності
- **Агент:** Claude Code
- **Гілка:** style/product-tabs-light (статус: змерджено в develop)
- **Що зроблено:** секцію вкладок переведено на панель `sky`; нові токени `--color-accent` / `--color-accent-strong` (лише графіка), клас `.glow-accent`; варіант пігулок `tint`; новий компонент `CapacityCard` (комірки / шафи / смуга, логарифмічна шкала лінійки з `products.ts`); нові поля продуктів `chemistryLabel`, `cellCount?`, `modules?`, `focusSpecs`; ключ `productLine.capacityFrom`. Перевірено 1440/768/360, усі 5 вкладок: комірки лише в SVIT PLUS 16000 (16), решта — смуга; нічого не виходить за картку.
- **Файли:** src/app/globals.css, src/components/products/{CapacityCard,ProductFocusTabs}.tsx, src/components/sections/home/product-line.tsx, src/components/ui/chip-styles.ts, src/content/products.ts, messages/{uk,en}.json, docs/ai/*
- **Нотатки / що далі:** TODO(content): кількість комірок для SVIT 600, SVIT HOME, SVIT PLUS 5000; кількість шаф LITHIUMVALLEY за конфігурацією. SVIT 600 позначено LiFePO₄ за даними власника, хоча на /svit-600/ таблиця каже Li-ion. Розділу 9 у CLAUDE.md немає — примітка про accent у CONTEXT.md (кольори).

## 2026-11-10 — Англійська версія головної (/en/) і SEO
- **Агент:** Claude Code
- **Гілка:** feature/i18n-en-home (статус: змерджено в develop)
- **Що зроблено:** i18n без нових залежностей (`src/i18n/`: config, messages, server, client). Маршрути розділено на `(uk)` і `en`; header/футер — у `SiteChrome`. Повний `en.json` (усі ключі uk + нові групи `meta`, `chrome`), переклад даних у `content/` (продукти, рішення, послуги, офіси, довіра, проєкти, hero, меню). Перемикач мов — посилання з `hreflang` на ту саму сторінку іншою мовою (EN неактивний, де перекладу немає). Метадані головної uk/en з canonical і hreflang (x-default → uk), OG-локалі, JSON-LD Organization + WebSite, `robots.ts`, sitemap з alternates і /en/. Серверні дії форм відповідають мовою форми. Виправлено: два рядки H1 hero склеювались у тексті («станціїі») — додано пробіл.
- **Файли:** src/i18n/*, src/app/{layout.tsx,robots.ts,sitemap.ts,(uk)/*,en/*}, src/components/{pages/home-page,layout/site-chrome}.tsx, src/components/** (тексти з контексту мови), src/content/*, src/lib/{format,messages,seo/*}.ts, src/app/actions/*, messages/{uk,en}.json, docs/ai/*
- **Нотатки / що далі:** англійською зараз лише головна; сторінки продуктів і послуг — українські (посилання з /en/ ведуть на них). `<html lang>` лишається `uk` (одна коренева розкладка без експериментального `globalNotFound`), англійський вміст позначено `lang="en"` на обгортці. TODO(content): OG-зображення 1200×630; перевірити англійські формулювання носієм мови; Google Search Console — подати sitemap після публікації.

## 2026-11-09 — Збереження локальних змін і синхронізація develop
- **Агент:** Codex
- **Гілка:** chore/save-local-assets (статус: змерджено в develop)
- **Що зроблено:** збережено налаштування доступу до dev-сервера з локальної мережі та додане зображення продукту SVIT 600. Зміни закомічено й запушено до `develop`; `main` не змінювали.
- **Файли:** next.config.ts, public/images/products/svit600.png, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** зображення поки не підключене до UI; lint/build перевірено.

## 2026-11-09 — Картки рішень за ємністю
- **Агент:** Codex
- **Гілка:** feature/solution-capacity-cards (статус: змерджено в develop)
- **Що зроблено:** секцію «Що вам потрібно живити?» переверстано за макетом: ємність із `products.ts` стала головною цифрою; рекомендації показано рядками з характеристиками, а сегментні CTA — спільним `Button`. Смугу СЕС оновлено на світлу картку з Sun, описом і круглою дією. `SegmentCard` отримав режим `showcase`, а його використання на сторінці продукту зберегло попередню структуру. Додано контурний світлий варіант `Button` і темний заповнений варіант `IconButton`; URL-и й прив’язки продуктів зберігаються в `content/`.
- **Файли:** src/components/sections/home/solutions-by-segment.tsx, src/components/ui/{segment-card,button,icon-button}.tsx, src/content/{solutions,routes}.ts, messages/{uk,en}.json, docs/ai/*
- **Нотатки / що далі:** lint/build проходять; перевірено 1440, 768 і 360 px, переповнення цифр та секції немає. Маршрути `/ses/` і `/rezervne-zhyvlennya/dlya-*/` задано за макетом, але відповідні сторінки ще не реалізовано. Незалежні незакомічені `next.config.ts` і `public/images/products/svit600.png` залишено недоторканими.

## 2026-11-09 — Сторінка продукту SVIT PLUS 5000
- **Агент:** Claude Code
- **Гілка:** feature/product-page-svit-plus-5000 (статус: змерджено в develop)
- **Що зроблено:** шаблон сторінки продукту на кореневому slug /svit-plus-5000/ з даних `content/product-pages.ts` (uk/en) і `products.ts`: hero з хлібними крихтами, мітками, H1, 4 ключовими характеристиками, CTA і фото з бейджем гарантії; sticky-навігація з активним станом; переваги (4 картки); характеристики (13 рядків `<dl>`, фото sticky, посилання на паспорт лише за наявності файлу); масштабування 1–16 модулів (клієнтський віджет, SSR — 4 модулі); застосування (3 `SegmentCard`); FAQ (7 питань у `faq.ts`); інші накопичувачі; заявка на блакитній панелі з карткою «У заявці вже вказано» і прихованим `product`. SEO: title 45 симв., description 151, canonical https://init.energy/svit-plus-5000/, hreflang uk + x-default, JSON-LD Product (без offers і manufacturer), BreadcrumbList, FAQPage; `app/sitemap.ts`. `Panel` → `overflow-clip`; `Button` використовується в sticky-навігації; одиниця `V` у форматері.
- **Файли:** src/app/[product]/page.tsx, src/app/sitemap.ts, src/components/product-page/*, src/components/ui/{breadcrumbs,panel,pill-radio,segment-card}.tsx, src/components/sections/{LeadSection,home/faq-section}.tsx, src/components/{forms/LeadForm,faq/FaqAccordion}.tsx, src/content/{product-pages,faq,navigation,routes}.ts, src/lib/seo/{metadata,schema}.ts, src/lib/{format,lead-form-schema}.ts, messages/{uk,en}.json, docs/ai/*
- **Нотатки / що далі:** TODO(content): технічний паспорт PDF, OG-зображення 1200×630, власне фото для сторінки (зараз наявне фото з products.ts). TODO(i18n): маршрут /en/svit-plus-5000/ і hreflang en (не додано, щоб не вести на 404). Розбіжності з init.energy: паралельно до 16 модулів (на сайті в таблиці 6, у тексті 16 — взято дані власника); «активне балансування» на сторінці 5000 не згадане (є лише в 16000). Посилання «Резервне живлення для будинку/бізнесу», «СЕС для дому/бізнесу» ведуть на наявні сторінки (/svit-home/, /cec/, /rishennya/ses-dlya-gotelyu/, /bess/) — окремих сторінок немає. Якір заявки — #contacts (як на головній), не #consultation.

## 2026-11-09 — Секція FAQ на головній
- **Агент:** Claude Code
- **Гілка:** feature/faq-section (статус: змерджено в develop)
- **Що зроблено:** секція «Часті питання про СЕС і резервне живлення» між калькулятором і заявкою: 5/7, ліва колонка sticky з карткою «Не знайшли відповідь?» (телефон з `company.ts`, посилання на #contacts), фільтр тем і акордеон на 8 питань (перше відкрите за замовчуванням), водяний знак FAQ (CONTACT перенесено ліворуч для чергування). JSON-LD FAQPage з усіх 8 питань. Тексти UI — uk/en; пункт «Питання й відповіді» у футері.
- **Файли:** src/content/faq.ts, src/components/faq/FaqAccordion.tsx, src/components/sections/home/faq-section.tsx, src/components/seo/JsonLd.tsx, src/lib/seo/schema.ts, src/content/{routes,navigation}.ts, src/components/sections/LeadSection.tsx, src/app/page.tsx, messages/{uk,en}.json, docs/ai/*
- **Нотатки / що далі:** відповідь 02 — без «батарея LiFePO₄» для SVIT 600 (на init.energy тип батареї суперечливий); відповідь 07 починається з «Ні.» (пряма відповідь, GEO). «По всій Україні» — з тексту секції проєктів, на init.energy не перевірено. JSON-LD перевірено парсингом (8 питань); Rich Results Test — вручну після публікації.

## 2026-11-09 — Єдиний стиль секцій (крім hero)
- **Агент:** Claude Code
- **Гілка:** style/unify-site (статус: змерджено в develop)
- **Що зроблено:** «Про компанію» — та сама розкладка `SectionHeader`, що й в інших секціях (варіант `split` видалено); submit форми заявки — спільний `Button` з новим варіантом `dark` замість власної кнопки; таблиця «Порівняння лінійки» відділена від панелі накопичувачів відступом `section-head`, а не `section` (вона частина секції). Hero не змінювався.
- **Файли:** src/components/ui/{section-header,button}.tsx, src/components/forms/LeadForm.tsx, src/components/sections/{trust-block,home/product-line}.tsx, docs/ai/*

## 2026-11-09 — Єдині відступи секцій, панелей і карток
- **Агент:** Claude Code
- **Гілка:** style/spacing-tokens (статус: змерджено в develop)
- **Що зроблено:** токени `--spacing-section-sm` 4rem (було 5.5), нові `--spacing-panel-y-sm/panel-y` (3 / 6rem), `--spacing-section-head-sm` (2rem), `--spacing-card-sm/card` (1.25 / 2rem). Панелі (калькулятор, накопичувачі, «Про компанію», футер) — внутрішній відступ `panel-y` замість `section`, тож заголовок у панелі більше не на 200 px від попереднього вмісту; LeadSection — лише `pt` (раніше `py`, подвійний відступ знизу); шапка → вміст скрізь `gap-section-head-sm lg:gap-section-head`; картки рішень, смуга СЕС, картки проєктів, калькулятор, форма заявки, віджет контактів — `p-card-sm lg:p-card` (було 24/32/40 px).
- **Файли:** src/app/globals.css, src/components/sections/{home/*,projects-showcase,LeadSection,trust-block}.tsx, src/components/ui/{segment-card,project-card,contact-widget}.tsx, src/components/{calculator/QuickCalculator,forms/LeadForm,layout/footer/footer}.tsx, docs/ai/*
- **Нотатки / що далі:** заміряно 360 і 1440 px: між секціями 64 / 128 px, у панелях 48 / 96, у картках 20 / 32 (вимірювання до прокрутки показують +24 px — це початковий зсув `Reveal`). Mega-menu (лише десктоп) не змінювалось.

## 2026-11-09 — Мобільні лейбли, таби й відступи
- **Агент:** Claude Code
- **Гілка:** style/mobile-labels-tabs-gutter (статус: змерджено в develop)
- **Що зроблено:** лейбли на мобільному 12 px (`Eyebrow` — токен `--text-eyebrow-sm`, `CardLabel` — `text-xs`); усі пігулки-таби 40 px на мобільному / 44 px з `sm`; вкладки накопичувачів переносяться замість горизонтального скролу (прибрано ефект автопрокрутки ряду); `Container` отримав `inPanel` — вміст на мобільному скрізь на 18 px від краю (білі секції, панелі, футер, мобільне меню).
- **Файли:** src/components/layout/{container.tsx,footer/footer.tsx,header/mobile-menu.tsx}, src/components/ui/{eyebrow,card-label}.tsx, src/components/ui/chip-styles.ts, src/components/products/ProductFocusTabs.tsx, src/components/sections/{home/calculator-section,home/hero-content-slider,home/product-line,trust-block}.tsx, src/app/globals.css, docs/ai/*

## 2026-11-09 — Мобільна версія: переповнення і типографічні токени
- **Агент:** Claude Code
- **Гілка:** style/mobile-polish (статус: змерджено в develop)
- **Що зроблено:** виправлено вихід карток «Рішення» за екран на мобільному (сітки без базових колонок розтягувались під рядки без переносу) — додано `grid-cols-1` у всі такі сітки (рішення, калькулятор, вкладки продуктів, блок довіри, SectionHeader). Нові токени `--text-h3-sm`, `--text-hero-sm/md/hero`, `--text-stat-sm/stat`; `Heading h3` тепер 20 → 24 px; H1 hero і назва продукту на hero-шкалі; значення характеристик у вкладках і калькуляторі — stat-шкала без переносу; опис продукту `text-base sm:text-lg`; пігулки-посилання карток рішень `text-sm px-4` на мобільному; рядок ключових слів під «Рішеннями» прихований до `sm` (на вузькому екрані рядки починались із крапки).
- **Файли:** src/app/globals.css, src/components/ui/{heading,segment-card,section-header}.tsx, src/components/{calculator/QuickCalculator,products/ProductFocusTabs}.tsx, src/components/sections/{home/solutions-by-segment,home/hero-content-slider,trust-block}.tsx, docs/ai/*
- **Нотатки / що далі:** перевірено 360 і 390 px — горизонтального переповнення немає.

## 2026-11-09 — Накопичувачі: один продукт у фокусі + вкладки
- **Агент:** Claude Code
- **Гілка:** feature/product-focus-tabs (статус: змерджено в develop)
- **Що зроблено:** секцію переверстано: темна панель, SectionHeader на темному з «Усі накопичувачі» → /svit/, вкладки ARIA Tabs (←/→, Home/End, roving tabindex) з автоперемиканням кожні 6 с (CSS-анімація смуги прогресу, без інтервалів), паузами (hover, фокус, visibilityState, IntersectionObserver), зупинкою після ручного вибору, кнопкою Pause/Play і без автоперемикання при reduced motion. SSR — SVIT HOME; усі 5 панелей у HTML. Поле `focusDescription` у `products.ts` (лише з фактів init.energy). `IconButton` отримав проп `icon`. Таблиця порівняння під панеллю з `id="compare"`. Подія `product_tab_select` лише при ручному виборі. Видалено `ProductCard` і `ScrollSlider` (більше не використовуються) та невикористані тексти.
- **Файли:** src/components/products/ProductFocusTabs.tsx, src/components/sections/home/product-line.tsx, src/components/ui/icon-button.tsx, src/components/ui/{product-card,scroll-slider}.tsx (видалено), src/content/{products,routes}.ts, src/app/globals.css, messages/{uk,en}.json, docs/ai/*
- **Нотатки / що далі:** TODO(content): третя ключова характеристика SVIT PLUS 16000 (на init.energy лише ємність і хімія). Токенів `rounded-media` і display-розміру немає — використано `rounded-3xl` і `text-4xl lg:text-6xl`; значення характеристик `text-2xl` (32 px не вміщались у 3 колонки). /svit/ ще не створена.

## 2026-11-09 — Вертикальні написи в секціях
- **Агент:** Claude Code
- **Гілка:** feature/section-watermarks (статус: змерджено в develop)
- **Що зроблено:** напис SOLAR з «Рішень» винесено в `SectionWatermark`; додано STORAGE, ENERGY, PROJECTS, SYSTEM, CONTACT в інші секції головної з чергуванням сторін. На мобільному (до `md`) приховано, щоб не лягати під текст.
- **Файли:** src/components/ui/section-watermark.tsx, src/components/sections/{home/solutions-by-segment,home/product-line,home/calculator-section,projects-showcase,LeadSection,trust-block}.tsx, docs/ai/*

## 2026-11-09 — Секція «Калькулятор» на головній
- **Агент:** Claude Code
- **Гілка:** feature/quick-calculator (статус: змерджено в develop)
- **Що зроблено:** між «Проєктами» і заявкою — світло-блакитна панель (`Panel` variant `sky`, повернуто токен `--color-sky`) з SectionHeader і `QuickCalculator`: тип об'єкта, мета (для квартири лише резерв), повзунок споживання, область (прихована для «Резерв»), повзунок годин (прихований для «Економія»); праворуч рекомендація (`aria-live`) з конфігурацією, 2×2 `<dl>`, посиланнями на продукт і «СЕС під ключ», кнопкою, що скролить до форми й передає параметри (`calculatorData` у Server Action). SSR рендерить результат за замовчуванням. Події `calculator_interaction` / `calculator_result_cta` через `trackEvent`. Радіо-пігулки винесено в `PillRadio` (форма заявки теж). Тексти в uk/en, пункт футера «Калькулятор», `npm test` (9 тестів формул).
- **Файли:** src/components/calculator/QuickCalculator.tsx, src/components/sections/home/calculator-section.tsx, src/components/ui/{pill-radio,panel}.tsx, src/components/forms/LeadForm.tsx, src/content/{calculator,routes,navigation}.ts, src/lib/{calculator,calculator-bridge,lead-form-schema}.ts, src/lib/calculator.test.mjs, src/app/{page.tsx,globals.css}, messages/{uk,en}.json, package.json, docs/ai/*
- **Нотатки / що далі:** TODO(content) у calculator.ts: specificYield усіх областей (оцінки, перевірити PVGIS), стандартні потужності СЕС, діапазони споживання, частки критичного навантаження, DoD продуктів (0,9), макс. модулів SVIT PLUS і крок LITHIUMVALLEY, Крим/Севастополь. Посилання на «детальний калькулятор окупності» прибрано за рішенням власника (2026-11-09): після калькулятора — лише заявка. Сторінок резервного живлення ще немає; продукти лінкуються на наявні URL (/svit-home/ тощо), рішення — на /cec/. Обласні назви в select — лише uk до i18n.

## 2026-11-09 — Правки головної за власником (картки, слайдер, фони, паралакс)
- **Агент:** Claude Code
- **Гілка:** окремі style/*, feature/*, content/* гілки (статус: змерджено в develop)
- **Що зроблено:** рядок ключових слів під «Рішеннями» (без Reveal, круглі крапки); пункт меню «Рішення» на секцію; тексти секції накопичувачів (SVIT і LITHIUMVALLEY, без зайвих речень); лейбли карток — `CardLabel` як фільтри-пігулки з іконкою сегмента (`src/content/segments.ts`); картка 02 — `navy` rgb(8 18 54), перше посилання карток рішень — світла пігулка; світлі картки рішень і картки товарів при hover — `navy`; картки товарів: фото з полями 8 px, уся картка клікабельна; усі 5 накопичувачів у `ScrollSlider` (кнопки на lg, свайп нижче), поле `featured` у продуктах видалено; фон `.bg-ink-glow` (ink + синє світіння) у «Про компанію», header, меню й футері; плавніший і довший `.fade-from-ink` над фото; паралакс фото hero (30% прокрутки, вимкнено при reduced motion). Порядок секцій пробували змінити й повернули назад.
- **Файли:** src/app/globals.css, src/components/{layout,sections,ui}/**, src/content/{products,solutions,segments}.ts, messages/uk.json, docs/ai/*
- **Нотатки / що далі:** header тепер непрозорий (`bg-ink-glow` замість `slate-950/95` з blur). Відкриті питання власнику: дублі «Рішення» в меню; які контакти бракує у віджеті.

## 2026-11-06 — Уніфікація UI-стилю
- **Агент:** Claude Code (роботу завершив і зафіксував Codex після вичерпання ліміту Claude)
- **Гілка:** refactor/unified-style (статус: змерджено в develop)
- **Що зроблено:** уніфіковано типографічну шкалу, геометрію великих панелей, шапки секцій, лейбли, стрілочні посилання й круглі icon-кнопки. Додано спільні `Eyebrow`, `ArrowLink`, `IconButton`, `Panel`, `SocialLinks`; видалено дублікати `Label`, `TextLink` і header-only `SocialLinks`. На нові модулі переведено header, hero, контентні секції, картки проєктів і footer; заглушки проєктів отримали світлий стиль замість темних карток без фото.
- **Файли:** src/app/globals.css, src/components/{forms,layout,sections,ui}/**, src/content/{navigation,projects}.ts, docs/ai/*
- **Нотатки / що далі:** `npm run lint` і `npm run build` проходять. Реальні фото й дані кейсів усе ще позначені `TODO(content)`.

## 2026-11-06 — Футер на мобільному на всю ширину
- **Агент:** Claude Code
- **Гілка:** fix/footer-mobile-bleed (статус: змерджено в develop)
- **Що зроблено:** на мобільному футер без зовнішніх полів (панель зливається з краями екрана), заокруглений лише зверху (`rounded-t-panel`), вміст — на 10 px від краю через `Container`. З `sm` — панель з полями 16 px і `rounded-panel`, як раніше.
- **Файли:** src/components/layout/footer/footer.tsx, docs/ai/*

## 2026-11-06 — 10 px від краю екрана на мобільному скрізь
- **Агент:** Claude Code
- **Гілка:** fix/mobile-gutter-everywhere (статус: змерджено в develop)
- **Що зроблено:** на мобільному власні відступи від краю приведено до 10 px: футер (16 → 10 px, також знизу), темна панель блоку довіри (8 → 10 px), мобільне меню (20 → 10 px). З `sm` — як було. Перевірено на 360 px: усі контейнери й панелі на 10 px від краю, переповнення немає.
- **Файли:** src/components/layout/footer/footer.tsx, src/components/sections/trust-block.tsx, src/components/layout/header/mobile-menu.tsx, docs/ai/*

## 2026-11-06 — Єдиний стиль полів вводу
- **Агент:** Claude Code
- **Гілка:** fix/unified-inputs (статус: змерджено в develop)
- **Що зроблено:** спільний `inputClasses({ tone, invalid, multiline })` у `src/components/ui/input-styles.ts`: висота 56 px, `rounded-field` 14 px, рамка 1px, відступ 16 px, шрифт 16 px, однакові hover / focus-visible (суцільна рамка + кільце 3 px) / error / disabled; тони `light` і `dark`. Перенесено поля форми заявки й розсилки у футері (розсилка більше не `rounded-full`).
- **Файли:** src/components/ui/input-styles.ts, src/components/forms/LeadForm.tsx, src/components/layout/footer/newsletter-form.tsx, docs/ai/*

## 2026-11-06 — Нижчий перемикач мов
- **Агент:** Claude Code
- **Гілка:** fix/language-switcher-height (статус: змерджено в develop)
- **Що зроблено:** кнопки перемикача мов 40×28 → 40×24 (загальна висота 34 → 30 px).
- **Файли:** src/components/layout/header/language-switcher.tsx, docs/ai/CHANGELOG.md

## 2026-11-06 — Перемикач мов з анімацією
- **Агент:** Claude Code
- **Гілка:** fix/language-switcher (статус: змерджено в develop)
- **Що зроблено:** `LanguageSwitcher` переписано на сегментований перемикач: рамка `white/22`, дві кнопки 40×28, біла «пігулка» з'їжджає на обрану мову (`translate`, 200 ms `ease-tech`, вимикається при reduced motion), `aria-pressed`, `lang`, підпис групи з `messages`. Прибрано нерівні рядкові `span` і подвійну рамку у футері. Один компонент у header, мобільному меню й футері.
- **Файли:** src/components/layout/header/language-switcher.tsx, src/components/layout/footer/footer.tsx, docs/ai/*
- **Нотатки / що далі:** TODO(i18n): сайт не перекладено — вибір EN лише рухає індикатор (локальний стан), тексти лишаються українськими. З появою /en/ замінити на посилання на ту саму сторінку іншою мовою (`hrefLang`).

## 2026-11-06 — Hover у футері світлішає
- **Агент:** Claude Code
- **Гілка:** fix/footer-hover (статус: змерджено в develop)
- **Що зроблено:** посилання футера при наведенні — `white/75` → `white` (замість `opacity-75`, що затемнювало); іконки соцмереж — текст `white/80` → `white`, рамка `white/22` → `white/60`, фон `white/8`. Перехід кольору 150 ms `ease-tech`.
- **Файли:** src/components/layout/footer/{footer.tsx,footer-styles.ts}, docs/ai/*

## 2026-11-06 — Розмір логотипа через ширину
- **Агент:** Claude Code
- **Гілка:** fix/logo-sizing (статус: змерджено в develop)
- **Що зроблено:** `Logo` у header і футері задається шириною з `h-auto shrink-0` (header `w-14 lg:w-18`, футер `w-18`) замість висоти з `w-auto`, щоб логотип не сплющувався; пропорція 1000:550 перевірена в браузері.
- **Файли:** src/components/layout/header/header-main-bar.tsx, src/components/layout/footer/footer.tsx, docs/ai/*

## 2026-11-06 — Спільний футер сайту
- **Агент:** Claude Code
- **Гілка:** feature/footer (статус: змерджено в develop)
- **Що зроблено:** темна панель `rounded-panel` з відступом 16 px; сітка 24 колонки (8/5/5/6, без «На цій сторінці» — 10/6/8): бренд (логотип, опис, соцмережі 44×44 з власними SVG, перемикач мов як у header), «На цій сторінці» (якорі з `pageNavigation` за pathname), «Розділи сайту» (`siteSections`), розсилка (Server Action з валідацією і honeypot, адаптер-заглушка, стани помилка/надсилаємо/успіх, `newsletter_subscribe` у dataLayer лише після згоди на cookie). Нижній рядок з роком збірки і правовими посиланнями; велика марка SVG `textLength` на всю ширину. Секція «Рішення» отримала якір `#solutions`. Токен `--text-small` (15/1.6).
- **Файли:** src/components/layout/footer/*, src/content/{navigation,routes}.ts, src/lib/{analytics,newsletter}.ts, src/app/actions/newsletter.ts, src/app/{layout.tsx,globals.css}, src/components/sections/home/solutions-by-segment.tsx, messages/{uk,en}.json, AGENTS.md, docs/ai/*
- **Нотатки / що далі:** TODO(content): сторінки /polityka-cookie/, /umovy-vykorystannya/, /polityka-konfidentsiinosti/; пункти «Резервне живлення», «Калькулятори», «База знань» — коли з’являться в структурі. TODO(integration): сервіс розсилки, банер згоди на cookie. EN-перемикач неактивний до i18n.

## 2026-11-06 — М'якший фокус і щільніші поля форми заявки
- **Агент:** Claude Code
- **Гілка:** fix/lead-form-focus-spacing (статус: змерджено в develop)
- **Що зроблено:** фокус полів, пігулок і чекбокса — рамка `ink` + `ring-3 ring-ink/10–15` замість подвійної обвідки (outline 2px з відступом). Відступи: проміжок між полями 16→12 px, місце під помилку 20→16 px впритул під полем, нижні відступи груп 16→8 px.
- **Файли:** src/components/forms/LeadForm.tsx, docs/ai/*

## 2026-11-06 — Стани й анімації форми «Заявка на розрахунок»
- **Агент:** Claude Code
- **Гілка:** feature/lead-form-states (статус: змерджено в develop)
- **Що зроблено:** поля — default/hover (`ink/40`)/focus-visible (рамка `ink` + outline 2px offset 2)/error (`ink`, `aria-invalid`, текст 13 px з плавною появою, місце зарезервоване `min-h-5`)/disabled (`surface`); помилка зникає при редагуванні поля; після валідації фокус на першому полі з помилкою. Власний чекбокс (20 px, `rounded-md`, `ink` + lucide Check, без accent-color). Пігулки — нативні radio (стрілки), перехід 180 ms, hover `ink/40`, focus outline. Кнопка — власна в формі: стрілка зсувається при hover, active scale .98/120 ms, focus outline offset 3, loading із Loader2 і `fieldset disabled`, помилка сервера над кнопкою, success замінює форму (`animate-enter`). Автозаповнення: `autocomplete="off"` на формі й полях (без історії введених значень), телефон з `inputMode="tel"`. Секція заявки з'являється через `Reveal` (12 px, 400 ms). Токени: `--radius-field`, `--text-caption`, `--ease-tech`, `--animate-enter`. Видалено `Toast` і варіанти `dark`/`form` у `Button`; `Reveal` отримав `distance`/`duration`, крива — `ease-tech`.
- **Файли:** src/components/forms/LeadForm.tsx, src/components/sections/LeadSection.tsx, src/components/ui/{button,reveal}.tsx, src/components/ui/toast.tsx (видалено), src/app/globals.css, messages/{uk,en}.json, docs/ai/*
- **Нотатки / що далі:** колір помилки — `ink` (окремого токена немає). Уже збережені в браузері тестові значення сайт видалити не може — їх треба прибрати в самому браузері (Shift+Delete на підказці).

## 2026-11-06 — М’якші focus-стани форми
- **Агент:** Codex
- **Гілка:** fix/lead-form-focus (статус: змерджено в develop)
- **Що зроблено:** різкі чорні focus-контури полів форми замінено на м’які кільця з прозорістю токена `ink`; узгоджено keyboard-focus для radio-пігулок, чекбокса й посилання на політику. У спільному `Button` focus-контури зроблено ширшими та напівпрозорими для всіх наявних варіантів.
- **Файли:** src/components/forms/LeadForm.tsx, src/components/ui/button.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** `npm run lint` і `npm run build` проходять.

## 2026-11-06 — Спрощення контактів у секції заявки
- **Агент:** Codex
- **Гілка:** fix/lead-contact-row (статус: змерджено в develop)
- **Що зроблено:** з лівої колонки секції заявки прибрано блок адрес офісів; під кроками залишено один адаптивний рядок з основним телефоном та email без додаткових рамок. Назви кроків узгоджено з типографікою H3. Додано спільну утиліту `formatPhone`, яка показує українські номери у форматі `+38 067 198 55 50`, і застосовано її в секції та всіх наявних телефонних елементах хедера.
- **Файли:** src/components/sections/LeadSection.tsx, src/components/layout/header/{header-main-bar,mobile-menu,office-rotator}.tsx, src/lib/format.ts, docs/ai/*
- **Нотатки / що далі:** `npm run lint` і `npm run build` проходять; перевірено секцію Playwright на 1440 і 360 px. Компонента футера в поточному коді ще немає; при його створенні телефон також форматувати через `formatPhone`.

## 2026-11-06 — Тексти й контакти секції заявки
- **Агент:** Codex
- **Гілка:** fix/lead-copy-contacts (статус: змерджено в develop)
- **Що зроблено:** з lead-тексту прибрано зайве повторення назви компанії, «Дзвінок інженера» замінено на «Дзвінок менеджера» в українській та англійській локалізаціях. Контакти перегруповано у два охайні блоки офісів: місто, адреса й відповідний телефон; email винесено в окремий рядок.
- **Файли:** src/components/sections/LeadSection.tsx, messages/{uk,en}.json, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** `npm run lint` і `npm run build` проходять; браузерні перевірки та скріншоти не виконувалися за вказівкою власника.

## 2026-11-06 — Уточнення секції заявки та спільних кнопок
- **Агент:** Codex
- **Гілка:** fix/lead-section-content (статус: змерджено в develop)
- **Що зроблено:** секцію заявки розтягнуто на стандартну ширину `Container`; виведено обидві адреси офісів, обидва телефони та email із `content/company.ts`; у тексті дзвінок інженера замінено на дзвінок менеджера. Ім’я, телефон і згода позначені обов’язковими. Успішне надсилання, помилка сервера та помилки обов’язкових полів показуються через повторно використовуваний `Toast`. Submit-кнопку переведено на спільний `Button`, до якого додано варіант для світлого фону, стандартний Montserrat і підтримку нативного `<button>`; усі активні кнопки мають `cursor-pointer`.
- **Файли:** src/components/{forms/LeadForm,sections/LeadSection,layout/container,ui/button,ui/toast}.tsx, src/content/company.ts, src/app/globals.css, messages/{uk,en}.json, docs/ai/*
- **Нотатки / що далі:** `npm run lint` і `npm run build` проходять; браузерні перевірки та скріншоти не виконувалися за вказівкою власника. TODO(integration): підключити CRM; TODO(content): додати сторінку політики конфіденційності.

## 2026-11-06 — Секція «Заявка на розрахунок»
- **Агент:** Codex
- **Гілка:** feature/lead-section (статус: змерджено в develop)
- **Що зроблено:** останньою на головній додано світлу секцію заявки за макетом: кроки консультації, контакти з `company.ts` і responsive-форма в `surface`-картці. Додано нативну radio-групу, доступні поля й помилки, honeypot, спільну клієнтсько-серверну валідацію міжнародного телефону, Server Action із page URL та UTM/click-id полями, стани submitting/success. Перевірено 1440/360 px і повний keyboard flow.
- **Файли:** src/components/sections/LeadSection.tsx, src/components/forms/LeadForm.tsx, src/app/actions/lead.ts, src/lib/lead-form-schema.ts, src/content/{company,routes}.ts, src/components/layout/container.tsx, src/components/layout/header/header-data.ts, src/app/page.tsx, messages/{uk,en}.json, design-qa.md, docs/ai/*
- **Нотатки / що далі:** TODO(integration): передати валідовану заявку в CRM; TODO(content): створити сторінку політики конфіденційності за вже доданим URL.

## 2026-11-06 — Секція «Реалізовані проєкти»
- **Агент:** Codex
- **Гілка:** feature/projects-showcase (статус: змерджено в develop)
- **Що зроблено:** після блоку довіри додано світлу секцію з `SectionHeader`, фільтрами-посиланнями, адаптивною bento-сіткою 7/5 і повторно використовуваною `ProjectCard`. Картка має семантичний `<article>`, `<dl>`, перелінковку на обладнання з `products.ts`, доступні підписи й reduced-motion hover. Дані винесено у `projects.ts`; усі три тимчасові записи та фото-заглушки позначено `TODO(content)`.
- **Файли:** src/components/{sections/projects-showcase,ui/project-card}.tsx, src/content/{projects,routes}.ts, src/app/page.tsx, messages/uk.json, docs/ai/*
- **Нотатки / що далі:** перед запуском заповнити для кожного кейсу `slug`, сегмент, назву, місто/регіон, потужність, обладнання, рік, змістовний alt і локальне фото; маршрути `/proekty/` та `/proekty/[slug]/` ще не створені.

## 2026-11-06 — Плавний (eased) градієнт над фото блоку довіри
- **Агент:** Claude Code
- **Гілка:** fix/trust-gradient (статус: змерджено в develop)
- **Що зроблено:** лінійний градієнт замінено класом `.fade-from-ink` у globals.css — 12 точок прозорості за кривою ease-out від токена `ink` (через `color-mix`), висота `h-1/2`. Межа переходу не видна, серпанку на фото немає.
- **Файли:** src/app/globals.css, src/components/sections/trust-block.tsx, docs/ai/*

## 2026-11-06 — Чіткість фото блоку довіри
- **Агент:** Claude Code
- **Гілка:** fix/trust-photo-sharpness (статус: змерджено в develop)
- **Що зроблено:** у `next.config.ts` додано `images.formats` (AVIF, потім WebP) і `images.qualities: [75, 90]` (у Next 16 якість треба дозволити явно); фото блоку довіри — `quality={90}`. Градієнт над фото зменшено до `h-2/5`, `via-ink/50 via-25%`, щоб не створював серпанку на людях.
- **Файли:** next.config.ts, src/components/sections/trust-block.tsx, docs/ai/*
- **Нотатки / що далі:** AVIF тепер віддається для всіх `next/image`, зокрема фото продуктів. Якість 90 — лише для великих фото на всю ширину.

## 2026-11-06 — Якісніше фото й плавніший градієнт блоку довіри
- **Агент:** Claude Code
- **Гілка:** fix/trust-photo (статус: змерджено в develop)
- **Що зроблено:** замінено `public/images/home/solar.avif` (6016×4016), оновлено розміри в `company.ts`; градієнт над фото — `h-3/5`, `from-ink via-ink/40 via-35% to-transparent` замість `h-1/3 from-ink to-transparent`.
- **Файли:** public/images/home/solar.avif, src/content/company.ts, src/components/sections/trust-block.tsx, docs/ai/CHANGELOG.md

## 2026-11-06 — Перевірені тексти про компанію та фото блоку довіри
- **Агент:** Claude Code
- **Гілка:** feature/trust-content (статус: змерджено в develop)
- **Що зроблено:** тексти звірено з init.energy (головна, /svit-home/, /bess/) і вебпошуком. З'ясовано: LITHIUMVALLEY — партнерський бренд («Офіційний представник та інсталяція — INIT ENERGY»), власне виробництво SVIT ніде не підтверджено. Тому: прибрано «виробник, а не перепродавець» / «не перепродаємо чуже обладнання» / «власного виробництва»; H2 і lead блоку довіри — з формулювань сайту; аргументи — власне обладнання та команда, під ключ + підтримка 24/7, гарантія (5 років SVIT PLUS 5000, 10 років LITHIUMVALLEY від виробника). Додано поле `brand` у продукти, «моделей SVIT» = 4 (без LITHIUMVALLEY). Секцію продуктів перейменовано на «Накопичувачі SVIT і LITHIUMVALLEY». Додано фото `public/images/home/solar.avif` у блок довіри.
- **Файли:** src/content/{company,products}.ts, messages/uk.json, public/images/home/solar.avif, docs/ai/*
- **Нотатки / що далі:** зовнішніх джерел про INIT ENERGY / «Інформація і технології» не знайдено; фото блоку схоже на стокове (alt нейтральний). Мега-меню «SVIT» у header досі містить LITHIUMVALLEY.

## 2026-11-06 — Секція «Чому INIT ENERGY» (блок довіри)
- **Агент:** Claude Code
- **Гілка:** feature/trust-block (статус: змерджено в develop)
- **Що зроблено:** перевикористовуваний `TrustBlock` (темна панель `rounded-panel`, шапка 7/5, цифри `<dl>` 4/2×2, три аргументи, широке медіа 21:8 / 4:3 з градієнтом; поки `MediaPlaceholder`). На головній після «Накопичувачі SVIT», якір `#about-us`, посилання «Більше про компанію» → `/pro-nas/` (заплановано). Дані в `src/content/company.ts` → `trust`: 30+, 20+, 1 МВт+ звірено з init.energy, кількість моделей = `productList.length`. Токен `--radius-panel` (hero теж його використовує). Правило відступів: секції — лише `pt-section`, `<main>` — `pb-section`. `MediaPlaceholder` отримав `tone` і `className` для пропорцій.
- **Файли:** src/components/sections/trust-block.tsx, src/content/{company,routes}.ts, src/components/ui/media-placeholder.tsx, src/components/sections/home/product-line.tsx, src/app/{page.tsx,globals.css}, messages/uk.json, docs/ai/*
- **Нотатки / що далі:** TODO(content): фото блоку (21:8); умови гарантії; формулювання «виробник, а не перепродавець» / «не перепродаємо чуже обладнання» — на init.energy сказано «Працюємо тільки з перевіреними світовими виробниками», треба підтвердити власником.

## 2026-11-06 — Цілісність стилю головної
- **Агент:** Claude Code
- **Гілка:** feature/solutions-by-segment (статус: змерджено в develop)
- **Що зроблено:** «Що вам потрібно живити?» — прибрано плашку продукту, пігулки в картках замінено рядками-посиланнями (назва, характеристика muted, стрілка), залишено одну смугу «Сонячні електростанції під ключ». «Накопичувачі SVIT» — 3 світлі картки (SVIT 600, SVIT HOME, LITHIUMVALLEY, поле `featured`), статична сітка на lg і scroll-snap без кнопок на mobile/md; карусель видалено; фото з інтер'єрами відключено (TODO(content): предметні фото на світлому фоні), майбутні фото — `object-contain` на білому. Загальне: токени відступів `section-sm`/`section`/`section-head` для всіх секцій, текст у картках ≥ 16 px, прибрано тінь hero. Видалено мертвий код: `ProductCarousel`, варіанти `Button` для світлого фону й `compact`, `shortName`, `getSolutionProduct`.
- **Файли:** src/app/globals.css, src/components/sections/home/{solutions-by-segment,product-line}.tsx, src/components/ui/{segment-card,product-card,media-placeholder,button}.tsx, src/components/ui/product-carousel.tsx (видалено), src/content/{solutions,products,services}.ts, messages/uk.json, docs/ai/*
- **Нотатки / що далі:** за рішенням власника фото товарів повернуто (наявні фото з `public/images/products/`, `object-cover` на весь блок 4:3); розділ «Візуальний стиль головної» в CONTEXT переписано.

## 2026-11-06 — Слайдер накопичувачів SVIT
- **Агент:** Claude Code
- **Гілка:** feature/solutions-by-segment (статус: змерджено в develop)
- **Що зроблено:** картки «Накопичувачі SVIT» перетворено на слайдер `ProductCarousel` з усіма 5 продуктами, стрілками й свайпом; на десктопі третя видима картка завжди темна. У `products.ts` поле `featured` замінено на `segment` для кожного продукту (SVIT PLUS 5000 — «Дім і бізнес», 16000 — «Автономні системи»).
- **Файли:** src/components/ui/product-carousel.tsx, src/components/sections/home/product-line.tsx, src/content/products.ts, src/app/globals.css, messages/uk.json, docs/ai/*
- **Нотатки / що далі:** на mobile/md темної картки немає (видно 1–2 картки). Додано фото всіх 5 продуктів (`public/images/products/*.avif`, 1448×1086); для LITHIUMVALLEY файл названо `lithiumvalley.avif`. У шапку секції додано посилання «Усі накопичувачі SVIT» → `/svit/` (каталог, заплановано); підкреслені посилання винесено в `TextLink`.

## 2026-11-06 — Секція «Накопичувачі SVIT»
- **Агент:** Claude Code
- **Гілка:** feature/solutions-by-segment (статус: змерджено в develop)
- **Що зроблено:** секція `#products` після «Що вам потрібно живити?»: SectionHeader, 3 ProductCard (SVIT 600, SVIT HOME — світлі; LITHIUMVALLEY — темна) з MediaPlaceholder замість фото, списком характеристик і круглою кнопкою-посиланням; таблиця «Порівняння лінійки» (5 моделей, семантична `<table>`, горизонтальний скрол на мобільному). `content/products.ts` переписано: єдиний `productList` з числовими характеристиками, `image?`, `featured`; числа форматує `src/lib/format.ts` (Intl, кома в UA). Кнопки в картках «Що вам потрібно живити?» тепер усі контурні. Виправлено: «Залишити заявку» в header показувалась на мобільному/планшеті (`hidden` перебивався `inline-flex` у Button).
- **Файли:** src/components/sections/home/product-line.tsx, src/components/ui/{product-card,product-compare-table,media-placeholder,segment-card}.tsx, src/content/{products,solutions}.ts, src/lib/format.ts, src/components/layout/header/{header-data,header-main-bar}.ts(x), src/app/page.tsx, messages/uk.json, docs/ai/*
- **Нотатки / що далі:** TODO(content): фото всіх 5 продуктів; «Для кого» для SVIT PLUS 5000 («Дім і бізнес») і 16000 (сфера застосування) взято зі сторінок продуктів init.energy; посилання «Усі накопичувачі SVIT» → /svit не зроблено (сторінки немає в структурі). Урок: `sr-only` усередині `overflow-x-auto` потребує `relative` на контейнері, інакше розширює сторінку на мобільному.

## 2026-11-06 — Секція «Рішення за типом об'єкта»
- **Агент:** Claude Code
- **Гілка:** feature/solutions-by-segment (статус: змерджено в develop)
- **Що зроблено:** секція після hero: SectionHeader (eyebrow, H2, lead, посилання на калькулятор), 3 картки SegmentCard (квартира, будинок, бізнес — темна), 2 смуги-посилання на хаби СЕС і резервного живлення. Додано токени `@theme` (ink, surface, line, sky), проп `tone` у Label і Description (дефолт не змінено), дані в `src/content/` (products, routes, solutions), тексти UI в `messages/uk.json`. Перевірено на 1440 і 360 px.
- **Файли:** src/app/globals.css, src/app/page.tsx, src/components/ui/{label,description,section-header,segment-card}.tsx, src/components/sections/home/solutions-by-segment.tsx, src/content/*.ts, src/lib/messages.ts, messages/uk.json, docs/ai/*
- **Нотатки / що далі:** посилання карток і хаба беруться з реальних сторінок init.energy (продукти SVIT, /cec/, /rishennya/ses-dlya-gotelyu/) через `src/content/` (products, services, routes); header-меню теж читає ці дані. Після рішення власника про структуру як на init.energy посилання ведуть лише на її сторінки: картки — продукти SVIT, /cec/, готель; смуги — /cec/ і /#products; «Розрахувати систему», CTA hero/header/мега-меню — /#contacts (`routes.sections`). Увімкнено `trailingSlash: true`. i18n — окрема задача.

## 2026-11-06 — Header у дві смуги
- **Агент:** Claude Code
- **Гілка:** feature/header (статус: змерджено в develop)
- **Що зроблено:** створено header поверх hero (absolute, у layout.tsx). Верхня смуга (lg+): офіс і телефон змінюються по черзі кожні 5 с з анімацією (пауза при наведенні/фокусі), пошта статична, перемикач мов. Основна смуга: текстовий логотип, меню в nav, CTA «Залишити заявку»; на мобільних — кнопка дзвінка й бургер-меню з усіма контактами та мовами. Контенту hero додано верхній відступ під header.
- **Файли:** src/components/layout/header/*, src/app/layout.tsx, src/components/sections/home/hero-content-slider.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** email — initenergy@gmail.com; EN неактивна до появи i18n-маршрутизації; далі додано соцмережі, SVG-логотип, фіксований header зі згортанням верхньої смуги, мега-меню SVIT і «Рішення» (URL як на init.energy) з затемненням header; сторінки з меню ще не створені (404), потрібен `trailingSlash: true`.

## 2026-11-06 — Плагіни Claude Code для SEO/GEO/маркетингу
- **Агент:** Claude Code
- **Гілка:** chore/claude-plugins (статус: змерджено в develop)
- **Що зроблено:** створено `.claude/settings.json` з маркетплейсами (`extraKnownMarketplaces`) і плагінами (`enabledPlugins`): `searchfit-seo@searchfit-seo`, `marketing@knowledge-work-plugins`, `rampstack-seo@rampstack`. Назви взяті з `marketplace.json` на GitHub; самі плагіни встановлюються після перезапуску Claude Code (trust-запит) і перевіряються через `/plugin`.
- **Файли:** .claude/settings.json, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** `marketing` має опційні MCP-конектори (Ahrefs, Similarweb, HubSpot, Klaviyo, Amplitude, Supermetrics тощо, більшість платні); частина скілів `rampstack-seo` розрахована на Ahrefs MCP. Без підключення цих сервісів скіли працюють частково. `docs/SEO-GEO.md` ще не створено.
## 2026-11-06 — SEO/GEO-тексти hero
- **Агент:** Claude Code
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** переписано тексти hero під SEO і GEO: H1 містить основні запити («Сонячні станції і резервне живлення»), опис першого слайда називає бренд INIT ENERGY і повний перелік послуг, у текстах використано сутності СЕС, сонячні панелі, інвертор, АКБ, потужності комплексів. Дворядкову композицію заголовків збережено.
- **Файли:** src/components/sections/home/hero-slides.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** слайди 2–3 рендеряться лише після перемикання (AnimatePresence), тому в SSR HTML є тільки текст першого слайда; metadata у layout.tsx досі шаблонні.

## 2026-11-06 — Оновлення hero-зображення 03
- **Агент:** власник (закомічено Claude Code)
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** оновлено AVIF-варіанти третього hero-слайда (750/1280/1920/2560).
- **Файли:** public/images/home/hero/03-*.avif, docs/ai/CHANGELOG.md

## 2026-11-05 — Дворядкові заголовки hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** заголовки hero переведено на модульний формат із двох текстових рядків і відображено окремими блоками.
- **Файли:** src/components/sections/home/hero-slides.ts, src/components/sections/home/hero-content-slider.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** кожен hero-заголовок гарантовано зберігає дворядкову композицію на всіх екранах.

## 2026-11-05 — Природніший перший заголовок hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** перший заголовок hero замінено на «Енергетична незалежність».
- **Файли:** src/components/sections/home/hero-slides.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** SEO-конкретика зберігається в лейблі та описі слайда.

## 2026-11-05 — Короткі заголовки hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** скорочено заголовки всіх hero-слайдів, ключові SEO-фрази збережено в лейблах та описах.
- **Файли:** src/components/sections/home/hero-slides.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** заголовки стали компактнішими для desktop і mobile-композиції.

## 2026-11-05 — SEO-копірайтинг hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** переписано тексти всіх hero-слайдів з природними ключовими фразами про сонячні електростанції, сонячні панелі, СЕС і системи резервного живлення для дому та бізнесу.
- **Файли:** src/components/sections/home/hero-slides.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** тексти зберігають коротку структуру для читабельності, SEO й GEO без keyword stuffing.

## 2026-11-05 — Компактний mobile-опис hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** до `Description` додано варіант `compactMobile`; опис hero зменшено до `text-sm` на мобільному зі збереженням `text-lg` від `sm`.
- **Файли:** src/components/ui/description.tsx, src/components/sections/home/hero-content-slider.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** інші секції можуть використовувати той самий варіант без локальних класів.

## 2026-11-05 — Світліший mobile-overlay hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** непрозорість однотонного mobile-overlay зменшено з 84% до 74%.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** контраст контенту збережено, а фото стало помітнішим.

## 2026-11-05 — Mobile-градієнт і висота hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** для мобільних екранів hero отримав суцільний overlay по всій ширині та мінімальну висоту `100vh`; desktop-градієнт застосовується від `768px`.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** правило реалізовано mobile-first.

## 2026-11-05 — Hover-стан індикатора прокрутки
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** для `ScrollIndicator` додано `cursor-pointer`, hover-підняття, збільшення іконки та підказку «Гортайте далі», яка з’являється при hover або keyboard focus.
- **Файли:** src/components/ui/scroll-indicator.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** текст приховано поза hover/focus, тому індикатор лишається лаконічним у спокійному стані.

## 2026-11-05 — Розмір іконки прокрутки
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** іконку мишки збільшено до `1.5rem` через `size-6`.
- **Файли:** src/components/ui/scroll-indicator.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** анімація та доступний підпис без змін.

## 2026-11-05 — Лаконічний індикатор прокрутки
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** прибрано текст із `ScrollIndicator`, залишено лише анімовану іконку мишки з доступним `aria-label`.
- **Файли:** src/components/ui/scroll-indicator.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** функція плавної прокрутки та reduced-motion підтримка збережені.

## 2026-11-05 — Анімація індикатора прокрутки
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** підпис індикатора зменшено до `10px`; іконка мишки отримала м’яку циклічну Motion-анімацію вниз-вгору.
- **Файли:** src/components/ui/scroll-indicator.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** анімація вимикається для `prefers-reduced-motion`.

## 2026-11-05 — Індикатор прокрутки з мишкою
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** круглу іконку прокрутки замінено на Lucide `Mouse` з текстом «Гортайте далі» та легкою hover-анімацією.
- **Файли:** src/components/ui/scroll-indicator.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** функція плавної прокрутки лишилась без змін.

## 2026-11-05 — Індикатор прокрутки hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** у нижньому центрі hero додано клікабельний `ScrollIndicator` з іконкою `ChevronDown`.
- **Файли:** src/components/ui/scroll-indicator.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** індикатор плавно прокручує сторінку на висоту поточного viewport.

## 2026-11-05 — Кадрування третього фото hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** для третього зображення hero задано `object-top` через модульні дані слайда.
- **Файли:** src/components/sections/home/hero-slides.ts, src/components/sections/home/hero-media-slider.tsx, src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** кожне hero-зображення може задавати власне кадрування через поле `position`.

## 2026-11-05 — Позиціювання першого слайда hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** опис першого слайда доповнено рішеннями для приватних будинків, квартир і підприємств.
- **Файли:** src/components/sections/home/hero-slides.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** текст чіткіше описує цільові сегменти та ключові послуги.

## 2026-11-05 — Responsive-фото та темніший градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** додано responsive-версії третього фото hero; градієнт hero протягнуто до правого краю та посилено затемнення.
- **Файли:** public/images/home/hero/03-750.avif, public/images/home/hero/03-1280.avif, public/images/home/hero/03-1920.avif, src/components/sections/home/hero-slides.ts, src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** третій слайд використовує оптимальне зображення для кожного брейкпоінта.

## 2026-11-05 — Тестове фото третього слайда hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** `03-2560.avif` підключено до слайда систем резервного живлення.
- **Файли:** public/images/home/hero/03-2560.avif, src/components/sections/home/hero-slides.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** за наявності додати responsive-версії `03-750`, `03-1280` і `03-1920` у цей самий набір даних.

## 2026-11-05 — Оновлені зображення hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** старі ресурси hero замінено наборами `01-*` і `02-*`; перший і третій слайди використовують `01`, слайд сонячних станцій — `02`.
- **Файли:** public/images/home/hero/01-*, public/images/home/hero/02-*, src/components/sections/home/hero-slides.ts, src/components/sections/home/hero-media-slider.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** зображення мають responsive AVIF-варіанти для мобільних і desktop-екранів.

## 2026-11-05 — Оптимізація медіа-шарів hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** градієнт піднято над медіа; crossfade обмежено двома різними фото з автоматичним видаленням попереднього; `main-2560.jpeg` оптимізується через `next/image`.
- **Файли:** src/app/globals.css, src/components/sections/home/hero-slider.tsx, src/components/sections/home/hero-media-slider.tsx, src/components/sections/home/hero-slides.ts, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** однакове фото сусідніх слайдів не дублюється в DOM.

## 2026-11-05 — Overlay crossfade фото hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** медіа hero змінюється через накладання нового фото з `opacity: 0` поверх нерухомого попереднього та плавний перехід до `opacity: 1`.
- **Файли:** src/components/sections/home/hero-slider.constants.ts, src/components/sections/home/hero-slider.tsx, src/components/sections/home/hero-media-slider.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** тривалість crossfade централізована в `hero-slider.constants.ts`.

## 2026-11-05 — Плавніша зміна фото hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** збільшено тривалість crossfade зображень hero до 1,2 секунди та застосовано `easeInOut`.
- **Файли:** src/components/sections/home/hero-media-slider.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** швидка анімація текстового контенту не змінюється.

## 2026-11-05 — Плавна зміна фото hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** додано `main-2560.jpeg` для першого слайду hero; медіа слайдів винесено в окремий Motion-модуль, який плавно накладає наступне фото поверх попереднього.
- **Файли:** public/images/home/hero/main-2560.jpeg, src/components/sections/home/hero.tsx, src/components/sections/home/hero-slider.tsx, src/components/sections/home/hero-media-slider.tsx, src/components/sections/home/hero-content-slider.tsx, src/components/sections/home/hero-slides.ts, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** для наступного слайду достатньо вказати нове зображення в `heroSlides`.

## 2026-11-05 — Довший показ слайдів hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** збільшено час показу кожного hero-слайда з 6 до 10 секунд.
- **Файли:** src/components/sections/home/hero-content-slider.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** швидкість Motion-переходу збережено на рівні 350 мс.

## 2026-11-05 — Слайд резервного живлення hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** додано третій контентний варіант hero про готові комплекси резервного живлення на 300 Вт, 5 кВт, 16 кВт і рішення до 1 044 кВт.
- **Файли:** src/components/sections/home/hero-slides.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** CTA слайду — «Підібрати рішення» та «Залишити заявку».

## 2026-11-05 — Letter-spacing заголовка hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** до `Heading` додано модульний проп `letterSpacing`; заголовок hero використовує `normal` для трохи вільнішої типографіки.
- **Файли:** src/components/ui/heading.tsx, src/components/sections/home/hero-content-slider.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** інші секції можуть обирати `tight`, `normal` або `wide` без локальних класів.

## 2026-11-05 — Motion-анімація слайдів hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** додано Motion; слайди hero тепер входять із правого краю viewport (`100vw`) і швидко виходять ліворуч.
- **Файли:** package.json, package-lock.json, src/components/sections/home/hero-content-slider.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** Motion використовується для плавних і продуктивних UI-анімацій.

## 2026-11-05 — Слайдер контенту hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** контент hero перетворено на модульний автоматичний слайдер із швидким переходом справа наліво; додано варіант про встановлення сонячних електростанцій із CTA «Залишити заявку» та «Розрахувати вартість».
- **Файли:** src/components/sections/home/hero.tsx, src/components/sections/home/hero-content-slider.tsx, src/components/sections/home/hero-slides.ts, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** нові варіанти додаються в масив `heroSlides`; автоперемикання вимкнене для `prefers-reduced-motion`.

## 2026-11-05 — Ширші CTA-кнопки hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** до `Button` додано модульний розмір `wide`; обидві CTA-кнопки hero стали трохи ширшими.
- **Файли:** src/components/ui/button.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** інші кнопки зберігають розмір `default`.

## 2026-11-05 — Більше простору в hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** збільшено вертикальний ритм між елементами контентного блоку hero.
- **Файли:** src/components/sections/home/hero.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** зміна ізольована в модулі hero та не впливає на спільні компоненти.

## 2026-11-05 — Декоративний елемент Label
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** до спільного компонента `Label` додано маленький декоративний білий круг перед текстом.
- **Файли:** src/components/ui/label.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** елемент автоматично відображається в усіх лейблах секцій.

## 2026-11-05 — Відступ опису hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** збільшено відступ між заголовком і описом у композиції hero.
- **Файли:** src/components/sections/home/hero.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** базовий компонент `Description` лишається незалежним від конкретної секції.

## 2026-11-05 — Модульний line-height заголовків
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** line-height перенесено в проп `lineHeight` компонента `Heading`; hero використовує варіант `compact`.
- **Файли:** src/components/ui/heading.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** налаштування типографіки заголовків виконувати через API `Heading`, а не локальні utility-класи.

## 2026-11-05 — Щільніший заголовок hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** для заголовка hero встановлено менший міжрядковий інтервал через `leading-none`.
- **Файли:** src/components/sections/home/hero.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** базова типографіка спільного `Heading` не змінюється.

## 2026-11-05 — Відступ перед CTA hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** збільшено верхній відступ перед групою CTA-кнопок hero.
- **Файли:** src/components/sections/home/hero.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** кнопки чіткіше відокремлені від опису.

## 2026-11-05 — Hover-анімація CTA-кнопок
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** `Button` трохи підіймається при hover, а її іконка додатково рухається вгору-праворуч.
- **Файли:** src/components/ui/button.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** анімація автоматично доступна всім кнопкам з опційною іконкою.

## 2026-11-05 — Мінімальний blur вторинної кнопки
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** до прозорого варіанта `Button` додано легкий `backdrop-blur-sm`.
- **Файли:** src/components/ui/button.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** ефект застосовується до всіх вторинних CTA-кнопок.

## 2026-11-05 — Іконки CTA hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** додано `lucide-react`; CTA-кнопки hero отримали іконку `ArrowUpRight`, а `Button` — опційний проп `icon`.
- **Файли:** package.json, package-lock.json, src/components/ui/button.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** інші кнопки можуть передавати власну Lucide-іконку через проп `icon`.

## 2026-11-05 — CTA-кнопки hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** під описом hero додано CTA «Підібрати рішення» та «Сонячні станції»; стилі винесено в повторно використовуваний компонент `Button`.
- **Файли:** src/components/ui/button.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** CTA ведуть на майбутні секції `#contact` і `#solar-stations`.

## 2026-11-05 — Опис послуг у hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** під заголовком hero додано опис послуг із сонячних електростанцій, панелей і резервного живлення; текст винесено в компонент `Description`.
- **Файли:** src/components/ui/description.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** опис містить ключові послуги для SEO та готовий для використання в інших секціях.

## 2026-11-05 — Спільний компонент Heading
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** заголовок hero винесено в повторно використовуваний компонент `Heading` із вибором семантичного рівня через `as`.
- **Файли:** src/components/ui/heading.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** нові заголовки створювати через `Heading`, передаючи коректний HTML-рівень.

## 2026-11-05 — Заголовок hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** додано видимий `h1` «Комплексні енергетичні рішення» під лейблом hero.
- **Файли:** src/components/sections/home/hero.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** заголовок адаптивно масштабується від мобільних до desktop-екранів.

## 2026-11-05 — Канонічний синтаксис Tailwind
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** додано правило використовувати стандартні актуальні utility-класи Tailwind; `max-w-[1440px]` замінено на канонічний `max-w-360`.
- **Файли:** AGENTS.md, src/components/layout/container.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** у разі наявності стандартного utility-класу не використовувати довільне значення.

## 2026-11-05 — Правило модульної розробки
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** до правил і контексту проєкту додано вимогу модульної архітектури для секцій, UI та layout-компонентів.
- **Файли:** AGENTS.md, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** новий функціонал створювати в ізольованих модулях із можливістю повторного використання.

## 2026-11-05 — Модуль hero-секції
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** hero винесено в окремий модуль, а `page.tsx` залишено для композиції секцій головної сторінки.
- **Файли:** src/components/sections/home/hero.tsx, src/app/page.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** наступні секції головної сторінки додаються окремими модулями поруч із hero.

## 2026-11-05 — Спільний компонент Label
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** типографіку лейбла винесено в повторно використовуваний компонент `Label` і застосовано в hero.
- **Файли:** src/components/ui/label.tsx, src/app/page.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** використовувати `Label` у наступних секціях для узгодженого стилю.

## 2026-11-05 — Типографіка лейбла hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** зменшено розмір лейбла та встановлено колір `white/85`.
- **Файли:** src/app/page.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** на екранах від `sm` лейбл збільшується до `text-sm`.

## 2026-11-05 — Шрифт Montserrat
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** Montserrat застосовано глобально через оптимізований `next/font/google` з підтримкою кирилиці.
- **Файли:** src/app/layout.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** усі компоненти успадковують Montserrat без окремих font-класів.

## 2026-11-05 — Спрощений лейбл hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** лейбл hero приведено до uppercase-тексту з кольором `white/70` без фону та рамки.
- **Файли:** src/app/page.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** лейбл готовий до композиції з наступним заголовком.

## 2026-11-05 — Лейбл у hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** додано лейбл «Твоя енергетична незалежність» у лівій контентній зоні hero.
- **Файли:** src/app/page.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** лейбл підготовлений для доповнення заголовком і CTA.

## 2026-11-05 — Правило mobile-first верстки
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** до `AGENTS.md` додано обов’язковий mobile-first підхід до верстки.
- **Файли:** AGENTS.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** базові стилі створюються для малих екранів, responsive-правила — для більших.

## 2026-11-05 — Спільний контейнер секцій
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** створено повторно використовуваний `Container` з максимальною шириною `1440px`, центруванням і адаптивними боковими відступами; підключено до hero.
- **Файли:** src/components/layout/container.tsx, src/app/page.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** використовувати `Container` для внутрішнього контенту кожної наступної секції.

## 2026-11-05 — Лінійний градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** радіальний градієнт замінено двома лінійними шарами: коротким затемненням зліва та легким тонуванням знизу.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** права частина фото повністю звільнена від основного градієнта.

## 2026-11-05 — Новий градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** горизонтальну заливку замінено на радіальне затемнення від лівого краю з легким вертикальним тонуванням.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** ліва зона зберігає контраст під текст, а права частина фото має природніші кольори.

## 2026-11-05 — Плавніший темний градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** посилено затемнення hero та додано більше проміжних точок для плавнішого переходу.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** права частина градієнта залишається прозорою для збереження фото.

## 2026-11-05 — Темніший градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** збільшено непрозорість градієнта hero для глибшого затемнення зліва та посилення контрасту.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** плавний перехід до прозорого правого краю збережено.

## 2026-11-05 — Тінь у тон градієнта hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** посилено синьо-графітовий відтінок тіні до кольору градієнта `#000217`.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** тінь тепер візуально продовжує палітру hero.

## 2026-11-05 — Коректна тінь hero-секції
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** замінено `drop-shadow` на `box-shadow` контейнера hero; секція знову обрізає свій вміст по закруглених кутах.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** тінь тепер походить від меж hero-секції та лягає на наступну секцію.

## 2026-11-05 — Закруглення та тінь hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** додано нижнє закруглення hero на `50px` і м’яку тінь вниз для візуального відділення від наступної секції.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** обрізання зображення винесено на media-шар, щоб тінь залишалась видимою.

## 2026-11-05 — Світліший градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** зменшено непрозорість градієнта зліва, щоб краще зберегти видимість hero-зображення.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** градієнт все ще забезпечує контраст для майбутнього тексту.

## 2026-11-05 — Правило використання Tailwind
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** до `AGENTS.md` додано вимогу максимально використовувати Tailwind CSS і обмежувати власний CSS специфічними випадками.
- **Файли:** AGENTS.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** правило застосовується до всіх наступних UI-змін.

## 2026-11-05 — Плавніший градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** розширено градієнт hero та додано проміжні точки прозорості для м’якшого переходу.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** затемнення зліва зберігає контраст для майбутнього тексту.

## 2026-11-05 — Градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** додано горизонтальний градієнт `#000217` поверх hero-зображення, темніший зліва для майбутнього тексту.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** текстовий контент hero буде додано окремо.

## 2026-11-05 — Структура зображень hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** переміщено responsive-зображення hero до `public/images/home/hero` та оновлено шляхи в компоненті.
- **Файли:** public/images/home/hero/*, src/app/page.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** для нових сторінок і секцій використовувати аналогічну структуру каталогів.

## 2026-11-05 — Responsive hero-секція
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** додано hero з responsive `<picture>` та локальними зображеннями; висота `100svh` для компактних екранів і `75vh` для великих desktop-дисплеїв.
- **Файли:** src/app/page.tsx, src/app/globals.css, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** контент і UI-елементи hero можна додати поверх зображення.

## 2026-11-05 — Правила чистого коду та SEO/GEO
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** до `AGENTS.md` додано вимогу видаляти невикористовувані файли й код та розробляти функціонал з урахуванням SEO і GEO.
- **Файли:** AGENTS.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** правила застосовуються Claude Code і Codex у наступних задачах.

## 2026-11-05 — Каталог зображень
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: змерджено в develop)
- **Що зроблено:** створено каталог `public/images` для статичних зображень сайту.
- **Файли:** public/images/.gitkeep, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** каталог готовий для додавання зображень секцій сайту.

## 2026-11-05 — Очищення стартового шаблону
- **Агент:** Codex
- **Гілка:** chore/remove-template-files (статус: змерджено в develop)
- **Що зроблено:** прибрано демонстраційний вміст і стилі `create-next-app`, шаблонні SVG та Google-шрифти; налаштовано нейтральні metadata і локаль `uk`.
- **Файли:** src/app/layout.tsx, src/app/page.tsx, src/app/globals.css, public/*.svg, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** каркас готовий для визначення структури та дизайну сайту.

## 2026-11-05 — Налаштування файлів для AI-агентів
- **Агент:** Claude Code
- **Гілка:** feature/ai-agents-setup (змерджено в develop)
- **Що зроблено:** доповнено `AGENTS.md` спільними правилами (workflow, синхронізація, git); створено `CLAUDE.md` (імпортує AGENTS.md і docs/ai); створено `docs/ai/CONTEXT.md` і цей журнал.
- **Файли:** AGENTS.md, CLAUDE.md, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** визначити призначення сайту.

## 2026-11-05 — Ініціалізація git-гілок
- **Агент:** Claude Code
- **Гілка:** — 
- **Що зроблено:** `master` перейменовано на `main`, створено `develop`. Remote не підключений.

## 2026-11-05 — Початковий шаблон
- **Агент:** власник
- **Що зроблено:** проєкт створено через create-next-app (коміт 6f190e4).
