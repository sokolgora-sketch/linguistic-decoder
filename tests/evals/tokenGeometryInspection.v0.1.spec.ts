import { compareTargetToHighAnchorTokenGeometryV0_1 } from "@/shared/evals/tokenGeometryInspection.v0.1";

const HINDI_TARGET = [
  "din",
  "dil",
  "sir",
  "kitab",
  "shiksha",
  "nadi",
  "pita",
  "kisan",
  "vidya",
  "mitti",
] as const;

const HINDI_V6_V7_HIGH_ANCHOR = [
  "jeevan",
  "geet",
  "neend",
  "cheez",
  "teer",
  "jeet",
  "peepal",
  "keeda",
  "deewar",
  "meetha",
] as const;

const ARABIC_TARGET = [
  "kitab",
  "bint",
  "sikkah",
  "qalib",
  "kabir",
  "saghir",
  "jadid",
  "qadim",
  "jism",
  "ism",
] as const;

const ARABIC_V6_V7_HIGH_ANCHOR = [
  "sifr",
  "sirr",
  "jild",
  "tin",
  "tibn",
  "dibs",
  "simt",
  "rijl",
  "hibr",
  "liman",
] as const;

describe("token geometry inspection v0.1", () => {
  it("captures the Hindi versus Arabic high-anchor spelling split without scoring new runs", () => {
    const hindi = compareTargetToHighAnchorTokenGeometryV0_1({
      label: "hindi-i-v6-v7",
      targetTokens: HINDI_TARGET,
      highAnchorTokens: HINDI_V6_V7_HIGH_ANCHOR,
    });

    const arabic = compareTargetToHighAnchorTokenGeometryV0_1({
      label: "arabic-i-v6-v7",
      targetTokens: ARABIC_TARGET,
      highAnchorTokens: ARABIC_V6_V7_HIGH_ANCHOR,
    });

    expect(hindi.target.tokenCount).toBe(10);
    expect(hindi.highAnchor.tokenCount).toBe(10);
    expect(arabic.target.tokenCount).toBe(10);
    expect(arabic.highAnchor.tokenCount).toBe(10);

    expect(hindi.target.markerCounts.i).toBe(11);
    expect(hindi.highAnchor.markerCounts.i).toBe(0);
    expect(hindi.highAnchor.markerCounts.ee).toBe(10);
    expect(hindi.highAnchor.markerTokenCounts.ee).toBe(10);

    expect(arabic.target.markerCounts.i).toBe(10);
    expect(arabic.highAnchor.markerCounts.i).toBe(10);
    expect(arabic.highAnchor.markerCounts.ee).toBe(0);
    expect(arabic.highAnchor.markerTokenCounts.i).toBe(10);

    expect(hindi.deltas.highAnchorMeanTokenLengthMinusTarget).toBeCloseTo(0.7, 6);
    expect(arabic.deltas.highAnchorMeanTokenLengthMinusTarget).toBeCloseTo(-0.8, 6);

    expect(hindi.deltas.highAnchorLongHighFrontMarkersMinusTarget).toBe(10);
    expect(arabic.deltas.highAnchorLongHighFrontMarkersMinusTarget).toBe(0);

    expect(hindi.flags).toEqual(
      expect.arrayContaining([
        "HIGH_ANCHOR_HAS_MORE_LONG_HIGH_FRONT_MARKERS_THAN_TARGET",
        "HIGH_ANCHOR_HAS_FEWER_SHORT_I_MARKERS_THAN_TARGET",
        "HIGH_ANCHOR_TOKENS_LONGER_THAN_TARGET",
        "HIGH_ANCHOR_DOMINATED_BY_EE_MARKER_TOKENS",
      ]),
    );

    expect(arabic.flags).toEqual(
      expect.arrayContaining(["HIGH_ANCHOR_ALL_TOKENS_HAVE_SHORT_I_MARKER"]),
    );
    expect(arabic.flags).not.toContain(
      "HIGH_ANCHOR_HAS_MORE_LONG_HIGH_FRONT_MARKERS_THAN_TARGET",
    );
    expect(arabic.flags).not.toContain("HIGH_ANCHOR_TOKENS_LONGER_THAN_TARGET");
  });
});
