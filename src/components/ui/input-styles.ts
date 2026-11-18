/**
 * The one text-field style for the whole site (inputs and textareas).
 * Same geometry and state behaviour everywhere; only colours follow the
 * background tone.
 *
 * default (`line` / `line-dark` border) · hover (`faint` / `faint-dark`) ·
 * focus-visible (solid border; on light also shadow-card; no ring, no outline) ·
 * error (solid border, set via `invalid`) · disabled (muted, not-allowed).
 */
export type InputTone = "light" | "dark";

const base =
  "w-full rounded-field border px-4 text-body transition duration-200 ease-tech focus-visible:outline-none disabled:cursor-not-allowed";

const tones: Record<
  InputTone,
  { field: string; idle: string; invalid: string }
> = {
  light: {
    field:
      "bg-white text-ink placeholder:text-faint hover:border-faint focus-visible:border-ink focus-visible:shadow-card disabled:bg-surface disabled:text-muted disabled:hover:border-line",
    idle: "border-line",
    invalid: "border-ink",
  },
  dark: {
    field:
      "bg-fill-dark text-white placeholder:text-faint-dark hover:border-white focus-visible:border-white disabled:opacity-70 disabled:hover:border-line-dark",
    idle: "border-line-dark",
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
