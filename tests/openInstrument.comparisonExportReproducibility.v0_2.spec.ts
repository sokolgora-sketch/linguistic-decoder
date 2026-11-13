import { webcrypto } from "node:crypto";
import { toAnalyzeWordResultV2Contract } from "@/shared/analyzeWordResult.v2.contract";
import {
  buildReproducibleRunBundleV0_1,
  serializeReproducibleRunBundleV0_1,
} from "@/shared/openInstrument/reproducibleRunBundle.v0_1";
import {
  buildReproducibleRunBundleV0_2,
  parseReproducibleRunBundleV0_2,
  serializeReproducibleRunBundleV0_2,
} from "@/shared/openInstrument/reproducibleRunBundle.v0_2";
import {
  buildComparisonExportArtifactV0_1,
  serializeComparisonExportArtifactV0_1,
} from "@/ui/instrument/comparisonExportReproducibility.v0_1";
import {
  buildComparisonExportArtifactV0_2,
  parseComparisonExportArtifactV0_2,
  serializeComparisonExportArtifactV0_2,
} from "@/ui/instrument/comparisonExportReproducibility.v0_2";

Object.defineProperty(globalThis, "crypto", { configurable: true, value: webcrypto });

const legacyStatus = {
  schemaVersion: "open-instrument.analysis-status.v0_1",
  status: "candidate_only",
  summary: "Candidate-only result; no single winner is claimed.",
  reviewedOperators: [],
  candidateOnlyOperators: ["DI"],
  researchHypothesisEmbryos: [],
  structuralTokens: ["DI"],
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
};

function result(word: string) {
  return {
    word,
    sanitized: word,
    engineVersion: "test-engine",
    mode: "strict",
    alphabet: "latin",
    candidates: [],
    analysisStatusV0_1: legacyStatus,
    originClaimGates: { winnerClaim: "not_claimed" },
  };
}

async function bundle(word: string) {
  return buildReproducibleRunBundleV0_2({ result: toAnalyzeWordResultV2Contract(result(word)), createdAt: "2026-11-13T00:00:00.000Z" });
}

describe("neutral comparison export v0.2", () => {
  it("exports and revalidates exact neutral source bundles and their ordered comparison", async () => {
    const artifact = await buildComparisonExportArtifactV0_2({
      left: await bundle("study"),
      right: await bundle("damage"),
    });
    const serialized = serializeComparisonExportArtifactV0_2(artifact);
    expect(serialized).not.toMatch(/winner|no_single_winner/i);
    expect(artifact.schemaVersion).toBe("open-instrument.comparison-export-reproducibility.v0.2");
    expect(artifact.left.result.analysisStatusV0_2.status).toBe("candidate_only");
    await expect(parseComparisonExportArtifactV0_2(serialized)).resolves.toMatchObject({ ok: true });

    const tampered = JSON.parse(serialized);
    tampered.comparison.left.word = "changed";
    await expect(parseComparisonExportArtifactV0_2(tampered)).resolves.toMatchObject({
      ok: false,
      reason: "STORED_PROJECTION_MISMATCH",
    });
  });

  it("upgrades a previously stored v0.1 comparison only at the import boundary", async () => {
    const left = await buildReproducibleRunBundleV0_1({ result: result("study") });
    const right = await buildReproducibleRunBundleV0_1({ result: result("damage") });
    const oldArtifact = await buildComparisonExportArtifactV0_1({ left, right });
    const migrated = await parseComparisonExportArtifactV0_2(serializeComparisonExportArtifactV0_1(oldArtifact));
    expect(migrated.ok).toBe(true);
    if (!migrated.ok) return;
    expect(migrated.migratedFromV0_1).toBe(true);
    expect(migrated.value.schemaVersion).toBe("open-instrument.comparison-export-reproducibility.v0.2");
    expect(serializeComparisonExportArtifactV0_2(migrated.value)).not.toMatch(/winner|no_single_winner/i);
    const upgradedLeft = await parseReproducibleRunBundleV0_2(migrated.value.left);
    expect(upgradedLeft.ok).toBe(true);
  });
});
