/**
 * Decorative wordmark across the full panel width. `textLength` +
 * `lengthAdjust` make the text fill the width exactly on any screen; the
 * baseline sits below the bottom edge so the panel's rounded corners clip the
 * letters. Decoration only: aria-hidden, not a heading, no SEO weight.
 */
export function FooterMark() {
  return (
    <svg
      viewBox="0 0 1408 210"
      width="100%"
      aria-hidden="true"
      focusable="false"
      className="mt-14 block"
    >
      <text
        x="704"
        y="232"
        textAnchor="middle"
        textLength="1376"
        lengthAdjust="spacingAndGlyphs"
        fontSize="270"
        fontWeight="600"
        fill="currentColor"
        className="font-heading text-white"
      >
        INIT ENERGY
      </text>
    </svg>
  );
}
