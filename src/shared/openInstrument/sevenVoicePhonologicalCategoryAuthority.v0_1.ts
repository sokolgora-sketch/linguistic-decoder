import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";

export const SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_SCHEMA_V0_1 =
  "open-instrument.seven-voice-phonological-category-authority.v0_1" as const;

export const SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_CONTRACT_ID_V0_1 =
  "OPEN_INSTRUMENT_SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_CONTRACT_V0_1" as const;

export const SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_VERSION_V0_1 =
  "v0.1" as const;

export const SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_STATUS_V0_1 =
  "FROZEN_CANONICAL_CATEGORY_QUANTIZER_ONLY" as const;

export const SEVEN_VOICE_VALUES_V0_1 = Object.freeze([
  "A",
  "E",
  "I",
  "O",
  "U",
  "Y",
  "Ë",
] as const);

export type SevenVoicePhonologicalCategoryV0_1 =
  | "HIGH_FRONT_UNROUNDED"
  | "HIGH_FRONT_ROUNDED"
  | "HIGH_BACK"
  | "MID_FRONT_UNROUNDED"
  | "CENTRAL_NON_CLOSE"
  | "MID_BACK"
  | "LOW_OPEN";

export const SEVEN_VOICE_PHONOLOGICAL_CATEGORY_VALUES_V0_1 = Object.freeze([
  "HIGH_FRONT_UNROUNDED",
  "HIGH_FRONT_ROUNDED",
  "HIGH_BACK",
  "MID_FRONT_UNROUNDED",
  "CENTRAL_NON_CLOSE",
  "MID_BACK",
  "LOW_OPEN",
] as const satisfies readonly SevenVoicePhonologicalCategoryV0_1[]);

export const SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1 = Object.freeze({
  HIGH_FRONT_UNROUNDED: "I",
  HIGH_FRONT_ROUNDED: "Y",
  HIGH_BACK: "U",
  MID_FRONT_UNROUNDED: "E",
  CENTRAL_NON_CLOSE: "Ë",
  MID_BACK: "O",
  LOW_OPEN: "A",
} as const satisfies Readonly<
  Record<SevenVoicePhonologicalCategoryV0_1, VowelVoice>
>);

export type SevenVoiceCategoryFoldV0_1 = Readonly<{
  id:
    | "OPEN_BASIN_TO_LOW_OPEN"
    | "FRONT_ROUNDED_TO_HIGH_FRONT_ROUNDED"
    | "BACK_HEIGHT_TO_BACK_CATEGORY"
    | "CENTRAL_CLOSE_TO_FRONT_CATEGORY"
    | "EXPLICIT_OPEN_BACK_UNROUNDED_EXCEPTION";
  rule: string;
  outputCategory: SevenVoicePhonologicalCategoryV0_1 | null;
  outputVoice: VowelVoice | null;
}>;

export const SEVEN_VOICE_CATEGORY_FOLDS_V0_1 = Object.freeze([
  Object.freeze({
    id: "OPEN_BASIN_TO_LOW_OPEN",
    rule: "open and near-open vowel qualities fold to LOW_OPEN regardless of backness or rounding",
    outputCategory: "LOW_OPEN",
    outputVoice: "A",
  }),
  Object.freeze({
    id: "FRONT_ROUNDED_TO_HIGH_FRONT_ROUNDED",
    rule: "front rounded vowel qualities fold to HIGH_FRONT_ROUNDED regardless of height",
    outputCategory: "HIGH_FRONT_ROUNDED",
    outputVoice: "Y",
  }),
  Object.freeze({
    id: "BACK_HEIGHT_TO_BACK_CATEGORY",
    rule: "back vowels are quantized by height and rounding does not create another Voice",
    outputCategory: null,
    outputVoice: null,
  }),
  Object.freeze({
    id: "CENTRAL_CLOSE_TO_FRONT_CATEGORY",
    rule: "close and near-close central unrounded qualities use HIGH_FRONT_UNROUNDED and central rounded qualities use HIGH_FRONT_ROUNDED",
    outputCategory: null,
    outputVoice: null,
  }),
  Object.freeze({
    id: "EXPLICIT_OPEN_BACK_UNROUNDED_EXCEPTION",
    rule: "ʌ is an explicit exception to the general back-unrounded treatment",
    outputCategory: "CENTRAL_NON_CLOSE",
    outputVoice: "Ë",
  }),
] as const satisfies readonly SevenVoiceCategoryFoldV0_1[]);

export const SEVEN_VOICE_SYMBOL_TO_CATEGORY_REFERENCE_V0_1 = Object.freeze({
  i: "HIGH_FRONT_UNROUNDED",
  ɪ: "HIGH_FRONT_UNROUNDED",
  y: "HIGH_FRONT_ROUNDED",
  ʏ: "HIGH_FRONT_ROUNDED",
  ø: "HIGH_FRONT_ROUNDED",
  œ: "HIGH_FRONT_ROUNDED",
  e: "MID_FRONT_UNROUNDED",
  ɛ: "MID_FRONT_UNROUNDED",
  ɨ: "HIGH_FRONT_UNROUNDED",
  ʉ: "HIGH_FRONT_ROUNDED",
  ɘ: "CENTRAL_NON_CLOSE",
  ə: "CENTRAL_NON_CLOSE",
  ɜ: "CENTRAL_NON_CLOSE",
  ɵ: "CENTRAL_NON_CLOSE",
  ɞ: "CENTRAL_NON_CLOSE",
  ʌ: "CENTRAL_NON_CLOSE",
  u: "HIGH_BACK",
  ʊ: "HIGH_BACK",
  ɯ: "HIGH_BACK",
  o: "MID_BACK",
  ɔ: "MID_BACK",
  ɤ: "MID_BACK",
  a: "LOW_OPEN",
  æ: "LOW_OPEN",
  ɑ: "LOW_OPEN",
  ɒ: "LOW_OPEN",
  ɐ: "LOW_OPEN",
  ɶ: "LOW_OPEN",
} as const satisfies Readonly<
  Record<string, SevenVoicePhonologicalCategoryV0_1>
>);

export const SEVEN_VOICE_ATOMIC_IPA_REWRITES_V0_1 = Object.freeze({
  ɚ: "ə",
  ɝ: "ɜ",
} as const);

export type SevenVoiceNonVoiceFeatureMetadataV0_1 = Readonly<{
  length: string | null;
  nasalization: string | null;
  stress: string | null;
  tone: string | null;
}>;

export const SEVEN_VOICE_NON_VOICE_FEATURE_POLICY_V0_1 = Object.freeze({
  length: "preserve as metadata; does not alter Voice identity",
  nasalization: "preserve as metadata; does not alter Voice identity",
  stress: "preserve as prosodic metadata; does not create a Voice event",
  tone: "preserve as prosodic metadata; does not alter Voice identity",
} as const);

export const SEVEN_VOICE_PHONOLOGICAL_CATEGORY_REASON_CODES_V0_1 = Object.freeze([
  "IPA_SYMBOL_NOT_QUANTIZABLE",
  "PHONOLOGICAL_CATEGORY_UNRESOLVED",
  "PROFILE_AUTHORITY_MISSING",
  "NUCLEUS_STRUCTURE_UNRESOLVED",
] as const);

export type SevenVoicePhonologicalCategoryReasonCodeV0_1 =
  (typeof SEVEN_VOICE_PHONOLOGICAL_CATEGORY_REASON_CODES_V0_1)[number];

export const SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_BOUNDARY_V0_1 =
  Object.freeze({
    canonicalCategoriesDefined: true,
    categoryToVoiceQuantizerDefined: true,
    rawIpaParsingDefined: false,
    dialectClassificationDefined: false,
    movingNucleusSegmentationDefined: false,
    g2pDefined: false,
    spellingAuthorityDefined: false,
    semanticAuthorityDefined: false,
    etymologicalAuthorityDefined: false,
    downstreamCanonicalizationDefined: false,
  } as const);

export const SEVEN_VOICE_LEGACY_IPA_MAP_STATUS_V0_1 = Object.freeze({
  status: "LEGACY_COARSE_BUCKET",
  authoritative: false,
  path: "src/shared/vowels/ipaVowelMap.v0.2.ts",
  callSiteMigration: false,
  replacementByThisContract: false,
} as const);

export const SEVEN_VOICE_ALBANIAN_REOPEN_POSTURE_V0_1 = Object.freeze({
  previousState: "NO_GO_UNDER_PRIOR_AUTHORITY_STATE",
  currentState: "REOPEN_CONDITION_SATISFIED_BY_NEW_DOCTRINE_AUTHORITY",
  bridgeDefined: false,
  runtimeWiringDefined: false,
} as const);

export const SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_V0_1 = Object.freeze({
  schemaVersion: SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_SCHEMA_V0_1,
  contractId: SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_CONTRACT_ID_V0_1,
  version: SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_VERSION_V0_1,
  status: SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_STATUS_V0_1,
  canonicalVoices: SEVEN_VOICE_VALUES_V0_1,
  categories: SEVEN_VOICE_PHONOLOGICAL_CATEGORY_VALUES_V0_1,
  categoryToVoice: SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1,
  folds: SEVEN_VOICE_CATEGORY_FOLDS_V0_1,
  symbolReference: SEVEN_VOICE_SYMBOL_TO_CATEGORY_REFERENCE_V0_1,
  atomicIpaRewrites: SEVEN_VOICE_ATOMIC_IPA_REWRITES_V0_1,
  nonVoiceFeaturePolicy: SEVEN_VOICE_NON_VOICE_FEATURE_POLICY_V0_1,
  reasonCodes: SEVEN_VOICE_PHONOLOGICAL_CATEGORY_REASON_CODES_V0_1,
  authorityBoundary: SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_BOUNDARY_V0_1,
  legacyIpaMap: SEVEN_VOICE_LEGACY_IPA_MAP_STATUS_V0_1,
  albanianReopenPosture: SEVEN_VOICE_ALBANIAN_REOPEN_POSTURE_V0_1,
} as const);

export type SevenVoiceReferenceClassificationV0_1 = Readonly<
  | {
      status: "SUPPORTED";
      rawSymbol: string;
      normalizedSymbol: string;
      category: SevenVoicePhonologicalCategoryV0_1;
      voice: VowelVoice;
      reasonCode: null;
    }
  | {
      status: "NULL";
      rawSymbol: string;
      normalizedSymbol: string;
      category: null;
      voice: null;
      reasonCode: "IPA_SYMBOL_NOT_QUANTIZABLE";
    }
>;

export function quantizeSevenVoicePhonologicalCategoryV0_1(
  category: SevenVoicePhonologicalCategoryV0_1,
): VowelVoice {
  return SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1[category];
}

export function classifyReferenceIpaSymbolV0_1(
  symbol: string,
): SevenVoiceReferenceClassificationV0_1 {
  const normalizedSymbol =
    SEVEN_VOICE_ATOMIC_IPA_REWRITES_V0_1[symbol as keyof typeof SEVEN_VOICE_ATOMIC_IPA_REWRITES_V0_1] ??
    symbol;
  const category =
    SEVEN_VOICE_SYMBOL_TO_CATEGORY_REFERENCE_V0_1[
      normalizedSymbol as keyof typeof SEVEN_VOICE_SYMBOL_TO_CATEGORY_REFERENCE_V0_1
    ];

  if (!category) {
    return Object.freeze({
      status: "NULL",
      rawSymbol: symbol,
      normalizedSymbol,
      category: null,
      voice: null,
      reasonCode: "IPA_SYMBOL_NOT_QUANTIZABLE",
    });
  }

  return Object.freeze({
    status: "SUPPORTED",
    rawSymbol: symbol,
    normalizedSymbol,
    category,
    voice: quantizeSevenVoicePhonologicalCategoryV0_1(category),
    reasonCode: null,
  });
}

export function quantizeWithNonVoiceFeaturesV0_1(
  category: SevenVoicePhonologicalCategoryV0_1,
  features: SevenVoiceNonVoiceFeatureMetadataV0_1,
): Readonly<{ voice: VowelVoice; features: SevenVoiceNonVoiceFeatureMetadataV0_1 }> {
  return Object.freeze({
    voice: quantizeSevenVoicePhonologicalCategoryV0_1(category),
    features,
  });
}
