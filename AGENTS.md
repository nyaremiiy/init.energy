<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# init.energy — інструкції для AI-агентів

Цей файл — **єдине джерело правил** для всіх AI-агентів у проєкті (Codex читає його напряму, Claude Code — через `CLAUDE.md`). Власник проєкту працює то з Claude Code, то з Codex, тому кожен агент **обов'язково** синхронізується через спільні файли нижче.

## Перед початком будь-якої роботи

1. Прочитай [`docs/ai/CONTEXT.md`](docs/ai/CONTEXT.md) — поточний стан проєкту, архітектура, прийняті рішення.
2. Прочитай [`docs/ai/CHANGELOG.md`](docs/ai/CHANGELOG.md) — журнал змін (нові записи зверху).
3. Перевір git: `git status`, `git branch`, `git log --oneline -15 --all` — зміни могли зробити поза журналом.

## Після завершення задачі

1. Додай запис у **верх** `docs/ai/CHANGELOG.md` за шаблоном у цьому файлі.
2. Якщо змінилась архітектура, стек, структура, команди чи прийняті рішення — онови `docs/ai/CONTEXT.md`.
3. Закоміть ці файли **разом зі змінами коду** у гілці задачі.

## Якість і пошукова оптимізація

- Видаляй невикористовувані файли, імпорти, змінні, компоненти та інший мертвий код, якщо вони більше не потрібні проєкту.
- Для стилізації максимально використовуй Tailwind CSS utility-класи; власний CSS додавай лише для справді специфічних випадків, складних ефектів або правил, які недоцільно виражати utility-класами.
- Верстку завжди роби за принципом **mobile-first**: базові стилі призначені для малих екранів, а зміни для більших — додаються через responsive-брейкпоінти.
- Новий код пиши з урахуванням **SEO**: семантична HTML-структура, коректні metadata, ієрархія заголовків, доступні `alt`-описи, швидке завантаження та індексація.
- Новий контент і структуру також готуй для **GEO (Generative Engine Optimization)**: чіткі самодостатні формулювання, зрозумілий контекст, структуровані дані та відповіді на реальні запити користувачів.

## Git workflow (обов'язково)

- `main` — стабільна гілка. **Мерджить у `main` тільки власник.** Агентам заборонено комітити чи мерджити в `main`.
- `develop` — інтеграційна гілка.
- Кожна задача — окрема гілка від актуального `develop`:
  - `feature/<коротка-назва>` — новий функціонал
  - `fix/<коротка-назва>` — виправлення
  - `chore/<коротка-назва>` — налаштування, інфраструктура, документація
- Готову задачу мерджимо в `develop` через `git merge --no-ff`.
- **Нічого не пушимо** на GitHub (remote ще не налаштований), поки власник явно не попросить.
- Повідомлення комітів — Conventional Commits англійською: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`.
- Перед мерджем: `npm run lint` і `npm run build` мають проходити.

## Стек і команди

- Next.js 16 (App Router, `src/app`), React 19, TypeScript, Tailwind CSS v4 (через `@tailwindcss/turbopack`).
- `npm run dev` — dev-сервер, `npm run build` — збірка, `npm run lint` — лінтер.

## Мова

- Спілкування з власником — українською.
- Код, назви змінних, коміти — англійською.
