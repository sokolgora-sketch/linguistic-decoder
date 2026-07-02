import { analyzeWordV1 } from "@/engine/analyzeWordV1";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

describe("analyze-v1 reviewed DA runtime projection wiring v0.1", () => {
  it("surfaces reviewed Gheg DA as functional free-operator RootMap evidence without history claims", async () => {
    const payload = await analyzeWordV1("mode", { mode: "strict" } as any);
    const out = enginePayloadToAnalysisResult(payload as any) as any;
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

  it("keeps reviewed DI locator-packaging lane absent from runtime reviewed projection evidence", async () => {
    const payload = await analyzeWordV1("study", { mode: "strict" } as any);
    const out = enginePayloadToAnalysisResult(payload as any) as any;
    const evidence = JSON.stringify(out.rootMap ?? {});

    expect(evidence).not.toContain("reviewed.external.di.knowledge.candidate.v0_1");
    expect(evidence).not.toContain("reviewed functional free-operator evidence: di");
    expect(evidence).not.toContain("Direct DPEWA/FGJSH locator");
  });
});
