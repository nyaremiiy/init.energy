"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";

import { submitLead } from "@/app/actions/lead";
import { routes } from "@/content/routes";
import {
  validateLeadForm,
  type LeadFieldErrors,
} from "@/lib/lead-form-schema";
import { messages } from "@/lib/messages";

export type LeadObjectType = "apartment" | "house" | "business" | "other";

type LeadFormProps = {
  defaultObjectType?: LeadObjectType;
};

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

const fieldClasses =
  "w-full rounded-xl border border-line bg-white px-4 text-base text-ink placeholder:text-ink/45 transition-colors focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function LeadForm({ defaultObjectType }: LeadFormProps) {
  const t = messages.leadSection.form;
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const url = new URL(window.location.href);

    formData.set("pageUrl", url.href);
    trackingKeys.forEach((key) => {
      formData.set(key, url.searchParams.get(key) ?? "");
    });

    const clientResult = validateLeadForm(formData, t);
    if (!clientResult.data && !clientResult.isSpam) {
      setErrors(clientResult.errors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    const result = await submitLead(formData);

    if (!result.success) {
      setErrors(result.errors);
      setStatus("idle");
      return;
    }

    setStatus("success");
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex min-h-96 items-center rounded-3xl bg-surface p-6 text-lg leading-relaxed text-ink sm:p-10"
      >
        {t.success}
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-3xl bg-surface p-6 sm:p-10"
    >
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-3 text-sm font-medium text-ink">
          {t.objectType}
        </legend>
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
              <span className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-5 text-sm font-medium text-ink transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                {t.objectTypes[objectType]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2 text-sm font-medium text-ink">
        {t.name}
        <input
          name="name"
          type="text"
          autoComplete="name"
          placeholder={t.namePlaceholder}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "lead-name-error" : undefined}
          className={`${fieldClasses} h-14 ${errors.name ? "border-ink" : ""}`}
        />
        {errors.name ? (
          <span id="lead-name-error" className="text-sm font-normal text-ink">
            {errors.name}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-ink">
        {t.phone}
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={t.phonePlaceholder}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "lead-phone-error" : undefined}
          className={`${fieldClasses} h-14 ${errors.phone ? "border-ink" : ""}`}
        />
        {errors.phone ? (
          <span id="lead-phone-error" className="text-sm font-normal text-ink">
            {errors.phone}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-ink">
        <span>
          {t.comment}{" "}
          <span className="font-normal text-ink/70">({t.optional})</span>
        </span>
        <textarea
          name="comment"
          rows={3}
          placeholder={t.commentPlaceholder}
          className={`${fieldClasses} min-h-28 resize-none py-4`}
        />
      </label>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="lead-website">Website</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} />
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-ink/70">
        <input
          name="consent"
          type="checkbox"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "lead-consent-error" : undefined}
          className="mt-0.5 size-5 shrink-0 accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        />
        <span>
          {t.consentBefore}{" "}
          <Link
            href={routes.privacy}
            className="text-ink underline decoration-ink/40 underline-offset-2 hover:decoration-ink"
          >
            {t.privacyPolicy}
          </Link>{" "}
          {t.consentAfter}
        </span>
      </label>
      {errors.consent ? (
        <p id="lead-consent-error" className="-mt-4 text-sm text-ink">
          {errors.consent}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-base font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? t.submitting : t.submit}
        <ArrowUpRight
          aria-hidden
          className="size-4.5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
        />
      </button>
    </form>
  );
}
