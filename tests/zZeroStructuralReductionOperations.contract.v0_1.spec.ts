import { readFileSync } from "node:fs";

import {
  discoverStructuralHypothesesV0_1,
} from "@/shared/structuralHypothesisDiscovery.v0_1";

function findEmbryo(
  word: string,
  embryo: string,
) {
  return discoverStructuralHypothesesV0_1(
    word,
  ).find(
    (hypothesis) =>
      hypothesis.embryo === embryo,
  );
}

describe(
  "ZË-RO deterministic structural reduction operations v0.1",
  () => {
    it(
      "derives the STERILE to STER to TER to ER proving chain generically",
      () => {
        const er =
          findEmbryo(
            "sterile",
            "ER",
          );

        expect(er).toBeDefined();

        expect(
          er?.basis,
        ).toBe("sterile");

        expect(
          er?.embryo,
        ).toBe("ER");

        expect(
          er?.independentStandaloneMeaning,
        ).toBeNull();

        expect(
          er?.expansionChain,
        ).toEqual([
          "ER",
          "TER",
          "STER",
          "STERILE",
        ]);

        expect(
          er?.reductionSteps,
        ).toEqual([
          expect.objectContaining({
            from: "STERILE",
            to: "STER",
            operationId:
              "peel_right_vowel_led_expansion",
            fromSpan: {
              start: 4,
              end: 7,
            },
            removedOrChanged:
              "ILE",
            voicePathBefore: [
              "E",
              "I",
              "E",
            ],
            voicePathAfter: [
              "E",
            ],
          }),
          expect.objectContaining({
            from: "STER",
            to: "TER",
            operationId:
              "peel_left_consonant_frame",
            fromSpan: {
              start: 0,
              end: 1,
            },
            removedOrChanged:
              "S",
            voicePathBefore: [
              "E",
            ],
            voicePathAfter: [
              "E",
            ],
          }),
          expect.objectContaining({
            from: "TER",
            to: "ER",
            operationId:
              "peel_left_consonant_frame",
            fromSpan: {
              start: 0,
              end: 1,
            },
            removedOrChanged:
              "T",
            voicePathBefore: [
              "E",
            ],
            voicePathAfter: [
              "E",
            ],
          }),
        ]);

        expect(
          er?.historicalOriginClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          er?.candidateTruthClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          er?.userDecisionPosture,
        ).toBe(
          "user_decides",
        );
      },
    );

    it(
      "orders structural hypotheses embryo-first and marks minimum status only on the smallest tier",
      () => {
        const hypotheses =
          discoverStructuralHypothesesV0_1(
            "sterile",
          );

        expect(
          hypotheses.map(
            (hypothesis) =>
              hypothesis.embryo,
          ),
        ).toEqual([
          "ER",
          "ERILE",
        ]);

        const er =
          hypotheses.find(
            (hypothesis) =>
              hypothesis.embryo ===
              "ER",
          );

        const erile =
          hypotheses.find(
            (hypothesis) =>
              hypothesis.embryo ===
              "ERILE",
          );

        expect(
          er?.reasonCodes,
        ).toEqual(
          expect.arrayContaining([
            "terminal_structural_hypothesis_reached",
            "minimum_defensible_embryo_reached",
          ]),
        );

        expect(
          erile?.reasonCodes,
        ).toContain(
          "terminal_structural_hypothesis_reached",
        );

        expect(
          erile?.reasonCodes,
        ).not.toContain(
          "minimum_defensible_embryo_reached",
        );
      },
    );

    it(
      "proves ER is not a STERILE-specific lookup by deriving STER to TER to ER independently",
      () => {
        const er =
          findEmbryo(
            "ster",
            "ER",
          );

        expect(er).toBeDefined();

        expect(
          er?.expansionChain,
        ).toEqual([
          "ER",
          "TER",
          "STER",
        ]);

        expect(
          er?.reductionSteps.map(
            (step) =>
              step.operationId,
          ),
        ).toEqual([
          "peel_left_consonant_frame",
          "peel_left_consonant_frame",
        ]);
      },
    );

    it(
      "does not authorize TERR to TER or leak ER from TERROR",
      () => {
        const hypotheses =
          discoverStructuralHypothesesV0_1(
            "terror",
          );

        expect(
          hypotheses.some(
            (hypothesis) =>
              hypothesis.embryo ===
                "ER" ||
              hypothesis.embryo ===
                "TER",
          ),
        ).toBe(false);

        expect(
          hypotheses.some(
            (hypothesis) =>
              hypothesis.reductionSteps.some(
                (step) =>
                  step.from ===
                    "TERR" &&
                  step.to ===
                    "TER",
              ),
          ),
        ).toBe(false);
      },
    );

    it(
      "does not delete final R from ERROR merely to manufacture ER",
      () => {
        expect(
          findEmbryo(
            "error",
            "ER",
          ),
        ).toBeUndefined();
      },
    );

    it(
      "does not treat an ER surface ending in SISTER as an ER embryo shortcut",
      () => {
        expect(
          findEmbryo(
            "sister",
            "ER",
          ),
        ).toBeUndefined();
      },
    );

    it(
      "uses canonical Seven-Voices authority and preserves Y and Ë during consonant-frame peeling",
      () => {
        const yë =
          findEmbryo(
            "syë",
            "YË",
          );

        expect(yë).toBeDefined();

        expect(
          yë?.reductionSteps,
        ).toEqual([
          expect.objectContaining({
            from: "SYË",
            to: "YË",
            operationId:
              "peel_left_consonant_frame",
            voicePathBefore: [
              "Y",
              "Ë",
            ],
            voicePathAfter: [
              "Y",
              "Ë",
            ],
          }),
        ]);
      },
    );

    it(
      "is deterministic across repeated discovery",
      () => {
        const first =
          discoverStructuralHypothesesV0_1(
            "sterile",
          );

        const second =
          discoverStructuralHypothesesV0_1(
            "sterile",
          );

        expect(second).toEqual(
          first,
        );
      },
    );

    it(
      "does not hard-code STERILE in the discovery implementation",
      () => {
        const source =
          readFileSync(
            "src/shared/structuralHypothesisDiscovery.v0_1.ts",
            "utf8",
          );

        expect(source).not.toMatch(
          /\b(?:word|basis|input)\s*={1,3}\s*["']sterile["']/i,
        );

        expect(source).not.toMatch(
          /case\s+["']sterile["']/i,
        );

        expect(source).not.toMatch(
          /["']sterile["']\s*:/i,
        );
      },
    );

    it(
      "does not register ER in evidence or canonical owners",
      () => {
        const protoRoots =
          readFileSync(
            "src/shared/protoRoots.v1.ts",
            "utf8",
          );

        const profiles =
          readFileSync(
            "src/shared/canonicalOperatorProfile.v0_1.ts",
            "utf8",
          );

        const registry =
          readFileSync(
            "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
            "utf8",
          );

        expect(
          protoRoots,
        ).not.toMatch(
          /\bid:\s*["']ER["']/,
        );

        expect(
          profiles,
        ).not.toMatch(
          /\boperatorId:\s*["']ER["']/,
        );

        expect(
          registry,
        ).not.toMatch(
          /\bembryo:\s*["']ER["']/,
        );
      },
    );
  },
);
