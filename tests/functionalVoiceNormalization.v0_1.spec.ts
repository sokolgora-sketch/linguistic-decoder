import {
  buildFunctionalVoiceNormalizationV0_1,
} from "@/shared/openInstrument/functionalVoiceNormalization.v0.1";

import {
  buildAutomaticFunctionalProposalContextV0_1,
} from "@/shared/orchestrator/automaticFunctionalCandidateProposal.v0.1";

describe(
  "functional voice normalization v0.1",
  () => {
    test(
      "memory preserves symbolic E/O and normalizes final Y carrier to I",
      () => {
        const out =
          buildFunctionalVoiceNormalizationV0_1({
            word:
              "memory",
            language:
              "English",
            ipa:
              "/ˈmɛməri/",
          });

        expect(
          out.surfacePath,
        ).toEqual([
          "E",
          "O",
          "Y",
        ]);

        expect(
          out.carrierPath,
        ).toEqual([
          "E",
          "Ë",
          "I",
        ]);

        expect(
          out.functionalPath,
        ).toEqual([
          "E",
          "O",
          "I",
        ]);

        expect(
          out.transforms.map(
            (row) =>
              row.rule,
          ),
        ).toEqual([
          "y_to_i",
        ]);

        expect(
          out.unresolvedCarrierDifferences,
        ).toEqual([
          expect.objectContaining({
            from: "O",
            carrier:
              "Ë",
          }),
        ]);

        expect(
          out.status,
        ).toBe(
          "partially_normalized",
        );

        expect(
          out.usable,
        ).toBe(true);
      },
    );

    test(
      "rythem uses Y→I plus reduced final E→Ë",
      () => {
        const out =
          buildFunctionalVoiceNormalizationV0_1({
            word:
              "rythem",
            language:
              "English",
            ipa:
              "/ˈrɪðəm/",
          });

        expect(
          out.surfacePath,
        ).toEqual([
          "Y",
          "E",
        ]);

        expect(
          out.carrierPath,
        ).toEqual([
          "I",
          "Ë",
        ]);

        expect(
          out.functionalPath,
        ).toEqual([
          "I",
          "Ë",
        ]);

        expect(
          out.transforms.map(
            (row) =>
              row.rule,
          ),
        ).toEqual([
          "y_to_i",
          "reduced_final_e_to_ë",
        ]);
      },
    );

    test(
      "correct rhythm reconstructs missing carrier Ë",
      () => {
        const out =
          buildFunctionalVoiceNormalizationV0_1({
            word:
              "rhythm",
            language:
              "English",
            ipa:
              "/ˈrɪð.əm/",
          });

        expect(
          out.surfacePath,
        ).toEqual([
          "Y",
        ]);

        expect(
          out.carrierPath,
        ).toEqual([
          "I",
          "Ë",
        ]);

        expect(
          out.functionalPath,
        ).toEqual([
          "I",
          "Ë",
        ]);

        expect(
          out.transforms.map(
            (row) =>
              row.rule,
          ),
        ).toEqual([
          "y_to_i",
          "carrier_ë_inserted",
        ]);

        expect(
          out.status,
        ).toBe(
          "normalized",
        );

        expect(
          out.usable,
        ).toBe(true);
      },
    );

    test(
      "does not wholesale replace unsupported carrier differences",
      () => {
        const out =
          buildFunctionalVoiceNormalizationV0_1({
            word:
              "study",
            language:
              "English",
            ipa:
              "/ˈstʌdi/",
          });

        expect(
          out.surfacePath,
        ).toEqual([
          "U",
          "Y",
        ]);

        expect(
          out.carrierPath,
        ).toEqual([
          "Ë",
          "I",
        ]);

        expect(
          out.functionalPath,
        ).toEqual([
          "U",
          "I",
        ]);

        expect(
          out.transforms.map(
            (row) =>
              row.rule,
          ),
        ).toEqual([
          "y_to_i",
        ]);

        expect(
          out.unresolvedCarrierDifferences,
        ).toEqual([
          expect.objectContaining({
            from: "U",
            carrier:
              "Ë",
          }),
        ]);
      },
    );
    test(
      "functional proposer context prefers separate Slice G normalized path",
      () => {
        const context =
          buildAutomaticFunctionalProposalContextV0_1({
            evidence: {
              surfaceVowelsRaw: [
                "E",
                "O",
                "Y",
              ],
              surfaceVowels: [
                "E",
                "O",
                "Y",
              ],
              vowelPath: [
                "E",
                "O",
                "Y",
              ],
            },
            functionalVoiceNormalizationV0_1: {
              functionalPath: [
                "E",
                "O",
                "I",
              ],
            },
            candidates: [],
          });

        expect(
          context.surfaceVowelPath,
        ).toEqual([
          "E",
          "O",
          "Y",
        ]);

        expect(
          context.functionalVowelPath,
        ).toEqual([
          "E",
          "O",
          "I",
        ]);
      },
    );
  },
);
