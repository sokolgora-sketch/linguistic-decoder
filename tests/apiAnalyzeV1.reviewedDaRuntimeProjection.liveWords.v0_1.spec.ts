import { analyzeWordV1 } from "@/engine/analyzeWordV1";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

async function analyze(word: string): Promise<any> {
  const payload = await analyzeWordV1(word, { mode: "strict" } as any);
  return enginePayloadToAnalysisResult(payload as any) as any;
}

function rootMapEvidenceText(out: any): string {
  return JSON.stringify(out?.rootMap ?? {});
}

describe("analyze-v1 reviewed DA runtime projection live words v0.1", () => {
  it("surfaces reviewed DA functional evidence when DA is a live RootMap key", async () => {
    const out = await analyze("da");
    const da = out.rootMap?.keys?.find((key: any) => key?.token === "DA");

    expect(da).toBeTruthy();

    const evidence = Array.isArray(da.evidence) ? da.evidence.join("\n") : "";

    expect(evidence).toContain("reviewed functional free-operator evidence");
    expect(evidence).toContain("Dedvukaj & Ndoci 2023 PLSA");
    expect(evidence).toContain("Example (4), page 3; footnote 1");
    expect(evidence).toContain("10.3765/plsa.v8i1.5501");
    expect(evidence).toContain("historicalOriginClaim=not_claimed");
    expect(evidence).toContain("winnerClaim=not_claimed");
    expect(evidence).toContain("languageSuperiorityClaim=not_claimed");
    expect(evidence).toContain("userDecisionPosture=user_decides");
  });

  it("surfaces reviewed DA functional evidence for damage once bounded DA minRoots is emitted", async () => {
    const out = await analyze("damage");
    const da = out.rootMap?.keys?.find((key: any) => key?.token === "DA");

    expect(da).toBeTruthy();

    const evidence = Array.isArray(da?.evidence) ? da.evidence.join("\n") : "";

    expect(evidence).toContain("reviewed functional free-operator evidence");
    expect(evidence).toContain("Dedvukaj & Ndoci 2023 PLSA");
    expect(evidence).toContain("historicalOriginClaim=not_claimed");
    expect(evidence).toContain("winnerClaim=not_claimed");
    expect(evidence).toContain("languageSuperiorityClaim=not_claimed");
    expect(evidence).toContain("userDecisionPosture=user_decides");
  });

  it("keeps DI reviewed locator-packaging lane absent even when DI is a live RootMap key", async () => {
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
