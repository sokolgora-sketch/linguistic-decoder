import { analyzeWordV1 } from "@/engine/analyzeWordV1";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

/**
 * v0.1.2 audit — Heart-Primary RootMap alignment (study, strict)
 * We assert against the *public analysis shape* (adapter output), not raw engine payload.
 */
describe("v0.1.2 audit — Heart-Primary RootMap alignment (study, strict)", () => {
  test("study strict: RootMap surfaces SHTU + DI; DA must not be the strict RootMap truth", async () => {
    const payload: any = await analyzeWordV1("study", { mode: "strict" } as any);
    const res: any = enginePayloadToAnalysisResult(payload);

    // RootMap must exist (instrument contract guarantees this key)
    expect(res.rootMap).toBeTruthy();

    const tokens: string[] = Array.isArray(res.rootMap?.tokens)
      ? res.rootMap.tokens.map((t: any) => String(t?.token ?? "")).filter(Boolean)
      : [];

    const keys: string[] = Array.isArray(res.rootMap?.keys)
      ? res.rootMap.keys.map((k: any) => String(k?.token ?? "")).filter(Boolean)
      : [];

    // Strict truth we want:
    expect(tokens).toContain("SHTU");
    expect(tokens).toContain("DI");
    expect(keys).toContain("DI");

    // The failure we are eliminating:
    // Under strict mode, DA (A-family) must not be presented as the strict RootMap terminal token.
    expect(tokens).not.toContain("DA");
    expect(keys).not.toContain("DA");
  });
});
