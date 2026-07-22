import { AnalyzeWordResultV1ContractSchema, toAnalyzeWordResultV1Contract } from "@/shared/analyzeWordResult.v1.contract";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";

describe("analyze-v1 contract (seam test)", () => {
  it("enginePayloadToAnalysisResult output conforms to strict V1 contract after normalization", async () => {
    const payload = await runAnalysisDeterministic("study", { mode: "strict", alphabet: "auto" });

    const outRaw: any = enginePayloadToAnalysisResult(payload);

    // Keep parity with the route’s defensive rule.
    if (typeof outRaw.sanitized !== "string" || outRaw.sanitized.length === 0) {
      outRaw.sanitized = (payload as any)?.sanitized ?? payload.word;
    }

    const out = toAnalyzeWordResultV1Contract(outRaw);

    // Assert with schema again (explicit)
    const parsed = AnalyzeWordResultV1ContractSchema.safeParse(out);
    if (!parsed.success) {
      console.error(parsed.error.format());
    }
    expect(parsed.success).toBe(true);
  });
});

describe("analysisStatusV0_1 strict contract projection", () => {
  it("preserves a valid status object and rejects an invalid status code", async () => {
    const payload = await runAnalysisDeterministic("study", {
      mode: "strict",
      alphabet: "auto",
    });

    const outRaw: any =
      enginePayloadToAnalysisResult(payload);

    if (
      typeof outRaw.sanitized !== "string" ||
      outRaw.sanitized.length === 0
    ) {
      outRaw.sanitized =
        (payload as any)?.sanitized ??
        payload.word;
    }

    const projected =
      toAnalyzeWordResultV1Contract(outRaw);

    expect(
      projected.analysisStatusV0_1,
    ).toEqual(
      outRaw.analysisStatusV0_1,
    );

    expect(
      projected.analysisStatusV0_1?.status,
    ).toBe("reviewed_functional_evidence");

    const malformed = {
      ...projected,
      analysisStatusV0_1: {
        ...projected.analysisStatusV0_1,
        status: "unsupported_status_code",
      },
    };

    expect(
      AnalyzeWordResultV1ContractSchema.safeParse(
        malformed,
      ).success,
    ).toBe(false);
  });
});
