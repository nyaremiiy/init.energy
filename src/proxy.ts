import { NextResponse, type NextRequest } from "next/server";

import { maintenance } from "@/config/site-status";
import { plannedPaths, routes } from "@/content/routes";

const englishPrefix = "/en";

/**
 * Pages that are linked but not built yet (`plannedPaths`) are rewritten to
 * the static «page in progress» screen; the address bar keeps the original
 * URL. Everything else passes through untouched, so pages stay static.
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

  if (!plannedPaths.includes(base)) return NextResponse.next();

  const target = request.nextUrl.clone();
  target.pathname = english ? `${englishPrefix}${routes.inProgress}` : routes.inProgress;
  return NextResponse.rewrite(target, { status: 404 });
}

export const config = {
  // Pages only: no Next.js internals, API routes or files with an extension.
  matcher: ["/((?!_next/|api/|.*\.[\w]+$).*)"],
};
