# Design QA — секція «Заявка на розрахунок»

- **Source visual truth:** `C:\Users\nyare\Pictures\Screenshots\Screenshot 2026-11-06 124539.png` (1080 × 730 px).
- **Implementation evidence:** `output/playwright/lead-desktop.png` (1440 × 1000 CSS px) and `output/playwright/lead-mobile.png` (360 × 800 CSS px).
- **Density:** device scale factor 1; comparison focused on the section region because the source includes an editorial presentation frame while the implementation includes the live sticky header.
- **State:** empty form for visual comparison; keyboard test additionally covered validation and success states.

## Findings

- No actionable P0/P1/P2 differences remain. The implementation preserves the reference composition: light section, equal columns, left process list, `surface` form card, pill radio group, white fields and one dark submit button.
- Expected project-system adaptation: exact screenshot colors and radii are mapped to existing `ink`, `surface`, `line`, `rounded-xl`, `rounded-3xl` and `rounded-full` utilities; no new visual token was added.

## Fidelity surfaces

- **Typography:** Montserrat heading/labels and Inter body copy follow the project system; H2 wraps to two lines at desktop and scales down on mobile.
- **Spacing and layout:** 1240 px content container, 64 px desktop grid gap, 40 px mobile stack gap, 120/88 px section padding and 24/40 px card padding verified.
- **Colors and surfaces:** white section, `surface` card, `line` dividers, `ink` active/submit states; no shadow, photo, gradient, blur or translucent glass styles.
- **Images:** the reference contains no section imagery, so no raster assets are required.
- **Copy and content:** Ukrainian copy matches the brief; English equivalents exist in `messages/en.json`.
- **Accessibility and interactions:** semantic section, H2, ordered list, fieldset/legend, native radios, visible labels, `aria-invalid`/`aria-describedby`, honeypot, checkbox and live success status.

## Interaction evidence

- ArrowRight moved selection from «Квартира» to «Будинок».
- Tab reached each field; Space checked consent; Enter submitted the form.
- Client and Server Action validation ran; valid submission rendered the success state.
- Browser console after the completed flow: 0 errors, 0 warnings.

## Comparison history

- First keyboard script missed the visually hidden radio because the automation clicked the input rather than its label. The product UI was unchanged; the corrected label-focus run confirmed native arrow-key behavior and the complete submit flow.

## Final result

passed
