import {
  discoverMultiSourceFunctionalWitnessesV0_1,
  type MultiSourceFunctionalEvidenceRecordV0_1,
} from "@/shared/multiSourceFunctionalDiscovery.v0_1";

describe(
  "Open Instrument multi-source functional discovery v0.1",
  () => {
    const sources: MultiSourceFunctionalEvidenceRecordV0_1[] = [
      {
        sourceId: "fixture.albanian.er-form.v0_1",
        evidenceFamily: "lexical_dictionary",
        language: "Albanian",
        form: "erë",
        gloss: "wind / air / smell",
        citationRefs: [
          "fixture:citation:albanian-er",
        ],
        embryoRelation: "semantic_resemblance",
        relationOperationIds: [],
        attestationTruth: "fact",
        semanticBridge:
          "a condition expressed by the ER-family source may functionally participate in the target concept",
        functionalBridgeTruth: "hypothesis",
        sourceStatus: "research_candidate",
      },
      {
        sourceId: "fixture.greek.er-family.v0_1",
        evidenceFamily: "historical_dictionary",
        language: "Greek",
        form: "er-family-form",
        gloss: "empty / devoid / deserted",
        citationRefs: [
          "fixture:citation:greek-er-family",
        ],
        embryoRelation: "semantic_resemblance",
        relationOperationIds: [],
        attestationTruth: "fact",
        semanticBridge:
          "absence or deprivation may functionally motivate part of the target concept",
        functionalBridgeTruth: "inference",
        sourceStatus: "research_candidate",
      },
      {
        sourceId: "fixture.reconstructed.er.v0_1",
        evidenceFamily: "reconstructed_lexicon",
        language: "Proto-language reconstruction",
        form: "*er-",
        gloss: "weak / loose / infirm",
        citationRefs: [
          "fixture:citation:reconstructed-er",
        ],
        embryoRelation: "reconstructed_form",
        relationOperationIds: [],
        attestationTruth: "inference",
        semanticBridge:
          "loss of strength or productive capacity may functionally motivate part of the target concept",
        functionalBridgeTruth: "hypothesis",
        sourceStatus: "research_candidate",
      },
      {
        sourceId: "fixture.unrelated.er-shape.v0_1",
        evidenceFamily: "other",
        language: "Fixture",
        form: "er",
        gloss: "unrelated test meaning",
        citationRefs: [
          "fixture:citation:unrelated",
        ],
        embryoRelation: "unsupported",
        relationOperationIds: [],
        attestationTruth: "fact",
        semanticBridge:
          "this must never be projected because the relation is unsupported",
        functionalBridgeTruth: "hypothesis",
        sourceStatus: "research_candidate",
      },
    ];

    it(
      "preserves multiple supported witnesses instead of stopping at the first source",
      () => {
        const result =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord: "sterile",
            embryo: "ER",
            structuralExpansionChain: [
              "ER",
              "TER",
              "STER",
              "STERILE",
            ],
            sources,
          });

        expect(
          result.map((item) => item.sourceId),
        ).toEqual([
          "fixture.albanian.er-form.v0_1",
          "fixture.greek.er-family.v0_1",
          "fixture.reconstructed.er.v0_1",
        ]);
      },
    );

    it(
      "keeps source attestation truth separate from functional-bridge truth",
      () => {
        const result =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord: "sterile",
            embryo: "ER",
            structuralExpansionChain: [
              "ER",
              "TER",
              "STER",
              "STERILE",
            ],
            sources,
          });

        const albanian = result.find(
          (item) =>
            item.sourceId ===
            "fixture.albanian.er-form.v0_1",
        );

        expect(albanian).toBeDefined();

        expect(
          albanian?.attestationTruth,
        ).toBe("fact");

        expect(
          albanian?.functionalBridgeTruth,
        ).toBe("hypothesis");
      },
    );

    it(
      "preserves language, form, gloss, relation, operations, and citation provenance",
      () => {
        const result =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord: "sterile",
            embryo: "ER",
            structuralExpansionChain: [
              "ER",
              "TER",
              "STER",
              "STERILE",
            ],
            sources,
          });

        const albanian = result.find(
          (item) =>
            item.sourceId ===
            "fixture.albanian.er-form.v0_1",
        );

        expect(albanian).toMatchObject({
          targetWord: "sterile",
          embryo: "ER",
          language: "Albanian",
          sourceForm: "erë",
          gloss: "wind / air / smell",
          embryoRelation:
            "semantic_resemblance",
          relationOperationIds: [],
          citationRefs: [
            "fixture:citation:albanian-er",
          ],
        });
      },
    );

    it(
      "rejects unsupported lookalike relations instead of turning string resemblance into evidence",
      () => {
        const result =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord: "sterile",
            embryo: "ER",
            structuralExpansionChain: [
              "ER",
              "TER",
              "STER",
              "STERILE",
            ],
            sources,
          });

        expect(
          result.some(
            (item) =>
              item.sourceId ===
              "fixture.unrelated.er-shape.v0_1",
          ),
        ).toBe(false);
      },
    );

    it(
      "rejects an authorized transformation when its operation id is not in the canonical AllowedOpId vocabulary",
      () => {
        const result =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord: "fixture-target",
            embryo: "DY",
            structuralExpansionChain: [
              "DY",
              "FIXTURE-TARGET",
            ],
            sources: [
              {
                sourceId:
                  "fixture.invalid-transform.v0_1",
                evidenceFamily:
                  "lexical_dictionary",
                language:
                  "Fixture Language",
                form: "di",
                gloss:
                  "fixture gloss",
                citationRefs: [
                  "fixture:citation:invalid-transform",
                ],
                embryoRelation:
                  "authorized_transformation",
                relationOperationIds: [
                  "invented_final_toggle",
                ],
                attestationTruth:
                  "fact",
                semanticBridge:
                  "fixture bridge",
                functionalBridgeTruth:
                  "hypothesis",
                sourceStatus:
                  "research_candidate",
              },
            ],
          });

        expect(result).toEqual([]);
      },
    );

    it(
      "accepts and preserves an authorized transformation only when its operation id resolves through canonical AllowedOpId",
      () => {
        const result =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord: "fixture-target",
            embryo: "DY",
            structuralExpansionChain: [
              "DY",
              "FIXTURE-TARGET",
            ],
            sources: [
              {
                sourceId:
                  "fixture.valid-transform.v0_1",
                evidenceFamily:
                  "lexical_dictionary",
                language:
                  "Fixture Language",
                form: "di",
                gloss:
                  "fixture gloss",
                citationRefs: [
                  "fixture:citation:valid-transform",
                ],
                embryoRelation:
                  "authorized_transformation",
                relationOperationIds: [
                  "y_to_i",
                ],
                attestationTruth:
                  "fact",
                semanticBridge:
                  "fixture bridge",
                functionalBridgeTruth:
                  "hypothesis",
                sourceStatus:
                  "research_candidate",
              },
            ],
          });

        expect(result).toHaveLength(1);

        expect(
          result[0].relationOperationIds,
        ).toEqual([
          "y_to_i",
        ]);
      },
    );

    it(
      "never promotes discovery witnesses into origin, winner, superiority, or candidate truth",
      () => {
        const result =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord: "sterile",
            embryo: "ER",
            structuralExpansionChain: [
              "ER",
              "TER",
              "STER",
              "STERILE",
            ],
            sources,
          });

        expect(result.length).toBeGreaterThan(1);

        for (const witness of result) {
          expect(
            witness.historicalOriginClaim,
          ).toBe("not_claimed");

          expect(
            witness.historicalTransmissionClaim,
          ).toBe("not_claimed");

          expect(
            witness.winnerClaim,
          ).toBe("not_claimed");

          expect(
            witness.languageSuperiorityClaim,
          ).toBe("not_claimed");

          expect(
            witness.candidateTruthClaim,
          ).toBe("not_claimed");

          expect(
            witness.userDecisionPosture,
          ).toBe("user_decides");
        }
      },
    );

    it(
      "is word-independent: the same evidence-discovery contract accepts another structural embryo without a word-specific branch",
      () => {
        const genericSource: MultiSourceFunctionalEvidenceRecordV0_1 = {
          sourceId: "fixture.generic.ak.v0_1",
          evidenceFamily: "dialect_lexicon",
          language: "Fixture Language",
          form: "ak",
          gloss: "fixture gloss",
          citationRefs: [
            "fixture:citation:ak",
          ],
          embryoRelation: "exact_form",
          relationOperationIds: [],
          attestationTruth: "fact",
          semanticBridge:
            "fixture functional bridge",
          functionalBridgeTruth: "hypothesis",
          sourceStatus: "research_candidate",
        };

        const result =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord: "gjak",
            embryo: "AK",
            structuralExpansionChain: [
              "AK",
              "JAK",
              "GJAK",
            ],
            sources: [genericSource],
          });

        expect(result).toHaveLength(1);

        expect(result[0]).toMatchObject({
          targetWord: "gjak",
          embryo: "AK",
          sourceId: "fixture.generic.ak.v0_1",
        });
      },
    );
  },
);
