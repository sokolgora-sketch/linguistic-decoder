import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  getLatinLexicalSubstrateRecordsV0_1,
} from "@/shared/openInstrument/latinLexicalSubstrate.v0_1";
import {
  getAlbanianLexicalSubstrateRecordsV0_1,
} from "@/shared/openInstrument/albanianLexicalSubstrate.v0_1";
import {
  createMultilingualDiscoverySubstrateS1LatinWitnessAdapterV0_2,
  getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2,
  getMultilingualDiscoverySubstrateS1LatinSubstrateRecordsV0_2,
  getMultilingualDiscoverySubstrateS1ProjectionProofV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS1.v0_2";
import {
  buildMultilingualDiscoverySubstrateS0BaselineV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS0.v0_2";
import {
  GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
  GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1,
  queryGenericFunctionalWitnessesV1,
} from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";

const BASELINE_PATH =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/baseline.json";
const MANIFEST_PATH =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/hash-manifest.json";
const EXPECTED_BASELINE_SHA256 =
  "52fd4865fd3a0eb2067ea460af7d75024948de5c56cbcc8ce9936361a591a58e";
const EXPECTED_MANIFEST_SHA256 =
  "38d57de7082b4d719b76aa5cf34e177c5e0d811a1a11341bba9535fafcbf764f";

function readRepositoryFile(relativePath: string): Buffer {
  return fs.readFileSync(path.join(process.cwd(), relativePath));
}

function sha256(bytes: Buffer): string {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function canonicalJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function s0Baseline() {
  return buildMultilingualDiscoverySubstrateS0BaselineV0_2({
    repositoryBaselineHead:
      "275594b92e88dd4feb41b1126224ef570a08fa9b",
  });
}

describe("multilingual Discovery substrate v0.2 S1 Latin projection", () => {
  test("keeps the immutable S0 artifact and reconstructs its frozen cohort", () => {
    const baselineArtifact = JSON.parse(readRepositoryFile(BASELINE_PATH).toString("utf8"));
    const baselineBytes = Buffer.from(canonicalJson(baselineArtifact), "utf8");
    const manifestArtifact = JSON.parse(readRepositoryFile(MANIFEST_PATH).toString("utf8"));
    const manifestBytes = Buffer.from(canonicalJson(manifestArtifact), "utf8");
    const reconstructed = s0Baseline();

    expect(sha256(baselineBytes)).toBe(EXPECTED_BASELINE_SHA256);
    expect(sha256(manifestBytes)).toBe(EXPECTED_MANIFEST_SHA256);
    expect(reconstructed.directSubstrate.total).toBe(57);
    expect(reconstructed.catalog.counts.s1Selected).toBe(19);
    expect(reconstructed.s1Cohort.rows.map((row) => row.researchEvidenceId)).toEqual(
      baselineArtifact.s1Cohort.rows.map((row: { researchEvidenceId: string }) =>
        row.researchEvidenceId,
      ),
    );
    expect(baselineArtifact.s1Cohort.targetWordSelectionPresent).toBe(false);
    expect(baselineArtifact.evaluationProcedure.expandedResultsInspected).toBe(false);
  });

  test("projects exactly the frozen Latin cohort with complete source identity", () => {
    const baseline = s0Baseline();
    const projection = getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2();
    const selectedIds = new Set(
      baseline.s1Cohort.rows.map((row) => row.researchEvidenceId),
    );
    const loadedById = new Map(
      baseline.catalog.loadedRows.map((row) => [row.researchEvidenceId, row]),
    );

    expect(projection).toHaveLength(19);
    expect(projection.every((record) => record.language === "Latin")).toBe(true);
    expect(projection.every((record) => selectedIds.has(record.sourceRecordId))).toBe(true);
    expect(new Set(projection.map((record) => record.sourceRecordId)).size).toBe(19);

    for (const record of projection) {
      const sourceRow = loadedById.get(record.sourceRecordId);
      expect(sourceRow).toBeDefined();
      expect(sourceRow?.s0Classification).toBe("S1_SELECTED");
      expect(record.sourceTraditionId).toBe(sourceRow?.sourceTraditionIds[0]);
      expect(record.queryForm).toBe(sourceRow?.normalizedQueryKey);
      expect(record.citation.citationId).toBe(sourceRow?.citationIds[0]);
      expect(record.citation.attestedForm).toBe(sourceRow?.citations[0].attestedForm);
      expect(record.citation.attestedGloss).toBe(sourceRow?.citations[0].attestedGloss);
      expect(record.gloss).toBe(record.citation.attestedGloss);
      expect(record.sourceRecordId).toBe(sourceRow?.researchEvidenceId);
      expect(record.relationOperationIds).toEqual(["structural_display_form_v0_1"]);
    }
  });

  test("preserves the baseline and reports both collision scopes", () => {
    const baseline = s0Baseline();
    const proof = getMultilingualDiscoverySubstrateS1ProjectionProofV0_2();
    const baseLatin = getLatinLexicalSubstrateRecordsV0_1();
    const composedLatin = getMultilingualDiscoverySubstrateS1LatinSubstrateRecordsV0_2();
    const composedDirect = [
      ...getAlbanianLexicalSubstrateRecordsV0_1(),
      ...composedLatin,
    ];

    expect(baseLatin).toHaveLength(2);
    expect(composedLatin).toHaveLength(21);
    expect(composedDirect).toHaveLength(76);
    expect(composedDirect.filter((record) => record.language === "Latin")).toHaveLength(21);
    expect(composedDirect.filter((record) =>
      record.language === "Albanian" || record.language === "sq",
    )).toHaveLength(55);
    expect(composedDirect.filter((record) =>
      record.language !== "Latin" && record.language !== "Albanian" && record.language !== "sq",
    ))
      .toHaveLength(0);
    expect(new Set(composedDirect.map((record) => record.sourceForm)).size).toBe(76);
    expect(new Set(composedDirect.map((record) => record.queryForm)).size).toBe(76);
    expect(proof.projectedCount).toBe(19);
    expect(proof.baselineRecordCount).toBe(57);
    expect(proof.projectedLatinRecordCount).toBe(19);
    expect(proof.baselineVsS1QueryKeyCollisions).toEqual([]);
    expect(proof.intraCohortQueryKeyCollisions).toEqual([]);
    expect(proof.multiCitationRowCount).toBe(0);
    expect(proof.multiCitationIdentitiesPreserved).toBe(true);
    expect(proof.s3EvaluationExecuted).toBe(false);
    expect(baseline.directSubstrate.languageCounts).toEqual({ Albanian: 55, Latin: 2 });
  });

  test("keeps held/excluded rows out and does not add Greek", () => {
    const baseline = s0Baseline();
    const projectedIds = new Set(
      getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2().map(
        (record) => record.sourceRecordId,
      ),
    );
    const heldIds = [
      ...baseline.heldAndExcluded.admissionUnresolved,
      ...baseline.heldAndExcluded.adapterDeferred,
      ...baseline.heldAndExcluded.boundaryExcluded,
    ];

    expect(heldIds.some((id) => projectedIds.has(id))).toBe(false);
    expect(
      getMultilingualDiscoverySubstrateS1LatinSubstrateRecordsV0_2()
        .some((record) => record.language === "Ancient Greek"),
    ).toBe(false);
    expect(baseline.heldAndExcluded.admissionUnresolved).toHaveLength(6);
    expect(baseline.heldAndExcluded.adapterDeferred).toHaveLength(2);
    expect(baseline.heldAndExcluded.boundaryExcluded).toHaveLength(14);
  });

  test("uses the existing generic query seam without pronunciation authority", () => {
    const record = getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2()
      .find((candidate) => candidate.sourceForm === "ars");
    expect(record).toBeDefined();

    const adapter = createMultilingualDiscoverySubstrateS1LatinWitnessAdapterV0_2();
    const result = queryGenericFunctionalWitnessesV1({
      schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
      embryo: record?.queryForm,
      voicePath: ["A"],
      queryNormalization: GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1,
    }, [adapter]);

    expect(adapter.candidateVoicePathPolicy).toBe("NULL_UNAUTHORIZED");
    expect(result.status).toBe("MATCHES_FOUND");
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].sourceId).toBe(record?.sourceRecordId);
    expect(result.matches[0].gloss).toBe(record?.citation.attestedGloss);
    expect(result.matches[0].sourceAttestation).toBe("SOURCE_RECORD_ONLY");
    expect(result.matches[0].targetMeaning).toBe("NOT_CLAIMED");
    expect(result.matches[0].historicalRelation).toBe("NOT_CLAIMED");
    expect(result.matches[0].noSingleWinner).toBe(true);
  });

  test("is deterministic and contains no target-specific projection path", () => {
    const first = getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2();
    const second = getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2();
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/shared/openInstrument/multilingualDiscoverySubstrateS1.v0_2.ts"),
      "utf8",
    );

    expect(first).toEqual(second);
    expect(first.map((record) => record.sourceRecordId)).toEqual(
      [...first].map((record) => record.sourceRecordId).sort(),
    );
    expect(source).not.toContain("targetWord");
    expect(source).not.toMatch(/if\s*\([^)]*(word|query|embryo)\s*===/);
    expect(source).not.toContain("expandedResultsInspected: true");
  });
});
