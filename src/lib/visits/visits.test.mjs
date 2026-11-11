// Run: npm test (node --test; Node strips the TypeScript types itself).
import assert from "node:assert/strict";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { aggregate, isBot, kyivDate, msUntilKyivHour, normalizePath, referrerHost } from "./visits-core.ts";

test("Kyiv date and time until 03:00 Kyiv", () => {
  // 2026-11-10 22:30 UTC = 2026-11-11 00:30 Kyiv (UTC+2 in winter).
  const now = new Date("2026-11-10T22:30:00.000Z");
  assert.equal(kyivDate(now), "2026-11-11");
  assert.equal(msUntilKyivHour(now, 3), 2.5 * 3600 * 1000);
  // Right after 03:00 Kyiv the next run is tomorrow.
  assert.equal(msUntilKyivHour(new Date("2026-11-11T01:00:01.000Z"), 3), 24 * 3600 * 1000 - 1000);
});

test("filters bots, bad paths and own referrers", () => {
  assert.equal(isBot("Mozilla/5.0 (compatible; Googlebot/2.1)"), true);
  assert.equal(isBot(null), true);
  assert.equal(isBot("Mozilla/5.0 (Windows NT 10.0) Chrome/130"), false);
  assert.equal(normalizePath("/cec?x=1#a"), "/cec/");
  assert.equal(normalizePath("//evil.com"), null);
  assert.equal(normalizePath("https://x"), null);
  assert.equal(referrerHost("https://www.google.com/search?q=1", "init.energy"), "google.com");
  assert.equal(referrerHost("https://init.energy/cec/", "init.energy"), undefined);
});

test("aggregates visitors, pages and referrers", () => {
  const report = aggregate("2026-11-10", [
    { t: "", path: "/", v: "a", ref: "google.com" },
    { t: "", path: "/cec/", v: "a" },
    { t: "", path: "/", v: "b", ref: "t.me" },
    { t: "", path: "/", v: "c", ref: "google.com" },
  ]);
  assert.equal(report.visitors, 3);
  assert.equal(report.pageViews, 4);
  assert.deepEqual(report.pages[0], { path: "/", views: 3, visitors: 3 });
  assert.deepEqual(report.referrers[0], { host: "google.com", visits: 2 });
});

test("records visits and writes the report of a finished day", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "init-energy-visits-"));
  process.env.VISITS_DIR = dir;
  try {
    const { recordVisit, writeDailyReports } = await import("./visits-store.ts");
    const yesterday = new Date("2026-11-10T10:00:00.000Z");
    await recordVisit({ path: "/", ip: "1.1.1.1", userAgent: "UA" }, yesterday);
    await recordVisit({ path: "/cec/", ip: "1.1.1.1", userAgent: "UA" }, yesterday);
    await recordVisit({ path: "/", ip: "2.2.2.2", userAgent: "UA" }, yesterday);

    const events = await readFile(path.join(dir, "events-2026-11-10.jsonl"), "utf8");
    assert.equal(events.includes("1.1.1.1"), false, "IP is never stored");

    const [report] = await writeDailyReports(new Date("2026-11-11T01:00:00.000Z"));
    assert.equal(report.visitors, 2);
    assert.equal(report.pageViews, 3);

    const files = await readdir(dir);
    assert.deepEqual(files.sort(), ["reports", "reports.jsonl"], "raw events and salt are deleted");
    assert.ok(JSON.parse(await readFile(path.join(dir, "reports", "2026-11-10.json"), "utf8")).visitors === 2);
  } finally {
    delete process.env.VISITS_DIR;
    await rm(dir, { recursive: true, force: true });
  }
});
