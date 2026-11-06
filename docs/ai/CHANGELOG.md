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
