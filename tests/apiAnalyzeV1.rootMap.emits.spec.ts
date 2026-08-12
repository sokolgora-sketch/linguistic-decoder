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
  it("retains the mode DA token while withholding reviewed evidence for final_swap", async () => {
    const payload = await analyzeWordV1("mode", { mode: "strict" } as any);
    const out = enginePayloadToAnalysisResult(payload as any) as any;

    const da = out.rootMap?.keys?.find((key: any) => key?.token === "DA");
    const evidence = Array.isArray(da?.evidence) ? da.evidence.join("\n") : "";

    expect(da).toBeTruthy();
    expect(da?.status).toBe("dialect_attested_pending_review");
    expect(evidence).toContain("ops: final_swap");
    expect(evidence).toContain("gloss: split / divide / cut");
    expect(evidence).not.toContain(
      "reviewed functional free-operator evidence",
    );
    expect(evidence).not.toContain(
      "reviewed Gheg free-operator evidence",
    );
    expect(evidence).not.toContain("Dedvukaj & Ndoci 2023 PLSA");
    expect(evidence).not.toContain("10.3765/plsa.v8i1.5501");
    expect(evidence).not.toContain("gave (aorist/part)");
  });




  it("emits damage RootMap with bounded DA key", async () => {
    const payload = await analyzeWordV1("damage", { mode: "strict" } as any);
    const out = enginePayloadToAnalysisResult(payload as any) as any;

    const da = out.rootMap?.keys?.find((key: any) => key?.token === "DA");
    const evidence = Array.isArray(da?.evidence) ? da.evidence.join("\n") : "";

    expect(da).toBeTruthy();
    expect(da?.status).toBe("supported");
    expect(evidence).toContain("reviewed Gheg free-operator evidence");
    expect(evidence).toContain("Dedvukaj & Ndoci 2023 PLSA");
    expect(evidence).not.toContain("gave (aorist/part)");
  });

});
