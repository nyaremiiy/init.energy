"use client";

import { ArrowUpRight } from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { submitLead } from "@/app/actions/lead";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form/checkbox";
import { Field } from "@/components/ui/form/field";
import { FormCard } from "@/components/ui/form/form-card";
import { focusFirstInvalid } from "@/components/ui/form/focus";
import { RadioPills } from "@/components/ui/form/radio-pills";
import { Textarea, TextInput } from "@/components/ui/form/controls";
import { InlineLink } from "@/components/ui/inline-link";
import { useToast } from "@/components/ui/toast";
import { routes } from "@/content/routes";
import {
  CALCULATOR_APPLY_EVENT,
  type CalculatorApplyDetail,
} from "@/lib/calculator-bridge";
import { validateLeadForm, type LeadFieldErrors } from "@/lib/lead-form-schema";
import { trackEvent } from "@/lib/analytics";
import { storedTracking, trackingKeys } from "@/lib/consent/tracking";
import { useLocale, useMessages } from "@/i18n/client";

export type LeadObjectType = "apartment" | "house" | "business" | "hotel" | "infrastructure" | "other";

type LeadFormProps = {
  defaultObjectType?: LeadObjectType;
  /** Product slug sent as a hidden field (product pages). */
  product?: string;
  submitLabel?: string;
  commentPlaceholder?: string;
  /** Card background: "surface" on white sections, "white" on the light-blue panel. */
  cardTone?: "surface" | "white";
  objectTypes?: LeadObjectType[];
};

const defaultObjectTypes: LeadObjectType[] = [
  "apartment",
  "house",
  "business",
  "other",
];

/** Order used to move focus to the first invalid field. */
const fieldOrder = ["name", "phone", "consent"] as const;

export function LeadForm({
  defaultObjectType,
  product,
  submitLabel,
  commentPlaceholder,
  cardTone = "surface",
  objectTypes = defaultObjectTypes,
}: LeadFormProps) {
  const t = useMessages().leadSection.form;
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const [objectType, setObjectType] = useState<LeadObjectType | undefined>(
    defaultObjectType,
  );
  // Parameters handed over by the quick calculator (hidden field → CRM).
  const [calculator, setCalculator] = useState<CalculatorApplyDetail>();

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
    if (first) focusFirstInvalid(formRef.current);
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
    // UTM / click IDs: this URL, the landing page of the session, or the consented cookie.
    const tracking = storedTracking();
    trackingKeys.forEach((key) => {
      formData.set(key, tracking[key] ?? "");
    });

    const clientResult = validateLeadForm(formData, t);
    if (!clientResult.data && !clientResult.isSpam) {
      setErrors(clientResult.errors);
      focusFirstError(clientResult.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const result = await submitLead(formData);

      if (!result.success) {
        setErrors(result.errors);
        setSubmitting(false);
        focusFirstError(result.errors);
        if (Object.keys(result.errors).length === 0) {
          toast.show("error", t.failure);
        }
        return;
      }

      form.reset();
      setCalculator(undefined);
      setSubmitting(false);
      trackEvent({ event: "generate_lead", calculator: calculator?.data ?? "" });
      toast.show("success", t.success);
    } catch {
      setSubmitting(false);
      toast.show("error", t.failure);
    }
  }

  return (
    <FormCard
      ref={formRef}
      noValidate
      tone={cardTone === "white" ? "white" : "surface"}
      busy={submitting}
      onSubmit={handleSubmit}
      onInput={clearFieldError}
      onChange={clearFieldError}
    >
      <input type="hidden" name="locale" value={locale} />

      <RadioPills
        legend={t.objectType}
        name="objectType"
        options={objectTypes.map((type) => ({ value: type, label: t.objectTypes[type] }))}
        value={objectType}
        onChange={(value) => setObjectType(value as LeadObjectType)}
      />

      {calculator ? (
        <p className="rounded-field border border-line bg-white px-4 py-3 text-small text-muted motion-safe:animate-enter">
          {t.calculatorAttached}{" "}
          <span className="font-medium text-ink">{calculator.summary}</span>
        </p>
      ) : null}
      <input type="hidden" name="product" value={product ?? ""} />
      <input type="hidden" name="calculatorData" value={calculator?.data ?? ""} />

      <Field label={t.name} error={errors.name} reserveMessage>
        <TextInput name="name" type="text" required autoComplete="name" placeholder={t.namePlaceholder} />
      </Field>

      <Field label={t.phone} error={errors.phone} reserveMessage>
        <TextInput name="phone" type="tel" required inputMode="tel" autoComplete="tel" placeholder={t.phonePlaceholder} />
      </Field>

      <Field label={t.comment} optional optionalLabel={t.optional}>
        <Textarea name="comment" rows={3} autoComplete="off" placeholder={commentPlaceholder ?? t.commentPlaceholder} />
      </Field>

      {/* Honeypot: hidden from people, filled only by bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="lead-website">Website</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" data-honeypot />
      </div>

      <div className="flex flex-col gap-2">
        <Checkbox name="consent" required invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "lead-consent-error" : undefined}>
          {t.consentBefore}{" "}
          <InlineLink href={routes.privacy}>{t.privacyPolicy}</InlineLink>{" "}
          {t.consentAfter}
        </Checkbox>
        <p id="lead-consent-error" className={`min-h-5 text-small text-ink ${errors.consent ? "opacity-100" : "opacity-0"}`}>
          {errors.consent ?? ""}
        </p>
      </div>

      <Button
        type="submit"
        variant="dark"
        fullWidth
        loading={submitting}
        icon={<ArrowUpRight aria-hidden className="size-4.5" />}
      >
        {submitting ? t.submitting : (submitLabel ?? t.submit)}
      </Button>
    </FormCard>
  );
}
