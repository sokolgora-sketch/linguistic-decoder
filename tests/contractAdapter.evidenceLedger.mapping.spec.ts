import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";

describe("contractAdapter: evidence ledger mapping (v0.1.1)", () => {
  it("maps evidence arrays into present VM lists", () => {
    const vm = adaptAnalysisToTelemetryVM({
      word: "test",
      evidence: {
        normalizationSteps: ["N1", "N2"],
        ops: ["OP1"],
        notes: ["NOTE"],
        signals: ["SIG"],
      },
    });

    expect(vm.evidence.normalizationSteps.kind).toBe("present");
    expect(vm.evidence.normalizationSteps.value).toEqual(["N1", "N2"]);

    expect(vm.evidence.ops.kind).toBe("present");
    expect(vm.evidence.ops.value).toEqual(["OP1"]);

    expect(vm.evidence.notes.kind).toBe("present");
    expect(vm.evidence.notes.value).toEqual(["NOTE"]);

    expect(vm.evidence.signals.kind).toBe("present");
    expect(vm.evidence.signals.value).toEqual(["SIG"]);
  });

  it("emits missing when evidence not emitted", () => {
    const vm = adaptAnalysisToTelemetryVM({ word: "x" });

    expect(vm.evidence.normalizationSteps.kind).toBe("missing");
    expect(vm.evidence.ops.kind).toBe("missing");
    expect(vm.evidence.notes.kind).toBe("missing");
    expect(vm.evidence.signals.kind).toBe("missing");
  });
});
