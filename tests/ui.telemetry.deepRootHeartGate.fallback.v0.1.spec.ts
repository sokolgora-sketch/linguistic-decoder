import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";

describe("DeepRoot–Heart gate: adapter fallbacks (v0.1)", () => {
  test("blank-ish heartPrimaryPath does not block fallback to detected", () => {
    const vm: any = adaptAnalysisToTelemetryVM({
      word: "x",
      heartPrimaryPath: " ", // should clean to null
      primaryPath: { voicePath: ["U", "I"] }, // gives detected fallback
      evidence: {
        surfaceVowels: ["U", "I"],
        surfaceVowelsRaw: ["U", "I"],
      },
      candidates: [{ language: "Latin", form: "x", vowelPath: "U-I" }],
    });

    const gate = vm?.candidates?.[0]?.deepRootHeartGate;
    expect(gate?.kind).toBe("present");
    expect(gate?.value?.status).toBe("aligned");
  });

  test("blank-ish candidate vowelPath falls back to deepRoot functional path", () => {
    const vm: any = adaptAnalysisToTelemetryVM({
      word: "x",
      heartPrimaryPath: "U-I",
      deepRoot: { functionalRoots: [{ vowelPath: "U→I" }] },
      candidates: [{ language: "Latin", form: "x", vowelPath: " " }],
    });

    const gate = vm?.candidates?.[0]?.deepRootHeartGate;
    expect(gate?.kind).toBe("present");
    expect(gate?.value?.status).toBe("aligned");
    expect(gate?.value?.evidenceRefs ?? []).toContain("deepRoot.functionalRoots[0].vowelPath");
  });
});
