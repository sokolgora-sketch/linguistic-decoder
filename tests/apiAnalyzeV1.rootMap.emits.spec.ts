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
  it("emits mode DA as Gheg dialect-attested pending review, not gave-supported", async () => {
    const payload = await analyzeWordV1("mode", { mode: "strict" } as any);
    const out = enginePayloadToAnalysisResult(payload as any) as any;

    const da = out.rootMap?.keys?.find((key: any) => key?.token === "DA");
    const evidence = Array.isArray(da?.evidence) ? da.evidence.join("\n") : "";

    expect(da?.status).toBe("dialect_attested_pending_review");
    expect(evidence).toContain("Gheg dialect");
    expect(evidence).toContain("E kom da bukën për gjysë");
    expect(evidence).not.toContain("gave (aorist/part)");
  });

});
