import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import path from "path";

import {
  acousticVoiceLabOrder,
  evalBucketOrder,
  isSevenVoiceKey,
  lookupSevenVoice,
  orderedRegistryEntriesForView,
  orderedVoicesForView,
  sevenVoiceOrderedViews,
  sevenVoiceOrderedViewsSchemaVersion,
  sevenVoiceRegistry,
  symbolicMathOrder,
} from "../src/shared/sevenVoiceOrderedViews.v0.1";

const repoRoot = path.resolve(__dirname, "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function compactText(value: string): string {
  return value.replace(/\s+/g, "");
}

function collectStringArraysFromJson(value: unknown, found: string[][] = []): string[][] {
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string")) {
      found.push(value as string[]);
    }

    for (const item of value) {
      collectStringArraysFromJson(item, found);
    }
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectStringArraysFromJson(item, found);
    }
  }

  return found;
}

function containsTokensInOrder(text: string, expected: readonly string[]): boolean {
  let cursor = 0;

  for (const token of expected) {
    const index = text.indexOf(token, cursor);
    if (index < 0) {
      return false;
    }
    cursor = index + token.length;
  }

  return true;
}

function exactArrayText(expected: readonly string[], quote: string): string {
  return "[" + expected.map((item) => quote + item + quote).join(",") + "]";
}

function expectFileToContainOrderedView(relativePath: string, expected: readonly string[]) {
  const text = readRepoFile(relativePath);
  const compact = compactText(text);
  const hasExactDoubleArray = compact.includes(exactArrayText(expected, "\""));
  const hasExactSingleArray = compact.includes(exactArrayText(expected, "'"));
  const hasTokensInOrder = containsTokensInOrder(text, expected);

  expect({
    relativePath,
    expected,
    hasExactDoubleArray,
    hasExactSingleArray,
    hasTokensInOrder,
  }).toEqual(
    expect.objectContaining({
      relativePath,
      expected,
    }),
  );

  expect(hasExactDoubleArray || hasExactSingleArray || hasTokensInOrder).toBe(true);
}

function expectJsonFileToContainStringArray(relativePath: string, expected: readonly string[]) {
  const parsed = JSON.parse(readRepoFile(relativePath)) as unknown;
  const arrays = collectStringArraysFromJson(parsed);
  expect(arrays).toContainEqual([...expected]);
}

describe("sevenVoiceOrderedViews SSOT v0.1", () => {
  it("publishes a versioned ordered-views schema", () => {
    expect(sevenVoiceOrderedViewsSchemaVersion).toBe(
      "open-instrument.seven-voice-ordered-views.v0.1",
    );
  });

  it("keeps symbolicMathOrder stable for Math7/core surfaces", () => {
    expect(symbolicMathOrder).toEqual(["A", "E", "I", "O", "U", "Y", "Ë"]);
    expect(orderedVoicesForView("symbolicMathOrder")).toEqual(symbolicMathOrder);
    expect(sevenVoiceOrderedViews.symbolicMathOrder).toEqual(symbolicMathOrder);
  });

  it("keeps acousticVoiceLabOrder stable for VoiceLab/eval acoustic surfaces", () => {
    expect(acousticVoiceLabOrder).toEqual(["A", "O", "E", "Ë", "U", "Y", "I"]);
    expect(orderedVoicesForView("acousticVoiceLabOrder")).toEqual(acousticVoiceLabOrder);
    expect(sevenVoiceOrderedViews.acousticVoiceLabOrder).toEqual(acousticVoiceLabOrder);
  });

  it("keeps evalBucketOrder distinct from voice orders", () => {
    expect(evalBucketOrder).toEqual(["V1", "V2", "V3", "V4", "V5", "V6", "V7"]);
    expect(sevenVoiceOrderedViews.evalBucketOrder).toEqual(evalBucketOrder);
    expect(evalBucketOrder).not.toEqual(symbolicMathOrder);
    expect(evalBucketOrder).not.toEqual(acousticVoiceLabOrder);
  });

  it("proves the two voice ordered views contain the same seven voices but are intentionally different", () => {
    expect(symbolicMathOrder).toHaveLength(7);
    expect(acousticVoiceLabOrder).toHaveLength(7);
    expect([...new Set(symbolicMathOrder)]).toHaveLength(7);
    expect([...new Set(acousticVoiceLabOrder)]).toHaveLength(7);
    expect([...symbolicMathOrder].sort()).toEqual([...acousticVoiceLabOrder].sort());
    expect(symbolicMathOrder).not.toEqual(acousticVoiceLabOrder);
  });

  it("registers every voice with stable symbolic and acoustic metadata", () => {
    expect(Object.keys(sevenVoiceRegistry).sort()).toEqual(["A", "E", "I", "O", "U", "Y", "Ë"].sort());

    expect(lookupSevenVoice("A")).toMatchObject({
      key: "A",
      displayLabel: "A",
      symbolicMathIndex: 1,
      math7Value: 1,
      symbolicLevel: "high",
      symbolicRing: 3,
      symbolicColor: "red",
      genderPolarity: "male",
      acousticLabel: "open central",
      acousticHeight: "open",
      acousticBackness: "central",
    });

    expect(lookupSevenVoice("O")).toMatchObject({
      key: "O",
      displayLabel: "O",
      symbolicMathIndex: 4,
      math7Value: 4,
      symbolicLevel: "mid",
      symbolicRing: 0,
      symbolicColor: "green",
      genderPolarity: "androgynous",
      acousticLabel: "mid back",
      acousticHeight: "mid",
      acousticBackness: "back",
    });

    expect(lookupSevenVoice("Ë")).toMatchObject({
      key: "Ë",
      displayLabel: "Ë",
      symbolicMathIndex: 7,
      math7Value: 7,
      symbolicLevel: "low",
      symbolicRing: 3,
      symbolicColor: "violet",
      genderPolarity: "female",
      acousticLabel: "mid central",
      acousticHeight: "mid",
      acousticBackness: "central",
    });

    expect(isSevenVoiceKey("A")).toBe(true);
    expect(isSevenVoiceKey("Ë")).toBe(true);
    expect(isSevenVoiceKey("V1")).toBe(false);
  });

  it("orders registry entries through the named ordered views", () => {
    expect(orderedRegistryEntriesForView("symbolicMathOrder").map((entry) => entry.key)).toEqual(
      symbolicMathOrder,
    );
    expect(orderedRegistryEntriesForView("acousticVoiceLabOrder").map((entry) => entry.key)).toEqual(
      acousticVoiceLabOrder,
    );
  });

  it("guards current Math7/core symbolic files against accidental acoustic-order replacement", () => {
    expectFileToContainOrderedView("src/shared/math7.core.ts", symbolicMathOrder);
    expectFileToContainOrderedView("src/core/sevenVowelsCore.ts", symbolicMathOrder);
    expectFileToContainOrderedView("src/shared/doctrine/voiceDoctrine.v0.1.ts", symbolicMathOrder);
    expectFileToContainOrderedView("src/shared/sevenPrinciples.v1.ts", symbolicMathOrder);
  });

  it("guards current VoiceLab/eval acoustic surfaces against accidental symbolic-order replacement", () => {
    expectJsonFileToContainStringArray(
      "tests/fixtures/voicelab/sgi-seed-locked-2026-03-28.v0.2.json",
      acousticVoiceLabOrder,
    );
    expectFileToContainOrderedView("src/components/landing/LandingPage.v0.2.tsx", acousticVoiceLabOrder);
    expectFileToContainOrderedView("src/ui/evals/EvalsPageClient.v0.1.tsx", acousticVoiceLabOrder);
    expectFileToContainOrderedView(
      "tests/evals/evals.chart.canonical-dot-colors.guard.v0.1.spec.ts",
      acousticVoiceLabOrder,
    );

    const optionalResearchSpec = "tests/research/taiwan.spectrum.rootOnly.v1.0.spec.ts";
    if (existsSync(path.join(repoRoot, optionalResearchSpec))) {
      expectFileToContainOrderedView(optionalResearchSpec, acousticVoiceLabOrder);
    }
  });

  it("guards current eval bucket contract as separate from voice ordered views", () => {
    expectFileToContainOrderedView("src/shared/evals/spec.v0.1.ts", evalBucketOrder);
    expectJsonFileToContainStringArray("tests/evals/evals.spec.v0.1.json", evalBucketOrder);
  });

  it("keeps source/candidate language replay boundaries and reviewed artifact unchanged", () => {
    const replayScript = readRepoFile("scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs");
    expect(replayScript).toContain("GENERALIZATION_REPLAY_SOURCE_LANGUAGE_SCOPE_POLICY_V0_1");
    expect(replayScript).toContain("sourceScope: \"english_source_only\"");
    expect(replayScript).toContain("GENERALIZATION_REPLAY_CANDIDATE_LANGUAGE_POLICY_V0_1");
    expect(replayScript).toContain(
      "activeTargetGridCandidateLanguageIds: Object.freeze([\"albanian\", \"latin\", \"greek\", \"sanskrit\"])",
    );

    const artifactPath = path.join(
      repoRoot,
      "docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json",
    );
    const artifact = readFileSync(artifactPath);
    expect(createHash("sha256").update(artifact).digest("hex")).toBe(
      "51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65",
    );
  });
});
