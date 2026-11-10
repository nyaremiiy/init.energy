import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

test("appends a validated lead to JSONL storage", async () => {
  const testDirectory = await mkdtemp(path.join(tmpdir(), "init-energy-leads-"));
  const testFile = path.join(testDirectory, "leads.jsonl");
  process.env.LEAD_STORAGE_FILE = testFile;

  try {
    const { saveLead } = await import("./lead-storage.ts");
    await saveLead(
      {
        name: "Test User",
        phone: "+12025550123",
        comment: "Test lead",
        objectType: "house",
        calculatorData: "",
        product: "",
        pageUrl: "https://example.com/",
        tracking: {},
      },
      "en",
    );

    const lines = (await readFile(testFile, "utf8")).trim().split("\n");
    assert.equal(lines.length, 1);

    const stored = JSON.parse(lines[0]);
    assert.equal(stored.name, "Test User");
    assert.equal(stored.phone, "+12025550123");
    assert.equal(stored.locale, "en");
    assert.match(stored.id, /^[0-9a-f-]{36}$/);
    assert.equal(Number.isNaN(Date.parse(stored.submittedAt)), false);
  } finally {
    delete process.env.LEAD_STORAGE_FILE;
    await rm(testDirectory, { recursive: true, force: true });
  }
});
