import { webcrypto } from "node:crypto";
import {
  hasLegacyInterpretationFieldsV2,
  migrateLegacyAnalyzeWordResultInputV2,
  toAnalyzeWordResultV2Contract,
} from "@/shared/analyzeWordResult.v2.contract";
import {
  buildReproducibleRunBundleV0_1,
  serializeReproducibleRunBundleV0_1,
} from "@/shared/openInstrument/reproducibleRunBundle.v0_1";
import {
  buildReproducibleRunBundleV0_2,
  parseReproducibleRunBundleV0_2,
  serializeReproducibleRunBundleV0_2,
} from "@/shared/openInstrument/reproducibleRunBundle.v0_2";
import { isInterpretationDecisionPolicyV0_1 } from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";

Object.defineProperty(globalThis, "crypto", { configurable: true, value: webcrypto });

function makeResult(status = "candidate_only") {
  return {
    word: "study",
    sanitized: "study",
    engineVersion: "test-engine",
    mode: "strict",
    alphabet: "latin",
    candidates: [{
      id: "candidate.di.study",
      candidateId: "candidate.di.study",
      displayForm: "DI",
      candidateLanguage: "Albanian",
      language: "Albanian",
      form: "DI",
      claimType: "structuralHypothesis",
      originClaim: "not_claimed",
      historicalRelation: "not_evaluated",
      embryo: "DI",
      embryoSize: 2,
      embryoLanguage: "Albanian",
      isolatedStandaloneForm: "di",
      plainStandaloneGloss: "know",
      sourceNote: null,
      segmentation: null,
      semanticBridge: null,
      expansionChain: ["DI"],
      validationOutcome: "not_evaluated",
      validationReasons: [],
      rankGroup: "structuralHypothesis",
      rankScore: 0,
      rankReason: "unreviewed proposal",
      claimBoundary: "structural hypothesis only",
      userDecisionPosture: "user_decides",
      targetSenseId: "study.sense",
      targetSenseLabel: "learning activity",
      evidenceRefs: ["source:albanian-di:entry-1"],
      status: "unknown",
      discoveryStatus: "structural_hypothesis",
      functionalStatement: "Possible knowledge relation.",
    }],
    analysisStatusV0_1: {
      schemaVersion: "open-instrument.analysis-status.v0_1",
      status,
      summary: "No single winner is selected; preserve the evidence and uncertainty.",
      reviewedOperators: [],
      candidateOnlyOperators: status === "candidate_only" ? ["DI"] : [],
      researchHypothesisEmbryos: [],
      structuralTokens: [],
      claimBoundary: {
        historicalOriginClaim: "not_claimed",
        historicalTransmissionClaim: "not_claimed",
        winnerClaim: "not_claimed",
        languageSuperiorityClaim: "not_claimed",
        linguisticOwnershipClaim: "not_claimed",
        candidateTruthClaim: "not_claimed",
        structuralOutputIsCandidateTruth: false,
        nullIsValid: true,
      },
      userDecisionPosture: "user_decides",
    },
    motivationDiscoveryV0_1: {
      schemaVersion: "open-instrument.motivation-engine-discovery.v0_1",
      status: "MATCHES_FOUND",
      inputWord: "study",
      inputLanguage: "English",
      inputProfile: "strict",
      sourceFact: {
        layer: "SOURCE_FACT",
        language: "English",
        profile: "strict",
        representation: "unknown",
        sourceStatus: "NOT_QUERIED",
        authorityBoundary: "test fixture",
      },
      derivedStructure: {
        layer: "DERIVED_STRUCTURE",
        voicePath: [],
        voicePathSource: "unknown",
        math7: { basis: null, totalMod7: null, principlesPath: [] },
        gamma: { status: "NULL", orderedUnits: [], reason: null },
        zeroConsonantalStructuralComposition: { status: "NULL", variants: [], reason: null },
        structuralHypotheses: [],
      },
      candidates: [
        {
          candidateId: "candidate.source.alpha",
          sourceFact: {
            sourceId: "source.alpha",
            sourceStatus: "CITATION_ENTERED_UNVERIFIED",
            evidenceRefs: ["source:alpha:entry-1"],
            noSingleWinner: true,
          },
          functionalInterpretation: {
            status: "UNKNOWN_OR_NULL",
            statement: null,
            evidenceStatus: "UNKNOWN_OR_NULL",
            winnerClaim: "not_claimed",
          },
        },
        {
          candidateId: "candidate.source.beta",
          sourceFact: {
            sourceId: "source.beta",
            sourceStatus: "USER_PROPOSED",
            evidenceRefs: ["source:beta:entry-2"],
          },
          functionalInterpretation: {
            status: "UNKNOWN_OR_NULL",
            statement: null,
            evidenceStatus: "UNKNOWN_OR_NULL",
          },
        },
      ],
      interpretation: {
        layer: "ZË-RO_INTERPRETATION_OR_HYPOTHESIS",
        status: "UNKNOWN_OR_NULL",
        note: "No single winner is chosen; source identities and Null remain visible.",
      },
      unknownOrNull: { layer: "UNKNOWN_OR_NULL", reason: null },
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    },
    originClaimGates: { winnerClaim: "not_claimed" },
  };
}

describe("reproducible run bundle v0.2", () => {
  it("serializes only neutral fields and preserves candidate source identity", async () => {
    const result = migrateLegacyAnalyzeWordResultInputV2(makeResult());
    const bundle = await buildReproducibleRunBundleV0_2({ result, createdAt: "2026-11-13T00:00:00Z" });
    const serialized = serializeReproducibleRunBundleV0_2(bundle);
    const status = bundle.result.analysisStatusV0_2 as Record<string, unknown>;
    expect(bundle.schemaVersion).toBe("open-instrument.reproducible-run-bundle.v0.2");
    expect(serialized).not.toMatch(/winner|no_single_winner/i);
    expect(status.status).toBe("candidate_only");
    expect(bundle.result.candidates[0]).toMatchObject({
      candidateId: "candidate.di.study",
      evidenceRefs: ["source:albanian-di:entry-1"],
    });
    expect(bundle.result).not.toHaveProperty("analysisStatusV0_1");
    expect(await parseReproducibleRunBundleV0_2(serialized)).toMatchObject({ ok: true });
  });

  it("migrates generated policy text without rewriting legitimate word or source content", () => {
    const legacy = makeResult();
    legacy.word = "winner";
    legacy.sanitized = "winner";
    legacy.candidates[0].displayForm = "winner";
    legacy.candidates[0].form = "winner";
    legacy.candidates[0].plainStandaloneGloss = "winner: an attested lexical sense";
    legacy.candidates[0].sourceNote = "User-entered note containing winner.";
    legacy.candidates[0].evidenceRefs = ["source.winner.entry-1"];

    const neutral = migrateLegacyAnalyzeWordResultInputV2(legacy);
    expect(neutral.word).toBe("winner");
    expect(neutral.sanitized).toBe("winner");
    expect(neutral.candidates[0]).toMatchObject({
      displayForm: "winner",
      form: "winner",
      plainStandaloneGloss: "winner: an attested lexical sense",
      sourceNote: "User-entered note containing winner.",
      evidenceRefs: ["source.winner.entry-1"],
    });
    expect((neutral.analysisStatusV0_2 as { summary: string }).summary)
      .toBe("No interpretation is selected automatically; preserve the evidence and uncertainty.");
    expect(hasLegacyInterpretationFieldsV2(neutral)).toBe(false);
    expect(isInterpretationDecisionPolicyV0_1(neutral.interpretationDecisionPolicyV0_1)).toBe(true);
    const discovery = neutral.motivationDiscoveryV0_2 as Record<string, any>;
    expect(discovery.schemaVersion).toBe("open-instrument.motivation-engine-discovery.v0_2");
    expect(isInterpretationDecisionPolicyV0_1(discovery.interpretationDecisionPolicy)).toBe(true);
    expect(discovery.candidates.map((candidate: any) => candidate.candidateId)).toEqual([
      "candidate.source.alpha",
      "candidate.source.beta",
    ]);
    expect(discovery.candidates[0].sourceFact).toMatchObject({
      sourceId: "source.alpha",
      sourceStatus: "CITATION_ENTERED_UNVERIFIED",
      evidenceRefs: ["source:alpha:entry-1"],
    });
    expect(discovery.candidates[0].functionalInterpretation.evidenceStatus).toBe("UNKNOWN_OR_NULL");
    expect(discovery.unknownOrNull).toEqual({ layer: "UNKNOWN_OR_NULL", reason: null });
    expect(hasLegacyInterpretationFieldsV2(discovery)).toBe(false);
  });

  it("regenerates active policy output without rewriting the legacy input record", () => {
    const generated = makeResult();
    const active = toAnalyzeWordResultV2Contract(generated);
    expect((active.analysisStatusV0_2 as { summary: string }).summary).not.toMatch(/winner|no_single_winner/i);
    expect(generated.analysisStatusV0_1.summary)
      .toBe("No single winner is selected; preserve the evidence and uncertainty.");
  });

  it("migrates a stored v0.1 Null result without changing its status or source records", async () => {
    const legacy = await buildReproducibleRunBundleV0_1({ result: makeResult("null_no_supported_candidate") });
    const migrated = await parseReproducibleRunBundleV0_2(serializeReproducibleRunBundleV0_1(legacy));
    expect(migrated.ok).toBe(true);
    if (!migrated.ok) return;
    expect(migrated.migratedFromV0_1).toBe(true);
    const status = migrated.value.result.analysisStatusV0_2 as Record<string, unknown>;
    expect(status.status).toBe("null_no_supported_candidate");
    expect(status.candidateOnlyOperators).toEqual([]);
    expect(migrated.value.result.candidates[0]).toMatchObject({
      candidateId: "candidate.di.study",
      evidenceRefs: ["source:albanian-di:entry-1"],
    });
    expect(serializeReproducibleRunBundleV0_2(migrated.value)).not.toMatch(/winner|no_single_winner/i);
  });

  it("rejects tampering after neutral projection", async () => {
    const bundle = await buildReproducibleRunBundleV0_2({ result: migrateLegacyAnalyzeWordResultInputV2(makeResult()) });
    const tampered = JSON.parse(serializeReproducibleRunBundleV0_2(bundle));
    tampered.result.candidates[0].candidateId = "changed";
    await expect(parseReproducibleRunBundleV0_2(tampered)).resolves.toMatchObject({
      ok: false,
      reason: "fingerprint_mismatch",
    });
  });
});
