import {
  sevenVoiceFunctionalRecurrenceResearchCohortCatalogV0_1,
} from "@/data/sevenVoiceFunctionalRecurrenceResearchCohorts.v0_1";

import {
  analyzeSevenVoiceFunctionalRecurrenceFromCohortEvidenceV0_1,
} from "@/shared/openInstrument/sevenVoiceFunctionalRecurrenceCohortEvidence.v0_1";

import {
  buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1,
  resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1,
} from "@/shared/openInstrument/sevenVoiceFunctionalRecurrenceResearchCatalog.v0_1";

const EXPECTED_EVIDENCE_CLAIM_BOUNDARY_V0_1 = {
  historicalOriginClaim: "not_claimed",
  historicalTransmissionClaim: "not_claimed",
  cognacyClaim: "not_claimed",
  borrowingClaim: "not_claimed",
  winnerClaim: "not_claimed",
  languageSuperiorityClaim: "not_claimed",
  candidateTruthClaim: "not_claimed",
  universalityClaim: "not_claimed",
  userDecisionPosture: "user_decides",
} as const;

const EXPECTED_RECURRENCE_CLAIM_BOUNDARY_V0_1 = {
  recurrenceObservationTruth:
    "fact_within_declared_comparison_forms",
  functionalVoiceMeaningTruth:
    "research_hypothesis",
  phoneticIdentityClaim:
    "not_claimed",
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
  candidateTruthClaim:
    "not_claimed",
  universalityClaim:
    "not_claimed",
  userDecisionPosture:
    "user_decides",
} as const;

function normalizeIdentityV0_1(
  value: string,
): string {
  return value
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("en-US");
}

describe(
  "Open Instrument Seven-Voice Functional Recurrence catalog-wide validation v0.1",
  () => {
    it(
      "keeps catalog identities collision-free and every identity generically resolvable",
      () => {
        expect(
          sevenVoiceFunctionalRecurrenceResearchCohortCatalogV0_1.length,
        ).toBeGreaterThan(0);

        const conceptOwners =
          new Map<string, string>();

        const cohortIds =
          new Set<string>();

        const recurrenceEvidenceIds =
          new Set<string>();

        for (
          const entry
          of sevenVoiceFunctionalRecurrenceResearchCohortCatalogV0_1
        ) {
          expect(
            entry.conceptId,
          ).toBe(
            entry.cohort.conceptId,
          );

          expect(
            entry.conceptId.trim(),
          ).not.toBe("");

          expect(
            cohortIds.has(
              entry.cohort.cohortId,
            ),
          ).toBe(false);

          cohortIds.add(
            entry.cohort.cohortId,
          );

          for (
            const identity
            of [
              entry.conceptId,
              ...entry.aliases,
            ]
          ) {
            const normalized =
              normalizeIdentityV0_1(
                identity,
              );

            expect(
              normalized,
            ).not.toBe("");

            const existingOwner =
              conceptOwners.get(
                normalized,
              );

            expect(
              existingOwner == null ||
                existingOwner ===
                  entry.conceptId,
            ).toBe(true);

            conceptOwners.set(
              normalized,
              entry.conceptId,
            );

            expect(
              resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1(
                identity,
              )?.conceptId,
            ).toBe(
              entry.conceptId,
            );
          }

          const observationKeys =
            new Set<string>();

          for (
            const row
            of entry.cohort.observations
          ) {
            expect(
              recurrenceEvidenceIds.has(
                row.recurrenceEvidenceId,
              ),
            ).toBe(false);

            recurrenceEvidenceIds.add(
              row.recurrenceEvidenceId,
            );

            const observationKey =
              [
                normalizeIdentityV0_1(
                  row.languageId,
                ),
                normalizeIdentityV0_1(
                  row.languageVariety ?? "",
                ),
                normalizeIdentityV0_1(
                  row.surfaceForm,
                ),
                normalizeIdentityV0_1(
                  row.comparisonForm,
                ),
                row.comparisonMode,
                normalizeIdentityV0_1(
                  row.comparisonAuthority,
                ),
              ].join("|");

            expect(
              observationKeys.has(
                observationKey,
              ),
            ).toBe(false);

            observationKeys.add(
              observationKey,
            );

            expect(
              row.claimBoundary,
            ).toEqual(
              EXPECTED_EVIDENCE_CLAIM_BOUNDARY_V0_1,
            );

            expect(
              row.comparisonProvenance
                .provenanceId
                .trim(),
            ).not.toBe("");

            expect(
              row.comparisonProvenance
                .authority,
            ).toBe(
              row.comparisonAuthority,
            );

            if (
              row.comparisonMode !==
              "orthography"
            ) {
              expect(
                row.comparisonProvenance
                  .ruleId
                  ?.trim(),
              ).toBeTruthy();
            }

            expect(
              row.comparisonProvenance
                .evidenceRefs
                .every(
                  (ref) =>
                    ref.trim().length >
                    0,
                ),
            ).toBe(true);

            expect(
              row.citations.length,
            ).toBeGreaterThan(0);

            for (
              const citation
              of row.citations
            ) {
              expect(
                citation.citationId
                  .trim(),
              ).not.toBe("");

              expect(
                citation.sourceTitle
                  .trim(),
              ).not.toBe("");

              expect(
                citation.sourcePublisherOrHost
                  .trim(),
              ).not.toBe("");

              expect(
                citation.sourceDateOrVersion
                  .trim(),
              ).not.toBe("");

              expect(
                citation.sourceUrlOrArchiveRef
                  .trim(),
              ).not.toBe("");

              expect(
                citation.entryLocator
                  .trim(),
              ).not.toBe("");

              expect(
                citation.attestedForm
                  .trim(),
              ).not.toBe("");

              expect(
                citation.attestedGloss
                  .trim(),
              ).not.toBe("");
            }
          }
        }
      },
    );

    it(
      "admits and deterministically projects every catalog cohort without concept-specific test wiring",
      () => {
        for (
          const entry
          of sevenVoiceFunctionalRecurrenceResearchCohortCatalogV0_1
        ) {
          const analysis =
            analyzeSevenVoiceFunctionalRecurrenceFromCohortEvidenceV0_1(
              entry.cohort,
            );

          expect(
            analysis.status,
          ).toBe(
            "accepted",
          );

          expect(
            analysis.admission
              .reasonCodes,
          ).toEqual([]);

          const first =
            buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1(
              entry.conceptId,
            );

          const second =
            buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1(
              entry.conceptId,
            );

          expect(
            second,
          ).toEqual(
            first,
          );

          expect(
            first?.status,
          ).toBe(
            "available",
          );

          if (
            !first ||
            first.status !==
              "available"
          ) {
            throw new Error(
              `expected admitted catalog surface for ${entry.conceptId}`,
            );
          }

          expect(
            first.conceptId,
          ).toBe(
            entry.conceptId,
          );

          expect(
            first.cohortId,
          ).toBe(
            entry.cohort.cohortId,
          );

          expect(
            first.observations.map(
              (row) =>
                row.recurrenceEvidenceId,
            ),
          ).toEqual(
            entry.cohort
              .observations
              .map(
                (row) =>
                  row.recurrenceEvidenceId,
              ),
          );

          expect(
            first.observations.length,
          ).toBe(
            entry.cohort
              .observations
              .length,
          );

          expect(
            first.sharedFunctionalNucleus,
          ).toEqual(
            first.sharedCanonicalVoices,
          );

          expect(
            first.truth,
          ).toEqual({
            recurrenceObservationTruth:
              "fact_within_declared_comparison_forms",
            functionalVoiceMeaningTruth:
              "research_hypothesis",
          });

          expect(
            first.claimBoundary,
          ).toEqual(
            EXPECTED_RECURRENCE_CLAIM_BOUNDARY_V0_1,
          );
        }
      },
    );

    it(
      "keeps unknown catalog identities fail-closed",
      () => {
        expect(
          resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1(
            "__unknown_fvr_catalog_contract__",
          ),
        ).toBeNull();

        expect(
          buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1(
            "__unknown_fvr_catalog_contract__",
          ),
        ).toBeNull();
      },
    );
  },
);
