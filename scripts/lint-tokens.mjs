// Design-token guard: fails on class names and colors outside the token set (see AGENTS.md).
// Runs as part of `npm run lint`.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("../src", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

// Each rule: id, regex, message. Matches are checked line by line.
const rules = [
  {
    id: "opacity",
    re: /(?<![\w-])(?:[\w-]+:)*(?:text|border|bg|ring|divide|decoration|outline|placeholder|from|via|to|fill|stroke|shadow|accent)-(?:ink|white)\/\d+/,
    message: "opacity on ink/white: use muted, faint, line, hover, fill-dark, line-dark, faint-dark, muted-dark (see AGENTS.md)",
  },
  {
    id: "text-size",
    re: /(?<![\w-])(?:[\w-]+:)*text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)(?![\w-])/,
    message: "Tailwind text size: use text-caption, text-small, text-body, text-lead or a token from globals.css",
  },
  {
    id: "radius",
    re: /(?<![\w-])(?:[\w-]+:)*rounded-(?:md|lg|xl|2xl|3xl)(?![\w-])/,
    message: "radius: use rounded-tile (16px) or rounded-card (24px)",
  },
  {
    id: "weight",
    re: /(?<![\w-])(?:[\w-]+:)*font-(?:bold|extrabold)(?![\w-])/,
    message: "weight: use font-semibold (600) at most; no 700+",
  },
  {
    id: "hex",
    re: /(?:["'`\s(,])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?![0-9a-zA-Z_-])/,
    message: "hex color: use a token from globals.css",
  },
];

// Arbitrary values (`name-[...]`) are allowed only for these utilities.
const ARBITRARY_ALLOWED = new Set(["grid-rows", "transition", "group-has"]);
const arbitraryRe = /(?<![\w-])([a-z][\w-]*)-\[/g;

// Exceptions by file, with a reason (keep this list short).
const exceptions = {
  // Decorative wordmark in the footer: a faint white watermark, not a line.
  "components/layout/footer/footer-mark.tsx": ["opacity"],
  // The checkbox box is 20 px with a 6 px radius (rounded-md) by the design board; rounded-tile would make it a circle.
  "components/ui/form/checkbox.tsx": ["radius"],
};

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(name) && !/\.test\.ts$/.test(name)) out.push(p);
  }
  return out;
}

const problems = [];
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const skip = new Set(exceptions[rel] ?? []);
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const rule of rules) {
      if (skip.has(rule.id)) continue;
      if (rule.re.test(line)) problems.push({ file: rel, line: i + 1, id: rule.id, message: rule.message });
    }
    for (const m of line.matchAll(arbitraryRe)) {
      if (ARBITRARY_ALLOWED.has(m[1])) continue;
      problems.push({ file: rel, line: i + 1, id: "arbitrary", message: `arbitrary value "${m[1]}-[…]" is not allowed` });
    }
  });
}

// Links and buttons: no hand-written pill or underline styles outside src/components/ui/.
// Use Button, IconButton, PillLink, RowLink, NavLink, InlineLink or ArrowLink (see AGENTS.md).
const linkRe = /<(a|Link|button)\b([^>]*?)className=(?:"([^"]*)"|\{`([^`]*)`\})/gs;
const linkExceptions = {
  // Action that looks like a text link (opens the settings dialog); not navigation.
  "components/consent/CookieBanner.tsx": "settings dialog trigger styled as an inline link (action, not navigation)",
  "components/layout/footer/footer.tsx": "developer credit: round brand icon plus text link (TODO: decide on a credit component)",
  "components/layout/header/mega-menu-item.tsx": "mega-menu trigger is a disclosure button (aria-expanded), not a link (TODO: NavLink for the button)",
  "components/layout/header/section-nav-link.tsx": "active section pill in the header (TODO: NavLink variant=\"pill\")",
};
const linkExceptionsHit = [];
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  if (rel.startsWith("components/ui/") || !/^(components|app)\//.test(rel)) continue;
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(linkRe)) {
    const cls = m[3] ?? m[4] ?? "";
    if (!/rounded-full|underline/.test(cls)) continue;
    const line = text.slice(0, m.index).split("\n").length;
    if (linkExceptions[rel]) {
      linkExceptionsHit.push(`src/${rel}:${line}  ${linkExceptions[rel]}`);
      continue;
    }
    problems.push({ file: rel, line, id: "link", message: `hand-made ${m[1]} with rounded-full/underline: use a ui link or button component` });
  }
}
if (linkExceptionsHit.length > 0) {
  console.log("lint:tokens — documented link exceptions:");
  for (const e of linkExceptionsHit) console.log(`  ${e}`);
}

// Form controls: every <input>, <select> and <textarea> goes through src/components/ui/form/.
// Allowed outside it: type="hidden" and honeypot fields (marked data-honeypot).
const controlRe = /<(input|select|textarea)\b([^>]*)>/gs;
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  if (rel.startsWith("components/ui/form/") || !/^(components|app)\//.test(rel)) continue;
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(controlRe)) {
    const attrs = m[2];
    if (/type="hidden"/.test(attrs) || /data-honeypot/.test(attrs)) continue;
    const line = text.slice(0, m.index).split("\n").length;
    problems.push({ file: rel, line, id: "control", message: `bare <${m[1]}>: use Field and the components in src/components/ui/form/` });
  }
}

if (problems.length > 0) {
  for (const p of problems) console.error(`src/${p.file}:${p.line}  [${p.id}] ${p.message}`);
  console.error(`\nlint:tokens — ${problems.length} problem(s)`);
  process.exit(1);
}
console.log("lint:tokens — ok");
