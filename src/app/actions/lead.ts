"use server";

import { validateLeadForm, type LeadFieldErrors } from "@/lib/lead-form-schema";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";

function formLocale(formData: FormData): Locale {
  const value = formData.get("locale");
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
}

export type LeadActionResult = {
  success: boolean;
  errors: LeadFieldErrors;
};

export async function submitLead(
  formData: FormData,
): Promise<LeadActionResult> {
  const result = validateLeadForm(
    formData,
    getMessagesFor(formLocale(formData)).leadSection.form,
  );

  if (result.isSpam) {
    return { success: true, errors: {} };
  }

  if (!result.data) {
    return { success: false, errors: result.errors };
  }

  console.info("lead_submission", result.data);
  // TODO(integration): send the validated lead to the CRM.

  return { success: true, errors: {} };
}
