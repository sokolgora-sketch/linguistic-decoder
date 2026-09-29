function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreeze(child);
  }

  return Object.freeze(value);
}

export const ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_ID_V0_1 =
  "OPEN_INSTRUMENT_ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1" as const;

export const ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_VERSION_V0_1 =
  "v0.1" as const;

export const ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1 =
  "open-instrument.wiktionary-kaikki-albanian-ipa.v0_1" as const;

export const ALBANIAN_PRONUNCIATION_SOURCE_URL_V0_1 =
  "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl" as const;

export const ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_SHA256_V0_1 =
  "7bd411e2b3cdfd83b7f09af9700791c01e81f36224ec5134e118ff26e83d0aa0" as const;

export const ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_BYTES_V0_1 =
  67438755 as const;

export const ALBANIAN_PRONUNCIATION_SCOPE_VALUES_V0_1 = [
  "STANDARD_EXPLICIT",
  "GHEG_EXPLICIT",
  "TOSK_EXPLICIT",
  "REGIONAL_EXPLICIT",
  "ALBANIAN_UNSPECIFIED",
] as const;

export type AlbanianPronunciationScopeV0_1 =
  (typeof ALBANIAN_PRONUNCIATION_SCOPE_VALUES_V0_1)[number];

export const ALBANIAN_PRONUNCIATION_SOURCE_LABELS_V0_1 = deepFreeze({
  STANDARD_EXPLICIT: ["standard", "Standard"],
  GHEG_EXPLICIT: ["Gheg"],
  TOSK_EXPLICIT: ["Tosk"],
  REGIONAL_EXPLICIT: [
    "Northern",
    "Southern",
    "Central",
    "Northeastern",
    "Northwestern",
    "Kosovo",
    "Cham",
    "Arbëresh",
    "Arvanitika",
  ],
  AMBIGUOUS: ["regional", "dialectal"],
} as const);

export const ALBANIAN_PRONUNCIATION_SOURCE_ALLOWED_FIELDS_V0_1 = deepFreeze([
  "lexical_form",
  "language",
  "language_code",
  "explicit_ipa",
  "sound_level_tags",
  "sound_level_notes",
  "variant_identity",
  "variant_order",
  "source_locator",
  "source_build_metadata",
  "license_attribution_metadata",
] as const);

export const ALBANIAN_PRONUNCIATION_SOURCE_EXCLUDED_FIELDS_V0_1 = deepFreeze([
  "definitions",
  "glosses",
  "translations",
  "etymologies",
  "examples",
  "semantic_fields",
  "audio_binaries",
  "unrelated_dictionary_metadata",
] as const);

export const ALBANIAN_PRONUNCIATION_NULL_REASON_CODES_V0_1 = deepFreeze([
  "PRONUNCIATION_NOT_FOUND",
  "DIALECT_SCOPE_UNRESOLVED",
  "PRONUNCIATION_VARIANT_AMBIGUOUS",
] as const);

export const ALBANIAN_PRONUNCIATION_VARIANT_POLICY_V0_1 = deepFreeze({
  oneIpaWithExplicitScope: "PRESERVE_SCOPED_PRONUNCIATION_CANDIDATE",
  multipleIpaWithSameExplicitScope: "PRESERVE_ALL_NO_WINNER",
  multipleIpaWithDifferentExplicitScopes: "PRESERVE_SEPARATE_SCOPED_CANDIDATES",
  labelledAndUnlabelled: "PRESERVE_BOTH_INDEPENDENTLY",
  unlabelledIpa: "ALBANIAN_UNSPECIFIED",
  genericAmbiguousMetadata: "PRESERVE_AMBIGUITY",
  noIpa: "PRONUNCIATION_NOT_FOUND",
  sourceLevelSingleWinnerSelection: "NO",
} as const);

export const ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1 = deepFreeze({
  contractId: ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_ID_V0_1,
  version: ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_VERSION_V0_1,
  status: "FROZEN_SOURCE_CONTRACT_ONLY",
  profileId: ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1,
  sourceIdentity: {
    upstreamProject: "English Wiktionary Albanian-language entries",
    sourceFamily: "English Wiktionary -> Wiktextract -> Kaikki Albanian JSONL",
    language: "Albanian",
    languageCode: "sq",
    sourceUrl: ALBANIAN_PRONUNCIATION_SOURCE_URL_V0_1,
    upstreamDumpDate: "2026-09-02",
    kaikkiBuildDate: "2026-09-25",
    wiktextractRevision:
      "1a05e46f9efbccda6a2b2f8e21b30a9c0c46513a",
    wikitextprocessorRevision:
      "e3d6d4edb77618f4d6680edc66e3f774bea59820",
    artifactSha256: ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_SHA256_V0_1,
    artifactBytes: ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_BYTES_V0_1,
    artifactIdentity: "SHA256_BOUND",
    liveUrlImmutable: false,
  },
  sourceSurface: {
    allowedFields: ALBANIAN_PRONUNCIATION_SOURCE_ALLOWED_FIELDS_V0_1,
    excludedFields: ALBANIAN_PRONUNCIATION_SOURCE_EXCLUDED_FIELDS_V0_1,
    audio: "EXCLUDED_FROM_V0_1_PRONUNCIATION_TEXT_ARTIFACT",
  },
  scopeModel: {
    values: ALBANIAN_PRONUNCIATION_SCOPE_VALUES_V0_1,
    unlabelledPolicy: "ALBANIAN_UNSPECIFIED",
    unlabelledIsStandard: false,
    entryOrSenseScopePropagation: false,
    orthographicDialectInference: false,
    regionalLabelsPreserved: true,
    genericRegionalLabelsRemainAmbiguous: true,
  },
  variantPolicy: ALBANIAN_PRONUNCIATION_VARIANT_POLICY_V0_1,
  nullPolicy: {
    reasonCodes: ALBANIAN_PRONUNCIATION_NULL_REASON_CODES_V0_1,
    nullIsValid: true,
    missingIpaIsNotFilledFromSpelling: true,
  },
  authorityBoundary: {
    sourceContractIsNotPronunciationToVoiceAuthority: true,
    sourceContractIsNotProductionRuntimeAuthority: true,
    sourceContractIsNotMovingNucleusAuthority: true,
    sourceContractIsNotG2pAuthority: true,
    ipaToVoiceMappingDefinedHere: false,
    runtimePronunciationLookupDefinedHere: false,
    productionPromotionDefinedHere: false,
    semanticAuthorityDefinedHere: false,
  },
  firewalls: {
    orthographicPronunciationAuthority: "NO",
    g2pAuthority: "NO",
    movingNucleusAuthority: "NOT_DEFINED_HERE",
    ipaToVoiceAuthority: "NOT_DEFINED_HERE",
    semanticAuthority: "NO",
    audioBundling: "NO",
    sourceReplacement: "NO",
  },
  licenseProvenance: {
    wiktionaryTextLicenses: ["CC_BY_SA_4_0", "GFDL"],
    wiktextractSoftwareLicense: "MIT",
    kaikkiDataLicense: "SAME_AS_WIKTIONARY",
    attributionRequired: true,
    sourceAndBuildMetadataRequired: true,
    audioRightsOutsideTextContract: true,
    legalAdvice: false,
  },
  durability: {
    artifactIdentityBySha256: true,
    liveUrlImmutable: false,
    completeKaikkiReplayProven: false,
    repositoryBundlingAuthorized: false,
  },
  reviewedMeasurements: {
    uniqueForms: 22980,
    ipaBearingForms: 6217,
    rawIpaObservations: 8099,
    multiVariantForms: 641,
    albanian200Unique: 188,
    albanian200WithIpa: 112,
    albanian200PresentWithoutIpa: 54,
    albanian200NotInSource: 22,
  },
} as const);

export type AlbanianPronunciationSourceContractV0_1 =
  typeof ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1;
