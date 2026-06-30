import { evaluateReviewedExternalLexiconEvidenceGateV0_1 } from "../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";
import {
  reviewedExternalLexiconSourceRowFixtureContractRowsV0_1,
  syntheticDaDerivativeTrapSourceRowFixtureV0_1,
  syntheticDaHomophoneTrapSourceRowFixtureV0_1,
  syntheticReviewedDiSourceRowFixtureV0_1,
  syntheticReviewedGhegDaSourceRowFixtureV0_1,
  syntheticSeedSourceRowFixtureV0_1,
} from "./fixtures/openInstrument/reviewedExternalLexiconSourceRows.fixture.v0_1";

function flattenStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenStrings);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(flattenStrings);
  }

  return [];
}

function resultText(value: unknown): string {
  return flattenStrings(value).join("\n");
}

function evaluateFixture(row: unknown): unknown {
  return evaluateReviewedExternalLexiconEvidenceGateV0_1(row as never);
}

describe("reviewed external lexicon source row fixture gate v0.1", () => {
  it("evaluates every synthetic fixture row through the real reviewed external lexicon evidence gate", () => {
    const results = reviewedExternalLexiconSourceRowFixtureContractRowsV0_1.map((row) =>
      evaluateFixture(row),
    );

    expect(results).toHaveLength(5);

    for (const result of results) {
      expect(result).toBeTruthy();
      expect(typeof result).toBe("object");
    }
  });

  it("allows the synthetic reviewed DI row through the positive validator path without making it live evidence", () => {
    const result = evaluateFixture(syntheticReviewedDiSourceRowFixtureV0_1);
    const text = resultText(result);

    expect(text).toMatch(/pass|valid|accepted/i);
    expect(text).not.toContain("sourceKind_seed_not_validation");
    expect(text).not.toContain("da_quarantine_missing_reviewed_exact_external_citation");
    expect(text).not.toContain("di_composition_bridge_missing");

    expect(syntheticReviewedDiSourceRowFixtureV0_1.sourceNote).toContain(
      "CONTRACT TEST ONLY",
    );
    expect(syntheticReviewedDiSourceRowFixtureV0_1.externalCitations[0].sourceUrlOrArchiveRef).toMatch(
      /^fixture:\/\//,
    );
    expect(syntheticReviewedDiSourceRowFixtureV0_1.originClaim).toBe(false);
    expect(syntheticReviewedDiSourceRowFixtureV0_1.winnerClaim).toBe(false);
    expect(syntheticReviewedDiSourceRowFixtureV0_1.userDecisionPosture).toBe(
      "user_decides",
    );
  });


  it("allows the synthetic reviewed Gheg DA row through the positive validator path without making it live evidence", () => {
    const result = evaluateFixture(syntheticReviewedGhegDaSourceRowFixtureV0_1);
    const text = resultText(result);

    expect(text).toMatch(/pass|valid|accepted|eligible/i);
    expect(text).not.toContain("da_quarantine_missing_reviewed_exact_external_citation");
    expect(text).not.toContain("externalCitation_homophone_collision");
    expect(text).not.toContain("externalCitation_derivative_not_embryo");

    expect(syntheticReviewedGhegDaSourceRowFixtureV0_1.sourceNote).toContain(
      "CONTRACT TEST ONLY",
    );
    expect(syntheticReviewedGhegDaSourceRowFixtureV0_1.externalCitations[0].attestedForm).toBe("da");
    expect(syntheticReviewedGhegDaSourceRowFixtureV0_1.externalCitations[0].attestedGloss).toBe(
      "split / divide",
    );
    expect(syntheticReviewedGhegDaSourceRowFixtureV0_1.externalCitations[0].attestedGrammarNote).toContain(
      "E kom da bukën për gjysë",
    );
    expect(syntheticReviewedGhegDaSourceRowFixtureV0_1.originClaim).toBe(false);
    expect(syntheticReviewedGhegDaSourceRowFixtureV0_1.winnerClaim).toBe(false);
    expect(syntheticReviewedGhegDaSourceRowFixtureV0_1.userDecisionPosture).toBe(
      "user_decides",
    );
  });

  it("blocks the SEED fixture by real validator reason code", () => {
    const result = evaluateFixture(syntheticSeedSourceRowFixtureV0_1);
    const text = resultText(result);

    expect(text).toContain("sourceKind_seed_not_validation");
    expect(text).toMatch(/block|fail|reject|not_validation/i);
  });

  it("blocks reviewed DI when the semantic bridge is removed", () => {
    const result = evaluateFixture({
      ...syntheticReviewedDiSourceRowFixtureV0_1,
      semanticBridge: "",
    });
    const text = resultText(result);

    expect(text).toContain("di_composition_bridge_missing");
    expect(text).toMatch(/block|fail|reject|missing/i);
  });

  it("blocks the DA derivative trap by real quarantine reason code", () => {
    const result = evaluateFixture(syntheticDaDerivativeTrapSourceRowFixtureV0_1);
    const text = resultText(result);

    expect(text).toContain("da_quarantine_missing_reviewed_exact_external_citation");
    expect(text).toMatch(/block|fail|reject|quarantine|missing/i);
  });

  it("blocks the DA homophone trap by real quarantine reason code", () => {
    const result = evaluateFixture(syntheticDaHomophoneTrapSourceRowFixtureV0_1);
    const text = resultText(result);

    expect(text).toContain("da_quarantine_missing_reviewed_exact_external_citation");
    expect(text).toMatch(/block|fail|reject|quarantine|missing/i);
  });

  it("keeps fixture gate validation test-only and non-live", () => {
    for (const row of reviewedExternalLexiconSourceRowFixtureContractRowsV0_1) {
      expect(row.sourceId).toMatch(/^fixture\.synthetic\./);
      expect(row.sourceNote).toContain("CONTRACT TEST ONLY");
      expect(row.originClaim).toBe(false);
      expect(row.historicalTransmissionClaim).toBe(false);
      expect(row.winnerClaim).toBe(false);
      expect(row.languageSuperiorityClaim).toBe(false);
      expect(row.candidateTruthClaim).toBe(false);
      expect(row.publicationEvidenceClaim).toBe(false);
      expect(row.scientificEvidenceClaim).toBe(false);
      expect(row.userDecisionPosture).toBe("user_decides");

      for (const citation of row.externalCitations) {
        expect(citation.citationId).toMatch(/^fixture\.synthetic\./);
        expect(citation.sourceUrlOrArchiveRef).toMatch(/^fixture:\/\//);
        expect(citation.reviewNote).toContain("CONTRACT TEST ONLY");
      }
    }
  });
});
