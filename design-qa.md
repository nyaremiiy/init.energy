# Design QA — секція «Реалізовані проєкти»

- **Source visual truth:** `C:\Users\nyare\Pictures\Screenshots\Screenshot 2026-11-06 121958.png`
- **Implementation evidence:** `output/playwright/projects-desktop-section.png`, `output/playwright/projects-mobile-section.png`
- **Viewports:** desktop 1440 × 1000 CSS px; mobile 360 × 800 CSS px; device scale factor 1.
- **State:** початкова активна пігулка «Усі»; три featured записи; медіа навмисно замінено заглушками на вимогу власника.

## Findings

- Очікуване відхилення: реальні фотографії у референсі замінено на темні `MediaPlaceholder`. Це не є дефектом QA, бо це пряма вимога задачі; `TODO(content)` у `src/content/projects.ts` перелічує дані, які треба замінити перед публікацією.
- P1/P2-відхилень не знайдено: на 1440 px велика картка займає 7 із 12 колонок і дві строки, дві малі — 5 колонок; на 360 px картки розташовані в одну колонку з висотою 420 px.

## Fidelity surfaces

- **Typography:** Montserrat для H2/H3 та лейблів, Inter для метаданих; заголовки не обрізаються на перевірених розмірах.
- **Spacing and layout:** повторно використано контейнер, відступи секцій і радіус `rounded-3xl`; gap сітки — 16 px.
- **Colors and contrast:** світла секція, активний фільтр `ink`; текст карток білий поверх затемнення `ink`, що забезпечує контраст.
- **Image quality:** фото відсутні за вимогою; компонент уже підтримує `next/image` з `fill`, `object-cover` і змістовним alt після додавання даних.
- **Copy and interaction:** усі UI-тексти з `messages/uk.json`; фільтри — звичайні посилання, обладнання веде на сторінку продукту, картки мають видимі focus-стани та reduced-motion hover.

## Comparison history

1. У першому mobile-capture підпис заглушки перетинався з текстом картки. Виправлено: текст заглушки прибрано з видимої області, а `TODO(content)` лишено в data layer. Повторний mobile-capture не має перетину.

## Final result

passed
