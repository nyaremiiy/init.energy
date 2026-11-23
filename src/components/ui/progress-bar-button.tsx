"use client";

type ProgressBarButtonProps = {
  /** Accessible name, e.g. «Слайд 2: Сонячні станції …». */
  label: string;
  /** done — filled; active — current item; upcoming — empty track. */
  state: "done" | "active" | "upcoming";
  /** Fill time of the active bar. Without it the active bar is simply full (manual mode, reduced motion). */
  durationMs?: number;
  /** Pauses the fill (animation-play-state). */
  running?: boolean;
  /** Changes on every restart of the active bar, so its animation starts from zero. */
  cycle?: number;
  onSelect: () => void;
  /** Called when the active bar is full. */
  onComplete?: () => void;
};

/**
 * Slide / step indicator that is also a button: 44 px tall hit area,
 * visible 40×3 px bar on dark backgrounds. The fill is a CSS animation
 * (scaleX, compositor only); its end, not a JS timer, advances the slider.
 */
export function ProgressBarButton({ label, state, durationMs, running = true, cycle = 0, onSelect, onComplete }: ProgressBarButtonProps) {
  const animated = state === "active" && durationMs !== undefined;

  return (
    <button
      type="button"
      aria-label={label}
      aria-current={state === "active" ? "true" : undefined}
      onClick={onSelect}
      className="group/bar inline-flex h-11 w-10 shrink-0 cursor-pointer items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <span aria-hidden className="relative h-0.75 w-full overflow-hidden rounded-full bg-line-dark transition-colors duration-150 ease-tech group-hover/bar:bg-faint-dark">
        {animated ? (
          <span
            key={cycle}
            onAnimationEnd={onComplete}
            className="absolute inset-0 origin-left rounded-full bg-white"
            style={{
              animation: `tab-progress ${durationMs}ms linear forwards`,
              animationPlayState: running ? "running" : "paused",
            }}
          />
        ) : state !== "upcoming" ? (
          <span className="absolute inset-0 rounded-full bg-white" />
        ) : null}
      </span>
    </button>
  );
}
