import {
  discoverMultiSourceFunctionalWitnessesV0_1,
} from "@/shared/multiSourceFunctionalDiscovery.v0_1";

import {
  buildMultiSourceFunctionalResearchInputsV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRegistry.v0_1";

import {
  multiSourceFunctionalResearchEvidenceRowsErV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRows.er.v0_1";

describe(
  "Open Instrument first real ER multi-source research rows v0.1",
  () => {
    it(
      "keeps five distinct research observations including three separate Albanian erë homonyms",
      () => {
        expect(
          multiSourceFunctionalResearchEvidenceRowsErV0_1,
        ).toHaveLength(5);

        const albanian =
          multiSourceFunctionalResearchEvidenceRowsErV0_1.filter(
            (row) =>
              row.language ===
              "Albanian",
          );

        expect(albanian).toHaveLength(3);

        expect(
          albanian.map(
            (row) => row.gloss,
          ),
        ).toEqual([
          "wind; moving air; colloquially air",
          "smell; scent; odor",
          "era; epoch; geological era",
        ]);
      },
    );

    it(
      "preserves exact external source locators for UT LRC, Logeion, and FJALË",
      () => {
        const refs =
          multiSourceFunctionalResearchEvidenceRowsErV0_1.flatMap(
            (row) =>
              row.citations.map(
                (citation) =>
                  citation.sourceUrlOrArchiveRef,
              ),
          );

        expect(refs).toContain(
          "https://lrc.la.utexas.edu/lex/master/0500",
        );

        expect(refs).toContain(
          "https://logeion.uchicago.edu/%E1%BC%90%CF%81%E1%BF%86%CE%BC%CE%BF%CF%82",
        );

        expect(refs).toContain(
          "https://fjale.al/er%C3%AB",
        );
      },
    );

    it(
      "treats reconstructed er- as inference rather than directly attested fact",
      () => {
        const row =
          multiSourceFunctionalResearchEvidenceRowsErV0_1.find(
            (candidate) =>
              candidate.researchEvidenceId ===
              "research.external.pokorny-er5-loose-crumbly.v0_1",
          );

        expect(row).toMatchObject({
          embryo: "ER",
          form: "er-",
          embryoRelation:
            "reconstructed_form",
          attestationTruth:
            "inference",
          sourceStatus:
            "research_candidate",
        });
      },
    );

    it(
      "keeps Greek lexical attestation factual while its functional bridge remains hypothetical",
      () => {
        const row =
          multiSourceFunctionalResearchEvidenceRowsErV0_1.find(
            (candidate) =>
              candidate.researchEvidenceId ===
              "research.external.greek-eremos-empty-devoid.v0_1",
          );

        expect(row?.attestationTruth).toBe(
          "fact",
        );

        expect(
          row?.functionalHypotheses[0]
            ?.functionalBridgeTruth,
        ).toBe(
          "hypothesis",
        );

        expect(
          row?.historicalOriginClaim,
        ).toBe(
          "not_claimed",
        );
      },
    );

    it(
      "keeps all Albanian erë rows unresolved because ER to ERË is not currently authorized",
      () => {
        const albanian =
          multiSourceFunctionalResearchEvidenceRowsErV0_1.filter(
            (row) =>
              row.language ===
              "Albanian",
          );

        for (const row of albanian) {
          expect(
            row.embryoRelation,
          ).toBe(
            "unresolved",
          );

          expect(
            row.relationOperationIds,
          ).toEqual([]);

          expect(
            row.functionalHypotheses[0]
              ?.semanticBridge,
          ).toBeNull();

          expect(
            row.functionalHypotheses[0]
              ?.functionalBridgeTruth,
          ).toBe(
            "unknown",
          );
        }
      },
    );

    it(
      "allows all five source observations through research intake but emits only the two currently admissible ER witnesses",
      () => {
        const inputs =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord:
              "sterile",

            embryo:
              "ER",

            rows:
              multiSourceFunctionalResearchEvidenceRowsErV0_1,
          });

        expect(inputs).toHaveLength(5);

        const witnesses =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord:
              "sterile",

            embryo:
              "ER",

            structuralExpansionChain: [
              "ER",
              "TER",
              "STER",
              "STERILE",
            ],

            sources:
              inputs,
          });

        expect(
          witnesses.map(
            (item) => item.sourceId,
          ),
        ).toEqual([
          "research.external.pokorny-er5-loose-crumbly.v0_1",
          "research.external.greek-eremos-empty-devoid.v0_1",
        ]);

        expect(
          witnesses.some(
            (item) =>
              item.language ===
              "Albanian",
          ),
        ).toBe(false);
      },
    );

    it(
      "keeps every emitted real ER witness below origin, winner, and candidate-truth claims",
      () => {
        const inputs =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord:
              "sterile",

            embryo:
              "ER",

            rows:
              multiSourceFunctionalResearchEvidenceRowsErV0_1,
          });

        const witnesses =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord:
              "sterile",

            embryo:
              "ER",

            structuralExpansionChain: [
              "ER",
              "TER",
              "STER",
              "STERILE",
            ],

            sources:
              inputs,
          });

        expect(witnesses).toHaveLength(2);

        for (const witness of witnesses) {
          expect(
            witness.sourceStatus,
          ).toBe(
            "research_candidate",
          );

          expect(
            witness.historicalOriginClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            witness.historicalTransmissionClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            witness.winnerClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            witness.languageSuperiorityClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            witness.candidateTruthClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            witness.userDecisionPosture,
          ).toBe(
            "user_decides",
          );
        }
      },
    );
  },
);
