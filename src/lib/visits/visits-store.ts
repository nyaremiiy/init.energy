import { createHash, randomBytes } from "node:crypto";
import { appendFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { aggregate, kyivDate, type VisitEvent, type VisitReport } from "./visits-core.ts";

/**
 * Files of the visit counter (server only). Default: storage/visits/ —
 * excluded from Git; set VISITS_DIR on the server to keep it elsewhere.
 *
 *   events-YYYY-MM-DD.jsonl  raw page views of a Kyiv day (deleted after the report)
 *   salt-YYYY-MM-DD          random salt of that day's visitor hashes (deleted with them)
 *   reports/YYYY-MM-DD.json  daily report (kept; later sent to the Telegram bot)
 *   reports.jsonl            one summary line per day
 */
export function visitsDir(): string {
  return process.env.VISITS_DIR ?? path.join(process.cwd(), "storage", "visits");
}

const saltCache = new Map<string, string>();

/** Salt of a Kyiv day: random, stored so restarts keep the same hashes, deleted after the report. */
async function daySalt(dir: string, date: string): Promise<string> {
  const cached = saltCache.get(date);
  if (cached) return cached;
  const file = path.join(dir, `salt-${date}`);
  let salt: string;
  try {
    salt = (await readFile(file, "utf8")).trim();
  } catch {
    salt = randomBytes(16).toString("hex");
    await writeFile(file, salt, { encoding: "utf8", flag: "wx" }).catch(async () => {
      // Another request created it first: use that one.
      salt = (await readFile(file, "utf8")).trim();
    });
  }
  saltCache.set(date, salt);
  return salt;
}

/** Appends one page view. IP and browser are only hashed with the day's salt, never stored. */
export async function recordVisit(input: { path: string; ip: string; userAgent: string; ref?: string }, now = new Date()) {
  const dir = visitsDir();
  await mkdir(dir, { recursive: true });
  const date = kyivDate(now);
  const salt = await daySalt(dir, date);
  const event: VisitEvent = {
    t: now.toISOString(),
    path: input.path,
    v: createHash("sha256").update(`${salt}|${input.ip}|${input.userAgent}`).digest("hex").slice(0, 16),
    ...(input.ref ? { ref: input.ref } : {}),
  };
  await appendFile(path.join(dir, `events-${date}.jsonl`), `${JSON.stringify(event)}\n`, "utf8");
}

function parseEvents(text: string): VisitEvent[] {
  return text.split("\n").flatMap((line) => {
    if (!line.trim()) return [];
    try {
      return [JSON.parse(line) as VisitEvent];
    } catch {
      return [];
    }
  });
}

/**
 * Writes the report of every finished Kyiv day that still has raw events
 * (yesterday at 03:00, or several days after downtime), then deletes those
 * events and the salt. Returns the reports written.
 */
export async function writeDailyReports(now = new Date()): Promise<VisitReport[]> {
  const dir = visitsDir();
  const today = kyivDate(now);
  let files: string[];
  try {
    // The directory is chosen at runtime (VISITS_DIR): not a build-time asset.
    files = await readdir(/* turbopackIgnore: true */ dir);
  } catch {
    return [];
  }

  const days = files
    .map((file) => /^events-(\d{4}-\d{2}-\d{2})\.jsonl$/.exec(file)?.[1])
    .filter((date): date is string => Boolean(date) && (date as string) < today)
    .sort();

  const reports: VisitReport[] = [];
  for (const date of days) {
    const report = aggregate(date, parseEvents(await readFile(path.join(dir, `events-${date}.jsonl`), "utf8")), now);
    await mkdir(path.join(dir, "reports"), { recursive: true });
    await writeFile(path.join(dir, "reports", `${date}.json`), `${JSON.stringify(report, null, 2)}\n`, "utf8");
    const summary = { date, visitors: report.visitors, pageViews: report.pageViews, topPages: report.pages.slice(0, 5) };
    await appendFile(path.join(dir, "reports.jsonl"), `${JSON.stringify(summary)}\n`, "utf8");
    await rm(path.join(dir, `events-${date}.jsonl`), { force: true });
    await rm(path.join(dir, `salt-${date}`), { force: true });
    saltCache.delete(date);
    reports.push(report);
  }
  return reports;
}
