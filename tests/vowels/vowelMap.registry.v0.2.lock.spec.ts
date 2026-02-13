import { VOWEL_MAP_OVERRIDES_V0_2 } from "@/shared/vowels/vowelMap.registry.v0.2";

function stableSort(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

describe("vowels: registry overrides v0.2 locked", () => {
  test("hints + per-hint override tables snapshot (sorted, deterministic)", () => {
    const hints = Object.keys(VOWEL_MAP_OVERRIDES_V0_2).sort(stableSort);
    expect(hints).toMatchSnapshot();

    for (const hint of hints) {
      const ov = (VOWEL_MAP_OVERRIDES_V0_2 as any)[hint] ?? {};
      const keys = Object.keys(ov).sort(stableSort);
      const pairs = keys.map((k) => [k, ov[k]]);
      expect({ hint, keys, pairs }).toMatchSnapshot();
    }
  });
});
