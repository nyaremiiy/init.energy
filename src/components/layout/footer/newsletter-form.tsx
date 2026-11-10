"use client";

import { type FormEvent, useState } from "react";

import { IconButton } from "@/components/ui/icon-button";

import { subscribe } from "@/app/actions/newsletter";
import { trackEvent } from "@/lib/analytics";
import { useLocale, useMessages } from "@/i18n/client";
import { validateNewsletter } from "@/lib/newsletter";
import { inputClasses } from "@/components/ui/input-styles";

type Status = "idle" | "submitting" | "success" | "failure";

export function NewsletterForm() {
  const t = useMessages().footer.newsletter;
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>();
  const submitting = status === "submitting";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const check = validateNewsletter(formData, t);

    if (!check.email && !check.isSpam) {
      setError(check.errors.email);
      setStatus("idle");
      (form.elements.namedItem("email") as HTMLInputElement | null)?.focus();
      return;
    }

    setError(undefined);
    setStatus("submitting");
    try {
      const result = await subscribe(formData);

      if (!result.success) {
        setError(result.errors.email);
        setStatus(result.errors.email ? "idle" : "failure");
        return;
      }

      form.reset();
      setStatus("success");
      // Analytics only after cookie consent (see lib/analytics).
      trackEvent({ event: "newsletter_subscribe" });
    } catch {
      setStatus("failure");
    }
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="text-small text-white motion-safe:animate-enter"
      >
        {t.success}
      </p>
    );
  }

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      aria-busy={submitting}
    >
      <input type="hidden" name="locale" value={locale} />
      <label htmlFor="footer-newsletter-email" className="sr-only">
        {t.emailLabel}
      </label>
      <div className="relative">
        <input
          id="footer-newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          required
          disabled={submitting}
          placeholder={t.emailPlaceholder}
          aria-invalid={error ? true : undefined}
          aria-describedby="footer-newsletter-error footer-newsletter-note"
          onInput={() => setError(undefined)}
          className={inputClasses({
            tone: "dark",
            invalid: Boolean(error),
            className: "pr-16",
          })}
        />
        <IconButton
          type="submit"
          aria-label={t.submit}
          disabled={submitting}
          loading={submitting}
          variant="solid-light"
          size="sm"
          className="absolute top-1.5 right-1.5"
        />
        <span className="sr-only" aria-live="polite">
          {submitting ? t.submitting : ""}
        </span>
      </div>

      {/* Honeypot: hidden from people, filled only by bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="footer-newsletter-company">Company</label>
        <input
          id="footer-newsletter-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p
        id="footer-newsletter-error"
        className={`mt-2 min-h-4 text-caption leading-4 text-white transition-opacity duration-200 ease-tech ${error || status === "failure" ? "opacity-100" : "opacity-0"}`}
        role={status === "failure" ? "alert" : undefined}
      >
        {error ?? (status === "failure" ? t.failure : "")}
      </p>
      <p
        id="footer-newsletter-note"
        className="mt-1 text-caption text-white/75"
      >
        {t.note}
      </p>
    </form>
  );
}
