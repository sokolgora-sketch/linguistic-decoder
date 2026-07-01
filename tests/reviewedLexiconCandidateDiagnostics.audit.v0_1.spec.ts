import { execFileSync } from "node:child_process";

describe("reviewed lexicon candidate diagnostics audit v0.1", () => {
  it("prints non-live Gheg DA candidate diagnostics without production promotion", () => {
    const raw = execFileSync(
      "node",
      ["scripts/reviewed-lexicon-candidate-diagnostics.v0.1.mjs"],
      { encoding: "utf8" },
    );

    const report = JSON.parse(raw);
    expect(report.reportVersion).toBe("reviewed-lexicon-candidate-diagnostics.v0.1");
    expect(report.rows).toHaveLength(1);

    expect(report.rows[0]).toMatchObject({
      sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
      candidateId: "albanian-da-dam-damage-functional",
      productionSafe: false,
      liveStatus: "non_live_candidate",
      validationOutcome: "source_validation_eligible",
      evidenceCategories: [
        "free_operator_attested",
        "functional_motivation_supported",
        "historical_origin_not_claimed",
        "user_decides",
      ],
      userDecisionPosture: "user_decides",
    });

    expect(report.rows[0].freeOperatorDiagnostic).toMatchObject({
      operator: "da",
      attestedForms: ["da"],
      historicalOriginClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });
    expect(report.rows[0].nonLiveReason).toContain("NON-LIVE CANDIDATE");
  });
});
