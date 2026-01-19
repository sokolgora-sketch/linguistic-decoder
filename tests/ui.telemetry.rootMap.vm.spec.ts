import { adaptRootMapToVM } from "../src/ui/telemetry/rootMapVM.v0.1";

describe("telemetry RootMap VM (v0.1) — defensive adapter", () => {
  test("missing: not emitted", () => {
    const vm = adaptRootMapToVM({ word: "x" });
    expect(vm.kind).toBe("missing");
    if (vm.kind === "missing") expect(vm.missing).toBe("not_emitted");
  });

  test("present: maps minimal RootMap shape", () => {
    const vm = adaptRootMapToVM({
      rootMap: {
        tokens: [
          { token: "SHTU", role: "action", vowel_path: "U" },
          { token: "DI", role: "instrument", vowel_path: "I" },
        ],
        keys: [
          {
            token: "DI",
            language: "sq",
            gloss: "know",
            status: "supported",
            ops: ["y_to_i"],
            evidence: ["sq: di"],
          },
        ],
        carriers: [{ token: "DI", language: "sq", carrierForm: "dije", note: "gloss: knowledge" }],
        spans: [{ token: "DI", start: 3, end: 5, source: "surface", note: "segment=dy" }],
        composedMeaning: "add + know",
      },
    });

    expect(vm.kind).toBe("present");
    if (vm.kind !== "present") return;

    expect(vm.value.tokens.map((t) => t.token)).toEqual(["SHTU", "DI"]);
    expect(vm.value.keys[0]?.ops).toEqual(["y_to_i"]);
    expect(vm.value.composedMeaning).toBe("add + know");
  });

  test("never throws on malformed input", () => {
    const vm1 = adaptRootMapToVM("nope");
    expect(vm1.kind).toBe("missing");

    const vm2 = adaptRootMapToVM({ rootMap: 123 });
    expect(vm2.kind).toBe("missing");
  });
});
