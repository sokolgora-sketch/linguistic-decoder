import {
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
} from "./cmudictArpabetPronunciation.v0_1";
import type {
  NormalizedArpabetSegmentV0_1,
  PronunciationVoiceVariantResultV0_1,
} from "./pronunciationToVoice.v0_1";
import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";

export const ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_SCHEMA_V0_1 =
  "open-instrument.zero-consonantal-structural-composition.v0_1" as const;

export type ZeroConsonantalStructuralRecurrenceV0_1 = Readonly<{
  identity: readonly string[];
  segmentIndices: readonly number[];
  occurrenceCount: number;
}>;

export type ZeroConsonantalStructuralCompositionV0_1 = Readonly<{
  schemaVersion: typeof ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_SCHEMA_V0_1;
  voicePath: readonly VowelVoice[];
  variantId: string;
  variantOrder: number;
  sourceProfileId: typeof CMUDICT_SOURCE_PROFILE_ID_V0_1;
  sourceNotation: typeof CMUDICT_SOURCE_NOTATION_V0_1;
  sourceRevision: typeof CMUDICT_SOURCE_REVISION_V0_1;
  p: number;
  i: readonly number[];
  s: number;
  d: readonly number[];
  a: number;
  r: readonly ZeroConsonantalStructuralRecurrenceV0_1[];
}>;

// This is a source-token validity guard, not a phonological classification.
// These are the consonant identities present in the frozen bundled CMUdict
// ARPAbet source profile. Unknown or annotation-like tokens fail closed.
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

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) {
      if (child && typeof child === "object" && !Object.isFrozen(child)) {
        deepFreeze(child);
      }
    }
  }
  return value;
}

function sameArray(left: readonly unknown[], right: readonly unknown[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function sourceSegmentOrderIsValid(
  segments: readonly NormalizedArpabetSegmentV0_1[],
): boolean {
  const indices = new Set<number>();
  for (const [position, segment] of segments.entries()) {
    if (
      !Number.isInteger(segment.segmentIndex) ||
      segment.segmentIndex < 0 ||
      indices.has(segment.segmentIndex) ||
      (position > 0 && segment.segmentIndex <= segments[position - 1].segmentIndex)
    ) {
      return false;
    }
    indices.add(segment.segmentIndex);

    if (segment.sourceUnits.length === 0) return false;
    if (
      segment.kind === "consonant" &&
      !segment.sourceUnits.every((unit) =>
        AUTHORIZED_CMU_CONSONANT_SOURCE_UNITS_V0_1.has(unit),
      )
    ) {
      return false;
    }
    if (
      segment.kind === "consonant" &&
      segment.nucleusIndex !== null
    ) {
      return false;
    }
    if (
      (segment.kind === "monophthong_nucleus" ||
        segment.kind === "moving_nucleus") &&
      (segment.nucleusIndex === null || segment.voiceAnchors === null)
    ) {
      return false;
    }
    if (segment.kind === "stress" || segment.kind === "unsupported_vowel") {
      return false;
    }
  }
  return true;
}

function sourceNucleusSegments(
  variant: PronunciationVoiceVariantResultV0_1,
): readonly NormalizedArpabetSegmentV0_1[] | null {
  if (!sourceSegmentOrderIsValid(variant.normalizedSegments)) return null;

  const nuclei = variant.nuclei;
  const nucleusSegments: NormalizedArpabetSegmentV0_1[] = [];
  const seenNucleusIndices = new Set<number>();

  for (const [position, nucleus] of nuclei.entries()) {
    if (
      nucleus.nucleusIndex !== position ||
      seenNucleusIndices.has(nucleus.nucleusIndex)
    ) {
      return null;
    }
    seenNucleusIndices.add(nucleus.nucleusIndex);

    const matchingSegments = variant.normalizedSegments.filter(
      (segment) => segment.nucleusIndex === nucleus.nucleusIndex,
    );
    if (matchingSegments.length !== 1) return null;
    const matchingSegment = matchingSegments[0];
    if (
      matchingSegment.kind !== nucleus.kind ||
      matchingSegment.baseCategory !== nucleus.baseCategory ||
      matchingSegment.voiceAnchors === null ||
      !sameArray(matchingSegment.voiceAnchors, nucleus.voiceAnchors)
    ) {
      return null;
    }
    nucleusSegments.push(matchingSegment);
  }

  return nucleusSegments;
}

function validVariantAuthority(
  variant: PronunciationVoiceVariantResultV0_1,
): boolean {
  return (
    variant.reasonCode === null &&
    variant.canonicalVoicePath !== null &&
    variant.canonicalVoicePath.length > 0 &&
    variant.variant.sourceProfileId === CMUDICT_SOURCE_PROFILE_ID_V0_1 &&
    variant.variant.sourceNotation === CMUDICT_SOURCE_NOTATION_V0_1 &&
    variant.variant.sourceRevision === CMUDICT_SOURCE_REVISION_V0_1 &&
    variant.variant.sourceUnits.length > 0
  );
}

/**
 * Derives ZC_v0_1 from one already-defined pronunciation variant.
 *
 * Variant selection remains outside this function. Callers may derive each
 * retained variant independently, while a Null top-level pronunciation result
 * remains Null at its own boundary.
 */
export function deriveZeroConsonantalStructuralCompositionV0_1(
  variant: PronunciationVoiceVariantResultV0_1 | null,
): ZeroConsonantalStructuralCompositionV0_1 | null {
  if (variant === null || !validVariantAuthority(variant)) return null;
  const canonicalVoicePath = variant.canonicalVoicePath;
  if (canonicalVoicePath === null) return null;

  const nuclei = sourceNucleusSegments(variant);
  if (nuclei === null || nuclei.length === 0) return null;

  const consonants = variant.normalizedSegments.filter(
    (segment) => segment.kind === "consonant",
  );
  const firstNucleus = nuclei[0].segmentIndex;
  const lastNucleus = nuclei[nuclei.length - 1].segmentIndex;
  const prefix = consonants.filter(
    (segment) => segment.segmentIndex < firstNucleus,
  );
  const inter = nuclei.slice(0, -1).map((left, index) =>
    consonants.filter(
      (segment) =>
        segment.segmentIndex > left.segmentIndex &&
        segment.segmentIndex < nuclei[index + 1].segmentIndex,
    ),
  );
  const suffix = consonants.filter(
    (segment) => segment.segmentIndex > lastNucleus,
  );

  const recurrenceByIdentity = new Map<
    string,
    { identity: readonly string[]; segmentIndices: number[] }
  >();
  for (const segment of consonants) {
    const identity = [...segment.sourceUnits];
    const key = JSON.stringify(identity);
    const current = recurrenceByIdentity.get(key) ?? {
      identity,
      segmentIndices: [],
    };
    current.segmentIndices.push(segment.segmentIndex);
    recurrenceByIdentity.set(key, current);
  }

  const r = [...recurrenceByIdentity.values()]
    .filter((entry) => entry.segmentIndices.length > 1)
    .sort((left, right) => {
      const firstIndexDifference =
        left.segmentIndices[0] - right.segmentIndices[0];
      return firstIndexDifference !== 0
        ? firstIndexDifference
        : JSON.stringify(left.identity).localeCompare(
            JSON.stringify(right.identity),
          );
    })
    .map((entry) => ({
      identity: [...entry.identity],
      segmentIndices: [...entry.segmentIndices],
      occurrenceCount: entry.segmentIndices.length,
    }));

  const p = prefix.length;
  const i = inter.map((region) => region.length);
  const s = suffix.length;

  return deepFreeze({
    schemaVersion: ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_SCHEMA_V0_1,
    voicePath: [...canonicalVoicePath],
    variantId: variant.variant.variantId,
    variantOrder: variant.variant.variantOrder,
    sourceProfileId: variant.variant.sourceProfileId,
    sourceNotation: variant.variant.sourceNotation,
    sourceRevision: variant.variant.sourceRevision,
    p,
    i,
    s,
    d: [p, ...i, s],
    a: p - s,
    r,
  });
}
