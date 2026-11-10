export type LeadFieldErrors = Partial<
  Record<"name" | "phone" | "consent", string>
>;

export type LeadFormCopy = {
  errors: {
    name: string;
    phone: string;
    consent: string;
  };
};

export type ValidLead = {
  name: string;
  phone: string;
  comment: string;
  objectType: string;
  /** JSON from the quick calculator (inputs + recommendation), empty if unused. */
  calculatorData: string;
  /** Product slug when the form is on a product page. */
  product: string;
  pageUrl: string;
  tracking: Record<string, string>;
};

const phoneCharacters = /^\+?[\d\s()./-]+$/;
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

const getText = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

export function normalizePhone(value: string): string {
  const phone = value.trim();
  const digits = phone.replace(/\D/g, "");

  return phone.startsWith("+") ? `+${digits}` : digits;
}

export function isValidPhone(value: string): boolean {
  const phone = value.trim();
  if (!phoneCharacters.test(phone)) return false;

  const digitCount = phone.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
}

export function validateLeadForm(
  formData: FormData,
  copy: LeadFormCopy,
): { data?: ValidLead; errors: LeadFieldErrors; isSpam: boolean } {
  const name = getText(formData, "name");
  const rawPhone = getText(formData, "phone");
  const phone = normalizePhone(rawPhone);
  const consent = formData.get("consent") === "on";
  const errors: LeadFieldErrors = {};

  if (!name) errors.name = copy.errors.name;
  if (!isValidPhone(rawPhone)) errors.phone = copy.errors.phone;
  if (!consent) errors.consent = copy.errors.consent;

  if (Object.keys(errors).length > 0) {
    return { errors, isSpam: false };
  }

  return {
    errors,
    isSpam: Boolean(getText(formData, "website")),
    data: {
      name,
      phone,
      comment: getText(formData, "comment"),
      objectType: getText(formData, "objectType"),
      calculatorData: getText(formData, "calculatorData"),
      product: getText(formData, "product"),
      pageUrl: getText(formData, "pageUrl"),
      tracking: Object.fromEntries(
        trackingKeys.map((key) => [key, getText(formData, key)]),
      ),
    },
  };
}
