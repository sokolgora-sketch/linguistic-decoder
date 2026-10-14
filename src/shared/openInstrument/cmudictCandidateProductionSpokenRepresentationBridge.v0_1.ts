import {
  CMUDICT_DATA_BYTES_V0_1,
  CMUDICT_DATA_SHA256_V0_1,
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
} from "./cmudictArpabetPronunciation.v0_1";
import {
  projectCmuDictCandidateGammaProjectionV0_1,
  type CmuDictCandidateGammaProjectionV0_1,
} from "./cmudictCandidateGammaProjection.v0_1";
import {
  CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1,
  CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1,
  CMUDICT_CANDIDATE_VOICE_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
  CMUDICT_CANDIDATE_VOICE_PROJECTION_SCHEMA_V0_1,
  projectCmuDictCandidateVoiceProjectionV0_1,
  type CmuDictCandidateVoiceProjectionV0_1,
  type CmuDictCandidateVoiceProjectionVariantV0_1,
} from "./cmudictCandidateVoiceProjection.v0_1";
import {
  projectCmuDictCandidateZcProjectionV0_1,
  type CmuDictCandidateZcProjectionV0_1,
} from "./cmudictCandidateZcProjection.v0_1";
import {
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_ID_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_TABLE_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PARSER_IDENTITY_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PROJECTOR_ID_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_REPRESENTATION_KIND_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SCHEMA_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SOURCE_PATH_V0_1,
  validateCmuDictProductionSpokenBridgePrerequisitesV0_1,
  type CmuDictProductionSpokenBridgePrerequisiteVariantV0_1,
  type CmuDictProductionSpokenBridgePrerequisitesV0_1,
} from "./cmudictProductionSpokenBridgePrerequisites.v0_1";

export const CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_SCHEMA_V0_1 =
  "open-instrument.cmudict-candidate-production-spoken-representation-bridge.v0_1" as const;
export const CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_VARIANT_PAIR_SCHEMA_V0_1 =
  "open-instrument.cmudict-candidate-production-spoken-representation-bridge.variant-pair.v0_1" as const;
export const CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_PROJECTOR_ID_V0_1 =
  "open-instrument.cmudict-candidate-production-spoken-representation-bridge.v0_1" as const;
export const CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_RUNTIME_AUTHORITY_TAG_V0_1 =
  "CMUDICT_CANDIDATE_TO_PRODUCTION_SPOKEN_DOMAIN_COMPATIBILITY_AUTHORITY_V0_1" as const;
export const CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_DOMAIN_V0_1 =
  "cmudict_candidate_source_pronunciation_derived_to_production_spoken.exact_english_cmudict_arpabet_en_us.v0_1" as const;
export const CMUDICT_CANDIDATE_LEXICAL_NORMALIZATION_IDENTITY_V0_1 =
  "normalizeEnglishLexicalJoinKeyV0_1:NFC->en-US-lowercase->NFC:no-trim" as const;
export const CMUDICT_CANDIDATE_SOURCE_PARSER_IDENTITY_V0_1 =
  "parseCmuDictCandidateSourceRecordsV0_1:terminal-annotation-excluded-and-preserved" as const;
export const CMUDICT_REPRESENTATION_BRIDGE_AUTHORITY_BOUNDARY_V0_1 =
  "DOMAIN_COMPATIBILITY_ONLY_NO_RELATION_OR_DISCOVERY_AUTHORITY" as const;

export type CmuDictCandidateProductionSpokenRepresentationBridgeStatusV0_1 =
  | "COMPATIBLE_FOR_SUBSEQUENT_RELATION_EVALUATION"
  | "BLOCKED_BY_MISSING_AUTHORITY"
  | "NULL";

export type CmuDictCandidateProductionSpokenRepresentationBridgeReasonCodeV0_1 =
  | "BRIDGE_SOURCE_AUTHORITY_MISSING"
  | "BRIDGE_PRODUCTION_AUTHORITY_MISSING"
  | "BRIDGE_REPRESENTATION_DOMAIN_MISMATCH"
  | "BRIDGE_NORMALIZATION_MISMATCH"
  | "BRIDGE_ARTIFACT_IDENTITY_UNVERIFIED"
  | "BRIDGE_VARIANT_POLICY_UNRESOLVED"
  | "BRIDGE_MAPPING_AUTHORITY_MISMATCH"
  | "BRIDGE_PROVENANCE_INCOMPLETE";

export type CmuDictCandidateProductionSpokenRepresentationBridgeInputV0_1 =
  Readonly<{
    candidateVoiceProjection: CmuDictCandidateVoiceProjectionV0_1;
    productionPrerequisites: CmuDictProductionSpokenBridgePrerequisitesV0_1;
    candidateGammaProjection?: CmuDictCandidateGammaProjectionV0_1 | null;
    candidateZcProjection?: CmuDictCandidateZcProjectionV0_1 | null;
  }>;

export type CmuDictCandidateProductionSpokenRepresentationBridgeVariantPairV0_1 =
  Readonly<{
    schemaVersion: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_VARIANT_PAIR_SCHEMA_V0_1;
    pairIndex: number;
    candidateVariant: CmuDictCandidateVoiceProjectionVariantV0_1;
    productionVariant: CmuDictProductionSpokenBridgePrerequisiteVariantV0_1;
    status: CmuDictCandidateProductionSpokenRepresentationBridgeStatusV0_1;
    reasonCode: CmuDictCandidateProductionSpokenRepresentationBridgeReasonCodeV0_1 | null;
  }>;

export type CmuDictCandidateProductionSpokenRepresentationBridgeV0_1 =
  Readonly<{
    schemaVersion: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_SCHEMA_V0_1;
    variantPairSchemaVersion: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_VARIANT_PAIR_SCHEMA_V0_1;
    projectorId: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_PROJECTOR_ID_V0_1;
    runtimeAuthorityTag: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_RUNTIME_AUTHORITY_TAG_V0_1;
    representationDomain: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_DOMAIN_V0_1;
    candidateLedger: CmuDictCandidateVoiceProjectionV0_1 | null;
    productionLedger: CmuDictProductionSpokenBridgePrerequisitesV0_1 | null;
    candidateGammaProjection: CmuDictCandidateGammaProjectionV0_1 | null;
    candidateZcProjection: CmuDictCandidateZcProjectionV0_1 | null;
    variantPairs: readonly CmuDictCandidateProductionSpokenRepresentationBridgeVariantPairV0_1[];
    exactArtifactIdentity: Readonly<{
      sourcePath: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SOURCE_PATH_V0_1;
      bytes: typeof CMUDICT_DATA_BYTES_V0_1;
      sha256: typeof CMUDICT_DATA_SHA256_V0_1;
      verifiedOnBothLedgers: boolean;
    }>;
    sourceRevision: typeof CMUDICT_SOURCE_REVISION_V0_1;
    notation: typeof CMUDICT_SOURCE_NOTATION_V0_1;
    profile: typeof CMUDICT_SOURCE_PROFILE_ID_V0_1;
    normalizationIdentity: Readonly<{
      candidate: typeof CMUDICT_CANDIDATE_LEXICAL_NORMALIZATION_IDENTITY_V0_1;
      production: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1;
      candidateJoinKey: string | null;
      productionNormalizedLexicalKey: string | null;
      exactBoundaryValueMatch: boolean;
      frozenArtifactDomainOnly: true;
    }>;
    parserIdentity: Readonly<{
      candidate: typeof CMUDICT_CANDIDATE_SOURCE_PARSER_IDENTITY_V0_1;
      production: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PARSER_IDENTITY_V0_1;
    }>;
    mappingIdentity: typeof CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1;
    mappingTable: typeof CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1;
    variantCardinality: Readonly<{
      candidate: number;
      production: number;
      paired: number;
      oneToOne: boolean;
      recordsLost: 0;
    }>;
    provenanceCompleteness: boolean;
    annotationEligibility: Readonly<{
      annotatedRecordCountInFrozenArtifact: 22;
      currentRecordEligible: boolean;
    }>;
    authorityBoundary: typeof CMUDICT_REPRESENTATION_BRIDGE_AUTHORITY_BOUNDARY_V0_1;
    status: CmuDictCandidateProductionSpokenRepresentationBridgeStatusV0_1;
    reasonCode: CmuDictCandidateProductionSpokenRepresentationBridgeReasonCodeV0_1 | null;
  }>;

type RecordValue = Record<string, unknown>;

function isRecordV0_1(value: unknown): value is RecordValue {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepCloneAndFreezeV0_1<T>(
  value: T,
  seen = new WeakMap<object, unknown>(),
): T {
  if (value === null || typeof value !== "object") return value;
  const existing = seen.get(value);
  if (existing !== undefined) return existing as T;
  if (Array.isArray(value)) {
    const copy: unknown[] = [];
    seen.set(value, copy);
    for (const child of value) copy.push(deepCloneAndFreezeV0_1(child, seen));
    return Object.freeze(copy) as T;
  }
  const copy: RecordValue = {};
  seen.set(value, copy);
  for (const [key, child] of Object.entries(value)) {
    copy[key] = deepCloneAndFreezeV0_1(child, seen);
  }
  return Object.freeze(copy) as T;
}

function sameDataV0_1(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => sameDataV0_1(value, right[index]))
    );
  }
  if (!isRecordV0_1(left) || !isRecordV0_1(right)) return false;
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key, index) =>
        key === rightKeys[index] && sameDataV0_1(left[key], right[key]),
    )
  );
}

function validCandidateVoiceV0_1(
  value: unknown,
): value is CmuDictCandidateVoiceProjectionV0_1 {
  if (!isRecordV0_1(value) || !isRecordV0_1(value.sourceEvidence)) return false;
  return sameDataV0_1(
    projectCmuDictCandidateVoiceProjectionV0_1(value.sourceEvidence),
    value,
  );
}

function validOptionalGammaV0_1(
  value: unknown,
  candidateVoice: CmuDictCandidateVoiceProjectionV0_1,
): value is CmuDictCandidateGammaProjectionV0_1 | null | undefined {
  return (
    value === null ||
    value === undefined ||
    sameDataV0_1(projectCmuDictCandidateGammaProjectionV0_1(candidateVoice), value)
  );
}

function validOptionalZcV0_1(
  value: unknown,
  gamma: CmuDictCandidateGammaProjectionV0_1 | null | undefined,
): value is CmuDictCandidateZcProjectionV0_1 | null | undefined {
  if (value === null || value === undefined) return true;
  return gamma !== null && gamma !== undefined && sameDataV0_1(
    projectCmuDictCandidateZcProjectionV0_1(gamma),
    value,
  );
}

function candidateSourceFailureReasonV0_1(
  candidate: CmuDictCandidateVoiceProjectionV0_1,
): CmuDictCandidateProductionSpokenRepresentationBridgeReasonCodeV0_1 {
  const reason = candidate.sourceEvidenceReasonCode ?? candidate.reasonCode;
  if (reason === "CMUDICT_SOURCE_ARTIFACT_MISMATCH") {
    return "BRIDGE_ARTIFACT_IDENTITY_UNVERIFIED";
  }
  if (
    reason === "CMUDICT_SOURCE_REVISION_MISMATCH" ||
    reason === "CMUDICT_CANDIDATE_NOTATION_UNAUTHORIZED"
  ) {
    return "BRIDGE_REPRESENTATION_DOMAIN_MISMATCH";
  }
  if (reason === "PRONUNCIATION_VARIANT_AMBIGUOUS") {
    return "BRIDGE_VARIANT_POLICY_UNRESOLVED";
  }
  if (
    reason === "CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_GAP" ||
    reason === "VOICE_FAMILY_AUTHORITY_MISSING" ||
    reason === "MOVING_NUCLEUS_AUTHORITY_MISSING"
  ) {
    return "BRIDGE_MAPPING_AUTHORITY_MISMATCH";
  }
  if (
    reason === "PRONUNCIATION_PROVENANCE_UNRESOLVED" ||
    reason === "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION" ||
    reason === "CMUDICT_CANDIDATE_VOICE_PROJECTION_INVARIANT_VIOLATION"
  ) {
    return "BRIDGE_PROVENANCE_INCOMPLETE";
  }
  return "BRIDGE_SOURCE_AUTHORITY_MISSING";
}

function preliminarilyClassifyInvalidInputV0_1(
  input: unknown,
): CmuDictCandidateProductionSpokenRepresentationBridgeReasonCodeV0_1 {
  if (!isRecordV0_1(input)) return "BRIDGE_PROVENANCE_INCOMPLETE";
  if (!isRecordV0_1(input.candidateVoiceProjection)) {
    return "BRIDGE_SOURCE_AUTHORITY_MISSING";
  }
  if (!isRecordV0_1(input.productionPrerequisites)) {
    return "BRIDGE_PRODUCTION_AUTHORITY_MISSING";
  }
  const candidate = input.candidateVoiceProjection;
  const production = input.productionPrerequisites;
  if (
    production.representationKind !==
    CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_REPRESENTATION_KIND_V0_1
  ) {
    return "BRIDGE_REPRESENTATION_DOMAIN_MISMATCH";
  }
  if (
    production.artifactIdentityVerified !== true ||
    production.artifactBytes !== CMUDICT_DATA_BYTES_V0_1 ||
    production.artifactSha256 !== CMUDICT_DATA_SHA256_V0_1
  ) {
    return "BRIDGE_ARTIFACT_IDENTITY_UNVERIFIED";
  }
  if (
    production.sourceRevision !== CMUDICT_SOURCE_REVISION_V0_1 ||
    production.sourceNotation !== CMUDICT_SOURCE_NOTATION_V0_1 ||
    production.sourceProfileId !== CMUDICT_SOURCE_PROFILE_ID_V0_1
  ) {
    return "BRIDGE_REPRESENTATION_DOMAIN_MISMATCH";
  }
  if (
    candidate.authorityTag !==
      CMUDICT_CANDIDATE_VOICE_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1 ||
    candidate.mappingId !== CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1 ||
    candidate.mappingTable !==
      CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1 ||
    production.voiceMappingId !==
      CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_ID_V0_1 ||
    production.voiceMappingTable !==
      CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_TABLE_V0_1
  ) {
    return "BRIDGE_MAPPING_AUTHORITY_MISMATCH";
  }
  if (
    production.normalizationIdentity !==
    CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1
  ) {
    return "BRIDGE_NORMALIZATION_MISMATCH";
  }
  return "BRIDGE_PROVENANCE_INCOMPLETE";
}

function variantsPairExactlyV0_1(
  candidate: CmuDictCandidateVoiceProjectionVariantV0_1,
  production: CmuDictProductionSpokenBridgePrerequisiteVariantV0_1,
): boolean {
  const source = candidate.sourceEvidence;
  const physical = production.physicalEvidence;
  return (
    source.sourceArtifactBytes === production.sourceArtifactBytes &&
    source.sourceArtifactSha256 === production.sourceArtifactSha256 &&
    source.sourceProfileId === production.sourceProfileId &&
    source.sourceRevision === production.sourceRevision &&
    source.sourceNotation === production.sourceNotation &&
    source.sourceLineNumber === physical.sourceLineNumber &&
    source.rawSourceLine === physical.rawSourceLine &&
    source.sourceForm === physical.sourceForm &&
    source.baseSourceForm === physical.baseSourceForm &&
    source.variantId === physical.variantId &&
    source.variantOrder === physical.variantOrder &&
    source.rawPronunciation === physical.rawPhysicalPronunciation &&
    sameDataV0_1(source.orderedRawArpabetTokens, production.orderedProductionSourceUnits) &&
    candidate.mappingId === production.voiceMappingId &&
    candidate.mappingTable === production.voiceMappingTable &&
    sameDataV0_1(candidate.normalizedSegments, production.normalizedSegments) &&
    sameDataV0_1(candidate.nuclei, production.nuclei) &&
    sameDataV0_1(candidate.canonicalVoicePath, production.canonicalVoicePath)
  );
}

function buildResultV0_1(
  status: CmuDictCandidateProductionSpokenRepresentationBridgeStatusV0_1,
  reasonCode: CmuDictCandidateProductionSpokenRepresentationBridgeReasonCodeV0_1 | null,
  candidate: CmuDictCandidateVoiceProjectionV0_1 | null,
  production: CmuDictProductionSpokenBridgePrerequisitesV0_1 | null,
  gamma: CmuDictCandidateGammaProjectionV0_1 | null,
  zc: CmuDictCandidateZcProjectionV0_1 | null,
): CmuDictCandidateProductionSpokenRepresentationBridgeV0_1 {
  const candidateVariants = candidate?.variants ?? [];
  const productionVariants = production?.variants ?? [];
  const oneToOne =
    candidateVariants.length === productionVariants.length &&
    candidateVariants.every((variant, index) =>
      variantsPairExactlyV0_1(variant, productionVariants[index]),
    );
  const pairs = oneToOne
    ? candidateVariants.map((variant, index) => ({
        schemaVersion:
          CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_VARIANT_PAIR_SCHEMA_V0_1,
        pairIndex: index,
        candidateVariant: variant,
        productionVariant: productionVariants[index],
        status,
        reasonCode,
      }))
    : [];
  const candidateJoinKey = candidate?.candidateJoinKey ?? null;
  const productionNormalizedLexicalKey =
    production?.productionNormalizedLexicalKey ?? null;
  const annotationEligible =
    production !== null &&
    production.variants.every(
      (variant) =>
        variant.annotationContamination.eligibility ===
        "ELIGIBLE_FOR_FUTURE_BRIDGE_EVALUATION",
    );
  const artifactVerified =
    candidate !== null &&
    production !== null &&
    candidate.sourceEvidenceStatus === "defined" &&
    candidate.variants.length > 0 &&
    production.artifactIdentityVerified &&
    production.artifactBytes === CMUDICT_DATA_BYTES_V0_1 &&
    production.artifactSha256 === CMUDICT_DATA_SHA256_V0_1 &&
    candidate.variants.every(
      (variant) =>
        variant.sourceEvidence.sourceArtifactBytes === CMUDICT_DATA_BYTES_V0_1 &&
        variant.sourceEvidence.sourceArtifactSha256 === CMUDICT_DATA_SHA256_V0_1,
    );
  return {
    schemaVersion:
      CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_SCHEMA_V0_1,
    variantPairSchemaVersion:
      CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_VARIANT_PAIR_SCHEMA_V0_1,
    projectorId:
      CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_PROJECTOR_ID_V0_1,
    runtimeAuthorityTag:
      CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_RUNTIME_AUTHORITY_TAG_V0_1,
    representationDomain:
      CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_DOMAIN_V0_1,
    candidateLedger: candidate,
    productionLedger: production,
    candidateGammaProjection: gamma,
    candidateZcProjection: zc,
    variantPairs: pairs,
    exactArtifactIdentity: {
      sourcePath:
        CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SOURCE_PATH_V0_1,
      bytes: CMUDICT_DATA_BYTES_V0_1,
      sha256: CMUDICT_DATA_SHA256_V0_1,
      verifiedOnBothLedgers: artifactVerified,
    },
    sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
    notation: CMUDICT_SOURCE_NOTATION_V0_1,
    profile: CMUDICT_SOURCE_PROFILE_ID_V0_1,
    normalizationIdentity: {
      candidate: CMUDICT_CANDIDATE_LEXICAL_NORMALIZATION_IDENTITY_V0_1,
      production:
        CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1,
      candidateJoinKey,
      productionNormalizedLexicalKey,
      exactBoundaryValueMatch:
        candidateJoinKey !== null &&
        candidateJoinKey === productionNormalizedLexicalKey,
      frozenArtifactDomainOnly: true,
    },
    parserIdentity: {
      candidate: CMUDICT_CANDIDATE_SOURCE_PARSER_IDENTITY_V0_1,
      production:
        CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PARSER_IDENTITY_V0_1,
    },
    mappingIdentity: CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1,
    mappingTable: CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1,
    variantCardinality: {
      candidate: candidateVariants.length,
      production: productionVariants.length,
      paired: pairs.length,
      oneToOne,
      recordsLost: 0,
    },
    provenanceCompleteness:
      candidate !== null && production !== null && oneToOne && artifactVerified,
    annotationEligibility: {
      annotatedRecordCountInFrozenArtifact: 22,
      currentRecordEligible: annotationEligible,
    },
    authorityBoundary: CMUDICT_REPRESENTATION_BRIDGE_AUTHORITY_BOUNDARY_V0_1,
    status,
    reasonCode,
  };
}

function projectImplV0_1(
  input: unknown,
): CmuDictCandidateProductionSpokenRepresentationBridgeV0_1 {
  if (!isRecordV0_1(input)) {
    return buildResultV0_1(
      "NULL",
      "BRIDGE_PROVENANCE_INCOMPLETE",
      null,
      null,
      null,
      null,
    );
  }
  const candidateValue = input.candidateVoiceProjection;
  const productionValue = input.productionPrerequisites;
  const candidateLedger = validCandidateVoiceV0_1(candidateValue)
    ? candidateValue
    : null;
  const productionLedger = validateCmuDictProductionSpokenBridgePrerequisitesV0_1(
    productionValue,
  )
    ? productionValue
    : null;
  if (candidateLedger === null || productionLedger === null) {
    return buildResultV0_1(
      "NULL",
      preliminarilyClassifyInvalidInputV0_1(input),
      candidateLedger,
      productionLedger,
      null,
      null,
    );
  }
  const gammaValue = input.candidateGammaProjection;
  const zcValue = input.candidateZcProjection;
  if (
    !validOptionalGammaV0_1(gammaValue, candidateLedger) ||
    !validOptionalZcV0_1(zcValue, gammaValue)
  ) {
    return buildResultV0_1(
      "NULL",
      "BRIDGE_PROVENANCE_INCOMPLETE",
      candidateLedger,
      productionLedger,
      null,
      null,
    );
  }
  const gamma = gammaValue ?? null;
  const zc = zcValue ?? null;
  if (candidateLedger.sourceEvidenceStatus === "null") {
    return buildResultV0_1(
      "NULL",
      candidateSourceFailureReasonV0_1(candidateLedger),
      candidateLedger,
      productionLedger,
      gamma,
      zc,
    );
  }
  if (
    productionLedger.artifactIdentityVerified !== true ||
    productionLedger.artifactBytes !== CMUDICT_DATA_BYTES_V0_1 ||
    productionLedger.artifactSha256 !== CMUDICT_DATA_SHA256_V0_1
  ) {
    return buildResultV0_1(
      "BLOCKED_BY_MISSING_AUTHORITY",
      "BRIDGE_ARTIFACT_IDENTITY_UNVERIFIED",
      candidateLedger,
      productionLedger,
      gamma,
      zc,
    );
  }
  if (
    productionLedger.sourceRevision !== CMUDICT_SOURCE_REVISION_V0_1 ||
    productionLedger.sourceNotation !== CMUDICT_SOURCE_NOTATION_V0_1 ||
    productionLedger.sourceProfileId !== CMUDICT_SOURCE_PROFILE_ID_V0_1 ||
    productionLedger.representationKind !==
      CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_REPRESENTATION_KIND_V0_1
  ) {
    return buildResultV0_1(
      "BLOCKED_BY_MISSING_AUTHORITY",
      "BRIDGE_REPRESENTATION_DOMAIN_MISMATCH",
      candidateLedger,
      productionLedger,
      gamma,
      zc,
    );
  }
  if (
    candidateLedger.mappingId !== productionLedger.voiceMappingId ||
    candidateLedger.mappingTable !== productionLedger.voiceMappingTable
  ) {
    return buildResultV0_1(
      "BLOCKED_BY_MISSING_AUTHORITY",
      "BRIDGE_MAPPING_AUTHORITY_MISMATCH",
      candidateLedger,
      productionLedger,
      gamma,
      zc,
    );
  }
  if (
    productionLedger.variants.some(
      (variant) => variant.annotationContamination.detected,
    )
  ) {
    return buildResultV0_1(
      "BLOCKED_BY_MISSING_AUTHORITY",
      "BRIDGE_REPRESENTATION_DOMAIN_MISMATCH",
      candidateLedger,
      productionLedger,
      gamma,
      zc,
    );
  }
  if (
    candidateLedger.status === "null" ||
    productionLedger.reasonCode === "PRONUNCIATION_VARIANT_AMBIGUOUS"
  ) {
    const reason =
      candidateLedger.sourceEvidenceReasonCode ===
        "PRONUNCIATION_VARIANT_AMBIGUOUS" ||
      productionLedger.reasonCode === "PRONUNCIATION_VARIANT_AMBIGUOUS"
        ? "BRIDGE_VARIANT_POLICY_UNRESOLVED"
        : candidateSourceFailureReasonV0_1(candidateLedger);
    return buildResultV0_1(
      "BLOCKED_BY_MISSING_AUTHORITY",
      reason,
      candidateLedger,
      productionLedger,
      gamma,
      zc,
    );
  }
  if (productionLedger.status === "null") {
    return buildResultV0_1(
      "BLOCKED_BY_MISSING_AUTHORITY",
      "BRIDGE_PRODUCTION_AUTHORITY_MISSING",
      candidateLedger,
      productionLedger,
      gamma,
      zc,
    );
  }
  if (
    candidateLedger.candidateJoinKey !==
    productionLedger.productionNormalizedLexicalKey
  ) {
    return buildResultV0_1(
      "BLOCKED_BY_MISSING_AUTHORITY",
      "BRIDGE_NORMALIZATION_MISMATCH",
      candidateLedger,
      productionLedger,
      gamma,
      zc,
    );
  }
  const oneToOne =
    candidateLedger.variants.length === productionLedger.variants.length &&
    candidateLedger.variants.every((variant, index) =>
      variantsPairExactlyV0_1(variant, productionLedger.variants[index]),
    );
  if (!oneToOne) {
    return buildResultV0_1(
      "BLOCKED_BY_MISSING_AUTHORITY",
      "BRIDGE_VARIANT_POLICY_UNRESOLVED",
      candidateLedger,
      productionLedger,
      gamma,
      zc,
    );
  }
  return buildResultV0_1(
    "COMPATIBLE_FOR_SUBSEQUENT_RELATION_EVALUATION",
    null,
    candidateLedger,
    productionLedger,
    gamma,
    zc,
  );
}

export function projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(
  input: unknown,
): CmuDictCandidateProductionSpokenRepresentationBridgeV0_1 {
  try {
    return deepCloneAndFreezeV0_1(projectImplV0_1(input));
  } catch {
    return deepCloneAndFreezeV0_1(
      buildResultV0_1(
        "NULL",
        "BRIDGE_PROVENANCE_INCOMPLETE",
        null,
        null,
        null,
        null,
      ),
    );
  }
}
