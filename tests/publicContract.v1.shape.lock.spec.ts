import { analyzeWordV1 } from "../src/engine/analyzeWordV1";
import { assertJsonSafe, expectJsonishTag, topLevelKeysDigest } from "./helpers/contractShape";

describe("Public contract v1 — JSON shape lock (no ad-hoc fields)", () => {
  it("locks top-level keys for a representative strict run (study)", async () => {
    const out = await analyzeWordV1("study", "strict");

    // 1) Must be JSON-safe (no Date/Map/functions/undefined/NaN/etc)
    assertJsonSafe(out);

    // 2) Tag fields must exist + be JSON-ish (but contents are not locked here)
    // NOTE: these are currently top-level fields (based on snapshot hygiene strips)
    expect("o_edge_polarity" in (out as any)).toBe(true);
    expect("s_cluster_vision" in (out as any)).toBe(true);
    expectJsonishTag((out as any).o_edge_polarity, "o_edge_polarity");
    expectJsonishTag((out as any).s_cluster_vision, "s_cluster_vision");

    // 3) Lock the top-level key set (this is the real "contract drift" alarm)
    expect(topLevelKeysDigest(out as any)).toMatchSnapshot();
  });

  it("locks top-level keys for a second word (damage)", async () => {
    const out = await analyzeWordV1("damage", "strict");
    assertJsonSafe(out);

    expect("o_edge_polarity" in (out as any)).toBe(true);
    expect("s_cluster_vision" in (out as any)).toBe(true);
    expectJsonishTag((out as any).o_edge_polarity, "o_edge_polarity");
    expectJsonishTag((out as any).s_cluster_vision, "s_cluster_vision");

    expect(topLevelKeysDigest(out as any)).toMatchSnapshot();
  });
});
