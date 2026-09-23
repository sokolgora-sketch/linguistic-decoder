import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildFrozenLevel3WordFunctionalEvaluationV0_1,
  serializeFrozenLevel3WordFunctionalEvaluationV0_1,
} from "../scripts/openInstrumentFrozenLevel3WordFunctionalEvaluation.v0_1";

const artifactPath = resolve(
  process.cwd(),
  "docs/open-instrument/evaluation/open-instrument-frozen-level3-word-functional-evaluation-v0.1.json",
);

describe("Open Instrument frozen Level-3 word functional evaluation v0.1", () => {
  test("checked-in artifact is reproducible from the frozen baseline and current deterministic canon", () => {
    const expected = serializeFrozenLevel3WordFunctionalEvaluationV0_1();
    expect(readFileSync(artifactPath, "utf8")).toBe(expected);
  });

  test("keeps the evaluation population and mechanical result separate from semantic hypotheses", () => {
    const artifact = buildFrozenLevel3WordFunctionalEvaluationV0_1() as any;

    expect(artifact.repository).toMatchObject({
      repositoryIdentity: "sokolgora-sketch/linguistic-decoder",
      mainShaAtEvaluationFreeze: "70ba8d94b113a97ffdd0354a65772ff9fbd9557d",
      baselineArtifactSha256: "096792e7aa68f22a6a49585e342f886811ffac6b6b8c6ecc9adcb594ca36070a",
    });
    expect(artifact.population).toMatchObject({
      baselineCaseCount: 57,
      exactTwoDistinctCount: 30,
      historicalProofCaseCount: 14,
      newGenericCaseCount: 16,
    });
    expect(artifact.metrics.mechanical).toEqual({ pass: 30, fail: 0, passRate: 1 });
    expect(artifact.metrics.providerCalls).toBe(0);
    expect(artifact.humanEvaluation.participantCount).toBe(0);
    expect(artifact.evidenceSeparation).toMatchObject({
      analyticalStatusChanges: 0,
      evidenceStatusChanges: 0,
      candidateStatusChanges: 0,
      evidenceRefsChanged: 0,
      productionEvidencePromoted: 0,
    });
  });

  test("records the exact historical and generic cohort membership", () => {
    const artifact = buildFrozenLevel3WordFunctionalEvaluationV0_1() as any;
    const historical = artifact.cases.filter((item: any) => item.cohort === "HISTORICAL_PROOF_PATH");
    const generic = artifact.cases.filter((item: any) => item.cohort === "NEW_GENERIC_PATH");

    expect(historical.map((item: any) => item.caseId)).toEqual([
      "canonical.study",
      "canonical.water",
      "target-sense.candle",
      "target-sense.water-physical-liquid",
      "scale50.sea.nature",
      "scale50.head.body",
      "scale50.heart.body",
      "scale50.ear.body",
      "scale50.speak.action",
      "scale50.hear.action",
      "scale50.eat.action",
      "scale50.break.action",
      "scale50.death.abstract",
      "scale50.change.abstract",
    ]);
    expect(historical).toHaveLength(14);
    expect(generic).toHaveLength(16);
    expect(generic.map((item: any) => item.caseId)).toEqual([
      "scale50.rain.nature",
      "scale50.river.nature",
      "scale50.stone.nature",
      "scale50.cloud.nature",
      "scale50.bone.body",
      "scale50.mouth.body",
      "scale50.nose.body",
      "scale50.build.action",
      "scale50.carry.action",
      "scale50.time.abstract",
      "scale50.life.abstract",
      "scale50.order.abstract",
      "scale50.mother.human-social",
      "scale50.friend.human-social",
      "scale50.home.human-social",
      "scale50.woman.human-social",
    ]);
  });

  test("preserves the explicit non-production and human-evaluation boundaries", () => {
    const artifact = buildFrozenLevel3WordFunctionalEvaluationV0_1() as any;

    expect(artifact.frozenCanon).toMatchObject({
      connector: "with",
      genericAuthorizedPairCount: 42,
      selfPairs: "SELF_PAIR_UNRESOLVED_NON_PRODUCTION",
      triples: "NOT_AUTHORIZED",
      longerPaths: "NOT_AUTHORIZED",
      level4: "NOT_AUTHORIZED",
      changedDuringEvaluation: false,
    });
    expect(artifact.claimBoundary).toMatchObject({
      researcherScreeningIsNotFact: true,
      researcherScreeningIsNotHumanValidated: true,
      researcherScreeningIsNotProductionEvidence: true,
      noAtomRevision: true,
      noTemplateRevision: true,
      noEvidencePromotion: true,
      noWinnerSelection: true,
      userDecides: true,
    });
    expect(createHash("sha256").update(serializeFrozenLevel3WordFunctionalEvaluationV0_1()).digest("hex")).toHaveLength(64);
  });
});
