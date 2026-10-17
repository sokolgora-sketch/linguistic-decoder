import { classifyIpaSegmentsV0_1 } from "@/shared/ipa/ipaClassify.v0.1";
import { normalizeIpaV0_1 } from "@/shared/ipa/ipaNormalize.v0.1";
import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";

import {
  classifyReferenceIpaSymbolV0_1,
  SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_CONTRACT_ID_V0_1,
  type SevenVoicePhonologicalCategoryV0_1,
} from "./sevenVoicePhonologicalCategoryAuthority.v0_1";
import type {
  AlbanianKaikkiExactLexicalSourceFactV0_1,
  AlbanianKaikkiExactLexicalSourceIpaObservationV0_1,
} from "./albanianKaikkiServerOnlyExactLexicalSource.v0_1";

export const ALBANIAN_KAIKKI_SOURCE_IPA_SEVEN_VOICE_PRODUCT_INTERPRETATION_SCHEMA_V0_1 =
  "open-instrument.albanian-kaikki-source-ipa-seven-voice-product-interpretation.v0_1" as const;

export const ALBANIAN_KAIKKI_SOURCE_IPA_SEVEN_VOICE_PRODUCT_INTERPRETATION_ID_V0_1 =
  "ALBANIAN_KAIKKI_SOURCE_IPA_SEVEN_VOICE_PRODUCT_INTERPRETATION_V0_1" as const;

export const ALBANIAN_KAIKKI_SOURCE_IPA_SEVEN_VOICE_PRODUCT_INTERPRETATION_AUTHORITY_BOUNDARY_V0_1 =
  "CURRENT_KAIKKI_IPA_SOURCE_DERIVED_PRODUCT_INTERPRETATION_NOT_FROZEN_PRONUNCIATION_AUTHORITY" as const;

export type AlbanianKaikkiSourceIpaSevenVoiceProductReasonCodeV0_1 =
  | "IPA_OBSERVATION_MISSING"
  | "NO_VOWEL_NUCLEUS"
  | "PLAIN_IPA_ADJACENCY_INSUFFICIENT"
  | "NUCLEUS_STRUCTURE_UNRESOLVED"
  | "IPA_SYMBOL_NOT_QUANTIZABLE";

export type AlbanianKaikkiSourceIpaSevenVoiceNucleusV0_1 = Readonly<{
  order: number;
  raw: string;
  baseSymbol: string;
  combiningMarks: readonly string[];
  category: SevenVoicePhonologicalCategoryV0_1 | null;
  voice: VowelVoice | null;
  status: "SUPPORTED" | "NULL";
  reasonCodes: readonly AlbanianKaikkiSourceIpaSevenVoiceProductReasonCodeV0_1[];
}>;

export type AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1 = Readonly<{
  schemaVersion: typeof ALBANIAN_KAIKKI_SOURCE_IPA_SEVEN_VOICE_PRODUCT_INTERPRETATION_SCHEMA_V0_1;
  interpretationId: typeof ALBANIAN_KAIKKI_SOURCE_IPA_SEVEN_VOICE_PRODUCT_INTERPRETATION_ID_V0_1;
  status: "SUPPORTED" | "NULL";
  authorityBoundary: typeof ALBANIAN_KAIKKI_SOURCE_IPA_SEVEN_VOICE_PRODUCT_INTERPRETATION_AUTHORITY_BOUNDARY_V0_1;
  sourcePronunciationAuthority: AlbanianKaikkiExactLexicalSourceFactV0_1["pronunciationAuthority"];
  sourceRecordId: string;
  entryLocator: string;
  physicalRecordOrdinal: number;
  form: string;
  soundIndex: number;
  tags: readonly string[];
  rawIpa: string | null;
  pronunciationBody: string | null;
  notationKind: "PHONEMIC" | "PHONETIC" | "UNSPECIFIED" | "NULL";
  nonVoiceFeatures: Readonly<{
    stressMarkers: readonly string[];
    lengthMarkers: readonly string[];
    nasalizationMarks: readonly string[];
  }>;
  nucleusStructure:
    | "MONOPHTHONG_NUCLEUS"
    | "SEQUENTIAL_NUCLEI"
    | "UNRESOLVED_NUCLEUS_STRUCTURE"
    | "NULL";
  nuclei: readonly AlbanianKaikkiSourceIpaSevenVoiceNucleusV0_1[];
  voicePath: readonly VowelVoice[];
  reasonCodes: readonly AlbanianKaikkiSourceIpaSevenVoiceProductReasonCodeV0_1[];
  authorityRefs: readonly string[];
  sourceSnapshot: AlbanianKaikkiExactLexicalSourceFactV0_1["sourceSnapshot"];
}>;

const STRESS_MARKERS_V0_1 = new Set(["ˈ", "ˌ"]);
const LENGTH_MARKERS_V0_1 = new Set(["ː", "ˑ"]);
const NASALIZATION_MARK_V0_1 = "\u0303";

function sortedReasonsV0_1(
  reasons: readonly AlbanianKaikkiSourceIpaSevenVoiceProductReasonCodeV0_1[],
): readonly AlbanianKaikkiSourceIpaSevenVoiceProductReasonCodeV0_1[] {
  return Object.freeze([...new Set(reasons)].sort());
}

function notationAndBodyV0_1(rawIpa: string): Readonly<{
  notationKind: "PHONEMIC" | "PHONETIC" | "UNSPECIFIED";
  body: string;
}> {
  const trimmed = rawIpa.trim();
  if (trimmed.length >= 2 && trimmed.startsWith("/") && trimmed.endsWith("/")) {
    return Object.freeze({ notationKind: "PHONEMIC", body: trimmed.slice(1, -1).trim() });
  }
  if (trimmed.length >= 2 && trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return Object.freeze({ notationKind: "PHONETIC", body: trimmed.slice(1, -1).trim() });
  }
  return Object.freeze({ notationKind: "UNSPECIFIED", body: trimmed });
}

function nonVoiceFeaturesV0_1(rawIpa: string): AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1["nonVoiceFeatures"] {
  const decomposed = rawIpa.normalize("NFD");
  return Object.freeze({
    stressMarkers: Object.freeze([...decomposed].filter((character) => STRESS_MARKERS_V0_1.has(character))),
    lengthMarkers: Object.freeze([...decomposed].filter((character) => LENGTH_MARKERS_V0_1.has(character))),
    nasalizationMarks: Object.freeze([...decomposed].filter((character) => character === NASALIZATION_MARK_V0_1)),
  });
}

function combiningMarksV0_1(raw: string): readonly string[] {
  return Object.freeze([...raw.normalize("NFD")].slice(1));
}

function hasAdjacentVowelSegmentsV0_1(
  segments: readonly ReturnType<typeof classifyIpaSegmentsV0_1>[number][],
): boolean {
  return segments.some(
    (segment, index) => segment.cls === "vowel" && segments[index + 1]?.cls === "vowel",
  );
}

function hasAdjacentGlideVowelV0_1(
  segments: readonly ReturnType<typeof classifyIpaSegmentsV0_1>[number][],
): boolean {
  return segments.some((segment, index) => {
    if (segment.cls !== "vowel") return false;
    const previous = segments[index - 1]?.base;
    const next = segments[index + 1]?.base;
    return previous === "j" || previous === "w" || next === "j" || next === "w";
  });
}

function projectObservationV0_1(
  fact: AlbanianKaikkiExactLexicalSourceFactV0_1,
  observation: AlbanianKaikkiExactLexicalSourceIpaObservationV0_1,
): AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1 {
  const base = {
    schemaVersion: ALBANIAN_KAIKKI_SOURCE_IPA_SEVEN_VOICE_PRODUCT_INTERPRETATION_SCHEMA_V0_1,
    interpretationId: ALBANIAN_KAIKKI_SOURCE_IPA_SEVEN_VOICE_PRODUCT_INTERPRETATION_ID_V0_1,
    authorityBoundary: ALBANIAN_KAIKKI_SOURCE_IPA_SEVEN_VOICE_PRODUCT_INTERPRETATION_AUTHORITY_BOUNDARY_V0_1,
    sourcePronunciationAuthority: fact.pronunciationAuthority,
    sourceRecordId: fact.sourceRecordId,
    entryLocator: fact.entryLocator,
    physicalRecordOrdinal: fact.physicalRecordOrdinal,
    form: fact.form,
    soundIndex: observation.soundIndex,
    tags: Object.freeze([...observation.tags]),
    rawIpa: observation.ipa,
    sourceSnapshot: fact.sourceSnapshot,
  };

  if (observation.ipa === null) {
    return Object.freeze({
      ...base,
      status: "NULL",
      pronunciationBody: null,
      notationKind: "NULL",
      nonVoiceFeatures: Object.freeze({
        stressMarkers: Object.freeze([]),
        lengthMarkers: Object.freeze([]),
        nasalizationMarks: Object.freeze([]),
      }),
      nucleusStructure: "NULL",
      nuclei: Object.freeze([]),
      voicePath: Object.freeze([]),
      reasonCodes: Object.freeze(["IPA_OBSERVATION_MISSING" as const]),
      authorityRefs: Object.freeze([]),
    });
  }

  const notation = notationAndBodyV0_1(observation.ipa);
  const body = normalizeIpaV0_1(notation.body);
  const segments = classifyIpaSegmentsV0_1(body);
  const vowelSegments = segments.filter((segment) => segment.cls === "vowel");
  const adjacentVowels = hasAdjacentVowelSegmentsV0_1(segments);
  const adjacentGlide = hasAdjacentGlideVowelV0_1(segments);
  const structureReasons: AlbanianKaikkiSourceIpaSevenVoiceProductReasonCodeV0_1[] = [];
  if (vowelSegments.length === 0) structureReasons.push("NO_VOWEL_NUCLEUS");
  if (adjacentVowels) structureReasons.push("PLAIN_IPA_ADJACENCY_INSUFFICIENT");
  if (adjacentVowels || adjacentGlide) structureReasons.push("NUCLEUS_STRUCTURE_UNRESOLVED");

  const nuclei = vowelSegments.map((segment, order) => {
    const classification = classifyReferenceIpaSymbolV0_1(segment.base);
    const reasons = sortedReasonsV0_1([
      ...structureReasons,
      ...(classification.status === "NULL" ? ["IPA_SYMBOL_NOT_QUANTIZABLE" as const] : []),
    ]);
    return Object.freeze({
      order,
      raw: segment.raw,
      baseSymbol: segment.base,
      combiningMarks: combiningMarksV0_1(segment.raw),
      category: reasons.length === 0 && classification.status === "SUPPORTED"
        ? classification.category
        : null,
      voice: reasons.length === 0 && classification.status === "SUPPORTED"
        ? classification.voice
        : null,
      status: reasons.length === 0 ? "SUPPORTED" as const : "NULL" as const,
      reasonCodes: reasons,
    });
  });
  const reasonCodes = sortedReasonsV0_1([
    ...structureReasons,
    ...nuclei.flatMap((nucleus) => nucleus.reasonCodes),
  ]);
  const status =
    nuclei.length > 0 && reasonCodes.length === 0 && nuclei.every((nucleus) => nucleus.status === "SUPPORTED")
      ? "SUPPORTED" as const
      : "NULL" as const;
  const voicePath = status === "SUPPORTED"
    ? Object.freeze(nuclei.flatMap((nucleus) => nucleus.voice === null ? [] : [nucleus.voice]))
    : Object.freeze([]);
  const nucleusStructure = adjacentVowels || adjacentGlide
    ? "UNRESOLVED_NUCLEUS_STRUCTURE" as const
    : vowelSegments.length > 1
      ? "SEQUENTIAL_NUCLEI" as const
      : vowelSegments.length === 1
        ? "MONOPHTHONG_NUCLEUS" as const
        : "NULL" as const;

  return Object.freeze({
    ...base,
    status,
    pronunciationBody: body,
    notationKind: notation.notationKind,
    nonVoiceFeatures: nonVoiceFeaturesV0_1(observation.ipa),
    nucleusStructure,
    nuclei: Object.freeze(nuclei),
    voicePath,
    reasonCodes,
    authorityRefs: status === "SUPPORTED"
      ? Object.freeze([SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_CONTRACT_ID_V0_1])
      : Object.freeze([]),
  });
}

export function projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(
  fact: AlbanianKaikkiExactLexicalSourceFactV0_1,
): readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[] {
  return Object.freeze(
    fact.ipaObservations.map((observation) => projectObservationV0_1(fact, observation)),
  );
}

export function projectAlbanianKaikkiFactsSourceIpaToSevenVoicesV0_1(
  facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[],
): readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[] {
  return Object.freeze(
    facts.flatMap((fact) => projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(fact)),
  );
}
