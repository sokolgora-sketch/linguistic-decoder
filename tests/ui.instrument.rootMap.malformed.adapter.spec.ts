import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";

describe("rootMap adapter: malformed -> missing(malformed) with reason", () => {
  test("rootMap present but wrong shape is reported as malformed (no crash)", () => {
    const raw = {
      word: "study",
      sanitized: "study",
      engineVersion: "0.2.0-symbolic",
      mode: "strict",
      alphabet: "auto",

      // Intentionally malformed: tokens should be array, composedMeaning should be string.
      rootMap: {
        tokens: "NOT_AN_ARRAY",
        keys: [],
        composedMeaning: 123,
      },
    };

    const vm = adaptAnalysisToTelemetryVM(raw);

    expect(vm.rootMap.kind).toBe("missing");
    if (vm.rootMap.kind === "missing") {
      expect(vm.rootMap.missing).toBe("malformed");
      // We only assert it's informative, not exact string, to avoid brittle tests.
      expect(String(vm.rootMap.note ?? "")).toContain("rootMap");
    }
  });
});
