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

## 2026-11-06 — Плагіни Claude Code для SEO/GEO/маркетингу
- **Агент:** Claude Code
- **Гілка:** chore/claude-plugins (статус: змерджено в develop)
- **Що зроблено:** створено `.claude/settings.json` з маркетплейсами (`extraKnownMarketplaces`) і плагінами (`enabledPlugins`): `searchfit-seo@searchfit-seo`, `marketing@knowledge-work-plugins`, `rampstack-seo@rampstack`. Назви взяті з `marketplace.json` на GitHub; самі плагіни встановлюються після перезапуску Claude Code (trust-запит) і перевіряються через `/plugin`.
- **Файли:** .claude/settings.json, docs/ai/CONTEXT.md, docs/ai/CHANGELOG.md
- **Нотатки / що далі:** `marketing` має опційні MCP-конектори (Ahrefs, Similarweb, HubSpot, Klaviyo, Amplitude, Supermetrics тощо, більшість платні); частина скілів `rampstack-seo` розрахована на Ahrefs MCP. Без підключення цих сервісів скіли працюють частково. `docs/SEO-GEO.md` ще не створено.

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
