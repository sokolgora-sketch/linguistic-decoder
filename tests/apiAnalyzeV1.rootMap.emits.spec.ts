import { analyzeWordV1 } from "@/engine/analyzeWordV1";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

describe("analyze-v1 emits rootMap (v0.1)", () => {
  it("includes top-level rootMap key (even if empty)", async () => {
    const payload = await analyzeWordV1("damage", { mode: "strict" } as any);
    const out = enginePayloadToAnalysisResult(payload as any) as any;
    expect(Object.prototype.hasOwnProperty.call(out, "rootMap")).toBe(true);
    expect(out.rootMap).toBeTruthy();
    expect(out.rootMap.tokens).toBeDefined();
    expect(out.rootMap.keys).toBeDefined();
  });
});
