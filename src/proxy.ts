import { NextResponse, type NextRequest } from "next/server";

import { pathnameHeader } from "@/lib/request-path";

/**
 * Passes the requested path to the 404 screen: it picks the locale and says
 * «page in progress» for planned pages. Nothing else is changed.
 */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(pathnameHeader, request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Pages only: no Next.js internals, API routes or files with an extension.
  matcher: ["/((?!_next/|api/|.*\\.[\\w]+$).*)"],
};
