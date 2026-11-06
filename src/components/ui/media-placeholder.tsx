type MediaPlaceholderTone = "light" | "dark";

type MediaPlaceholderProps = {
  caption: string;
  tone?: MediaPlaceholderTone;
  /** Size, aspect ratio and radius; defaults to a 4:3 rounded block. */
  className?: string;
};

const toneClasses: Record<MediaPlaceholderTone, string> = {
  light: "bg-white text-ink/70",
  dark: "bg-white/6 text-white/75",
};

/**
 * Stand-in for a photo. Keeps the same aspect ratio and radius as the future
 * image, so swapping it in causes no layout shift.
 */
export function MediaPlaceholder({
  caption,
  tone = "light",
  className = "aspect-4/3 w-full rounded-2xl",
}: MediaPlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center px-6 text-center text-sm ${toneClasses[tone]} ${className}`}
    >
      {caption}
    </div>
  );
}
