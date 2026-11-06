/**
 * Decorative wordmark across the full panel width, a quiet background
 * signature (white at 14%). `lengthAdjust="spacing"` only adds letter
 * spacing to fill `textLength`, so glyphs are never stretched or overlapped;
 * the font size is chosen so the natural width already fills the panel.
 * The baseline sits at the bottom edge so the panel's rounded corners crop
 * the letters. Decoration only: aria-hidden, not a heading, no SEO weight.
 */
export function FooterMark() {
  return (
    <svg
      viewBox="0 0 1408 210"
      width="100%"
      aria-hidden="true"
      focusable="false"
      className="mt-14 block text-white/14"
    >
      <text
        x="704"
        y="222"
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
