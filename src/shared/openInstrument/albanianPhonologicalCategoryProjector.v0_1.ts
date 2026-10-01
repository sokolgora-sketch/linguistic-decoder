import { classifyIpaSegmentsV0_1 } from "@/shared/ipa/ipaClassify.v0.1";
import type { IpaSegmentV0_1 } from "@/shared/ipa/ipaClassify.v0.1";

import {
  ALBANIAN_PHONOLOGICAL_CATEGORY_VALUES_V0_1,
  ALBANIAN_PHONOLOGICAL_NUCLEUS_REASON_CODES_V0_1,
  ALBANIAN_PROFILE_EXPANSION_CATEGORY_RULES_V0_1,
  type AlbanianPhonologicalCategoryV0_1,
  type AlbanianPhonologicalNucleusReasonCodeV0_1,
} from "./albanianPhonologicalNucleusAuthority.v0_1";
import {
  isAlbanianProjectableSourceProfileBindingAuthorizedV0_1,
} from "./albanianPronunciationSourceProfiles.v0_1";
import type { AlbanianPronunciationSourceObservationV0_1 } from "./albanianPronunciationSourceObservation.v0_1";

export const ALBANIAN_PHONOLOGICAL_CATEGORY_PROJECTOR_SCHEMA_V0_1 =
  "open-instrument.albanian-phonological-category-projector.v0_1" as const;

export const ALBANIAN_PHONOLOGICAL_CATEGORY_PROJECTOR_ID_V0_1 =
  "ALBANIAN_PHONOLOGICAL_CATEGORY_PROJECTOR_V0_1" as const;

export const ALBANIAN_PHONOLOGICAL_PROJECTOR_NOTATION_VALUES_V0_1 = [
  "PHONEMIC",
  "PHONETIC",
  "UNSPECIFIED",
] as const;

export type AlbanianPhonologicalProjectorNotationV0_1 =
  (typeof ALBANIAN_PHONOLOGICAL_PROJECTOR_NOTATION_VALUES_V0_1)[number];

export const ALBANIAN_PHONOLOGICAL_PROJECTOR_FEATURE_VALUES_V0_1 = Object.freeze({
  length: ["NONE_RECORDED", "SHORT", "HALF_LONG", "LONG", "UNKNOWN"] as const,
  nasalization: ["NOT_RECORDED", "PRESENT", "ABSENT", "UNKNOWN"] as const,
});

export type AlbanianPhonologicalProjectorLengthV0_1 =
  (typeof ALBANIAN_PHONOLOGICAL_PROJECTOR_FEATURE_VALUES_V0_1.length)[number];

export type AlbanianPhonologicalProjectorNasalizationV0_1 =
  (typeof ALBANIAN_PHONOLOGICAL_PROJECTOR_FEATURE_VALUES_V0_1.nasalization)[number];

export type AlbanianPhonologicalProjectorReasonCodeV0_1 =
  (typeof ALBANIAN_PHONOLOGICAL_NUCLEUS_REASON_CODES_V0_1)[number];

export type AlbanianPhonologicalProjectorNucleusV0_1 = Readonly<{
  order: number;
  raw: string;
  baseSymbol: string;
  category: AlbanianPhonologicalCategoryV0_1 | null;
  status: "SUPPORTED" | "UNRESOLVED";
  reasonCodes: readonly AlbanianPhonologicalProjectorReasonCodeV0_1[];
  authorityRefs: readonly string[];
}>;

export type AlbanianPhonologicalCategoryProjectionInputV0_1 = Readonly<{
  rawIpa: string;
  sourceProfileId: string;
  sourceScope: AlbanianPronunciationSourceObservationV0_1["sourceScope"];
  sourceProfileQualifier: AlbanianPronunciationSourceObservationV0_1["sourceProfileQualifier"];
}>;

export type AlbanianPhonologicalCategoryProjectionV0_1 = Readonly<{
  schemaVersion: typeof ALBANIAN_PHONOLOGICAL_CATEGORY_PROJECTOR_SCHEMA_V0_1;
  projectorId: typeof ALBANIAN_PHONOLOGICAL_CATEGORY_PROJECTOR_ID_V0_1;
  status: "SUPPORTED" | "UNRESOLVED";
  rawIpa: string;
  pronunciationBody: string;
  notationKind: AlbanianPhonologicalProjectorNotationV0_1;
  sourceProfileId: string;
  sourceScope: AlbanianPronunciationSourceObservationV0_1["sourceScope"];
  features: Readonly<{
    length: AlbanianPhonologicalProjectorLengthV0_1;
    nasalization: AlbanianPhonologicalProjectorNasalizationV0_1;
    stressMarkers: readonly string[];
  }>;
  nucleusStructure:
    | "MONOPHTHONG_NUCLEUS"
    | "SEQUENTIAL_NUCLEI"
    | "UNRESOLVED_NUCLEUS_STRUCTURE";
  nuclei: readonly AlbanianPhonologicalProjectorNucleusV0_1[];
  categories: readonly (AlbanianPhonologicalCategoryV0_1 | null)[];
  reasonCodes: readonly AlbanianPhonologicalProjectorReasonCodeV0_1[];
  authorityRefs: readonly string[];
  sourceObservation: AlbanianPhonologicalCategoryProjectionInputV0_1;
}>;

const STANDARD_AUTHORITY_REF_V0_1 =
  "ICPhS-2003-THE-VOWELS-OF-STANDARD-ALBANIAN" as const;

const STANDARD_PHONEMIC_CATEGORY_BY_SYMBOL_V0_1: Readonly<
  Record<string, AlbanianPhonologicalCategoryV0_1>
> = Object.freeze({
  i: "HIGH_FRONT_UNROUNDED",
  y: "HIGH_FRONT_ROUNDED",
  u: "HIGH_BACK_ROUNDED",
  e: "MID_FRONT_UNROUNDED",
  "ə": "CENTRAL_MID",
  o: "MID_BACK_ROUNDED",
  a: "LOW_CENTRAL_OR_BACK",
});

type ProfileCategoryRulesV0_1 = Readonly<{
  phonemic: Readonly<Record<string, AlbanianPhonologicalCategoryV0_1>>;
  phoneticRelations: Readonly<Record<string, AlbanianPhonologicalCategoryV0_1>>;
  authorityRef: string;
}>;

const CATEGORY_VALUES = new Set<string>(ALBANIAN_PHONOLOGICAL_CATEGORY_VALUES_V0_1);

const LENGTH_MARKERS = new Map<string, AlbanianPhonologicalProjectorLengthV0_1>([
  ["ː", "LONG"],
  ["ˑ", "HALF_LONG"],
]);

const STRESS_MARKERS = new Set(["ˈ", "ˌ"]);
const NASALIZATION_MARK = "\u0303";

function sortedReasons(
  reasons: Iterable<AlbanianPhonologicalProjectorReasonCodeV0_1>,
): readonly AlbanianPhonologicalProjectorReasonCodeV0_1[] {
  return [...new Set(reasons)].sort() as AlbanianPhonologicalProjectorReasonCodeV0_1[];
}

function notationFromRawIpaV0_1(
  rawIpa: string,
): Readonly<{ notationKind: AlbanianPhonologicalProjectorNotationV0_1; body: string }> {
  const trimmed = rawIpa.trim();
  if (trimmed.length >= 2 && trimmed.startsWith("/") && trimmed.endsWith("/")) {
    return { notationKind: "PHONEMIC", body: trimmed.slice(1, -1).trim() };
  }
  if (trimmed.length >= 2 && trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return { notationKind: "PHONETIC", body: trimmed.slice(1, -1).trim() };
  }
  return { notationKind: "UNSPECIFIED", body: trimmed };
}

function featureSummaryV0_1(body: string): Readonly<{
  length: AlbanianPhonologicalProjectorLengthV0_1;
  nasalization: AlbanianPhonologicalProjectorNasalizationV0_1;
  stressMarkers: readonly string[];
}> {
  let length: AlbanianPhonologicalProjectorLengthV0_1 = "NONE_RECORDED";
  for (const marker of LENGTH_MARKERS.keys()) {
    const candidate = LENGTH_MARKERS.get(marker);
    if (body.includes(marker) && candidate !== undefined) length = candidate;
  }

  const decomposed = body.normalize("NFD");
  const nasalization = decomposed.includes(NASALIZATION_MARK) ? "PRESENT" : "NOT_RECORDED";
  const stressMarkers = [...body].filter((character) => STRESS_MARKERS.has(character));

  return Object.freeze({
    length,
    nasalization,
    stressMarkers: Object.freeze(stressMarkers),
  });
}

function segmentCombiningMarksV0_1(segment: IpaSegmentV0_1): readonly string[] {
  const decomposed = segment.raw.normalize("NFD");
  return [...decomposed].slice(1);
}

function hasUnsupportedCombiningMarksV0_1(segment: IpaSegmentV0_1): boolean {
  return segmentCombiningMarksV0_1(segment).some((mark) => mark !== NASALIZATION_MARK);
}

function hasAdjacentVowelSegmentsV0_1(segments: readonly IpaSegmentV0_1[]): boolean {
  return segments.some(
    (segment, index) =>
      segment.cls === "vowel" && segments[index + 1]?.cls === "vowel",
  );
}

function hasAdjacentGlideVowelV0_1(segments: readonly IpaSegmentV0_1[]): boolean {
  return segments.some((segment, index) => {
    if (segment.cls !== "vowel") return false;
    const previous = segments[index - 1]?.base;
    const next = segments[index + 1]?.base;
    return previous === "j" || previous === "w" || next === "j" || next === "w";
  });
}

function categoryForNucleusV0_1(
  segment: IpaSegmentV0_1,
  sourceProfileId: string,
  sourceScope: AlbanianPronunciationSourceObservationV0_1["sourceScope"],
  sourceProfileQualifier: AlbanianPronunciationSourceObservationV0_1["sourceProfileQualifier"],
  notationKind: AlbanianPhonologicalProjectorNotationV0_1,
): Readonly<{
  category: AlbanianPhonologicalCategoryV0_1 | null;
  reasonCodes: readonly AlbanianPhonologicalProjectorReasonCodeV0_1[];
  authorityRefs: readonly string[];
}> {
  const reasons = new Set<AlbanianPhonologicalProjectorReasonCodeV0_1>();

  if (
    !isAlbanianProjectableSourceProfileBindingAuthorizedV0_1(
      sourceProfileId,
      sourceScope,
      sourceProfileQualifier,
    )
  ) {
    reasons.add("PROFILE_AUTHORITY_MISSING");
  }

  const profileRules: ProfileCategoryRulesV0_1 | null =
    sourceProfileQualifier === null
      ? sourceScope === "STANDARD_EXPLICIT"
        ? {
            phonemic: STANDARD_PHONEMIC_CATEGORY_BY_SYMBOL_V0_1,
            phoneticRelations: {},
            authorityRef: STANDARD_AUTHORITY_REF_V0_1,
          }
        : null
      : ALBANIAN_PROFILE_EXPANSION_CATEGORY_RULES_V0_1[sourceProfileQualifier];

  if (profileRules === null) {
    reasons.add("PROFILE_AUTHORITY_MISSING");
  }
  const phonemicCategory = profileRules?.phonemic[segment.base] ?? null;
  const normalizedRelationSymbol = segment.raw.normalize("NFC");
  const phoneticCategory =
    profileRules?.phoneticRelations[normalizedRelationSymbol] ?? null;
  if (hasUnsupportedCombiningMarksV0_1(segment) && phoneticCategory === null) {
    reasons.add("SYMBOL_AUTHORITY_MISSING");
  }
  const category =
    notationKind === "PHONEMIC"
      ? phonemicCategory
      : notationKind === "PHONETIC"
        ? phoneticCategory
        : null;

  if (notationKind === "UNSPECIFIED") {
    reasons.add("NOTATION_AUTHORITY_MISSING");
  } else if (notationKind === "PHONETIC" && phoneticCategory === null) {
    reasons.add("PHONOLOGICAL_CATEGORY_UNRESOLVED");
  }

  if (category === null) {
    if (
      notationKind === "PHONETIC" &&
      (phonemicCategory !== null || phoneticCategory !== null)
    ) {
      reasons.add("PHONOLOGICAL_CATEGORY_UNRESOLVED");
    } else {
      reasons.add("SYMBOL_AUTHORITY_MISSING");
    }
  }
  if (category !== null && !CATEGORY_VALUES.has(category)) {
    reasons.add("PHONOLOGICAL_CATEGORY_UNRESOLVED");
  }

  const reasonCodes = sortedReasons(reasons);
  return Object.freeze({
    category: reasonCodes.length === 0 ? category : null,
    reasonCodes,
    authorityRefs: reasonCodes.length === 0 ? [profileRules?.authorityRef ?? STANDARD_AUTHORITY_REF_V0_1] : [],
  });
}

function deepFreezeProjectionV0_1<T>(value: T): T {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeProjectionV0_1(child);
  }
  return Object.freeze(value);
}

export function projectAlbanianPronunciationSourceObservationV0_1(
  sourceObservation: AlbanianPhonologicalCategoryProjectionInputV0_1,
): AlbanianPhonologicalCategoryProjectionV0_1 {
  const { notationKind, body } = notationFromRawIpaV0_1(sourceObservation.rawIpa);
  const features = featureSummaryV0_1(body);
  const segments = classifyIpaSegmentsV0_1(body);
  const vowelSegments = segments.filter((segment) => segment.cls === "vowel");
  const reasons = new Set<AlbanianPhonologicalProjectorReasonCodeV0_1>();

  if (vowelSegments.length === 0) reasons.add("SYMBOL_AUTHORITY_MISSING");

  const adjacentVowels = hasAdjacentVowelSegmentsV0_1(segments);
  const adjacentGlide = hasAdjacentGlideVowelV0_1(segments);
  if (adjacentVowels) reasons.add("PLAIN_IPA_ADJACENCY_INSUFFICIENT");
  if (adjacentVowels || adjacentGlide) reasons.add("NUCLEUS_STRUCTURE_UNRESOLVED");

  const nucleusStructure =
    adjacentVowels || adjacentGlide
      ? "UNRESOLVED_NUCLEUS_STRUCTURE"
      : vowelSegments.length > 1
        ? "SEQUENTIAL_NUCLEI"
        : "MONOPHTHONG_NUCLEUS";

  const nuclei = vowelSegments.map((segment, order) => {
    const projected = categoryForNucleusV0_1(
      segment,
      sourceObservation.sourceProfileId,
      sourceObservation.sourceScope,
      sourceObservation.sourceProfileQualifier,
      notationKind,
    );
    const nucleusReasons = sortedReasons([
      ...reasons,
      ...projected.reasonCodes,
    ]);
    return Object.freeze({
      order,
      raw: segment.raw,
      baseSymbol: segment.base,
      category: nucleusReasons.length === 0 ? projected.category : null,
      status: nucleusReasons.length === 0 ? "SUPPORTED" : "UNRESOLVED",
      reasonCodes: nucleusReasons,
      authorityRefs: nucleusReasons.length === 0 ? projected.authorityRefs : [],
    });
  });

  const categories = nuclei.map((nucleus) => nucleus.category);
  const reasonCodes = sortedReasons([
    ...reasons,
    ...nuclei.flatMap((nucleus) => nucleus.reasonCodes),
  ]);
  const authorityRefs = [...new Set(nuclei.flatMap((nucleus) => nucleus.authorityRefs))];
  const status =
    nuclei.length > 0 && nuclei.every((nucleus) => nucleus.status === "SUPPORTED")
      ? "SUPPORTED"
      : "UNRESOLVED";

  return deepFreezeProjectionV0_1({
    schemaVersion: ALBANIAN_PHONOLOGICAL_CATEGORY_PROJECTOR_SCHEMA_V0_1,
    projectorId: ALBANIAN_PHONOLOGICAL_CATEGORY_PROJECTOR_ID_V0_1,
    status,
    rawIpa: sourceObservation.rawIpa,
    pronunciationBody: body,
    notationKind,
    sourceProfileId: sourceObservation.sourceProfileId,
    sourceScope: sourceObservation.sourceScope,
    sourceProfileQualifier: sourceObservation.sourceProfileQualifier,
    features,
    nucleusStructure,
    nuclei,
    categories,
    reasonCodes,
    authorityRefs,
    sourceObservation,
  });
}

export function projectAlbanianPronunciationSourceObservationsV0_1(
  sourceObservations: readonly AlbanianPhonologicalCategoryProjectionInputV0_1[],
): readonly AlbanianPhonologicalCategoryProjectionV0_1[] {
  return Object.freeze(
    sourceObservations.map((sourceObservation) =>
      projectAlbanianPronunciationSourceObservationV0_1(sourceObservation),
    ),
  );
}
