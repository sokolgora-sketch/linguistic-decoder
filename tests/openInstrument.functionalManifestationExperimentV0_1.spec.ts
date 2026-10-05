import {
  ALPHA,
  BOOTSTRAP_REPLICATES,
  MINIMUM_REPEATED_STRUCTURAL_CLASS,
  PERMUTATIONS,
  PERMUTATION_STREAM_NAME,
  SplitMix64,
  compareCodePoint,
  stableJson,
} from "../scripts/openInstrumentFunctionalManifestationExperimentV0_1";

describe("functional manifestation experiment v0.1 execution boundary", () => {
  it("keeps the frozen execution constants and canonical serializer stable", () => {
    expect(PERMUTATIONS).toBe(10_000);
    expect(BOOTSTRAP_REPLICATES).toBe(2_000);
    expect(ALPHA).toBe(0.05);
    expect(MINIMUM_REPEATED_STRUCTURAL_CLASS).toBe(2);
    expect(PERMUTATION_STREAM_NAME).toBe(
      "OPEN_INSTRUMENT_FUNCTIONAL_MANIFESTATION_V0_1_GAMMA_PRIMARY_PERMUTATION",
    );
    expect(stableJson({ b: 2, a: ["x", 1] })).toBe('{"a":["x",1],"b":2}');
  });

  it("derives the same deterministic random stream from the frozen stream label", () => {
    const first = new SplitMix64("OPEN_INSTRUMENT_FUNCTIONAL_MANIFESTATION_V0_1_GAMMA_PRIMARY_PERMUTATION\u00000");
    const second = new SplitMix64("OPEN_INSTRUMENT_FUNCTIONAL_MANIFESTATION_V0_1_GAMMA_PRIMARY_PERMUTATION\u00000");
    expect([first.nextUnit(), first.nextUnit(), first.nextUnit()]).toEqual([
      second.nextUnit(),
      second.nextUnit(),
      second.nextUnit(),
    ]);
  });

  it("uses locale-independent code-point ordering for execution keys", () => {
    const keys = ["O→U", "O", "A→Ë", "ä", "a", "!", "Z", "z"];
    const expected = [...keys].sort();
    const localeCompare = jest.spyOn(String.prototype, "localeCompare");

    expect([...keys].sort(compareCodePoint)).toEqual(expected);
    expect(stableJson({ "O→U": 1, "ä": 2, a: 3, "!": 4 })).toBe(
      '{"!":4,"O→U":1,"a":3,"ä":2}',
    );
    expect(localeCompare).not.toHaveBeenCalled();
    localeCompare.mockRestore();
  });
});
