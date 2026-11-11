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
