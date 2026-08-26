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

async function analyze(
  word: string,
): Promise<any> {
  const response =
    await GET(
      new Request(
        "http://localhost/api/analyze-v1?word=" +
          encodeURIComponent(word) +
          "&mode=strict&alphabet=auto",
      ),
    );

  expect(
    response.status,
  ).toBe(200);

  return response.json();
}

function structuralCandidates(
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
  "ZË-RO structural Unicode normalization v0.1",
  () => {
    it.each([
      "résumé",
      "naïve",
      "café",
      "über",
      "μέτρο",
    ])(
      "does not partially delete unsupported Unicode letters while discovering %s",
      (word) => {
        expect(
          embryos(word),
        ).toEqual([]);
      },
    );

    it(
      "does not manufacture RSUM -> UM from résumé",
      async () => {
        const body =
          await analyze(
            "résumé",
          );

        expect(
          body
            .analysisStatusV0_1
            .status,
        ).toBe(
          "null_no_supported_candidate",
        );

        expect(
          body
            .analysisStatusV0_1
            .structuralTokens,
        ).toEqual([]);

        expect(
          structuralCandidates(
            body,
          ),
        ).toEqual([]);

        expect(
          JSON.stringify(body),
        ).not.toContain(
          "logic-structural:rsum:um",
        );
      },
    );

    it(
      "keeps ASCII resume distinct from résumé rather than transliterating",
      () => {
        expect(
          embryos("resume"),
        ).toContain("ES");

        expect(
          embryos("résumé"),
        ).toEqual([]);
      },
    );

    it(
      "continues stripping punctuation around supported Latin input",
      async () => {
        const body =
          await analyze(
            "study!",
          );

        expect(
          body
            .analysisStatusV0_1
            .status,
        ).toBe(
          "reviewed_functional_evidence",
        );

        expect(
          body
            .analysisStatusV0_1
            .reviewedOperators,
        ).toContain("DI");
      },
    );

    it(
      "preserves canonical Y and Ë with punctuation",
      () => {
        expect(
          embryos("SYË!"),
        ).toEqual([
          "YË",
        ]);
      },
    );

    it(
      "preserves STERILE structural discovery",
      () => {
        expect(
          embryos("sterile"),
        ).toEqual([
          "ER",
          "ERILE",
        ]);
      },
    );
  },
);
