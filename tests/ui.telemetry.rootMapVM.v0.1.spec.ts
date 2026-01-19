import { adaptRootMapToVM } from "../src/ui/telemetry/rootMapVM.v0.1";

/**
 * NOTE:
 * We import via a small shim so tests don’t depend on Next.js/app resolution.
 * This keeps Jest stable.
 */

describe("RootMap VM adapter (v0.1)", () => {
  test("missing: not_emitted when null/undefined", () => {
    expect(adaptRootMapToVM(null)).toEqual(
      expect.objectContaining({ kind: "missing", missing: "not_emitted" })
    );
    expect(adaptRootMapToVM(undefined)).toEqual(
      expect.objectContaining({ kind: "missing", missing: "not_emitted" })
    );
  });

  test("missing: malformed when not an object", () => {
    expect(adaptRootMapToVM("nope")).toEqual(
      expect.objectContaining({ kind: "missing", missing: "malformed" })
    );
    expect(adaptRootMapToVM(123)).toEqual(
      expect.objectContaining({ kind: "missing", missing: "malformed" })
    );
    expect(adaptRootMapToVM([])).toEqual(
      expect.objectContaining({ kind: "missing", missing: "malformed" })
    );
  });

  test("present: parses tokens/keys/carriers/spans defensively", () => {
    const rm = {
      tokens: [
        { token: "SHTU", role: "action", vowel_path: "U" },
        { token: "DI", role: "instrument", vowel_path: "I" },
        { token: 123 }, // ignored (token not string)
      ],
      keys: [
        {
          token: "DI",
          language: "sq",
          gloss: "know / knowledge",
          evidence: ["sq: di", "ops: y_to_i"],
          status: "supported",
          ops: ["y_to_i"],
        },
      ],
      carriers: [{ token: "DI", language: "sq", carrierForm: "dij", note: "gloss: I know" }],
      spans: [{ token: "DI", start: 3, end: 5, source: "surface", note: "segment=dy" }],
      composedMeaning: "add + know",
    };

    const out = adaptRootMapToVM(rm);
    expect(out.kind).toBe("present");
    if (out.kind !== "present") return;

    expect(out.value.tokens.map((t) => t.token)).toEqual(["SHTU", "DI"]);
    expect(out.value.keys[0]?.ops).toEqual(["y_to_i"]);
    expect(out.value.composedMeaning).toBe("add + know");
  });
});
