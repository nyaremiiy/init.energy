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
import { FormStatus } from "@/components/ui/form/form-status";
import { RadioPills } from "@/components/ui/form/radio-pills";
import { Textarea, TextInput } from "@/components/ui/form/controls";
import { Heading } from "@/components/ui/heading";
import { InlineLink } from "@/components/ui/inline-link";
import { useToast } from "@/components/ui/toast";
import { offices } from "@/content/company";
import { objectTypeIcons } from "@/content/segments";
import { routes } from "@/content/routes";
import { formatPhone } from "@/lib/format";
import {
  CALCULATOR_APPLY_EVENT,
  resetCalculators,
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
  objectTypes = defaultObjectTypes,
}: LeadFormProps) {
  const t = useMessages().leadSection.form;
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  // Inline copy of the last result (the toast may be missed).
  const [result, setResult] = useState<"success" | "failure" | null>(null);
  const mainPhone = offices[0].phone;
  const toast = useToast();
  const [objectType, setObjectType] = useState<LeadObjectType | undefined>(
    defaultObjectType,
  );
  // Fields chosen in a calculator on this page (hidden field → CRM). Re-sent
  // on every calculator change after the first hand-over.
  const [calculator, setCalculator] = useState<CalculatorApplyDetail>();
  // Once the visitor picks the object type here, calculator updates no longer change it.
  const typePickedInForm = useRef(false);

  useEffect(() => {
    function onApply(event: Event) {
      const detail = (event as CustomEvent<CalculatorApplyDetail>).detail;
      if (detail.objectType && !typePickedInForm.current) setObjectType(detail.objectType);
      setCalculator(detail);
    }

    window.addEventListener(CALCULATOR_APPLY_EVENT, onApply);
    return () => window.removeEventListener(CALCULATOR_APPLY_EVENT, onApply);
  }, []);

  // The calculator data stays, but the CRM sees that the form type differs.
  const calculatorData = calculator
    ? JSON.stringify(
        objectType !== undefined && objectType !== calculator.resultObjectType
          ? { ...calculator.data, objectTypeOverridden: true }
          : calculator.data,
      )
    : "";

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
    setResult(null);
    setSubmitting(true);
    try {
      const result = await submitLead(formData);

      if (!result.success) {
        setErrors(result.errors);
        setSubmitting(false);
        focusFirstError(result.errors);
        if (Object.keys(result.errors).length === 0) {
          setResult("failure");
          toast.show("error", t.failure);
        }
        return;
      }

      form.reset();
      setCalculator(undefined);
      typePickedInForm.current = false;
      resetCalculators();
      setSubmitting(false);
      trackEvent({
        event: "generate_lead",
        calculator: calculator?.data.calculator ?? "",
        calculatorFields: calculator?.data.changedFields.length ?? 0,
      });
      setResult("success");
      toast.show("success", t.success);
    } catch {
      setSubmitting(false);
      setResult("failure");
      toast.show("error", t.failure);
    }
  }

  return (
    <FormCard
      ref={formRef}
      noValidate
      tone="surface"
      busy={submitting}
      stackClassName="gap-6"
      className="lg:rounded-panel"
      onSubmit={handleSubmit}
      onInput={clearFieldError}
      onChange={clearFieldError}
    >
      <input type="hidden" name="locale" value={locale} />

      {/* Card header: H3 under the section H2. */}
      <div className="flex flex-col gap-1 border-b border-line pb-6">
        <Heading as="h3" size="h3" weight="semibold" className="text-ink">
          {t.cardTitle}
        </Heading>
        <p className="text-small text-muted">{t.cardNote}</p>
      </div>

      {result ? (
        <FormStatus
          status={result}
          message={result === "success" ? t.success : t.failure}
          phone={{ display: formatPhone(mainPhone.display), href: mainPhone.href }}
        />
      ) : null}

      <RadioPills
        legend={t.objectType}
        name="objectType"
        variant="tiles"
        options={objectTypes.map((type) => ({ value: type, label: t.objectTypes[type], icon: objectTypeIcons[type] }))}
        value={objectType}
        onChange={(value) => {
          typePickedInForm.current = true;
          setObjectType(value as LeadObjectType);
        }}
      />

      {calculator ? (
        <p className="rounded-field border border-line bg-white px-4 py-3 text-small text-muted motion-safe:animate-enter">
          {t.calculatorAttached}{" "}
          <span className="font-medium text-ink">{calculator.summary}</span>
        </p>
      ) : null}
      <input type="hidden" name="product" value={product ?? ""} />
      <input type="hidden" name="calculatorData" value={calculatorData} />

      {/* Name and phone side by side from sm. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t.name} error={errors.name} reserveMessage>
          <TextInput name="name" type="text" required autoComplete="name" placeholder={t.namePlaceholder} />
        </Field>

        <Field label={t.phone} error={errors.phone} reserveMessage>
          <TextInput name="phone" type="tel" required inputMode="tel" autoComplete="tel" placeholder={t.phonePlaceholder} />
        </Field>
      </div>

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
