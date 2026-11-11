import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NichePage, nicheMetadata } from "@/components/pages/niche-page";
import { solutionPageBySlug, solutionPages } from "@/content/solutions";
import { setRequestLocale } from "@/i18n/server";

/** Niche solar pages are listed in content/solutions.ts (`solutionPages`); others are 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return solutionPages.map((page) => ({ segment: page.slug }));
}

export async function generateMetadata({ params }: PageProps<"/en/ses/[segment]">): Promise<Metadata> {
  const page = solutionPageBySlug((await params).segment);
  return page ? nicheMetadata(page, "en") : {};
}

export default async function EnglishNicheRoute({ params }: PageProps<"/en/ses/[segment]">) {
  setRequestLocale("en");
  const page = solutionPageBySlug((await params).segment);
  if (!page) notFound();
  return <NichePage page={page} locale="en" />;
}
