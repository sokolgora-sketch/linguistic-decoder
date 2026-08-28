import {
  discoverMultiSourceFunctionalWitnessesV0_1,
} from "@/shared/multiSourceFunctionalDiscovery.v0_1";

import {
  buildMultiSourceFunctionalResearchInputsV0_1,
  MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,
  type MultiSourceFunctionalResearchEvidenceRowV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRegistry.v0_1";

describe(
  "Open Instrument multi-source research registry to witness composition v0.1",
  () => {
    const rows:
      MultiSourceFunctionalResearchEvidenceRowV0_1[] = [
      {
        registryVersion:
          MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,

        researchEvidenceId:
          "fixture.research.source-one.v0_1",

        embryo: "ER",

        evidenceFamily:
          "lexical_dictionary",

        language:
          "Fixture Language One",

        form:
          "fixture-form-one",

        gloss:
          "fixture lexical meaning one",

        embryoRelation:
          "semantic_resemblance",

        relationOperationIds: [],

        attestationTruth:
          "fact",

        sourceStatus:
          "research_candidate",

        citations: [
          {
            citationId:
              "fixture.citation.source-one.v0_1",

            sourceTitle:
              "Fixture Dictionary One",

            sourceAuthorOrEditor:
              "Fixture Editor",

            sourcePublisherOrHost:
              "Fixture Publisher",

            sourceDateOrVersion:
              "fixture-v1",

            sourceUrlOrArchiveRef:
              "fixture://source-one",

            entryLocator:
              "fixture-entry-one",

            sourceHashOrArchiveHash:
              "fixture-hash-one",

            attestedForm:
              "fixture-form-one",

            attestedGloss:
              "fixture lexical meaning one",
          },
        ],

        functionalHypotheses: [
          {
            targetWord:
              "sterile",

            semanticBridge:
              "fixture meaning one may functionally participate in the target concept",

            functionalBridgeTruth:
              "hypothesis",

            claimBoundary:
              "functional_hypothesis_only",
          },
          {
            targetWord:
              "different-target",

            semanticBridge:
              "different target bridge",

            functionalBridgeTruth:
              "hypothesis",

            claimBoundary:
              "functional_hypothesis_only",
          },
        ],

        historicalOriginClaim:
          "not_claimed",

        historicalTransmissionClaim:
          "not_claimed",

        winnerClaim:
          "not_claimed",

        languageSuperiorityClaim:
          "not_claimed",

        candidateTruthClaim:
          "not_claimed",

        userDecisionPosture:
          "user_decides",
      },

      {
        registryVersion:
          MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,

        researchEvidenceId:
          "fixture.research.source-two.v0_1",

        embryo: "ER",

        evidenceFamily:
          "historical_dictionary",

        language:
          "Fixture Language Two",

        form:
          "fixture-form-two",

        gloss:
          "fixture lexical meaning two",

        embryoRelation:
          "phonetic_resemblance",

        relationOperationIds: [],

        attestationTruth:
          "inference",

        sourceStatus:
          "research_candidate",

        citations: [
          {
            citationId:
              "fixture.citation.source-two.v0_1",

            sourceTitle:
              "Fixture Dictionary Two",

            sourceAuthorOrEditor:
              null,

            sourcePublisherOrHost:
              "Fixture Host",

            sourceDateOrVersion:
              "fixture-v2",

            sourceUrlOrArchiveRef:
              "fixture://source-two",

            entryLocator:
              "fixture-entry-two",

            sourceHashOrArchiveHash:
              null,

            attestedForm:
              "fixture-form-two",

            attestedGloss:
              "fixture lexical meaning two",
          },
        ],

        functionalHypotheses: [
          {
            targetWord:
              "sterile",

            semanticBridge:
              "fixture meaning two may provide a competing functional interpretation",

            functionalBridgeTruth:
              "inference",

            claimBoundary:
              "functional_hypothesis_only",
          },
        ],

        historicalOriginClaim:
          "not_claimed",

        historicalTransmissionClaim:
          "not_claimed",

        winnerClaim:
          "not_claimed",

        languageSuperiorityClaim:
          "not_claimed",

        candidateTruthClaim:
          "not_claimed",

        userDecisionPosture:
          "user_decides",
      },

      {
        registryVersion:
          MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,

        researchEvidenceId:
          "fixture.research.invalid-transform.v0_1",

        embryo: "DY",

        evidenceFamily:
          "lexical_dictionary",

        language:
          "Fixture Language Three",

        form: "di",

        gloss:
          "fixture transform meaning",

        embryoRelation:
          "authorized_transformation",

        relationOperationIds: [
          "invented_transform_not_in_allowed_ops",
        ],

        attestationTruth:
          "fact",

        sourceStatus:
          "research_candidate",

        citations: [
          {
            citationId:
              "fixture.citation.invalid-transform.v0_1",

            sourceTitle:
              "Fixture Transform Dictionary",

            sourceAuthorOrEditor:
              null,

            sourcePublisherOrHost:
              "Fixture Host",

            sourceDateOrVersion:
              "fixture-v3",

            sourceUrlOrArchiveRef:
              "fixture://invalid-transform",

            entryLocator:
              "fixture-transform-entry",

            sourceHashOrArchiveHash:
              null,

            attestedForm:
              "di",

            attestedGloss:
              "fixture transform meaning",
          },
        ],

        functionalHypotheses: [
          {
            targetWord:
              "fixture-target",

            semanticBridge:
              "fixture transform bridge",

            functionalBridgeTruth:
              "hypothesis",

            claimBoundary:
              "functional_hypothesis_only",
          },
        ],

        historicalOriginClaim:
          "not_claimed",

        historicalTransmissionClaim:
          "not_claimed",

        winnerClaim:
          "not_claimed",

        languageSuperiorityClaim:
          "not_claimed",

        candidateTruthClaim:
          "not_claimed",

        userDecisionPosture:
          "user_decides",
      },

      {
        registryVersion:
          MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,

        researchEvidenceId:
          "fixture.research.ak.v0_1",

        embryo: "AK",

        evidenceFamily:
          "dialect_lexicon",

        language:
          "Fixture Language Four",

        form: "ak",

        gloss:
          "fixture AK meaning",

        embryoRelation:
          "exact_form",

        relationOperationIds: [],

        attestationTruth:
          "fact",

        sourceStatus:
          "research_candidate",

        citations: [
          {
            citationId:
              "fixture.citation.ak.v0_1",

            sourceTitle:
              "Fixture AK Lexicon",

            sourceAuthorOrEditor:
              null,

            sourcePublisherOrHost:
              "Fixture Host",

            sourceDateOrVersion:
              "fixture-v4",

            sourceUrlOrArchiveRef:
              "fixture://ak",

            entryLocator:
              "fixture-ak-entry",

            sourceHashOrArchiveHash:
              null,

            attestedForm:
              "ak",

            attestedGloss:
              "fixture AK meaning",
          },
        ],

        functionalHypotheses: [
          {
            targetWord:
              "gjak",

            semanticBridge:
              "fixture AK bridge",

            functionalBridgeTruth:
              "hypothesis",

            claimBoundary:
              "functional_hypothesis_only",
          },
        ],

        historicalOriginClaim:
          "not_claimed",

        historicalTransmissionClaim:
          "not_claimed",

        winnerClaim:
          "not_claimed",

        languageSuperiorityClaim:
          "not_claimed",

        candidateTruthClaim:
          "not_claimed",

        userDecisionPosture:
          "user_decides",
      },
    ];

    it(
      "composes multiple research-registry rows into multiple bounded witnesses without stopping at the first source",
      () => {
        const inputs =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord:
              "sterile",

            embryo: "ER",

            rows,
          });

        const witnesses =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord:
              "sterile",

            embryo: "ER",

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
          "fixture.research.source-one.v0_1",
          "fixture.research.source-two.v0_1",
        ]);
      },
    );

    it(
      "preserves citation provenance and keeps attestation truth separate from functional interpretation through the full composition",
      () => {
        const inputs =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord:
              "sterile",

            embryo: "ER",

            rows,
          });

        const witnesses =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord:
              "sterile",

            embryo: "ER",

            structuralExpansionChain: [
              "ER",
              "TER",
              "STER",
              "STERILE",
            ],

            sources:
              inputs,
          });

        const first =
          witnesses.find(
            (item) =>
              item.sourceId ===
              "fixture.research.source-one.v0_1",
          );

        expect(first).toMatchObject({
          embryo: "ER",

          citationRefs: [
            "fixture.citation.source-one.v0_1",
          ],

          attestationTruth:
            "fact",

          functionalBridgeTruth:
            "hypothesis",

          sourceStatus:
            "research_candidate",

          historicalOriginClaim:
            "not_claimed",

          candidateTruthClaim:
            "not_claimed",

          userDecisionPosture:
            "user_decides",
        });
      },
    );

    it(
      "selects only the target-specific functional bridge before witness projection",
      () => {
        const inputs =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord:
              "sterile",

            embryo: "ER",

            rows,
          });

        expect(
          inputs[0]?.semanticBridge,
        ).toBe(
          "fixture meaning one may functionally participate in the target concept",
        );

        expect(
          inputs.some(
            (item) =>
              item.semanticBridge ===
              "different target bridge",
          ),
        ).toBe(false);
      },
    );

    it(
      "lets the generic discovery boundary reject a research-registry row whose declared authorized transform is not canonical",
      () => {
        const inputs =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord:
              "fixture-target",

            embryo: "DY",

            rows,
          });

        expect(inputs).toHaveLength(1);

        const witnesses =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord:
              "fixture-target",

            embryo: "DY",

            structuralExpansionChain: [
              "DY",
              "FIXTURE-TARGET",
            ],

            sources:
              inputs,
          });

        expect(witnesses).toEqual([]);
      },
    );

    it(
      "remains generic for another embryo and target",
      () => {
        const inputs =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord:
              "gjak",

            embryo: "AK",

            rows,
          });

        const witnesses =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord:
              "gjak",

            embryo: "AK",

            structuralExpansionChain: [
              "AK",
              "JAK",
              "GJAK",
            ],

            sources:
              inputs,
          });

        expect(witnesses).toHaveLength(1);

        expect(
          witnesses[0],
        ).toMatchObject({
          embryo:
            "AK",

          sourceForm:
            "ak",

          gloss:
            "fixture AK meaning",

          embryoRelation:
            "exact_form",

          candidateTruthClaim:
            "not_claimed",
        });
      },
    );

    it(
      "never promotes composed research witnesses into historical origin, transmission, winner, language superiority, or candidate truth",
      () => {
        const inputs =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord:
              "sterile",

            embryo: "ER",

            rows,
          });

        const witnesses =
          discoverMultiSourceFunctionalWitnessesV0_1({
            targetWord:
              "sterile",

            embryo: "ER",

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
          witnesses.length,
        ).toBeGreaterThan(1);

        for (const witness of witnesses) {
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
