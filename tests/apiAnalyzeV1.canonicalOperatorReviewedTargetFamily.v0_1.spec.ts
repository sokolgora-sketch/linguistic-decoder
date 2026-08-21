import {
  analyzeWordV1,
} from "@/engine/analyzeWordV1";

import {
  enginePayloadToAnalysisResult,
} from "@/shared/analysisAdapter";

type CanonicalOperator =
  | "DA"
  | "DI"
  | "AT";

async function analyze(
  word: string,
): Promise<any> {
  const payload =
    await analyzeWordV1(
      word,
      {
        mode: "strict",
      } as any,
    );

  return enginePayloadToAnalysisResult(
    payload as any,
  ) as any;
}

function rootKey(
  out: any,
  operatorId: CanonicalOperator,
): any {
  return out
    ?.rootMap
    ?.keys
    ?.find(
      (key: any) =>
        key?.token === operatorId,
    );
}

function reviewedEvidence(
  out: any,
  operatorId: CanonicalOperator,
): string {
  const key =
    rootKey(
      out,
      operatorId,
    );

  return Array.isArray(
    key?.evidence,
  )
    ? key.evidence.join("\n")
    : "";
}

function reviewedOperators(
  out: any,
): readonly string[] {
  return Array.isArray(
    out
      ?.analysisStatusV0_1
      ?.reviewedOperators,
  )
    ? out
        .analysisStatusV0_1
        .reviewedOperators
    : [];
}

describe(
  "analyze-v1 canonical reviewed target-family boundary v0.1",
  () => {
    it.each([
      ["studies", "DI"],
      ["studied", "DI"],
      ["studying", "DI"],

      ["damages", "DA"],
      ["damaged", "DA"],
      ["damaging", "DA"],

      ["fathers", "AT"],
      ["fatherhood", "AT"],
      ["fatherly", "AT"],
    ] as const)(
      "%s surfaces reviewed %s evidence through the shared family bridge",
      async (
        word,
        operatorId,
      ) => {
        const out =
          await analyze(word);

        const key =
          rootKey(
            out,
            operatorId,
          );

        const evidence =
          reviewedEvidence(
            out,
            operatorId,
          );

        expect(key).toBeTruthy();

        expect(
          evidence,
        ).toContain(
          "reviewed functional free-operator evidence",
        );

        expect(
          reviewedOperators(out),
        ).toContain(
          operatorId,
        );
      },
    );

    it.each([
      ["study", "DI"],
      ["damage", "DA"],
      ["father", "AT"],
    ] as const)(
      "preserves baseline %s reviewed %s truth",
      async (
        word,
        operatorId,
      ) => {
        const out =
          await analyze(word);

        expect(
          reviewedEvidence(
            out,
            operatorId,
          ),
        ).toContain(
          "reviewed functional free-operator evidence",
        );

        expect(
          reviewedOperators(out),
        ).toContain(
          operatorId,
        );
      },
    );

    it.each([
      ["database", "DA"],
      ["data", "DA"],
      ["daisy", "DA"],

      ["digital", "DI"],
      ["dinner", "DI"],
      ["dij", "DI"],
      ["dije", "DI"],
      ["dit", "DI"],

      ["at", "AT"],
      ["atom", "AT"],
      ["atlas", "AT"],
      ["attic", "AT"],

      ["river", "DA"],
      ["stone", "DI"],
      ["music", "AT"],
    ] as const)(
      "%s does not receive reviewed %s evidence",
      async (
        word,
        operatorId,
      ) => {
        const out =
          await analyze(word);

        expect(
          reviewedEvidence(
            out,
            operatorId,
          ),
        ).not.toContain(
          "reviewed functional free-operator evidence",
        );

        expect(
          reviewedOperators(out),
        ).not.toContain(
          operatorId,
        );
      },
    );

    it.each([
      ["studyhood", "DI"],
      ["studyly", "DI"],
      ["studys", "DI"],
      ["studyed", "DI"],
      ["studims", "DI"],
      ["studimhood", "DI"],
      ["studimly", "DI"],

      ["damagehood", "DA"],
      ["damagely", "DA"],
      ["damageing", "DA"],
      ["damagement", "DA"],

      ["fathering", "AT"],
      ["fathered", "AT"],
      ["fatherhoods", "AT"],
      ["fatherliness", "AT"],
    ] as const)(
      "%s does not receive undeclared reviewed %s family evidence",
      async (
        word,
        operatorId,
      ) => {
        const out =
          await analyze(word);

        expect(
          reviewedEvidence(
            out,
            operatorId,
          ),
        ).not.toContain(
          "reviewed functional free-operator evidence",
        );

        expect(
          reviewedOperators(out),
        ).not.toContain(
          operatorId,
        );
      },
    );

    it.each([
      ["studies", "DI"],
      ["studied", "DI"],
      ["studying", "DI"],
      ["damages", "DA"],
      ["damaged", "DA"],
      ["damaging", "DA"],
      ["fathers", "AT"],
      ["fatherhood", "AT"],
      ["fatherly", "AT"],
    ] as const)(
      "%s does not leak reviewed truth into another canonical operator",
      async (
        word,
        expectedOperator,
      ) => {
        const out =
          await analyze(word);

        for (
          const operatorId
          of ["DA", "DI", "AT"] as const
        ) {
          if (
            operatorId ===
            expectedOperator
          ) {
            continue;
          }

          expect(
            reviewedEvidence(
              out,
              operatorId,
            ),
          ).not.toContain(
            "reviewed functional free-operator evidence",
          );

          expect(
            reviewedOperators(out),
          ).not.toContain(
            operatorId,
          );
        }
      },
    );
  },
);
