import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

type DeterministicIndexContract = {
  contractId: string;
  status: string;
  ownerMilestone: string;
  authority: {
    sourceSnapshot: Record<string, unknown>;
    adapter: Record<string, unknown>;
  };
  indexSchema: Record<string, unknown>;
  keyContract: Record<string, unknown>;
  postingContract: Record<string, unknown>;
  multiplicityAndCollision: Record<string, unknown>;
  ordering: Record<string, unknown>;
  serialization: Record<string, unknown>;
  buildContract: Record<string, unknown>;
  lookupContract: Record<string, unknown>;
  storageAndManifest: Record<string, unknown>;
  failureSemantics: Record<string, unknown>;
  truthFirewall: Record<string, unknown>;
  antiCircularity: Record<string, unknown>;
  nonAuthorization: Record<string, unknown>;
  stateAfterFreeze: Record<string, unknown>;
  nextAction: string;
};

const contractPath =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/contract.json";
const definitionPath = "docs/open-instrument/english-kaikki-deterministic-index-v0.1.md";
const adapterContractPath =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-source-family-adapter-v0.1/contract.json";
const adapterManifestPath =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-source-family-adapter-v0.1/implementation-hash-manifest.json";
const indexManifestPath =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/hash-manifest.json";
const contract = JSON.parse(readFileSync(contractPath, "utf8")) as DeterministicIndexContract;
const definition = readFileSync(definitionPath, "utf8");
const adapterContract = readFileSync(adapterContractPath, "utf8");
const adapterManifest = readFileSync(adapterManifestPath, "utf8");
const indexManifest = JSON.parse(readFileSync(indexManifestPath, "utf8")) as {
  contractId: string;
  status: string;
  artifacts: readonly { path: string; bytes: number; sha256: string }[];
};

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

describe("English Kaikki deterministic index contract v0.1", () => {
  it("binds the exact verified snapshot and implemented adapter authority", () => {
    expect(contract).toMatchObject({
      contractId: "OPEN_INSTRUMENT_ENGLISH_KAIKKI_DETERMINISTIC_INDEX_V0_1",
      status: "DEFINED_AND_FROZEN_NOT_IMPLEMENTED",
      ownerMilestone: "60b634df-0b79-4aee-8089-ed158890241b",
    });
    expect(contract.authority.sourceSnapshot).toMatchObject({
      sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
      snapshotId: "open-instrument.wiktionary-kaikki-english-lexical-sense.snapshot.2026-10-03.v0_1",
      expectedBytes: 3335546346,
      expectedSha256: "9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195",
      identityRule: "EXACT_BYTES_AND_SHA256_REQUIRED_BEFORE_INDEX_BUILD_OR_RECOVERY",
    });
    expect(contract.authority.adapter).toMatchObject({
      contractId: "OPEN_INSTRUMENT_ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_V0_1",
      contractSha256: "a359b0a8d6fe172b32937aed93690545adfc2403c40419209f358fc46d14ed02",
      implementationCommit: "4e37b56b9194983b836f85269033f916c6ae408d",
      implementationSha256: "2b8a41fd2c5cd8d7a11e8b157690d3e4b4dfd12ed44a1de48c5070347e11c28f",
    });
    expect(sha256(adapterContractPath)).toBe(contract.authority.adapter.contractSha256);
    expect(JSON.stringify(contract)).not.toContain("/Users/");
    expect(JSON.stringify(contract)).not.toContain(".open-instrument/external-sources");
  });

  it("binds the frozen definition artifacts through the hash manifest", () => {
    expect(indexManifest).toMatchObject({
      contractId: "OPEN_INSTRUMENT_ENGLISH_KAIKKI_DETERMINISTIC_INDEX_V0_1",
      status: "DEFINED_AND_FROZEN_NOT_IMPLEMENTED",
    });
    for (const artifact of indexManifest.artifacts) {
      const bytes = readFileSync(artifact.path);
      expect(bytes.byteLength).toBe(artifact.bytes);
      expect(sha256(artifact.path)).toBe(artifact.sha256);
    }
  });

  it("freezes the exact lookup operator and fail-closed exact equality", () => {
    expect(contract.keyContract).toMatchObject({
      sourceFormField: "word",
      operatorId: "OPEN_INSTRUMENT_ENGLISH_LEXICAL_SENSE_JOIN_KEY_V0_1",
      normalization: "NFC -> locale-independent English lowercase using en-US -> NFC",
      lookupEquality: "EXACT_LOOKUP_KEY_STRING_EQUALITY_ONLY",
      trim: false,
      stemming: false,
      lemmatization: false,
      fuzzyMatching: false,
      phoneticMatching: false,
      translationMatching: false,
      morphologicalExpansion: false,
      semanticNormalization: false,
    });
    expect(contract.lookupContract).toMatchObject({
      directoryLookup: "EXACT_LOOKUP_KEY_EQUALITY_ONLY",
      zeroMatch: "LEXICAL_SENSE_SOURCE_NOT_FOUND_VALID_NULL",
      invalidQuery: "INDEX_LOOKUP_INVALID_QUERY_FAIL_CLOSED",
    });
  });

  it("freezes reference postings, recovery, multiplicity, and collision preservation", () => {
    expect(contract.postingContract).toMatchObject({
      postingUnit: "ONE_ADMITTED_PHYSICAL_SOURCE_RECORD",
      corpusDuplication: "NO_FULL_SOURCE_RECORD_COPY_IN_POSTING; RECOVERY_REFERENCE_ONLY",
    });
    expect(contract.postingContract.fieldsInCanonicalOrder).toEqual([
      "lookupKey",
      "sourceRecordId",
      "entryLocator",
      "recordOrdinal",
      "recordByteOffset",
      "recordByteLength",
      "recordSha256",
    ]);
    expect(contract.postingContract.recovery).toMatchObject({
      verifyRecordSha256BeforeAdaptation: true,
      reAdaptWithFrozenAdapter: true,
      recoverAllSensesPosAndGlosses: true,
    });
    expect(contract.multiplicityAndCollision).toMatchObject({
      multiplePhysicalRecordsSameLookupKey: "PRESERVE_ALL",
      sameWordMultiplePos: "PRESERVE_ALL",
      homographs: "PRESERVE_ALL",
      caseNormalizationCollisions: "PRESERVE_ALL",
      multipleSenses: "PRESERVE_ALL_IN_ADAPTER_SOURCE_ORDER",
      multipleGlosses: "PRESERVE_ALL_IN_ADAPTER_SOURCE_ORDER",
      deduplication: "NO",
      ranking: "NO",
      winnerSelection: "NO",
      collisionIsFailure: false,
    });
    expect(contract.ordering).toMatchObject({
      keyOrder: "UTF-8_UNSIGNED_BYTE_LEXICOGRAPHIC_ORDER",
      lookupResultOrder: "POSTING_ORDER_WITHOUT_REORDERING",
      semanticRanking: false,
    });
  });

  it("freezes canonical serialization, external streaming, and atomic publication", () => {
    expect(contract.indexSchema).toMatchObject({
      schemaVersion: "open-instrument.english-kaikki-deterministic-index.v0.1",
      indexId: "open-instrument.wiktionary-kaikki-english-lexical-sense.index.v0_1",
      buildProcedureId: "open-instrument.english-kaikki-deterministic-index-build.v0.1",
      files: ["directory.ndjson", "postings.ndjson", "manifest.json"],
    });
    expect(contract.serialization).toMatchObject({
      format: "CANONICAL_JSON_LINES",
      encoding: "UTF-8",
      bom: false,
      lineEnding: "LF",
      finalLineEnding: true,
      jsonStringEscaping: "OPEN_INSTRUMENT_CANONICAL_JSON_STRING_V0_1",
      jsonStringEncodingRule:
        "EMIT_LITERAL_UTF8_UNICODE_SCALARS_EXCEPT_QUOTE_BACKSLASH_AND_U0000_TO_U001F_CONTROLS",
      controlEscapeRule: "ALL_U0000_TO_U001F_CONTROLS_USE_LOWERCASE_HEX_\\u00xx; NO_SHORT_ESCAPES",
      optionalEscapeRule: "NO_SOLIDUS_ESCAPES_NO_OPTIONAL_NON_ASCII_ESCAPES",
      surrogatePolicy: "UNPAIRED_SURROGATE_CODE_UNITS_REJECTED_FAIL_CLOSED",
      timestamps: "FORBIDDEN_IN_CANONICAL_INDEX_FILES",
      absolutePaths: "FORBIDDEN_IN_CANONICAL_INDEX_FILES",
    });
    expect(contract.indexSchema.artifactIdentity).toMatchObject({
      identityFileSetInOrder: ["directory.ndjson", "postings.ndjson"],
      manifestSelfTreatment:
        "manifest.json BYTE_LENGTH AND SHA256 ARE EXCLUDED FROM ARTIFACT_IDENTITY_PAYLOAD; MANIFEST IS VALIDATED SEPARATELY",
    });
    expect(contract.indexSchema.artifactIdentity.identityPayload).toMatchObject({
      objectFieldOrder: [
        "schemaVersion",
        "indexId",
        "indexContractId",
        "indexContractVersion",
        "indexContractSha256",
        "sourceSnapshot",
        "adapter",
        "buildProcedureId",
        "files",
      ],
      sourceSnapshotFieldOrder: [
        "sourceFamilyId",
        "snapshotId",
        "expectedBytes",
        "expectedSha256",
      ],
      adapterFieldOrder: [
        "contractId",
        "contractSha256",
        "implementationCommit",
        "implementationSha256",
      ],
      fileFieldOrder: ["path", "bytes", "sha256"],
      filesArrayOrder: ["directory.ndjson", "postings.ndjson"],
      manifestSelfLength: "EXCLUDED",
      manifestSelfSha256: "EXCLUDED",
      canonicalJsonStringEncoding: "OPEN_INSTRUMENT_CANONICAL_JSON_STRING_V0_1",
    });
    expect(contract.buildContract.streaming).toMatchObject({
      rawCorpusLoadedIntoMemory: false,
      recordByRecordInput: true,
      boundedWorkingMemoryRequired: true,
      externalSortRunsAllowed: true,
    });
    expect(contract.buildContract.temporaryArtifacts).toMatchObject({
      partialArtifactsAuthoritative: false,
      failureCleanupOrQuarantineRequired: true,
      resume: false,
      restartFromVerifiedSnapshot: true,
    });
    expect(contract.buildContract.atomicPublication).toMatchObject({
      required: true,
      silentOverwrite: false,
      exactExistingArtifactMayBeReused: true,
    });
  });

  it("keeps storage, provenance, failure classes, and truth firewalls explicit", () => {
    expect(contract.storageAndManifest).toMatchObject({
      rawSnapshot: "EXTERNAL_HASH_BOUND_NOT_REPOSITORY_BUNDLED",
      generatedIndex: "EXTERNAL_DERIVED_ARTIFACT_NOT_REPOSITORY_BUNDLED",
      repositoryBundling: false,
      gitLfs: false,
      runtimeFetch: false,
      redistributionAuthorization: false,
      manifestRequired: true,
    });
    expect(contract.failureSemantics.validNull).toEqual([
      "LEXICAL_SENSE_SOURCE_NOT_FOUND",
      "LEXICAL_SENSE_GLOSS_NOT_FOUND",
    ]);
    expect(contract.failureSemantics.collision).toContain("NOT_FAILURE");
    expect(contract.truthFirewall).toMatchObject({
      sourceFactsOnly: true,
      functionalAuthority: false,
      historicalAuthority: false,
      pronunciationAuthority: false,
      voiceAuthority: false,
      rankingAuthority: false,
      winnerAuthority: false,
      providerModelExecution: false,
      targetSpecificLogic: false,
    });
    expect(contract.antiCircularity).toMatchObject({
      genericOverEntireBoundSnapshot: true,
      knownExampleSearch: false,
      targetSpecificFiltering: false,
      wordSpecificShortcuts: false,
    });
  });

  it("is definition/freeze-only and selects the next implementation lane", () => {
    expect(contract.nonAuthorization).toMatchObject({
      sourceImported: false,
      indexBuilderImplemented: false,
      indexBuilt: false,
      indexLookupRuntimeImplemented: false,
      indexWiredToDiscovery: false,
      coverageEvaluated: false,
      runtimeAuthorized: false,
      runtimeChanged: false,
      s4: "NOT_STARTED",
      milestoneComplete: false,
      nextAction: "IMPLEMENT_ENGLISH_KAIKKI_DETERMINISTIC_INDEX_V0_1",
    });
    expect(contract.stateAfterFreeze).toMatchObject({
      sourceAcquired: true,
      sourceSnapshotVerified: true,
      sourceContentBoundedSchemaInspection: true,
      adapterImplemented: true,
      deterministicIndexContractDefined: true,
      deterministicIndexContractFrozen: true,
      indexBuilt: false,
      coverageEvaluated: false,
      runtimeChanged: false,
      s4: "NOT_STARTED",
      milestoneComplete: false,
    });
    expect(contract.nextAction).toBe("IMPLEMENT_ENGLISH_KAIKKI_DETERMINISTIC_INDEX_V0_1");
    expect(definition).toContain("Status: `DEFINED_AND_FROZEN_NOT_IMPLEMENTED`");
    expect(definition).toContain("No exact key returns the existing valid NULL");
    expect(definition).toContain("IMPLEMENT_ENGLISH_KAIKKI_DETERMINISTIC_INDEX_V0_1");
  });

  it("keeps the contract generic and source-only", () => {
    const serialized = JSON.stringify(contract);
    expect(serialized).not.toMatch(/\b(?:STUDY|DI|DA|AT|MAT|ER|STERILE|ZEMËR)\b/);
    expect(serialized).not.toContain("providerOutput");
    expect(serialized).not.toContain("candidateRanking");
    expect(adapterManifest).toContain("IMPLEMENTED_SOURCE_RECORD_BOUNDARY_ONLY");
    expect(adapterManifest).toContain("persistentIndexConstructed");
  });
});
