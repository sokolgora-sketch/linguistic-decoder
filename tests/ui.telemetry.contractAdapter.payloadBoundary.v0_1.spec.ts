import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";

describe("contractAdapter payload boundary v0.1", () => {
  it("does not depend on arguments[0] tricks and remains stable on unknown input shapes", () => {
    const vm = adaptAnalysisToTelemetryVM({
      word: "study",
      primaryPath: { voicePath: ["U", "I"] },
      heartPrimaryPath: ["U", "I"],
      heartInstrumentV1: { surfaceVowels: ["U", "Y"] },
      evidence: { surfaceVowels: ["U", "I"], surfaceVowelsRaw: ["U", "Y"] },
      raw: { evidence: { vowelPath: ["U", "I"] } },
    });

    expect(vm.readout.word).toBe("study");
    expect(vm.readout.voicePath.kind).toBe("present");
    expect(vm.readout.voicePathSurface?.kind).toBe("present");
    expect(vm.readout.voicePathFunctional?.kind).toBe("present");

    if (vm.readout.voicePath.kind === "present") {
      expect(vm.readout.voicePath.value).toEqual(["U", "I"]);
    }
    if (vm.readout.voicePathSurface?.kind === "present") {
      expect(vm.readout.voicePathSurface.value).toEqual(["U", "Y"]);
    }
    if (vm.readout.voicePathFunctional?.kind === "present") {
      expect(vm.readout.voicePathFunctional.value).toEqual(["U", "I"]);
    }
  });

  it("keeps missing states stable when payload is nullish or malformed", () => {
    const vm = adaptAnalysisToTelemetryVM(null);

    expect(vm.readout.voicePath.kind).toBe("missing");
    expect(vm.readout.engineVersion.kind).toBe("missing");
    expect(vm.rootMap.kind).toBe("missing");
  });
});
