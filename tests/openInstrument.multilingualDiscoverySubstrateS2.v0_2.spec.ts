import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  buildMultilingualDiscoverySubstrateS2ValidationV0_2,
  canonicalJsonV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS2.v0_2";

const ARTIFACT_PATH =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s2-authority-truth-validation-v0.1/validation.json";
const MANIFEST_PATH =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s2-authority-truth-validation-v0.1/hash-manifest.json";

function sha256(value: Buffer): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function readJson(relativePath: string): unknown {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), relativePath), "utf8"),
  );
}

describe("multilingual Discovery substrate v0.2 S2 authority/truth validation", () => {
  test("reconstructs the post-S1 authority-safe substrate without S3", () => {
    const validation = buildMultilingualDiscoverySubstrateS2ValidationV0_2();

    expect(validation.status).toBe("S2_AUTHORITY_TRUTH_VALIDATION_PASS");
    expect(validation.authorityIdentities.identitiesMatch).toBe(true);
    expect(validation.postS1Substrate).toMatchObject({
      total: 76,
      languageCounts: { Albanian: 55, Latin: 21 },
      catalogProjectedAlbanian: 52,
      separatelyReviewedAlbanian: 3,
      preS1Latin: 2,
      s1IncrementalLatin: 19,
      uniqueNormalizedForms: 76,
      uniqueQueryKeys: 76,
      duplicateNormalizedForms: [],
      queryKeyCollisions: [],
    });
    expect(validation.s1RowAuthorityValidation).toMatchObject({
      expected: 19,
      validated: 19,
      sourceAttested: 19,
      admissionPass: 19,
      researchOnly: 19,
      provenanceComplete: 19,
      citationComplete: 19,
      authorityDefects: [],
    });
    expect(validation.provenanceIntegrity).toEqual({
      roundtripCount: 19,
      orphanDirectRecords: 0,
      missingCitations: 0,
      extraUnauthorizedCitations: 0,
      provenanceLoss: 0,
      sourceIdentityLoss: 0,
      locatorLoss: 0,
      versionDateLoss: 0,
      hashArchiveIdentityLoss: 0,
    });
    expect(validation.quarantineValidation).toMatchObject({
      rawRows: 98,
      loadedRows: 95,
      quarantinedRows: 3,
      quarantinedRowsInDirectSubstrate: 0,
    });
    expect(validation.heldExcludedValidation).toEqual({
      admissionUnresolvedCount: 6,
      admissionUnresolvedInDirectSubstrate: 0,
      adapterDeferredCount: 2,
      adapterDeferredInDirectSubstrate: 0,
      boundaryExcludedCount: 14,
      boundaryExcludedInDirectSubstrate: 0,
      exclusionPredicatesChanged: false,
    });
    expect(validation.collisionValidation).toEqual({
      baselineVsS1FormDuplicates: [],
      baselineVsS1QueryKeyCollisions: [],
      intraS1FormDuplicates: [],
      intraS1QueryKeyCollisions: [],
      wholeSubstrateFormDuplicates: [],
      wholeSubstrateQueryKeyCollisions: [],
    });
    expect(validation.pronunciationBoundary).toEqual({
      latinPronunciationAuthority: "NONE_UNAUTHORIZED",
      candidateVoicePathPolicy: "NULL_UNAUTHORIZED",
      spokenVoiceFromLatinOrthography: false,
      latinGammaFromUnauthorizedPronunciation: false,
      latinZcFromUnauthorizedPronunciation: false,
      latinMath7PromotedFromLexicalAttestation: false,
    });
    expect(validation.functionalBoundary).toEqual({
      newLatinFunctionalAuthorityCount: 0,
      functionalAuthorityFromGlossOnly: 0,
      functionalAuthorityRuleChanged: false,
    });
    expect(validation.historicalBoundary).toEqual({
      historicalOriginClaimsAdded: 0,
      etymologicalDerivationClaimsAdded: 0,
      languagePriorityClaimsAdded: 0,
      winnerClaimsAdded: 0,
      noSingleWinner: true,
      userDecides: true,
    });
    expect(validation.productionBoundary).toEqual({
      s1RowsProductionAuthorized: 0,
      productionSourceStatusChanged: false,
      productionPronunciationChanged: false,
      productionSemanticAuthorityChanged: false,
      productionApiContractChanged: false,
    });
    expect(validation.truthLayerValidation).toEqual({
      sourceFact: true,
      derivedStructure: true,
      functionalHypothesis: true,
      unknownNull: true,
      layersRemainDistinct: true,
    });
    expect(validation.antiHardcoding).toEqual({
      targetWordRuntimeBranches: "NONE",
      postRetrievalInjection: "NO",
      candidateShopping: "NO",
      winnerSelection: "NO",
      rowIdRuntimeSpecialCases: "NO",
    });
    expect(validation.s3Firewall).toEqual({
      frozenEvaluationProcedureChanged: false,
      frozenEvaluationSampleChanged: false,
      expandedSampleResultsInspected: false,
      s3EvaluationExecuted: false,
      coverageDeltaComputed: false,
    });
  });

  test("binds a deterministic durable artifact and manifest", () => {
    const validation = buildMultilingualDiscoverySubstrateS2ValidationV0_2();
    const artifact = readJson(ARTIFACT_PATH);
    const manifest = readJson(MANIFEST_PATH) as {
      artifacts: readonly { path: string; bytes: number; sha256: string }[];
    };
    const artifactBytes = fs.readFileSync(path.join(process.cwd(), ARTIFACT_PATH));

    expect(sha256(artifactBytes)).toBe(manifest.artifacts[0]?.sha256);
    expect(artifactBytes.byteLength).toBe(manifest.artifacts[0]?.bytes);
    expect(artifact).toEqual(validation);
    expect(canonicalJsonV0_2(artifact)).toBe(artifactBytes.toString("utf8"));
  });
});
