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
      <Eyebrow tone="dark" size="compact" as="p" className="mb-7">
        {title}
      </Eyebrow>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} tone="dark" size="body" active={item.href === current}>
              {t.links[item.labelKey]}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Navigation row of the footer: brand · «On this page» · «Site sections».
 * Grid of 11 tracks on lg (5 / 3 / 3). Without page anchors the «On this page»
 * column is not rendered and «Site sections» takes its place (the last track stays empty).
 */
export function FooterColumns({ brand }: FooterColumnsProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useMessages().footer;
  const pageNav = pageNavigation[pathname] ?? [];

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-11 lg:gap-20">
      <div className="md:col-span-2 lg:col-span-5">{brand}</div>
      {pageNav.length > 0 ? <LinkColumn title={t.pageNavTitle} items={pageNav} /> : null}
      <LinkColumn title={t.sectionsTitle} items={getSiteSections(locale)} current={pathname} />
    </div>
  );
}
