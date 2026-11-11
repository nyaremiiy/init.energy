import type { Metadata } from "next";

import { MaintenancePage } from "@/components/pages/maintenance-page";
import { getMessagesFor } from "@/i18n/messages";

type MaintenancePageProps = {
  searchParams: Promise<{ locale?: string }>;
};

export async function generateMetadata({ searchParams }: MaintenancePageProps): Promise<Metadata> {
  const { locale } = await searchParams;
  const currentLocale = locale === "en" ? "en" : "uk";

  return {
    title: getMessagesFor(currentLocale).maintenance.metaTitle,
    robots: { index: false, follow: false },
  };
}

export default async function SiteMaintenancePage({ searchParams }: MaintenancePageProps) {
  const { locale } = await searchParams;
  return <MaintenancePage locale={locale === "en" ? "en" : "uk"} />;
}
