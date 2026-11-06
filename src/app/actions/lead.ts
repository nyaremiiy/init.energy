"use server";

import { validateLeadForm, type LeadFieldErrors } from "@/lib/lead-form-schema";
import { messages } from "@/lib/messages";

export type LeadActionResult = {
  success: boolean;
  errors: LeadFieldErrors;
};

export async function submitLead(formData: FormData): Promise<LeadActionResult> {
  const result = validateLeadForm(formData, messages.leadSection.form);

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
