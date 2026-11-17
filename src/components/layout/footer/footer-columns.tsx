"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { NavLink } from "@/components/ui/nav-link";
import { getSiteSections, pageNavigation, type NavEntry } from "@/content/navigation";
import { useLocale, useMessages } from "@/i18n/client";

type FooterColumnsProps = {
  brand: ReactNode;
  /** «Contacts» column (Server Component rendered in footer.tsx). */
  contacts: ReactNode;
};

function LinkColumn({ title, items, current }: { title: string; items: NavEntry[]; current?: string }) {
  const t = useMessages().footer;
  return (
    <nav aria-label={title} className="lg:col-span-3">
      <Eyebrow tone="dark" size="compact" as="p" className="mb-5">
        {title}
      </Eyebrow>
      <ul className="flex flex-col gap-3.5">
        {items.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} tone="dark" active={item.href === current}>
              {t.links[item.labelKey]}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Footer columns: brand · Contacts · «On this page» · «Site sections»
 * (4 : 3 : 3 : 3 on lg, 13 tracks). Without page anchors for this pathname the
 * «On this page» column is not rendered: brand · Contacts · Sections = 6 : 3 : 3.
 * Mobile: one column (brand → contacts → navs); sm: two columns below the brand.
 */
export function FooterColumns({ brand, contacts }: FooterColumnsProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useMessages().footer;
  const pageNav = pageNavigation[pathname] ?? [];
  const hasPageNav = pageNav.length > 0;

  return (
    <div className={`grid grid-cols-1 gap-12 sm:grid-cols-2 lg:gap-14 ${hasPageNav ? "lg:grid-cols-13" : "lg:grid-cols-12"}`}>
      <div className={`sm:col-span-2 ${hasPageNav ? "lg:col-span-4" : "lg:col-span-6"}`}>{brand}</div>
      {contacts}
      {hasPageNav ? <LinkColumn title={t.pageNavTitle} items={pageNav} /> : null}
      <LinkColumn title={t.sectionsTitle} items={getSiteSections(locale)} current={pathname} />
    </div>
  );
}
