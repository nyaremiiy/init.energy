# init.energy

Сайт INIT ENERGY: сонячні електростанції, накопичувачі SVIT і LITHIUMVALLEY, калькулятор окупності СЕС. Українська версія — на корені домену, англійська — під `/en/`.

**Стек:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion, lucide-react.

## Вимоги

- Node.js **22.18+** (рекомендовано 24 LTS): тести запускають `.ts` напряму.
- npm.

## Команди

| Команда | Що робить |
|---|---|
| `npm ci` | Встановити залежності точно за `package-lock.json` |
| `npm run dev` | Dev-сервер на http://localhost:3000 |
| `npm run lint` | ESLint |
| `npm test` | Тести формул калькуляторів і форми заявки (`node --test`) |
| `npm run build` | Продакшн-збірка (має проходити перед кожним мерджем) |
| `npm start` | Запуск зібраного сайту (порт 3000, інший — `npm start -- -p 3100`) |

## Змінні середовища

Задаються на сервері у `.env.local` або в systemd-сервісі. У Git їх немає.

| Змінна | Для чого |
|---|---|
| `LEAD_STORAGE_FILE` | Шлях до файлу заявок (за замовчуванням `storage/leads.jsonl`). Каталог має бути доступний для запису й не очищатися під час деплою. |
| `GOOGLE_SITE_VERIFICATION` | Код підтвердження Google Search Console (мета-тег `google-site-verification`). |
| `BING_SITE_VERIFICATION` | Код підтвердження Bing Webmaster Tools (`msvalidate.01`). |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GADS_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | ID тегів аналітики й реклами. Завантажуються лише після згоди на cookie (аналітика → GA4, маркетинг → Google Ads, Meta, TikTok; GTM — після будь-якої згоди). Порожня змінна — тег не підключається. Вбудовуються під час `npm run build`, тож після зміни потрібна перезбірка. |
| `VISITS_DIR` | Папка лічильника відвідувачів (за замовчуванням `storage/visits`). Має бути доступна для запису й не очищатися під час деплою. |

## Деплой

Сайт працює як Node.js-сервіс (systemd, назва за замовчуванням `init.energy`).

```bash
./deploy.sh        # git pull гілки main, npm ci, npm run build, перезапуск сервісу
./maintenance.sh   # увімкнути / вимкнути екран «технічні роботи» (503) і перезапустити
npm run deploy     # оновити develop, змерджити його в main і запушити origin/main
```

Перед першим запуском:
1. Задати змінні середовища (див. вище).
2. Переконатися, що `storage/` (або `LEAD_STORAGE_FILE`) доступний для запису. Заявки поки зберігаються у файл, CRM ще не підключена.
3. Після публікації: додати сайт у Google Search Console і Bing Webmaster, надіслати `https://init.energy/sitemap.xml`, перевірити сторінки в Rich Results Test.

## Згода на cookie

Банер згоди й налаштування — `src/components/consent/`, логіка — `src/lib/consent/`. До рішення відвідувача сайт не робить жодного запиту до Google, Meta чи TikTok (Google Consent Mode v2 стоїть у «denied»). Змінити вибір можна будь-коли через «Налаштування cookie» у футері. Список cookie на сторінці «Політика cookie» — `src/content/cookies.ts`. Якщо додаєте новий тег або категорію, оновіть цей список і збільште `CONSENT_VERSION`, щоб банер з’явився знову.

## Лічильник відвідувачів

Сайт сам рахує відвідування, без cookie і без зовнішніх сервісів (`src/lib/visits/`).

- Після показу кожної сторінки браузер надсилає її адресу на `/api/visit/`. Боти й браузери з «не відстежувати» (DNT / GPC) не рахуються. У режимі розробки лічильник вимкнений.
- Відвідувач — хеш IP і браузера з «сіллю» дня. IP не зберігається, сіль видаляється після звіту.
- **Щодня о 03:00 за Києвом** сервер пише звіт за минулу добу:
  - `storage/visits/reports/YYYY-MM-DD.json` — унікальні відвідувачі, перегляди, сторінки (перегляди й відвідувачі кожної), джерела переходів (google.com, t.me…);
  - `storage/visits/reports.jsonl` — короткий рядок на кожен день (для Telegram-бота).
- Якщо сервер не працював о 03:00, пропущені звіти пишуться одразу після старту.

## SEO і GEO

- Метадані кожної сторінки — `buildMetadata()` (`src/lib/seo/metadata.ts`): title, description, canonical, hreflang uk/en/x-default, Open Graph — один файл `public/og-image.png` (1200×630) для всіх сторінок, заголовок і опис — свої в кожної.
- Структуровані дані (JSON-LD) — `src/lib/seo/schema.ts`: Organization, WebSite, Service, Product, FAQPage, BreadcrumbList, HowTo, WebApplication.
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` — `src/app/`.
- `/llms.txt` — коротка довідка для AI-пошуку (ChatGPT, Perplexity, Gemini), будується з `src/content/` під час збірки.
- Сторінки, на які вже є посилання, але які ще не створені, показують екран «в розробці» (404 + noindex). Список — `plannedPaths` у `src/content/routes.ts`. Коли сторінку створено, її шлях звідти прибирають.

## Де що лежить

```
src/app/              маршрути: (uk)/ — українські, en/ — англійські
src/components/       секції, UI-компоненти, layout (шапка, футер)
src/content/          усі факти й дані: продукти, рішення, FAQ, контакти, маршрути
messages/uk.json      тексти інтерфейсу українською
messages/en.json      тексти інтерфейсу англійською (ті самі ключі)
public/images/        фото (AVIF), прев'ю для соцмереж (og/)
docs/ai/              CONTEXT.md — правила й рішення, CHANGELOG.md — журнал змін
```

**Змінити текст чи факт** — у `src/content/*` або `messages/*.json`, обома мовами. Нова інформація оновлюється в усіх місцях сайту.

**Нова сторінка** виходить одразу двома мовами: маршрути в `(uk)/` і `en/`, шлях у `localizedPaths` (`src/i18n/config.ts`), запис у `src/app/sitemap.ts`.

## Правила роботи

Git-процес, стиль і правила для AI-агентів — у [`AGENTS.md`](AGENTS.md) і [`docs/ai/CONTEXT.md`](docs/ai/CONTEXT.md). Коротко: задача → гілка від `develop` → `npm run lint` і `npm run build` → merge `--no-ff` у `develop`. У `main` мерджить лише власник.
