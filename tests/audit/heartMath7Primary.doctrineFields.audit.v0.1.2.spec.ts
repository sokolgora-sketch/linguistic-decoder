import { analyzeWordV1 } from "@/engine/analyzeWordV1";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

describe("audit v0.1.2 — heart.math7.primary emits doctrine numeric fields", () => {
  it("study strict exposes both 0..6 and 1..7 representations consistently", async () => {
    const payload: any = await analyzeWordV1("study", { mode: "strict" } as any);
    const out: any = enginePayloadToAnalysisResult(payload);

    const m = out?.heart?.math7?.primary;
    expect(m).toBeTruthy();

    // Vowels are the truth basis here.
    expect(m.vowels).toEqual(["U", "Y"]);

    // Internal index representation (0..6)
    expect(m.indices0to6).toEqual([4, 5]);
    expect(m.sum0to6).toBe(9);
    expect(m.totalMod7).toBe(2);

    // Public doctrine representation (1..7)
    expect(m.values1to7).toEqual([5, 6]);
    expect(m.rawSum1to7).toBe(11);

    // total1to7 derived from sum0to6 deterministically: ((sum0to6 mod 7) + 1)
    expect(m.total1to7).toBe(3);

    // Back-compat aliases (until removed)
    expect(m.indices).toEqual([4, 5]);
    expect(m.sum).toBe(9);
  });
});
