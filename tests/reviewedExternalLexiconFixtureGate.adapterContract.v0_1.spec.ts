import { evaluateReviewedExternalLexiconFixtureGateRowV0_1 } from "./fixtures/openInstrument/reviewedExternalLexiconFixtureGate.adapter.v0_1";
import {
  reviewedExternalLexiconSourceRowFixtureContractRowsV0_1,
  syntheticDaDerivativeTrapSourceRowFixtureV0_1,
  syntheticDaHomophoneTrapSourceRowFixtureV0_1,
  syntheticReviewedDiSourceRowFixtureV0_1,
  syntheticSeedSourceRowFixtureV0_1,
} from "./fixtures/openInstrument/reviewedExternalLexiconSourceRows.fixture.v0_1";

describe("reviewed external lexicon fixture gate adapter contract v0.1", () => {
  it("projects every fixture row into a stable test adapter result", () => {
    const projections = reviewedExternalLexiconSourceRowFixtureContractRowsV0_1.map((row) =>
      evaluateReviewedExternalLexiconFixtureGateRowV0_1(row),
    );

    expect(projections).toHaveLength(4);

    for (const projection of projections) {
      expect(projection).toEqual(
        expect.objectContaining({
          fixtureOnly: true,
          sourceId: expect.stringMatching(/^fixture\.synthetic\./),
          candidateId: expect.any(String),
          accepted: expect.any(Boolean),
          blocked: expect.any(Boolean),
          reasons: expect.any(Array),
          resultText: expect.any(String),
        }),
      );
    }
  });

  it("adapts synthetic reviewed DI as accepted while preserving fixture-only posture", () => {
    const projection = evaluateReviewedExternalLexiconFixtureGateRowV0_1(
      syntheticReviewedDiSourceRowFixtureV0_1,
    );

    expect(projection.sourceId).toBe("fixture.synthetic.reviewed-di.v0_1");
    expect(projection.candidateId).toBe("albanian-shtu-di-study-functional");
    expect(projection.fixtureOnly).toBe(true);
    expect(projection.accepted).toBe(true);
    expect(projection.blocked).toBe(false);
    expect(projection.reasons).not.toContain("sourceKind_seed_not_validation");
    expect(projection.reasons).not.toContain("di_composition_bridge_missing");
    expect(projection.reasons).not.toContain(
      "da_quarantine_missing_reviewed_exact_external_citation",
    );
  });

  it("adapts SEED as blocked by source kind reason", () => {
    const projection = evaluateReviewedExternalLexiconFixtureGateRowV0_1(
      syntheticSeedSourceRowFixtureV0_1,
    );

    expect(projection.accepted).toBe(false);
    expect(projection.blocked).toBe(true);
    expect(projection.reasons).toContain("sourceKind_seed_not_validation");
  });

  it("adapts DI without semantic bridge as blocked by bridge reason", () => {
    const projection = evaluateReviewedExternalLexiconFixtureGateRowV0_1({
      ...syntheticReviewedDiSourceRowFixtureV0_1,
      semanticBridge: "",
    });

    expect(projection.accepted).toBe(false);
    expect(projection.blocked).toBe(true);
    expect(projection.reasons).toContain("di_composition_bridge_missing");
  });

  it("adapts DA derivative trap as blocked by DA quarantine reason", () => {
    const projection = evaluateReviewedExternalLexiconFixtureGateRowV0_1(
      syntheticDaDerivativeTrapSourceRowFixtureV0_1,
    );

    expect(projection.accepted).toBe(false);
    expect(projection.blocked).toBe(true);
    expect(projection.reasons).toContain(
      "da_quarantine_missing_reviewed_exact_external_citation",
    );
  });

  it("adapts DA homophone trap as blocked by DA quarantine reason", () => {
    const projection = evaluateReviewedExternalLexiconFixtureGateRowV0_1(
      syntheticDaHomophoneTrapSourceRowFixtureV0_1,
    );

    expect(projection.accepted).toBe(false);
    expect(projection.blocked).toBe(true);
    expect(projection.reasons).toContain(
      "da_quarantine_missing_reviewed_exact_external_citation",
    );
  });
});
