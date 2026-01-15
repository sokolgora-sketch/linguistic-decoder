import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";

describe("contractAdapter: malformed evidence fields emit missing:malformed", () => {
  it("marks evidence.ops as malformed when present but not an array", () => {
    const raw: any = {
      word: "study",
      mode: "strict",
      evidence: {
        ops: "not-an-array", // malformed
      },
    };

    const vm = adaptAnalysisToTelemetryVM(raw);

    expect(vm.evidence.ops.kind).toBe("missing");
    if (vm.evidence.ops.kind === "missing") {
      expect(vm.evidence.ops.missing).toBe("malformed");
      expect(vm.evidence.ops.note).toMatch(/expected array/);
    }
  });

  it("marks evidence.notes as not_emitted when absent", () => {
    const raw: any = {
      word: "study",
      mode: "strict",
      evidence: {
        ops: [],
      },
    };

    const vm = adaptAnalysisToTelemetryVM(raw);

    expect(vm.evidence.notes.kind).toBe("missing");
    if (vm.evidence.notes.kind === "missing") {
      expect(vm.evidence.notes.missing).toBe("not_emitted");
    }
  });
});
