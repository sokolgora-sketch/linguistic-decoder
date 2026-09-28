import {
  isVowelVoice,
  type VowelVoice,
} from "@/shared/vowels/vowelVoices.v0.1";

export const MOVING_NUCLEUS_OBSERVATION_AUTHORITY_SCHEMA_V0_1 =
  "open-instrument.moving-nucleus-observation-authority.v0_1" as const;

export const MOVING_NUCLEUS_OBSERVATION_AUTHORITY_REASON_CODES_V0_1 = [
  "CANONICALIZATION_NOT_AUTHORIZED",
  "CLAIM_SHAPE_INVALID",
  "INPUT_NOT_OBJECT",
  "MEASUREMENT_PROVENANCE_MISSING",
  "MEASUREMENT_QC_FAILED",
  "MOVEMENT_AUTHORITY_MISSING",
  "NUCLEUS_STRUCTURE_UNRESOLVED",
  "PHONETIC_ANCHOR_UNMAPPED",
  "PLAIN_IPA_ADJACENCY_INSUFFICIENT",
  "SCHEMA_VERSION_INVALID",
  "SOURCE_SCOPE_CONFLICT",
  "VOICE_FAMILY_AUTHORITY_MISSING",
] as const;

export type MovingNucleusObservationAuthorityReasonCodeV0_1 =
  (typeof MOVING_NUCLEUS_OBSERVATION_AUTHORITY_REASON_CODES_V0_1)[number];

export type MovingNucleusObservationAuthorityClassV0_1 =
  | "TRANSCRIPTION_ASSERTED"
  | "PHONOLOGICALLY_DOCUMENTED"
  | "ACOUSTICALLY_OBSERVED";

export type MovingNucleusObservationClaimStateV0_1 =
  | "SUPPORTED"
  | "UNKNOWN"
  | "UNRESOLVED"
  | "UNSUPPORTED"
  | "CONFLICTED";

export type MovingNucleusNucleusStructureStateV0_1 =
  | "ONE_NUCLEUS"
  | "SEQUENTIAL_NUCLEI"
  | "UNRESOLVED";

export type MovingNucleusMovementStateV0_1 =
  | "OBSERVED"
  | "NOT_OBSERVED"
  | "UNKNOWN";

export type MovingNucleusPhoneticAnchorV0_1 = Readonly<{
  kind: "ipa_description" | "source_description" | "acoustic_region";
  value: string;
  order: number;
  evidenceRef: string;
}>;

type CommonObservationProvenanceV0_1 = Readonly<{
  sourceId: string;
  evidenceRefs: readonly string[];
  language: string;
  dialectOrDoculect: string | null;
  claimScope: string;
  limitations: readonly string[];
}>;

export type MovingNucleusTranscriptionProvenanceV0_1 = Readonly<
  CommonObservationProvenanceV0_1 & {
    authorityClass: "TRANSCRIPTION_ASSERTED";
    explicitNotation: string;
    scopeOrConvention: string;
  }
>;

export type MovingNucleusPhonologicalProvenanceV0_1 = Readonly<
  CommonObservationProvenanceV0_1 & {
    authorityClass: "PHONOLOGICALLY_DOCUMENTED";
    boundedClaim: string;
  }
>;

export type MovingNucleusAcousticTemporalObservationV0_1 = Readonly<{
  coordinate: string;
  measuredFields: readonly string[];
}>;

export type MovingNucleusAcousticProvenanceV0_1 = Readonly<
  CommonObservationProvenanceV0_1 & {
    authorityClass: "ACOUSTICALLY_OBSERVED";
    tokenOrRecordingRef: string;
    speakerOrSessionGroup: string;
    context: string | null;
    boundaryOrSpan: string;
    temporalAlignment: readonly string[];
    temporalObservations: readonly MovingNucleusAcousticTemporalObservationV0_1[];
    measuredFields: readonly string[];
    extractionMethod: string;
    softwareVersion: string | null;
    settingsProvenance: string | null;
    qcState: "PASS" | "FAIL" | "UNRESOLVED";
    correctionExclusionState: "NONE" | "CORRECTED" | "EXCLUDED" | "UNRESOLVED";
    uncertaintyLimitations: readonly string[];
  }
>;

export type MovingNucleusObservationClaimAuthorityV0_1 = Readonly<{
  authorityClass: MovingNucleusObservationAuthorityClassV0_1;
  provenance:
    | MovingNucleusTranscriptionProvenanceV0_1
    | MovingNucleusPhonologicalProvenanceV0_1
    | MovingNucleusAcousticProvenanceV0_1;
}>;

export type MovingNucleusVoiceFamilyMappingAuthorityV0_1 = Readonly<{
  authorityType: "REVIEWED_OPEN_INSTRUMENT_MAPPING";
  mappingId: string;
  evidenceRefs: readonly string[];
  claimScope: string;
}>;

export type MovingNucleusObservationClaimKeyV0_1 =
  | "nucleusStructure"
  | "movement"
  | "phoneticAnchors"
  | "voiceFamilyAnchors";

export type MovingNucleusCompetingAuthorityRecordV0_1 = Readonly<{
  claim: MovingNucleusObservationClaimKeyV0_1;
  authority:
    | MovingNucleusObservationClaimAuthorityV0_1
    | MovingNucleusVoiceFamilyMappingAuthorityV0_1;
}>;

export type MovingNucleusObservationAuthorityByClaimV0_1 = Readonly<{
  nucleusStructure: MovingNucleusObservationClaimAuthorityV0_1 | null;
  movement: MovingNucleusObservationClaimAuthorityV0_1 | null;
  phoneticAnchors: MovingNucleusObservationClaimAuthorityV0_1 | null;
  voiceFamilyAnchors: MovingNucleusVoiceFamilyMappingAuthorityV0_1 | null;
  canonicalization: null;
}>;

export type MovingNucleusNucleusStructureClaimV0_1 = Readonly<{
  state: MovingNucleusNucleusStructureStateV0_1;
  rawIpaSegments: readonly string[];
  explicitNotation: string | null;
}>;

export type MovingNucleusMovementClaimV0_1 = Readonly<{
  state: MovingNucleusMovementStateV0_1;
}>;

export type MovingNucleusPhoneticAnchorsClaimV0_1 = Readonly<{
  state: MovingNucleusObservationClaimStateV0_1;
  anchors: readonly MovingNucleusPhoneticAnchorV0_1[] | null;
}>;

export type MovingNucleusVoiceFamilyAnchorsClaimV0_1 = Readonly<{
  state: MovingNucleusObservationClaimStateV0_1;
  anchors: readonly VowelVoice[] | null;
}>;

export type MovingNucleusCanonicalizationStatusV0_1 =
  | "not_authorized"
  | "unresolved"
  | "unsupported";

export type MovingNucleusObservationAuthorityV0_1 = Readonly<{
  schemaVersion: typeof MOVING_NUCLEUS_OBSERVATION_AUTHORITY_SCHEMA_V0_1;
  aggregateStatus: MovingNucleusObservationClaimStateV0_1;
  nucleusStructure: MovingNucleusNucleusStructureClaimV0_1;
  movement: MovingNucleusMovementClaimV0_1;
  phoneticAnchors: MovingNucleusPhoneticAnchorsClaimV0_1;
  voiceFamilyAnchors: MovingNucleusVoiceFamilyAnchorsClaimV0_1;
  canonicalizationStatus: MovingNucleusCanonicalizationStatusV0_1;
  authorityByClaim: MovingNucleusObservationAuthorityByClaimV0_1;
  competingAuthorities: readonly MovingNucleusCompetingAuthorityRecordV0_1[];
  reasonCodes: readonly MovingNucleusObservationAuthorityReasonCodeV0_1[];
}>;

export type MovingNucleusObservationAuthorityValidationResultV0_1 = Readonly<
  | { ok: true; value: MovingNucleusObservationAuthorityV0_1 }
  | {
      ok: false;
      reasonCodes: readonly MovingNucleusObservationAuthorityReasonCodeV0_1[];
    }
>;

export type MovingNucleusObservationAuthorityValidationOptionsV0_1 = Readonly<{
  normalizedVoicePath?: readonly VowelVoice[] | null;
}>;

type RecordV0_1 = Record<string, unknown>;

const AUTHORITY_CLASSES_V0_1 = new Set<MovingNucleusObservationAuthorityClassV0_1>([
  "TRANSCRIPTION_ASSERTED",
  "PHONOLOGICALLY_DOCUMENTED",
  "ACOUSTICALLY_OBSERVED",
]);

const CLAIM_STATES_V0_1 = new Set<MovingNucleusObservationClaimStateV0_1>([
  "SUPPORTED",
  "UNKNOWN",
  "UNRESOLVED",
  "UNSUPPORTED",
  "CONFLICTED",
]);

const REASON_CODE_SET_V0_1 = new Set<string>(
  MOVING_NUCLEUS_OBSERVATION_AUTHORITY_REASON_CODES_V0_1,
);

const TOP_LEVEL_KEYS_V0_1 = [
  "schemaVersion",
  "aggregateStatus",
  "nucleusStructure",
  "movement",
  "phoneticAnchors",
  "voiceFamilyAnchors",
  "canonicalizationStatus",
  "authorityByClaim",
  "competingAuthorities",
  "reasonCodes",
] as const;

function isRecordV0_1(value: unknown): value is RecordV0_1 {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyStringV0_1(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArrayV0_1(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every(isNonEmptyStringV0_1);
}

function isNonEmptyStringArrayV0_1(value: unknown): value is readonly string[] {
  return isStringArrayV0_1(value) && value.length > 0;
}

function hasExactKeysV0_1(value: RecordV0_1, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function sortedReasonsV0_1(
  reasons: Iterable<MovingNucleusObservationAuthorityReasonCodeV0_1>,
): readonly MovingNucleusObservationAuthorityReasonCodeV0_1[] {
  return [...new Set(reasons)].sort();
}

function deepFreezeV0_1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value as RecordV0_1)) {
    deepFreezeV0_1(child, seen);
  }
  return Object.freeze(value);
}

function cloneV0_1<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((child) => cloneV0_1(child)) as T;

  const clone: RecordV0_1 = {};
  for (const [key, child] of Object.entries(value as RecordV0_1)) {
    clone[key] = cloneV0_1(child);
  }
  return clone as T;
}

function addClaimShapeReasonV0_1(
  reasons: Set<MovingNucleusObservationAuthorityReasonCodeV0_1>,
): void {
  reasons.add("CLAIM_SHAPE_INVALID");
}

function validateCommonProvenanceV0_1(
  provenance: unknown,
  expectedAuthorityClass: MovingNucleusObservationAuthorityClassV0_1,
  reasons: Set<MovingNucleusObservationAuthorityReasonCodeV0_1>,
): provenance is RecordV0_1 {
  if (!isRecordV0_1(provenance)) {
    reasons.add("CLAIM_SHAPE_INVALID");
    return false;
  }

  if (provenance.authorityClass !== expectedAuthorityClass) {
    reasons.add("CLAIM_SHAPE_INVALID");
  }
  if (!isNonEmptyStringV0_1(provenance.sourceId)) reasons.add("CLAIM_SHAPE_INVALID");
  if (!isNonEmptyStringArrayV0_1(provenance.evidenceRefs)) {
    reasons.add("CLAIM_SHAPE_INVALID");
  }
  if (!isNonEmptyStringV0_1(provenance.language)) reasons.add("CLAIM_SHAPE_INVALID");
  if (
    provenance.dialectOrDoculect !== null &&
    !isNonEmptyStringV0_1(provenance.dialectOrDoculect)
  ) {
    reasons.add("CLAIM_SHAPE_INVALID");
  }
  if (!isNonEmptyStringV0_1(provenance.claimScope)) reasons.add("CLAIM_SHAPE_INVALID");
  if (!isStringArrayV0_1(provenance.limitations)) reasons.add("CLAIM_SHAPE_INVALID");

  return true;
}

type AuthorityValidationOptionsV0_1 = Readonly<{
  claimKey: MovingNucleusObservationClaimKeyV0_1;
  positiveSupport: boolean;
}>;

function validateVoiceFamilyMappingAuthorityV0_1(
  mappingAuthority: unknown,
  reasons: Set<MovingNucleusObservationAuthorityReasonCodeV0_1>,
): void {
  if (!isRecordV0_1(mappingAuthority)) {
    reasons.add("VOICE_FAMILY_AUTHORITY_MISSING");
    return;
  }
  if (mappingAuthority.authorityType !== "REVIEWED_OPEN_INSTRUMENT_MAPPING") {
    reasons.add("VOICE_FAMILY_AUTHORITY_MISSING");
  }
  if (!isNonEmptyStringV0_1(mappingAuthority.mappingId)) {
    reasons.add("VOICE_FAMILY_AUTHORITY_MISSING");
  }
  if (!isNonEmptyStringArrayV0_1(mappingAuthority.evidenceRefs)) {
    reasons.add("VOICE_FAMILY_AUTHORITY_MISSING");
  }
  if (!isNonEmptyStringV0_1(mappingAuthority.claimScope)) {
    reasons.add("VOICE_FAMILY_AUTHORITY_MISSING");
  }
}

function validateAuthorityV0_1(
  authority: unknown,
  reasons: Set<MovingNucleusObservationAuthorityReasonCodeV0_1>,
  options: AuthorityValidationOptionsV0_1,
): MovingNucleusObservationAuthorityClassV0_1 | null {
  if (!isRecordV0_1(authority) || !AUTHORITY_CLASSES_V0_1.has(authority.authorityClass as MovingNucleusObservationAuthorityClassV0_1)) {
    reasons.add("CLAIM_SHAPE_INVALID");
    return null;
  }

  const authorityClass = authority.authorityClass as MovingNucleusObservationAuthorityClassV0_1;
  if (!validateCommonProvenanceV0_1(authority.provenance, authorityClass, reasons)) {
    return authorityClass;
  }

  if (authorityClass === "TRANSCRIPTION_ASSERTED") {
    if (!isNonEmptyStringV0_1(authority.provenance.explicitNotation)) {
      reasons.add("PLAIN_IPA_ADJACENCY_INSUFFICIENT");
    }
    if (!isNonEmptyStringV0_1(authority.provenance.scopeOrConvention)) {
      reasons.add("CLAIM_SHAPE_INVALID");
    }
  }

  if (authorityClass === "PHONOLOGICALLY_DOCUMENTED") {
    if (!isNonEmptyStringV0_1(authority.provenance.boundedClaim)) {
      reasons.add("CLAIM_SHAPE_INVALID");
    }
  }

  if (authorityClass === "ACOUSTICALLY_OBSERVED") {
    const provenance = authority.provenance;
    const requiredStrings = [
      provenance.tokenOrRecordingRef,
      provenance.speakerOrSessionGroup,
      provenance.boundaryOrSpan,
      provenance.extractionMethod,
    ];
    if (requiredStrings.some((value) => !isNonEmptyStringV0_1(value))) {
      reasons.add("MEASUREMENT_PROVENANCE_MISSING");
    }
    if (!isNonEmptyStringArrayV0_1(provenance.temporalAlignment)) {
      reasons.add("MEASUREMENT_PROVENANCE_MISSING");
    }
    if (
      !Array.isArray(provenance.temporalObservations) ||
      provenance.temporalObservations.some(
        (observation) =>
          !isRecordV0_1(observation) ||
          !isNonEmptyStringV0_1(observation.coordinate) ||
          !isNonEmptyStringArrayV0_1(observation.measuredFields),
      )
    ) {
      reasons.add("MEASUREMENT_PROVENANCE_MISSING");
    }
    if (
      options.claimKey === "movement" &&
      (!Array.isArray(provenance.temporalObservations) ||
        provenance.temporalObservations.length < 2)
    ) {
      reasons.add("MEASUREMENT_PROVENANCE_MISSING");
    }
    if (!isNonEmptyStringArrayV0_1(provenance.measuredFields)) {
      reasons.add("MEASUREMENT_PROVENANCE_MISSING");
    }
    if (
      !["NONE", "CORRECTED", "EXCLUDED", "UNRESOLVED"].includes(
        String(provenance.correctionExclusionState),
      )
    ) {
      addClaimShapeReasonV0_1(reasons);
    }
    if (!["PASS", "FAIL", "UNRESOLVED"].includes(String(provenance.qcState))) {
      addClaimShapeReasonV0_1(reasons);
    }
    if (options.positiveSupport && provenance.qcState === "FAIL") {
      reasons.add("MEASUREMENT_QC_FAILED");
    }
    if (options.positiveSupport && provenance.qcState !== "PASS") {
      reasons.add("MEASUREMENT_PROVENANCE_MISSING");
    }
    if (
      options.positiveSupport &&
      (provenance.correctionExclusionState === "EXCLUDED" ||
        provenance.correctionExclusionState === "UNRESOLVED")
    ) {
      reasons.add("MEASUREMENT_PROVENANCE_MISSING");
    }
    if (
      provenance.correctionExclusionState === "CORRECTED" &&
      !isNonEmptyStringV0_1(provenance.settingsProvenance)
    ) {
      reasons.add("MEASUREMENT_PROVENANCE_MISSING");
    }
    if (!isStringArrayV0_1(provenance.uncertaintyLimitations)) {
      reasons.add("MEASUREMENT_PROVENANCE_MISSING");
    }
  }

  return authorityClass;
}

function validateNucleusStructureV0_1(
  value: unknown,
  authority: unknown,
  reasons: Set<MovingNucleusObservationAuthorityReasonCodeV0_1>,
): void {
  if (!isRecordV0_1(value)) {
    reasons.add("NUCLEUS_STRUCTURE_UNRESOLVED");
    return;
  }

  const supportedState =
    value.state === "ONE_NUCLEUS" || value.state === "SEQUENTIAL_NUCLEI";
  if (
    value.state !== "ONE_NUCLEUS" &&
    value.state !== "SEQUENTIAL_NUCLEI" &&
    value.state !== "UNRESOLVED"
  ) {
    reasons.add("NUCLEUS_STRUCTURE_UNRESOLVED");
  }
  if (!isStringArrayV0_1(value.rawIpaSegments)) addClaimShapeReasonV0_1(reasons);
  if (
    value.explicitNotation !== null &&
    !isNonEmptyStringV0_1(value.explicitNotation)
  ) {
    addClaimShapeReasonV0_1(reasons);
  }

  const authorityClass =
    authority === null
      ? null
      : validateAuthorityV0_1(authority, reasons, {
          claimKey: "nucleusStructure",
          positiveSupport: supportedState,
        });
  if (supportedState && authorityClass === null) {
    reasons.add("NUCLEUS_STRUCTURE_UNRESOLVED");
  }
  if (supportedState && authorityClass === "ACOUSTICALLY_OBSERVED") {
    reasons.add("NUCLEUS_STRUCTURE_UNRESOLVED");
  }
  if (
    supportedState &&
    Array.isArray(value.rawIpaSegments) &&
    value.rawIpaSegments.length > 1 &&
    value.explicitNotation === null &&
    authorityClass === null
  ) {
    reasons.add("PLAIN_IPA_ADJACENCY_INSUFFICIENT");
  }
}

function validateMovementV0_1(
  value: unknown,
  authority: unknown,
  reasons: Set<MovingNucleusObservationAuthorityReasonCodeV0_1>,
): void {
  if (!isRecordV0_1(value) || !["OBSERVED", "NOT_OBSERVED", "UNKNOWN"].includes(String(value.state))) {
    reasons.add("MOVEMENT_AUTHORITY_MISSING");
    return;
  }

  const authorityClass =
    authority === null
      ? null
      : validateAuthorityV0_1(authority, reasons, {
          claimKey: "movement",
          positiveSupport: value.state !== "UNKNOWN",
        });
  if (value.state === "UNKNOWN") return;

  if (authorityClass === null || authorityClass === "TRANSCRIPTION_ASSERTED") {
    reasons.add("MOVEMENT_AUTHORITY_MISSING");
  }
}

function validatePhoneticAnchorsV0_1(
  value: unknown,
  authority: unknown,
  reasons: Set<MovingNucleusObservationAuthorityReasonCodeV0_1>,
): void {
  if (!isRecordV0_1(value) || !CLAIM_STATES_V0_1.has(value.state as MovingNucleusObservationClaimStateV0_1)) {
    addClaimShapeReasonV0_1(reasons);
    return;
  }

  if (authority !== null) {
    validateAuthorityV0_1(authority, reasons, {
      claimKey: "phoneticAnchors",
      positiveSupport: value.state === "SUPPORTED",
    });
  }

  if (value.anchors === null) {
    if (value.state === "SUPPORTED") addClaimShapeReasonV0_1(reasons);
    return;
  }

  if (
    !Array.isArray(value.anchors) ||
    value.anchors.some(
      (anchor) =>
        !isRecordV0_1(anchor) ||
        !["ipa_description", "source_description", "acoustic_region"].includes(String(anchor.kind)) ||
        !isNonEmptyStringV0_1(anchor.value) ||
        !Number.isInteger(anchor.order) ||
        (anchor.order as number) < 0 ||
        !isNonEmptyStringV0_1(anchor.evidenceRef),
    )
  ) {
    addClaimShapeReasonV0_1(reasons);
  }
  if (authority === null) addClaimShapeReasonV0_1(reasons);
}

function validateVoiceFamilyAnchorsV0_1(
  value: unknown,
  mappingAuthority: unknown,
  reasons: Set<MovingNucleusObservationAuthorityReasonCodeV0_1>,
): void {
  if (!isRecordV0_1(value) || !CLAIM_STATES_V0_1.has(value.state as MovingNucleusObservationClaimStateV0_1)) {
    addClaimShapeReasonV0_1(reasons);
    return;
  }
  if (
    value.anchors !== null &&
    (!Array.isArray(value.anchors) || value.anchors.some((anchor) => !isVowelVoice(anchor)))
  ) {
    addClaimShapeReasonV0_1(reasons);
  }
  if (value.state === "SUPPORTED" && mappingAuthority === null) {
    reasons.add("VOICE_FAMILY_AUTHORITY_MISSING");
  }
  if (value.anchors !== null && mappingAuthority === null) {
    reasons.add("VOICE_FAMILY_AUTHORITY_MISSING");
    reasons.add("PHONETIC_ANCHOR_UNMAPPED");
  }
  if (mappingAuthority !== null) {
    if (!isRecordV0_1(mappingAuthority)) {
      reasons.add("VOICE_FAMILY_AUTHORITY_MISSING");
      return;
    }
    if (mappingAuthority.authorityType !== "REVIEWED_OPEN_INSTRUMENT_MAPPING") {
      reasons.add("VOICE_FAMILY_AUTHORITY_MISSING");
    }
    if (!isNonEmptyStringV0_1(mappingAuthority.mappingId)) {
      reasons.add("VOICE_FAMILY_AUTHORITY_MISSING");
    }
    validateVoiceFamilyMappingAuthorityV0_1(mappingAuthority, reasons);
  }
}

function isObservationClaimKeyV0_1(
  value: unknown,
): value is MovingNucleusObservationClaimKeyV0_1 {
  return [
    "nucleusStructure",
    "movement",
    "phoneticAnchors",
    "voiceFamilyAnchors",
  ].includes(String(value));
}

function validateCompetingAuthoritiesV0_1(
  value: unknown,
  reasons: Set<MovingNucleusObservationAuthorityReasonCodeV0_1>,
): Map<MovingNucleusObservationClaimKeyV0_1, number> {
  const counts = new Map<MovingNucleusObservationClaimKeyV0_1, number>();
  if (!Array.isArray(value)) {
    addClaimShapeReasonV0_1(reasons);
    return counts;
  }

  for (const record of value) {
    if (!isRecordV0_1(record) || !hasExactKeysV0_1(record, ["claim", "authority"])) {
      addClaimShapeReasonV0_1(reasons);
      continue;
    }
    if (!isObservationClaimKeyV0_1(record.claim)) {
      addClaimShapeReasonV0_1(reasons);
      continue;
    }

    counts.set(record.claim, (counts.get(record.claim) ?? 0) + 1);
    if (record.claim === "voiceFamilyAnchors") {
      validateVoiceFamilyMappingAuthorityV0_1(record.authority, reasons);
    } else {
      validateAuthorityV0_1(record.authority, reasons, {
        claimKey: record.claim,
        positiveSupport: false,
      });
    }
  }

  return counts;
}

function conflictedClaimKeysV0_1(
  value: RecordV0_1,
): readonly MovingNucleusObservationClaimKeyV0_1[] {
  const conflicted: MovingNucleusObservationClaimKeyV0_1[] = [];
  if (isRecordV0_1(value.phoneticAnchors) && value.phoneticAnchors.state === "CONFLICTED") {
    conflicted.push("phoneticAnchors");
  }
  if (isRecordV0_1(value.voiceFamilyAnchors) && value.voiceFamilyAnchors.state === "CONFLICTED") {
    conflicted.push("voiceFamilyAnchors");
  }
  return conflicted;
}

function hasPositiveComponentClaimV0_1(
  value: RecordV0_1,
  authorityByClaim: RecordV0_1 | null,
): boolean {
  if (authorityByClaim === null) return false;
  const nucleusStructure = isRecordV0_1(value.nucleusStructure)
    ? value.nucleusStructure
    : null;
  if (
    nucleusStructure &&
    (nucleusStructure.state === "ONE_NUCLEUS" ||
      nucleusStructure.state === "SEQUENTIAL_NUCLEI") &&
    authorityByClaim.nucleusStructure !== null
  ) {
    return true;
  }

  const movement = isRecordV0_1(value.movement) ? value.movement : null;
  if (
    movement &&
    (movement.state === "OBSERVED" || movement.state === "NOT_OBSERVED") &&
    authorityByClaim.movement !== null
  ) {
    return true;
  }

  const phoneticAnchors = isRecordV0_1(value.phoneticAnchors)
    ? value.phoneticAnchors
    : null;
  if (
    phoneticAnchors &&
    phoneticAnchors.state === "SUPPORTED" &&
    authorityByClaim.phoneticAnchors !== null
  ) {
    return true;
  }

  const voiceFamilyAnchors = isRecordV0_1(value.voiceFamilyAnchors)
    ? value.voiceFamilyAnchors
    : null;
  return (
    voiceFamilyAnchors?.state === "SUPPORTED" &&
    authorityByClaim.voiceFamilyAnchors !== null
  );
}

export function validateMovingNucleusObservationAuthorityV0_1(
  value: unknown,
  options: MovingNucleusObservationAuthorityValidationOptionsV0_1 = {},
): MovingNucleusObservationAuthorityValidationResultV0_1 {
  if (!isRecordV0_1(value)) return { ok: false, reasonCodes: ["INPUT_NOT_OBJECT"] };

  const reasons = new Set<MovingNucleusObservationAuthorityReasonCodeV0_1>();
  if (!hasExactKeysV0_1(value, TOP_LEVEL_KEYS_V0_1)) reasons.add("CLAIM_SHAPE_INVALID");
  if (value.schemaVersion !== MOVING_NUCLEUS_OBSERVATION_AUTHORITY_SCHEMA_V0_1) {
    reasons.add("SCHEMA_VERSION_INVALID");
  }
  if (!CLAIM_STATES_V0_1.has(value.aggregateStatus as MovingNucleusObservationClaimStateV0_1)) {
    addClaimShapeReasonV0_1(reasons);
  }
  if (
    value.canonicalizationStatus !== "not_authorized" &&
    value.canonicalizationStatus !== "unresolved" &&
    value.canonicalizationStatus !== "unsupported"
  ) {
    reasons.add("CANONICALIZATION_NOT_AUTHORIZED");
  }
  if (
    !Array.isArray(value.reasonCodes) ||
    value.reasonCodes.some((reason) => !REASON_CODE_SET_V0_1.has(String(reason)))
  ) {
    addClaimShapeReasonV0_1(reasons);
  }
  if (options.normalizedVoicePath && options.normalizedVoicePath.length > 0) {
    reasons.add("CANONICALIZATION_NOT_AUTHORIZED");
  }

  const authorityByClaim = isRecordV0_1(value.authorityByClaim)
    ? value.authorityByClaim
    : null;
  if (!authorityByClaim || !hasExactKeysV0_1(authorityByClaim, [
    "nucleusStructure",
    "movement",
    "phoneticAnchors",
    "voiceFamilyAnchors",
    "canonicalization",
  ])) {
    addClaimShapeReasonV0_1(reasons);
  }
  if (authorityByClaim?.canonicalization !== null) {
    reasons.add("CANONICALIZATION_NOT_AUTHORIZED");
  }

  const competingAuthorityCounts = validateCompetingAuthoritiesV0_1(
    value.competingAuthorities,
    reasons,
  );

  validateNucleusStructureV0_1(
    value.nucleusStructure,
    authorityByClaim?.nucleusStructure ?? null,
    reasons,
  );
  validateMovementV0_1(value.movement, authorityByClaim?.movement ?? null, reasons);
  validatePhoneticAnchorsV0_1(
    value.phoneticAnchors,
    authorityByClaim?.phoneticAnchors ?? null,
    reasons,
  );
  validateVoiceFamilyAnchorsV0_1(
    value.voiceFamilyAnchors,
    authorityByClaim?.voiceFamilyAnchors ?? null,
    reasons,
  );

  const conflictedClaimKeys = conflictedClaimKeysV0_1(value);
  const hasConflictedClaim = conflictedClaimKeys.length > 0;
  if (value.aggregateStatus === "SUPPORTED" && hasConflictedClaim) {
    reasons.add("SOURCE_SCOPE_CONFLICT");
  }

  for (const claimKey of conflictedClaimKeys) {
    if ((competingAuthorityCounts.get(claimKey) ?? 0) < 2) {
      reasons.add("SOURCE_SCOPE_CONFLICT");
    }
  }

  if (
    value.aggregateStatus === "SUPPORTED" &&
    !hasPositiveComponentClaimV0_1(value, authorityByClaim)
  ) {
    addClaimShapeReasonV0_1(reasons);
  }

  if (
    value.aggregateStatus === "CONFLICTED" &&
    (!hasConflictedClaim ||
      !Array.isArray(value.reasonCodes) ||
      !value.reasonCodes.includes("SOURCE_SCOPE_CONFLICT"))
  ) {
    reasons.add("SOURCE_SCOPE_CONFLICT");
  }

  const reasonCodes = sortedReasonsV0_1(reasons);
  if (reasonCodes.length > 0) return { ok: false, reasonCodes };

  return {
    ok: true,
    value: deepFreezeV0_1(
      cloneV0_1(value as MovingNucleusObservationAuthorityV0_1),
    ),
  };
}
