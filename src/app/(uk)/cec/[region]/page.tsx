import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegionPage, regionMetadata } from "@/components/pages/region-page";
import { insolationRegions, regionBySlug } from "@/content/insolation";
import { setRequestLocale } from "@/i18n/server";

/** Region pages come from content/insolation.ts; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return insolationRegions.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cec/[region]">): Promise<Metadata> {
  const region = regionBySlug((await params).region);
  return region ? regionMetadata(region, "uk") : {};
}

export default async function RegionRoute({ params }: PageProps<"/cec/[region]">) {
  setRequestLocale("uk");
  const region = regionBySlug((await params).region);
  if (!region) notFound();
  return <RegionPage region={region} locale="uk" />;
}
