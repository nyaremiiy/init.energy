import { NextResponse, type NextRequest } from "next/server";

import { maintenance } from "@/config/site-status";
import { plannedPaths, routes } from "@/content/routes";
import { hasEnglish } from "@/i18n/config";

const englishPrefix = "/en";

/**
 * Pages that are linked but not built yet (`plannedPaths`) are rewritten to
 * the static «page in progress» screen; /en/… URLs without an English version
 * are rewritten to the static English 404 (the root not-found.tsx is
 * Ukrainian). Both answer 404 and the address bar keeps the original URL.
 * Everything else passes through untouched, so pages stay static.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const english = path.startsWith(`${englishPrefix}/`);
  const base = english ? path.slice(englishPrefix.length) : path;

  if (maintenance.enabled && base !== routes.maintenance) {
    const target = request.nextUrl.clone();
    target.pathname = routes.maintenance;
    if (english) target.searchParams.set("locale", "en");

    const response = NextResponse.rewrite(target, { status: 503 });
    response.headers.set("Retry-After", "3600");
    return response;
  }

  if (plannedPaths.includes(base)) {
    const target = request.nextUrl.clone();
    target.pathname = english ? `${englishPrefix}${routes.inProgress}` : routes.inProgress;
    return NextResponse.rewrite(target, { status: 404 });
  }

  // The 404 screen itself is not exempt: opened directly it also answers 404.
  const englishServicePaths = [routes.inProgress, routes.maintenance];
  if (english && !hasEnglish(base) && !englishServicePaths.includes(base)) {
    const target = request.nextUrl.clone();
    target.pathname = `${englishPrefix}${routes.notFoundEn}`;
    return NextResponse.rewrite(target, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // Pages only: no Next.js internals, API routes or files with an extension.
  // Double backslashes: in a plain string "\." would become "." and files
  // (images, favicon) would go through the proxy — and get the maintenance page.
  matcher: ["/((?!_next/|api/|.*\\.[\\w]+$).*)"],
};
