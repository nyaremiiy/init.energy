/** Moves focus to the first invalid control of a form (order follows the form). */
export function focusFirstInvalid(form: HTMLFormElement | null) {
  const first = form?.querySelector<HTMLElement>("[aria-invalid='true']");
  first?.focus();
}
