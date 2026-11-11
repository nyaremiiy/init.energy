import { msUntilKyivHour } from "./visits-core.ts";
import { writeDailyReports } from "./visits-store.ts";

/** Hour (Kyiv time) when yesterday's report is written. */
const reportHour = 3;

const globalState = globalThis as typeof globalThis & { __initVisitReports?: boolean };

async function run() {
  try {
    const reports = await writeDailyReports();
    for (const report of reports) {
      console.log(`[visits] ${report.date}: ${report.visitors} visitors, ${report.pageViews} page views`);
    }
  } catch (error) {
    console.error("[visits] report failed", error);
  }
}

function scheduleNext() {
  const timer = setTimeout(async () => {
    await run();
    scheduleNext();
  }, msUntilKyivHour(new Date(), reportHour));
  // Never keeps the process alive on its own.
  timer.unref?.();
}

/**
 * Started once per server process (instrumentation.ts): writes any missed
 * reports right away (e.g. after downtime), then every day at 03:00 Kyiv.
 */
export function startVisitReports() {
  if (globalState.__initVisitReports) return;
  globalState.__initVisitReports = true;
  void run();
  scheduleNext();
}
