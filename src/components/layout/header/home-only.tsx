"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { isHomePath } from "./header-data";

/**
 * Renders its children only on the home page. Used for header links to
 * sections of the home page, which make no sense elsewhere.
 */
export function HomeOnly({ children }: { children: ReactNode }) {
  return isHomePath(usePathname()) ? <>{children}</> : null;
}
