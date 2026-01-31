import { buildEvidencePackageFromVM } from "@/ui/telemetry/buildEvidencePackageFromVM";

describe("evidence package v0.1 (VM-only)", () => {
  it("builds a stable minimal bundle from VM", () => {
    const vm: any = {
      wordShown: "study",
      engineVersion: "v0.1.2",
      mode: "strict",
      signals: [{}, {}],
      readout: {
        word: "study",
        normalizedWord: "study",
        voicePath: ["U", "I"],
        voicePathSurface: ["U", "Y"],
        voicePathFunctional: ["U", "I"],
        voicePathDelta: "U→Y vs U→I",
      },
      originClaim: { kind: "missing", missing: "not_emitted" },
      rootMap: { kind: "missing", missing: "not_emitted", note: "rootMap" },
    };

    const pkg = buildEvidencePackageFromVM(vm, { ledgerModel: { entries: [{ k: "e1" }] } });

    // sevenPrinciplesSpectrum must be consumer-safe: no POM wrappers leaked
    if ((pkg as any).sevenPrinciplesSpectrum) {
      expect((pkg as any).sevenPrinciplesSpectrum.surface?.kind).toBeUndefined();
      expect((pkg as any).sevenPrinciplesSpectrum.functional?.kind).toBeUndefined();
    }

    expect(pkg.version).toBe("evidence_package.v0.1");
    expect(pkg.word).toBe("study");
    expect(pkg.engineVersion).toBe("v0.1.2");
    expect(pkg.mode).toBe("strict");
    expect(pkg.summary?.voicePath).toBe("U → I");
    expect(pkg.summary?.signalsCount).toBe(2);
    expect(pkg.ledger).toEqual({ entries: [{ k: "e1" }] });

    // Hard rule: must not invent raw payload fields
    expect((pkg as any).raw).toBeUndefined();
    expect((pkg as any).payload).toBeUndefined();
  });
});
