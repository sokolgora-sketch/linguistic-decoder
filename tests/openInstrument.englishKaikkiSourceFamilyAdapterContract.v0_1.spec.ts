import { readFileSync } from "node:fs";

type FrozenContract = {
  contractId: string;
  status: string;
  ownerMilestone: string;
  sourceIdentity: {
    sourceFamilyId: string;
    snapshotId: string;
    expectedBytes: number;
    expectedSha256: string;
    identityRule: string;
  };
  boundedSchemaInspection: {
    status: string;
    bytesRead: number;
    completeRecordsInspected: number;
    fullSourceParsed: boolean;
    targetWordSearchPerformed: boolean;
    semanticAnalysisPerformed: boolean;
    candidateRetrievalPerformed: boolean;
    coverageEvaluated: boolean;
  };
  sourceSurface: {
    recordAdmittedFields: string[];
    recordExcludedFields: string[];
    unknownFieldPolicy: string;
  };
  identityAndLocator: {
    upstreamRecordId: string;
    recordIdentity: string;
    sourceOrder: string;
  };
  multiplicityAndCollision: {
    multipleRecordsSameWordAndPos: string;
    multipleSenses: string;
    sourceLevelWinnerSelection: string;
  };
  retrievalRepresentation: {
    lookupKey: string;
    exactLookupKeyEquality?: string;
    trim: boolean;
    semanticNormalization: boolean;
    indexBuildAuthorizedByThisArtifact: boolean;
  };
  nullAndFailureSemantics: Record<string, string>;
  genericDiscoverySeam: {
    seam: string;
    candidateVoicePathPolicy: string;
    sourceAttestation: string;
    functionalCorrespondence: string;
    targetMeaning: string;
    historicalRelation: string;
    winnerClaim: string;
    userDecisionPosture: string;
    noSingleWinner: boolean;
  };
  nonAuthorization: {
    productionAdapterImplemented: boolean;
    sourceImported: boolean;
    indexBuilt: boolean;
    runtimeChanged: boolean;
    coverageEvaluated: boolean;
    contentSemanticInspection: boolean;
    s4: string;
    nextAction: string;
  };
};

const contractPath =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-source-family-adapter-v0.1/contract.json";
const contractDocPath = "docs/open-instrument/english-kaikki-source-family-adapter-v0.1.md";
const contract = JSON.parse(readFileSync(contractPath, "utf8")) as FrozenContract;
const contractDoc = readFileSync(contractDocPath, "utf8");

describe("English Kaikki source-family adapter contract v0.1", () => {
  it("binds the exact acquired snapshot without exposing a local path", () => {
    expect(contract.contractId).toBe(
      "OPEN_INSTRUMENT_ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_V0_1",
    );
    expect(contract.status).toBe("DEFINED_AND_FROZEN_NOT_IMPLEMENTED");
    expect(contract.ownerMilestone).toBe(
      "60b634df-0b79-4aee-8089-ed158890241b",
    );
    expect(contract.sourceIdentity).toMatchObject({
      sourceFamilyId:
        "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
      snapshotId:
        "open-instrument.wiktionary-kaikki-english-lexical-sense.snapshot.2026-10-03.v0_1",
      expectedBytes: 3335546346,
      expectedSha256:
        "9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195",
      identityRule: "EXACT_BYTES_AND_SHA256_REQUIRED_BEFORE_PROJECTION",
    });
    expect(JSON.stringify(contract)).not.toContain("/Users/");
    expect(JSON.stringify(contract)).not.toContain(".open-instrument/external-sources");
  });

  it("records bounded schema evidence without turning it into a research run", () => {
    expect(contract.boundedSchemaInspection).toMatchObject({
      status: "COMPLETE_SCHEMA_ONLY",
      bytesRead: 33554432,
      completeRecordsInspected: 1024,
      fullSourceParsed: false,
      targetWordSearchPerformed: false,
      semanticAnalysisPerformed: false,
    });
    expect(contract.boundedSchemaInspection.candidateRetrievalPerformed).toBe(
      false,
    );
    expect(contract.boundedSchemaInspection.coverageEvaluated).toBe(false);
  });

  it("freezes the narrow source surface and source identity boundary", () => {
    expect(contract.sourceSurface.recordAdmittedFields).toEqual([
      "word",
      "lang",
      "lang_code",
      "pos",
      "senses[].id",
      "senses[].glosses",
      "senses[].raw_glosses",
      "senses[].tags",
      "senses[].raw_tags",
    ]);
    expect(contract.sourceSurface.unknownFieldPolicy).toBe(
      "IGNORE_AND_DO_NOT_PROJECT",
    );
    expect(contract.sourceSurface.recordExcludedFields).toEqual(
      expect.arrayContaining([
        "forms",
        "sounds",
        "translations",
        "etymology_text",
        "voice_path",
        "consonantal_configuration",
        "candidate_ranking",
      ]),
    );
    expect(contract.identityAndLocator.upstreamRecordId).toContain(
      "DO_NOT_FABRICATE",
    );
    expect(contract.identityAndLocator.recordIdentity).toContain(
      "PHYSICAL_JSONL_RECORD_ORDINAL",
    );
    expect(contract.identityAndLocator.sourceOrder).toContain("PRESERVE");
  });

  it("preserves multiplicity and freezes exact-only retrieval", () => {
    expect(contract.multiplicityAndCollision).toMatchObject({
      multipleRecordsSameWordAndPos: "PRESERVE_ALL",
      multipleSenses: "PRESERVE_ALL",
      sourceLevelWinnerSelection: "NO",
    });
    expect(contract.retrievalRepresentation.lookupKey).toBe(
      "NFC -> locale-independent English lowercase using en-US -> NFC",
    );
    expect(contract.retrievalRepresentation.trim).toBe(false);
    expect(contract.retrievalRepresentation.semanticNormalization).toBe(false);
    expect(contract.retrievalRepresentation.indexBuildAuthorizedByThisArtifact).toBe(
      false,
    );
    expect(contract.nullAndFailureSemantics.noExactLookupMatch).toContain(
      "VALID_NULL",
    );
    expect(contract.nullAndFailureSemantics.identityMismatch).toContain(
      "NO_RECORDS",
    );
  });

  it("keeps the generic seam source-only and non-promotional", () => {
    expect(contract.genericDiscoverySeam).toMatchObject({
      seam: "GenericFunctionalWitnessSourceAdapterV1",
      candidateVoicePathPolicy: "NULL_UNAUTHORIZED",
      sourceAttestation: "SOURCE_RECORD_ONLY",
      functionalCorrespondence: "NOT_EVALUATED",
      targetMeaning: "NOT_CLAIMED",
      historicalRelation: "NOT_CLAIMED",
      winnerClaim: "NOT_CLAIMED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(contract.genericDiscoverySeam.provenanceRequired).toEqual(
      expect.arrayContaining(["sourceRecordId", "entryLocator", "sourceHashOrArchiveHash"]),
    );
  });

  it("proves this lane is definition-only and leaves S4 untouched", () => {
    expect(contract.nonAuthorization).toEqual({
      productionAdapterImplemented: false,
      sourceImported: false,
      indexBuilt: false,
      runtimeChanged: false,
      coverageEvaluated: false,
      contentSemanticInspection: false,
      s4: "NOT_STARTED",
      nextAction: "IMPLEMENT_ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_V0_1",
    });
    expect(contractDoc).toContain("Status: `DEFINED_AND_FROZEN_NOT_IMPLEMENTED`");
    expect(contractDoc).toContain("no target-word search");
    expect(contractDoc).toContain("No repository-bundled source");
    expect(contractDoc).toContain("IMPLEMENT_ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_V0_1");
  });
});
