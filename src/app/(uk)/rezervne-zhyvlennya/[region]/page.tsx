import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackupRegionPage, backupRegionMetadata } from "@/components/pages/backup-region-page";
import { insolationRegions, regionBySlug } from "@/content/insolation";
import { setRequestLocale } from "@/i18n/server";

/** Backup power region pages come from content/insolation.ts; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return insolationRegions.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({ params }: PageProps<"/rezervne-zhyvlennya/[region]">): Promise<Metadata> {
  const region = regionBySlug((await params).region);
  return region ? backupRegionMetadata(region, "uk") : {};
}

export default async function BackupRegionRoute({ params }: PageProps<"/rezervne-zhyvlennya/[region]">) {
  setRequestLocale("uk");
  const region = regionBySlug((await params).region);
  if (!region) notFound();
  return <BackupRegionPage region={region} locale="uk" />;
}
