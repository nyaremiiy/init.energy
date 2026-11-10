"use client";

import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { submitLead } from "@/app/actions/lead";
import { Button } from "@/components/ui/button";
import { inputClasses } from "@/components/ui/input-styles";
import { PillRadio } from "@/components/ui/pill-radio";
import { useToast } from "@/components/ui/toast";
import { routes } from "@/content/routes";
import {
  CALCULATOR_APPLY_EVENT,
  type CalculatorApplyDetail,
} from "@/lib/calculator-bridge";
import { validateLeadForm, type LeadFieldErrors } from "@/lib/lead-form-schema";
import { useLocale, useMessages } from "@/i18n/client";

export type LeadObjectType = "apartment" | "house" | "business" | "other";

type LeadFormProps = {
  defaultObjectType?: LeadObjectType;
  /** Product slug sent as a hidden field (product pages). */
  product?: string;
  submitLabel?: string;
  /** Card background: "surface" on white sections, "white" on the light-blue panel. */
  cardTone?: "surface" | "white";
};

type Status = "idle" | "submitting";

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

const borderFor = (error?: string) => (error ? "border-ink" : "border-line");

/** Space for the error is always reserved, so the layout never jumps. */
function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p
      id={id}
      className={`-mt-0.5 min-h-5 text-sm text-ink transition-opacity duration-200 ease-tech ${message ? "opacity-100" : "opacity-0"}`}
    >
      {message}
    </p>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium text-ink">{children}</span>;
}

export function LeadForm({
  defaultObjectType,
  product,
  submitLabel,
  cardTone = "surface",
}: LeadFormProps) {
  const t = useMessages().leadSection.form;
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const toast = useToast();
  const [objectType, setObjectType] = useState<LeadObjectType | undefined>(
    defaultObjectType,
  );
  // Parameters handed over by the quick calculator (hidden field → CRM).
  const [calculator, setCalculator] = useState<CalculatorApplyDetail>();
  const submitting = status === "submitting";
  const cardBg = cardTone === "white" ? "bg-white" : "bg-surface";

  useEffect(() => {
    function onApply(event: Event) {
      const detail = (event as CustomEvent<CalculatorApplyDetail>).detail;
      setObjectType(detail.objectType);
      setCalculator(detail);
    }

    window.addEventListener(CALCULATOR_APPLY_EVENT, onApply);
    return () => window.removeEventListener(CALCULATOR_APPLY_EVENT, onApply);
  }, []);

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
        setStatus("idle");
        focusFirstError(result.errors);
        if (Object.keys(result.errors).length === 0) {
          toast.show("error", t.failure);
        }
        return;
      }

      form.reset();
      setCalculator(undefined);
      setStatus("idle");
      toast.show("success", t.success);
    } catch {
      setStatus("idle");
      toast.show("error", t.failure);
    }
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
      className={`rounded-3xl shadow-card ${cardBg} px-4.5 py-card-sm sm:px-card-sm lg:p-card`}
    >
      <input type="hidden" name="locale" value={locale} />
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
            {objectTypes.map((type) => (
              <PillRadio
                key={type}
                name="objectType"
                value={type}
                checked={objectType === type}
                onChange={() => setObjectType(type)}
              >
                {t.objectTypes[type]}
              </PillRadio>
            ))}
          </div>
        </fieldset>

        {calculator ? (
          <p className="rounded-field border border-line bg-white px-4 py-3 text-sm text-ink/70 motion-safe:animate-enter">
            {t.calculatorAttached}{" "}
            <span className="font-medium text-ink">{calculator.summary}</span>
          </p>
        ) : null}
        <input type="hidden" name="product" value={product ?? ""} />
        <input
          type="hidden"
          name="calculatorData"
          value={calculator?.data ?? ""}
        />

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
            className={inputClasses({ invalid: Boolean(errors.name) })}
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
            className={inputClasses({ invalid: Boolean(errors.phone) })}
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
            className={inputClasses({ multiline: true })}
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

        <Button
          type="submit"
          variant="dark"
          className={`w-full ${submitting ? "pointer-events-none opacity-80" : ""}`}
          icon={
            submitting ? (
              <Loader2
                aria-hidden
                className="size-4 motion-safe:animate-spin"
              />
            ) : (
              <ArrowUpRight aria-hidden className="size-4.5" />
            )
          }
        >
          {submitting ? t.submitting : (submitLabel ?? t.submit)}
        </Button>
      </fieldset>
    </form>
  );
}
