/**
 * Decorative wordmark across the full panel width, a quiet background
 * signature (`line-dark`, the closest token to white at 12%).
 * `lengthAdjust="spacing"` only adds letter spacing to fill `textLength`, so
 * glyphs are never stretched; the font size already fills the panel.
 * The viewBox is shorter than the glyphs (170 vs y=200), so the letters run
 * past the bottom edge and the panel's rounded corners crop them, with no
 * empty space underneath. Decoration only: aria-hidden, not a heading.
 */
export function FooterMark() {
  return (
    <svg
      viewBox="0 0 1408 170"
      width="100%"
      aria-hidden="true"
      focusable="false"
      className="-mt-2 block text-line-dark"
    >
      <text
        x="704"
        y="200"
        textAnchor="middle"
        textLength="1376"
        lengthAdjust="spacing"
        // Montserrat 600: "INIT ENERGY" is 664 units wide at 100 → 206 fills
        // 1376 naturally, so `spacing` only adds a hair of tracking.
        fontSize="206"
        fontWeight="600"
        fill="currentColor"
        className="font-heading"
      >
        INIT ENERGY
      </text>
    </svg>
  );
}
