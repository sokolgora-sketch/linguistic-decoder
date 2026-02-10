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

  it("unwraps wrapped readout.counts.signals for signalsCount", () => {
    const vm: any = {
      wordShown: "résumé",
      mode: "strict",
      engineVersion: "0.2.0-symbolic",
      // If unwrap breaks, function would incorrectly fall back to these:
      signals: ["wrong_fallback_should_not_win"],
      evidence: {
        signals: ["a", "b", "c", "d"], // wrong (4)
        "signals+notes": ["s1","s2","s3","s4","s5","s6","s7","s8"], // wrong (8)
      },
      readout: {
        word: "résumé",
        mode: "strict",
        engineVersion: "0.2.0-symbolic",
        voicePath: ["U"],
        voicePathSurface: ["E","U","E"],
        voicePathFunctional: ["U"],
        voicePathDelta: "EUE vs U",
        counts: {
          signals: { kind: "present", value: 2 }, // ✅ this must win
        },
      },
    };

    const pkg = buildEvidencePackageFromVM(vm, { ledgerModel: { entries: [{ k: "e1" }] } });
    expect(pkg.summary?.signalsCount).toBe(2);
  });

});
