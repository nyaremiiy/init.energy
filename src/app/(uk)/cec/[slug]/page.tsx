import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegionPage, regionMetadata } from "@/components/pages/region-page";
import { SesPowerPage, sesPowerMetadata } from "@/components/pages/ses-power-page";
import { insolationRegions, regionBySlug } from "@/content/insolation";
import { sesPowerBySlug, sesPowerPages } from "@/content/ses-power";
import { setRequestLocale } from "@/i18n/server";

/**
 * /cec/{slug}/: a region page (content/insolation.ts, «lvivska-oblast») or a
 * plant power page (content/ses-power.ts, «5-kvt») — one dynamic segment, the
 * two slug lists never overlap. Any other slug is a 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return [...insolationRegions.map((region) => region.slug), ...sesPowerPages.map((page) => page.slug)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/cec/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const region = regionBySlug(slug);
  if (region) return regionMetadata(region, "uk");
  const power = sesPowerBySlug(slug);
  return power ? sesPowerMetadata(power, "uk") : {};
}

export default async function CecSlugRoute({ params }: PageProps<"/cec/[slug]">) {
  setRequestLocale("uk");
  const { slug } = await params;
  const region = regionBySlug(slug);
  if (region) return <RegionPage region={region} locale="uk" />;
  const power = sesPowerBySlug(slug);
  if (!power) notFound();
  return <SesPowerPage page={power} locale="uk" />;
}
