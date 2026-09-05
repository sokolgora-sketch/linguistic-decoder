import {
  SEVEN_VOICE_FUNCTIONAL_RECURRENCE_CANDIDATE_EVIDENCE_PACKET_SCHEMA_V0_1,
  validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1,
  type SevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1,
} from "@/shared/openInstrument/sevenVoiceFunctionalRecurrenceCandidateEvidencePacket.v0_1";

const claimBoundary = {
  historicalOriginClaim:
    "not_claimed",
  historicalTransmissionClaim:
    "not_claimed",
  cognacyClaim:
    "not_claimed",
  borrowingClaim:
    "not_claimed",
  winnerClaim:
    "not_claimed",
  languageSuperiorityClaim:
    "not_claimed",
  candidateTruthClaim:
    "not_claimed",
  universalityClaim:
    "not_claimed",
  userDecisionPosture:
    "user_decides",
} as const;

function packet():
  SevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1 {
  return {
    schemaVersion:
      SEVEN_VOICE_FUNCTIONAL_RECURRENCE_CANDIDATE_EVIDENCE_PACKET_SCHEMA_V0_1,

    packetId:
      "research.fvr.candidate.example.v0_1",

    conceptId:
      "EXAMPLE",

    researchOnly:
      true,

    admittedCohortId:
      null,

    candidates: [
      {
        candidateObservationId:
          "candidate.example.language-a.v0_1",

        languageId:
          "Language A",

        languageVariety:
          null,

        intendedEvidenceRole:
          "cohort_member",

        surfaceForm:
          null,

        attestedGloss:
          null,

        sourceStatus:
          null,

        citations: [],

        proposedComparisonForm:
          null,

        proposedComparisonMode:
          null,

        proposedComparisonAuthority:
          null,

        proposedComparisonProvenance:
          null,

        reviewStatus:
          "needs_source",

        reviewNotes: [],

        claimBoundary,
      },
    ],
  };
}

describe(
  "Open Instrument FVR candidate evidence packet v0.1",
  () => {
    it(
      "permits incomplete needs_source research without pretending it is admission-ready",
      () => {
        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            packet(),
          );

        expect(
          result.valid,
        ).toBe(true);

        expect(
          result.reasonCodes,
        ).toEqual([]);

        expect(
          result.needsSourceCandidateIds,
        ).toEqual([
          "candidate.example.language-a.v0_1",
        ]);

        expect(
          result.readyForAdmissionReviewCandidateIds,
        ).toEqual([]);
      },
    );

    it(
      "fails closed when a candidate is labeled ready without source and comparison evidence",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0].reviewStatus =
          "ready_for_admission_review";

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toEqual(
          expect.arrayContaining([
            "ready_surface_form_missing",
            "ready_attested_gloss_missing",
            "ready_source_status_missing",
            "ready_citation_missing",
            "ready_comparison_form_missing",
            "ready_comparison_mode_missing",
            "ready_comparison_authority_missing",
            "ready_comparison_provenance_missing",
          ]),
        );
        expect(
          result.readyForAdmissionReviewCandidateIds,
        ).toEqual([]);

      },
    );

    it(
      "does not expose a ready candidate when the packet envelope is invalid",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0] = {
          ...input.candidates[0],

          surfaceForm:
            "FORM",

          attestedGloss:
            "example gloss",

          sourceStatus:
            "research_candidate",

          citations: [
            {
              citationId:
                "candidate.example.invalid-envelope.v0_1",

              sourceTitle:
                "Example lexical source",

              sourceAuthorOrEditor:
                null,

              sourcePublisherOrHost:
                "Example Publisher",

              sourceDateOrVersion:
                "v1",

              sourceUrlOrArchiveRef:
                "https://example.invalid/source",

              entryLocator:
                "entry FORM",

              sourceHashOrArchiveHash:
                null,

              attestedForm:
                "FORM",

              attestedGloss:
                "example gloss",
            },
          ],

          proposedComparisonForm:
            "FORM",

          proposedComparisonMode:
            "orthography",

          proposedComparisonAuthority:
            "source_orthography",

          proposedComparisonProvenance: {
            provenanceId:
              "candidate.example.invalid-envelope.provenance.v0_1",

            authority:
              "source_orthography",

            ruleId:
              null,

            evidenceRefs: [],
          },

          reviewStatus:
            "ready_for_admission_review",
        };

        input.researchOnly =
          false;

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toContain(
          "research_only_boundary_invalid",
        );

        expect(
          result.readyForAdmissionReviewCandidateIds,
        ).toEqual([]);
      },
    );

    it(
      "does not expose needs_source ids when common candidate validation fails",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0].languageId =
          "";

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toContain(
          "language_id_missing",
        );

        expect(
          result.needsSourceCandidateIds,
        ).toEqual([]);
      },
    );

    it(
      "does not expose rejected ids before the rejection itself validates",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0].reviewStatus =
          "reject";

        input.candidates[0].reviewNotes =
          [];

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toContain(
          "rejected_candidate_missing_reason",
        );

        expect(
          result.rejectedCandidateIds,
        ).toEqual([]);
      },
    );

    it(
      "accepts a source-traceable orthographic candidate as ready for admission review without admitting it",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0] = {
          ...input.candidates[0],

          surfaceForm:
            "FORM",

          attestedGloss:
            "example gloss",

          sourceStatus:
            "research_candidate",

          citations: [
            {
              citationId:
                "candidate.example.citation.v0_1",

              sourceTitle:
                "Example lexical source",

              sourceAuthorOrEditor:
                null,

              sourcePublisherOrHost:
                "Example Publisher",

              sourceDateOrVersion:
                "v1",

              sourceUrlOrArchiveRef:
                "https://example.invalid/source",

              entryLocator:
                "entry FORM",

              sourceHashOrArchiveHash:
                null,

              attestedForm:
                "FORM",

              attestedGloss:
                "example gloss",
            },
          ],

          proposedComparisonForm:
            "FORM",

          proposedComparisonMode:
            "orthography",

          proposedComparisonAuthority:
            "source_orthography",

          proposedComparisonProvenance: {
            provenanceId:
              "candidate.example.orthography.v0_1",

            authority:
              "source_orthography",

            ruleId:
              null,

            evidenceRefs: [],
          },

          reviewStatus:
            "ready_for_admission_review",
        };

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(true);

        expect(
          result.readyForAdmissionReviewCandidateIds,
        ).toEqual([
          "candidate.example.language-a.v0_1",
        ]);

        expect(
          input.researchOnly,
        ).toBe(true);

        expect(
          input.admittedCohortId,
        ).toBeNull();
      },
    );

    it(
      "requires a named rule for transliteration or functional normalization",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0] = {
          ...input.candidates[0],

          surfaceForm:
            "surface",

          attestedGloss:
            "example",

          sourceStatus:
            "research_candidate",

          citations: [
            {
              citationId:
                "candidate.example.transliteration-citation.v0_1",

              sourceTitle:
                "Example source",

              sourceAuthorOrEditor:
                null,

              sourcePublisherOrHost:
                "Example Publisher",

              sourceDateOrVersion:
                "v1",

              sourceUrlOrArchiveRef:
                "https://example.invalid/source",

              entryLocator:
                "entry surface",

              sourceHashOrArchiveHash:
                null,

              attestedForm:
                "surface",

              attestedGloss:
                "example",
            },
          ],

          proposedComparisonForm:
            "SURFACE",

          proposedComparisonMode:
            "transliteration",

          proposedComparisonAuthority:
            "example_scheme",

          proposedComparisonProvenance: {
            provenanceId:
              "candidate.example.transliteration.v0_1",

            authority:
              "example_scheme",

            ruleId:
              null,

            evidenceRefs: [],
          },

          reviewStatus:
            "ready_for_admission_review",
        };

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toContain(
          "ready_comparison_rule_id_missing",
        );
      },
    );

    it(
      "normalizes duplicate candidate ids before classification regardless of order",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0] = {
          ...input.candidates[0],

          surfaceForm:
            "FORM",

          attestedGloss:
            "example gloss",

          sourceStatus:
            "research_candidate",

          citations: [
            {
              citationId:
                "candidate.example.duplicate-ready.v0_1",

              sourceTitle:
                "Example lexical source",

              sourceAuthorOrEditor:
                null,

              sourcePublisherOrHost:
                "Example Publisher",

              sourceDateOrVersion:
                "v1",

              sourceUrlOrArchiveRef:
                "https://example.invalid/source",

              entryLocator:
                "entry FORM",

              sourceHashOrArchiveHash:
                null,

              attestedForm:
                "FORM",

              attestedGloss:
                "example gloss",
            },
          ],

          proposedComparisonForm:
            "FORM",

          proposedComparisonMode:
            "orthography",

          proposedComparisonAuthority:
            "source_orthography",

          proposedComparisonProvenance: {
            provenanceId:
              "candidate.example.duplicate-ready.provenance.v0_1",

            authority:
              "source_orthography",

            ruleId:
              null,

            evidenceRefs: [],
          },

          reviewStatus:
            "ready_for_admission_review",
        };

        input.candidates.push({
          ...JSON.parse(
            JSON.stringify(
              input.candidates[0],
            ),
          ),

          candidateObservationId:
            " candidate.example.language-a.v0_1 ",
        });

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toContain(
          "duplicate_candidate_id",
        );

        expect(
          result.readyForAdmissionReviewCandidateIds,
        ).toEqual([]);

        const reversedInput =
          JSON.parse(
            JSON.stringify(
              input,
            ),
          ) as any;

        reversedInput.candidates.reverse();

        const reversedResult =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            reversedInput,
          );

        expect(
          reversedResult.valid,
        ).toBe(false);

        expect(
          reversedResult.reasonCodes,
        ).toContain(
          "duplicate_candidate_id",
        );

        expect(
          reversedResult.readyForAdmissionReviewCandidateIds,
        ).toEqual([]);
      },
    );

    it(
      "rejects runtime attempts to escape the research-only staging boundary",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.researchOnly =
          false;

        input.admittedCohortId =
          "research.recurrence.illegal.v0_1";

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toEqual(
          expect.arrayContaining([
            "research_only_boundary_invalid",
            "admitted_cohort_boundary_invalid",
          ]),
        );
      },
    );

    it(
      "requires a ready citation to attest the declared lexical surface",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0] = {
          ...input.candidates[0],

          surfaceForm:
            "FORM",

          attestedGloss:
            "example gloss",

          sourceStatus:
            "research_candidate",

          citations: [
            {
              citationId:
                "candidate.example.wrong-surface.v0_1",

              sourceTitle:
                "Example lexical source",

              sourceAuthorOrEditor:
                null,

              sourcePublisherOrHost:
                "Example Publisher",

              sourceDateOrVersion:
                "v1",

              sourceUrlOrArchiveRef:
                "https://example.invalid/source",

              entryLocator:
                "entry OTHER",

              sourceHashOrArchiveHash:
                null,

              attestedForm:
                "OTHER",

              attestedGloss:
                "example gloss",
            },
          ],

          proposedComparisonForm:
            "FORM",

          proposedComparisonMode:
            "orthography",

          proposedComparisonAuthority:
            "source_orthography",

          proposedComparisonProvenance: {
            provenanceId:
              "candidate.example.orthography.v0_1",

            authority:
              "source_orthography",

            ruleId:
              null,

            evidenceRefs: [],
          },

          reviewStatus:
            "ready_for_admission_review",
        };

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toContain(
          "ready_surface_attestation_missing",
        );
      },
    );

    it(
      "rejects unknown review statuses instead of treating them as ready",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0].reviewStatus =
          "approved";

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toContain(
          "review_status_invalid",
        );

        expect(
          result.readyForAdmissionReviewCandidateIds,
        ).toEqual([]);
      },
    );

    it(
      "reports malformed citation data instead of throwing during normalization",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0] = {
          ...input.candidates[0],

          surfaceForm:
            "FORM",

          attestedGloss:
            "example gloss",

          sourceStatus:
            "research_candidate",

          citations: [
            {
              citationId:
                "candidate.example.malformed.v0_1",

              sourceTitle:
                "Example source",

              sourceAuthorOrEditor:
                null,

              sourcePublisherOrHost:
                "Example Publisher",

              sourceDateOrVersion:
                "v1",

              sourceUrlOrArchiveRef:
                "https://example.invalid/source",

              entryLocator:
                "entry FORM",

              sourceHashOrArchiveHash:
                null,

              attestedForm:
                undefined,

              attestedGloss:
                "example gloss",
            },
          ],

          proposedComparisonForm:
            "FORM",

          proposedComparisonMode:
            "orthography",

          proposedComparisonAuthority:
            "source_orthography",

          proposedComparisonProvenance: {
            provenanceId:
              "candidate.example.orthography.v0_1",

            authority:
              "source_orthography",

            ruleId:
              null,

            evidenceRefs: [],
          },

          reviewStatus:
            "ready_for_admission_review",
        };

        expect(
          () =>
            validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
              input,
            ),
        ).not.toThrow();

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toContain(
          "ready_citation_incomplete",
        );
      },
    );

    it(
      "requires a citation to attest the declared surface and gloss together",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0] = {
          ...input.candidates[0],

          surfaceForm:
            "FORM",

          attestedGloss:
            "fire",

          sourceStatus:
            "research_candidate",

          citations: [
            {
              citationId:
                "candidate.example.gloss-mismatch.v0_1",

              sourceTitle:
                "Example source",

              sourceAuthorOrEditor:
                null,

              sourcePublisherOrHost:
                "Example Publisher",

              sourceDateOrVersion:
                "v1",

              sourceUrlOrArchiveRef:
                "https://example.invalid/source",

              entryLocator:
                "entry FORM",

              sourceHashOrArchiveHash:
                null,

              attestedForm:
                "FORM",

              attestedGloss:
                "water",
            },
          ],

          proposedComparisonForm:
            "FORM",

          proposedComparisonMode:
            "orthography",

          proposedComparisonAuthority:
            "source_orthography",

          proposedComparisonProvenance: {
            provenanceId:
              "candidate.example.orthography.v0_1",

            authority:
              "source_orthography",

            ruleId:
              null,

            evidenceRefs: [],
          },

          reviewStatus:
            "ready_for_admission_review",
        };

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toContain(
          "ready_surface_gloss_attestation_missing",
        );
      },
    );

    it(
      "rejects incomplete comparison provenance before admission review",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0] = {
          ...input.candidates[0],

          surfaceForm:
            "FORM",

          attestedGloss:
            "example gloss",

          sourceStatus:
            "research_candidate",

          citations: [
            {
              citationId:
                "candidate.example.provenance.v0_1",

              sourceTitle:
                "Example source",

              sourceAuthorOrEditor:
                null,

              sourcePublisherOrHost:
                "Example Publisher",

              sourceDateOrVersion:
                "v1",

              sourceUrlOrArchiveRef:
                "https://example.invalid/source",

              entryLocator:
                "entry FORM",

              sourceHashOrArchiveHash:
                null,

              attestedForm:
                "FORM",

              attestedGloss:
                "example gloss",
            },
          ],

          proposedComparisonForm:
            "FORM",

          proposedComparisonMode:
            "orthography",

          proposedComparisonAuthority:
            "source_orthography",

          proposedComparisonProvenance: {
            provenanceId:
              "",

            authority:
              "source_orthography",

            ruleId:
              null,

            evidenceRefs: [
              123,
            ],
          },

          reviewStatus:
            "ready_for_admission_review",
        };

        const result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toContain(
          "ready_comparison_provenance_invalid",
        );
      },
    );

    it(
      "fails closed for malformed packet and candidate containers instead of throwing",
      () => {
        const malformedPackets: any[] = [
          null,
          {
            ...packet(),
            candidates:
              null,
          },
          {
            ...packet(),
            candidates: [
              null,
            ],
          },
          {
            ...packet(),
            candidates: [
              {
                ...packet().candidates[0],
                claimBoundary:
                  null,
              },
            ],
          },
          {
            ...packet(),
            candidates: [
              {
                ...packet().candidates[0],
                reviewStatus:
                  "reject",
                reviewNotes:
                  null,
              },
            ],
          },
          {
            ...packet(),
            candidates: [
              {
                ...packet().candidates[0],
                reviewStatus:
                  "ready_for_admission_review",
                citations:
                  null,
              },
            ],
          },
        ];

        for (
          const input
          of malformedPackets
        ) {
          expect(
            () =>
              validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
                input,
              ),
          ).not.toThrow();

          expect(
            validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
              input,
            ).valid,
          ).toBe(false);
        }
      },
    );

    it(
      "rejects runtime discriminator values that downstream cohort admission does not accept",
      () => {
        const makeReady =
          () => {
            const input =
              JSON.parse(
                JSON.stringify(
                  packet(),
                ),
              ) as any;

            input.candidates[0] = {
              ...input.candidates[0],

              surfaceForm:
                "FORM",

              attestedGloss:
                "example gloss",

              sourceStatus:
                "research_candidate",

              citations: [
                {
                  citationId:
                    "candidate.example.runtime-enums.v0_1",

                  sourceTitle:
                    "Example source",

                  sourceAuthorOrEditor:
                    null,

                  sourcePublisherOrHost:
                    "Example Publisher",

                  sourceDateOrVersion:
                    "v1",

                  sourceUrlOrArchiveRef:
                    "https://example.invalid/source",

                  entryLocator:
                    "entry FORM",

                  sourceHashOrArchiveHash:
                    null,

                  attestedForm:
                    "FORM",

                  attestedGloss:
                    "example gloss",
                },
              ],

              proposedComparisonForm:
                "FORM",

              proposedComparisonMode:
                "orthography",

              proposedComparisonAuthority:
                "source_orthography",

              proposedComparisonProvenance: {
                provenanceId:
                  "candidate.example.runtime-enums.provenance.v0_1",

                authority:
                  "source_orthography",

                ruleId:
                  null,

                evidenceRefs: [],
              },

              reviewStatus:
                "ready_for_admission_review",
            };

            return input;
          };

        {
          const input =
            makeReady();

          input.candidates[0].intendedEvidenceRole =
            "positive_control";

          const result =
            validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
              input,
            );

          expect(
            result.valid,
          ).toBe(false);

          expect(
            result.reasonCodes,
          ).toContain(
            "intended_evidence_role_invalid",
          );

          expect(
            result.readyForAdmissionReviewCandidateIds,
          ).toEqual([]);
        }

        {
          const input =
            makeReady();

          input.candidates[0].languageVariety =
            123;

          const result =
            validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
              input,
            );

          expect(
            result.valid,
          ).toBe(false);

          expect(
            result.reasonCodes,
          ).toContain(
            "language_variety_invalid",
          );
        }

        {
          const input =
            makeReady();

          input.candidates[0].sourceStatus =
            "approved";

          const result =
            validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
              input,
            );

          expect(
            result.valid,
          ).toBe(false);

          expect(
            result.reasonCodes,
          ).toContain(
            "ready_source_status_invalid",
          );
        }

        {
          const input =
            makeReady();

          input.candidates[0].proposedComparisonMode =
            "phonetic";

          input.candidates[0].proposedComparisonProvenance.ruleId =
            "some.rule";

          const result =
            validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
              input,
            );

          expect(
            result.valid,
          ).toBe(false);

          expect(
            result.reasonCodes,
          ).toContain(
            "ready_comparison_mode_invalid",
          );
        }
      },
    );

    it(
      "validates malformed present evidence even while status remains needs_source",
      () => {
        const mutations = [
          (input: any) => {
            input.candidates[0].surfaceForm =
              123;
          },

          (input: any) => {
            input.candidates[0].sourceStatus =
              "approved";
          },

          (input: any) => {
            input.candidates[0].citations = [
              null,
            ];
          },

          (input: any) => {
            input.candidates[0].proposedComparisonMode =
              "phonetic";
          },

          (input: any) => {
            input.candidates[0].proposedComparisonProvenance = {
              provenanceId:
                "",

              authority:
                "source_orthography",

              ruleId:
                null,

              evidenceRefs: [],
            };
          },
        ];

        for (
          const mutate
          of mutations
        ) {
          const input =
            JSON.parse(
              JSON.stringify(
                packet(),
              ),
            ) as any;

          mutate(
            input,
          );

          const result =
            validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
              input,
            );

          expect(
            result.valid,
          ).toBe(false);

          expect(
            result.reasonCodes,
          ).toContain(
            "candidate_present_evidence_invalid",
          );

          expect(
            result.needsSourceCandidateIds,
          ).toEqual([]);
        }
      },
    );

    it(
      "rejects non-string nullable citation metadata",
      () => {
        for (
          const field
          of [
            "sourceAuthorOrEditor",
            "sourceHashOrArchiveHash",
          ] as const
        ) {
          const input =
            JSON.parse(
              JSON.stringify(
                packet(),
              ),
            ) as any;

          input.candidates[0] = {
            ...input.candidates[0],

            surfaceForm:
              "FORM",

            attestedGloss:
              "example gloss",

            sourceStatus:
              "research_candidate",

            citations: [
              {
                citationId:
                  "candidate.example.bad-citation-metadata.v0_1",

                sourceTitle:
                  "Example lexical source",

                sourceAuthorOrEditor:
                  null,

                sourcePublisherOrHost:
                  "Example Publisher",

                sourceDateOrVersion:
                  "v1",

                sourceUrlOrArchiveRef:
                  "https://example.invalid/source",

                entryLocator:
                  "entry FORM",

                sourceHashOrArchiveHash:
                  null,

                attestedForm:
                  "FORM",

                attestedGloss:
                  "example gloss",
              },
            ],

            proposedComparisonForm:
              "FORM",

            proposedComparisonMode:
              "orthography",

            proposedComparisonAuthority:
              "source_orthography",

            proposedComparisonProvenance: {
              provenanceId:
                "candidate.example.bad-citation-metadata.provenance.v0_1",

              authority:
                "source_orthography",

              ruleId:
                null,

              evidenceRefs: [],
            },

            reviewStatus:
              "ready_for_admission_review",
          };

          input.candidates[0].citations[0][field] = {
            invalid:
              true,
          };

          const result =
            validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
              input,
            );

          expect(
            result.valid,
          ).toBe(false);

          expect(
            result.reasonCodes,
          ).toEqual(
            expect.arrayContaining([
              "candidate_present_evidence_invalid",
              "ready_citation_incomplete",
            ]),
          );
        }
      },
    );

    it(
      "preserves rejected research candidates and requires an explicit reason",
      () => {
        const input =
          JSON.parse(
            JSON.stringify(
              packet(),
            ),
          ) as any;

        input.candidates[0].reviewStatus =
          "reject";

        let result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.reasonCodes,
        ).toContain(
          "rejected_candidate_missing_reason",
        );

        input.candidates[0].reviewNotes = [
          "source does not attest the required lexical meaning",
        ];

        result =
          validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
            input,
          );

        expect(
          result.valid,
        ).toBe(true);

        expect(
          result.rejectedCandidateIds,
        ).toEqual([
          "candidate.example.language-a.v0_1",
        ]);
      },
    );
  },
);
