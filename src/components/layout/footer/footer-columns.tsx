"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { pageNavigation } from "@/content/navigation";
import { useMessages } from "@/i18n/client";

import { footerLinkClasses } from "./footer-styles";

type FooterColumnsProps = {
  brand: ReactNode;
  sections: ReactNode;
  newsletter: ReactNode;
};

/**
 * Lays out the footer columns. Reads "on this page" anchors for the current
 * pathname (known at build time with SSG); without them the column is not
 * rendered and the remaining columns widen, so the grid has no gap.
 */
export function FooterColumns({
  brand,
  sections,
  newsletter,
}: FooterColumnsProps) {
  const pathname = usePathname();
  const t = useMessages().footer;
  const pageNav = pageNavigation[pathname] ?? [];
  const hasPageNav = pageNav.length > 0;

  return (
    <div className="grid grid-cols-2 gap-12 lg:grid-cols-24">
      <div
        className={`col-span-2 ${hasPageNav ? "lg:col-span-8" : "lg:col-span-10"}`}
      >
        {brand}
      </div>

      {hasPageNav ? (
        <nav aria-label={t.pageNavTitle} className="lg:col-span-5">
          <Eyebrow tone="dark" as="p" className="mb-5">
            {t.pageNavTitle}
          </Eyebrow>
          <ul className="flex flex-col gap-3">
            {pageNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={footerLinkClasses}>
                  {t.links[item.labelKey]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div
        className={hasPageNav ? "lg:col-span-5" : "col-span-2 lg:col-span-6"}
      >
        {sections}
      </div>

      <div
        className={`col-span-2 ${hasPageNav ? "lg:col-span-6" : "lg:col-span-8"}`}
      >
        {newsletter}
      </div>
    </div>
  );
}
