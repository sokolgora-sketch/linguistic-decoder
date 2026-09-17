import {
  GET,
} from "../app/api/analyze-v1/route";

import { readFileSync } from "node:fs";

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

function frozenCorpusWords(): string[] {
  const files = [
    "tests/research/albanian200.words.v0.1.txt",
    "tests/research/classical100.words.v0.1.txt",
  ];
  const seen = new Set<string>();

  return files.flatMap((file) =>
    readFileSync(file, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split(/\s+/u)[1] ?? "")
      .map((word) => word.normalize("NFC"))
      .filter((word) => word.length > 0)
      .filter((word) => {
        if (seen.has(word)) return false;
        seen.add(word);
        return true;
      }),
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

    it(
      "emits a defensible size-3 minimum anchor without changing the pre-gate rules",
      () => {
        const discovered =
          discoverStructuralHypothesesV0_1(
            "kripë",
          );

        expect(
          discovered.map(
            (hypothesis) => hypothesis.embryo,
          ),
        ).toEqual(["IPË"]);

        expect(
          discovered[0]?.embryoSize,
        ).toBe(3);

        expect(
          discovered[0]?.reductionSteps.at(-1)
            ?.voicePathAfter,
        ).toEqual(["I", "Ë"]);

        expect(
          discovered[0]?.reasonCodes,
        ).toContain(
          "minimum_defensible_embryo_reached",
        );
      },
    );

    it(
      "measures the frozen target-blind corpus without converting pre-gate Nulls",
      () => {
        const words = frozenCorpusWords();
        const discovered = words.map((word) =>
          discoverStructuralHypothesesV0_1(word),
        );
        const successful = discovered.filter(
          (hypotheses) => hypotheses.length > 0,
        );

        expect(words).toHaveLength(288);
        expect(successful).toHaveLength(157);
        expect(
          discovered.filter(
            (hypotheses) => hypotheses.length === 0,
          ),
        ).toHaveLength(131);
        expect(
          successful.every((hypotheses) =>
            hypotheses.every(
              (hypothesis) => hypothesis.embryoSize >= 2,
            ),
          ),
        ).toBe(true);
      },
    );

    it(
      "keeps length-one and weak structural controls fail-closed",
      () => {
        expect(embryos("a")).toEqual([]);
        expect(embryos("xyz")).toEqual([]);
        expect(embryos("jetë")).toEqual([]);
      },
    );

    it(
      "bounds variable-length structural output without restoring an exact-size gate",
      () => {
        const boundedInput = `${"a".repeat(77)}tra`;
        const oversizedInput = `${"a".repeat(78)}tra`;

        expect(
          discoverStructuralHypothesesV0_1(
            boundedInput,
          )[0]?.embryoSize,
        ).toBe(77);

        expect(
          discoverStructuralHypothesesV0_1(
            oversizedInput,
          ),
        ).toEqual([]);
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
