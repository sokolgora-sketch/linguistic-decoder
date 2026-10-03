import {
  buildZeroConsonantalDistributionSummaryV0_1,
  stableJsonV0_1,
  zeroConsonantalSignatureV0_1,
  type ZeroConsonantalValidationObservationV0_1,
} from "@/shared/openInstrument/zeroConsonantalStructuralCompositionValidation.v0_1";

function observation(
  lexicalWord: string,
  voicePath: readonly ["A" | "E" | "I" | "O" | "U" | "Y" | "Ë"],
  p: number,
  i: readonly number[],
  s: number,
  gammaSignature: string,
): ZeroConsonantalValidationObservationV0_1 {
  const zc = {
    schemaVersion:
      "open-instrument.zero-consonantal-structural-composition.v0_1" as const,
    voicePath,
    variantId: "1",
    variantOrder: 0,
    sourceProfileId: "open-instrument.cmudict-arpabet-en-us.v0_1" as const,
    sourceNotation: "ARPABET" as const,
    sourceRevision:
      "74790861f652b15e4ac49015a90074ad62a27690" as const,
    p,
    i,
    s,
    d: [p, ...i, s],
    a: p - s,
    r: [],
  };
  return {
    lexicalWord,
    sourceForm: lexicalWord,
    variantId: "1",
    variantOrder: 0,
    sourcePronunciation: "K AE1 T",
    sourceUnits: ["K", "AE1", "T"],
    voicePath,
    gammaSignature,
    zc,
  };
}

describe("ZC v0.1 exhaustive validation aggregation", () => {
  it("serializes exact ZC signatures without collapsing R-bearing structure", () => {
    const first = observation("first", ["A"], 1, [], 1, "gamma-a");
    const second = observation("second", ["A"], 1, [], 1, "gamma-b");
    expect(zeroConsonantalSignatureV0_1(first.zc)).toBe(
      stableJsonV0_1({ p: 1, i: [], s: 1, d: [1, 1], a: 0, r: [] }),
    );
    expect(zeroConsonantalSignatureV0_1(first.zc)).toBe(
      zeroConsonantalSignatureV0_1(second.zc),
    );
  });

  it("keeps complete I and D vector frequencies and numeric histograms", () => {
    const summary = buildZeroConsonantalDistributionSummaryV0_1([
      observation("a", ["A"], 1, [], 1, "gamma-a"),
      observation("b", ["A"], 1, [0], 1, "gamma-b"),
      observation("c", ["E"], 2, [1, 0], 0, "gamma-c"),
    ]);
    expect(summary.i.frequency).toEqual([
      { value: [0], count: 1 },
      { value: [1, 0], count: 1 },
      { value: [], count: 1 },
    ]);
    expect(summary.i.emptyCount).toBe(1);
    expect(summary.i.containsZeroCount).toBe(2);
    expect(summary.i.containsNonzeroCount).toBe(1);
    expect(summary.d.frequency).toHaveLength(3);
    expect(summary.p.histogram).toEqual([
      { value: 1, count: 2 },
      { value: 2, count: 1 },
    ]);
    expect(summary.a.negativeCount).toBe(0);
    expect(summary.a.zeroCount).toBe(2);
    expect(summary.a.positiveCount).toBe(1);
  });

  it("reports same-Voice/different-ZC and same-Voice/same-ZC/different-Gamma", () => {
    const summary = buildZeroConsonantalDistributionSummaryV0_1([
      observation("first", ["A"], 1, [], 1, "gamma-a"),
      observation("second", ["A"], 2, [], 1, "gamma-b"),
      observation("third", ["A"], 1, [], 1, "gamma-c"),
    ]);
    expect(summary.sameVDifferentZc.voiceGroupsWithMultipleZc).toBe(1);
    expect(summary.sameVDifferentZc.observationsParticipating).toBe(3);
    expect(summary.sameVSameZcDifferentGamma.groupsWithMultipleGamma).toBe(1);
    expect(summary.sameVSameZcDifferentGamma.observationsParticipating).toBe(2);
    expect(summary.invariants.identicalGammaAlwaysIdenticalZc).toBe(true);
  });
});
