type MediaPlaceholderTone = "light" | "dark";

type MediaPlaceholderProps = {
  caption: string;
  tone?: MediaPlaceholderTone;
  className?: string;
};

const toneClasses: Record<MediaPlaceholderTone, string> = {
  light: "bg-line text-ink/70",
  dark: "bg-white/6 text-white/75",
};

/**
 * Stand-in for a product photo. Keeps the same aspect ratio and radius as the
 * future `next/image`, so swapping it in causes no layout shift.
 */
export function MediaPlaceholder({
  caption,
  tone = "light",
  className,
}: MediaPlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex aspect-4/3 w-full items-center justify-center rounded-2xl px-6 text-center text-sm ${toneClasses[tone]} ${className ?? ""}`}
    >
      {caption}
    </div>
  );
}
