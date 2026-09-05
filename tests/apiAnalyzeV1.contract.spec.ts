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

describe("live candidate envelope contract", () => {
  const base = {
    word: "study",
    sanitized: "study",
    engineVersion: "test",
    mode: "strict",
    alphabet: "auto",
    candidates: [
      {
        id: "legacy-seed",
        language: "Latin",
        form: "studium",
        status: "experimental",
        confidenceTag: "solid",
        fitTag: "strong",
        candidateId: "latin-studium-seed-context",
        displayForm: "Latin studium seed context",
        candidateLanguage: "Latin",
        claimType: "seedPairing",
        originClaim: "not_claimed",
        historicalRelation: "context_only",
        embryo: "studium",
        embryoSize: 7,
        embryoLanguage: "Latin",
        isolatedStandaloneForm: null,
        plainStandaloneGloss: null,
        sourceNote: null,
        segmentation: null,
        semanticBridge: null,
        expansionChain: ["studium", "study"],
        validationOutcome: "not_evaluated",
        validationReasons: ["sourceKind_seed_not_validation"],
        rankGroup: "surfaceOrSeedOnly",
        rankScore: 30,
        rankReason: "seed pairing only; sourceKind SEED is not validation",
        claimBoundary: "not historical origin or validated functional motivation",
        userDecisionPosture: "user_decides",
      },
    ],
  };

  it("validates the additive envelope while preserving legacy fields", () => {
    const projected = toAnalyzeWordResultV1Contract(base);

    expect(projected.candidates?.[0]).toMatchObject({
      status: "experimental",
      confidenceTag: "solid",
      fitTag: "strong",
      validationOutcome: "not_evaluated",
      rankGroup: "surfaceOrSeedOnly",
    });
  });

  it("rejects a live candidate missing an embryo-first field", () => {
    const malformed = {
      ...base,
      candidates: [
        {
          ...(base.candidates[0] as Record<string, unknown>),
          sourceNote: undefined,
        },
      ],
    };

    expect(() => toAnalyzeWordResultV1Contract(malformed)).toThrow();
  });
});
