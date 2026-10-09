import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import {
  ENGLISH_KAIKKI_DETERMINISTIC_INDEX_HUMAN_DEFINITION_SHA256_V0_1,
  ENGLISH_KAIKKI_DETERMINISTIC_INDEX_MACHINE_CONTRACT_SHA256_V0_1,
  artifactIdentitySha256V0_1,
  createIdentityPayloadV0_1,
} from "@/shared/openInstrument/englishKaikkiDeterministicIndex.v0_1";

const correctionPath =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/authority-identity-correction-reconciliation.json";
const correctionDocPath = "docs/open-instrument/english-kaikki-deterministic-index-v0.1-authority-identity-correction-v0.1.md";
const contractPath =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/contract.json";
const definitionPath = "docs/open-instrument/english-kaikki-deterministic-index-v0.1.md";
const hashManifestPath =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/hash-manifest.json";
const executionResultPath =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/index-build-execution-result.json";

const correction = JSON.parse(readFileSync(correctionPath, "utf8")) as any;
const contract = JSON.parse(readFileSync(contractPath, "utf8")) as any;
const hashManifest = JSON.parse(readFileSync(hashManifestPath, "utf8")) as any;
const historicalExecution = JSON.parse(readFileSync(executionResultPath, "utf8")) as any;

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

describe("post-#2133 deterministic-index authority correction", () => {
  it("keeps machine-contract and human-definition roles explicit and distinct", () => {
    expect(sha256(contractPath)).toBe(ENGLISH_KAIKKI_DETERMINISTIC_INDEX_MACHINE_CONTRACT_SHA256_V0_1);
    expect(sha256(definitionPath)).toBe(ENGLISH_KAIKKI_DETERMINISTIC_INDEX_HUMAN_DEFINITION_SHA256_V0_1);
    expect(ENGLISH_KAIKKI_DETERMINISTIC_INDEX_MACHINE_CONTRACT_SHA256_V0_1).not.toBe(
      ENGLISH_KAIKKI_DETERMINISTIC_INDEX_HUMAN_DEFINITION_SHA256_V0_1,
    );
    expect(hashManifest.artifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ role: "machine_readable_contract", sha256: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_MACHINE_CONTRACT_SHA256_V0_1 }),
        expect.objectContaining({ role: "human_definition", sha256: ENGLISH_KAIKKI_DETERMINISTIC_INDEX_HUMAN_DEFINITION_SHA256_V0_1 }),
      ]),
    );
    const payload = createIdentityPayloadV0_1({
      sourceSnapshot: { expectedBytes: 3335546346, expectedSha256: "9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195" },
      adapter: {
        contractId: "OPEN_INSTRUMENT_ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_V0_1",
        contractSha256: "a359b0a8d6fe172b32937aed93690545adfc2403c40419209f358fc46d14ed02",
        implementationCommit: "4e37b56b9194983b836f85269033f916c6ae408d",
        implementationSha256: "2b8a41fd2c5cd8d7a11e8b157690d3e4b4dfd12ed44a1de48c5070347e11c28f",
      },
      files: [
        { path: "directory.ndjson", bytes: 133425417, sha256: "2455eaf2ef9cb625d0744986e6ea65103796cd0465ef1e8d52cadd22427cfd5a" },
        { path: "postings.ndjson", bytes: 747334531, sha256: "1c9e35493e1e76d9189cef3a9bffb091194f541c4be4414f9c07971aff2f680a" },
      ],
    });
    expect(payload.indexContractSha256).toBe(ENGLISH_KAIKKI_DETERMINISTIC_INDEX_MACHINE_CONTRACT_SHA256_V0_1);
    expect(artifactIdentitySha256V0_1(payload)).toBe(correction.externalArtifact.after.artifactIdentitySha256);
  });

  it("preserves historical authority and reconciles the external identity additively", () => {
    expect(correction.parentAuthority.historicalArtifactsRemainImmutable).toBe(true);
    expect(historicalExecution.indexContract.sha256).toBe(ENGLISH_KAIKKI_DETERMINISTIC_INDEX_HUMAN_DEFINITION_SHA256_V0_1);
    expect(correction.attemptHistory.projectControlledHistoricalAccounting).toEqual([
      expect.objectContaining({ attempt: 1, result: "FAIL", failureCode: "ERR_USE_AFTER_CLOSE" }),
      expect.objectContaining({ attempt: 2, result: "FAIL", failureCode: "ERR_USE_AFTER_CLOSE" }),
      expect.objectContaining({ attempt: 3, result: "PASS" }),
      expect.objectContaining({ attempt: 4, result: "NOT_EXECUTED" }),
    ]);
    expect(correction.attemptHistory.durablyRecoverableEvidence.bothPriorFailuresIndependentlyRecoverableFromOldArtifact).toBe(false);
    expect(correction.externalArtifact.before.artifactIdentitySha256).not.toBe(correction.externalArtifact.after.artifactIdentitySha256);
    expect(correction.externalArtifact.before.directory).toEqual(correction.externalArtifact.after.directory);
    expect(correction.externalArtifact.before.postings).toEqual(correction.externalArtifact.after.postings);
    expect(correction.externalArtifact.manifestCountsBefore).toEqual({
      recordsProcessed: 1492836,
      postingsWritten: 1492836,
      distinctLookupKeys: 1349964,
    });
    expect(correction.externalArtifact.manifestCountsAfter).toEqual({
      recordsProcessed: 1486239,
      postingsWritten: 1486239,
      distinctLookupKeys: 1349964,
    });
    expect(correction.externalArtifact.directoryRebuilt).toBe(false);
    expect(correction.externalArtifact.postingsRebuilt).toBe(false);
    expect(correction.preservedBoundaries.fullCorpusBuildExecuted).toBe(false);
    expect(correction.preservedBoundaries.attempt4Executed).toBe(false);
    expect(correction.authorizationChain.reviewedBytesEqualFinalMainBytes).toBe(false);
    expect(readFileSync(correctionDocPath, "utf8")).toContain("INDEX_CONTRACT_SHA256_SEMANTIC_ROLE=MACHINE_READABLE_CONTRACT_JSON");
  });
});
