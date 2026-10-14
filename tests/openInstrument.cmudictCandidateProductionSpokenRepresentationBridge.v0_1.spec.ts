import {
  CMUDICT_DATA_BYTES_V0_1,
  CMUDICT_DATA_SHA256_V0_1,
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
} from "@/shared/openInstrument/cmudictArpabetPronunciation.v0_1";
import {
  CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_PROJECTOR_ID_V0_1,
  CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_RUNTIME_AUTHORITY_TAG_V0_1,
  CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_SCHEMA_V0_1,
  CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_VARIANT_PAIR_SCHEMA_V0_1,
  projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1,
  type CmuDictCandidateProductionSpokenRepresentationBridgeInputV0_1,
} from "@/shared/openInstrument/cmudictCandidateProductionSpokenRepresentationBridge.v0_1";
import {
  adaptCmuDictCandidateSourceEvidenceV0_1,
  type CmuDictCandidateAdapterInputV0_1,
} from "@/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1";
import { projectCmuDictCandidateGammaProjectionV0_1 } from "@/shared/openInstrument/cmudictCandidateGammaProjection.v0_1";
import { projectCmuDictCandidateVoiceProjectionV0_1 } from "@/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1";
import { projectCmuDictCandidateZcProjectionV0_1 } from "@/shared/openInstrument/cmudictCandidateZcProjection.v0_1";
import {
  auditCmuDictNormalizationDomainV0_1,
  buildCmuDictProductionSpokenBridgePrerequisitesV0_1,
} from "@/shared/openInstrument/cmudictProductionSpokenBridgePrerequisites.v0_1";
import { normalizeEnglishLexicalJoinKeyV0_1 } from "@/shared/openInstrument/englishLexicalSenseSourceContract.v0_1";

function candidate(sourceForm: string): CmuDictCandidateAdapterInputV0_1 {
  return {
    candidateId: `candidate.${sourceForm}.v0_1`,
    sourceId: `english-kaikki-record.${sourceForm}.v0_1`,
    sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    sourceRecordId: `snapshot-record.${sourceForm}.v0_1`,
    sourceForm,
    normalizedForm: normalizeEnglishLexicalJoinKeyV0_1(sourceForm),
    language: "English",
    senseId: `sense.${sourceForm}.v0_1`,
    gloss: "fixture gloss; not Bridge authority",
    sourceProvenance: {
      entryLocator: `fixture://english/${sourceForm}`,
      sourceRecordId: `snapshot-record.${sourceForm}.v0_1`,
      sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    },
  };
}

function input(
  candidateForm = "stone",
  productionForm = candidateForm,
  includeOptionalStructure = true,
): CmuDictCandidateProductionSpokenRepresentationBridgeInputV0_1 {
  const source = adaptCmuDictCandidateSourceEvidenceV0_1(candidate(candidateForm));
  const voice = projectCmuDictCandidateVoiceProjectionV0_1(source);
  const gamma = projectCmuDictCandidateGammaProjectionV0_1(voice);
  return {
    candidateVoiceProjection: voice,
    productionPrerequisites:
      buildCmuDictProductionSpokenBridgePrerequisitesV0_1(productionForm),
    candidateGammaProjection: includeOptionalStructure ? gamma : null,
    candidateZcProjection: includeOptionalStructure
      ? projectCmuDictCandidateZcProjectionV0_1(gamma)
      : null,
  };
}

function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function keysDeep(value: unknown, keys: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const child of value) keysDeep(child, keys);
  } else if (value !== null && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      keys.push(key);
      keysDeep(child, keys);
    }
  }
  return keys;
}

describe("CMUdict candidate to production_spoken Representation Bridge v0.1", () => {
  it("emits the exact schema, projector, authority tag, and compatible status", () => {
    const result =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(input());
    expect(result).toMatchObject({
      schemaVersion:
        CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_SCHEMA_V0_1,
      variantPairSchemaVersion:
        CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_VARIANT_PAIR_SCHEMA_V0_1,
      projectorId:
        CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_PROJECTOR_ID_V0_1,
      runtimeAuthorityTag:
        CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_RUNTIME_AUTHORITY_TAG_V0_1,
      status: "COMPATIBLE_FOR_SUBSEQUENT_RELATION_EVALUATION",
      reasonCode: null,
    });
  });

  it("preserves exact frozen identity and both complete ledgers", () => {
    const bridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(input());
    expect(bridge.exactArtifactIdentity).toEqual({
      sourcePath: "src/data/openInstrument/pronunciation/cmudict.dict",
      bytes: CMUDICT_DATA_BYTES_V0_1,
      sha256: CMUDICT_DATA_SHA256_V0_1,
      verifiedOnBothLedgers: true,
    });
    expect(bridge).toMatchObject({
      sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
      notation: CMUDICT_SOURCE_NOTATION_V0_1,
      profile: CMUDICT_SOURCE_PROFILE_ID_V0_1,
      provenanceCompleteness: true,
    });
    expect(bridge.candidateLedger).toEqual(input().candidateVoiceProjection);
    expect(bridge.productionLedger).toEqual(input().productionPrerequisites);
  });

  it("keeps the frozen artifact audit boundary exact", () => {
    expect(auditCmuDictNormalizationDomainV0_1()).toEqual({
      totalPhysicalSourceRecords: 135166,
      totalDistinctSourceForms: 135166,
      normalizationEqualRecordCount: 135166,
      normalizationMismatchRecordCount: 0,
      normalizationMismatchDistinctFormCount: 0,
      normalizationMismatchForms: [],
      sharedNormalizationArtifactDomainVerified: true,
    });
  });

  it("preserves moving-nucleus identity without inventing a boundary", () => {
    const bridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(input());
    expect(bridge.variantPairs[0].candidateVariant.nuclei).toHaveLength(1);
    expect(bridge.variantPairs[0].candidateVariant.canonicalVoicePath).toEqual([
      "O",
      "U",
    ]);
    expect(bridge.variantPairs[0].productionVariant.nuclei).toHaveLength(1);
  });

  it("preserves duplicate physical variants, order, and separate pairs", () => {
    const bridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(
        input("mormonism"),
      );
    expect(bridge.status).toBe(
      "COMPATIBLE_FOR_SUBSEQUENT_RELATION_EVALUATION",
    );
    expect(bridge.variantPairs).toHaveLength(2);
    expect(bridge.variantPairs.map((pair) => pair.pairIndex)).toEqual([0, 1]);
    expect(
      bridge.variantPairs.map(
        (pair) => pair.candidateVariant.sourceEvidence.sourceLineNumber,
      ),
    ).toEqual(
      bridge.variantPairs.map(
        (pair) => pair.productionVariant.physicalEvidence.sourceLineNumber,
      ),
    );
    expect(bridge.variantCardinality).toEqual({
      candidate: 2,
      production: 2,
      paired: 2,
      oneToOne: true,
      recordsLost: 0,
    });
  });

  it("preserves candidate source Null and exact upstream evidence", () => {
    const bridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(
        input("word-not-in-cmudict-v0-1", "stone", false),
      );
    expect(bridge.status).toBe("NULL");
    expect(bridge.reasonCode).toBe("BRIDGE_SOURCE_AUTHORITY_MISSING");
    expect(bridge.candidateLedger?.sourceEvidenceReasonCode).toBe(
      "PRONUNCIATION_NOT_FOUND",
    );
    expect(bridge.exactArtifactIdentity.verifiedOnBothLedgers).toBe(false);
  });

  it("preserves production Null without converting it to compatibility", () => {
    const bridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(
        input("stone", "word-not-in-cmudict-v0-1", false),
      );
    expect(bridge.status).toBe("BLOCKED_BY_MISSING_AUTHORITY");
    expect(bridge.reasonCode).toBe("BRIDGE_PRODUCTION_AUTHORITY_MISSING");
    expect(bridge.productionLedger?.reasonCode).toBe("PRONUNCIATION_NOT_FOUND");
  });

  it("fails closed for a lexical normalization mismatch without changing either normalizer", () => {
    const bridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(
        input("stone", "tone", false),
      );
    expect(bridge.status).toBe("BLOCKED_BY_MISSING_AUTHORITY");
    expect(bridge.reasonCode).toBe("BRIDGE_NORMALIZATION_MISMATCH");
    expect(bridge.normalizationIdentity).toMatchObject({
      candidateJoinKey: "stone",
      productionNormalizedLexicalKey: "tone",
      exactBoundaryValueMatch: false,
      frozenArtifactDomainOnly: true,
    });
  });

  it("keeps all annotated evidence and marks it Bridge-ineligible", () => {
    const bridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(
        input("aalborg", "aalborg", false),
      );
    expect(bridge.status).toBe("BLOCKED_BY_MISSING_AUTHORITY");
    expect(bridge.reasonCode).toBe("BRIDGE_REPRESENTATION_DOMAIN_MISMATCH");
    expect(bridge.annotationEligibility).toEqual({
      annotatedRecordCountInFrozenArtifact: 22,
      currentRecordEligible: false,
    });
    expect(
      bridge.productionLedger?.variants[0].physicalEvidence.rawSourceLine,
    ).toBe("aalborg AO1 L B AO0 R G # place, danish");
  });

  it("preserves ambiguous variants and selects no winner", () => {
    const bridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(
        input("read", "read", false),
      );
    expect(bridge.status).toBe("BLOCKED_BY_MISSING_AUTHORITY");
    expect(bridge.reasonCode).toBe("BRIDGE_VARIANT_POLICY_UNRESOLVED");
    expect(bridge.candidateLedger?.variants).toHaveLength(2);
    expect(bridge.productionLedger?.variants).toHaveLength(2);
    expect(keysDeep(bridge)).not.toContain("winner");
  });

  it.each([
    ["representation domain", "representationKind", "wrong", "BRIDGE_REPRESENTATION_DOMAIN_MISMATCH"],
    ["artifact bytes", "artifactBytes", 1, "BRIDGE_ARTIFACT_IDENTITY_UNVERIFIED"],
    ["artifact hash", "artifactSha256", "wrong", "BRIDGE_ARTIFACT_IDENTITY_UNVERIFIED"],
    ["revision", "sourceRevision", "wrong", "BRIDGE_REPRESENTATION_DOMAIN_MISMATCH"],
    ["notation", "sourceNotation", "wrong", "BRIDGE_REPRESENTATION_DOMAIN_MISMATCH"],
    ["profile", "sourceProfileId", "wrong", "BRIDGE_REPRESENTATION_DOMAIN_MISMATCH"],
    ["mapping", "voiceMappingId", "wrong", "BRIDGE_MAPPING_AUTHORITY_MISMATCH"],
    ["normalization identity", "normalizationIdentity", "wrong", "BRIDGE_NORMALIZATION_MISMATCH"],
  ])("fails closed for tampered %s", (_label, key, value, expectedReason) => {
    const tampered = copy(input("stone", "stone", false)) as unknown as {
      productionPrerequisites: Record<string, unknown>;
    };
    tampered.productionPrerequisites[key as string] = value;
    const bridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(tampered);
    expect(bridge.status).toBe("NULL");
    expect(bridge.reasonCode).toBe(expectedReason);
  });

  it("fails closed for incomplete candidate provenance", () => {
    const tampered = copy(input("stone", "stone", false)) as unknown as {
      candidateVoiceProjection: {
        sourceEvidence: { variants: Array<Record<string, unknown>> };
      };
    };
    delete tampered.candidateVoiceProjection.sourceEvidence.variants[0].rawSourceLine;
    const bridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(tampered);
    expect(bridge.status).toBe("NULL");
    expect(bridge.reasonCode).toBe("BRIDGE_PROVENANCE_INCOMPLETE");
  });

  it("retains the independently valid ledger when the peer ledger fails validation", () => {
    const candidateInvalid = copy(input("stone", "stone", false)) as unknown as {
      candidateVoiceProjection: {
        sourceEvidence: { variants: Array<Record<string, unknown>> };
      };
    };
    delete candidateInvalid.candidateVoiceProjection.sourceEvidence.variants[0].rawSourceLine;
    const candidateInvalidBridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(
        candidateInvalid,
      );
    expect(candidateInvalidBridge.status).toBe("NULL");
    expect(candidateInvalidBridge.candidateLedger).toBeNull();
    expect(candidateInvalidBridge.productionLedger).not.toBeNull();

    const productionInvalid = copy(input("stone", "stone", false)) as unknown as {
      productionPrerequisites: Record<string, unknown>;
    };
    delete productionInvalid.productionPrerequisites.artifactSha256;
    const productionInvalidBridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(
        productionInvalid,
      );
    expect(productionInvalidBridge.status).toBe("NULL");
    expect(productionInvalidBridge.candidateLedger).not.toBeNull();
    expect(productionInvalidBridge.productionLedger).toBeNull();
  });

  it("fails closed for malformed/deserialized input", () => {
    expect(
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(null),
    ).toMatchObject({ status: "NULL", reasonCode: "BRIDGE_PROVENANCE_INCOMPLETE" });
    expect(
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1({
        productionPrerequisites: input().productionPrerequisites,
      }),
    ).toMatchObject({ status: "NULL", reasonCode: "BRIDGE_SOURCE_AUTHORITY_MISSING" });
    expect(
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1({
        candidateVoiceProjection: input().candidateVoiceProjection,
      }),
    ).toMatchObject({ status: "NULL", reasonCode: "BRIDGE_PRODUCTION_AUTHORITY_MISSING" });
  });

  it("retains optional Gamma and ZC without making either a Bridge gate", () => {
    const withStructure =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(input());
    const withoutStructure =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(
        input("stone", "stone", false),
      );
    expect(withStructure.candidateGammaProjection).not.toBeNull();
    expect(withStructure.candidateZcProjection).not.toBeNull();
    expect(withoutStructure.candidateGammaProjection).toBeNull();
    expect(withoutStructure.candidateZcProjection).toBeNull();
    expect(withoutStructure.status).toBe(
      "COMPATIBLE_FOR_SUBSEQUENT_RELATION_EVALUATION",
    );
  });

  it("emits no winner, rank, SAME_REPRESENTATION, semantic, functional, historical, or cross-language authority", () => {
    const bridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(input());
    const keys = keysDeep(bridge);
    for (const forbidden of [
      "winner",
      "rank",
      "sameRepresentation",
      "semanticRelation",
      "functionalRelation",
      "historicalRelation",
      "crossLanguageRelation",
      "matchClassification",
      "voiceRelationship",
      "authorizedOperationIds",
      "expansionOrCompositionChain",
      "protoRoots",
    ]) {
      expect(keys).not.toContain(forbidden);
    }
    expect(JSON.stringify(bridge)).not.toContain("SAME_REPRESENTATION");
  });

  it("is deterministic and deeply frozen", () => {
    const first =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(input());
    const second =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(input());
    expect(second).toEqual(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.variantPairs)).toBe(true);
    expect(Object.isFrozen(first.variantPairs[0])).toBe(true);
    expect(Object.isFrozen(first.candidateLedger)).toBe(true);
    expect(Object.isFrozen(first.productionLedger)).toBe(true);
  });
});
