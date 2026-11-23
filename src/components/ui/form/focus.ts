/**
 * Moves focus to the first invalid control of a form (DOM order).
 * Waits one frame: called right after setting errors, before React has
 * rendered `aria-invalid` on the fields.
 */
export function focusFirstInvalid(form: HTMLFormElement | null) {
  requestAnimationFrame(() => {
    // Controls only: a <fieldset aria-invalid> (radio group) cannot take focus.
    form?.querySelector<HTMLElement>(":is(input, select, textarea, button)[aria-invalid='true']")?.focus();
  });
}
