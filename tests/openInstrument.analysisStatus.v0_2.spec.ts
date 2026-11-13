import { buildAnalysisStatusV0_1 } from "@/shared/analysisStatus.v0_1";
import {
  buildAnalysisStatusV0_2,
  isAnalysisStatusV0_2,
  migrateAnalysisStatusV0_1ToV0_2,
} from "@/shared/analysisStatus.v0_2";

describe("analysis status v0.2 migration", () => {
  it("replaces the legacy claim marker with an explicit neutral policy", () => {
    const legacy = buildAnalysisStatusV0_1({});
    const migrated = migrateAnalysisStatusV0_1ToV0_2(legacy);
    expect(migrated).not.toBeNull();
    if (!migrated) return;

    expect(migrated).toMatchObject({
      schemaVersion: "open-instrument.analysis-status.v0_2",
      status: legacy.status,
      summary: legacy.summary,
      reviewedOperators: legacy.reviewedOperators,
      candidateOnlyOperators: legacy.candidateOnlyOperators,
      researchHypothesisEmbryos: legacy.researchHypothesisEmbryos,
      structuralTokens: legacy.structuralTokens,
      userDecisionPosture: "user_decides",
      interpretationDecisionPolicy: {
        multipleInterpretationsMayCoexist: true,
        automaticInterpretationSelection: "DISABLED",
        interpretationDecisionAuthority: "USER_DECIDES",
        alternativeProvenance: "PRESERVED_PER_INTERPRETATION",
        alternativeClaimStatus: "PRESERVED_PER_INTERPRETATION",
      },
    });
    expect(migrated.claimBoundary).not.toHaveProperty("winnerClaim");
    expect(isAnalysisStatusV0_2(migrated)).toBe(true);
  });

  it("rejects a legacy record that asserts selection authority", () => {
    const unsafe = JSON.parse(JSON.stringify(buildAnalysisStatusV0_1({}))) as Record<string, unknown>;
    const boundary = unsafe.claimBoundary as Record<string, unknown>;
    boundary.winnerClaim = "claimed";
    expect(migrateAnalysisStatusV0_1ToV0_2(unsafe)).toBeNull();
    expect(isAnalysisStatusV0_2({
      ...unsafe,
      schemaVersion: "open-instrument.analysis-status.v0_2",
      interpretationDecisionPolicy: {},
    })).toBe(false);
  });

  it("rejects neutral records that relax an existing evidence boundary", () => {
    const current = JSON.parse(JSON.stringify(buildAnalysisStatusV0_2({}))) as Record<string, unknown>;
    const boundary = current.claimBoundary as Record<string, unknown>;
    boundary.historicalOriginClaim = "claimed";
    expect(isAnalysisStatusV0_2(current)).toBe(false);
  });

  it("rejects legacy and unknown selection fields in the neutral schema", () => {
    const withLegacyField = {
      ...buildAnalysisStatusV0_2({}),
      noSingleWinner: true,
    };
    const withUnknownBoundaryField = {
      ...buildAnalysisStatusV0_2({}),
      claimBoundary: {
        ...buildAnalysisStatusV0_2({}).claimBoundary,
        preferredInterpretation: "candidate-a",
      },
    };
    expect(isAnalysisStatusV0_2(withLegacyField)).toBe(false);
    expect(isAnalysisStatusV0_2(withUnknownBoundaryField)).toBe(false);
  });

  it("generates neutral source text directly", () => {
    const status = buildAnalysisStatusV0_2({
      word: "study",
      rootMap: {
        keys: [{
          token: "DI",
          evidence: ["Reviewed functional free-operator evidence: historicalOriginClaim=not_claimed; winnerClaim=not_claimed; languageSuperiorityClaim=not_claimed; userDecisionPosture=user_decides"],
        }],
        tokens: ["DI"],
      },
    });
    expect(status.status).toBe("reviewed_functional_evidence");
    expect(status.summary).toContain("Multiple interpretations may coexist");
    expect(status.summary).toContain("automatic interpretation selection is disabled");
    expect(status.summary).not.toMatch(/winner/i);
  });
});
