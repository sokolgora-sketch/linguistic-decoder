import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";
import type { ZeroConsonantalStructuralCompositionV0_1 } from "./zeroConsonantalStructuralComposition.v0_1";

export type ZeroConsonantalValidationObservationV0_1 = Readonly<{
  lexicalWord: string;
  sourceForm: string;
  variantId: string;
  variantOrder: number;
  sourcePronunciation: string;
  sourceUnits: readonly string[];
  voicePath: readonly VowelVoice[];
  gammaSignature: string;
  zc: ZeroConsonantalStructuralCompositionV0_1;
}>;

export type FrequencyEntryV0_1<T> = Readonly<{
  value: T;
  count: number;
}>;

export function stableJsonV0_1(value: unknown): string {
  return JSON.stringify(value);
}

function compareCodePointStringsV0_1(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function frequencySortV0_1<T>(
  entries: readonly FrequencyEntryV0_1<T>[],
  signature: (value: T) => string,
): FrequencyEntryV0_1<T>[] {
  return [...entries].sort(
    (left, right) =>
      right.count - left.count ||
      compareCodePointStringsV0_1(signature(left.value), signature(right.value)),
  );
}

function histogramV0_1(values: readonly number[]): FrequencyEntryV0_1<number>[] {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .sort(([left], [right]) => left - right)
    .map(([value, count]) => ({ value, count }));
}

function vectorFrequencyV0_1(
  values: readonly (readonly number[])[],
): FrequencyEntryV0_1<readonly number[]>[] {
  const counts = new Map<string, { value: readonly number[]; count: number }>();
  for (const value of values) {
    const key = stableJsonV0_1(value);
    const current = counts.get(key) ?? { value: [...value], count: 0 };
    current.count += 1;
    counts.set(key, current);
  }
  return [...counts.values()].map(({ value, count }) => ({ value, count }));
}

function topExamplesV0_1(
  observations: readonly ZeroConsonantalValidationObservationV0_1[],
  limit = 10,
) {
  return observations.slice(0, limit).map((observation) => ({
    lexicalWord: observation.lexicalWord,
    sourceForm: observation.sourceForm,
    variantId: observation.variantId,
    variantOrder: observation.variantOrder,
    voicePath: [...observation.voicePath],
    gammaSignature: observation.gammaSignature,
    zcSignature: zeroConsonantalSignatureV0_1(observation.zc),
  }));
}

export function zeroConsonantalSignatureV0_1(
  zc: ZeroConsonantalStructuralCompositionV0_1,
): string {
  return stableJsonV0_1({
    p: zc.p,
    i: [...zc.i],
    s: zc.s,
    d: [...zc.d],
    a: zc.a,
    r: zc.r.map((record) => ({
      identity: [...record.identity],
      segmentIndices: [...record.segmentIndices],
      occurrenceCount: record.occurrenceCount,
    })),
  });
}

function groupedByVAndZcV0_1(
  observations: readonly ZeroConsonantalValidationObservationV0_1[],
) {
  const groups = new Map<string, ZeroConsonantalValidationObservationV0_1[]>();
  for (const observation of observations) {
    const key = stableJsonV0_1([
      [...observation.voicePath],
      zeroConsonantalSignatureV0_1(observation.zc),
    ]);
    const current = groups.get(key) ?? [];
    current.push(observation);
    groups.set(key, current);
  }
  return groups;
}

export function numericSummaryV0_1(values: readonly number[]) {
  const histogram = histogramV0_1(values);
  if (values.length === 0) {
    return {
      histogram,
      min: null,
      max: null,
      mean: null,
      median: null,
    };
  }

  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  let sum = 0;
  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
    sum += value;
  }

  const ordered = [...values].sort((left, right) => left - right);
  const middle = Math.floor(ordered.length / 2);
  const median =
    ordered.length % 2 === 0
      ? (ordered[middle - 1] + ordered[middle]) / 2
      : ordered[middle];

  return {
    histogram,
    min,
    max,
    mean: sum / values.length,
    median,
  };
}

export function buildZeroConsonantalDistributionSummaryV0_1(
  observations: readonly ZeroConsonantalValidationObservationV0_1[],
) {
  const sorted = [...observations].sort(
    (left, right) =>
      compareCodePointStringsV0_1(left.lexicalWord, right.lexicalWord) ||
      left.variantOrder - right.variantOrder ||
      compareCodePointStringsV0_1(left.sourceForm, right.sourceForm),
  );
  const pValues = sorted.map((observation) => observation.zc.p);
  const sValues = sorted.map((observation) => observation.zc.s);
  const aValues = sorted.map((observation) => observation.zc.a);
  const iVectors = sorted.map((observation) => [...observation.zc.i]);
  const dVectors = sorted.map((observation) => [...observation.zc.d]);
  const recurrenceShapes = sorted.map((observation) =>
    observation.zc.r.map((record) => ({
      identity: [...record.identity],
      occurrenceCount: record.occurrenceCount,
    })),
  );

  const iFrequency = vectorFrequencyV0_1(iVectors);
  const dFrequency = vectorFrequencyV0_1(dVectors);
  const zcFrequency = new Map<
    string,
    {
      signature: string;
      p: number;
      i: number[];
      s: number;
      d: number[];
      a: number;
      r: unknown[];
      count: number;
    }
  >();
  for (const observation of sorted) {
    const zc = observation.zc;
    const signature = zeroConsonantalSignatureV0_1(zc);
    const current = zcFrequency.get(signature) ?? {
      signature,
      p: zc.p,
      i: [...zc.i],
      s: zc.s,
      d: [...zc.d],
      a: zc.a,
      r: zc.r.map((record) => ({
        identity: [...record.identity],
        segmentIndices: [...record.segmentIndices],
        occurrenceCount: record.occurrenceCount,
      })),
      count: 0,
    };
    current.count += 1;
    zcFrequency.set(signature, current);
  }

  const recurrenceRecords = sorted.flatMap((observation) => observation.zc.r);
  const recurrenceOccurrenceCounts = histogramV0_1(
    recurrenceRecords.map((record) => record.occurrenceCount),
  );
  const recurrenceShapeCounts = new Map<string, number>();
  for (const shape of recurrenceShapes) {
    const key = stableJsonV0_1(shape);
    recurrenceShapeCounts.set(key, (recurrenceShapeCounts.get(key) ?? 0) + 1);
  }

  const sameVGroups = new Map<string, ZeroConsonantalValidationObservationV0_1[]>();
  for (const observation of sorted) {
    const key = stableJsonV0_1(observation.voicePath);
    const current = sameVGroups.get(key) ?? [];
    current.push(observation);
    sameVGroups.set(key, current);
  }
  const sameVDifferentZcGroups = [...sameVGroups.entries()].filter(([, group]) =>
    new Set(
      group.map((observation) => zeroConsonantalSignatureV0_1(observation.zc)),
    ).size > 1,
  );
  const sameVZcGroups = groupedByVAndZcV0_1(sorted);
  const sameVSameZcDifferentGammaGroups = [...sameVZcGroups.entries()].filter(
    ([, group]) =>
      new Set(group.map((observation) => observation.gammaSignature)).size > 1,
  );

  const gammaToZc = new Map<string, Set<string>>();
  for (const observation of sorted) {
    const values = gammaToZc.get(observation.gammaSignature) ?? new Set<string>();
    values.add(zeroConsonantalSignatureV0_1(observation.zc));
    gammaToZc.set(observation.gammaSignature, values);
  }

  return {
    observationCount: sorted.length,
    p: numericSummaryV0_1(pValues),
    i: {
      distinctVectors: iFrequency.length,
      frequency: frequencySortV0_1(iFrequency, stableJsonV0_1),
      topVectors: frequencySortV0_1(iFrequency, stableJsonV0_1).slice(0, 20),
      maxVectorLength: iVectors.reduce(
        (max, vector) => Math.max(max, vector.length),
        0,
      ),
      maxRegionLoad: iVectors.reduce(
        (max, vector) => vector.reduce((vectorMax, value) => Math.max(vectorMax, value), max),
        0,
      ),
      emptyCount: iVectors.filter((vector) => vector.length === 0).length,
      containsZeroCount: iVectors.filter((vector) => vector.includes(0)).length,
      containsNonzeroCount: iVectors.filter((vector) =>
        vector.some((value) => value !== 0),
      ).length,
    },
    s: numericSummaryV0_1(sValues),
    d: {
      distinctVectors: dFrequency.length,
      frequency: frequencySortV0_1(dFrequency, stableJsonV0_1),
      topVectors: frequencySortV0_1(dFrequency, stableJsonV0_1).slice(0, 20),
      maxLength: dVectors.reduce(
        (max, vector) => Math.max(max, vector.length),
        0,
      ),
      topLengths: frequencySortV0_1(
        histogramV0_1(dVectors.map((vector) => vector.length)),
        String,
      ).slice(0, 20),
    },
    a: {
      ...numericSummaryV0_1(aValues),
      negativeCount: aValues.filter((value) => value < 0).length,
      zeroCount: aValues.filter((value) => value === 0).length,
      positiveCount: aValues.filter((value) => value > 0).length,
    },
    r: {
      emptyCount: sorted.filter((observation) => observation.zc.r.length === 0)
        .length,
      nonEmptyCount: sorted.filter((observation) => observation.zc.r.length > 0)
        .length,
      nonEmptyPercent:
        sorted.length === 0
          ? 0
          : (sorted.filter((observation) => observation.zc.r.length > 0).length /
              sorted.length) *
            100,
      recurrenceRecords: recurrenceRecords.length,
      occurrenceCountDistribution: recurrenceOccurrenceCounts,
      maxOccurrenceCount: recurrenceRecords.reduce(
        (max, record) => Math.max(max, record.occurrenceCount),
        0,
      ),
      multipleRecurrentIdentitiesCount: sorted.filter(
        (observation) => observation.zc.r.length > 1,
      ).length,
      exactRecurrenceShapes: [...recurrenceShapeCounts.entries()]
        .map(([shape, count]) => ({ shape: JSON.parse(shape), count }))
        .sort(
          (left, right) =>
            right.count - left.count ||
            compareCodePointStringsV0_1(
              stableJsonV0_1(left.shape),
              stableJsonV0_1(right.shape),
            ),
        )
        .slice(0, 20),
    },
    exactZc: {
      distinctSignatures: zcFrequency.size,
      frequency: [...zcFrequency.values()].sort(
        (left, right) =>
          right.count - left.count ||
          compareCodePointStringsV0_1(left.signature, right.signature),
      ),
      topSignatures: [...zcFrequency.values()]
        .sort(
          (left, right) =>
            right.count - left.count ||
            compareCodePointStringsV0_1(left.signature, right.signature),
        )
        .slice(0, 20),
      rIndicesIncludedInEquality: true,
    },
    sameVDifferentZc: {
      voiceGroupsWithMultipleZc: sameVDifferentZcGroups.length,
      observationsParticipating: sameVDifferentZcGroups.reduce(
        (sum, [, group]) => sum + group.length,
        0,
      ),
      distinctVZcCombinations: new Set(
        sameVDifferentZcGroups.flatMap(([, group]) =>
          group.map((observation) =>
            stableJsonV0_1([
              [...observation.voicePath],
              zeroConsonantalSignatureV0_1(observation.zc),
            ]),
          ),
        ),
      ).size,
      examples: topExamplesV0_1(
        sameVDifferentZcGroups.flatMap(([, group]) => group),
      ),
    },
    sameVSameZcDifferentGamma: {
      groupsWithMultipleGamma: sameVSameZcDifferentGammaGroups.length,
      observationsParticipating: sameVSameZcDifferentGammaGroups.reduce(
        (sum, [, group]) => sum + group.length,
        0,
      ),
      distinctGamma: new Set(
        sameVSameZcDifferentGammaGroups.flatMap(([, group]) =>
          group.map((observation) => observation.gammaSignature),
        ),
      ).size,
      examples: topExamplesV0_1(
        sameVSameZcDifferentGammaGroups.flatMap(([, group]) => group),
      ),
    },
    invariants: {
      identicalGammaAlwaysIdenticalZc: [...gammaToZc.values()].every(
        (values) => values.size === 1,
      ),
      integrityFailures: [...gammaToZc.values()].filter(
        (values) => values.size > 1,
      ).length,
    },
  };
}

