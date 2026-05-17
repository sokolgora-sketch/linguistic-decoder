import { buildEvidenceSummaryTextFromVM } from "@/ui/telemetry/buildEvidenceSummaryTextFromVM";

describe("buildEvidenceSummaryTextFromVM", () => {
  it("builds a readable VM-only evidence summary with boundary language", () => {
    const vm: any = {
      readout: {
        word: "study",
        normalizedWord: { kind: "present", value: "study" },
        mode: { kind: "present", value: "strict" },
        strictInput: { kind: "present", value: true },
        engineVersion: { kind: "present", value: "0.2.0-symbolic" },
        voicePath: { kind: "present", value: ["U", "I"] },
        voicePathSurface: { kind: "present", value: ["U", "Y"] },
        voicePathFunctional: { kind: "present", value: ["U", "I"] },
        voicePathDelta: "DIVERGE",
        counts: {
          candidates: 2,
          ops: { kind: "present", value: 0 },
          notes: { kind: "present", value: 0 },
          signals: { kind: "present", value: 7 },
        },
      },
    };

    const text = buildEvidenceSummaryTextFromVM(vm, {
      candidateRows: [
        { id: "1", language: "Latin", form: "studium", sourceKind: "SEED", vowelPath: "U-I", raw: {} },
        { id: "2", language: "Albanian", form: "studim", sourceKind: "SEED", vowelPath: "U-I", raw: {} },
      ],
      ledgerModel: {
        sections: [
          { key: "normalization", title: "Normalization", state: "present", items: ["UY -> UI"] },
          { key: "ops", title: "Ops / Transforms", state: "none", items: [] },
          { key: "signals", title: "Signals / Notes", state: "present", items: ["base_raw=UY"] },
        ],
      },
    });

    expect(text).toContain("ZË-RO Instrument Summary");
    expect(text).toContain("word=study");
    expect(text).toContain("normalized=study");
    expect(text).toContain("voicePath=U-I");
    expect(text).toContain("surfacePath=U-Y");
    expect(text).toContain("functionalPath=U-I");
    expect(text).toContain("candidateSources=SEED x2");
    expect(text).toContain("candidatePaths=2/2");
    expect(text).toContain("ledger.normalization=present; items=1");
    expect(text).toContain("ledger.ops=none; items=0");
    expect(text).toContain("boundary=deterministic inspection; not origin proof; no single winner");
  });

  it("does not read raw VM payload fields", () => {
    const poisonedRaw = new Proxy(
      {},
      {
        get() {
          throw new Error("raw payload was read");
        },
        ownKeys() {
          throw new Error("raw payload was enumerated");
        },
      }
    );

    const text = buildEvidenceSummaryTextFromVM({
      raw: poisonedRaw,
      readout: {
        word: "safe",
        counts: { candidates: 0 },
      },
    });

    expect(text).toContain("word=safe");
    expect(text).toContain("boundary=deterministic inspection; not origin proof; no single winner");
  });
});
