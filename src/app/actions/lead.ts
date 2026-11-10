"use server";

import { validateLeadForm, type LeadFieldErrors } from "@/lib/lead-form-schema";
import { saveLead } from "@/lib/lead-storage";
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
  const locale = formLocale(formData);
  const result = validateLeadForm(
    formData,
    getMessagesFor(locale).leadSection.form,
  );

  if (result.isSpam) {
    return { success: true, errors: {} };
  }

  if (!result.data) {
    return { success: false, errors: result.errors };
  }

  await saveLead(result.data, locale);
  // TODO(integration): send the validated lead to the CRM.

  return { success: true, errors: {} };
}
