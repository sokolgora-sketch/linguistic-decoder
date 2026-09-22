import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

type TrialArtifact = Record<string, any>;

const artifactPath = path.join(
  process.cwd(),
  "docs/open-instrument/research-artifacts/frozen-target-functional-research-trial-v0_1/restart-01.json",
);

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

describe("frozen target functional research trial v0.1 restart 01", () => {
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8")) as TrialArtifact;

  test("preserves the mechanically frozen selection and selected target", () => {
    expect(artifact.selection.eligibleCaseIds).toEqual([
      "scale50.blood.body",
      "scale50.child.human-social",
      "scale50.mother.human-social",
      "scale50.mountain.nature",
      "scale50.river.nature",
      "scale50.speak.action",
      "scale50.woman.human-social",
    ]);
    expect(artifact.selection.selectionRule).toBe("LEXICOGRAPHIC_FIRST_RESOLVED_CASE_ID");
    expect(artifact.selection.selectedCaseId).toBe("scale50.blood.body");
    expect(artifact.selection.targetSelectionFrozen).toBe(true);
    expect(artifact.selection.targetSelectionFreezeSha256).toBe(
      sha256(JSON.stringify({
        protocol: "open-instrument.frozen-target-functional-research-trial.v0_1.restart_01",
        poolArtifactSha256: "0bee1120ec263dee6572ec70a67989e64b6056a0c5f081e5f3a87cbcbb9b3a92",
        selectionRule: "LEXICOGRAPHIC_FIRST_RESOLVED_CASE_ID",
        eligibleCaseIds: artifact.selection.eligibleCaseIds,
        selectedCaseId: "scale50.blood.body",
      })),
    );
  });

  test("preserves the selected target structural freeze and claim boundaries", () => {
    expect(artifact.targetFreeze).toMatchObject({
      caseId: "scale50.blood.body",
      targetWord: "blood",
      targetSenseId: "cambridge.en.blood.noun.body-liquid-1",
      currentStatus: "structural_unreviewed",
      deterministicEmbryo: ["LO", "OOD"],
      sevenVoicesPath: ["O"],
      existingFunctionalCorrespondenceCount: 0,
      existingReviewedFunctionalCount: 0,
      noSingleWinner: true,
      userDecides: true,
    });
  });

  test("freezes bounded functions before correspondence evaluation", () => {
    expect(artifact.preTargetFunctionFreeze.result).toBe("BOUNDED_FUNCTIONS_FOUND");
    expect(artifact.preTargetFunctionFreeze.boundedFunctionCount).toBe(2);
    expect(artifact.preTargetFunctionFreeze.functions.map((item: any) => item.functionId)).toEqual([
      "lo.attention-calling-exclamation.v0_1",
      "gjak.physiological-transport-exchange-protection.v0_1",
    ]);
    expect(artifact.preTargetFunctionFreeze.preTargetFunctionFreezeSha256).toBe(
      "2fee4635d037925a53fb62d2119028908597968b401a26748283b6fdcc05e6be",
    );
  });

  test("records the negative correspondence result without production admission", () => {
    expect(artifact.scientificDecision).toBe("NO_ADMISSION_INSUFFICIENT_FUNCTIONAL_EVIDENCE");
    expect(artifact.targetCorrespondenceEvaluation).toHaveLength(2);
    expect(artifact.targetCorrespondenceEvaluation.map((item: any) => item.classification)).toEqual([
      "UNSUPPORTED_BRIDGE",
      "INSUFFICIENT_CORRESPONDENCE",
    ]);
    expect(artifact.outcome).toMatchObject({
      targetStatusBefore: "structural_unreviewed",
      targetStatusAfter: "structural_unreviewed",
      targetFunctionalRowsBefore: 0,
      targetFunctionalRowsAfter: 0,
      reviewedPromotions: 0,
      structuralMutations: 0,
      targetSwitches: 0,
      preSelectionEvidenceExposures: 0,
      catalogMutation: false,
      baselineMutation: false,
      runtimeMutation: false,
    });
  });

  test("preserves research-only boundaries", () => {
    expect(artifact.claimBoundaries).toMatchObject({
      functionalBridgeTruth: "hypothesis",
      claimBoundary: "research_only_no_production_evidence",
      historicalOriginClaim: "not_claimed",
      borrowingClaim: "not_claimed",
      cognacyClaim: "not_claimed",
      languageSuperiorityClaim: "not_claimed",
      candidateTruthClaim: "not_claimed",
      winnerClaim: "not_claimed",
      noSingleWinner: true,
      userDecides: true,
    });
  });
});
