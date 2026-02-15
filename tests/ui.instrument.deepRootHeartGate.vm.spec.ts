import { adaptAnalysisToTelemetryVM } from "@/ui/telemetry/contractAdapter";

describe("TelemetryVM: DeepRoot–Heart Alignment Gate v0.1 (adapter wiring)", () => {
  test("adds deepRootHeartGate per candidate; aligned vs misaligned", () => {
    const payload: any = {
      word: "study",
      primaryPath: { voicePath: ["U", "I"] }, // pickVoicePaths normalizes to "U-I"
      candidates: [
        { id: "c1", language: "en", form: "study", vowelPath: "U-I" }, // aligned
        { id: "c2", language: "sq", form: "shtu-da", vowelPath: "U-A" }, // misaligned
      ],
      evidence: { normalizationSteps: [], ops: [], notes: [], signals: [] },
      originClaimGates: { active: false },
    };

    const vm: any = adaptAnalysisToTelemetryVM(payload);

    expect(vm.candidates).toHaveLength(2);

    expect(vm.candidates[0].deepRootHeartGate.kind).toBe("present");
    expect(vm.candidates[0].deepRootHeartGate.value.status).toBe("aligned");

    expect(vm.candidates[1].deepRootHeartGate.kind).toBe("present");
    expect(vm.candidates[1].deepRootHeartGate.value.status).toBe("misaligned");
    expect(vm.candidates[1].deepRootHeartGate.value.reasonCodes).toEqual(["TERMINAL_VOWEL_CONFLICT"]);
  });

  test("insufficient_data when candidate vowelPath missing", () => {
    const payload: any = {
      word: "x",
      primaryPath: { voicePath: ["U", "I"] },
      candidates: [{ id: "c1", language: "en", form: "x" }],
      evidence: { normalizationSteps: [], ops: [], notes: [], signals: [] },
      originClaimGates: { active: false },
    };

    const vm: any = adaptAnalysisToTelemetryVM(payload);

    expect(vm.candidates).toHaveLength(1);
    const gate = vm.candidates[0].deepRootHeartGate.value;

    expect(gate.status).toBe("insufficient_data");
    expect(gate.reasonCodes).toEqual(["DEEPROOT_FUNCTIONAL_PATH_MISSING"]);
  });
});
