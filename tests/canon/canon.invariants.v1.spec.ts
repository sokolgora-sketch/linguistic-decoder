/**
 * Canon Invariants v1
 *
 * Purpose:
 * - Lock structural correctness of engine output (non-snapshot).
 * - Fail only when invariants are violated, not when content evolves.
 *
 * Notes:
 * - Fixture shape may be either:
 *   (A) Array<{ word: string, ... }>
 *   (B) { version?: string, mode?: string, words: Array<{ word: string, ... }> }
 */

import wordsV1Raw from "./words.v1.json";
import { analyzeWordV1 } from "../../src/engine/analyzeWordV1";

type EngineMode = "strict" | "open";

function assertNonEmptyString(v: unknown, label: string) {
  expect(typeof v).toBe("string");
  expect((v as string).trim().length).toBeGreaterThan(0);
}

function assertArray(v: unknown, label: string) {
  expect(Array.isArray(v)).toBe(true);
}

function isNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function extractWordList(fixture: unknown): Array<{ word: string; [k: string]: any }> {
  // Handle array fixture
  if (Array.isArray(fixture)) return fixture as any;

  // Handle object fixture
  if (fixture && typeof fixture === "object") {
    const f: any = fixture;

    // Preferred key
    if (Array.isArray(f.words)) return f.words;

    // Fallbacks (just in case the fixture name changes)
    if (Array.isArray(f.items)) return f.items;
    if (Array.isArray(f.data)) return f.data;
    if (Array.isArray(f.list)) return f.list;
  }

  return [];
}

function runOne(word: string, mode: EngineMode) {
  return analyzeWordV1(word, mode);
}

describe("canon invariants v1 (strict) — structural gates", () => {
  const mode: EngineMode = "strict";
  const wordsV1 = extractWordList(wordsV1Raw);

  test("fixture has at least one word", () => {
    expect(Array.isArray(wordsV1)).toBe(true);
    expect(wordsV1.length).toBeGreaterThan(0);
    for (const item of wordsV1) {
      expect(item).toBeTruthy();
      assertNonEmptyString(item.word, "fixture.word");
    }
  });

  for (const item of wordsV1) {
    test(`canon:invariants:${mode}:${item.word}`, async () => {
      const out = await runOne(item.word, mode);

      // 1) Core identity fields
      expect(out).toBeTruthy();
      assertNonEmptyString(out.word, "word");
      expect(out.word).toBe(item.word);

      // 2) Mode must be strict/open only (engine contract)
      expect(out.mode === "strict" || out.mode === "open").toBe(true);
      expect(out.mode).toBe("strict");

      // 3) Engine meta must exist + contain version + timestamp
      expect(out.engine_meta).toBeTruthy();
      assertNonEmptyString(out.engine_meta.engineVersion, "engine_meta.engineVersion");
      assertNonEmptyString(out.engine_meta.timestampIso, "engine_meta.timestampIso");

      // 4) Candidates must be present (strict should always emit something)
      expect(out.candidates).toBeTruthy();
      assertArray(out.candidates, "candidates");
      expect(out.candidates.length).toBeGreaterThan(0);

      // 5) Each candidate must have required fields with correct shapes
      for (const c of out.candidates) {
        assertNonEmptyString(c.language, "candidate.language");
        assertNonEmptyString(c.form, "candidate.form");
        assertArray(c.decomposition, "candidate.decomposition");

        for (const part of c.decomposition) {
          assertNonEmptyString(part, "candidate.decomposition[]");
        }

        expect(c.functional_statement).toBeTruthy();
        expect(typeof c.functional_statement).toBe("object");
        expect("action" in c.functional_statement).toBe(true);
        expect("instrument" in c.functional_statement).toBe(true);
        expect("unit" in c.functional_statement).toBe(true);

        expect(c.vowel_path).toBeTruthy();
        assertArray(c.vowel_path, "candidate.vowel_path");

        expect(c.ring_fit).toBeTruthy();

        expect(c.signals).toBeTruthy();
        assertArray(c.signals, "candidate.signals");
      }

      // 6) math7_summary presence rule:
      // If input contains at least one canonical vowel, summary must exist.
      const hasVowel = /[aeiouyëAEIOUYË]/.test(item.word);
      if (hasVowel) {
        expect(out.math7_summary).toBeTruthy();
        expect(typeof out.math7_summary).toBe("object");

        expect(out.math7_summary.path).toBeTruthy();
        assertArray(out.math7_summary.path, "math7_summary.path");

        // Soft-check numeric indices if present
        const anySummary: any = out.math7_summary;
        if (Array.isArray(anySummary.indices)) {
          for (const idx of anySummary.indices) {
            expect(isNumber(idx)).toBe(true);
          }
        }
      } else {
        // Allow either null or object for consonant-only tokens
        expect(out.math7_summary === null || typeof out.math7_summary === "object").toBe(true);
      }
    });
  }
});
