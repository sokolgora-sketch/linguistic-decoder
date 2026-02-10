import { VOWEL_MAP_BASE_LATIN_V0_1 } from "@/shared/vowels/vowelMap.baseLatin.v0.1";

describe("vowels: base latin map v0.1 locked", () => {
  test("keys + pairs snapshot (sorted, deterministic)", () => {
    const keys = Object.keys(VOWEL_MAP_BASE_LATIN_V0_1).sort();
    expect(keys).toMatchSnapshot();

    const pairs = keys.map((k) => [k, VOWEL_MAP_BASE_LATIN_V0_1[k]]);
    expect(pairs).toMatchSnapshot();
  });
});
