import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { verifyStrictBlindEmbryoFirstReplicationSeriesV1Preregistration } from "../scripts/openInstrumentStrictBlindEmbryoFirstReplicationSeriesV1PreregistrationVerification.mjs";

const root = process.cwd();
const artifactPath = resolve(root, "docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1/preregistration.json");

describe("Open Instrument strict blind embryo-first replication series v1 preregistration", () => {
  test("verifies the frozen three-case selection and durable identities", () => {
    const result = verifyStrictBlindEmbryoFirstReplicationSeriesV1Preregistration();
    expect(result.selectedWords).toEqual(["direct", "synergy", "whole"]);
    expect(result.payloadResults).toHaveLength(3);
    expect(result.artifactSha256).toMatch(/^[a-f0-9]{64}$/);
  });

  test("keeps the series distinct from M7 and research-free", () => {
    const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
    expect(artifact.series.isM7).toBe(false);
    expect(artifact.protocolIntegrity.sourceResearchPerformed).toBe(false);
    expect(artifact.protocolIntegrity.blindRunsPerformed).toBe(false);
    expect(artifact.protocolIntegrity.targetRevealPerformed).toBe(false);
  });

  test("freezes the existing criterion and three-case stopping rule", () => {
    const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
    expect(artifact.positiveCriterion.reusedUnchanged).toBe(true);
    expect(artifact.sampleAndStopping.plannedValidNewCases).toBe(3);
    expect(artifact.sampleAndStopping.replacementForbiddenForScientificOutcome).toBe(true);
    expect(artifact.outcomeSpace).toEqual([
      "FUNCTIONAL_CORRESPONDENCE",
      "LEXICAL_EQUIVALENCE",
      "FORM_RESEMBLANCE_ONLY",
      "HISTORICAL_RELATION_ONLY",
      "INSUFFICIENT_CORRESPONDENCE",
      "NULL",
    ]);
  });

  test("freezes worker isolation, durability, and no-promotion boundaries", () => {
    const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
    expect(artifact.cleanWorkerPolicy.forkContext).toBe(false);
    expect(artifact.cleanWorkerPolicy.required).toContain("CLEAN_WORKER_NO_DF_BRAIN");
    expect(artifact.durabilityPolicy.revealBlockedUntilComplete).toBe(true);
    expect(artifact.claimBoundaries).toEqual(expect.arrayContaining(["research_only", "no_production_evidence", "no_single_winner", "user_decides", "null_is_valid"]));
    expect(artifact.protocolIntegrity.productionEvidenceAdmitted).toBe(false);
    expect(artifact.protocolIntegrity.runtimeMutated).toBe(false);
  });
});
