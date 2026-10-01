import {
  ALBANIAN_PRONUNCIATION_SCOPE_VALUES_V0_1,
  ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1,
  type AlbanianPronunciationProfileQualifierV0_1,
  type AlbanianPronunciationScopeV0_1,
} from "./albanianPronunciationSourceContract.v0_1";

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreeze(child);
  }

  return Object.freeze(value);
}

export const ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_SCHEMA_V0_1 =
  "open-instrument.albanian-phonological-nucleus-authority.v0_1" as const;

export const ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_ID_V0_1 =
  "OPEN_INSTRUMENT_ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1" as const;

export const ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_VERSION_V0_1 =
  "v0.1" as const;

export const ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_STATUS_V0_1 =
  "FROZEN_PRE_VOICE_AUTHORITY_CONTRACT_ONLY" as const;

export const ALBANIAN_PHONOLOGICAL_NOTATION_KINDS_V0_1 = [
  "PHONEMIC",
  "PHONETIC",
  "UNSPECIFIED",
] as const;

export type AlbanianPhonologicalNotationKindV0_1 =
  (typeof ALBANIAN_PHONOLOGICAL_NOTATION_KINDS_V0_1)[number];

export const ALBANIAN_PHONOLOGICAL_CATEGORY_VALUES_V0_1 = [
  "HIGH_FRONT_UNROUNDED",
  "HIGH_FRONT_ROUNDED",
  "HIGH_BACK_ROUNDED",
  "MID_FRONT_UNROUNDED",
  "CENTRAL_MID",
  "MID_BACK_ROUNDED",
  "LOW_CENTRAL_OR_BACK",
] as const;

export type AlbanianPhonologicalCategoryV0_1 =
  (typeof ALBANIAN_PHONOLOGICAL_CATEGORY_VALUES_V0_1)[number];

export const ALBANIAN_NUCLEUS_STRUCTURE_VALUES_V0_1 = [
  "MONOPHTHONG_NUCLEUS",
  "EVIDENCE_QUALIFIED_MOVING_NUCLEUS",
  "SEQUENTIAL_NUCLEI",
  "GLIDE_PLUS_NUCLEUS",
  "NUCLEUS_PLUS_GLIDE",
  "UNRESOLVED_NUCLEUS_STRUCTURE",
] as const;

export type AlbanianNucleusStructureV0_1 =
  (typeof ALBANIAN_NUCLEUS_STRUCTURE_VALUES_V0_1)[number];

export const ALBANIAN_PHONOLOGICAL_LENGTH_VALUES_V0_1 = [
  "NONE_RECORDED",
  "SHORT",
  "HALF_LONG",
  "LONG",
  "UNKNOWN",
] as const;

export type AlbanianPhonologicalLengthV0_1 =
  (typeof ALBANIAN_PHONOLOGICAL_LENGTH_VALUES_V0_1)[number];

export const ALBANIAN_PHONOLOGICAL_NASALIZATION_VALUES_V0_1 = [
  "NOT_RECORDED",
  "PRESENT",
  "ABSENT",
  "UNKNOWN",
] as const;

export type AlbanianPhonologicalNasalizationV0_1 =
  (typeof ALBANIAN_PHONOLOGICAL_NASALIZATION_VALUES_V0_1)[number];

export const ALBANIAN_PHONOLOGICAL_NUCLEUS_REASON_CODES_V0_1 = [
  "PHONOLOGICAL_CATEGORY_UNRESOLVED",
  // Reused exactly from the existing observation-authority vocabulary.
  "NUCLEUS_STRUCTURE_UNRESOLVED",
  "PROFILE_AUTHORITY_MISSING",
  "NOTATION_AUTHORITY_MISSING",
  "SYMBOL_AUTHORITY_MISSING",
  "CONFLICTING_PHONOLOGICAL_EVIDENCE",
  // Reused exactly from the existing observation-authority vocabulary.
  "PLAIN_IPA_ADJACENCY_INSUFFICIENT",
  "AUTHORITY_REFERENCE_MISSING",
] as const;

export type AlbanianPhonologicalNucleusReasonCodeV0_1 =
  (typeof ALBANIAN_PHONOLOGICAL_NUCLEUS_REASON_CODES_V0_1)[number];

export type AlbanianPhonologicalNucleusObservationV0_1 = Readonly<{
  schemaVersion: typeof ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_SCHEMA_V0_1;
  sourceProfileId: typeof ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1;
  rawIpa: string;
  notationKind: AlbanianPhonologicalNotationKindV0_1;
  sourceScope: AlbanianPronunciationScopeV0_1;
  phonologicalCategory: AlbanianPhonologicalCategoryV0_1 | null;
  nucleusStructure: AlbanianNucleusStructureV0_1;
  features: Readonly<{
    length: AlbanianPhonologicalLengthV0_1;
    nasalization: AlbanianPhonologicalNasalizationV0_1;
  }>;
  authorityRefs: readonly string[];
  reasonCodes: readonly AlbanianPhonologicalNucleusReasonCodeV0_1[];
  status: "SUPPORTED" | "UNRESOLVED";
}>;

export type AlbanianPhonologicalNucleusValidationResultV0_1 = Readonly<
  | { ok: true; value: AlbanianPhonologicalNucleusObservationV0_1 }
  | {
      ok: false;
      reasonCodes: readonly AlbanianPhonologicalNucleusReasonCodeV0_1[];
    }
>;

export const ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_EVIDENCE_REFS_V0_1 =
  deepFreeze([
    "ICPhS-2003-THE-VOWELS-OF-STANDARD-ALBANIAN",
    "JIPA-NORTHERN-TOSK-ALBANIAN",
    "PHON-2022-2025-SOUTHERN-GHEG-VOWELS",
    "GRANSER-MOOSMULLER-2001-SCHWA-IN-ALBANIAN",
    "UT-AUSTIN-INTRODUCTION-TO-ALBANIAN",
    "CAMBRIDGE-BALKAN-LANGUAGES-PHONOLOGY",
  ] as const);

export const ALBANIAN_PROFILE_EXPANSION_CATEGORY_RULES_V0_1 = deepFreeze({
  NORTHERN_TOSK_EXPLICIT: {
    phonemic: {
      i: "HIGH_FRONT_UNROUNDED",
      y: "HIGH_FRONT_ROUNDED",
      u: "HIGH_BACK_ROUNDED",
      e: "MID_FRONT_UNROUNDED",
      "ɜ": "CENTRAL_MID",
      "ɔ": "MID_BACK_ROUNDED",
      a: "LOW_CENTRAL_OR_BACK",
    },
    phoneticRelations: {
      e: "MID_FRONT_UNROUNDED",
      "ɔ": "MID_BACK_ROUNDED",
      ʏ: "HIGH_FRONT_ROUNDED",
      ä: "LOW_CENTRAL_OR_BACK",
      ɑ: "LOW_CENTRAL_OR_BACK",
    },
    authorityRef: "JIPA-NORTHERN-TOSK-ALBANIAN",
  },
  SOUTHERN_GHEG_EXPLICIT: {
    phonemic: {
      i: "HIGH_FRONT_UNROUNDED",
      y: "HIGH_FRONT_ROUNDED",
      u: "HIGH_BACK_ROUNDED",
      e: "MID_FRONT_UNROUNDED",
      o: "MID_BACK_ROUNDED",
      a: "LOW_CENTRAL_OR_BACK",
    },
    phoneticRelations: {},
    authorityRef: "PHON-2022-2025-SOUTHERN-GHEG-VOWELS",
  },
} as const);

export const ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1 =
  deepFreeze({
    contractId: ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_ID_V0_1,
    version: ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_VERSION_V0_1,
    status: ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_STATUS_V0_1,
    schemaVersion: ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_SCHEMA_V0_1,
    sourceDependency: {
      profileId: ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1,
      scopes: ALBANIAN_PRONUNCIATION_SCOPE_VALUES_V0_1,
      exactProfileQualifiers: [
        "NORTHERN_TOSK_EXPLICIT",
        "SOUTHERN_GHEG_EXPLICIT",
      ] as const satisfies readonly AlbanianPronunciationProfileQualifierV0_1[],
      exactProfileQualifierDerivation: "DIRECT_SOUND_TAG_CONJUNCTION_ONLY",
      unspecifiedIsNotStandard: true,
      orthographicDialectInference: false,
      meaningDialectInference: false,
      geographyOnlyDialectInference: false,
    },
    evidenceModel: {
      rawIpaPreserved: true,
      notationKindRequired: true,
      sourceScopeRequired: true,
      phonologicalCategoryIsProfileScoped: true,
      nucleusStructureIsProfileScoped: true,
      featuresPreserved: true,
      authorityRefsRequiredForPositiveClaims: true,
      sourceObservationIsNotPhonologicalAuthority: true,
      phonologicalAuthorityIsNotVoiceAuthority: true,
    },
    notationKinds: ALBANIAN_PHONOLOGICAL_NOTATION_KINDS_V0_1,
    phonologicalCategories: ALBANIAN_PHONOLOGICAL_CATEGORY_VALUES_V0_1,
    nucleusStructures: ALBANIAN_NUCLEUS_STRUCTURE_VALUES_V0_1,
    featurePolicies: {
      length: "PROFILE_DEPENDENT_PRESERVE_WITHOUT_STRIPPING",
      nasalization: "PROFILE_DEPENDENT_PRESERVE_WITHOUT_STRIPPING",
    },
    symbolPolicy: {
      universalSymbolTable: false,
      sourceIpaIsNotAutomaticCategory: true,
      profileSpecificInterpretationRequired: true,
      unsupportedSymbolsRemainUnresolved: true,
      exactProfileExpansionRules: ALBANIAN_PROFILE_EXPANSION_CATEGORY_RULES_V0_1,
      reviewedObservations: {
        a: "profile-scoped core low-vowel evidence",
        ä: "phonetic realization evidence; not a universal category",
        ɑ: "phonetic realization evidence; not a universal category",
        e: "profile-scoped core front-vowel evidence",
        "ə": "profile-scoped central-vowel evidence",
        ɜ: "Northern-Tosk profile-specific central-vowel evidence",
        i: "profile-scoped core high-front evidence",
        o: "profile/notation-dependent back-mid evidence",
        ɔ: "profile/notation-dependent back-mid evidence",
        u: "profile-scoped core high-back evidence",
        y: "profile-scoped core high-front-rounded evidence",
        ʏ: "Northern-Tosk phonetic realization evidence for /y/",
      },
    },
    nucleusPolicy: {
      rawAdjacencyAuthority: false,
      adjacentVowelsRequireReviewedStructureEvidence: true,
      conflictingEvidence: "UNRESOLVED_NUCLEUS_STRUCTURE",
      plainIpaAdjacencyReason: "PLAIN_IPA_ADJACENCY_INSUFFICIENT",
      movingNucleusAuthorityDefinedHere: false,
      sequentialNucleusAuthorityDefinedHere: false,
    },
    glidePolicy: {
      jAdjacencyAuthority: false,
      wAdjacencyAuthority: false,
      jMayBeConsonantalApproximantWithProfileAuthority: true,
      wRemainsUnresolvedWithoutExplicitAuthority: true,
      complexNucleusFromAdjacency: false,
    },
    southernGhegPolicy: {
      documentedProfileConditionedMonophthongization: ["ie", "ye", "ua", "ue"],
      universalStringRewrite: false,
      lexicalOrProfileAuthorityRequired: true,
    },
    observationAuthorityReuse: {
      result: "REUSE_WITH_NEW_SOURCE_PROFILE",
      existingSchema: "open-instrument.moving-nucleus-observation-authority.v0_1",
      phonologicalClaimClass: "PHONOLOGICALLY_DOCUMENTED",
      notationClaimClass: "TRANSCRIPTION_ASSERTED",
      existingValidatorModified: false,
      existingCanonicalizerInvoked: false,
    },
    authorityBoundary: {
      canonicalizationAuthorized: false,
      voiceFamilyAnchorsDefined: false,
      ipaToVoiceMappingDefined: false,
      canonicalVoiceEventsDefined: false,
      semanticAuthorityDefined: false,
      runtimeIntegrationDefined: false,
      g2pAuthorityDefined: false,
      orthographicPronunciationAuthority: false,
    },
    reasonCodes: ALBANIAN_PHONOLOGICAL_NUCLEUS_REASON_CODES_V0_1,
    evidenceRefs: ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_EVIDENCE_REFS_V0_1,
  } as const);

const SCOPE_VALUES = new Set<string>(ALBANIAN_PRONUNCIATION_SCOPE_VALUES_V0_1);
const NOTATION_VALUES = new Set<string>(ALBANIAN_PHONOLOGICAL_NOTATION_KINDS_V0_1);
const CATEGORY_VALUES = new Set<string>(ALBANIAN_PHONOLOGICAL_CATEGORY_VALUES_V0_1);
const STRUCTURE_VALUES = new Set<string>(ALBANIAN_NUCLEUS_STRUCTURE_VALUES_V0_1);
const LENGTH_VALUES = new Set<string>(ALBANIAN_PHONOLOGICAL_LENGTH_VALUES_V0_1);
const NASALIZATION_VALUES = new Set<string>(
  ALBANIAN_PHONOLOGICAL_NASALIZATION_VALUES_V0_1,
);
const REASON_VALUES = new Set<string>(ALBANIAN_PHONOLOGICAL_NUCLEUS_REASON_CODES_V0_1);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function sortedReasons(
  reasons: Iterable<AlbanianPhonologicalNucleusReasonCodeV0_1>,
): readonly AlbanianPhonologicalNucleusReasonCodeV0_1[] {
  return [...new Set(reasons)].sort();
}

export function validateAlbanianPhonologicalNucleusObservationV0_1(
  input: unknown,
): AlbanianPhonologicalNucleusValidationResultV0_1 {
  const reasons = new Set<AlbanianPhonologicalNucleusReasonCodeV0_1>();

  if (!isRecord(input)) {
    return { ok: false, reasonCodes: ["PROFILE_AUTHORITY_MISSING"] };
  }

  if (input.schemaVersion !== ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_SCHEMA_V0_1) {
    reasons.add("NOTATION_AUTHORITY_MISSING");
  }
  if (input.sourceProfileId !== ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1) {
    reasons.add("PROFILE_AUTHORITY_MISSING");
  }
  if (!isNonEmptyString(input.rawIpa)) reasons.add("SYMBOL_AUTHORITY_MISSING");
  if (!NOTATION_VALUES.has(String(input.notationKind))) {
    reasons.add("NOTATION_AUTHORITY_MISSING");
  }
  if (!SCOPE_VALUES.has(String(input.sourceScope))) {
    reasons.add("PROFILE_AUTHORITY_MISSING");
  }
  if (
    input.phonologicalCategory !== null &&
    !CATEGORY_VALUES.has(String(input.phonologicalCategory))
  ) {
    reasons.add("PHONOLOGICAL_CATEGORY_UNRESOLVED");
  }
  if (!STRUCTURE_VALUES.has(String(input.nucleusStructure))) {
    reasons.add("NUCLEUS_STRUCTURE_UNRESOLVED");
  }

  const features = isRecord(input.features) ? input.features : null;
  if (!features || !LENGTH_VALUES.has(String(features.length))) {
    reasons.add("PHONOLOGICAL_CATEGORY_UNRESOLVED");
  }
  if (!features || !NASALIZATION_VALUES.has(String(features.nasalization))) {
    reasons.add("PHONOLOGICAL_CATEGORY_UNRESOLVED");
  }

  const authorityRefs = isStringArray(input.authorityRefs)
    ? input.authorityRefs.filter((ref) => ref.trim().length > 0)
    : [];
  const hasPositiveClaim =
    input.phonologicalCategory !== null ||
    input.nucleusStructure !== "UNRESOLVED_NUCLEUS_STRUCTURE";
  if (hasPositiveClaim && authorityRefs.length === 0) {
    reasons.add("AUTHORITY_REFERENCE_MISSING");
  }

  if (input.status !== "SUPPORTED" && input.status !== "UNRESOLVED") {
    reasons.add("PHONOLOGICAL_CATEGORY_UNRESOLVED");
  }
  if (input.status === "SUPPORTED" && !hasPositiveClaim) {
    reasons.add("PHONOLOGICAL_CATEGORY_UNRESOLVED");
  }
  if (!Array.isArray(input.reasonCodes)) {
    reasons.add("PHONOLOGICAL_CATEGORY_UNRESOLVED");
  } else {
    for (const reason of input.reasonCodes) {
      if (!REASON_VALUES.has(String(reason))) {
        reasons.add("PHONOLOGICAL_CATEGORY_UNRESOLVED");
      }
    }
  }

  if (reasons.size > 0) {
    return { ok: false, reasonCodes: sortedReasons(reasons) };
  }

  return {
    ok: true,
    value: deepFreeze({
      schemaVersion: input.schemaVersion,
      sourceProfileId: input.sourceProfileId,
      rawIpa: input.rawIpa,
      notationKind: input.notationKind,
      sourceScope: input.sourceScope,
      phonologicalCategory: input.phonologicalCategory,
      nucleusStructure: input.nucleusStructure,
      features: input.features,
      authorityRefs: [...authorityRefs],
      reasonCodes: [...(input.reasonCodes as AlbanianPhonologicalNucleusReasonCodeV0_1[])],
      status: input.status,
    } as AlbanianPhonologicalNucleusObservationV0_1),
  };
}

export type AlbanianPhonologicalNucleusAuthorityContractV0_1 =
  typeof ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1;
