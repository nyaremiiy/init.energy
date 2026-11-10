import assert from "node:assert/strict";
import test from "node:test";

import {
  isValidPhone,
  normalizePhone,
} from "./lead-form-schema.ts";

test("accepts local and international phone formats", () => {
  const validPhones = [
    "+38 067 198 55 50",
    "098 123 45 67",
    "380671985550",
    "+1 (202) 555-0123",
    "+48 123 456 789",
    "0044 20 7946 0958",
    "+49.30.123456",
  ];

  for (const phone of validPhones) {
    assert.equal(isValidPhone(phone), true, phone);
  }
});

test("rejects invalid phone values", () => {
  const invalidPhones = [
    "",
    "12345",
    "+12 345 678 901 234 567",
    "+38 call me",
    "38+0671985550",
  ];

  for (const phone of invalidPhones) {
    assert.equal(isValidPhone(phone), false, phone);
  }
});

test("normalizes separators but preserves an international plus", () => {
  assert.equal(normalizePhone("+1 (202) 555-0123"), "+12025550123");
  assert.equal(normalizePhone("098 123 45 67"), "0981234567");
});
