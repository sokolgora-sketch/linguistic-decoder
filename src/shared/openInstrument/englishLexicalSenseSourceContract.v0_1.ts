function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreeze(child);
  }

  return Object.freeze(value);
}

export const ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_ID_V0_1 =
  "OPEN_INSTRUMENT_ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_V0_1" as const;

export const ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_VERSION_V0_1 =
  "v0.1" as const;

export const ENGLISH_LEXICAL_SENSE_SOURCE_PROFILE_ID_V0_1 =
  "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1" as const;

export const ENGLISH_LEXICAL_SENSE_SOURCE_URL_V0_1 =
  "https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl" as const;

export const ENGLISH_LEXICAL_SENSE_SOURCE_UPSTREAM_DUMP_DATE_V0_1 =
  "2026-09-02" as const;

export const ENGLISH_LEXICAL_SENSE_SOURCE_KAIKKI_BUILD_DATE_V0_1 =
  "2026-10-03" as const;

// These are the short revisions published in the Kaikki build metadata. No
// full revision is reconstructed here.
export const ENGLISH_LEXICAL_SENSE_SOURCE_WIKTEXTRACT_REVISION_V0_1 =
  "1a05e46" as const;

export const ENGLISH_LEXICAL_SENSE_SOURCE_WIKITEXTPROCESSOR_REVISION_V0_1 =
  "e3d6d4e" as const;

export const ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1 =
  3335546346 as const;

export const ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1 =
  "9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195" as const;

export const ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1 = "English" as const;
export const ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1 = "en" as const;
export const ENGLISH_LEXICAL_SENSE_SOURCE_FORMAT_V0_1 =
  "POSTPROCESSED_JSONL" as const;

export const ENGLISH_LEXICAL_SENSE_SOURCE_ALLOWED_FIELDS_V0_1 = deepFreeze([
  "word",
  "lang",
  "lang_code",
  "pos",
  "senses[].id",
  "senses[].glosses",
  "senses[].tags",
  "senses[].raw_tags",
  "senses[].examples",
] as const);

export const ENGLISH_LEXICAL_SENSE_SOURCE_EXCLUDED_FIELDS_V0_1 = deepFreeze([
  "forms",
  "sounds",
  "translations",
  "etymology_links",
  "etymology_templates",
  "etymology_text",
  "derived",
  "descendants",
  "synonyms",
  "hypernyms",
  "meronyms",
  "related",
  "coordinate_terms",
  "provider_output",
  "functional_correspondence",
  "target_sense",
  "voice_path",
  "consonantal_configuration",
] as const);

export type EnglishLexicalSenseExampleV0_1 = Readonly<{
  text?: string;
  ref?: string;
  bold_text_offsets?: readonly (readonly [number, number])[];
  type?: string;
}>;

export type EnglishLexicalSenseV0_1 = Readonly<{
  id: string;
  glosses: readonly string[];
  tags?: readonly string[];
  raw_tags?: readonly string[];
  examples?: readonly EnglishLexicalSenseExampleV0_1[];
}>;

/**
 * A source-only projection of an English Kaikki JSONL record. It intentionally
 * has no target, Voice, consonantal, functional, or historical fields.
 */
export type EnglishLexicalSenseSourceRecordV0_1 = Readonly<{
  word: string;
  lang: typeof ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1;
  lang_code: typeof ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1;
  pos: string;
  senses: readonly EnglishLexicalSenseV0_1[];
}>;

export const ENGLISH_LEXICAL_SENSE_POLYSEMY_POLICY_V0_1 = deepFreeze({
  multipleEntriesPreserved: true,
  multiplePosPreserved: true,
  multipleSensesPreserved: true,
  sourceSenseOrderPreserved: true,
  primarySenseSelection: false,
  senseMerging: false,
  winnerSelection: false,
} as const);

export const ENGLISH_LEXICAL_SENSE_JOIN_KEY_POLICY_V0_1 = deepFreeze({
  operation:
    "NFC -> locale-independent English lowercase using en-US -> NFC",
  sourceField: "word",
  exactJoinOnly: true,
  formExpansion: false,
  trim: false,
  semanticNormalization: false,
  morphologicalNormalization: false,
  stemming: false,
  lemmatization: false,
  fuzzyMatching: false,
  phoneticMatching: false,
  translation: false,
  caseNormalizationCollisionsAreNotResolvedByThisContract: true,
} as const);

export function normalizeEnglishLexicalJoinKeyV0_1(sourceForm: string): string {
  return sourceForm
    .normalize("NFC")
    .toLocaleLowerCase("en-US")
    .normalize("NFC");
}

export const ENGLISH_LEXICAL_SENSE_MISSINGNESS_V0_1 = deepFreeze({
  reasonCode: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
  meaning:
    "No exact admitted source record was found under the frozen join key; it does not mean that the word has no meaning or function.",
  spellingFallback: false,
  semanticInference: false,
} as const);

export const ENGLISH_LEXICAL_SENSE_CONSTRUCTIVE_BLINDNESS_FORBIDDEN_INPUTS_V0_1 =
  deepFreeze([
    "canonical_voice_path",
    "voice_path",
    "gamma",
    "consonantal_configuration",
    "level_3",
    "math7",
    "candidate_ranking",
    "reviewed_rows",
    "control_labels",
    "manifestation_results",
] as const);

export const ENGLISH_LEXICAL_SENSE_AUTHORITY_FIREWALLS_V0_1 = deepFreeze({
  semanticSourceTextAvailable: true,
  functionalCorrespondenceAuthority: "NO",
  functionalOutcomeAuthority: "NO",
  wordSpecificFunctionAuthority: "NO",
  historicalOriginAuthority: "NO",
  consonantMeaningAuthority: "NO",
  manifestationAuthority: "NO",
  productionRuntimeAuthority: "NO",
  ipaToVoiceAuthority: "NO",
} as const);

export const ENGLISH_LEXICAL_SENSE_STORAGE_POLICY_V0_1 = deepFreeze({
  rawArtifactStorageStrategy: "EXTERNAL_HASH_BOUND_NOT_REPOSITORY_BUNDLED",
  artifactIdentity: "SHA256_BOUND",
  liveUrlImmutable: false,
  repositoryBundlingAuthorized: false,
  gitLfsAuthorized: false,
  derivedSemanticSliceAuthorized: false,
} as const);

export const ENGLISH_LEXICAL_SENSE_LICENSE_PROVENANCE_V0_1 = deepFreeze({
  sourceDataLicenseStatement:
    "Kaikki states that dictionary data is under the same licenses as Wiktionary.",
  wiktionaryDataLicenses: ["CC-BY-SA", "GFDL"],
  attributionRequired: true,
  wiktextractSoftwareLicense: "MIT",
  legalConclusion: false,
  acquisitionAuthorization: false,
} as const);

export const ENGLISH_LEXICAL_SENSE_REVIEWED_MEASUREMENTS_V0_1 = deepFreeze({
  rawJsonlRecords: 1492836,
  distinctRawWords: 1390507,
  distinctNormalizedForms: 1355933,
  totalSenses: 1787236,
  sensesWithUsableGloss: 1786128,
  normalizedFormsWithUsableSenseText: 1355265,
  normalizedFormsWithMultipleSenses: 187853,
  normalizedFormsWithMultiplePos: 86943,
  caseNormalizationCollisionKeys: 32094,
  normalizedKeysWithMultipleSourceRecords: 102996,
  eligibleCmuForms: 126031,
  matchedEligibleCmuForms: 94632,
  unmatchedEligibleCmuForms: 31399,
  eligibleCmuCoveragePercent: 75.0863,
} as const);

export const ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_V0_1 =
  deepFreeze({
    contractId:
      ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_ID_V0_1,
    version: ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_VERSION_V0_1,
    status: "FROZEN_SOURCE_AUTHORITY_CONTRACT_ONLY",
    sourceIdentity: {
      sourceFamily: "English Wiktionary -> Wiktextract -> Kaikki English JSONL",
      sourceProfileId: ENGLISH_LEXICAL_SENSE_SOURCE_PROFILE_ID_V0_1,
      language: ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1,
      languageCode: ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1,
      sourceUrl: ENGLISH_LEXICAL_SENSE_SOURCE_URL_V0_1,
      upstreamDumpDate: ENGLISH_LEXICAL_SENSE_SOURCE_UPSTREAM_DUMP_DATE_V0_1,
      kaikkiBuildDate: ENGLISH_LEXICAL_SENSE_SOURCE_KAIKKI_BUILD_DATE_V0_1,
      wiktextractRevision:
        ENGLISH_LEXICAL_SENSE_SOURCE_WIKTEXTRACT_REVISION_V0_1,
      wikitextprocessorRevision:
        ENGLISH_LEXICAL_SENSE_SOURCE_WIKITEXTPROCESSOR_REVISION_V0_1,
      format: ENGLISH_LEXICAL_SENSE_SOURCE_FORMAT_V0_1,
      artifactBytes: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1,
      artifactSha256: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
      artifactIdentity: "SHA256_BOUND",
      liveUrlImmutable: false,
    },
    sourceSurface: {
      allowedFields: ENGLISH_LEXICAL_SENSE_SOURCE_ALLOWED_FIELDS_V0_1,
      excludedFields: ENGLISH_LEXICAL_SENSE_SOURCE_EXCLUDED_FIELDS_V0_1,
      etymologyAuthority: "NO",
      semanticOutcomeAuthority: "NO",
    },
    polysemyPolicy: ENGLISH_LEXICAL_SENSE_POLYSEMY_POLICY_V0_1,
    joinKeyPolicy: ENGLISH_LEXICAL_SENSE_JOIN_KEY_POLICY_V0_1,
    missingness: ENGLISH_LEXICAL_SENSE_MISSINGNESS_V0_1,
    functionalExperimentUnitOfAnalysis: "UNRESOLVED_NOT_DEFINED_HERE",
    constructiveBlindness: {
      mode: "FROZEN_SOURCE_ONLY",
      forbiddenInputs:
        ENGLISH_LEXICAL_SENSE_CONSTRUCTIVE_BLINDNESS_FORBIDDEN_INPUTS_V0_1,
    },
    authorityFirewalls: ENGLISH_LEXICAL_SENSE_AUTHORITY_FIREWALLS_V0_1,
    storage: ENGLISH_LEXICAL_SENSE_STORAGE_POLICY_V0_1,
    licenseProvenance: ENGLISH_LEXICAL_SENSE_LICENSE_PROVENANCE_V0_1,
    reviewedMeasurements: ENGLISH_LEXICAL_SENSE_REVIEWED_MEASUREMENTS_V0_1,
    replay: {
      expectedBytes: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1,
      expectedSha256: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
      mismatchBehavior: "SOURCE_IDENTITY_MISMATCH_FAIL_CLOSED",
      silentSourceUpdate: false,
    },
    runtime: {
      adapterDefinedHere: false,
      apiWiringDefinedHere: false,
      uiWiringDefinedHere: false,
      productionPopulationDefinedHere: false,
      experimentRunnerDefinedHere: false,
    },
  } as const);

export type EnglishLexicalSenseSourceAuthorityContractV0_1 =
  typeof ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_V0_1;

export type EnglishLexicalSenseArtifactIdentityInputV0_1 = Readonly<{
  byteLength: number;
  sha256: string;
}>;

export type EnglishLexicalSenseArtifactIdentityResultV0_1 = Readonly<
  | {
      ok: true;
      reasonCodes: readonly [];
    }
  | {
      ok: false;
      reasonCodes: readonly ["SOURCE_IDENTITY_MISMATCH"];
      expected: Readonly<{
        byteLength: typeof ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1;
        sha256: typeof ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1;
      }>;
      observed: EnglishLexicalSenseArtifactIdentityInputV0_1;
    }
>;

export function validateEnglishLexicalSenseSourceArtifactIdentityV0_1(
  input: EnglishLexicalSenseArtifactIdentityInputV0_1,
): EnglishLexicalSenseArtifactIdentityResultV0_1 {
  const observed = Object.freeze({
    byteLength: input.byteLength,
    sha256: input.sha256,
  });

  if (
    input.byteLength === ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1 &&
    input.sha256 === ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1
  ) {
    return Object.freeze({
      ok: true,
      reasonCodes: Object.freeze([]) as readonly [],
    });
  }

  return Object.freeze({
    ok: false,
    reasonCodes: Object.freeze(["SOURCE_IDENTITY_MISMATCH"] as const),
    expected: Object.freeze({
      byteLength: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1,
      sha256: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
    }),
    observed,
  });
}
