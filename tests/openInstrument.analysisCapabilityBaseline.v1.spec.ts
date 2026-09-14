import { readFileSync } from "node:fs";

import {
  aggregateAnalysisCapabilityBaselineV1,
  buildAnalysisCapabilityBaselineCaseV1,
  parseAnalysisCapabilityBaselineManifestV1,
  parseAnalysisCapabilityBaselineV1,
  type AnalysisCapabilityBaselineV1,
  type BaselineEvidenceReferenceMeasurementV1,
} from "@/shared/openInstrument/analysisCapabilityBaseline.v1";

const MANIFEST_PATH =
  "tests/fixtures/openInstrument/analysis-capability-baseline.v1.manifest.json";
const BASELINE_PATH =
  "tests/fixtures/openInstrument/analysis-capability-baseline.v1.json";

const manifest = parseAnalysisCapabilityBaselineManifestV1(
  JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as unknown,
);
const baseline = parseAnalysisCapabilityBaselineV1(
  readFileSync(BASELINE_PATH, "utf8"),
);

const EXPECTED_CLAIM_BOUNDARY = {
  historicalOriginClaim: "not_claimed",
  historicalTransmissionClaim: "not_claimed",
  winnerClaim: "not_claimed",
  languageSuperiorityClaim: "not_claimed",
  linguisticOwnershipClaim: "not_claimed",
  candidateTruthClaim: "not_claimed",
  structuralOutputIsCandidateTruth: false,
  nullIsValid: true,
} as const;

function record(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("expected object");
  }
  return value as Record<string, unknown>;
}

function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error("expected array");
  return value;
}

function caseById(
  id: string,
): AnalysisCapabilityBaselineV1["cases"][number] {
  const item = baseline.cases.find((candidate) => candidate.caseId === id);
  if (!item) throw new Error(`missing baseline case ${id}`);
  return item;
}

function containsKey(value: unknown, key: string): boolean {
  if (Array.isArray(value)) return value.some((item) => containsKey(item, key));
  if (value === null || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([childKey, child]) => childKey === key || containsKey(child, key),
  );
}

function publicStatus(status: string, summary = status): Record<string, unknown> {
  return {
    schemaVersion: "open-instrument.analysis-status.v0_1",
    status,
    summary,
    claimBoundary: EXPECTED_CLAIM_BOUNDARY,
    userDecisionPosture: "user_decides",
  };
}

function publicResult(
  status: string,
  candidates: readonly Record<string, unknown>[],
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    word: "synthetic",
    sanitized: "synthetic",
    engineVersion: "test-engine",
    mode: "strict",
    candidates,
    analysisStatusV0_1: publicStatus(status),
    evidence: { normalizationSteps: [] },
    ...overrides,
  };
}

function viewModel(
  candidates: readonly Record<string, unknown>[],
  readoutOverrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    candidates,
    readout: {
      voicePath: { kind: "present", value: ["A"] },
      voicePathSurface: { kind: "present", value: ["A"] },
      voicePathFunctional: { kind: "present", value: ["A"] },
      voicePathDelta: "MATCH",
      ...readoutOverrides,
    },
  };
}

function syntheticCase(input: {
  status: string;
  candidates: readonly Record<string, unknown>[];
  vmCandidates?: readonly Record<string, unknown>[];
  measurements?: ReadonlyArray<ReadonlyArray<BaselineEvidenceReferenceMeasurementV1>>;
  resultOverrides?: Record<string, unknown>;
  readoutOverrides?: Record<string, unknown>;
}) {
  const measurements = input.measurements ?? input.candidates.map(() => []);
  return buildAnalysisCapabilityBaselineCaseV1({
    input: {
      caseId: `synthetic.${input.status}`,
      word: "synthetic",
      mode: "strict",
      alphabet: "auto",
    },
    publicResult: publicResult(
      input.status,
      input.candidates,
      input.resultOverrides,
    ),
    viewModel: viewModel(input.vmCandidates ?? [], input.readoutOverrides),
    fingerprint: "a".repeat(64),
    repeatedFingerprint: "a".repeat(64),
    evidenceMeasurements: measurements,
  });
}

describe("Open Instrument analytical capability baseline v1", () => {
  test("manifest is versioned, representative, and has unique stable case IDs", () => {
    expect(manifest.schemaVersion).toBe(
      "open-instrument.analysis-capability-baseline-manifest.v1",
    );
    expect(manifest.corpusVersion).toBe(
      "open-instrument.analysis-capability-baseline-corpus.v1",
    );
    expect(manifest.cases).toHaveLength(57);
    expect(new Set(manifest.cases.map((item) => item.caseId)).size).toBe(
      manifest.cases.length,
    );
    expect(manifest.cases.filter((item) => item.category === "nature")).toHaveLength(10);
    expect(manifest.cases.filter((item) => item.category === "body")).toHaveLength(10);
    expect(manifest.cases.filter((item) => item.category === "action")).toHaveLength(10);
    expect(manifest.cases.filter((item) => item.category === "abstract")).toHaveLength(10);
    expect(
      manifest.cases.filter((item) => item.category === "human_social"),
    ).toHaveLength(10);
    expect(manifest.cases.filter((item) => item.category === "null_control")).toHaveLength(1);
    expect(manifest.cases.filter((item) => item.category === "target_sense")).toHaveLength(2);
  });

  test("checked-in artifact has a stable schema, canonical voices, and one result per case", () => {
    expect(baseline.schemaVersion).toBe(
      "open-instrument.analysis-capability-baseline.v1",
    );
    expect(baseline.canonicalVoices).toEqual(["A", "E", "I", "O", "U", "Y", "Ë"]);
    expect(baseline.caseCount).toBe(manifest.cases.length);
    expect(baseline.cases.map((item) => item.caseId)).toEqual(
      manifest.cases.map((item) => item.caseId),
    );
    expect(baseline.valid).toBe(true);
    expect(baseline.aggregate.totalCases).toBe(baseline.caseCount);
    expect(aggregateAnalysisCapabilityBaselineV1(baseline.cases)).toEqual(
      baseline.aggregate,
    );
  });

  test("aggregate preserves dimensional status and capability counts", () => {
    expect(baseline.aggregate.statusCounts).toEqual({
      reviewed_functional_evidence: 2,
      research_functional_hypothesis: 41,
      candidate_only: 0,
      structural_unreviewed: 1,
      null_no_supported_candidate: 13,
    });
    expect(baseline.aggregate.nullCount).toBe(13);
    expect(baseline.aggregate.pathCoverage).toEqual({
      detected: 57,
      surface: 57,
      functional: 57,
      delta: 57,
    });
    expect(baseline.aggregate.candidates).toEqual({
      casesWithCandidates: 44,
      totalCandidates: 93,
    });
    expect(baseline.aggregate.composition.totalComponents).toBe(2);
    expect(baseline.aggregate.composition.candidatesWithFunctionalStatements).toBeGreaterThan(0);
    expect(baseline.aggregate.evidence.candidatesWithRefs).toBe(64);
    expect(baseline.aggregate.evidence.totalRefs).toBe(64);
    expect(baseline.aggregate.targetSense.casesWithRequestContext).toBe(2);
  });

  test("repeated execution and invariants are preserved for every case", () => {
    expect(baseline.aggregate.repeatability).toEqual({
      checkedCases: 57,
      stableCases: 57,
      allStable: true,
    });
    expect(baseline.aggregate.invariantFailures).toEqual([]);
    for (const item of baseline.cases) {
      expect(item.repeatability.checked).toBe(true);
      expect(item.repeatability.stable).toBe(true);
      expect(item.invariants.valid).toBe(true);
      expect(item.invariants.claimBoundaryPreserved).toBe(true);
      expect(item.invariants.userDecisionPosturePreserved).toBe(true);
      expect(item.invariants.noSingleWinnerPreserved).toBe(true);
      expect(item.invariants.nullIsValidPreserved).toBe(true);
      expect(item.invariants.providerExecutionObserved).toBe(false);
    }
  });

  test("repeatability parser rejects forged or mismatched fingerprints", () => {
    const forged = JSON.parse(
      readFileSync(BASELINE_PATH, "utf8"),
    ) as Record<string, unknown>;
    const forgedCases = array(forged.cases);
    const forgedCase = record(forgedCases[0]);
    forgedCase.fingerprint = "b".repeat(64);
    expect(() => parseAnalysisCapabilityBaselineV1(forged)).toThrow(
      /fingerprint/i,
    );

    const mismatched = JSON.parse(
      readFileSync(BASELINE_PATH, "utf8"),
    ) as Record<string, unknown>;
    const mismatchedCases = array(mismatched.cases);
    const mismatchedCase = record(mismatchedCases[0]);
    const repeatability = record(mismatchedCase.repeatability);
    repeatability.repeatedFingerprint = "b".repeat(64);
    expect(() => parseAnalysisCapabilityBaselineV1(mismatched)).toThrow(
      /repeated fingerprint/i,
    );
  });

  test("study preserves run-level paths, delta, candidate order, and composition fields", () => {
    const item = caseById("canonical.study");
    expect(item.paths.detected).toEqual(["U", "Y"]);
    expect(item.paths.surface).toEqual(["U", "Y"]);
    expect(item.paths.functional).toEqual(["U", "I"]);
    expect(item.paths.delta).toBe("DIVERGE");
    expect(item.candidateIds).toEqual([
      "albanian-di-know-functional",
      "rootmap-composition:sq:shtu+di",
      "latin-studium",
      "albanian-studim",
    ]);
    expect(item.candidates[1]?.expansionChain).toEqual(["SHTU", "DI", "STUDY"]);
    expect(item.candidates[1]?.functionalComponents).toEqual({
      count: 2,
      embryos: ["SHTU", "DI"],
      languages: ["sq", "sq"],
      meanings: ["add / increase / put-on", "know / knowledge"],
      evidenceStates: ["structural", "reviewed"],
    });
    expect(item.candidates[1]?.vowelPath).toBe("U-I");
  });

  test("damage preserves its emitted normalization record exactly", () => {
    const item = caseById("canonical.damage");
    expect(item.paths.detected).toEqual(["A", "E"]);
    expect(item.paths.surface).toEqual(["A", "A", "E"]);
    expect(item.paths.functional).toEqual(["A", "Ë"]);
    expect(item.paths.delta).toBe("DIVERGE");
    expect(item.paths.normalizationSteps).toEqual([
      {
        from: "AAE",
        op: "vowel_normalize",
        reason: "functional_equivalence",
        to: "AE",
      },
    ]);
    expect(item.paths.normalizationRecordCount).toBe(1);
  });

  test("reviewed, research, target-sense, and Null dimensions remain distinct", () => {
    const reviewed = caseById("canonical.study");
    const research = caseById("target-sense.water-physical-liquid");
    const nullCase = caseById("null.xyz");

    expect(reviewed.status).toBe("reviewed_functional_evidence");
    expect(reviewed.evidence.reviewedRefs).toBe(1);
    expect(reviewed.evidence.researchRefs).toBe(0);
    expect(research.status).toBe("research_functional_hypothesis");
    expect(research.evidence.researchRefs).toBe(2);
    expect(research.evidence.reviewedRefs).toBe(0);
    expect(research.request.targetSenseId).toBe("physical_water_liquid");
    expect(nullCase.status).toBe("null_no_supported_candidate");
    expect(nullCase.nullResult).toBe(true);
    expect(nullCase.candidateCount).toBe(0);
    expect(nullCase.evidence.totalRefs).toBe(0);
  });

  test("forbidden fields, invalid aggregate data, and malformed manifests fail closed", () => {
    const forbidden = JSON.parse(
      readFileSync(BASELINE_PATH, "utf8"),
    ) as Record<string, unknown>;
    const forbiddenCases = array(forbidden.cases);
    const firstCase = record(forbiddenCases[0]);
    const candidates = array(firstCase.candidates);
    const firstCandidate = record(candidates[0]);
    firstCandidate.raw = { providerResponse: "must not persist" };
    expect(() => parseAnalysisCapabilityBaselineV1(forbidden)).toThrow(
      /forbidden field/i,
    );

    const aggregateMismatch = JSON.parse(
      readFileSync(BASELINE_PATH, "utf8"),
    ) as Record<string, unknown>;
    const aggregate = record(aggregateMismatch.aggregate);
    aggregate.totalCases = 999;
    expect(() => parseAnalysisCapabilityBaselineV1(aggregateMismatch)).toThrow(
      /aggregate/i,
    );

    const duplicateManifest = JSON.parse(
      readFileSync(MANIFEST_PATH, "utf8"),
    ) as Record<string, unknown>;
    const duplicateCases = array(duplicateManifest.cases);
    duplicateCases.push(duplicateCases[0]);
    expect(() => parseAnalysisCapabilityBaselineManifestV1(duplicateManifest)).toThrow(
      /duplicate caseId/i,
    );

    const unsupportedManifest = {
      ...duplicateManifest,
      cases: [
        {
          caseId: "invalid",
          word: "study",
          mode: "strict",
          alphabet: "unsupported",
        },
      ],
    };
    expect(() => parseAnalysisCapabilityBaselineManifestV1(unsupportedManifest)).toThrow(
      /unsupported alphabet/i,
    );
  });

  test("synthetic Null is valid and missing evidence does not become a failure", () => {
    const item = syntheticCase({
      status: "null_no_supported_candidate",
      candidates: [],
      vmCandidates: [],
      resultOverrides: { sanitized: "xyz" },
      readoutOverrides: {
        voicePath: { kind: "present", value: ["Y"] },
        voicePathSurface: { kind: "present", value: ["Y"] },
        voicePathFunctional: { kind: "present", value: ["Y"] },
      },
    });
    expect(item.nullResult).toBe(true);
    expect(item.candidateCount).toBe(0);
    expect(item.invariants.valid).toBe(true);
    expect(item.evidence.totalRefs).toBe(0);
  });

  test("synthetic component and evidence projections preserve ownership and order", () => {
    const item = syntheticCase({
      status: "research_functional_hypothesis",
      candidates: [
          {
            id: "candidate-a",
            form: "SHTU + DI",
            functionalStatement: "A synthetic functional composition.",
            sourceStatus: "research_candidate",
          evidenceRefs: ["research.ref.a"],
          segmentation: {
            kind: "functionalComposition",
            components: [
              {
                embryo: "SHTU",
                language: "Albanian",
                plainMeaning: "add / increase / put-on",
                evidenceState: "structural",
              },
              {
                embryo: "DI",
                language: "Albanian",
                plainMeaning: "know / knowledge",
                evidenceState: "reviewed",
              },
            ],
          },
          expansionChain: ["SHTU", "DI", "SYNTHETIC"],
          vowelPath: ["U", "I"],
        },
        { id: "candidate-b", form: "DI" },
      ],
      vmCandidates: [
        {
          sourceId: { kind: "present", value: "research.ref.a" },
          sourceStatus: { kind: "present", value: "research_candidate" },
          evidenceRefs: { kind: "present", value: ["research.ref.a"] },
        },
        {},
      ],
      measurements: [
        [
          {
            ref: "research.ref.a",
            kind: "research_evidence",
            sourceStatus: "research_candidate",
            navigable: false,
            hasLocator: false,
            hasSafeUrl: false,
          },
        ],
        [],
      ],
    });

    expect(item.candidateIds).toEqual(["candidate-a", "candidate-b"]);
    expect(item.candidates[0]?.functionalComponents?.embryos).toEqual([
      "SHTU",
      "DI",
    ]);
    expect(item.candidates[0]?.functionalComponents?.meanings).toEqual([
      "add / increase / put-on",
      "know / knowledge",
    ]);
    expect(item.candidates[0]?.evidence?.researchCount).toBe(1);
    expect(item.candidates[0]?.functionalStatement).toBe(
      "A synthetic functional composition.",
    );
    expect(item.candidates[1]?.functionalComponents).toBeNull();
    expect(item.candidates[1]?.evidence).toBeNull();
    expect(item.invariants.researchBoundaryPreserved).toBe(true);
  });

  test("baseline artifact contains no forbidden private/provider fields", () => {
    for (const key of [
      "raw",
      "debug",
      "providerOutput",
      "providerRequest",
      "providerResponse",
      "tokenUsage",
      "requestId",
      "environment",
      "runtime",
      "serverError",
      "exception",
      "calibrationPacket",
      "researchRows",
    ]) {
      expect(containsKey(baseline, key)).toBe(false);
    }
  });
});
