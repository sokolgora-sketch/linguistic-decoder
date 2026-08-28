import {
  GET,
} from "../app/api/analyze-v1/route";

import {
  discoverStructuralHypothesesV0_1,
} from "../src/shared/structuralHypothesisDiscovery.v0_1";

function embryos(
  word: string,
): string[] {
  return (
    discoverStructuralHypothesesV0_1(
      word,
    ).map(
      (hypothesis) =>
        hypothesis.embryo,
    )
  );
}

async function live(
  word: string,
): Promise<any> {
  const response =
    await GET(
      new Request(
        "http://localhost/api/analyze-v1?word=" +
          encodeURIComponent(word) +
          "&mode=strict",
      ),
    );

  expect(
    response.status,
  ).toBe(200);

  return response.json();
}

describe(
  "ZË-RO structural hypothesis defensibility gate v0.1",
  () => {
    it(
      "keeps the multi-step STERILE proving hypotheses",
      () => {
        expect(
          embryos("sterile"),
        ).toEqual([
          "ER",
          "ERILE",
        ]);
      },
    );

    it(
      "keeps the generic two-step STER to TER to ER hypothesis",
      () => {
        expect(
          embryos("ster"),
        ).toContain(
          "ER",
        );
      },
    );

    it(
      "keeps the one-step pure Seven-Voices SYË to YË control",
      () => {
        expect(
          embryos("syë"),
        ).toContain(
          "YË",
        );
      },
    );

    it.each([
      ["xyz", "YZ"],
      ["data", "ATA"],
      ["dij", "IJ"],
      ["mode", "ODE"],
    ])(
      "rejects weak one-step mixed terminal %s -> %s",
      (
        word,
        weakEmbryo,
      ) => {
        expect(
          embryos(word),
        ).not.toContain(
          weakEmbryo,
        );
      },
    );

    it(
      "preserves xyz as a valid live Null",
      async () => {
        const body =
          await live("xyz");

        expect(
          body.analysisStatusV0_1
            .status,
        ).toBe(
          "null_no_supported_candidate",
        );

        expect(
          body.analysisStatusV0_1
            .structuralTokens,
        ).toEqual([]);

        const structural =
          Array.isArray(
            body.candidates,
          )
            ? body.candidates.filter(
                (candidate: any) =>
                  candidate?.sourceKind ===
                  "logic_derived_structural_hypothesis",
              )
            : [];

        expect(
          structural,
        ).toEqual([]);
      },
    );

    it.each([
      {
        word: "damage",
        status:
          "reviewed_functional_evidence",
        tokens: ["DA"],
      },
      {
        word: "study",
        status:
          "reviewed_functional_evidence",
        tokens: [
          "SHTU",
          "DI",
        ],
      },
      {
        word: "data",
        status:
          "candidate_only",
        tokens: [],
      },
      {
        word: "dij",
        status:
          "candidate_only",
        tokens: ["DI"],
      },
      {
        word: "mode",
        status:
          "structural_unreviewed",
        tokens: [
          "M",
          "DA",
        ],
      },
    ])(
      "does not let logic-derived structural candidates contaminate stronger status ownership for $word",
      async ({
        word,
        status,
        tokens,
      }) => {
        const body =
          await live(word);

        expect(
          body.analysisStatusV0_1
            .status,
        ).toBe(status);

        expect(
          body.analysisStatusV0_1
            .structuralTokens,
        ).toEqual(tokens);
      },
    );

    it(
      "keeps STERILE structural hypotheses while higher-precedence bounded research owns aggregate status",
      async () => {
        const body =
          await live(
            "sterile",
          );

        expect(
          body.analysisStatusV0_1
            .status,
        ).toBe(
          "research_functional_hypothesis",
        );

        expect(
          body.analysisStatusV0_1
            .researchHypothesisEmbryos,
        ).toEqual([
          "ER",
        ]);

        expect(
          body.analysisStatusV0_1
            .structuralTokens,
        ).toEqual([]);

        expect(
          body.analysisStatusV0_1
            .reviewedOperators,
        ).toEqual([]);

        expect(
          body.analysisStatusV0_1
            .candidateOnlyOperators,
        ).toEqual([]);

        const structuralEmbryos =
          Array.isArray(
            body.candidates,
          )
            ? body.candidates
                .filter(
                  (candidate: any) =>
                    candidate?.sourceKind ===
                    "logic_derived_structural_hypothesis",
                )
                .map(
                  (candidate: any) =>
                    candidate.embryo,
                )
            : [];

        expect(
          structuralEmbryos,
        ).toEqual([
          "ER",
          "ERILE",
        ]);
      },
    );
  },
);
