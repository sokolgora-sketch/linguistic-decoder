// RootMap VM adapter tests (v0.1)
// Goal: UI-safe, never-throw, deterministic mapping.

import { adaptRootMapToVM } from "@/ui/telemetry/rootMapVM.v0.1";

describe("RootMap VM adapter v0.1", () => {
  it("returns missing:not_emitted when rootMap is absent", () => {
    const res = adaptRootMapToVM({ word: "study" } as any);
    expect(res.kind).toBe("missing");
    if (res.kind === "missing") {
      expect(res.missing).toBe("not_emitted");
    }
  });

  it("maps a valid rootMap payload to a stable VM", () => {
    const payload = {
      rootMap: {
        tokens: [
          { token: "SHTU", role: "action", vowel_path: "U" },
          { token: "DI", role: "instrument", vowel_path: "I" },
        ],
        keys: [
          {
            token: "SHTU",
            language: "sq",
            gloss: "add",
            status: "supported",
            ops: ["s_to_sh"],
            evidence: ["sq: shtu"],
          },
          {
            token: "DI",
            language: "sq",
            gloss: "know",
            status: "supported",
            ops: ["y_to_i"],
            evidence: ["sq: di"],
          },
        ],
        carriers: [
          { token: "SHTU", language: "en", carrierForm: "stu" },
          { token: "DI", language: "sq", carrierForm: "di" },
        ],
        spans: [
          { token: "SHTU", start: 0, end: 3, source: "surface" },
          { token: "DI", start: 3, end: 5, source: "surface" },
        ],
        composedMeaning: "add + know",
      },
    };

    const res = adaptRootMapToVM(payload as any);
    expect(res.kind).toBe("present");
    if (res.kind === "present") {
      expect(res.value.tokens.map(t => t.token)).toEqual(["SHTU", "DI"]);
      expect(res.value.keys.find(k => k.token === "DI")?.ops).toEqual(["y_to_i"]);
      expect(res.value.composedMeaning).toBe("add + know");
    }
  });

  it("filters malformed entries and never throws", () => {
    const payload = {
      rootMap: {
        tokens: [{}, { token: "OK" }, "bad"],
        keys: [{ token: "OK", ops: ["x"], evidence: ["y"] }, null],
        carriers: ["bad", { token: "OK" }],
        spans: [{ token: "OK", start: "nope" }],
      },
    };

    const res = adaptRootMapToVM(payload as any);
    expect(res.kind).toBe("present");
    if (res.kind === "present") {
      expect(res.value.tokens.length).toBe(1);
      expect(res.value.keys.length).toBe(1);
      expect(res.value.carriers.length).toBe(1);
      expect(res.value.spans.length).toBe(1);
    }
  });
});
