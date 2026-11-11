type MediaPlaceholderTone = "light" | "dark";

type MediaPlaceholderProps = {
  caption: string;
  /** "light" — surface on light sections, "dark" — on ink panels and the hero. */
  tone?: MediaPlaceholderTone;
  /** Fills the positioned parent (hero, cards with an overlay); ignores `aspect`. */
  fill?: boolean;
  /** Aspect ratio of the future photo; ignored when `className` sets the size. */
  aspect?: "4/3" | "3/4" | "16/9" | "1/1";
  /** Where the caption sits: centre, or the bottom-right corner (under hero text). */
  align?: "center" | "end";
  /** Size, aspect ratio and radius; overrides the defaults. */
  className?: string;
  /** Classes for the caption (e.g. hide it on phones under the hero text). */
  captionClassName?: string;
};

const toneClasses: Record<MediaPlaceholderTone, string> = {
  light: "border-line bg-surface text-ink/70",
  dark: "border-white/25 bg-white/6 text-white/75",
};

const aspectClasses = {
  "4/3": "aspect-4/3",
  "3/4": "aspect-3/4",
  "16/9": "aspect-video",
  "1/1": "aspect-square",
} as const;

/**
 * Stand-in for a photo: dashed border, small caption. Keeps the size and
 * radius of the future image, so swapping in a real photo (and any overlay
 * on top of it) causes no layout shift.
 */
export function MediaPlaceholder({
  caption,
  tone = "light",
  fill = false,
  aspect = "4/3",
  align = "center",
  className,
  captionClassName,
}: MediaPlaceholderProps) {
  const size = fill
    ? "absolute inset-0"
    : (className ?? `${aspectClasses[aspect]} w-full rounded-2xl`);
  const placement = align === "end" ? "items-end justify-end p-6 sm:p-8" : "items-center justify-center px-6";

  return (
    <div
      aria-hidden="true"
      className={`flex border border-dashed text-center text-sm ${placement} ${toneClasses[tone]} ${size} ${fill && className ? className : ""}`}
    >
      <span className={captionClassName}>{caption}</span>
    </div>
  );
}
