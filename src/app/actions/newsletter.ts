"use server";

import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";

function formLocale(formData: FormData): Locale {
  const value = formData.get("locale");
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
}
import {
  subscribeToNewsletter,
  validateNewsletter,
  type NewsletterErrors,
} from "@/lib/newsletter";

export type NewsletterResult = {
  success: boolean;
  errors: NewsletterErrors;
};

export async function subscribe(formData: FormData): Promise<NewsletterResult> {
  const result = validateNewsletter(
    formData,
    getMessagesFor(formLocale(formData)).footer.newsletter,
  );

  // Honeypot filled: pretend success, store nothing.
  if (result.isSpam) return { success: true, errors: {} };
  if (!result.email) return { success: false, errors: result.errors };

  await subscribeToNewsletter(result.email);

  return { success: true, errors: {} };
}
