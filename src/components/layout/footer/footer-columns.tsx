"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { NavLink } from "@/components/ui/nav-link";
import { getSiteSections, pageNavigation, type NavEntry } from "@/content/navigation";
import { useLocale, useMessages } from "@/i18n/client";

type FooterColumnsProps = {
  brand: ReactNode;
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
 * Footer columns: brand · «On this page» · «Site sections» (6 : 3 : 3 on lg).
 * Without page anchors for this pathname the «On this page» column is not
 * rendered and the brand takes 9 : 3. Mobile: one column; sm: the two navs side by side.
 */
export function FooterColumns({ brand }: FooterColumnsProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useMessages().footer;
  const pageNav = pageNavigation[pathname] ?? [];
  const hasPageNav = pageNav.length > 0;

  return (
    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-16">
      <div className={`sm:col-span-2 ${hasPageNav ? "lg:col-span-6" : "lg:col-span-9"}`}>{brand}</div>
      {hasPageNav ? <LinkColumn title={t.pageNavTitle} items={pageNav} /> : null}
      <LinkColumn title={t.sectionsTitle} items={getSiteSections(locale)} current={pathname} />
    </div>
  );
}
