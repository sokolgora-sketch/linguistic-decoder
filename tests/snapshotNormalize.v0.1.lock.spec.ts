import { VOLATILE_META_KEYS_V0_1, normalizeForSnapshotV0_1 } from "./_helpers/snapshotNormalize.v0.1";

describe("snapshotNormalize v0.1 — lock", () => {
  test("volatile meta keys list is locked", () => {
    expect([...VOLATILE_META_KEYS_V0_1]).toEqual(["created", "generatedAt"]);
  });

  test("normalizer removes ONLY meta.created/meta.generatedAt (deep) and keeps everything else", () => {
    const input = {
      meta: { created: "t1", generatedAt: "t2", engineVersion: "X", inputs: { word: "study" } },
      originClaim: { meta: { generatedAt: "t3", engineVersion: "Y" }, candidates: [1] },
      evidence: { created: "SHOULD_STAY" }, // not under `meta`
    };

    const out = normalizeForSnapshotV0_1(input);

    expect(out).toEqual({
      meta: { engineVersion: "X", inputs: { word: "study" } },
      originClaim: { meta: { engineVersion: "Y" }, candidates: [1] },
      evidence: { created: "SHOULD_STAY" },
    });
  });
});
