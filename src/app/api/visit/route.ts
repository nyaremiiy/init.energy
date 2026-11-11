import { isBot, normalizePath, referrerHost } from "@/lib/visits/visits-core.ts";
import { recordVisit } from "@/lib/visits/visits-store.ts";

/**
 * POST /api/visit/ (trailing slash: trailingSlash is on) — one page view from the VisitBeacon component.
 * Body (sendBeacon, text): {"path":"/cec/","ref":"https://google.com/"}.
 * No cookies; IP and browser only feed the day's salted hash.
 * Always answers 204 so the beacon never retries or shows errors.
 */
export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get("user-agent");
    if (isBot(userAgent)) return new Response(null, { status: 204 });

    const text = await request.text();
    if (text.length > 1000) return new Response(null, { status: 204 });
    const body = JSON.parse(text) as { path?: unknown; ref?: unknown };
    const path = normalizePath(body.path);
    if (!path) return new Response(null, { status: 204 });

    // Behind nginx the client IP comes in X-Forwarded-For / X-Real-IP.
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    await recordVisit({
      path,
      ip,
      userAgent: userAgent ?? "",
      ref: referrerHost(body.ref, request.headers.get("host")),
    });
  } catch {
    // A broken counter must never break the site.
  }
  return new Response(null, { status: 204 });
}
