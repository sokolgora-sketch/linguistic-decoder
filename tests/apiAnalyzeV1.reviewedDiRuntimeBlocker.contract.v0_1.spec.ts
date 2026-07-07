import { analyzeWordV1 } from "@/engine/analyzeWordV1";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

async function analyze(word: string): Promise<any> {
  const payload = await analyzeWordV1(word, { mode: "strict" } as any);
  return enginePayloadToAnalysisResult(payload as any) as any;
}

function rootMapEvidenceText(out: any): string {
  return JSON.stringify(out?.rootMap ?? {});
}

describe("analyze-v1 reviewed DI runtime blocker contract v0.1", () => {
  it("keeps di as a live DI RootMap key while reviewed DI runtime projection remains blocked", async () => {
    const out = await analyze("di");
    const di = out.rootMap?.keys?.find((key: any) => key?.token === "DI");
    const evidence = rootMapEvidenceText(out);

    expect(di).toBeTruthy();
    expect(di?.language).toBe("sq");
    expect(di?.gloss).toContain("know");
    expect(evidence).toContain("sq: di");
    expect(evidence).toContain("gloss: I know");

    expect(evidence).not.toContain("reviewed.external.di.knowledge.candidate.v0_1");
    expect(evidence).not.toContain("reviewed functional free-operator evidence: di");
    expect(evidence).not.toContain("Direct DPEWA/FGJSH locator");
  });

  it("keeps study on ordinary DI carrier evidence only and does not project reviewed DI runtime evidence", async () => {
    const out = await analyze("study");
    const di = out.rootMap?.keys?.find((key: any) => key?.token === "DI");
    const evidence = rootMapEvidenceText(out);

    expect(di).toBeTruthy();
    expect(evidence).toContain("sq: di");
    expect(evidence).toContain("gloss: I know");

    expect(evidence).not.toContain("reviewed.external.di.knowledge.candidate.v0_1");
    expect(evidence).not.toContain("reviewed functional free-operator evidence: di");
    expect(evidence).not.toContain("Direct DPEWA/FGJSH locator");
  });
});
