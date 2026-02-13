import { VOWEL_MAP_BASE_GREEK_V0_2 } from "@/shared/vowels/vowelMap.baseGreek.v0.2";

function stableSort(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

describe("vowels: base greek map v0.2 locked", () => {
  test("keys + pairs snapshot (sorted, deterministic)", () => {
    const keys = Object.keys(VOWEL_MAP_BASE_GREEK_V0_2).sort(stableSort);
    expect(keys).toMatchSnapshot();

    const pairs = keys.map((k) => [k, (VOWEL_MAP_BASE_GREEK_V0_2 as any)[k]]);
    expect(pairs).toMatchSnapshot();
  });
});
