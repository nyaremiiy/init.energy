import type { Metadata } from "next";

import { BackupPage } from "@/components/pages/backup-page";
import { routes } from "@/content/routes";
import { getMessagesFor } from "@/i18n/messages";
import { setRequestLocale } from "@/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  const t = getMessagesFor("en").backup.meta;
  return buildMetadata({
    title: t.title,
    description: t.description,
    path: routes.backup.hub,
    locale: "en",
  });
}

export default function EnglishBackupHubRoute() {
  setRequestLocale("en");
  return <BackupPage />;
}
