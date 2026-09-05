import {
  buildMultiSourceFunctionalResearchInputsV0_1,
  buildSourceAttestedFunctionalResearchInputGroupsV0_1,
  MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,
  type MultiSourceFunctionalResearchEvidenceRowV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRegistry.v0_1";

describe(
  "Open Instrument multi-source functional research evidence registry v0.1",
  () => {
    const rows:
      MultiSourceFunctionalResearchEvidenceRowV0_1[] = [
      {
        registryVersion:
          MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,

        researchEvidenceId:
          "fixture.research.albanian.er.v0_1",

        embryo: "ER",

        evidenceFamily:
          "lexical_dictionary",

        language: "Albanian",
        form: "erë",
        gloss: "wind / air / smell",

        embryoRelation:
          "semantic_resemblance",

        relationOperationIds: [],

        attestationTruth: "fact",

        sourceStatus:
          "research_candidate",

        citations: [
          {
            citationId:
              "fixture.citation.albanian.er.v0_1",

            sourceTitle:
              "fixture Albanian dictionary entry",

            sourceAuthorOrEditor:
              "fixture editor",

            sourcePublisherOrHost:
              "fixture publisher",

            sourceDateOrVersion:
              "fixture version",

            sourceUrlOrArchiveRef:
              "fixture://albanian-er",

            entryLocator:
              "fixture entry ER",

            sourceHashOrArchiveHash:
              "fixture-hash",

            attestedForm: "erë",
            attestedGloss:
              "wind / air / smell",
          },
        ],

        functionalHypotheses: [
          {
            targetWord: "sterile",

            semanticBridge:
              "fixture ER-family meaning may functionally participate in the target concept",

            functionalBridgeTruth:
              "hypothesis",

            claimBoundary:
              "functional_hypothesis_only",
          },
          {
            targetWord:
              "another-target",

            semanticBridge:
              "the same attested source may support a different bounded functional hypothesis",

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
          "fixture.research.greek.er.v0_1",

        embryo: "ER",

        evidenceFamily:
          "historical_dictionary",

        language: "Ancient Greek",
        form: "fixture-er-form",
        gloss: "empty / devoid",

        embryoRelation:
          "semantic_resemblance",

        relationOperationIds: [],

        attestationTruth: "fact",

        sourceStatus:
          "research_candidate",

        citations: [
          {
            citationId:
              "fixture.citation.greek.er.v0_1",

            sourceTitle:
              "fixture Greek dictionary",

            sourceAuthorOrEditor:
              "fixture editor",

            sourcePublisherOrHost:
              "fixture host",

            sourceDateOrVersion:
              "fixture version",

            sourceUrlOrArchiveRef:
              "fixture://greek-er",

            entryLocator:
              "fixture entry",

            sourceHashOrArchiveHash:
              null,

            attestedForm:
              "fixture-er-form",

            attestedGloss:
              "empty / devoid",
          },
        ],

        functionalHypotheses: [
          {
            targetWord: "sterile",

            semanticBridge:
              "absence or deprivation may functionally motivate part of the target concept",

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
          "fixture.research.other.ak.v0_1",

        embryo: "AK",

        evidenceFamily:
          "dialect_lexicon",

        language:
          "Fixture Language",

        form: "ak",
        gloss: "fixture gloss",

        embryoRelation:
          "exact_form",

        relationOperationIds: [],

        attestationTruth: "fact",

        sourceStatus:
          "research_candidate",

        citations: [
          {
            citationId:
              "fixture.citation.ak.v0_1",

            sourceTitle:
              "fixture source",

            sourceAuthorOrEditor:
              null,

            sourcePublisherOrHost:
              "fixture host",

            sourceDateOrVersion:
              "fixture version",

            sourceUrlOrArchiveRef:
              "fixture://ak",

            entryLocator:
              "fixture AK",

            sourceHashOrArchiveHash:
              null,

            attestedForm: "ak",
            attestedGloss:
              "fixture gloss",
          },
        ],

        functionalHypotheses: [
          {
            targetWord: "gjak",

            semanticBridge:
              "fixture functional bridge",

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
      "preserves multiple research sources for the same embryo and target",
      () => {
        const result =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord: "sterile",
            embryo: "ER",
            rows,
          });

        expect(
          result.map(
            (item) => item.sourceId,
          ),
        ).toEqual([
          "fixture.research.albanian.er.v0_1",
          "fixture.research.greek.er.v0_1",
        ]);
      },
    );

    it(
      "selects only the functional hypothesis for the requested target",
      () => {
        const result =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord: "sterile",
            embryo: "ER",
            rows,
          });

        const albanian =
          result.find(
            (item) =>
              item.sourceId ===
              "fixture.research.albanian.er.v0_1",
          );

        expect(
          albanian?.semanticBridge,
        ).toBe(
          "fixture ER-family meaning may functionally participate in the target concept",
        );
      },
    );

    it(
      "keeps factual source attestation separate from hypothetical functional interpretation",
      () => {
        const result =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord: "sterile",
            embryo: "ER",
            rows,
          });

        const albanian =
          result.find(
            (item) =>
              item.sourceId ===
              "fixture.research.albanian.er.v0_1",
          );

        expect(
          albanian?.attestationTruth,
        ).toBe("fact");

        expect(
          albanian?.functionalBridgeTruth,
        ).toBe("hypothesis");
      },
    );

    it(
      "preserves citation provenance as evidence refs instead of relying on a prose source note",
      () => {
        const result =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord: "sterile",
            embryo: "ER",
            rows,
          });

        const albanian =
          result.find(
            (item) =>
              item.sourceId ===
              "fixture.research.albanian.er.v0_1",
          );

        expect(
          albanian?.citationRefs,
        ).toEqual([
          "fixture.citation.albanian.er.v0_1",
        ]);
      },
    );

    it(
      "is embryo and target independent rather than hard-coded to ER or STERILE",
      () => {
        const result =
          buildMultiSourceFunctionalResearchInputsV0_1({
            targetWord: "gjak",
            embryo: "AK",
            rows,
          });

        expect(result).toHaveLength(1);

        expect(result[0]).toMatchObject({
          sourceId:
            "fixture.research.other.ak.v0_1",

          language:
            "Fixture Language",

          form: "ak",

          gloss:
            "fixture gloss",
        });
      },
    );

    it(
      "requires a matching usable citation for source-attested exact-form authority and blocks same-embryo piggybacking",
      () => {
        const matchingRow =
          rows.find(
            (row) =>
              row.researchEvidenceId ===
              "fixture.research.other.ak.v0_1",
          );

        expect(
          matchingRow,
        ).toBeDefined();

        if (!matchingRow) {
          throw new Error(
            "fixture AK row missing",
          );
        }

        const mismatchedCitationRow:
          MultiSourceFunctionalResearchEvidenceRowV0_1 = {
          ...matchingRow,

          researchEvidenceId:
            "fixture.research.other.ak.mismatched-citation.v0_1",

          citations: [
            {
              ...matchingRow.citations[0],

              citationId:
                "fixture.citation.ak.mismatched-form.v0_1",

              attestedForm:
                "not-ak",
            },
          ],
        };

        expect(
          buildSourceAttestedFunctionalResearchInputGroupsV0_1({
            targetWord: "gjak",
            rows: [
              mismatchedCitationRow,
            ],
          }),
        ).toEqual([]);

        const mixed =
          buildSourceAttestedFunctionalResearchInputGroupsV0_1({
            targetWord: "gjak",
            rows: [
              matchingRow,
              mismatchedCitationRow,
            ],
          });

        expect(
          mixed,
        ).toHaveLength(1);

        expect(
          mixed[0]?.embryo,
        ).toBe("AK");

        expect(
          mixed[0]?.sources.map(
            (source) =>
              source.sourceId,
          ),
        ).toEqual([
          "fixture.research.other.ak.v0_1",
        ]);
      },
    );

    it(
      "does not expose a reviewed-production status from the research registry contract",
      () => {
        const statuses =
          rows.map(
            (row) => row.sourceStatus,
          );

        expect(statuses).not.toContain(
          "reviewed_accepted",
        );
      },
    );
  },
);
