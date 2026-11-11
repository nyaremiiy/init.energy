import type { ReactNode } from "react";

import { PageTransition } from "@/components/layout/page-transition";

/** Remounts on every navigation: the page content fades in (see PageTransition). */
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
