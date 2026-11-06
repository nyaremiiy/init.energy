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
  pageUrl: string;
  tracking: Record<string, string>;
};

const internationalPhone = /^\+[1-9]\d{7,14}$/;
const trackingKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "ttclid"] as const;

const getText = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

export function validateLeadForm(
  formData: FormData,
  copy: LeadFormCopy,
): { data?: ValidLead; errors: LeadFieldErrors; isSpam: boolean } {
  const name = getText(formData, "name");
  const phone = getText(formData, "phone").replace(/[\s()-]/g, "");
  const consent = formData.get("consent") === "on";
  const errors: LeadFieldErrors = {};

  if (!name) errors.name = copy.errors.name;
  if (!internationalPhone.test(phone)) errors.phone = copy.errors.phone;
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
      pageUrl: getText(formData, "pageUrl"),
      tracking: Object.fromEntries(
        trackingKeys.map((key) => [key, getText(formData, key)]),
      ),
    },
  };
}
