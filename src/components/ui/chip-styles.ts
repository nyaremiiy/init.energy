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

/** Geometry and type shared by every chip. */
export const chipBase =
  "inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-medium sm:h-11 sm:px-5 whitespace-nowrap transition-colors duration-200 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2";

const tones: Record<ChipTone, { on: string; off: string; focus: string }> = {
  light: {
    on: "border-ink bg-ink text-white",
    off: "border-ink/20 text-ink hover:border-ink",
    focus: "focus-visible:outline-ink",
  },
  tint: {
    on: "border-ink bg-ink text-white",
    off: "border-white bg-white text-ink hover:border-ink",
    focus: "focus-visible:outline-ink",
  },
  dark: {
    on: "border-white bg-white text-ink",
    off: "border-white/20 text-white hover:border-white",
    focus: "focus-visible:outline-white",
  },
};

/** Greyed-out chip: not clickable, muted text and border (e.g. filters with too few items). */
const disabledClasses = "pointer-events-none border-ink/10 text-ink/35";

export function chipClasses({
  selected,
  tone = "light",
  disabled = false,
}: {
  selected: boolean;
  tone?: ChipTone;
  disabled?: boolean;
}): string {
  const colours = tones[tone];

  if (disabled) return `${chipBase} ${disabledClasses}`;

  return `${chipBase} ${colours.focus} ${selected ? colours.on : colours.off}`;
}
