import {
  GET,
} from "../app/api/analyze-v1/route";

import {
  discoverStructuralHypothesesV0_1,
} from "../src/shared/structuralHypothesisDiscovery.v0_1";

function structuralEmbryos(
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

async function analyze(
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

function liveStructuralCandidates(
  body: any,
): any[] {
  return Array.isArray(
    body?.candidates,
  )
    ? body.candidates.filter(
        (candidate: any) =>
          candidate?.sourceKind ===
          "logic_derived_structural_hypothesis",
      )
    : [];
}

describe(
  "ZË-RO minimum structural anchor and public gap projection v0.1",
  () => {
    it(
      "keeps the size-2 STERILE anchor and its larger sibling",
      () => {
        expect(
          structuralEmbryos(
            "sterile",
          ),
        ).toEqual([
          "ER",
          "ERILE",
        ]);
      },
    );

    it(
      "keeps the independent STER genericity anchor",
      () => {
        expect(
          structuralEmbryos(
            "ster",
          ),
        ).toEqual([
          "ER",
        ]);
      },
    );

    it(
      "keeps the canonical Y and Ë size-2 anchor",
      () => {
        expect(
          structuralEmbryos(
            "syë",
          ),
        ).toEqual([
          "YË",
        ]);
      },
    );

    it(
      "keeps generic size-2 structural search independent from public evidence ownership",
      () => {
        expect(
          structuralEmbryos(
            "damage",
          ),
        ).toEqual([
          "AM",
        ]);

        expect(
          structuralEmbryos(
            "gjak",
          ),
        ).toEqual([
          "AK",
        ]);
      },
    );

    it.each([
      ["study", "UDY"],
      ["father", "ATH"],
      [
        "philosophy",
        "ILOSOPHY",
      ],
      [
        "mathematics",
        "ATHEMAT",
      ],
      ["language", "ANGU"],
      ["terror", "ERR"],
      ["sister", "IST"],
    ] as const)(
      "does not emit %s family when minimum terminal %s never reaches the size-2 grammar floor",
      (
        word,
        terminal,
      ) => {
        expect(
          structuralEmbryos(
            word,
          ),
        ).not.toContain(
          terminal,
        );
      },
    );

    it(
      "only marks size-2 emitted anchors as minimum_defensible_embryo_reached",
      () => {
        for (
          const word of [
            "sterile",
            "ster",
            "syë",
            "damage",
            "gjak",
          ]
        ) {
          const hypotheses =
            discoverStructuralHypothesesV0_1(
              word,
            );

          for (
            const hypothesis of
            hypotheses
          ) {
            if (
              hypothesis
                .reasonCodes
                .includes(
                  "minimum_defensible_embryo_reached",
                )
            ) {
              expect(
                hypothesis
                  .embryoSize,
              ).toBe(2);
            }
          }
        }
      },
    );

    it.each([
      "study",
      "father",
      "damage",
    ])(
      "does not publicly project lower-precedence structural discovery beside stronger truth for %s",
      async (word) => {
        const body =
          await analyze(word);

        expect(
          liveStructuralCandidates(
            body,
          ),
        ).toEqual([]);
      },
    );

    it(
      "preserves established study and damage candidate counts",
      async () => {
        const study =
          await analyze(
            "study",
          );

        const damage =
          await analyze(
            "damage",
          );

        expect(
          study.candidates,
        ).toHaveLength(4);

        expect(
          damage.candidates,
        ).toHaveLength(3);
      },
    );

    it(
      "keeps STERILE minimum-anchor structural projection while bounded research owns aggregate status",
      async () => {
        const body =
          await analyze(
            "sterile",
          );

        expect(
          body
            .analysisStatusV0_1
            .status,
        ).toBe(
          "research_functional_hypothesis",
        );

        expect(
          body
            .analysisStatusV0_1
            .researchHypothesisEmbryos,
        ).toEqual([
          "ER",
        ]);

        expect(
          body
            .analysisStatusV0_1
            .structuralTokens,
        ).toEqual([]);

        expect(
          liveStructuralCandidates(
            body,
          ).map(
            (candidate) =>
              candidate.embryo,
          ),
        ).toEqual([
          "ER",
          "ERILE",
        ]);
      },
    );

    it(
      "allows the generic size-2 GJAK anchor to fill an unsupported gap without assigning meaning",
      async () => {
        const body =
          await analyze(
            "gjak",
          );

        const structural =
          liveStructuralCandidates(
            body,
          );

        expect(
          structural.map(
            (candidate) =>
              candidate.embryo,
          ),
        ).toEqual([
          "AK",
        ]);

        expect(
          structural[0]
            ?.independentStandaloneMeaning,
        ).toBeNull();

        expect(
          structural[0]
            ?.candidateTruthClaim,
        ).toBe(
          "not_claimed",
        );
      },
    );

    it.each([
      "philosophy",
      "mathematics",
      "language",
      "terror",
      "sister",
    ])(
      "keeps unsupported non-floor family %s out of the public structural surface",
      async (word) => {
        const body =
          await analyze(word);

        expect(
          liveStructuralCandidates(
            body,
          ),
        ).toEqual([]);

        expect(
          body
            .analysisStatusV0_1
            .status,
        ).not.toBe(
          "structural_unreviewed",
        );
      },
    );

    it(
      "preserves the TERROR no-ER no-TER boundary",
      async () => {
        const body =
          await analyze(
            "terror",
          );

        const embryos =
          liveStructuralCandidates(
            body,
          ).map(
            (candidate) =>
              candidate.embryo,
          );

        expect(
          embryos,
        ).not.toContain("ER");

        expect(
          embryos,
        ).not.toContain("TER");
      },
    );
  },
);
