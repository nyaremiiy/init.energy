/**
 * The one text-field style for the whole site (inputs and textareas).
 * Same geometry and state behaviour everywhere; only colours follow the
 * background tone.
 *
 * default (`line` / `white/16` border) · hover (`ink/40` / `white/40`) ·
 * focus-visible (solid border + soft 3px ring, no offset outline) ·
 * error (solid border, set via `invalid`) · disabled (muted, not-allowed).
 */
export type InputTone = "light" | "dark";

const base =
  "w-full rounded-field border px-4 text-base transition-colors duration-200 ease-tech focus-visible:outline-none focus-visible:ring-3 disabled:cursor-not-allowed";

const tones: Record<
  InputTone,
  { field: string; idle: string; invalid: string }
> = {
  light: {
    field:
      "bg-white text-ink placeholder:text-ink/45 hover:border-ink/40 focus-visible:border-ink focus-visible:ring-ink/10 disabled:bg-surface disabled:text-ink/70 disabled:hover:border-line",
    idle: "border-line",
    invalid: "border-ink",
  },
  dark: {
    field:
      "bg-white/6 text-white placeholder:text-white/55 hover:border-white/40 focus-visible:border-white focus-visible:ring-white/20 disabled:opacity-70 disabled:hover:border-white/16",
    idle: "border-white/16",
    invalid: "border-white",
  },
};

type InputClassOptions = {
  tone?: InputTone;
  invalid?: boolean;
  /** Single-line field (56px) or multi-line textarea. */
  multiline?: boolean;
  className?: string;
};

export function inputClasses({
  tone = "light",
  invalid = false,
  multiline = false,
  className,
}: InputClassOptions = {}) {
  const t = tones[tone];

  return [
    base,
    t.field,
    invalid ? t.invalid : t.idle,
    multiline ? "min-h-28 resize-none py-4" : "h-14",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
