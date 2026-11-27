/**
 * The one pill-button style for the whole site: filter chips, product tabs,
 * radio pills. Same height, padding and type everywhere; only colours follow
 * the background tone.
 *
 * Use `chipClasses` for buttons and links. Radio pills (`PillRadio`) add
 * `peer-checked:` states on top of `chipBase`.
 */
/** "light" on white, "dark" on dark panels, "tint" on the light-blue (sky) panel. */
export type ChipTone = "light" | "dark" | "tint";

const chipShape =
  "inline-flex shrink-0 items-center rounded-full border font-medium whitespace-nowrap transition-colors duration-200 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2";

/** Geometry and type shared by every chip. */
export const chipBase = `${chipShape} h-10 px-4 text-small sm:h-11 sm:px-5`;

/** Compact chip (30 px) for the desktop header top bar only: not a touch target. */
const chipCompact = `${chipShape} h-7.5 gap-1.5 px-3 text-caption`;

const tones: Record<ChipTone, { on: string; off: string; focus: string }> = {
  light: {
    on: "border-ink bg-ink text-white",
    off: "border-line text-ink hover:border-ink",
    focus: "focus-visible:outline-ink",
  },
  tint: {
    on: "border-ink bg-ink text-white",
    off: "border-white bg-white text-ink hover:border-ink",
    focus: "focus-visible:outline-ink",
  },
  dark: {
    on: "border-white bg-white text-ink",
    off: "border-line-dark text-white hover:border-white",
    focus: "focus-visible:outline-white",
  },
};

/** Greyed-out chip: not clickable, muted text and border (e.g. filters with too few items). */
const disabledClasses = "pointer-events-none border-line text-faint";

export function chipClasses({
  selected,
  tone = "light",
  disabled = false,
  size = "md",
}: {
  selected: boolean;
  tone?: ChipTone;
  disabled?: boolean;
  size?: "md" | "compact";
}): string {
  const colours = tones[tone];
  const base = size === "compact" ? chipCompact : chipBase;

  if (disabled) return `${base} ${disabledClasses}`;

  return `${base} ${colours.focus} ${selected ? colours.on : colours.off}`;
}
