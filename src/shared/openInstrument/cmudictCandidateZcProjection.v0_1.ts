import {
  CMUDICT_DATA_BYTES_V0_1,
  CMUDICT_DATA_SHA256_V0_1,
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
} from "./cmudictArpabetPronunciation.v0_1";
import type {
  CmuDictCandidatePronunciationEvidenceV0_1,
  CmuDictCandidatePronunciationEvidenceVariantV0_1,
} from "./cmudictCandidateSourceAdapter.v0_1";
import {
  CMUDICT_CANDIDATE_GAMMA_PROJECTION_CONFIGURATION_AUTHORITY_V0_1,
  CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1,
  CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
  CMUDICT_CANDIDATE_GAMMA_PROJECTION_SCHEMA_V0_1,
  CMUDICT_CANDIDATE_GAMMA_PROJECTION_VARIANT_SCHEMA_V0_1,
  type CmuDictCandidateGammaConsonantRegionV0_1,
  type CmuDictCandidateGammaProjectionReasonCodeV0_1,
  type CmuDictCandidateGammaProjectionV0_1,
  type CmuDictCandidateGammaProjectionVariantV0_1,
} from "./cmudictCandidateGammaProjection.v0_1";
import { isVowelVoice, type VowelVoice } from "../vowels/vowelVoices.v0.1";
import {
  CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1,
  CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1,
} from "./cmudictCandidateVoiceProjection.v0_1";
import {
  PRONUNCIATION_TO_VOICE_PROFILE_V0_1,
  type ArpabetNucleusV0_1,
  type NormalizedArpabetSegmentV0_1,
} from "./pronunciationToVoice.v0_1";
import {
  ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_SCHEMA_V0_1,
  type ZeroConsonantalStructuralCompositionV0_1,
  type ZeroConsonantalStructuralRecurrenceV0_1,
} from "./zeroConsonantalStructuralComposition.v0_1";

export const CMUDICT_CANDIDATE_ZC_PROJECTION_SCHEMA_V0_1 =
  "open-instrument.cmudict-candidate-zc-projection.v0_1" as const;
export const CMUDICT_CANDIDATE_ZC_PROJECTION_VARIANT_SCHEMA_V0_1 =
  "open-instrument.cmudict-candidate-zc-projection.variant.v0.1" as const;
export const CMUDICT_CANDIDATE_ZC_PROJECTION_PROJECTOR_ID_V0_1 =
  "open-instrument.cmudict-candidate-zc-projection.v0_1" as const;

export type CmuDictCandidateZcProjectionReasonCodeV0_1 =
  CmuDictCandidateGammaProjectionReasonCodeV0_1;

export type CmuDictCandidateZcProjectionVariantV0_1 = Readonly<{
  schemaVersion: typeof CMUDICT_CANDIDATE_ZC_PROJECTION_VARIANT_SCHEMA_V0_1;
  projectorId: typeof CMUDICT_CANDIDATE_ZC_PROJECTION_PROJECTOR_ID_V0_1;
  gammaProjectorId: typeof CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1;
  gammaVariantSchemaVersion: typeof CMUDICT_CANDIDATE_GAMMA_PROJECTION_VARIANT_SCHEMA_V0_1;
  gammaRuntimeAuthorityTag: typeof CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1;
  candidateId: string;
  candidateSourceId: string;
  candidateSourceFamilyId: string;
  candidateSourceRecordId: string;
  candidateJoinKey: string;
  variantId: string;
  variantOrder: number;
  sourceProfileId: typeof CMUDICT_SOURCE_PROFILE_ID_V0_1;
  sourceNotation: typeof CMUDICT_SOURCE_NOTATION_V0_1;
  sourceRevision: typeof CMUDICT_SOURCE_REVISION_V0_1;
  sourceArtifactBytes: typeof CMUDICT_DATA_BYTES_V0_1;
  sourceArtifactSha256: typeof CMUDICT_DATA_SHA256_V0_1;
  sourceLineNumber: number;
  sourceEvidence: CmuDictCandidatePronunciationEvidenceVariantV0_1;
  zeroConsonantalStructuralComposition: ZeroConsonantalStructuralCompositionV0_1;
}>;

export type CmuDictCandidateZcProjectionV0_1 = Readonly<{
  schemaVersion: typeof CMUDICT_CANDIDATE_ZC_PROJECTION_SCHEMA_V0_1;
  zcSchemaVersion: typeof ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_SCHEMA_V0_1;
  projectorId: typeof CMUDICT_CANDIDATE_ZC_PROJECTION_PROJECTOR_ID_V0_1;
  gammaSchemaVersion: typeof CMUDICT_CANDIDATE_GAMMA_PROJECTION_SCHEMA_V0_1;
  gammaProjectorId: typeof CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1;
  gammaRuntimeAuthorityTag: typeof CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1;
  configurationAuthority: typeof CMUDICT_CANDIDATE_GAMMA_PROJECTION_CONFIGURATION_AUTHORITY_V0_1;
  candidateId: string;
  candidateSourceId: string;
  candidateSourceFamilyId: string;
  candidateSourceRecordId: string;
  candidateSourceForm: string;
  candidateJoinKey: string;
  candidateSourceProvenance: Readonly<Record<string, unknown>>;
  sourceProfileId: typeof CMUDICT_SOURCE_PROFILE_ID_V0_1 | null;
  sourceNotation: typeof CMUDICT_SOURCE_NOTATION_V0_1 | null;
  sourceRevision: typeof CMUDICT_SOURCE_REVISION_V0_1 | null;
  sourceArtifactBytes: typeof CMUDICT_DATA_BYTES_V0_1 | null;
  sourceArtifactSha256: typeof CMUDICT_DATA_SHA256_V0_1 | null;
  sourceEvidence: CmuDictCandidatePronunciationEvidenceV0_1;
  variants: readonly CmuDictCandidateZcProjectionVariantV0_1[];
  status: "defined" | "null";
  reasonCode: CmuDictCandidateZcProjectionReasonCodeV0_1 | null;
}>;

type RecordValue = Record<string, unknown>;

const AUTHORIZED_CMU_CONSONANT_SOURCE_UNITS_V0_1 = new Set([
  "B",
  "CH",
  "D",
  "DH",
  "F",
  "G",
  "HH",
  "JH",
  "K",
  "L",
  "M",
  "N",
  "NG",
  "P",
  "R",
  "S",
  "SH",
  "T",
  "TH",
  "V",
  "W",
  "Y",
  "Z",
  "ZH",
]);

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

function validStressV0_1(value: unknown): value is "0" | "1" | "2" | null {
  return value === null || value === "0" || value === "1" || value === "2";
}

function stringArrayV0_1(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function voiceArrayV0_1(value: unknown): value is readonly VowelVoice[] {
  return Array.isArray(value) && value.every(isVowelVoice);
}

function knownReasonV0_1(
  value: unknown,
): value is CmuDictCandidateZcProjectionReasonCodeV0_1 {
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

function validSourceEvidenceVariantV0_1(
  value: unknown,
): value is CmuDictCandidatePronunciationEvidenceVariantV0_1 {
  if (!isRecord(value)) return false;
  return (
    value.sourceProfileId === CMUDICT_SOURCE_PROFILE_ID_V0_1 &&
    value.sourceRevision === CMUDICT_SOURCE_REVISION_V0_1 &&
    value.sourceNotation === CMUDICT_SOURCE_NOTATION_V0_1 &&
    value.sourceArtifactBytes === CMUDICT_DATA_BYTES_V0_1 &&
    value.sourceArtifactSha256 === CMUDICT_DATA_SHA256_V0_1 &&
    typeof value.sourceLineNumber === "number" &&
    Number.isInteger(value.sourceLineNumber) &&
    value.sourceLineNumber >= 1 &&
    typeof value.rawSourceLine === "string" &&
    typeof value.sourceForm === "string" &&
    typeof value.baseSourceForm === "string" &&
    typeof value.variantId === "string" &&
    typeof value.variantOrder === "number" &&
    Number.isInteger(value.variantOrder) &&
    value.variantOrder >= 0 &&
    typeof value.rawPronunciation === "string" &&
    stringArrayV0_1(value.orderedRawArpabetTokens) &&
    Array.isArray(value.losslessBaseStressViews) &&
    value.losslessBaseStressViews.every(
      (view) =>
        isRecord(view) &&
        typeof view.rawToken === "string" &&
        typeof view.baseToken === "string" &&
        validStressV0_1(view.stress),
    ) &&
    (value.opaqueAnnotationText === undefined ||
      typeof value.opaqueAnnotationText === "string") &&
    value.authorityStatus === "RATIFIED_SOURCE_EVIDENCE_ONLY"
  );
}

function validSourceEvidenceV0_1(
  value: unknown,
): value is CmuDictCandidatePronunciationEvidenceV0_1 {
  if (!isRecord(value)) return false;
  if (
    typeof value.candidateId !== "string" ||
    typeof value.candidateSourceId !== "string" ||
    typeof value.candidateSourceFamilyId !== "string" ||
    typeof value.candidateSourceRecordId !== "string" ||
    typeof value.candidateSourceForm !== "string" ||
    typeof value.candidateJoinKey !== "string" ||
    !isRecord(value.candidateSourceProvenance) ||
    (value.status !== "defined" && value.status !== "null") ||
    (value.reasonCode !== null && !knownReasonV0_1(value.reasonCode)) ||
    !Array.isArray(value.variants) ||
    !value.variants.every(validSourceEvidenceVariantV0_1)
  ) {
    return false;
  }
  return (
    (value.status === "defined" && value.reasonCode === null) ||
    (value.status === "null" && value.reasonCode !== null && value.variants.length === 0)
  );
}

function validNormalizedSegmentV0_1(
  value: unknown,
): value is NormalizedArpabetSegmentV0_1 {
  if (!isRecord(value)) return false;
  return (
    typeof value.segmentIndex === "number" &&
    Number.isInteger(value.segmentIndex) &&
    value.segmentIndex >= 0 &&
    (value.kind === "consonant" ||
      value.kind === "monophthong_nucleus" ||
      value.kind === "moving_nucleus") &&
    stringArrayV0_1(value.sourceUnits) &&
    value.sourceUnits.length > 0 &&
    validStressV0_1(value.stress) &&
    (value.nucleusIndex === null ||
      (typeof value.nucleusIndex === "number" &&
        Number.isInteger(value.nucleusIndex) &&
        value.nucleusIndex >= 0)) &&
    value.sourceProfileId === PRONUNCIATION_TO_VOICE_PROFILE_V0_1 &&
    (value.baseCategory === null || typeof value.baseCategory === "string") &&
    (value.voiceAnchors === null || voiceArrayV0_1(value.voiceAnchors))
  );
}

function validNucleusV0_1(value: unknown): value is ArpabetNucleusV0_1 {
  if (!isRecord(value)) return false;
  return (
    typeof value.nucleusIndex === "number" &&
    Number.isInteger(value.nucleusIndex) &&
    value.nucleusIndex >= 0 &&
    typeof value.sourceToken === "string" &&
    typeof value.baseCategory === "string" &&
    validStressV0_1(value.stress) &&
    (value.kind === "monophthong_nucleus" || value.kind === "moving_nucleus") &&
    voiceArrayV0_1(value.voiceAnchors) &&
    value.voiceAnchors.length > 0 &&
    (value.observationAuthority === null || isRecord(value.observationAuthority)) &&
    (value.canonicalization === null || isRecord(value.canonicalization))
  );
}

function validRegionShapeV0_1(
  value: unknown,
): value is CmuDictCandidateGammaConsonantRegionV0_1 {
  if (!isRecord(value)) return false;
  return (
    (value.regionKind === "SOURCE_PREFIX_REGION" ||
      value.regionKind === "SOURCE_INTER_NUCLEUS_REGION" ||
      value.regionKind === "SOURCE_SUFFIX_REGION") &&
    typeof value.regionIndex === "number" &&
    Number.isInteger(value.regionIndex) &&
    value.regionIndex >= 0 &&
    (value.beforeNucleusIndex === null ||
      (typeof value.beforeNucleusIndex === "number" &&
        Number.isInteger(value.beforeNucleusIndex) &&
        value.beforeNucleusIndex >= 0)) &&
    (value.afterNucleusIndex === null ||
      (typeof value.afterNucleusIndex === "number" &&
        Number.isInteger(value.afterNucleusIndex) &&
        value.afterNucleusIndex >= 0)) &&
    Array.isArray(value.sourceSegmentIndices) &&
    value.sourceSegmentIndices.every(
      (index) => Number.isInteger(index) && index >= 0,
    ) &&
    stringArrayV0_1(value.sourceUnits)
  );
}

function validVariantStatusV0_1(value: RecordValue): boolean {
  return (
    (value.status === "defined" && value.reasonCode === null) ||
    (value.status === "null" && knownReasonV0_1(value.reasonCode))
  );
}

function sameStringArrayV0_1(
  left: readonly string[],
  right: readonly string[],
): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function sourceSegmentShapeV0_1(
  segments: readonly NormalizedArpabetSegmentV0_1[],
): boolean {
  if (!segments.every(validNormalizedSegmentV0_1)) return false;
  return segments.every((segment, index) => segment.segmentIndex === index);
}

function gammaRegionTopologyV0_1(
  variant: CmuDictCandidateGammaProjectionVariantV0_1,
): boolean {
  const segments = variant.normalizedSegments;
  const nuclei = variant.nuclei;
  const regions = variant.consonantRegions;
  if (
    !sourceSegmentShapeV0_1(segments) ||
    !nuclei.every(validNucleusV0_1) ||
    !nuclei.every((nucleus, index) => nucleus.nucleusIndex === index) ||
    nuclei.length === 0 ||
    regions.length !== nuclei.length + 1 ||
    variant.canonicalVoicePath === null ||
    !voiceArrayV0_1(variant.canonicalVoicePath) ||
    variant.canonicalVoicePath.length === 0
  ) {
    return false;
  }

  const nucleusSegments = segments.filter(
    (segment) =>
      segment.kind === "monophthong_nucleus" || segment.kind === "moving_nucleus",
  );
  if (
    nucleusSegments.length !== nuclei.length ||
    nucleusSegments.some(
      (segment, index) =>
        segment.nucleusIndex !== index ||
        segment.sourceUnits.length !== 1 ||
        segment.sourceUnits[0] !== nuclei[index].sourceToken ||
        segment.baseCategory !== nuclei[index].baseCategory ||
        segment.stress !== nuclei[index].stress ||
        !sameStringArrayV0_1(segment.voiceAnchors ?? [], nuclei[index].voiceAnchors),
    )
  ) {
    return false;
  }

  if (
    !sameStringArrayV0_1(
      segments.flatMap((segment) => [...segment.sourceUnits]),
      [...variant.sourceEvidence.orderedRawArpabetTokens],
    ) ||
    !sameStringArrayV0_1(
      [...variant.canonicalVoicePath],
      nuclei.flatMap((nucleus) => [...nucleus.voiceAnchors]),
    )
  ) {
    return false;
  }

  const consonants = segments.filter((segment) => segment.kind === "consonant");
  if (
    consonants.some(
      (segment) =>
        segment.nucleusIndex !== null ||
        segment.baseCategory !== null ||
        segment.voiceAnchors !== null ||
        !segment.sourceUnits.every((unit) =>
          AUTHORIZED_CMU_CONSONANT_SOURCE_UNITS_V0_1.has(unit),
        ),
    ) ||
    segments.some(
      (segment) =>
        segment.kind !== "consonant" &&
        (segment.nucleusIndex === null ||
          segment.baseCategory === null ||
          segment.voiceAnchors === null),
    )
  ) {
    return false;
  }

  const expectedRegions: Array<{
    regionKind: CmuDictCandidateGammaConsonantRegionV0_1["regionKind"];
    regionIndex: number;
    beforeNucleusIndex: number | null;
    afterNucleusIndex: number | null;
    selected: readonly NormalizedArpabetSegmentV0_1[];
  }> = [];
  const nucleusSegmentIndices = nucleusSegments.map((segment) => segment.segmentIndex);
  expectedRegions.push({
    regionKind: "SOURCE_PREFIX_REGION",
    regionIndex: 0,
    beforeNucleusIndex: null,
    afterNucleusIndex: 0,
    selected: consonants.filter(
      (segment) => segment.segmentIndex < nucleusSegmentIndices[0],
    ),
  });
  for (let index = 0; index < nucleusSegmentIndices.length - 1; index += 1) {
    expectedRegions.push({
      regionKind: "SOURCE_INTER_NUCLEUS_REGION",
      regionIndex: index,
      beforeNucleusIndex: index,
      afterNucleusIndex: index + 1,
      selected: consonants.filter(
        (segment) =>
          segment.segmentIndex > nucleusSegmentIndices[index] &&
          segment.segmentIndex < nucleusSegmentIndices[index + 1],
      ),
    });
  }
  expectedRegions.push({
    regionKind: "SOURCE_SUFFIX_REGION",
    regionIndex: 0,
    beforeNucleusIndex: nuclei.length - 1,
    afterNucleusIndex: null,
    selected: consonants.filter(
      (segment) =>
        segment.segmentIndex >
        nucleusSegmentIndices[nucleusSegmentIndices.length - 1],
    ),
  });

  return expectedRegions.every((expected, index) => {
    const actual = regions[index];
    if (
      !actual ||
      !validRegionShapeV0_1(actual) ||
      actual.regionKind !== expected.regionKind ||
      actual.regionIndex !== expected.regionIndex ||
      actual.beforeNucleusIndex !== expected.beforeNucleusIndex ||
      actual.afterNucleusIndex !== expected.afterNucleusIndex
    ) {
      return false;
    }
    const expectedIndices = expected.selected.map((segment) => segment.segmentIndex);
    const expectedUnits = expected.selected.flatMap((segment) => [...segment.sourceUnits]);
    return (
      sameArrayNumbersV0_1(actual.sourceSegmentIndices, expectedIndices) &&
      sameStringArrayV0_1(actual.sourceUnits, expectedUnits)
    );
  });
}

function sameArrayNumbersV0_1(
  left: readonly number[],
  right: readonly number[],
): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function validGammaVariantV0_1(
  value: unknown,
): value is CmuDictCandidateGammaProjectionVariantV0_1 {
  if (!isRecord(value)) return false;
  if (
    value.schemaVersion !== CMUDICT_CANDIDATE_GAMMA_PROJECTION_VARIANT_SCHEMA_V0_1 ||
    !validSourceEvidenceVariantV0_1(value.sourceEvidence) ||
    value.variantId !== value.sourceEvidence.variantId ||
    value.variantOrder !== value.sourceEvidence.variantOrder ||
    value.sourceProfileId !== CMUDICT_SOURCE_PROFILE_ID_V0_1 ||
    value.sourceNotation !== CMUDICT_SOURCE_NOTATION_V0_1 ||
    value.sourceRevision !== CMUDICT_SOURCE_REVISION_V0_1 ||
    value.sourceArtifactBytes !== CMUDICT_DATA_BYTES_V0_1 ||
    value.sourceArtifactSha256 !== CMUDICT_DATA_SHA256_V0_1 ||
    value.sourceLineNumber !== value.sourceEvidence.sourceLineNumber ||
    value.rawSourceLine !== value.sourceEvidence.rawSourceLine ||
    !Array.isArray(value.normalizedSegments) ||
    !Array.isArray(value.nuclei) ||
    !(value.canonicalVoicePath === null || stringArrayV0_1(value.canonicalVoicePath)) ||
    !Array.isArray(value.consonantRegions) ||
    !validVariantStatusV0_1(value)
  ) {
    return false;
  }
  if (value.status === "null") {
    return (
      value.normalizedSegments.length === 0 &&
      value.nuclei.length === 0 &&
      value.canonicalVoicePath === null
    );
  }
  return gammaRegionTopologyV0_1(
    value as CmuDictCandidateGammaProjectionVariantV0_1,
  );
}

function validGammaEnvelopeV0_1(
  value: unknown,
): value is CmuDictCandidateGammaProjectionV0_1 {
  if (!isRecord(value)) return false;
  if (
    value.schemaVersion !== CMUDICT_CANDIDATE_GAMMA_PROJECTION_SCHEMA_V0_1 ||
    value.projectorId !== CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1 ||
    value.runtimeAuthorityTag !==
      CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1 ||
    value.configurationAuthority !==
      CMUDICT_CANDIDATE_GAMMA_PROJECTION_CONFIGURATION_AUTHORITY_V0_1 ||
    value.mappingId !== CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1 ||
    value.mappingTable !== CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1 ||
    typeof value.candidateId !== "string" ||
    typeof value.candidateSourceId !== "string" ||
    typeof value.candidateSourceFamilyId !== "string" ||
    typeof value.candidateSourceRecordId !== "string" ||
    typeof value.candidateSourceForm !== "string" ||
    typeof value.candidateJoinKey !== "string" ||
    !isRecord(value.candidateSourceProvenance) ||
    !(value.sourceProfileId === null || value.sourceProfileId === CMUDICT_SOURCE_PROFILE_ID_V0_1) ||
    !(value.sourceNotation === null || value.sourceNotation === CMUDICT_SOURCE_NOTATION_V0_1) ||
    !(value.sourceRevision === null || value.sourceRevision === CMUDICT_SOURCE_REVISION_V0_1) ||
    !(value.sourceArtifactBytes === null || value.sourceArtifactBytes === CMUDICT_DATA_BYTES_V0_1) ||
    !(value.sourceArtifactSha256 === null || value.sourceArtifactSha256 === CMUDICT_DATA_SHA256_V0_1) ||
    !validSourceEvidenceV0_1(value.sourceEvidence) ||
    !Array.isArray(value.variants) ||
    !value.variants.every(validGammaVariantV0_1) ||
    (value.status !== "defined" && value.status !== "null") ||
    (value.reasonCode !== null && !knownReasonV0_1(value.reasonCode))
  ) {
    return false;
  }

  if (
    value.candidateId !== value.sourceEvidence.candidateId ||
    value.candidateSourceId !== value.sourceEvidence.candidateSourceId ||
    value.candidateSourceFamilyId !== value.sourceEvidence.candidateSourceFamilyId ||
    value.candidateSourceRecordId !== value.sourceEvidence.candidateSourceRecordId ||
    value.candidateSourceForm !== value.sourceEvidence.candidateSourceForm ||
    value.candidateJoinKey !== value.sourceEvidence.candidateJoinKey ||
    !sameJsonV0_1(value.candidateSourceProvenance, value.sourceEvidence.candidateSourceProvenance) ||
    value.variants.length !== value.sourceEvidence.variants.length
  ) {
    return false;
  }

  for (const [index, variant] of value.variants.entries()) {
    const sourceVariant = value.sourceEvidence.variants[index];
    if (
      sourceVariant === undefined ||
      !sameJsonV0_1(sourceVariant, variant.sourceEvidence) ||
      variant.variantOrder !== index
    ) {
      return false;
    }
  }

  if (value.status === "defined") {
    const firstVariant = value.variants[0];
    if (
      firstVariant === undefined ||
      value.sourceProfileId !== firstVariant.sourceProfileId ||
      value.sourceNotation !== firstVariant.sourceNotation ||
      value.sourceRevision !== firstVariant.sourceRevision ||
      value.sourceArtifactBytes !== firstVariant.sourceArtifactBytes ||
      value.sourceArtifactSha256 !== firstVariant.sourceArtifactSha256
    ) {
      return false;
    }
  }

  if (value.status === "defined") {
    return (
      value.reasonCode === null &&
      value.sourceEvidence.status === "defined" &&
      value.sourceEvidence.reasonCode === null &&
      value.variants.every((variant) => variant.status === "defined") &&
      value.variants.length > 0
    );
  }

  return (
    value.reasonCode !== null &&
    value.sourceEvidence.status === "defined" &&
    value.variants.some((variant) => variant.status === "null") ||
    (value.reasonCode !== null &&
      value.sourceEvidence.status === "null" &&
      value.variants.length === 0)
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

function nullProjectionV0_1(
  reasonCode: CmuDictCandidateZcProjectionReasonCodeV0_1 =
    "CMUDICT_CANDIDATE_GAMMA_PROJECTION_INVARIANT_VIOLATION",
): CmuDictCandidateZcProjectionV0_1 {
  return {
    schemaVersion: CMUDICT_CANDIDATE_ZC_PROJECTION_SCHEMA_V0_1,
    zcSchemaVersion: ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_SCHEMA_V0_1,
    projectorId: CMUDICT_CANDIDATE_ZC_PROJECTION_PROJECTOR_ID_V0_1,
    gammaSchemaVersion: CMUDICT_CANDIDATE_GAMMA_PROJECTION_SCHEMA_V0_1,
    gammaProjectorId: CMUDICT_CANDIDATE_GAMMA_PROJECTION_PROJECTOR_ID_V0_1,
    gammaRuntimeAuthorityTag:
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
    variants: [],
    status: "null",
    reasonCode,
  };
}

function baseProjectionV0_1(
  input: CmuDictCandidateGammaProjectionV0_1,
): Omit<CmuDictCandidateZcProjectionV0_1, "variants" | "status" | "reasonCode"> {
  return {
    schemaVersion: CMUDICT_CANDIDATE_ZC_PROJECTION_SCHEMA_V0_1,
    zcSchemaVersion: ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_SCHEMA_V0_1,
    projectorId: CMUDICT_CANDIDATE_ZC_PROJECTION_PROJECTOR_ID_V0_1,
    gammaSchemaVersion: input.schemaVersion,
    gammaProjectorId: input.projectorId,
    gammaRuntimeAuthorityTag: input.runtimeAuthorityTag,
    configurationAuthority: input.configurationAuthority,
    candidateId: input.candidateId,
    candidateSourceId: input.candidateSourceId,
    candidateSourceFamilyId: input.candidateSourceFamilyId,
    candidateSourceRecordId: input.candidateSourceRecordId,
    candidateSourceForm: input.candidateSourceForm,
    candidateJoinKey: input.candidateJoinKey,
    candidateSourceProvenance: input.candidateSourceProvenance,
    sourceProfileId:
      input.sourceProfileId === null ? null : CMUDICT_SOURCE_PROFILE_ID_V0_1,
    sourceNotation:
      input.sourceNotation === null ? null : CMUDICT_SOURCE_NOTATION_V0_1,
    sourceRevision:
      input.sourceRevision === null ? null : CMUDICT_SOURCE_REVISION_V0_1,
    sourceArtifactBytes:
      input.sourceArtifactBytes === null ? null : CMUDICT_DATA_BYTES_V0_1,
    sourceArtifactSha256:
      input.sourceArtifactSha256 === null ? null : CMUDICT_DATA_SHA256_V0_1,
    sourceEvidence: input.sourceEvidence,
  };
}

function deriveRecurrenceV0_1(
  segments: readonly NormalizedArpabetSegmentV0_1[],
): readonly ZeroConsonantalStructuralRecurrenceV0_1[] {
  const recurrenceByIdentity = new Map<
    string,
    { identity: readonly string[]; segmentIndices: number[] }
  >();
  for (const segment of segments.filter((item) => item.kind === "consonant")) {
    const identity = [...segment.sourceUnits];
    const key = JSON.stringify(identity);
    const current = recurrenceByIdentity.get(key) ?? {
      identity,
      segmentIndices: [],
    };
    current.segmentIndices.push(segment.segmentIndex);
    recurrenceByIdentity.set(key, current);
  }

  return [...recurrenceByIdentity.values()]
    .filter((entry) => entry.segmentIndices.length > 1)
    .sort((left, right) => left.segmentIndices[0] - right.segmentIndices[0])
    .map((entry) => ({
      identity: [...entry.identity],
      segmentIndices: [...entry.segmentIndices],
      occurrenceCount: entry.segmentIndices.length,
    }));
}

function deriveZeroConsonantalStructuralCompositionV0_1(
  variant: CmuDictCandidateGammaProjectionVariantV0_1,
): ZeroConsonantalStructuralCompositionV0_1 {
  const prefix = variant.consonantRegions.find(
    (region) => region.regionKind === "SOURCE_PREFIX_REGION",
  );
  const inter = variant.consonantRegions
    .filter((region) => region.regionKind === "SOURCE_INTER_NUCLEUS_REGION")
    .sort((left, right) => left.regionIndex - right.regionIndex);
  const suffix = variant.consonantRegions.find(
    (region) => region.regionKind === "SOURCE_SUFFIX_REGION",
  );
  if (
    prefix === undefined ||
    suffix === undefined ||
    variant.canonicalVoicePath === null
  ) {
    throw new Error("Candidate Gamma region invariant failed");
  }

  const p = prefix.sourceSegmentIndices.length;
  const i = inter.map((region) => region.sourceSegmentIndices.length);
  const s = suffix.sourceSegmentIndices.length;

  return {
    schemaVersion: ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_SCHEMA_V0_1,
    voicePath: [...variant.canonicalVoicePath],
    variantId: variant.variantId,
    variantOrder: variant.variantOrder,
    sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
    sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
    sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
    p,
    i,
    s,
    d: [p, ...i, s],
    a: p - s,
    r: deriveRecurrenceV0_1(variant.normalizedSegments),
  };
}

function projectVariantV0_1(
  input: CmuDictCandidateGammaProjectionV0_1,
  variant: CmuDictCandidateGammaProjectionVariantV0_1,
): CmuDictCandidateZcProjectionVariantV0_1 {
  return {
    schemaVersion: CMUDICT_CANDIDATE_ZC_PROJECTION_VARIANT_SCHEMA_V0_1,
    projectorId: CMUDICT_CANDIDATE_ZC_PROJECTION_PROJECTOR_ID_V0_1,
    gammaProjectorId: input.projectorId,
    gammaVariantSchemaVersion: variant.schemaVersion,
    gammaRuntimeAuthorityTag: input.runtimeAuthorityTag,
    candidateId: input.candidateId,
    candidateSourceId: input.candidateSourceId,
    candidateSourceFamilyId: input.candidateSourceFamilyId,
    candidateSourceRecordId: input.candidateSourceRecordId,
    candidateJoinKey: input.candidateJoinKey,
    variantId: variant.variantId,
    variantOrder: variant.variantOrder,
    sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
    sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
    sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
    sourceArtifactBytes: CMUDICT_DATA_BYTES_V0_1,
    sourceArtifactSha256: CMUDICT_DATA_SHA256_V0_1,
    sourceLineNumber: variant.sourceLineNumber,
    sourceEvidence: variant.sourceEvidence,
    zeroConsonantalStructuralComposition:
      deriveZeroConsonantalStructuralCompositionV0_1(variant),
  };
}

export function projectCmuDictCandidateZcProjectionV0_1(
  input: unknown,
): CmuDictCandidateZcProjectionV0_1 {
  try {
    if (!validGammaEnvelopeV0_1(input)) return deepCloneAndFreezeV0_1(nullProjectionV0_1());
    const base = baseProjectionV0_1(input);
    if (input.status === "null") {
      return deepCloneAndFreezeV0_1({
        ...base,
        variants: [],
        status: "null",
        reasonCode: input.reasonCode,
      });
    }
    return deepCloneAndFreezeV0_1({
      ...base,
      variants: input.variants.map((variant) => projectVariantV0_1(input, variant)),
      status: "defined",
      reasonCode: null,
    });
  } catch {
    return deepCloneAndFreezeV0_1(nullProjectionV0_1());
  }
}
