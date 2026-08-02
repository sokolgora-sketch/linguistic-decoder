import { analyzeWordV1 } from "@/engine/analyzeWordV1";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { RootMapV1Schema } from "@/v1/rootMap.v1.schema";

async function analyze(word: string): Promise<any> {
  const payload = await analyzeWordV1(
    word,
    { mode: "strict" } as any,
  );

  return enginePayloadToAnalysisResult(
    payload as any,
  ) as any;
}

function rootKey(
  result: any,
  token: string,
): any {
  return result.rootMap?.keys?.find(
    (key: any) => key?.token === token,
  );
}

function evidenceText(key: any): string {
  return Array.isArray(key?.evidence)
    ? key.evidence.join("\n")
    : "";
}

describe(
  "RootMap candidate-only key-status authorization v0.1",
  () => {
    it.each([
      ["di", "exact"],
      ["study", "y_to_i"],
    ])(
      "%s keeps reviewed DI supported",
      async (word, expectedOperation) => {
        const result = await analyze(word);
        const di = rootKey(result, "DI");
        const evidence = evidenceText(di);

        expect(di).toBeTruthy();
        expect(di.status).toBe("supported");
        expect(evidence).toContain(
          "reviewed functional free-operator evidence",
        );
        expect(evidence).toContain(
          `ops: ${expectedOperation}`,
        );

        expect(
          result.analysisStatusV0_1?.status,
        ).toBe("reviewed_functional_evidence");

        expect(
          result.analysisStatusV0_1?.reviewedOperators,
        ).toContain("DI");

        expect(
          result.analysisStatusV0_1?.candidateOnlyOperators,
        ).not.toContain("DI");

        expect(
          RootMapV1Schema.safeParse(
            result.rootMap,
          ).success,
        ).toBe(true);
      },
    );

    it.each(["dij", "dije"])(
      "%s exposes DI as candidate_only without reviewed authorization",
      async (word) => {
        const result = await analyze(word);
        const di = rootKey(result, "DI");
        const evidence = evidenceText(di);

        expect(di).toBeTruthy();
        expect(di.status).toBe("candidate_only");

        expect(evidence).not.toContain(
          "reviewed functional free-operator evidence",
        );
        expect(evidence).not.toContain(
          "https://en.wiktionary.org/wiki/di#Albanian",
        );

        expect(
          result.analysisStatusV0_1?.status,
        ).toBe("candidate_only");

        expect(
          result.analysisStatusV0_1?.reviewedOperators,
        ).toEqual([]);

        expect(
          result.analysisStatusV0_1?.candidateOnlyOperators,
        ).toEqual(["DI"]);

        expect(
          result.analysisStatusV0_1?.claimBoundary
            ?.structuralOutputIsCandidateTruth,
        ).toBe(false);

        expect(
          result.analysisStatusV0_1?.claimBoundary
            ?.candidateTruthClaim,
        ).toBe("not_claimed");

        expect(
          result.analysisStatusV0_1?.userDecisionPosture,
        ).toBe("user_decides");

        expect(
          RootMapV1Schema.safeParse(
            result.rootMap,
          ).success,
        ).toBe(true);

        // Raw/top-level HTTP payload parity is verified separately against
        // the live analyze-v1 response; this helper returns the public result.

        const vm: any =
          adaptAnalysisToTelemetryVM(result);

        expect(vm.rootMap?.kind).toBe("present");

        const vmDi =
          vm.rootMap?.value?.keys?.find(
            (key: any) =>
              key?.token === "DI",
          );

        expect(vmDi?.status).toBe(
          "candidate_only",
        );
      },
    );

    it(
      "keeps dit as the weak carrier-only DI control",
      async () => {
        const result = await analyze("dit");
        const di = rootKey(result, "DI");

        expect(di).toBeTruthy();
        expect(di.status).toBe("carrier_only");

        expect(
          result.analysisStatusV0_1?.status,
        ).toBe("candidate_only");

        expect(
          result.analysisStatusV0_1?.candidateOnlyOperators,
        ).toEqual(["DI"]);
      },
    );

    it.each([
      ["mode", "final_swap"],
      ["made", "final_swap"],
      ["dome", "vowel_swap"],
    ])(
      "%s preserves the separate structural-unreviewed DA collision lane",
      async (word, expectedOperation) => {
        const result = await analyze(word);
        const da = rootKey(result, "DA");
        const evidence = evidenceText(da);

        expect(da).toBeTruthy();

        expect(da.status).toBe(
          "dialect_attested_pending_review",
        );

        expect(evidence).toContain(
          `ops: ${expectedOperation}`,
        );

        expect(evidence).not.toContain(
          "reviewed functional free-operator evidence",
        );

        expect(
          result.analysisStatusV0_1?.status,
        ).toBe("structural_unreviewed");

        expect(
          result.analysisStatusV0_1?.reviewedOperators,
        ).toEqual([]);

        expect(
          result.analysisStatusV0_1?.candidateOnlyOperators,
        ).toEqual([]);
      },
    );
  },
);
