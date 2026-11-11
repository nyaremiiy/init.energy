# Контекст проєкту init.energy

> Стан проєкту на зараз. Оновлюй, коли змінюється архітектура, стек, структура або приймається важливе рішення.

## Що це

init.energy — вебпроєкт. Призначення та функціонал ще не визначені (уточнюється з власником).

## Поточний стан

- `next.config.ts` дозволяє доступ до dev-сервера з `192.168.0.24` через `allowedDevOrigins`.
- Каркас на Next.js 16.4.5, React 19.3, TypeScript, Tailwind CSS v4, Lucide React для іконок і Motion для анімацій.
- Production-деплой запускається на сервері з кореня репозиторію через `./deploy.sh`: скрипт безпечно оновлює `main` лише fast-forward, запускає `npm ci` і `npm run build`, а потім перезапускає systemd-юнит `init.energy`. Назву юніта й гілку можна перевизначити змінними `SERVICE_NAME` та `BRANCH`.
- Header поверх hero з двох смуг: контакти/мови зверху (lg+), логотип/меню/CTA знизу; на мобільних — бургер-меню.
- Реалізовано responsive hero-секцію з локальними AVIF/WebP-зображеннями.
- На головній після блоку довіри є секція «Реалізовані проєкти»: дані з `src/content/projects.ts`, повторно використовувана `ProjectCard`, фільтри-посилання на запланований `/proekty/` та перелінковка на обладнання зі `products.ts`.
- Секція «Що вам потрібно живити?» використовує `SegmentCard` у режимі `showcase`: головна ємність і рядки рекомендацій обчислюються з `src/content/solutions.ts` та `products.ts`; сегментні CTA ведуть на заплановані `/rezervne-zhyvlennya/dlya-kvartyry/`, `/dlya-budynku/`, `/dlya-biznesu/`, смуга СЕС — на `/cec/`. Сторінки резервного живлення ще не створені.
- Перед заявкою — секція «Калькулятор» (`calculator-section.tsx`, Panel `sky`): клієнтський `QuickCalculator` (`src/components/calculator/`), дані в `src/content/calculator.ts` (області з `specificYield`, стандартні потужності СЕС, діапазони споживання, частка критичного навантаження, DoD, кандидати накопичувачів; квартира — SVIT 600 → SVIT HOME → SVIT PLUS 5000 ×n від мережі), чисті формули в `src/lib/calculator.ts` з тестами `npm test` (`node --test`, без залежностей). Кнопка «Отримати точний розрахунок» передає параметри у форму заявки через подію (`src/lib/calculator-bridge.ts`) → приховане поле `calculatorData`.
- Окрема сторінка `/kalkulyator/okupnist-ses/` і `/en/kalkulyator/okupnist-ses/` (макет власника 2026-11-11) — статична, без параметрів в URL. Порядок: темний hero (`sections/ses-payback/ses-payback-hero.tsx`: крихти, H1, вкладки «Сонячна станція й окупність» / «Автономність» = мета `both` / `backup`, 4 плитки фактів), у низ якого заходить калькулятор (`-mt-20 lg:-mt-56`); «Скільки енергії дасть станція по місяцях» (графік, надлишок/дефіцит); темна панель «Як ми рахуємо» з формулами, джерелами й прикладом розрахунку для значень за замовчуванням (GEO); «Типові СЕС за потужністю» (`typicalPlans` у `content/ses-calculator.ts`, потужність рахує сам калькулятор); FAQ; стандартна `LeadSection`. Стан калькулятора — клієнтський контекст `components/calculator/ses-payback-state.tsx`, спільний для форми, результату, вкладок і графіка. Поля обох калькуляторів (головна й цей) — `components/calculator/calculator-fields.tsx` (`RangeField`, `Group`, `SelectField`, `NumberField`), частини темної картки результату — `calculator-result-parts.tsx`. Дані: `src/content/{insolation,tariffs,appliances,ses-calculator}.ts`, формули — `src/lib/calc/ses-core.ts` (тести `ses.test.mjs`). JSON-LD: BreadcrumbList, WebApplication, FAQPage; прев’ю — JPEG `public/images/og/ses-calculator.jpg`.
- Між калькулятором і заявкою — секція FAQ (`faq-section.tsx`): дані в `src/content/faq.ts` (uk/en, `topic`, `pages` для повторного використання на сторінках СЕС, резервного живлення й продуктів, `faqForPage`), клієнтський `FaqAccordion` (фільтр тем — `chipClasses`, акордеон з `h3 > button[aria-expanded]` і `role=region`, кілька відкритих, анімація `grid-rows 0fr→1fr`). JSON-LD FAQPage — `components/seo/JsonLd` + `lib/seo/schema.ts` з тих самих даних. Секції з `sticky` всередині — `overflow-clip`, не `overflow-hidden` (інакше sticky не працює).
- Остання секція головної — «Заявка на розрахунок»: Server Component `LeadSection`, клієнтський `LeadForm`, спільна клієнтсько-серверна схема валідації та Server Action із honeypot. Телефон приймає локальні й міжнародні формати (7–15 цифр, необов'язковий `+` і типові розділювачі), після валідації нормалізується. До підключення CRM заявки з tracking-полями зберігаються сервером у приватний `storage/leads.jsonl` (шлях можна змінити через `LEAD_STORAGE_FILE`; файл виключений з Git).
- Фото hero має паралакс при прокрутці (Motion `useScroll`, 30%, вимкнено при reduced motion).
- Hero містить модульний автоматичний слайдер контенту на Motion із переходом від правого краю viewport ліворуч і overlay crossfade медіа-шаром.
- Медіа hero тримає максимум два різні фото лише під час crossfade та використовує responsive AVIF-зображення.
- Hero сторінок СЕС (`/cec/` і `/en/cec/`) використовує окремі responsive-набори з `public/images/cec/hero/` для кожного з трьох слайдів; медіа головної залишаються в `public/images/home/hero/`.

- Сторінки продуктів використовують спільний Server Component `src/components/pages/product-page.tsx` і тонкі маршрути `src/app/(uk)/[product]/page.tsx` та `src/app/en/[product]/page.tsx` (`dynamicParams = false`). Наразі доступні `/svit-600/`, `/svit-plus-5000/`, `/svit-home/`, `/svit-plus-16000/`, `/bess/` та їхні англійські версії. Дані сторінок типізовані в `src/content/product-pages.ts`, а повний контент продуктів зберігається в `src/content/products.ts`. Шаблон підтримує hero, sticky-навігацію, переваги, portable-блок портів і заряджання, картки автономності, звичайні або згруповані характеристики, композицію комплекту, будову батареї, масштабування, BESS-конфігурації, секторні застосування, reusable `HowToSteps`, FAQ, пов'язані рішення та заявку. Процес BESS формує HowTo JSON-LD; Product schema використовує LITHIUMVALLEY як бренд і INIT ENERGY як seller/provider. Непідтверджені поля показуються лише dev-notice у specs і відсутні в production. Поки `/svit/` не створена, крихта «Продукти SVIT» веде на секцію накопичувачів головної.
- **Сторінка «в розробці» і 404:** `src/proxy.ts` переписує адреси зі списку `plannedPaths` (`src/content/routes.ts`, також їхні `/en/…`) на статичну сторінку `/v-rozrobtsi/` (`/en/v-rozrobtsi/`) зі статусом 404 і noindex; в адресному рядку лишається початкова URL. Решту невідомих адрес обробляє статичний `src/app/not-found.tsx` («Сторінку не знайдено», українською). Не читати `headers()`/`cookies()` у `not-found.tsx` чи кореневому layout: це робить динамічними всі сторінки сайту. Коли сторінку створено, її шлях прибираємо з `plannedPaths`. Сторінки сегментів СЕС — `routes.services.house` / `business` (`/cec/dlya-domu/`, `/cec/dlya-biznesu/`), ще не створені.
- **Hero сторінок — тільки `PageHero`** (`src/components/sections/PageHero.tsx`, стиль головної); змінюються лише media, eyebrow, title, lead, CTA. Варіанти: `slides` (слайдер головної й `/cec/`) або один набір тексту з `media` (`image` — next/image `fill` + `priority`; `video` — постер як LCP, відео після load і не при reduced motion / saveData; `placeholder`) і `breadcrumbs` (крихти над eyebrow + BreadcrumbList JSON-LD). Текст hero — спільний `HeroCopy` (`sections/hero/`).
- **Нішеві сторінки СЕС** (`/rishennya/{slug}/` — URL як на init.energy, рішення власника 2026-11-11; зараз `/rishennya/ses-dlya-gotelyu/` і `/en/…`): маршрути `app/(uk)/rishennya/[segment]` і `app/en/rishennya/[segment]` (`dynamicParams = false`), шаблон `components/pages/niche-page.tsx`, секції `components/sections/niche/*` (цифри, споживачі, таблиця підбору, резерв, обладнання й етапи), далі спільні проєкти (фільтр сегмента), FAQ (`faq.ts`, `pages: ["ses-hotel"]`, ліва колонка з посиланнями) і заявка (тип «Готель», свій placeholder коментаря). Батьківська `/cec/dlya-biznesu/` ще не створена (сторінка «в розробці»); з `/cec/` на нішу веде посилання в картці «Бізнес». JSON-LD: Service (`serviceType`), FAQPage, BreadcrumbList; прев’ю — статичні JPEG `public/images/og/ses-dlya-gotelyu{,-en}.jpg` (next/og без кириличного шрифту). Калькулятор читає лише `?type=` для вибору сегмента й нічого не пише в URL. Ліва група шапки (десктоп і мобільне меню) — `pageSectionLinks` у `header-data.ts`: головні розділи сторінки з `headerSectionKeys` (`/cec/`, сторінка готелю, калькулятор; підписи з колонки футера), на сторінках продуктів — «Сонячні електростанції» й «Калькулятор окупності СЕС». На десктопі ця група видна з `xl` (1280 px), нижче не вміщається; усі пункти шапки — `whitespace-nowrap`, переносів у шапці не буває. Підкреслення пунктів завжди `decoration-transparent` (крім hover), інакше при зміні активного стану спалахує чорна лінія. Перехід між сторінками — `template.tsx` у мовних розкладках + `PageTransition` (поява `animate-enter`, лише при клієнтській навігації й без reduced motion). Фото hero — `HeroPicture` (`<picture>` з готовими AVIF 750–2560, `fetchPriority=high`), медіа `picture` у `PageHero`; фото готелю — `public/images/cec/rishennya/hotel/`.
- **Заглушки фото — `MediaPlaceholder`:** пунктирна рамка, тони `light` (surface) / `dark`, `fill`, `aspect`, `align`; розмір і радіус як у майбутнього фото, щоб заміна не зсувала верстку.
- **Нумеровані кроки й аргументи** (етапи СЕС, вузли гібридної СЕС, аргументи «Про компанію», процес BESS) починаються з `StepMarker` (`src/components/ui/step-marker.tsx`): номер «01» ліворуч і іконка lucide в круглій рамці праворуч, тон `light`/`dark`.
- **Посилання-пігулки внизу карток сегментів** — лише `SegmentLinks` (`src/components/ui/segment-card.tsx`): ним користуються `SegmentCard` і секторні картки на сторінках продуктів.
- `Panel` обрізає вміст через `overflow-clip` (не `overflow-hidden`) — так усередині панелей працює `sticky`.

## Мови (i18n)

Рішення власника 2026-11-10: українська — на корені домену без префікса (`init.energy/`), англійська — під `/en/`. Кожна реалізована публічна сторінка обов'язково виходить обома мовами з повним EN-текстом, локалізованими metadata, canonical/hreflang і sitemap. Англійські версії є для головної, `/svit-600/`, `/svit-plus-5000/`, `/svit-home/`, `/svit-plus-16000/`, `/bess/` та `/kalkulyator/okupnist-ses/` (`localizedPaths` у `src/i18n/config.ts`). Автоматичних редиректів за IP/мовою немає.

- Маршрути: `src/app/(uk)/` (головна, `[product]`) і `src/app/en/` (головна). Одна коренева розкладка (`<html lang="uk">`); англійський вміст обгорнутий у `<div lang="en" class="contents">`. Header/футер/віджети — `SiteChrome` у мовних розкладках.
- Мова запиту на сервері: `setRequestLocale()` у кожній мовній розкладці й сторінці, далі `getLocale()` / `getMessages()` з `@/i18n/server`. Клієнтські компоненти: `useLocale()` / `useMessages()` з `@/i18n/client` (`LocaleProvider` у `SiteChrome`). Імпорту `messages` з `@/lib/messages` більше немає — там лише `format`.
- Тексти UI — `messages/uk.json` і `messages/en.json` (тип `Messages = typeof uk`, відсутній ключ у en ламає збірку). Дані в `src/content/*` — поля `Localized` (`{ uk, en }`): продукти, рішення, послуги, офіси, блок довіри, проєкти, FAQ, калькулятор, слайди hero (`getHeroSlides(locale)`), меню (`getNavItems(locale)`).
- Числа й одиниці: `formatNumber(value, locale)` / `formatQuantity(q, locale)` — мова обов'язкова (UA кома, EN крапка).
- Посилання на секції головної — `sectionHref(anchor, locale)` (`/#contacts` або `/en/#contacts`); `localizePath(path, locale)` не веде на неіснуючі EN-сторінки.
- SEO: `buildMetadata({ title, description, path, locale })` — canonical на себе, hreflang `uk` (корінь), `en` (/en/) лише для сторінок з англійською версією, `x-default` → українська; Open Graph `uk_UA` / `en_US`. JSON-LD на головній — Organization (адреси, телефони, соцмережі, areaServed UA) і WebSite. `app/sitemap.ts` (з alternates) і `app/robots.ts`. Серверні дії форм отримують приховане поле `locale` і повертають помилки мовою форми.

## Структура

```
src/app/        # App Router: layout.tsx, page.tsx, globals.css
src/components/layout/ # повторно використовувані layout-компоненти
src/components/layout/header/ # header: дані (header-data.ts), верхня й основна смуги, мобільне меню
src/components/layout/footer/ # футер: footer.tsx (Server), footer-columns.tsx (client, pageNav за pathname), newsletter-form.tsx, footer-mark.tsx
src/components/ui/ # повторно використовувані UI-компоненти
src/components/sections/home/ # секції головної сторінки
src/components/sections/      # секції для кількох сторінок (trust-block.tsx — дані через пропси)
src/components/forms/         # інтерактивні форми (LeadForm)
src/content/    # дані сайту: products.ts (productList), projects.ts (projectList), services.ts, company.ts (trust), routes.ts (slug-и, якорі), solutions.ts
src/lib/        # утиліти й спільні схеми валідації (lead-form-schema.ts)
src/app/actions/ # Server Actions форм
messages/       # тексти інтерфейсу (uk.json; en.json — з появою i18n)
public/         # статичні файли
public/images/  # зображення сайту
public/images/home/hero/ # responsive-зображення hero головної сторінки
public/images/products/  # фото продуктів, 4:3, ≥1200×900, назва = slug (svit-600.avif …)
docs/ai/        # спільний контекст для AI-агентів (цей файл + CHANGELOG)
AGENTS.md       # правила для всіх агентів (Codex)
CLAUDE.md       # точка входу для Claude Code (імпортує AGENTS.md)
.claude/        # спільні налаштування Claude Code (settings.json: маркетплейси й плагіни)
```

## Структура сайту (як на init.energy)

Рішення власника (2026-11-06): структура сторінок повторює поточний https://init.energy, URL зберігаються один в один (`trailingSlash: true`), щоб не втратити індексацію.

```
/                                 головна (лендинг із секціями-якорями)
/cec/                             СЕС під ключ (/ses/ → 308 → /cec/, next.config.ts)
/rishennya/ses-dlya-gotelyu/      СЕС для готелю та відпочинкового комплексу
/rishennya/[segment]/             нішеві сторінки (ses-dlya-gotelyu, …) — через rishennya/[segment], дані в content/solutions.ts (`solutionPages`) з полем parent: "dlya-biznesu"
/svit-600/                        SVIT 600
/svit-plus-5000/                  SVIT PLUS 5000
/svit-plus-16000/                 SVIT PLUS 16000
/svit-home/                       SVIT HOME
/bess/                            LITHIUMVALLEY
/svit/                            каталог усіх накопичувачів SVIT (заплановано власником 2026-11-06, ще не створено)
/pro-nas/                         про компанію (заплановано власником 2026-11-06, ще не створено)
/polityka-konfidentsiinosti/      політика конфіденційності (заплановано, ще не створено)
/en/...                           англійські дзеркала всіх сторінок (з появою i18n)
```

Секції головної на init.energy (порядок): hero → про нас (#about-us) → відео «Чому обирають» → переваги → консультація → наші рішення (системи зберігання) → продукти (#products) → «Від обладнання — до результату» → проєкти (#projects) → «Будуємо. Запускаємо. Підтримуємо.» → форма контактів (#contacts) → footer. Більшість CTA веде на #contacts.

Нових сторінок поза цим списком не створюємо без рішення власника. Якорі секцій головної — `anchors` у `src/content/routes.ts` (посилання `routes.sections.*` = `/#…`); жодних хардкоджених `#…` у компонентах.

## Візуальний стиль головної

Затверджено власником 2026-11-06, оновлено того ж дня («повернути цілісність стилю»). Нові секції робимо за цими правилами:

- **Відступи — лише токени `@theme` (рішення власника 2026-11-09), mobile / lg:** між секціями `pt-section-sm lg:pt-section` (64 / 128 px; від вмісту білої секції або краю панелі), усередині панелі зверху й знизу `py-panel-y-sm lg:py-panel-y` (48 / 96 px; футер — лише `pt-*`), шапка секції → вміст `gap-section-head-sm lg:gap-section-head` (32 / 56 px), усередині кожної картки й картки-форми `p-card-sm lg:p-card` (24 / 40 px, як у калькулятора й форми), між картками `gap-4`. Нижній відступ сторінки один раз задає `<main className="pb-section-sm lg:pb-section">`. Власних `p-6`/`p-10`/`py-14` для структури не пишемо.
- **Фон секцій:** білий (`bg-white`). Темна секція — велика панель `bg-ink rounded-panel` (`--radius-panel` = 50 px, як низ hero) з полями `px-2 sm:px-4` від країв екрана, без карток (зараз — `TrustBlock`).
- **Тіні:** за замовчуванням немає — розділяємо фоном. Виняток — один токен `shadow-soft` (globals.css), легка тінь лише під hero і випадаючим мега-меню.
- **Картки:** `rounded-3xl`, `p-card-sm lg:p-card`, світлі `bg-surface`. **Темні картки — лише в «Що вам потрібно живити?»:** «Бізнес» (`bg-ink`) і «Приватний будинок» (`bg-navy`, світліший синій); рішення власника 2026-11-09; темна панель-секція до цього ліміту не входить.
- **Шапка секції:** лише `SectionHeader` (один варіант розкладки): лейбл, H2, лід ліворуч, опційний `ArrowLink` праворуч (на мобільному — під лідом). Варіант `split` видалено (2026-11-09).
- **Типографіка:** заголовки й лейбли Montserrat (`font-heading`), текст Inter; великі індекси `01/02/03` — Montserrat light. Розміри — лише токени з globals.css, mobile-first (рішення власника 2026-11-09): H2 `text-h2-sm sm:text-h2-md lg:text-h2` (через `Heading`), заголовок картки `text-h3-sm sm:text-h3` (20 → 24 px, `Heading size="h3"`), H1 hero і назва продукту у фокусі `text-hero-sm md:text-hero-md lg:text-hero` (32 → 48 → 60 px), значення характеристик і результатів `text-stat-sm sm:text-stat` (20 → 24 px, без переносу), описи в картках `text-base` (на мобільному допустимо `text-sm` для пігулок-посилань), лід `text-base sm:text-lg`. Приглушений текст `ink/70` на світлому, `white/75` на темному. Нові розміри — лише через токени, без `text-2xl/4xl` у компонентах.
- **Сітки:** кожна `grid` має базову `grid-cols-1` (або інші колонки без префікса), а не лише `lg:grid-cols-*` — інакше колонка розтягується під найширший рядок і на мобільному виходить за екран.
- **Посилання в картках сегментів:** заокруглені кнопки-овали (`rounded-full`, рамка `ink/20`, на темному `white/25`); перше посилання картки — заповнена світла пігулка (`bg-white`, текст `ink`), у стовпчик із відступом `gap-2`, стрілка `ArrowUpRight` праворуч; у картках продуктів — рядки з лінією зверху (без пігулок).
- **Секція «Накопичувачі»** (рішення власника 2026-11-10, світлий варіант): панель `sky`, світла шапка, вкладки-пігулки `chipClasses({ tone: "tint" })` (неактивні білі, активна ink; на мобільному переносяться на наступний рядок без горизонтального скролу), панель продукту — біла картка 5/7: ліворуч `CapacityCard` (`src/components/products/`: високе фото продукту на весь фон із двошаровим темним лінійним градієнтом і легким zoom на hover, поверх — mono-підпис `chemistryLabel`, велике число ємності та логарифмічна шкала лінійки 0,87–1 044 кВт·год; без графічних блоків комірок чи модулів; без фото лишається світлий gradient fallback `.glow-accent`; шкала має стримані hover/focus-реакції з `motion-safe`), праворуч тег сегмента, назва, `focusDescription`, 3 інтерактивні `focusSpecs`, кнопки `dark` і `outline-light`. Логіка вкладок (автоперемикання 6 с, паузи, клавіатура, ARIA, SSR усіх панелей) без змін.
- **Ряди карток:** на `lg` статична сітка 3 колонки; на mobile/md — горизонтальний scroll-snap без кнопок (картки `w-5/6` / `md:w-1/2`, scrollbar прихований `.scrollbar-none`).
- **Смуга-посилання:** `bg-surface`, `rounded-3xl`, на всю ширину, стрілка в круглій кнопці `size-12`, при hover заливається `ink`. Не дублюємо посилання, яке вже є в шапці іншої секції.
- **Таблиці:** лише горизонтальні лінії `line`, без фону; без горизонтального скролу — на мобільному кожен рядок стає блоком «підпис — значення» (підписи `aria-hidden`, `thead` лишається для скрінрідерів як `sr-only`), з `md` — звичайна таблиця; явні ARIA-ролі (`table/row/cell`), бо зміна `display` ламає семантику в Safari. Виняток (рішення власника 2026-11-11): таблиця підбору потужності на нішевих сторінках СЕС — звичайна `<table>` з горизонтальним скролом усередині свого блоку на мобільному.
- **Рух:** hover — легкий підйом і зсув стрілки; поява при скролі через `Reveal` зі stagger; усе з `motion-safe` / prefers-reduced-motion.
- **Факти про продукти й компанію:** лише з init.energy (характеристики й тексти продуктів — зі сторінок /svit-600/, /svit-home/, /svit-plus-5000/, /svit-plus-16000/, /bess/; суперечливе на сторінці не публікуємо, напр. тип батареї SVIT 600) (цитата-джерело поруч у `src/content/*.ts`). LITHIUMVALLEY — партнерський бренд (INIT ENERGY — офіційний представник та інсталятор), не «власне виробництво». Для SVIT HOME власник 2026-11-10 підтвердив: комплект підбирають і збирають на виробництві INIT ENERGY, а накопичувач SVIT PLUS 5000 у його складі є власним виробом. Ці твердження не узагальнюємо на всю лінійку SVIT без окремого підтвердження. Склад комплекту SVIT HOME (дані власника 2026-11-10): гібридний інвертор VICTOR NM-ECO-6.2 kW PLUS — 6,2 кВт (6200 Вт), 48 В, контролер заряду 120 А, режим UPS, підтримка сонячних панелей; батарея SVIT PLUS 5000 LiFePO₄ — 48 В, 100 Аг, 5,12 кВт·год, понад 10 000 циклів. Цільові сегменти: квартира, приватний і заміський будинок, об'єкти соціальної інфраструктури, ОСББ, підприємства. Ті самі дані оновлено для окремої батареї SVIT PLUS 5000 (48 В, 100 Аг, понад 10 000 циклів). Строк служби в роках («≈ 15 років») не публікуємо, доки власник його не підтвердить.
- **Зображення:** `next/image` віддає AVIF (потім WebP); якість за замовчуванням 75, для великих фото на всю ширину — `quality={90}` (дозволені значення — `images.qualities` у next.config.ts).
- **Темні фони (панель «Про компанію», header, мега-меню, мобільне меню, футер):** `.bg-ink-glow` (globals.css) — основа `ink` з м’яким синім (`navy`) світінням з верхніх кутів, низ чистий `ink` під фото.
- **Водяні знаки секцій:** `SectionWatermark` — велике вертикальне слово `text-display` біля краю (`ink/5`, на темному `white/5`), з `md`; сторони чергуються: SOLAR (ліво), STORAGE (право), ENERGY (ліво, темна, `align="upper"` — вище фото), PROJECTS (право), SYSTEM (ліво), CONTACT (право). Секція — `relative overflow-hidden`, контент — `relative`.
- **Переходи фото → темний фон:** клас `.fade-from-ink` (eased-градієнт у globals.css), не лінійний `bg-linear-to-*` з 2–3 точками.
- **Числа й телефони:** числа лише через `formatQuantity`/`formatNumber`, українські телефони для показу — через `formatPhone` (`src/lib/format.ts`); у `tel:` зберігається E.164. Одиниці — у `messages`.
- **Бічні відступи на мобільному — вміст на 18 px від краю скрізь** (рішення власника 2026-11-09, як у секції калькулятора): `Container` дає `px-4.5`; усередині панелі (hero, калькулятор, накопичувачі, «Про компанію», футер) — `<Container inPanel>` (`px-2.5` + 8 px поля панелі = 18 px); мобільне меню `px-4.5`. З `sm` — `px-8`, з `lg` — `px-10`. Горизонтальних скролів рядів (scroll-snap) на мобільному не робимо — пігулки переносяться (`flex-wrap`).
- **Поля вводу — один стиль на весь сайт:** класи лише з `inputClasses({ tone, invalid, multiline })` (`src/components/ui/input-styles.ts`); `tone="light"` на світлому фоні, `"dark"` на темному (футер). Власних класів для `input`/`textarea` не пишемо.
- **Радіо-пігулки:** лише `PillRadio` (`src/components/ui/pill-radio.tsx`) — форма заявки, калькулятор.
- **Повзунки:** нативний `input type="range"` з класом `.range-input` (globals.css), заповнення через `--fill`, `aria-valuetext` з одиницями.
- **Форми:** поля `rounded-field` (14 px), `h-14`, рамка `line` → hover `ink/40` → focus-visible рамка `ink` + м'яке кільце `ring-3 ring-ink/10` (без outline з відступом); помилка — рамка `ink`, `aria-invalid`, `aria-describedby` на завжди присутній `<p>` з `min-h-4 text-caption` впритул під полем (без стрибків верстки); помилка поля зникає при редагуванні, після валідації фокус на першому полі з помилкою; `autocomplete="off"` (без історії введених значень); під час надсилання — `fieldset disabled`; переходи 150–200 ms `ease-tech`, transform лише з `motion-safe:`.
- **Футер:** спільний у `app/layout.tsx`. Колонка «На цій сторінці» береться з `pageNavigation[pathname]` у `src/content/navigation.ts` — додавай туди якорі нової сторінки (секціям — `id` з `anchors` і `scroll-mt-24`); немає запису — колонки немає. «Розділи сайту» — `siteSections` (лише сторінки зі структури сайту).
- **Аналітика:** події лише через `trackEvent` (`src/lib/analytics.ts`), який нічого не надсилає без згоди на cookie (`window.initConsent.analytics`); банера згоди ще немає.
- **Hover на темному фоні:** елементи світлішають (приглушений `white/75–80` → `white`, рамка → `white/60`, за потреби фон `white/8`); `opacity-*` для hover на темному не використовуємо — воно затемнює.
- **Логотип:** `Logo` задаємо лише шириною + `h-auto shrink-0` (header `w-14 lg:w-18`, футер `w-18`); висоту не задаємо — інакше SVG сплющується.
- **Лейбли в картках:** пігулка `CardLabel` (`src/components/ui/card-label.tsx`) з іконкою сегмента з `segmentIcons` (`src/content/segments.ts`, одна іконка на сегмент скрізь) — рамка, звичайний регістр, `text-sm font-medium`, як фільтри на сайті; `Eyebrow` лишається для заголовків секцій і футера. Розмір лейблів: `CardLabel` 12 → 14 px, `Eyebrow` 12 → 14 px (`text-eyebrow-sm sm:text-eyebrow`).
- **Пігулки-кнопки** (фільтри проєктів, вкладки накопичувачів, радіо форми заявки й калькулятора): один стиль — `src/components/ui/chip-styles.ts` (`chipBase` / `chipClasses`): висота 40 px / `px-4` на мобільному, 44 px / `px-5` з `sm`, `text-sm font-medium`, рамка; `tone` light на світлому, dark на темному. Не пишемо свої класи для пігулок. Неактивний стан — `disabled: true` (сірий, не клікається): фільтри проєктів, поки проєктів мало.
- **Контраст:** текст ≥ 4.5:1 на всіх фонах.


## Однакові компоненти міняються разом

Коли власник змінює один компонент (картку, кнопку, поле, заголовок, пункт меню тощо), таку саму зміну застосовуємо до всіх подібних місць на сайті, а не лише в одній секції. Перед коммітом шукаємо всі використання компонента або його класів і перевіряємо, що вигляд однаковий скрізь. Якщо таке місце свідомо відрізняється, пишемо про це власнику.

## Гілки

- `main` — стабільна, мерджить тільки власник
- `develop` — інтеграційна
- `feature/*`, `fix/*`, `chore/*` — задачі, від `develop`

## Прийняті рішення

- Агенти: Claude Code і Codex, синхронізуються через `AGENTS.md` + `docs/ai/`.
- GitHub remote `origin`: `https://github.com/nyaremiiy/init.energy.git`. Робочі зміни пушимо лише після lint/build і merge task-гілки в `develop`; `main` не мерджимо без прямої вказівки власника.
- Плагіни Claude Code для SEO/GEO/маркетингу підключені на рівні репо через .claude/settings.json: searchfit-seo (основний), marketing (Anthropic knowledge-work), rampstack-seo. Плагіни з платними MCP вмикати лише з підтвердження власника.
- Усі секції використовують `Container`: максимум `1440px`, центрування та адаптивні горизонтальні відступи.
- Лейбли секцій використовують компонент `Eyebrow` зі спільною mobile-first типографікою та декоративним кругом.
- Заголовки використовують компонент `Heading` із семантичним рівнем через проп `as` і типовими розмірами `h2`/`h3` із токенів `globals.css`.
- Описові тексти секцій використовують компонент `Description` із типографічними варіантами через `size`.
- Головні CTA та submit-кнопки використовують `Button`; підкреслені текстові CTA — `ArrowLink`; круглі дії зі стрілкою — `IconButton`. Компоненти підтримують потрібну семантику посилання/кнопки; локальні дублікати не створюємо. Варіанти `Button`: `primary` (білий, на темному), `secondary` (контур, на темному), `dark` (ink, на світлому — submit форм).
- Повноекранні секції можуть використовувати `ScrollIndicator` для переходу до наступного viewport.
- Шрифти через `next/font/google` і токени `@theme`: основний текст — Inter (`font-sans`), заголовки (`Heading`) і лейбли (`Eyebrow`) — Montserrat (`font-heading`). Типографіка секцій і карток використовує токени `text-h2-*`, `text-h3`, `text-number-*`, `text-eyebrow`.
- Контакти, які використовують контентні секції, зберігаються в `src/content/company.ts`: офіси Львова й Києва, їхні телефони та email. Header поки має власну конфігурацію навігації й контактів у `src/components/layout/header/header-data.ts`.
- Меню header містить SVIT і «Рішення» (мега-меню з URL поточного init.energy); у колонці сонячних рішень є пряме посилання на калькулятор окупності СЕС. Футер показує його в «Розділах сайту» для обох мов. Пункти на секції головної (Про нас, Проєкти, Контакти тощо) додаються в `navItems` (`header-data.ts`) лише тоді, коли відповідна секція створена.
- Кольори задаються токенами `@theme` у globals.css: `ink` (rgb(0 2 23), як overlay hero), `surface` (світлий фон секцій), `line` (лінії), `navy` (rgb(8 18 54), картка 02 «Приватний будинок»); `success` (#15803D, лише іконка успіху в сповіщенні; не для тексту й кнопок); відступи `section-sm`/`section`/`section-head`. Нові кольори й відступи — лише через токени. `accent` (#2E6BFF) і `accent-strong` (#1A3FCC) — акцент: лише індикатори ємності, шкали, графіка — не текст і не кнопки (рішення власника 2026-11-10).
- Великі округлені блоки використовують `Panel` із токенами зовнішнього відступу `panel-sm`/`panel` та радіусів `rounded-panel-sm`/`rounded-panel`. Соцмережі header/footer використовують один `SocialLinks`.
- `Eyebrow` має `tone` (`light`/`dark`), `Description` — `onLight`/`onDark`.
- Дані (продукти, slug-и, рішення) — у `src/content/`, URL будуються через `routes`/`toPath`, не хардкодяться в JSX. Тексти UI — у `messages/`.
- Секції після hero білі й ідуть з однаковим відступом (див. «Візуальний стиль головної»).
- Анімація появи при скролі — клієнтський `Reveal` (`src/components/ui/reveal.tsx`, Motion `whileInView`, один раз, вимикається при prefers-reduced-motion). Секції лишаються Server Components; заголовки, картки, інтерактивні блоки, форми, списки даних і футер відкриваються окремими композиційними групами, а повторювані елементи — зі стриманим stagger `delay`. Дрібні текстові вузли не анімуємо окремо, щоб не перевантажувати сторінку й клієнтський JS.
- Кожна секція головної сторінки є окремим модулем у `src/components/sections/home/`.
- Контентні варіанти hero та їхні зображення зберігаються в `hero-slides.ts`; анімація розділена між `hero-content-slider.tsx`, `hero-media-slider.tsx` і `hero-slider.tsx`.
- Hero-заголовки зберігаються двома лініями в даних слайда для послідовної дворядкової композиції.
- Проєкт розробляється модульно: секції, UI та layout-компоненти мають окремі відповідальні модулі.
- У стилізації застосовується актуальний канонічний синтаксис Tailwind CSS; стандартні utility-класи мають пріоритет над довільними значеннями.

## Відкриті питання / TODO

- Визначити призначення сайту та структуру сторінок.
