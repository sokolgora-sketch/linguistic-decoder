import { webcrypto } from "node:crypto";
import {
  hasLegacyInterpretationFieldsV2,
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
    originClaimGates: { winnerClaim: "not_claimed" },
  };
}

describe("reproducible run bundle v0.2", () => {
  it("serializes only neutral fields and preserves candidate source identity", async () => {
    const result = toAnalyzeWordResultV2Contract(makeResult());
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

    const neutral = toAnalyzeWordResultV2Contract(legacy);
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
    const bundle = await buildReproducibleRunBundleV0_2({ result: toAnalyzeWordResultV2Contract(makeResult()) });
    const tampered = JSON.parse(serializeReproducibleRunBundleV0_2(bundle));
    tampered.result.candidates[0].candidateId = "changed";
    await expect(parseReproducibleRunBundleV0_2(tampered)).resolves.toMatchObject({
      ok: false,
      reason: "fingerprint_mismatch",
    });
  });
});
