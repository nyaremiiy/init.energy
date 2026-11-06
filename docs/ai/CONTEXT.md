# Контекст проєкту init.energy

> Стан проєкту на зараз. Оновлюй, коли змінюється архітектура, стек, структура або приймається важливе рішення.

## Що це

init.energy — вебпроєкт. Призначення та функціонал ще не визначені (уточнюється з власником).

## Поточний стан

- Каркас на Next.js 16.4.5, React 19.3, TypeScript, Tailwind CSS v4, Lucide React для іконок і Motion для анімацій.
- Header поверх hero з двох смуг: контакти/мови зверху (lg+), логотип/меню/CTA знизу; на мобільних — бургер-меню.
- Реалізовано responsive hero-секцію з локальними AVIF/WebP-зображеннями.
- Hero містить модульний автоматичний слайдер контенту на Motion із переходом від правого краю viewport ліворуч і overlay crossfade медіа-шаром.
- Медіа hero тримає максимум два різні фото лише під час crossfade та використовує responsive AVIF-зображення.

## Структура

```
src/app/        # App Router: layout.tsx, page.tsx, globals.css
src/components/layout/ # повторно використовувані layout-компоненти
src/components/layout/header/ # header: дані (header-data.ts), верхня й основна смуги, мобільне меню
src/components/ui/ # повторно використовувані UI-компоненти
src/components/sections/home/ # секції головної сторінки
src/content/    # дані сайту: products.ts (productList), services.ts, routes.ts (slug-и, якорі), solutions.ts
src/lib/        # утиліти (messages.ts — тимчасовий завантажувач текстів UI)
messages/       # тексти інтерфейсу (uk.json; en.json — з появою i18n)
public/         # статичні файли
public/images/  # зображення сайту
public/images/home/hero/ # responsive-зображення hero головної сторінки
docs/ai/        # спільний контекст для AI-агентів (цей файл + CHANGELOG)
AGENTS.md       # правила для всіх агентів (Codex)
CLAUDE.md       # точка входу для Claude Code (імпортує AGENTS.md)
.claude/        # спільні налаштування Claude Code (settings.json: маркетплейси й плагіни)
```

## Структура сайту (як на init.energy)

Рішення власника (2026-11-06): структура сторінок повторює поточний https://init.energy, URL зберігаються один в один (``trailingSlash: true``), щоб не втратити індексацію.

```
/                                 головна (лендинг із секціями-якорями)
/cec/                             СЕС під ключ
/rishennya/ses-dlya-gotelyu/      СЕС для готелю та відпочинкового комплексу
/svit-600/                        SVIT 600
/svit-plus-5000/                  SVIT PLUS 5000
/svit-plus-16000/                 SVIT PLUS 16000
/svit-home/                       SVIT HOME
/bess/                            LITHIUMVALLEY
/en/...                           англійські дзеркала всіх сторінок (з появою i18n)
```

Секції головної на init.energy (порядок): hero → про нас (#about-us) → відео «Чому обирають» → переваги → консультація → наші рішення (системи зберігання) → продукти (#products) → «Від обладнання — до результату» → проєкти (#projects) → «Будуємо. Запускаємо. Підтримуємо.» → форма контактів (#contacts) → footer. Більшість CTA веде на #contacts.

Нових сторінок поза цим списком не створюємо без рішення власника. Якорі секцій головної — `anchors` у `src/content/routes.ts` (посилання `routes.sections.*` = `/#…`); жодних хардкоджених `#…` у компонентах.

## Візуальний стиль (еталон — секція «Що вам потрібно живити?»)

Затверджено власником 2026-11-06. Нові секції робимо в цьому стилі:

- **Фон секцій:** білий (``bg-white``) або темний ``ink``; світлі секції заходять під заокруглений низ hero (``-mt-12``).
- **Картки:** ``rounded-3xl``, ``p-6 lg:p-8``; лише два тони — світла ``bg-surface`` і темна акцентна ``bg-ink``. Без тіней і рамок, розділяємо фоном.
- **Шапка секції:** ``SectionHeader`` — лейбл з крапкою (``Label``, без нумерації), H2 Montserrat semibold, lead ``Description tone="onLight"``, праворуч опційне підкреслене посилання зі стрілкою.
- **Типографіка:** заголовки й лейбли Montserrat (``font-heading``), текст Inter; великі індекси ``01/02/03`` — Montserrat light; приглушений текст ``ink/70`` на світлому, ``white/75`` на темному.
- **Посилання-дії:** pill-кнопки ``Button`` зі стрілкою ``ArrowUpRight``; у групі перша — primary, решта — secondary (як у hero); на світлому ``primaryOnLight``/``secondaryOnLight``, розмір ``compact`` усередині карток.
- **Плашки даних:** pill (``sm:rounded-full``), на світлому білі з рамкою ``line``, на темному ``bg-white/6``.
- **Смуги-посилання:** ``bg-sky``, ``rounded-3xl``, стрілка в круглій кнопці ``size-12`` (як іконки в header), при hover заливається ``ink``.
- **Рух:** hover — легкий підйом ``-translate-y-0.5`` і зсув стрілки; поява при скролі через ``Reveal`` зі stagger; усе з ``motion-safe`` / prefers-reduced-motion.
- **Продуктові картки:** `ProductCard` — медіа 4/3 (`MediaPlaceholder`, поки немає фото), лейбл сегмента, H3 + опис, кругла контурна кнопка `size-12`, `<dl>` характеристик з лініями `line` (на темному `white/16`) притиснутий до низу. Hover картки — `-translate-y-1`.
- **Таблиці:** лише горизонтальні лінії `line`, без фону; на мобільному — `overflow-x-auto` з `relative` (щоб sr-only не розширював сторінку).
- **Числа:** лише через `formatQuantity`/`formatNumber` (`src/lib/format.ts`), одиниці — у `messages`.
- **Контраст:** текст ≥ 4.5:1 на всіх фонах.

## Гілки

- `main` — стабільна, мерджить тільки власник
- `develop` — інтеграційна
- `feature/*`, `fix/*`, `chore/*` — задачі, від `develop`

## Прийняті рішення

- Агенти: Claude Code і Codex, синхронізуються через `AGENTS.md` + `docs/ai/`.
- Remote на GitHub поки не підключений, нічого не пушимо.
- Плагіни Claude Code для SEO/GEO/маркетингу підключені на рівні репо через .claude/settings.json: searchfit-seo (основний), marketing (Anthropic knowledge-work), rampstack-seo. Плагіни з платними MCP вмикати лише з підтвердження власника.
- Усі секції використовують `Container`: максимум `1440px`, центрування та адаптивні горизонтальні відступи.
- Лейбли секцій використовують компонент `Label` із спільною mobile-first типографікою та декоративним білим кругом.
- Заголовки використовують компонент `Heading` із семантичним рівнем через проп `as`, варіантами line-height через `lineHeight` і letter-spacing через `letterSpacing`.
- Описові тексти секцій використовують компонент `Description` із типографічними варіантами через `size`.
- CTA-посилання використовують компонент `Button` (pill, стрілка зсувається при hover; внутрішні шляхи через `next/link`): варіанти `primary`/`secondary` для темного фону, `primaryOnLight`/`secondaryOnLight` для світлого; розміри `default`, `wide`, `compact`. Посилання-кнопки всередині карток — усі контурні (`secondaryOnLight` / `secondary`); заповнені primary — лише для головних CTA (hero, header).
- Повноекранні секції можуть використовувати `ScrollIndicator` для переходу до наступного viewport.
- Шрифти через `next/font/google` і токени `@theme`: основний текст — Inter (`font-sans`), заголовки (`Heading`) і лейбли (`Label`) — Montserrat (`font-heading`). `Heading` має проп `weight` (`semibold` за замовчуванням, `medium`).
- Контакти офісів, email, пункти меню й мови зберігаються в src/components/layout/header/header-data.ts — єдине джерело для header (і надалі для footer/JSON-LD).
- Меню header містить лише SVIT і «Рішення» (мега-меню з URL поточного init.energy). Пункти на секції головної (Про нас, Проєкти, Контакти тощо) додаються в `navItems` (`header-data.ts`) лише тоді, коли відповідна секція створена.
- Кольори задаються токенами `@theme` у globals.css: `ink` (rgb(0 2 23), як overlay hero), `surface` (світлий фон секцій), `line` (лінії), `sky` (смуги-посилання). Нові кольори — лише через токени. Картки й смуги розділяються лише фоном, без тіней і рамок; картки бувають тільки світлі (`surface`) або темні (`ink`).
- `Label` і `Description` мають проп `tone` (`onDark` за замовчуванням, `onLight` для світлих секцій).
- Дані (продукти, slug-и, рішення) — у `src/content/`, URL будуються через `routes`/`toPath`, не хардкодяться в JSX. Тексти UI — у `messages/`.
- Секції після hero світлі (`bg-surface`) і заходять під заокруглений низ hero (`-mt-12`).
- Анімація появи при скролі — клієнтський `Reveal` (`src/components/ui/reveal.tsx`, Motion `whileInView`, один раз, вимикається при prefers-reduced-motion). Секції лишаються Server Components і обгортають блоки в `Reveal`; картки — зі stagger `delay`.
- Кожна секція головної сторінки є окремим модулем у `src/components/sections/home/`.
- Контентні варіанти hero та їхні зображення зберігаються в `hero-slides.ts`; анімація розділена між `hero-content-slider.tsx`, `hero-media-slider.tsx` і `hero-slider.tsx`.
- Hero-заголовки зберігаються двома лініями в даних слайда для послідовної дворядкової композиції.
- Проєкт розробляється модульно: секції, UI та layout-компоненти мають окремі відповідальні модулі.
- У стилізації застосовується актуальний канонічний синтаксис Tailwind CSS; стандартні utility-класи мають пріоритет над довільними значеннями.

## Відкриті питання / TODO

- Визначити призначення сайту та структуру сторінок.
