export type NewsletterErrors = Partial<Record<"email", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateNewsletter(
  formData: FormData,
  copy: { errors: { email: string } },
): { email?: string; errors: NewsletterErrors; isSpam: boolean } {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const isSpam = Boolean(String(formData.get("company") ?? "").trim());

  if (!emailPattern.test(email)) {
    return { errors: { email: copy.errors.email }, isSpam };
  }

  return { email, errors: {}, isSpam };
}

/**
 * Newsletter service adapter.
 * TODO(integration): connect the mailing service (e.g. Sendpulse, Mailchimp).
 * Until then nothing is sent anywhere.
 */
export async function subscribeToNewsletter(email: string): Promise<void> {
  void email;
}
