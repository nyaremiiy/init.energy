type MediaPlaceholderProps = {
  caption: string;
  className?: string;
};

/**
 * Stand-in for a product photo. Keeps the same aspect ratio, radius and
 * background as the future product photo, so swapping it in causes no layout shift.
 */
export function MediaPlaceholder({
  caption,
  className,
}: MediaPlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex aspect-4/3 w-full items-center justify-center rounded-2xl bg-white px-6 text-center text-sm text-ink/70 ${className ?? ""}`}
    >
      {caption}
    </div>
  );
}
