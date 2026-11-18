/**
 * Moves focus to the first invalid control of a form (DOM order).
 * Waits one frame: called right after setting errors, before React has
 * rendered `aria-invalid` on the fields.
 */
export function focusFirstInvalid(form: HTMLFormElement | null) {
  requestAnimationFrame(() => {
    form?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  });
}
