import { webcrypto } from "node:crypto";

import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import {
  buildReproducibleRunBundleV0_1,
  parseReproducibleRunBundleV0_1,
  projectAnalyzeV1ForReproducibleRunBundleV0_1,
  serializeReproducibleRunBundleV0_1,
} from "../src/shared/openInstrument/reproducibleRunBundle.v0_1";

const claimBoundary = {
  historicalOriginClaim: "not_claimed",
  historicalTransmissionClaim: "not_claimed",
  winnerClaim: "not_claimed",
  languageSuperiorityClaim: "not_claimed",
  linguisticOwnershipClaim: "not_claimed",
  candidateTruthClaim: "not_claimed",
  structuralOutputIsCandidateTruth: false,
  nullIsValid: true,
};

function makeResult(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    word: "study",
    sanitized: "study",
    engineVersion: "0.2.0-symbolic",
    mode: "strict",
    alphabet: ["A", "E", "I", "O", "U", "Y", "Ë"],
    strictInput: true,
    primaryPath: ["A", "E", "I"],
    heart: { math7: { primary: { basis: "UI", principlesPath: ["UNITY"] } } },
    heartPrimaryPath: ["A", "E", "I"],
    candidates: [
      {
        id: "latin.studium",
        language: "Latin",
        form: "studium",
        candidateId: "latin.studium",
        displayForm: "studium",
        candidateLanguage: "Latin",
        targetWord: "study",
        targetSenseId: "study-sense",
        targetSenseLabel: "learning activity",
        sourceStatus: "candidate-only",
        functionalBridgeTruth: "hypothesis_only",
        evidenceRefs: ["candidate-ref-1"],
        historicalOriginClaim: "not_claimed",
        historicalTransmissionClaim: "not_claimed",
        winnerClaim: "not_claimed",
        languageSuperiorityClaim: "not_claimed",
        candidateTruthClaim: "not_claimed",
        functionalStatement: "A bounded functional hypothesis.",
        vowelPath: ["A", "E", "I"],
        status: "pass",
        confidenceTag: "speculative",
        fitTag: "functional",
        sourceKind: "research",
        claimType: "hypothesis",
        originClaim: "not_claimed",
        semanticBridge: "hypothesis-only bridge",
        validationOutcome: "not_reviewed",
        validationReasons: [],
        claimBoundary,
        userDecisionPosture: "user_decides",
        ops: ["candidate-op"],
        notes: ["candidate-note"],
        signals: ["candidate-signal"],
        raw: { providerOutput: "must not be stored" },
      },
    ],
    deepRoot: { status: "candidate_only", embryo: "study" },
    automaticCarrierPronunciationV0_1: {
      schemaVersion: "open-instrument.automatic-carrier-pronunciation.v0_1",
      attempted: true,
      status: "proposed",
      provider: "manual",
      localOnly: true,
      language: "English",
      ipa: "/ˈstʌdi/",
      error: null,
      boundary:
        "pronunciation proposal only; Seven-Voice normalization is deterministic and separate",
    },
    functionalVoiceNormalizationV0_1: {
      schemaVersion: "open-instrument.functional-voice-normalization.v0_1",
      word: "study",
      language: "English",
      ipa: "/ˈstʌdi/",
      status: "normalized",
      usable: true,
      surfacePath: ["A", "E", "I"],
      carrierPath: ["A", "E", "I"],
      functionalPath: ["A", "E", "I"],
      transforms: [],
      unresolvedCarrierDifferences: [],
      boundary:
        "bounded functional normalization only; carrier evidence does not automatically overwrite orthographic functional truth",
    },
    rootMap: { nodes: [], edges: [] },
    evidence: { refs: ["candidate-ref-1"], status: "candidate-only" },
    analysisStatusV0_1: {
      schemaVersion: "open-instrument.analysis-status.v0.1",
      status: "candidate_only",
      summary: "Candidate-only analysis.",
      reviewedOperators: [],
      candidateOnlyOperators: ["study"],
      researchHypothesisEmbryos: [],
      structuralTokens: [],
      claimBoundary,
      userDecisionPosture: "user_decides",
    },
    originClaim: "not_claimed",
    originClaimGates: { winnerClaim: "not_claimed" },
    resonanceProfileV1: { status: "present", path: ["A", "E", "I"] },
    raw: { engine: "must not be stored" },
    debug: { internal: "must not be stored" },
    providerOutput: { text: "must not be stored" },
    research: { fvr: "must not be stored" },
    runtime: { requestId: "must not be stored" },
    evidencePackage: { version: "must not be stored as canonical payload" },
    meta: { created: "2026-09-10T00:00:00.000Z" },
    ...overrides,
  };
}

beforeAll(() => {
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: webcrypto,
  });
});

describe("Open Instrument reproducible run bundle v0.1", () => {
  it("projects only the explicit public snapshot surface", () => {
    const projected = projectAnalyzeV1ForReproducibleRunBundleV0_1(makeResult());
    const keys = Object.keys(projected).sort();

    expect(keys).toEqual(
      [
        "alphabet",
        "automaticCarrierPronunciationV0_1",
        "analysisStatusV0_1",
        "candidates",
        "deepRoot",
        "engineVersion",
        "evidence",
        "functionalVoiceNormalizationV0_1",
        "heart",
        "heartPrimaryPath",
        "mode",
        "originClaim",
        "originClaimGates",
        "primaryPath",
        "resonanceProfileV1",
        "rootMap",
        "sanitized",
        "strictInput",
        "word",
      ].sort(),
    );
    expect(projected).not.toHaveProperty("raw");
    expect(projected).not.toHaveProperty("debug");
    expect(projected).not.toHaveProperty("providerOutput");
    expect(projected).not.toHaveProperty("research");
    expect(projected).not.toHaveProperty("runtime");
    expect(projected).not.toHaveProperty("meta");
    expect(projected.candidates[0]).not.toHaveProperty("raw");
    expect(projected.candidates[0].ops).toEqual(["candidate-op"]);
    expect(projected.candidates[0].notes).toEqual(["candidate-note"]);
    expect(projected.candidates[0].signals).toEqual(["candidate-signal"]);
  });

  it("does not duplicate canonical word/mode fields in input metadata", async () => {
    const bundle = await buildReproducibleRunBundleV0_1({
      result: makeResult(),
      ipa: "/ˈstʌdi/",
      targetSenseLabel: "learning activity",
      createdAt: "2026-09-10T00:00:00.000Z",
    });

    expect(bundle.input).toEqual({
      ipa: "/ˈstʌdi/",
      targetSenseLabel: "learning activity",
    });
    expect(bundle.result.word).toBe("study");
    expect(bundle.result.mode).toBe("strict");
    expect(bundle).toHaveProperty("fingerprint.algorithm", "sha256");
  });

  it("keeps the fingerprint stable when only envelope creation time changes", async () => {
    const first = await buildReproducibleRunBundleV0_1({
      result: makeResult(),
      createdAt: "2026-09-10T00:00:00.000Z",
    });
    const second = await buildReproducibleRunBundleV0_1({
      result: makeResult({ meta: { created: "different-runtime-time" } }),
      createdAt: "2026-09-10T01:00:00.000Z",
    });

    expect(first.fingerprint.value).toBe(second.fingerprint.value);
    expect(first.createdAt).not.toBe(second.createdAt);
  });

  it("changes identity when semantic content, evidence, or candidate order changes", async () => {
    const first = await buildReproducibleRunBundleV0_1({ result: makeResult() });
    const changedDefinition = await buildReproducibleRunBundleV0_1({
      result: makeResult({
        candidates: [
          {
            ...(makeResult().candidates as Record<string, unknown>[])[0],
            functionalStatement: "A changed bounded functional hypothesis.",
          },
        ],
      }),
    });
    const twoCandidates = makeResult().candidates as Record<string, unknown>[];
    twoCandidates.push({ ...twoCandidates[0], id: "second-candidate" });
    const reordered = await buildReproducibleRunBundleV0_1({
      result: makeResult({ candidates: twoCandidates.reverse() }),
    });

    expect(first.fingerprint.value).not.toBe(changedDefinition.fingerprint.value);
    expect(first.fingerprint.value).not.toBe(reordered.fingerprint.value);
  });

  it("round-trips through stable JSON and reconstructs the current telemetry VM", async () => {
    const bundle = await buildReproducibleRunBundleV0_1({
      result: makeResult(),
      ipa: "/ˈstʌdi/",
      targetSenseLabel: "learning activity",
    });
    const serialized = serializeReproducibleRunBundleV0_1(bundle);
    const parsed = await parseReproducibleRunBundleV0_1(serialized);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    expect(parsed.value.fingerprint).toEqual(bundle.fingerprint);
    expect(parsed.value.result.candidates).toHaveLength(1);
    expect(parsed.value.result.candidates[0].evidenceRefs).toEqual(["candidate-ref-1"]);

    const vm = adaptAnalysisToTelemetryVM(parsed.value.result as any);
    expect(vm.readout.word).toBe("study");
    expect(vm.candidates).toHaveLength(1);
    expect(vm.candidates[0].id).toBe("latin.studium");
    expect(vm.candidates[0].evidenceRefs).toEqual({
      kind: "present",
      value: ["candidate-ref-1"],
    });
    expect(parsed.value.result.analysisStatusV0_1.status).toBe("candidate_only");
  });

  it("preserves functional normalization authority and failed-pronunciation posture", async () => {
    const result = makeResult({
      primaryPath: { voicePath: ["U", "Y"] },
      heartPrimaryPath: ["U", "Y"],
      heartInstrumentV1: { surfaceVowels: ["U", "Y"] },
      evidence: {
        surfaceVowelsRaw: ["U", "Y"],
        surfaceVowels: ["U", "Y"],
        vowelPath: ["U", "Y"],
      },
      candidates: [],
      automaticCarrierPronunciationV0_1: {
        attempted: true,
        status: "provider_error",
      },
      functionalVoiceNormalizationV0_1: {
        functionalPath: ["U", "I"],
      },
    });

    const originalVm = adaptAnalysisToTelemetryVM(result);
    const bundle = await buildReproducibleRunBundleV0_1({ result });
    const parsed = await parseReproducibleRunBundleV0_1(
      serializeReproducibleRunBundleV0_1(bundle),
    );

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const restoredVm = adaptAnalysisToTelemetryVM(parsed.value.result);
    expect(restoredVm.readout.voicePathFunctional).toEqual(
      originalVm.readout.voicePathFunctional,
    );
    expect(restoredVm.readout.sevenPrinciplesSpectrum.functional).toEqual(
      originalVm.readout.sevenPrinciplesSpectrum.functional,
    );
    expect(restoredVm.readout.voicePathFunctional).toEqual({
      kind: "present",
      value: ["U", "I"],
    });

    const failedOnlyResult = makeResult({
      primaryPath: { voicePath: ["U", "Y"] },
      heartPrimaryPath: ["U", "Y"],
      heartInstrumentV1: { surfaceVowels: ["U", "Y"] },
      evidence: {
        surfaceVowelsRaw: ["U", "Y"],
        surfaceVowels: ["U", "Y"],
        vowelPath: ["U", "Y"],
      },
      candidates: [],
      automaticCarrierPronunciationV0_1: {
        attempted: true,
        status: "provider_error",
      },
    });
    delete failedOnlyResult.functionalVoiceNormalizationV0_1;

    const failedOnlyBundle = await buildReproducibleRunBundleV0_1({
      result: failedOnlyResult,
    });
    const failedOnlyParsed = await parseReproducibleRunBundleV0_1(
      serializeReproducibleRunBundleV0_1(failedOnlyBundle),
    );

    expect(failedOnlyParsed.ok).toBe(true);
    if (!failedOnlyParsed.ok) return;
    const failedOnlyRestoredVm = adaptAnalysisToTelemetryVM(
      failedOnlyParsed.value.result,
    );
    expect(failedOnlyRestoredVm.readout.voicePathFunctional).toEqual({
      kind: "missing",
      missing: "not_emitted",
    });
  });

  it("makes functional normalization authority fingerprint-significant", async () => {
    const first = await buildReproducibleRunBundleV0_1({
      result: makeResult({
        functionalVoiceNormalizationV0_1: {
          functionalPath: ["U", "I"],
        },
      }),
    });
    const second = await buildReproducibleRunBundleV0_1({
      result: makeResult({
        functionalVoiceNormalizationV0_1: {
          functionalPath: ["U", "E"],
        },
      }),
    });
    const changedPronunciation = await buildReproducibleRunBundleV0_1({
      result: makeResult({
        automaticCarrierPronunciationV0_1: {
          attempted: true,
          status: "provider_error",
          error: "timeout",
        },
      }),
    });

    expect(first.fingerprint.value).not.toBe(second.fingerprint.value);
    expect(first.fingerprint.value).not.toBe(changedPronunciation.fingerprint.value);
  });

  it("preserves structural discovery status through bundle round-trip", async () => {
    const structuralCandidate = {
      ...(makeResult().candidates as Record<string, unknown>[])[0],
      claimType: "structuralHypothesis",
      sourceKind: "logic_derived_structural_hypothesis",
      discoveryStatus: "structural_hypothesis",
      claimBoundary: "structural hypothesis only; not reviewed lexical evidence",
      functionalSupportStatus: "unknown",
      lexicalAttestation: "not_evaluated",
      validationOutcome: "not_evaluated",
      rankGroup: "structuralHypothesis",
    };
    const result = makeResult({ candidates: [structuralCandidate] });
    const originalVm = adaptAnalysisToTelemetryVM(result);
    const bundle = await buildReproducibleRunBundleV0_1({ result });
    const parsed = await parseReproducibleRunBundleV0_1(
      serializeReproducibleRunBundleV0_1(bundle),
    );

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const restoredVm = adaptAnalysisToTelemetryVM(parsed.value.result);
    expect(restoredVm.candidates[0].claimType).toEqual(
      originalVm.candidates[0].claimType,
    );
    expect(restoredVm.candidates[0].discoveryStatus).toEqual(
      originalVm.candidates[0].discoveryStatus,
    );
    expect(restoredVm.candidates[0].discoveryStatus).toEqual({
      kind: "present",
      value: "structural_hypothesis",
    });
  });

  it("preserves a valid Null result without inventing candidates", async () => {
    const result = makeResult({
      candidates: [],
      analysisStatusV0_1: {
        schemaVersion: "open-instrument.analysis-status.v0.1",
        status: "null_no_supported_candidate",
        summary: "No supported candidate.",
        reviewedOperators: [],
        candidateOnlyOperators: [],
        researchHypothesisEmbryos: [],
        structuralTokens: [],
        claimBoundary,
        userDecisionPosture: "user_decides",
      },
    });
    const bundle = await buildReproducibleRunBundleV0_1({ result });
    const parsed = await parseReproducibleRunBundleV0_1(
      serializeReproducibleRunBundleV0_1(bundle),
    );

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.result.candidates).toEqual([]);
    expect(parsed.value.result.analysisStatusV0_1.status).toBe(
      "null_no_supported_candidate",
    );
  });

  it("fails closed for malformed, unsupported, and tampered bundles", async () => {
    const malformed = await parseReproducibleRunBundleV0_1("not-json");
    expect(malformed).toEqual({ ok: false, reason: "malformed_json" });

    const bundle = await buildReproducibleRunBundleV0_1({ result: makeResult() });
    const unsupported = await parseReproducibleRunBundleV0_1(
      JSON.stringify({ ...bundle, schemaVersion: "future.v9" }),
    );
    expect(unsupported).toEqual({ ok: false, reason: "unsupported_schema_version" });

    const tampered = JSON.parse(serializeReproducibleRunBundleV0_1(bundle));
    tampered.result.word = "changed";
    const invalidFingerprint = await parseReproducibleRunBundleV0_1(tampered);
    expect(invalidFingerprint).toEqual({ ok: false, reason: "fingerprint_mismatch" });
  });

  it("rejects duplicate or forbidden envelope fields instead of silently accepting them", async () => {
    const bundle = await buildReproducibleRunBundleV0_1({ result: makeResult() });
    const candidate = JSON.parse(serializeReproducibleRunBundleV0_1(bundle));
    candidate.input.word = "duplicate-word";

    const parsed = await parseReproducibleRunBundleV0_1(candidate);
    expect(parsed).toEqual({ ok: false, reason: "invalid_bundle_shape" });
  });
});
