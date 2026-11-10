import { appendFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

import type { Locale } from "@/i18n/config";
import type { ValidLead } from "@/lib/lead-form-schema";

type StoredLead = ValidLead & {
  id: string;
  locale: Locale;
  submittedAt: string;
};

const storageFile =
  process.env.LEAD_STORAGE_FILE ??
  path.join(process.cwd(), "storage", "leads.jsonl");

export async function saveLead(data: ValidLead, locale: Locale): Promise<void> {
  const lead: StoredLead = {
    ...data,
    id: randomUUID(),
    locale,
    submittedAt: new Date().toISOString(),
  };

  await mkdir(path.dirname(storageFile), { recursive: true });
  await appendFile(storageFile, `${JSON.stringify(lead)}\n`, "utf8");
}
