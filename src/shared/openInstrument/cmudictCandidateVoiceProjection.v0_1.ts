import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";

import {
  CMUDICT_DATA_BYTES_V0_1,
  CMUDICT_DATA_SHA256_V0_1,
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
  type CmuDictPronunciationVariantV0_1,
} from "./cmudictArpabetPronunciation.v0_1";
import type {
  CmuDictCandidateAdapterReasonCodeV0_1,
  CmuDictCandidatePronunciationEvidenceV0_1,
  CmuDictCandidatePronunciationEvidenceVariantV0_1,
} from "./cmudictCandidateSourceAdapter.v0_1";
import {
  PRONUNCIATION_TO_VOICE_PROFILE_V0_1,
  resolveArpabetPronunciationVariantsToVoiceV0_1,
  type ArpabetNucleusV0_1,
  type NormalizedArpabetSegmentV0_1,
} from "./pronunciationToVoice.v0_1";

export const CMUDICT_CANDIDATE_VOICE_PROJECTION_SCHEMA_V0_1 =
  "open-instrument.cmudict-candidate-voice-projection.v0_1" as const;
export const CMUDICT_CANDIDATE_VOICE_PROJECTION_VARIANT_SCHEMA_V0_1 =
  "open-instrument.cmudict-candidate-voice-projection.variant.v0_1" as const;
export const CMUDICT_CANDIDATE_VOICE_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1 =
  "DERIVED_FROM_RATIFIED_CMUDICT_CANDIDATE_SOURCE_EVIDENCE_VIA_REVIEWED_OPEN_INSTRUMENT_MAPPING" as const;
export const CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1 =
  `pronunciation-to-voice.${PRONUNCIATION_TO_VOICE_PROFILE_V0_1}.v0_1` as const;
export const CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1 =
  "CMUDICT_ARPABET_VOICE_PROFILE_V0_1" as const;

export type CmuDictCandidateVoiceProjectionReasonCodeV0_1 =
  | "PRONUNCIATION_NOT_FOUND"
  | "PRONUNCIATION_JOIN_COLLISION"
  | "CMUDICT_SOURCE_LINE_MALFORMED"
  | "CMUDICT_ARPABET_TOKEN_UNSUPPORTED"
  | "CMUDICT_STRESS_DIGIT_MALFORMED"
  | "CMUDICT_SOURCE_ARTIFACT_MISMATCH"
  | "CMUDICT_SOURCE_REVISION_MISMATCH"
  | "CMUDICT_CANDIDATE_NOTATION_UNAUTHORIZED"
  | "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION"
  | "PRONUNCIATION_PROVENANCE_UNRESOLVED"
  | "CMUDICT_CANDIDATE_VOICE_PROJECTION_UNAUTHORIZED"
  | "VOICE_FAMILY_AUTHORITY_MISSING"
  | "MOVING_NUCLEUS_AUTHORITY_MISSING"
  | "SPOKEN_NUCLEUS_STRUCTURE_UNRESOLVED"
  | "CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_GAP"
  | "CMUDICT_CANDIDATE_VOICE_PROJECTION_INVARIANT_VIOLATION";

export type CmuDictCandidateVoiceProjectionVariantV0_1 = Readonly<{
  schemaVersion: typeof CMUDICT_CANDIDATE_VOICE_PROJECTION_VARIANT_SCHEMA_V0_1;
  sourceEvidence: CmuDictCandidatePronunciationEvidenceVariantV0_1;
  mappingId: typeof CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1;
  mappingTable: typeof CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1;
  normalizedSegments: readonly NormalizedArpabetSegmentV0_1[];
  nuclei: readonly ArpabetNucleusV0_1[];
  canonicalVoicePath: readonly VowelVoice[] | null;
  status: "defined" | "null";
  reasonCode: CmuDictCandidateVoiceProjectionReasonCodeV0_1 | null;
}>;

export type CmuDictCandidateVoiceProjectionV0_1 = Readonly<{
  schemaVersion: typeof CMUDICT_CANDIDATE_VOICE_PROJECTION_SCHEMA_V0_1;
  candidateId: string;
  candidateSourceId: string;
  candidateSourceFamilyId: string;
  candidateSourceRecordId: string;
  candidateSourceForm: string;
  candidateJoinKey: string;
  candidateSourceProvenance: Readonly<Record<string, unknown>>;
  sourceEvidence: CmuDictCandidatePronunciationEvidenceV0_1;
  sourceEvidenceStatus: "defined" | "null";
  sourceEvidenceReasonCode: CmuDictCandidateAdapterReasonCodeV0_1 | null;
  authorityTag: typeof CMUDICT_CANDIDATE_VOICE_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1;
  mappingId: typeof CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1;
  mappingTable: typeof CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1;
  variants: readonly CmuDictCandidateVoiceProjectionVariantV0_1[];
  status: "defined" | "null";
  reasonCode: CmuDictCandidateVoiceProjectionReasonCodeV0_1 | null;
}>;

type ResolverReasonCode =
  | "PRONUNCIATION_NOT_FOUND"
  | "PRONUNCIATION_SOURCE_UNSUPPORTED"
  | "PRONUNCIATION_VARIANT_AMBIGUOUS"
  | "PRONUNCIATION_VOWEL_CATEGORY_UNSUPPORTED"
  | "SPOKEN_NUCLEUS_STRUCTURE_UNRESOLVED"
  | "VOICE_FAMILY_AUTHORITY_MISSING"
  | "MOVING_NUCLEUS_AUTHORITY_MISSING";

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

  const copy: Record<string, unknown> = {};
  seen.set(value, copy);
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    copy[key] = deepCloneAndFreezeV0_1(child, seen);
  }
  Object.freeze(copy);
  return copy as T;
}

function candidateEnvelopeV0_1(
  evidence: CmuDictCandidatePronunciationEvidenceV0_1,
): Pick<
  CmuDictCandidateVoiceProjectionV0_1,
  | "schemaVersion"
  | "candidateId"
  | "candidateSourceId"
  | "candidateSourceFamilyId"
  | "candidateSourceRecordId"
  | "candidateSourceForm"
  | "candidateJoinKey"
  | "candidateSourceProvenance"
  | "sourceEvidence"
  | "sourceEvidenceStatus"
  | "sourceEvidenceReasonCode"
  | "authorityTag"
  | "mappingId"
  | "mappingTable"
> {
  return {
    schemaVersion: CMUDICT_CANDIDATE_VOICE_PROJECTION_SCHEMA_V0_1,
    candidateId: evidence.candidateId,
    candidateSourceId: evidence.candidateSourceId,
    candidateSourceFamilyId: evidence.candidateSourceFamilyId,
    candidateSourceRecordId: evidence.candidateSourceRecordId,
    candidateSourceForm: evidence.candidateSourceForm,
    candidateJoinKey: evidence.candidateJoinKey,
    candidateSourceProvenance: deepCloneAndFreezeV0_1(
      evidence.candidateSourceProvenance,
    ),
    sourceEvidence: deepCloneAndFreezeV0_1(evidence),
    sourceEvidenceStatus: evidence.status,
    sourceEvidenceReasonCode: evidence.reasonCode,
    authorityTag:
      CMUDICT_CANDIDATE_VOICE_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1,
    mappingId: CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1,
    mappingTable: CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1,
  };
}

function nullVariantV0_1(
  sourceEvidence: CmuDictCandidatePronunciationEvidenceVariantV0_1,
  reasonCode: CmuDictCandidateVoiceProjectionReasonCodeV0_1,
): CmuDictCandidateVoiceProjectionVariantV0_1 {
  return {
    schemaVersion: CMUDICT_CANDIDATE_VOICE_PROJECTION_VARIANT_SCHEMA_V0_1,
    sourceEvidence: deepCloneAndFreezeV0_1(sourceEvidence),
    mappingId: CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1,
    mappingTable: CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1,
    normalizedSegments: [],
    nuclei: [],
    canonicalVoicePath: null,
    status: "null",
    reasonCode,
  };
}

function sourceEvidenceReasonV0_1(
  evidence: CmuDictCandidatePronunciationEvidenceV0_1,
): CmuDictCandidateVoiceProjectionReasonCodeV0_1 | null {
  if (
    evidence.candidateId.length === 0 ||
    evidence.candidateSourceId.length === 0 ||
    evidence.candidateSourceFamilyId.length === 0 ||
    evidence.candidateSourceRecordId.length === 0 ||
    evidence.candidateSourceForm.length === 0 ||
    evidence.candidateJoinKey.length === 0 ||
    evidence.candidateSourceProvenance === null ||
    typeof evidence.candidateSourceProvenance !== "object" ||
    Array.isArray(evidence.candidateSourceProvenance)
  ) {
    return "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION";
  }

  if (evidence.status !== "defined" || evidence.reasonCode !== null) {
    return "CMUDICT_CANDIDATE_VOICE_PROJECTION_INVARIANT_VIOLATION";
  }

  if (evidence.variants.length === 0) {
    return "PRONUNCIATION_NOT_FOUND";
  }

  return null;
}

function variantEvidenceReasonV0_1(
  variant: CmuDictCandidatePronunciationEvidenceVariantV0_1,
): CmuDictCandidateVoiceProjectionReasonCodeV0_1 | null {
  if (variant.authorityStatus !== "RATIFIED_SOURCE_EVIDENCE_ONLY") {
    return "CMUDICT_CANDIDATE_VOICE_PROJECTION_UNAUTHORIZED";
  }
  if (
    variant.sourceArtifactBytes !== CMUDICT_DATA_BYTES_V0_1 ||
    variant.sourceArtifactSha256 !== CMUDICT_DATA_SHA256_V0_1
  ) {
    return "CMUDICT_SOURCE_ARTIFACT_MISMATCH";
  }
  if (variant.sourceRevision !== CMUDICT_SOURCE_REVISION_V0_1) {
    return "CMUDICT_SOURCE_REVISION_MISMATCH";
  }
  if (
    variant.sourceProfileId !== CMUDICT_SOURCE_PROFILE_ID_V0_1 ||
    variant.sourceNotation !== CMUDICT_SOURCE_NOTATION_V0_1
  ) {
    return "CMUDICT_CANDIDATE_NOTATION_UNAUTHORIZED";
  }
  if (
    !Number.isInteger(variant.sourceLineNumber) ||
    variant.sourceLineNumber < 1 ||
    variant.rawSourceLine.length === 0 ||
    variant.sourceForm.length === 0 ||
    variant.baseSourceForm.length === 0 ||
    variant.variantId.length === 0 ||
    variant.variantOrder < 0 ||
    variant.rawPronunciation.length === 0 ||
    variant.orderedRawArpabetTokens.length === 0 ||
    variant.orderedRawArpabetTokens.length !==
      variant.losslessBaseStressViews.length
  ) {
    return "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION";
  }

  for (const [index, token] of variant.orderedRawArpabetTokens.entries()) {
    const view = variant.losslessBaseStressViews[index];
    if (view.rawToken !== token) {
      return "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION";
    }
    if (!/^[A-Z]+(?:[012])?$/u.test(token)) {
      return /[3-9]$/u.test(token)
        ? "CMUDICT_STRESS_DIGIT_MALFORMED"
        : "CMUDICT_ARPABET_TOKEN_UNSUPPORTED";
    }
    const match = /^([A-Z]+)([012])?$/u.exec(token);
    if (match?.[1] !== view.baseToken || (match?.[2] ?? null) !== view.stress) {
      return "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION";
    }
  }

  return null;
}

function toResolverVariantV0_1(
  evidence: CmuDictCandidatePronunciationEvidenceVariantV0_1,
  candidateJoinKey: string,
): CmuDictPronunciationVariantV0_1 {
  return {
    lexicalWord: candidateJoinKey,
    sourceForm: evidence.sourceForm,
    variantId: evidence.variantId,
    variantOrder: evidence.variantOrder,
    sourcePronunciation: evidence.rawPronunciation,
    sourceUnits: evidence.orderedRawArpabetTokens,
    sourceProfileId: evidence.sourceProfileId,
    sourceRevision: evidence.sourceRevision,
    sourceNotation: evidence.sourceNotation,
  };
}

function mapResolverReasonV0_1(
  reasonCode: ResolverReasonCode | null,
): CmuDictCandidateVoiceProjectionReasonCodeV0_1 | null {
  switch (reasonCode) {
    case null:
      return null;
    case "PRONUNCIATION_NOT_FOUND":
      return "PRONUNCIATION_NOT_FOUND";
    case "SPOKEN_NUCLEUS_STRUCTURE_UNRESOLVED":
      return "SPOKEN_NUCLEUS_STRUCTURE_UNRESOLVED";
    case "VOICE_FAMILY_AUTHORITY_MISSING":
      return "VOICE_FAMILY_AUTHORITY_MISSING";
    case "MOVING_NUCLEUS_AUTHORITY_MISSING":
      return "MOVING_NUCLEUS_AUTHORITY_MISSING";
    case "PRONUNCIATION_VOWEL_CATEGORY_UNSUPPORTED":
    case "PRONUNCIATION_SOURCE_UNSUPPORTED":
      return "CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_GAP";
    case "PRONUNCIATION_VARIANT_AMBIGUOUS":
      return "CMUDICT_CANDIDATE_VOICE_PROJECTION_INVARIANT_VIOLATION";
  }
}

function projectVariantV0_1(
  evidence: CmuDictCandidatePronunciationEvidenceVariantV0_1,
  candidateJoinKey: string,
): CmuDictCandidateVoiceProjectionVariantV0_1 {
  const evidenceReason = variantEvidenceReasonV0_1(evidence);
  if (evidenceReason !== null) return nullVariantV0_1(evidence, evidenceReason);

  const resolved = resolveArpabetPronunciationVariantsToVoiceV0_1(
    candidateJoinKey,
    [toResolverVariantV0_1(evidence, candidateJoinKey)],
  );
  const resolvedVariant = resolved.variants[0];
  const reasonCode = mapResolverReasonV0_1(resolvedVariant.reasonCode);
  return {
    schemaVersion: CMUDICT_CANDIDATE_VOICE_PROJECTION_VARIANT_SCHEMA_V0_1,
    sourceEvidence: deepCloneAndFreezeV0_1(evidence),
    mappingId: CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1,
    mappingTable: CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1,
    normalizedSegments: deepCloneAndFreezeV0_1(resolvedVariant.normalizedSegments),
    nuclei: deepCloneAndFreezeV0_1(resolvedVariant.nuclei),
    canonicalVoicePath: deepCloneAndFreezeV0_1(
      resolvedVariant.canonicalVoicePath,
    ),
    status: reasonCode === null ? "defined" : "null",
    reasonCode,
  };
}

export function projectCmuDictCandidateVoiceProjectionV0_1(
  evidence: CmuDictCandidatePronunciationEvidenceV0_1,
): CmuDictCandidateVoiceProjectionV0_1 {
  const envelope = candidateEnvelopeV0_1(evidence);
  const sourceReason = sourceEvidenceReasonV0_1(evidence);
  if (sourceReason !== null) {
    return deepCloneAndFreezeV0_1({
      ...envelope,
      variants: [],
      status: "null" as const,
      reasonCode: sourceReason,
    });
  }

  const variants = evidence.variants.map((variant) =>
    projectVariantV0_1(variant, evidence.candidateJoinKey),
  );
  const failed = variants.find((variant) => variant.reasonCode !== null);
  return deepCloneAndFreezeV0_1({
    ...envelope,
    variants,
    status: failed ? "null" : "defined",
    reasonCode: failed?.reasonCode ?? null,
  });
}
