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

## 2026-11-05 — Лаконічний індикатор прокрутки
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** прибрано текст із `ScrollIndicator`, залишено лише анімовану іконку мишки з доступним `aria-label`.
- **Файли:** src/components/ui/scroll-indicator.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** функція плавної прокрутки та reduced-motion підтримка збережені.

## 2026-11-05 — Анімація індикатора прокрутки
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** підпис індикатора зменшено до `10px`; іконка мишки отримала м’яку циклічну Motion-анімацію вниз-вгору.
- **Файли:** src/components/ui/scroll-indicator.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** анімація вимикається для `prefers-reduced-motion`.

## 2026-11-05 — Індикатор прокрутки з мишкою
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** круглу іконку прокрутки замінено на Lucide `Mouse` з текстом «Гортайте далі» та легкою hover-анімацією.
- **Файли:** src/components/ui/scroll-indicator.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** функція плавної прокрутки лишилась без змін.

## 2026-11-05 — Індикатор прокрутки hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** у нижньому центрі hero додано клікабельний `ScrollIndicator` з іконкою `ChevronDown`.
- **Файли:** src/components/ui/scroll-indicator.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** індикатор плавно прокручує сторінку на висоту поточного viewport.

## 2026-11-05 — Кадрування третього фото hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** для третього зображення hero задано `object-top` через модульні дані слайда.
- **Файли:** src/components/sections/home/hero-slides.ts, src/components/sections/home/hero-media-slider.tsx, src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** кожне hero-зображення може задавати власне кадрування через поле `position`.

## 2026-11-05 — Позиціювання першого слайда hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** опис першого слайда доповнено рішеннями для приватних будинків, квартир і підприємств.
- **Файли:** src/components/sections/home/hero-slides.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** текст чіткіше описує цільові сегменти та ключові послуги.

## 2026-11-05 — Responsive-фото та темніший градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** додано responsive-версії третього фото hero; градієнт hero протягнуто до правого краю та посилено затемнення.
- **Файли:** public/images/home/hero/03-750.avif, public/images/home/hero/03-1280.avif, public/images/home/hero/03-1920.avif, src/components/sections/home/hero-slides.ts, src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** третій слайд використовує оптимальне зображення для кожного брейкпоінта.

## 2026-11-05 — Тестове фото третього слайда hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** `03-2560.avif` підключено до слайда систем резервного живлення.
- **Файли:** public/images/home/hero/03-2560.avif, src/components/sections/home/hero-slides.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** за наявності додати responsive-версії `03-750`, `03-1280` і `03-1920` у цей самий набір даних.

## 2026-11-05 — Оновлені зображення hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** старі ресурси hero замінено наборами `01-*` і `02-*`; перший і третій слайди використовують `01`, слайд сонячних станцій — `02`.
- **Файли:** public/images/home/hero/01-*, public/images/home/hero/02-*, src/components/sections/home/hero-slides.ts, src/components/sections/home/hero-media-slider.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** зображення мають responsive AVIF-варіанти для мобільних і desktop-екранів.

## 2026-11-05 — Оптимізація медіа-шарів hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** градієнт піднято над медіа; crossfade обмежено двома різними фото з автоматичним видаленням попереднього; `main-2560.jpeg` оптимізується через `next/image`.
- **Файли:** src/app/globals.css, src/components/sections/home/hero-slider.tsx, src/components/sections/home/hero-media-slider.tsx, src/components/sections/home/hero-slides.ts, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** однакове фото сусідніх слайдів не дублюється в DOM.

## 2026-11-05 — Overlay crossfade фото hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** медіа hero змінюється через накладання нового фото з `opacity: 0` поверх нерухомого попереднього та плавний перехід до `opacity: 1`.
- **Файли:** src/components/sections/home/hero-slider.constants.ts, src/components/sections/home/hero-slider.tsx, src/components/sections/home/hero-media-slider.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** тривалість crossfade централізована в `hero-slider.constants.ts`.

## 2026-11-05 — Плавніша зміна фото hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** збільшено тривалість crossfade зображень hero до 1,2 секунди та застосовано `easeInOut`.
- **Файли:** src/components/sections/home/hero-media-slider.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** швидка анімація текстового контенту не змінюється.

## 2026-11-05 — Плавна зміна фото hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** додано `main-2560.jpeg` для першого слайду hero; медіа слайдів винесено в окремий Motion-модуль, який плавно накладає наступне фото поверх попереднього.
- **Файли:** public/images/home/hero/main-2560.jpeg, src/components/sections/home/hero.tsx, src/components/sections/home/hero-slider.tsx, src/components/sections/home/hero-media-slider.tsx, src/components/sections/home/hero-content-slider.tsx, src/components/sections/home/hero-slides.ts, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** для наступного слайду достатньо вказати нове зображення в `heroSlides`.

## 2026-11-05 — Довший показ слайдів hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** збільшено час показу кожного hero-слайда з 6 до 10 секунд.
- **Файли:** src/components/sections/home/hero-content-slider.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** швидкість Motion-переходу збережено на рівні 350 мс.

## 2026-11-05 — Слайд резервного живлення hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** додано третій контентний варіант hero про готові комплекси резервного живлення на 300 Вт, 5 кВт, 16 кВт і рішення до 1 044 кВт.
- **Файли:** src/components/sections/home/hero-slides.ts, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** CTA слайду — «Підібрати рішення» та «Залишити заявку».

## 2026-11-05 — Letter-spacing заголовка hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** до `Heading` додано модульний проп `letterSpacing`; заголовок hero використовує `normal` для трохи вільнішої типографіки.
- **Файли:** src/components/ui/heading.tsx, src/components/sections/home/hero-content-slider.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** інші секції можуть обирати `tight`, `normal` або `wide` без локальних класів.

## 2026-11-05 — Motion-анімація слайдів hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** додано Motion; слайди hero тепер входять із правого краю viewport (`100vw`) і швидко виходять ліворуч.
- **Файли:** package.json, package-lock.json, src/components/sections/home/hero-content-slider.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** Motion використовується для плавних і продуктивних UI-анімацій.

## 2026-11-05 — Слайдер контенту hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** контент hero перетворено на модульний автоматичний слайдер із швидким переходом справа наліво; додано варіант про встановлення сонячних електростанцій із CTA «Залишити заявку» та «Розрахувати вартість».
- **Файли:** src/components/sections/home/hero.tsx, src/components/sections/home/hero-content-slider.tsx, src/components/sections/home/hero-slides.ts, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** нові варіанти додаються в масив `heroSlides`; автоперемикання вимкнене для `prefers-reduced-motion`.

## 2026-11-05 — Ширші CTA-кнопки hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** до `Button` додано модульний розмір `wide`; обидві CTA-кнопки hero стали трохи ширшими.
- **Файли:** src/components/ui/button.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** інші кнопки зберігають розмір `default`.

## 2026-11-05 — Більше простору в hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** збільшено вертикальний ритм між елементами контентного блоку hero.
- **Файли:** src/components/sections/home/hero.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** зміна ізольована в модулі hero та не впливає на спільні компоненти.

## 2026-11-05 — Декоративний елемент Label
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** до спільного компонента `Label` додано маленький декоративний білий круг перед текстом.
- **Файли:** src/components/ui/label.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** елемент автоматично відображається в усіх лейблах секцій.

## 2026-11-05 — Відступ опису hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** збільшено відступ між заголовком і описом у композиції hero.
- **Файли:** src/components/sections/home/hero.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** базовий компонент `Description` лишається незалежним від конкретної секції.

## 2026-11-05 — Модульний line-height заголовків
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** line-height перенесено в проп `lineHeight` компонента `Heading`; hero використовує варіант `compact`.
- **Файли:** src/components/ui/heading.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** налаштування типографіки заголовків виконувати через API `Heading`, а не локальні utility-класи.

## 2026-11-05 — Щільніший заголовок hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** для заголовка hero встановлено менший міжрядковий інтервал через `leading-none`.
- **Файли:** src/components/sections/home/hero.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** базова типографіка спільного `Heading` не змінюється.

## 2026-11-05 — Відступ перед CTA hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** збільшено верхній відступ перед групою CTA-кнопок hero.
- **Файли:** src/components/sections/home/hero.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** кнопки чіткіше відокремлені від опису.

## 2026-11-05 — Hover-анімація CTA-кнопок
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** `Button` трохи підіймається при hover, а її іконка додатково рухається вгору-праворуч.
- **Файли:** src/components/ui/button.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** анімація автоматично доступна всім кнопкам з опційною іконкою.

## 2026-11-05 — Мінімальний blur вторинної кнопки
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** до прозорого варіанта `Button` додано легкий `backdrop-blur-sm`.
- **Файли:** src/components/ui/button.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** ефект застосовується до всіх вторинних CTA-кнопок.

## 2026-11-05 — Іконки CTA hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** додано `lucide-react`; CTA-кнопки hero отримали іконку `ArrowUpRight`, а `Button` — опційний проп `icon`.
- **Файли:** package.json, package-lock.json, src/components/ui/button.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** інші кнопки можуть передавати власну Lucide-іконку через проп `icon`.

## 2026-11-05 — CTA-кнопки hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** під описом hero додано CTA «Підібрати рішення» та «Сонячні станції»; стилі винесено в повторно використовуваний компонент `Button`.
- **Файли:** src/components/ui/button.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** CTA ведуть на майбутні секції `#contact` і `#solar-stations`.

## 2026-11-05 — Опис послуг у hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** під заголовком hero додано опис послуг із сонячних електростанцій, панелей і резервного живлення; текст винесено в компонент `Description`.
- **Файли:** src/components/ui/description.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** опис містить ключові послуги для SEO та готовий для використання в інших секціях.

## 2026-11-05 — Спільний компонент Heading
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** заголовок hero винесено в повторно використовуваний компонент `Heading` із вибором семантичного рівня через `as`.
- **Файли:** src/components/ui/heading.tsx, src/components/sections/home/hero.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** нові заголовки створювати через `Heading`, передаючи коректний HTML-рівень.

## 2026-11-05 — Заголовок hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** додано видимий `h1` «Комплексні енергетичні рішення» під лейблом hero.
- **Файли:** src/components/sections/home/hero.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** заголовок адаптивно масштабується від мобільних до desktop-екранів.

## 2026-11-05 — Канонічний синтаксис Tailwind
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** додано правило використовувати стандартні актуальні utility-класи Tailwind; `max-w-[1440px]` замінено на канонічний `max-w-360`.
- **Файли:** AGENTS.md, src/components/layout/container.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** у разі наявності стандартного utility-класу не використовувати довільне значення.

## 2026-11-05 — Правило модульної розробки
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** до правил і контексту проєкту додано вимогу модульної архітектури для секцій, UI та layout-компонентів.
- **Файли:** AGENTS.md, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** новий функціонал створювати в ізольованих модулях із можливістю повторного використання.

## 2026-11-05 — Модуль hero-секції
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** hero винесено в окремий модуль, а `page.tsx` залишено для композиції секцій головної сторінки.
- **Файли:** src/components/sections/home/hero.tsx, src/app/page.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** наступні секції головної сторінки додаються окремими модулями поруч із hero.

## 2026-11-05 — Спільний компонент Label
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** типографіку лейбла винесено в повторно використовуваний компонент `Label` і застосовано в hero.
- **Файли:** src/components/ui/label.tsx, src/app/page.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** використовувати `Label` у наступних секціях для узгодженого стилю.

## 2026-11-05 — Типографіка лейбла hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** зменшено розмір лейбла та встановлено колір `white/85`.
- **Файли:** src/app/page.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** на екранах від `sm` лейбл збільшується до `text-sm`.

## 2026-11-05 — Шрифт Montserrat
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** Montserrat застосовано глобально через оптимізований `next/font/google` з підтримкою кирилиці.
- **Файли:** src/app/layout.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** усі компоненти успадковують Montserrat без окремих font-класів.

## 2026-11-05 — Спрощений лейбл hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** лейбл hero приведено до uppercase-тексту з кольором `white/70` без фону та рамки.
- **Файли:** src/app/page.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** лейбл готовий до композиції з наступним заголовком.

## 2026-11-05 — Лейбл у hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** додано лейбл «Твоя енергетична незалежність» у лівій контентній зоні hero.
- **Файли:** src/app/page.tsx, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** лейбл підготовлений для доповнення заголовком і CTA.

## 2026-11-05 — Правило mobile-first верстки
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** до `AGENTS.md` додано обов’язковий mobile-first підхід до верстки.
- **Файли:** AGENTS.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** базові стилі створюються для малих екранів, responsive-правила — для більших.

## 2026-11-05 — Спільний контейнер секцій
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** створено повторно використовуваний `Container` з максимальною шириною `1440px`, центруванням і адаптивними боковими відступами; підключено до hero.
- **Файли:** src/components/layout/container.tsx, src/app/page.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** використовувати `Container` для внутрішнього контенту кожної наступної секції.

## 2026-11-05 — Лінійний градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** радіальний градієнт замінено двома лінійними шарами: коротким затемненням зліва та легким тонуванням знизу.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** права частина фото повністю звільнена від основного градієнта.

## 2026-11-05 — Новий градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** горизонтальну заливку замінено на радіальне затемнення від лівого краю з легким вертикальним тонуванням.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** ліва зона зберігає контраст під текст, а права частина фото має природніші кольори.

## 2026-11-05 — Плавніший темний градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** посилено затемнення hero та додано більше проміжних точок для плавнішого переходу.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** права частина градієнта залишається прозорою для збереження фото.

## 2026-11-05 — Темніший градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** збільшено непрозорість градієнта hero для глибшого затемнення зліва та посилення контрасту.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** плавний перехід до прозорого правого краю збережено.

## 2026-11-05 — Тінь у тон градієнта hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** посилено синьо-графітовий відтінок тіні до кольору градієнта `#000217`.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** тінь тепер візуально продовжує палітру hero.

## 2026-11-05 — Коректна тінь hero-секції
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** замінено `drop-shadow` на `box-shadow` контейнера hero; секція знову обрізає свій вміст по закруглених кутах.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** тінь тепер походить від меж hero-секції та лягає на наступну секцію.

## 2026-11-05 — Закруглення та тінь hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** додано нижнє закруглення hero на `50px` і м’яку тінь вниз для візуального відділення від наступної секції.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** обрізання зображення винесено на media-шар, щоб тінь залишалась видимою.

## 2026-11-05 — Світліший градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** зменшено непрозорість градієнта зліва, щоб краще зберегти видимість hero-зображення.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** градієнт все ще забезпечує контраст для майбутнього тексту.

## 2026-11-05 — Правило використання Tailwind
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** до `AGENTS.md` додано вимогу максимально використовувати Tailwind CSS і обмежувати власний CSS специфічними випадками.
- **Файли:** AGENTS.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** правило застосовується до всіх наступних UI-змін.

## 2026-11-05 — Плавніший градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** розширено градієнт hero та додано проміжні точки прозорості для м’якшого переходу.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** затемнення зліва зберігає контраст для майбутнього тексту.

## 2026-11-05 — Градієнт hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** додано горизонтальний градієнт `#000217` поверх hero-зображення, темніший зліва для майбутнього тексту.
- **Файли:** src/app/globals.css, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** текстовий контент hero буде додано окремо.

## 2026-11-05 — Структура зображень hero
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** переміщено responsive-зображення hero до `public/images/home/hero` та оновлено шляхи в компоненті.
- **Файли:** public/images/home/hero/*, src/app/page.tsx, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** для нових сторінок і секцій використовувати аналогічну структуру каталогів.

## 2026-11-05 — Responsive hero-секція
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** додано hero з responsive `<picture>` та локальними зображеннями; висота `100svh` для компактних екранів і `75vh` для великих desktop-дисплеїв.
- **Файли:** src/app/page.tsx, src/app/globals.css, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** контент і UI-елементи hero можна додати поверх зображення.

## 2026-11-05 — Правила чистого коду та SEO/GEO
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
- **Що зроблено:** до `AGENTS.md` додано вимогу видаляти невикористовувані файли й код та розробляти функціонал з урахуванням SEO і GEO.
- **Файли:** AGENTS.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** правила застосовуються Claude Code і Codex у наступних задачах.

## 2026-11-05 — Каталог зображень
- **Агент:** Codex
- **Гілка:** feature/hero-section (статус: в роботі)
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
