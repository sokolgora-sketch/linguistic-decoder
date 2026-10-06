import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getAlbanianLexicalSubstrateRecordsV0_1,
} from "@/shared/openInstrument/albanianLexicalSubstrate.v0_1";
import {
  getOrderedEligibleNovelInputsV0_1,
  selectPrimaryNovelInputV0_1,
} from "@/scripts/openInstrumentM7NovelInputGeneralization.v0_1";

const ROOT = process.cwd();
const ARTIFACT_DIR = join(ROOT, "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1");

function readArtifact<T>(name: string): T {
  return JSON.parse(readFileSync(join(ARTIFACT_DIR, name), "utf8")) as T;
}

function sha256(value: Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

describe("M7 novel-input generalization v0.1", () => {
  it("reproduces the frozen selection without consulting Discovery candidates", () => {
    const procedure = readArtifact<{
      status: string;
      preparedWordExclusion: { excludedWords: string[]; exclusionCount: number };
      normalizationAndEligibility: { selectionUsesCandidateBehavior: boolean };
    }>("selection-procedure.json");
    const selection = selectPrimaryNovelInputV0_1();
    const ordered = getOrderedEligibleNovelInputsV0_1();

    expect(procedure.status).toBe("FROZEN_BEFORE_PRIMARY_SELECTION");
    expect(procedure.preparedWordExclusion.excludedWords).toHaveLength(procedure.preparedWordExclusion.exclusionCount);
    expect(procedure.normalizationAndEligibility.selectionUsesCandidateBehavior).toBe(false);
    expect(selection).toMatchObject({
      input: "a",
      selectionPosition: 1,
      selectionUsesCandidateBehavior: false,
    });
    expect(ordered.slice(0, 10)).toEqual([
      "a",
      "aaa",
      "aaberg",
      "aachen",
      "aachener",
      "aaker",
      "aalborg",
      "aalen",
      "aaliyah",
      "aalseth",
    ]);
    expect([...ordered].sort()).toEqual(ordered);
  });

  it("preserves the sealed primary Null and bounded all-Null coverage result", () => {
    const primary = readArtifact<{
      input: { word: string };
      classification: string;
      discovery: { status: string; candidateCount: number; unknownOrNullReason: string };
      execution: { authoritativePrimaryExecutionCount: number; resultSubstitution: boolean };
    }>("primary-result.json");
    const result = readArtifact<{
      execution: { coverageExecutionAttempts: number; primaryExecutionAttempts: number; noRerun: boolean };
      sample: {
        inputs: string[];
        cases: Array<{ classification: string; crossFormPositive: boolean; input: string }>;
        positiveCases: unknown[];
        counts: {
          sampleSize: number;
          genericPositiveRetrievalCases: number;
          crossFormPositiveCases: number;
          validNullCases: number;
          invalidCases: number;
          engineOrAuthorityFailures: number;
        };
      };
      integrity: Record<string, boolean>;
    }>("result.json");

    expect(primary).toMatchObject({
      input: { word: "a" },
      classification: "VALID_GENERIC_NULL",
      discovery: {
        status: "NO_MATCHES",
        candidateCount: 0,
        unknownOrNullReason: "NO_GENERIC_AUTHORIZED_SOURCE_WITNESS",
      },
      execution: {
        authoritativePrimaryExecutionCount: 1,
        resultSubstitution: false,
      },
    });
    expect(result.execution).toEqual({
      repositoryHead: "4f6502c5474ac2311268355de51915233ea7fe8c",
      coverageExecutionAttempts: 1,
      primaryExecutionAttempts: 1,
      noRerun: true,
      adaptiveSelection: false,
      resultSubstitution: false,
    });
    expect(result.sample.inputs).toHaveLength(512);
    expect(result.sample.inputs[0]).toBe("a");
    expect(new Set(result.sample.inputs).size).toBe(512);
    expect(result.sample.cases).toHaveLength(512);
    expect(result.sample.positiveCases).toEqual([]);
    expect(result.sample.counts).toEqual({
      sampleSize: 512,
      genericPositiveRetrievalCases: 0,
      crossFormPositiveCases: 0,
      validNullCases: 512,
      invalidCases: 0,
      engineOrAuthorityFailures: 0,
      selfMatchOnlyCases: 0,
    });
    expect(result.sample.cases.every((entry) => entry.classification === "VALID_GENERIC_NULL")).toBe(true);
    expect(result.sample.cases.every((entry) => entry.crossFormPositive === false)).toBe(true);
    expect(result.integrity).toEqual({
      engineUnchanged: true,
      substrateUnchanged: true,
      retrievalUnchanged: true,
      noTargetSpecificMapping: true,
      noProviderExecution: true,
      primaryResultSubstituted: false,
    });
  });

  it("keeps the 55-record substrate and has no selected-word runtime branch", () => {
    const records = getAlbanianLexicalSubstrateRecordsV0_1();
    const substrateFingerprint = sha256(Buffer.from(JSON.stringify(records)));
    const motivationSource = readFileSync(join(ROOT, "src/shared/openInstrument/motivationEngineDiscovery.v0_1.ts"), "utf8");
    const selectionSource = readFileSync(join(ROOT, "scripts/openInstrumentM7NovelInputGeneralization.v0_1.ts"), "utf8");

    expect(records).toHaveLength(55);
    expect(substrateFingerprint).toBe("3db9f039c12b0b3d51a9d64361909403baf4224c92c3ff237f7e9d49aabedcbb");
    expect(motivationSource).not.toMatch(/(?:word|input\.word)\s*===\s*["']a["']/u);
    expect(motivationSource).not.toMatch(/case\s+["']a["']/u);
    expect(selectionSource).not.toMatch(/motivationEngineDiscovery/u);
    expect(selectionSource).not.toMatch(/candidateCount|VoicePath|Gamma|zeroConsonantal/u);
  });
});
