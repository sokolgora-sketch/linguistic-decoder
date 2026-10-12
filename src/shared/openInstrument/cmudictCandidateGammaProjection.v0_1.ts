import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";

import {
  CMUDICT_DATA_BYTES_V0_1,
  CMUDICT_DATA_SHA256_V0_1,
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
} from "./cmudictArpabetPronunciation.v0_1";
import {
  type CmuDictCandidatePronunciationEvidenceV0_1,
  type CmuDictCandidatePronunciationEvidenceVariantV0_1,
} from "./cmudictCandidateSourceAdapter.v0_1";
import {
  CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1,
  CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1,
  CMUDICT_CANDIDATE_VOICE_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
  CMUDICT_CANDIDATE_VOICE_PROJECTION_SCHEMA_V0_1,
  CMUDICT_CANDIDATE_VOICE_PROJECTION_VARIANT_SCHEMA_V0_1,
  type CmuDictCandidateVoiceProjectionReasonCodeV0_1,
  type CmuDictCandidateVoiceProjectionV0_1,
  type CmuDictCandidateVoiceProjectionVariantV0_1,
} from "./cmudictCandidateVoiceProjection.v0_1";
import type {
  ArpabetNucleusV0_1,
  NormalizedArpabetSegmentV0_1,
} from "./pronunciationToVoice.v0_1";

export const CMUDICT_CANDIDATE_GAMMA_PROJECTION_SCHEMA_V0_1 =
  "open-instrument.cmudict-candidate-gamma-projection.v0_1" as const;
export const CMUDICT_CANDIDATE_GAMMA_PROJECTION_VARIANT_SCHEMA_V0_1 =
  "open-instrument.cmudict-candidate-gamma-projection.variant.v0.1" as const;
export const CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1 =
  "open-instrument.cmudict-candidate-gamma-projection.v0_1" as const;
export const CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1 =
  "DERIVED_FROM_RATIFIED_CMUDICT_CANDIDATE_SOURCE_EVIDENCE_VIA_RATIFIED_CANDIDATE_GAMMA_PROJECTION" as const;
export const CMUDICT_CANDIDATE_GAMMA_PROJECTION_CONFIGURATION_AUTHORITY_V0_1 =
  "OPEN_INSTRUMENT_CONSONANTAL_CONFIGURATION_AUTHORITY_V0_1" as const;

export type CmuDictCandidateGammaProjectionReasonCodeV0_1 =
  | CmuDictCandidateVoiceProjectionReasonCodeV0_1
  | "CMUDICT_CANDIDATE_GAMMA_PROJECTION_UNAUTHORIZED"
  | "CMUDICT_CANDIDATE_GAMMA_PROJECTION_INVARIANT_VIOLATION";

export type CmuDictCandidateGammaConsonantRegionV0_1 = Readonly<{
  regionKind:
    | "SOURCE_PREFIX_REGION"
    | "SOURCE_INTER_NUCLEUS_REGION"
    | "SOURCE_SUFFIX_REGION";
  regionIndex: number;
  beforeNucleusIndex: number | null;
  afterNucleusIndex: number | null;
  sourceSegmentIndices: readonly number[];
  sourceUnits: readonly string[];
}>;

export type CmuDictCandidateGammaProjectionVariantV0_1 = Readonly<{
  schemaVersion: typeof CMUDICT_CANDIDATE_GAMMA_PROJECTION_VARIANT_SCHEMA_V0_1;
  sourceEvidence: CmuDictCandidatePronunciationEvidenceVariantV0_1;
  variantId: string;
  variantOrder: number;
  sourceProfileId: string;
  sourceNotation: string;
  sourceRevision: string;
  sourceArtifactBytes: number;
  sourceArtifactSha256: string;
  sourceLineNumber: number;
  rawSourceLine: string;
  normalizedSegments: readonly NormalizedArpabetSegmentV0_1[];
  nuclei: readonly ArpabetNucleusV0_1[];
  canonicalVoicePath: readonly VowelVoice[] | null;
  consonantRegions: readonly CmuDictCandidateGammaConsonantRegionV0_1[];
  status: "defined" | "null";
  reasonCode: CmuDictCandidateGammaProjectionReasonCodeV0_1 | null;
}>;

export type CmuDictCandidateGammaProjectionV0_1 = Readonly<{
  schemaVersion: typeof CMUDICT_CANDIDATE_GAMMA_PROJECTION_SCHEMA_V0_1;
  projectorId: typeof CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1;
  runtimeAuthorityTag: typeof CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1;
  configurationAuthority: typeof CMUDICT_CANDIDATE_GAMMA_PROJECTION_CONFIGURATION_AUTHORITY_V0_1;
  candidateId: string;
  candidateSourceId: string;
  candidateSourceFamilyId: string;
  candidateSourceRecordId: string;
  candidateSourceForm: string;
  candidateJoinKey: string;
  candidateSourceProvenance: Readonly<Record<string, unknown>>;
  sourceProfileId: string | null;
  sourceNotation: string | null;
  sourceRevision: string | null;
  sourceArtifactBytes: number | null;
  sourceArtifactSha256: string | null;
  sourceEvidence: CmuDictCandidatePronunciationEvidenceV0_1;
  mappingId: typeof CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1;
  mappingTable: typeof CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1;
  variants: readonly CmuDictCandidateGammaProjectionVariantV0_1[];
  status: "defined" | "null";
  reasonCode: CmuDictCandidateGammaProjectionReasonCodeV0_1 | null;
}>;

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
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
    Object.freeze(copy);
    return copy as T;
  }

  const copy: RecordValue = {};
  seen.set(value, copy);
  for (const [key, child] of Object.entries(value as RecordValue)) {
    copy[key] = deepCloneAndFreezeV0_1(child, seen);
  }
  Object.freeze(copy);
  return copy as T;
}

function sameJsonV0_1(left: unknown, right: unknown): boolean {
  try {
    return JSON.stringify(left) === JSON.stringify(right);
  } catch {
    return false;
  }
}

function knownReasonV0_1(value: unknown): value is CmuDictCandidateGammaProjectionReasonCodeV0_1 {
  switch (value) {
    case "PRONUNCIATION_NOT_FOUND":
    case "PRONUNCIATION_JOIN_COLLISION":
    case "CMUDICT_SOURCE_LINE_MALFORMED":
    case "CMUDICT_ARPABET_TOKEN_UNSUPPORTED":
    case "CMUDICT_STRESS_DIGIT_MALFORMED":
    case "CMUDICT_SOURCE_ARTIFACT_MISMATCH":
    case "CMUDICT_SOURCE_REVISION_MISMATCH":
    case "CMUDICT_CANDIDATE_NOTATION_UNAUTHORIZED":
    case "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION":
    case "PRONUNCIATION_PROVENANCE_UNRESOLVED":
    case "PRONUNCIATION_VARIANT_AMBIGUOUS":
    case "PRONUNCIATION_PROVENANCE_UNRESOLVED":
    case "CMUDICT_CANDIDATE_VOICE_PROJECTION_UNAUTHORIZED":
    case "VOICE_FAMILY_AUTHORITY_MISSING":
    case "MOVING_NUCLEUS_AUTHORITY_MISSING":
    case "SPOKEN_NUCLEUS_STRUCTURE_UNRESOLVED":
    case "CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_GAP":
    case "CMUDICT_CANDIDATE_VOICE_PROJECTION_INVARIANT_VIOLATION":
    case "CMUDICT_CANDIDATE_GAMMA_PROJECTION_UNAUTHORIZED":
    case "CMUDICT_CANDIDATE_GAMMA_PROJECTION_INVARIANT_VIOLATION":
      return true;
    default:
      return false;
  }
}

function sourceEvidenceVariantV0_1(
  value: unknown,
): value is CmuDictCandidatePronunciationEvidenceVariantV0_1 {
  if (!isRecord(value)) return false;
  const strings = [
    "sourceProfileId",
    "sourceRevision",
    "sourceNotation",
    "sourceArtifactSha256",
    "rawSourceLine",
    "sourceForm",
    "baseSourceForm",
    "variantId",
    "rawPronunciation",
    "authorityStatus",
  ];
  return (
    strings.every((field) => typeof value[field] === "string") &&
    value.authorityStatus === "RATIFIED_SOURCE_EVIDENCE_ONLY" &&
    value.sourceProfileId === CMUDICT_SOURCE_PROFILE_ID_V0_1 &&
    value.sourceRevision === CMUDICT_SOURCE_REVISION_V0_1 &&
    value.sourceNotation === CMUDICT_SOURCE_NOTATION_V0_1 &&
    value.sourceArtifactBytes === CMUDICT_DATA_BYTES_V0_1 &&
    value.sourceArtifactSha256 === CMUDICT_DATA_SHA256_V0_1 &&
    Number.isInteger(value.sourceArtifactBytes) &&
    Number.isInteger(value.sourceLineNumber) &&
    Number.isInteger(value.variantOrder) &&
    Array.isArray(value.orderedRawArpabetTokens) &&
    value.orderedRawArpabetTokens.every((token) => typeof token === "string") &&
    Array.isArray(value.losslessBaseStressViews) &&
    value.losslessBaseStressViews.every(
      (view) =>
        isRecord(view) &&
        typeof view.rawToken === "string" &&
        typeof view.baseToken === "string" &&
        (view.stress === null || typeof view.stress === "string"),
    ) &&
    (value.opaqueAnnotationText === undefined ||
      typeof value.opaqueAnnotationText === "string")
  );
}

function sourceEvidenceV0_1(
  value: unknown,
): value is CmuDictCandidatePronunciationEvidenceV0_1 {
  if (!isRecord(value)) return false;
  const strings = [
    "candidateId",
    "candidateSourceId",
    "candidateSourceFamilyId",
    "candidateSourceRecordId",
    "candidateSourceForm",
    "candidateJoinKey",
  ];
  if (
    !strings.every((field) => typeof value[field] === "string") ||
    !isRecord(value.candidateSourceProvenance) ||
    (value.status !== "defined" && value.status !== "null") ||
    (value.reasonCode !== null && !knownReasonV0_1(value.reasonCode)) ||
    !Array.isArray(value.variants) ||
    !value.variants.every(sourceEvidenceVariantV0_1)
  ) {
    return false;
  }
  if (
    (value.status === "defined" && value.reasonCode !== null) ||
    (value.status === "null" && value.reasonCode === null) ||
    (value.status === "null" && value.variants.length !== 0)
  ) {
    return false;
  }
  return true;
}

function voiceVariantV0_1(
  value: unknown,
): value is CmuDictCandidateVoiceProjectionVariantV0_1 {
  if (!isRecord(value)) return false;
  return (
    value.schemaVersion === CMUDICT_CANDIDATE_VOICE_PROJECTION_VARIANT_SCHEMA_V0_1 &&
    sourceEvidenceVariantV0_1(value.sourceEvidence) &&
    value.mappingId === CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1 &&
    value.mappingTable === CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1 &&
    Array.isArray(value.normalizedSegments) &&
    Array.isArray(value.nuclei) &&
    (value.canonicalVoicePath === null || Array.isArray(value.canonicalVoicePath)) &&
    (value.status === "defined" || value.status === "null") &&
    (value.reasonCode === null || knownReasonV0_1(value.reasonCode)) &&
    ((value.status === "defined" && value.reasonCode === null) ||
      (value.status === "null" && value.reasonCode !== null))
  );
}

function voiceEnvelopeV0_1(
  value: unknown,
): value is CmuDictCandidateVoiceProjectionV0_1 {
  if (!isRecord(value)) return false;
  const strings = [
    "candidateId",
    "candidateSourceId",
    "candidateSourceFamilyId",
    "candidateSourceRecordId",
    "candidateSourceForm",
    "candidateJoinKey",
  ];
  return (
    value.schemaVersion === CMUDICT_CANDIDATE_VOICE_PROJECTION_SCHEMA_V0_1 &&
    strings.every((field) => typeof value[field] === "string") &&
    isRecord(value.candidateSourceProvenance) &&
    sourceEvidenceV0_1(value.sourceEvidence) &&
    (value.sourceEvidenceStatus === "defined" || value.sourceEvidenceStatus === "null") &&
    (value.sourceEvidenceReasonCode === null ||
      knownReasonV0_1(value.sourceEvidenceReasonCode)) &&
    value.authorityTag === CMUDICT_CANDIDATE_VOICE_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1 &&
    value.mappingId === CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1 &&
    value.mappingTable === CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1 &&
    Array.isArray(value.variants) &&
    value.variants.every(voiceVariantV0_1) &&
    (value.status === "defined" || value.status === "null") &&
    (value.reasonCode === null || knownReasonV0_1(value.reasonCode))
  );
}

function emptySourceEvidenceV0_1(): CmuDictCandidatePronunciationEvidenceV0_1 {
  return {
    candidateId: "",
    candidateSourceId: "",
    candidateSourceFamilyId: "",
    candidateSourceRecordId: "",
    candidateSourceForm: "",
    candidateJoinKey: "",
    candidateSourceProvenance: {},
    status: "null",
    reasonCode: "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION",
    variants: [],
  };
}

function sourceReasonToGammaReasonV0_1(
  reasonCode: CmuDictCandidatePronunciationEvidenceV0_1["reasonCode"],
): CmuDictCandidateGammaProjectionReasonCodeV0_1 {
  if (reasonCode === "PRONUNCIATION_VARIANT_AMBIGUOUS") {
    return "CMUDICT_CANDIDATE_VOICE_PROJECTION_INVARIANT_VIOLATION";
  }
  return reasonCode as CmuDictCandidateGammaProjectionReasonCodeV0_1;
}

function nullProjectionV0_1(
  reasonCode: CmuDictCandidateGammaProjectionReasonCodeV0_1 =
    "CMUDICT_CANDIDATE_GAMMA_PROJECTION_INVARIANT_VIOLATION",
): CmuDictCandidateGammaProjectionV0_1 {
  return {
    schemaVersion: CMUDICT_CANDIDATE_GAMMA_PROJECTION_SCHEMA_V0_1,
    projectorId: CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1,
    runtimeAuthorityTag:
      CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
    configurationAuthority:
      CMUDICT_CANDIDATE_GAMMA_PROJECTION_CONFIGURATION_AUTHORITY_V0_1,
    candidateId: "",
    candidateSourceId: "",
    candidateSourceFamilyId: "",
    candidateSourceRecordId: "",
    candidateSourceForm: "",
    candidateJoinKey: "",
    candidateSourceProvenance: {},
    sourceProfileId: null,
    sourceNotation: null,
    sourceRevision: null,
    sourceArtifactBytes: null,
    sourceArtifactSha256: null,
    sourceEvidence: emptySourceEvidenceV0_1(),
    mappingId: CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1,
    mappingTable: CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1,
    variants: [],
    status: "null",
    reasonCode,
  };
}

function sourceEvidenceForOutputV0_1(
  value: CmuDictCandidatePronunciationEvidenceV0_1,
): CmuDictCandidatePronunciationEvidenceV0_1 {
  return deepCloneAndFreezeV0_1(value);
}

function identityFieldsV0_1(
  source: CmuDictCandidatePronunciationEvidenceV0_1,
): Pick<
  CmuDictCandidateGammaProjectionV0_1,
  | "candidateId"
  | "candidateSourceId"
  | "candidateSourceFamilyId"
  | "candidateSourceRecordId"
  | "candidateSourceForm"
  | "candidateJoinKey"
  | "candidateSourceProvenance"
> {
  return {
    candidateId: source.candidateId,
    candidateSourceId: source.candidateSourceId,
    candidateSourceFamilyId: source.candidateSourceFamilyId,
    candidateSourceRecordId: source.candidateSourceRecordId,
    candidateSourceForm: source.candidateSourceForm,
    candidateJoinKey: source.candidateJoinKey,
    candidateSourceProvenance: source.candidateSourceProvenance,
  };
}

function baseProjectionV0_1(
  input: CmuDictCandidateVoiceProjectionV0_1,
  sourceEvidence: CmuDictCandidatePronunciationEvidenceV0_1,
): Omit<CmuDictCandidateGammaProjectionV0_1, "variants" | "status" | "reasonCode"> {
  const first = sourceEvidence.variants[0];
  return {
    schemaVersion: CMUDICT_CANDIDATE_GAMMA_PROJECTION_SCHEMA_V0_1,
    projectorId: CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1,
    runtimeAuthorityTag:
      CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
    configurationAuthority:
      CMUDICT_CANDIDATE_GAMMA_PROJECTION_CONFIGURATION_AUTHORITY_V0_1,
    ...identityFieldsV0_1(sourceEvidence),
    sourceProfileId: first?.sourceProfileId ?? null,
    sourceNotation: first?.sourceNotation ?? null,
    sourceRevision: first?.sourceRevision ?? null,
    sourceArtifactBytes: first?.sourceArtifactBytes ?? null,
    sourceArtifactSha256: first?.sourceArtifactSha256 ?? null,
    sourceEvidence: sourceEvidenceForOutputV0_1(sourceEvidence),
    mappingId: input.mappingId,
    mappingTable: input.mappingTable,
  };
}

function sameSourceIdentityV0_1(
  input: CmuDictCandidateVoiceProjectionV0_1,
  source: CmuDictCandidatePronunciationEvidenceV0_1,
): boolean {
  return (
    input.candidateId === source.candidateId &&
    input.candidateSourceId === source.candidateSourceId &&
    input.candidateSourceFamilyId === source.candidateSourceFamilyId &&
    input.candidateSourceRecordId === source.candidateSourceRecordId &&
    input.candidateSourceForm === source.candidateSourceForm &&
    input.candidateJoinKey === source.candidateJoinKey &&
    sameJsonV0_1(input.candidateSourceProvenance, source.candidateSourceProvenance) &&
    input.sourceEvidenceStatus === source.status &&
    input.sourceEvidenceReasonCode === source.reasonCode
  );
}

function sameRegionSourceVariantV0_1(
  source: CmuDictCandidatePronunciationEvidenceVariantV0_1,
  variant: CmuDictCandidateVoiceProjectionVariantV0_1,
): boolean {
  return (
    sameJsonV0_1(source, variant.sourceEvidence) &&
    source.variantId === variant.sourceEvidence.variantId &&
    source.variantOrder === variant.sourceEvidence.variantOrder
  );
}

function validSegmentShapeV0_1(
  value: unknown,
): value is NormalizedArpabetSegmentV0_1 {
  if (!isRecord(value)) return false;
  return (
    Number.isInteger(value.segmentIndex) &&
    (value.kind === "consonant" ||
      value.kind === "monophthong_nucleus" ||
      value.kind === "moving_nucleus" ||
      value.kind === "stress" ||
      value.kind === "unsupported_vowel") &&
    Array.isArray(value.sourceUnits) &&
    value.sourceUnits.every((unit) => typeof unit === "string") &&
    (value.stress === null || value.stress === "0" || value.stress === "1" || value.stress === "2") &&
    (value.nucleusIndex === null || Number.isInteger(value.nucleusIndex)) &&
    typeof value.sourceProfileId === "string" &&
    (value.baseCategory === null || typeof value.baseCategory === "string") &&
    (value.voiceAnchors === null ||
      (Array.isArray(value.voiceAnchors) &&
        value.voiceAnchors.every((anchor) => typeof anchor === "string")))
  );
}

function validNucleusShapeV0_1(value: unknown): value is ArpabetNucleusV0_1 {
  if (!isRecord(value)) return false;
  return (
    Number.isInteger(value.nucleusIndex) &&
    typeof value.sourceToken === "string" &&
    typeof value.baseCategory === "string" &&
    (value.stress === null || value.stress === "0" || value.stress === "1" || value.stress === "2") &&
    (value.kind === "monophthong_nucleus" || value.kind === "moving_nucleus") &&
    Array.isArray(value.voiceAnchors) &&
    value.voiceAnchors.every((anchor) => typeof anchor === "string") &&
    (value.observationAuthority === null || isRecord(value.observationAuthority)) &&
    (value.canonicalization === null || isRecord(value.canonicalization))
  );
}

function derivedRegionsV0_1(
  variant: CmuDictCandidateVoiceProjectionVariantV0_1,
  source: CmuDictCandidatePronunciationEvidenceVariantV0_1,
): CmuDictCandidateGammaConsonantRegionV0_1[] | null {
  const segments = variant.normalizedSegments;
  const nuclei = variant.nuclei;
  if (
    !segments.every(validSegmentShapeV0_1) ||
    !nuclei.every(validNucleusShapeV0_1) ||
    !segments.every((segment, index) => segment.segmentIndex === index) ||
    !nuclei.every((nucleus, index) => nucleus.nucleusIndex === index)
  ) {
    return null;
  }

  const nucleusSegments = segments.filter(
    (segment) =>
      segment.kind === "monophthong_nucleus" || segment.kind === "moving_nucleus",
  );
  if (
    nuclei.length === 0 ||
    nucleusSegments.length !== nuclei.length ||
    nucleusSegments.some(
      (segment, index) =>
        segment.nucleusIndex !== index ||
        segment.sourceUnits.length !== 1 ||
        segment.sourceUnits[0] !== nuclei[index].sourceToken ||
        segment.sourceProfileId !== source.sourceProfileId,
    )
  ) {
    return null;
  }

  if (
    !sameJsonV0_1(
      segments.flatMap((segment) => segment.sourceUnits),
      source.orderedRawArpabetTokens,
    )
  ) {
    return null;
  }

  for (const [index, nucleus] of nuclei.entries()) {
    if (
      nucleus.kind !== nucleusSegments[index].kind ||
      nucleus.voiceAnchors.length === 0 ||
      (nucleus.kind === "moving_nucleus" && nucleus.voiceAnchors.length !== 2) ||
      (nucleus.kind === "monophthong_nucleus" && nucleus.voiceAnchors.length !== 1)
    ) {
      return null;
    }
  }

  if (
    variant.canonicalVoicePath === null ||
    !sameJsonV0_1(
      variant.canonicalVoicePath,
      nuclei.flatMap((nucleus) => nucleus.voiceAnchors),
    )
  ) {
    return null;
  }

  const consonants = segments.filter((segment) => segment.kind === "consonant");
  if (
    segments.some(
      (segment) =>
        segment.kind === "consonant" &&
        (segment.nucleusIndex !== null ||
          segment.baseCategory !== null ||
          segment.voiceAnchors !== null),
    ) ||
    segments.some(
      (segment) =>
        segment.kind !== "consonant" &&
        segment.kind !== "stress" &&
        segment.kind !== "monophthong_nucleus" &&
        segment.kind !== "moving_nucleus" &&
        segment.nucleusIndex === null,
    )
  ) {
    return null;
  }

  const region = (
    regionKind: CmuDictCandidateGammaConsonantRegionV0_1["regionKind"],
    regionIndex: number,
    beforeNucleusIndex: number | null,
    afterNucleusIndex: number | null,
    selected: readonly NormalizedArpabetSegmentV0_1[],
  ): CmuDictCandidateGammaConsonantRegionV0_1 => ({
    regionKind,
    regionIndex,
    beforeNucleusIndex,
    afterNucleusIndex,
    sourceSegmentIndices: selected.map((segment) => segment.segmentIndex),
    sourceUnits: selected.flatMap((segment) => segment.sourceUnits),
  });

  const nucleusSegmentIndices = nucleusSegments.map((segment) => segment.segmentIndex);
  const regions: CmuDictCandidateGammaConsonantRegionV0_1[] = [];
  regions.push(
    region(
      "SOURCE_PREFIX_REGION",
      0,
      null,
      0,
      consonants.filter((segment) => segment.segmentIndex < nucleusSegmentIndices[0]),
    ),
  );
  for (let index = 0; index < nucleusSegmentIndices.length - 1; index += 1) {
    const start = nucleusSegmentIndices[index];
    const end = nucleusSegmentIndices[index + 1];
    regions.push(
      region(
        "SOURCE_INTER_NUCLEUS_REGION",
        index,
        index,
        index + 1,
        consonants.filter(
          (segment) => segment.segmentIndex > start && segment.segmentIndex < end,
        ),
      ),
    );
  }
  regions.push(
    region(
      "SOURCE_SUFFIX_REGION",
      0,
      nuclei.length - 1,
      null,
      consonants.filter(
        (segment) => segment.segmentIndex > nucleusSegmentIndices[nucleusSegmentIndices.length - 1],
      ),
    ),
  );
  return regions;
}

function validatedInputV0_1(
  input: unknown,
): input is CmuDictCandidateVoiceProjectionV0_1 {
  if (!voiceEnvelopeV0_1(input)) return false;
  const source = input.sourceEvidence;
  if (!sameSourceIdentityV0_1(input, source)) return false;
  if (input.variants.length !== source.variants.length) return false;
  if (source.status === "null") return input.variants.length === 0;

  if (
    input.status === "defined" &&
    (input.reasonCode !== null || input.variants.some((variant) => variant.status !== "defined"))
  ) {
    return false;
  }
  if (
    input.status === "null" &&
    (input.reasonCode === null ||
      input.variants.every((variant) => variant.status === "defined"))
  ) {
    return false;
  }

  for (const [index, variant] of input.variants.entries()) {
    const sourceVariant = source.variants[index];
    if (
      sourceVariant === undefined ||
      !sameRegionSourceVariantV0_1(sourceVariant, variant) ||
      variant.sourceEvidence.variantOrder !== index ||
      variant.sourceEvidence.sourceLineNumber < 1
    ) {
      return false;
    }
    if (variant.status === "null") {
      if (
        variant.normalizedSegments.length !== 0 ||
        variant.nuclei.length !== 0 ||
        variant.canonicalVoicePath !== null
      ) {
        return false;
      }
      continue;
    }
    if (derivedRegionsV0_1(variant, sourceVariant) === null) return false;
  }
  return true;
}

function projectImplV0_1(input: unknown): CmuDictCandidateGammaProjectionV0_1 {
  if (!validatedInputV0_1(input)) return nullProjectionV0_1();
  const source = input.sourceEvidence;
  const base = baseProjectionV0_1(input, source);

  if (source.status === "null") {
    return {
      ...base,
      variants: [],
      status: "null",
      reasonCode: sourceReasonToGammaReasonV0_1(source.reasonCode),
    };
  }

  const variants = input.variants.map((voiceVariant) => {
    const sourceVariant = voiceVariant.sourceEvidence;
    const regions =
      voiceVariant.status === "defined"
        ? derivedRegionsV0_1(voiceVariant, sourceVariant)
        : [];
    if (regions === null) {
      throw new Error("Gamma structural invariant failed after validation");
    }
    return {
      schemaVersion: CMUDICT_CANDIDATE_GAMMA_PROJECTION_VARIANT_SCHEMA_V0_1,
      sourceEvidence: deepCloneAndFreezeV0_1(sourceVariant),
      variantId: sourceVariant.variantId,
      variantOrder: sourceVariant.variantOrder,
      sourceProfileId: sourceVariant.sourceProfileId,
      sourceNotation: sourceVariant.sourceNotation,
      sourceRevision: sourceVariant.sourceRevision,
      sourceArtifactBytes: sourceVariant.sourceArtifactBytes,
      sourceArtifactSha256: sourceVariant.sourceArtifactSha256,
      sourceLineNumber: sourceVariant.sourceLineNumber,
      rawSourceLine: sourceVariant.rawSourceLine,
      normalizedSegments: deepCloneAndFreezeV0_1(voiceVariant.normalizedSegments),
      nuclei: deepCloneAndFreezeV0_1(voiceVariant.nuclei),
      canonicalVoicePath: deepCloneAndFreezeV0_1(voiceVariant.canonicalVoicePath),
      consonantRegions: deepCloneAndFreezeV0_1(regions),
      status: voiceVariant.status,
      reasonCode: voiceVariant.reasonCode,
    } satisfies CmuDictCandidateGammaProjectionVariantV0_1;
  });
  return {
    ...base,
    variants,
    status: input.status,
    reasonCode: input.reasonCode,
  };
}

export function projectCmuDictCandidateGammaProjectionV0_1(
  input: unknown,
): CmuDictCandidateGammaProjectionV0_1 {
  try {
    return deepCloneAndFreezeV0_1(projectImplV0_1(input));
  } catch {
    return deepCloneAndFreezeV0_1(nullProjectionV0_1());
  }
}
