"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

import { NavLink } from "./nav-link";

type RegionMenuLinkProps = {
  href: string;
  slug: string;
  name: string;
  /** «офіс» label for regions with an office. */
  officeLabel?: string;
  /** Mobile menu: narrower side padding for two columns at 360 px. */
  compact?: boolean;
};

/**
 * One region in the «Регіони» menu: pin, name, optional «офіс» label and an
 * arrow on hover / focus. The region the visitor is on (solar or backup page)
 * gets the surface background; `aria-current` only on the exact URL.
 */
export function RegionMenuLink({ href, slug, name, officeLabel, compact = false }: RegionMenuLinkProps) {
  const pathname = usePathname();
  const onThisRegion = new RegExp(`/(cec|rezervne-zhyvlennya)/${slug}/$`).test(pathname);

  return (
    <NavLink
      href={href}
      aria-current={pathname === href ? "page" : undefined}
      className={`group/region flex min-h-10 items-center gap-2 rounded-field py-2 text-small text-ink transition-colors duration-150 ease-tech hover:bg-surface focus-visible:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        compact ? "px-2" : "px-3"
      } ${onThisRegion ? "bg-surface" : ""}`}
    >
      <MapPin
        aria-hidden
        className={`size-4 shrink-0 transition-colors duration-150 group-hover/region:text-ink group-focus-visible/region:text-ink ${onThisRegion ? "text-ink" : "text-muted"}`}
      />
      {/* Name and label wrap as a pair in narrow columns (mobile, 360 px) instead of overlapping. */}
      <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
        <span>{name}</span>
        {officeLabel ? (
          <span className="rounded-full bg-sky px-2 text-eyebrow-sm font-medium text-ink">{officeLabel}</span>
        ) : null}
      </span>
      <ArrowUpRight
        aria-hidden
        className="ml-auto size-3.5 shrink-0 opacity-0 transition-opacity duration-150 group-hover/region:opacity-100 group-focus-visible/region:opacity-100"
      />
    </NavLink>
  );
}
