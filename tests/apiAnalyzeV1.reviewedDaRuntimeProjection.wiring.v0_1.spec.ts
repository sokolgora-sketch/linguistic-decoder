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

  it("surfaces bounded reviewed DI evidence through the existing RootMap projection path", async () => {
    const payload = await analyzeWordV1(
      "study",
      { mode: "strict" } as any,
    );

    const out =
      enginePayloadToAnalysisResult(payload as any) as any;

    const di = out.rootMap?.keys?.find(
      (key: any) => key?.token === "DI",
    );

    const evidence = Array.isArray(di?.evidence)
      ? di.evidence.join("\n")
      : "";

    expect(di).toBeTruthy();
    expect(evidence).toContain(
      "reviewed functional free-operator evidence",
    );
    expect(evidence).toContain(
      "https://en.wiktionary.org/wiki/di#Albanian",
    );
    expect(evidence).toContain(
      "historicalOriginClaim=not_claimed",
    );
    expect(evidence).toContain(
      "userDecisionPosture=user_decides",
    );

    expect(evidence).not.toContain(
      "10.3765/plsa.v8i1.5501",
    );
    expect(evidence).not.toContain(
      "Direct DPEWA/FGJSH locator",
    );
  });
});
