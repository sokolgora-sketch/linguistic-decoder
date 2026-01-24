import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";

describe("Instrument VM: sevenPrinciplesSpectrum (v0.1)", () => {
  it("computes spectrum from voicePathSurface + voicePathFunctional without raw payload", () => {
    const payload: any = {
      // Minimal fields contractAdapter already reads safely
      evidence: {
        surfaceVowelsRaw: ["U", "Y"], // surface
        surfaceVowels: ["U", "I"],    // functional/detected
      },
      meta: { engineVersion: "test", created: "now" },
      mode: "strict",
      sanitized: "study",
      heart: { principlePath: ["U", "I"] },
    };

    const vm: any = adaptAnalysisToTelemetryVM(payload);

    expect(vm).toBeTruthy();
    expect(vm.readout).toBeTruthy();
    expect(vm.readout.sevenPrinciplesSpectrum).toBeTruthy();

    const s = vm.readout.sevenPrinciplesSpectrum.surface;
    const f = vm.readout.sevenPrinciplesSpectrum.functional;

    expect(s.kind).toBe("present");
    expect(f.kind).toBe("present");

    expect(s.value.vowels).toEqual(["U", "Y"]);
    expect(f.value.vowels).toEqual(["U", "I"]);

    // O is 4; ensure indices are 1..7 numbers
    expect(Array.isArray(s.value.indices1)).toBe(true);
    expect(s.value.indices1.every((n: any) => typeof n === "number" && n >= 1 && n <= 7)).toBe(true);
  });
});
