import { PHASE_PRODUCTION_BUILD } from "next/constants";

/**
 * Runs once when the Next.js server starts. Starts the daily visit report
 * (03:00 Kyiv, see lib/visits). Node.js server only: not during the build,
 * not in the Edge runtime.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return;
  const { startVisitReports } = await import("./lib/visits/visits-scheduler.ts");
  startVisitReports();
}
