import { rootMapMaybe } from "../srcShimRootMapVM";

describe("RootMap VM (v0.1) — defensive adapter", () => {
  test("missing: not_emitted when rootMap absent", () => {
    const m = rootMapMaybe({ word: "x" });
    expect(m.kind).toBe("missing");
    if (m.kind === "missing") expect(m.missing).toBe("not_emitted");
  });

  test("missing: malformed when rootMap not object", () => {
    const m = rootMapMaybe({ rootMap: 123 });
    expect(m.kind).toBe("missing");
    if (m.kind === "missing") expect(m.missing).toBe("malformed");
  });

  test("present: normalizes arrays + fields, never throws", () => {
    const m = rootMapMaybe({
      rootMap: {
        tokens: [{ token: "SHTU", role: "action", vowel_path: "U" }, { token: "DI", role: "instrument", vowel_path: "I" }],
        keys: [{ token: "DI", language: "sq", gloss: "know", status: "supported", ops: ["y_to_i"], evidence: ["sq: di"] }],
        carriers: [{ token: "DI", language: "sq", carrierForm: "dij", note: "gloss: I know" }],
        spans: [{ token: "DI", start: 3, end: 5, source: "surface", note: "segment=dy" }],
        composedMeaning: "add + know",
      },
    });

    expect(m.kind).toBe("present");
    if (m.kind !== "present") return;

    expect(m.value.tokens.map((t) => t.token)).toEqual(["SHTU", "DI"]);
    expect(m.value.keys[0].ops).toEqual(["y_to_i"]);
    expect(m.value.composedMeaning).toBe("add + know");
  });
});
