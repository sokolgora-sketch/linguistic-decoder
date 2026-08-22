import { execFileSync } from "node:child_process";

describe("reviewed lexicon candidate diagnostics audit v0.1", () => {
  it("prints reviewed candidate diagnostics with bounded promotion posture", () => {
    const raw = execFileSync(
      "node",
      ["scripts/reviewed-lexicon-candidate-diagnostics.v0.1.mjs"],
      { encoding: "utf8" },
    );

    const report = JSON.parse(raw);
    expect(report.reportVersion).toBe("reviewed-lexicon-candidate-diagnostics.v0.1");
    expect(report.rows).toHaveLength(4);

    const daRow = report.rows.find(
      (row: { sourceId?: string }) =>
        row.sourceId === "reviewed.external.gheg-da.damage.candidate.v0_1",
    );
    const diRow = report.rows.find(
      (row: { sourceId?: string }) =>
        row.sourceId === "reviewed.external.di.knowledge.candidate.v0_1",
    );
    const joRow = report.rows.find(
      (row: { sourceId?: string }) =>
        row.sourceId === "reviewed.external.jo.refusal.candidate.v0_1",
    );

    expect(daRow).toBeDefined();
    expect(diRow).toBeDefined();
    expect(joRow).toBeDefined();

    expect(daRow).toMatchObject({
      sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
      candidateId: "albanian-da-dam-damage-functional",
      productionSafe: true,
      liveStatus: "promotion_ready_candidate",
      validationOutcome: "source_validation_eligible",
      evidenceCategories: [
        "free_operator_attested",
        "functional_motivation_supported",
        "historical_origin_not_claimed",
        "user_decides",
      ],
      userDecisionPosture: "user_decides",
    });

    expect(daRow.freeOperatorDiagnostic).toMatchObject({
      operator: "da",
      attestedForms: ["da"],
      historicalOriginClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });
    expect(daRow.nonLiveReason).toBeNull();
    expect(daRow.promotionChecklist).toMatchObject({
      checklistVersion: "reviewed-external-lexicon-promotion-checklist.v0_1",
      promotionReady: true,
    });
    expect(daRow.promotionChecklistFailedItems).toEqual([]);

    expect(diRow).toMatchObject({
      sourceId: "reviewed.external.di.knowledge.candidate.v0_1",
      candidateId: "albanian-di-know-functional",
      productionSafe: true,
      validationOutcome: "source_validation_eligible",
      evidenceCategories: [
        "free_operator_attested",
        "functional_motivation_supported",
        "historical_origin_not_claimed",
        "user_decides",
      ],
      userDecisionPosture: "user_decides",
    });
    expect(diRow.liveStatus).not.toBe("production_live");
    expect(diRow.freeOperatorDiagnostic).toMatchObject({
      operator: "di",
      attestedForms: ["di"],
      historicalOriginClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });
    expect(diRow.nonLiveReason).toBeNull();
    expect(diRow.promotionChecklist).toMatchObject({
      checklistVersion: "reviewed-external-lexicon-promotion-checklist.v0_1",
      promotionReady: true,
    });
    expect(diRow.promotionChecklistFailedItems).toEqual([]);

    expect(joRow).toMatchObject({
      sourceId:
        "reviewed.external.jo.refusal.candidate.v0_1",
      candidateId:
        "albanian-jo-standalone-refusal-functional",
      productionSafe: true,
      liveStatus:
        "promotion_ready_candidate",
      validationOutcome:
        "source_validation_eligible",
      evidenceCategories: [
        "historical_origin_not_claimed",
        "user_decides",
      ],
      userDecisionPosture:
        "user_decides",
    });

    expect(joRow.liveStatus).not.toBe(
      "production_live",
    );

    expect(joRow.freeOperatorDiagnostic).toMatchObject({
      operator: "jo",
      attestedForms: ["jo"],
      historicalOriginClaim:
        "not_claimed",
      userDecisionPosture:
        "user_decides",
    });

    expect(joRow.nonLiveReason).toBeNull();

    expect(joRow.promotionChecklist).toMatchObject({
      checklistVersion:
        "reviewed-external-lexicon-promotion-checklist.v0_1",
      promotionReady: true,
    });

    expect(
      joRow.promotionChecklistFailedItems,
    ).toEqual([]);
  });
});
