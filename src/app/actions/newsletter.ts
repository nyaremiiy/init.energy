"use server";

import { messages } from "@/lib/messages";
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
  const result = validateNewsletter(formData, messages.footer.newsletter);

  // Honeypot filled: pretend success, store nothing.
  if (result.isSpam) return { success: true, errors: {} };
  if (!result.email) return { success: false, errors: result.errors };

  await subscribeToNewsletter(result.email);

  return { success: true, errors: {} };
}
