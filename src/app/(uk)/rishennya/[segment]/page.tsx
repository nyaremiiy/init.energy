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

export async function generateMetadata({ params }: PageProps<"/rishennya/[segment]">): Promise<Metadata> {
  const page = solutionPageBySlug((await params).segment);
  return page ? nicheMetadata(page, "uk") : {};
}

export default async function NicheRoute({ params }: PageProps<"/rishennya/[segment]">) {
  setRequestLocale("uk");
  const page = solutionPageBySlug((await params).segment);
  if (!page) notFound();
  return <NichePage page={page} locale="uk" />;
}
