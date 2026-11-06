"use client";

import { ArrowUpRight, Check, CircleCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { type FormEvent, type ReactNode, useRef, useState } from "react";

import { submitLead } from "@/app/actions/lead";
import { routes } from "@/content/routes";
import { validateLeadForm, type LeadFieldErrors } from "@/lib/lead-form-schema";
import { messages } from "@/lib/messages";

export type LeadObjectType = "apartment" | "house" | "business" | "other";

type LeadFormProps = {
  defaultObjectType?: LeadObjectType;
};

type Status = "idle" | "submitting" | "success" | "serverError";

const objectTypes: LeadObjectType[] = [
  "apartment",
  "house",
  "business",
  "other",
];

const trackingKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ttclid",
] as const;

/** Order used to move focus to the first invalid field. */
const fieldOrder = ["name", "phone", "consent"] as const;

/**
 * Field states: default (white, `line` border) · hover (`ink/40` border) ·
 * focus-visible (`ink` border + soft 3px `ink/10` ring) · error (`ink` border) ·
 * disabled (`surface` background, muted text). Colour-only transitions.
 */
const fieldClasses =
  "w-full rounded-field border bg-white px-4 text-base text-ink placeholder:text-ink/45 transition-colors duration-200 ease-tech hover:border-ink/40 focus-visible:border-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink/10 disabled:cursor-not-allowed disabled:bg-surface disabled:text-ink/70 disabled:hover:border-line";

const borderFor = (error?: string) => (error ? "border-ink" : "border-line");

/** Space for the error is always reserved, so the layout never jumps. */
function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p
      id={id}
      className={`-mt-0.5 min-h-4 text-caption leading-4 text-ink transition-opacity duration-200 ease-tech ${message ? "opacity-100" : "opacity-0"}`}
    >
      {message}
    </p>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium text-ink">{children}</span>;
}

export function LeadForm({ defaultObjectType }: LeadFormProps) {
  const t = messages.leadSection.form;
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const submitting = status === "submitting";

  const focusFirstError = (fieldErrors: LeadFieldErrors) => {
    const first = fieldOrder.find((key) => fieldErrors[key]);
    const element = first ? formRef.current?.elements.namedItem(first) : null;

    if (element instanceof HTMLElement) element.focus();
  };

  /** A field's error disappears as soon as the user edits that field. */
  const clearFieldError = (event: FormEvent<HTMLFormElement>) => {
    const { name } = event.target as HTMLInputElement;

    if (name in errors) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name as keyof LeadFieldErrors];
        return next;
      });
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const url = new URL(window.location.href);

    formData.set("pageUrl", url.href);
    trackingKeys.forEach((key) => {
      formData.set(key, url.searchParams.get(key) ?? "");
    });

    const clientResult = validateLeadForm(formData, t);
    if (!clientResult.data && !clientResult.isSpam) {
      setErrors(clientResult.errors);
      setStatus("idle");
      focusFirstError(clientResult.errors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const result = await submitLead(formData);

      if (!result.success) {
        setErrors(result.errors);
        setStatus(
          Object.keys(result.errors).length > 0 ? "idle" : "serverError",
        );
        focusFirstError(result.errors);
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("serverError");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-3xl bg-surface p-6 motion-safe:animate-enter sm:p-10"
      >
        <CircleCheck
          aria-hidden
          className="size-8 text-ink"
          strokeWidth={1.5}
        />
        <p className="font-heading text-xl leading-snug font-semibold tracking-tight text-ink">
          {t.success}
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      // No browser form history: earlier entries must not appear as suggestions.
      autoComplete="off"
      onSubmit={handleSubmit}
      onInput={clearFieldError}
      onChange={clearFieldError}
      aria-busy={submitting}
      className="rounded-3xl bg-surface p-6 sm:p-10"
    >
      {/* Disabling the fieldset disables every control while sending. */}
      <fieldset
        disabled={submitting}
        className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0"
      >
        <fieldset className="m-0 border-0 p-0 pb-2">
          <legend className="mb-3 text-sm font-medium text-ink">
            {t.objectType}
          </legend>
          {/* Native radios: arrow keys move the selection inside the group. */}
          <div className="flex flex-wrap gap-2">
            {objectTypes.map((objectType) => (
              <label key={objectType} className="cursor-pointer">
                <input
                  type="radio"
                  name="objectType"
                  value={objectType}
                  defaultChecked={defaultObjectType === objectType}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-5 text-sm font-medium text-ink transition-colors duration-180 ease-tech hover:border-ink/40 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-3 peer-focus-visible:ring-ink/15 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {t.objectTypes[objectType]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex flex-col gap-2">
          <FieldLabel>{t.name}</FieldLabel>
          <input
            name="name"
            type="text"
            required
            autoComplete="off"
            placeholder={t.namePlaceholder}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby="lead-name-error"
            className={`${fieldClasses} h-14 ${borderFor(errors.name)}`}
          />
          <FieldError id="lead-name-error" message={errors.name} />
        </label>

        <label className="flex flex-col gap-2">
          <FieldLabel>{t.phone}</FieldLabel>
          <input
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="off"
            placeholder={t.phonePlaceholder}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby="lead-phone-error"
            className={`${fieldClasses} h-14 ${borderFor(errors.phone)}`}
          />
          <FieldError id="lead-phone-error" message={errors.phone} />
        </label>

        <label className="flex flex-col gap-2 pb-2">
          <FieldLabel>
            {t.comment}{" "}
            <span className="font-normal text-ink/70">({t.optional})</span>
          </FieldLabel>
          <textarea
            name="comment"
            rows={3}
            autoComplete="off"
            placeholder={t.commentPlaceholder}
            className={`${fieldClasses} min-h-28 resize-none py-4 border-line`}
          />
        </label>

        <div className="sr-only" aria-hidden="true">
          <label htmlFor="lead-website">Website</label>
          <input
            id="lead-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/70 has-disabled:cursor-not-allowed">
            {/* Custom box (no accent-color) so it looks the same in every browser. */}
            <span className="relative mt-0.5 inline-flex size-5 shrink-0">
              <input
                name="consent"
                type="checkbox"
                required
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby="lead-consent-error"
                className={`peer size-5 cursor-pointer appearance-none rounded-md border bg-white transition-colors duration-200 ease-tech hover:border-ink/40 checked:border-ink checked:bg-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink/15 disabled:cursor-not-allowed disabled:not-checked:bg-surface ${borderFor(errors.consent)}`}
              />
              <Check
                aria-hidden
                strokeWidth={3}
                className="pointer-events-none absolute inset-0 m-auto size-3.5 text-white opacity-0 transition-opacity duration-150 ease-tech peer-checked:opacity-100"
              />
            </span>
            <span>
              {t.consentBefore}{" "}
              <Link
                href={routes.privacy}
                className="rounded-sm text-ink underline decoration-ink/40 underline-offset-2 transition-colors duration-200 ease-tech hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {t.privacyPolicy}
              </Link>{" "}
              {t.consentAfter}
            </span>
          </label>
          <FieldError id="lead-consent-error" message={errors.consent} />
        </div>

        {status === "serverError" ? (
          <p
            role="alert"
            className="rounded-field border border-ink bg-white px-4 py-3 text-sm text-ink motion-safe:animate-enter"
          >
            {t.failure}
          </p>
        ) : null}

        <button
          type="submit"
          className={`group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 font-heading text-base font-semibold text-white transition duration-150 ease-tech focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink motion-safe:active:scale-98 motion-safe:active:duration-120 disabled:cursor-not-allowed ${submitting ? "pointer-events-none opacity-80" : ""}`}
        >
          {submitting ? (
            <>
              <Loader2
                aria-hidden
                className="size-4 motion-safe:animate-spin"
              />
              {t.submitting}
            </>
          ) : (
            <>
              {t.submit}
              <ArrowUpRight
                aria-hidden
                className="size-4.5 transition-transform duration-150 ease-tech motion-safe:group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </fieldset>
    </form>
  );
}
