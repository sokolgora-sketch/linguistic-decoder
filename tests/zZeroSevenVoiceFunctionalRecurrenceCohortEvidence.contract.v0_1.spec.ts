import fs from "node:fs";

const DOC =
  "docs/open-instrument/z-zero-seven-voice-functional-recurrence-cohort-evidence-contract-v0.1.md";

const IMPLEMENTATION =
  "src/shared/openInstrument/sevenVoiceFunctionalRecurrenceCohortEvidence.v0_1.ts";

const EXISTING_RECURRENCE =
  "src/shared/openInstrument/sevenVoiceFunctionalRecurrence.v0_1.ts";

function read(
  path: string,
): string {
  return fs.readFileSync(
    path,
    "utf8",
  );
}

describe(
  "ZË-RO Seven-Voice Functional Recurrence Cohort Evidence Contract v0.1 milestone",
  () => {
    it(
      "locks milestone identity and the evidence-before-recurrence architecture",
      () => {
        const doc =
          read(DOC);

        expect(doc).toContain(
          "SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_CONTRACT_V0_1",
        );

        expect(doc).toContain(
          "open-instrument.seven-voice-functional-recurrence-cohort-evidence.v0_1",
        );

        expect(doc).toContain(
          "`source evidence`\n→ `cohort evidence admission`\n→ `validated comparison forms`\n→ `existing Seven-Voice Functional Recurrence engine`",
        );

        expect(doc).toContain(
          "**Evidence admission precedes recurrence statistics.**",
        );
      },
    );

    it(
      "locks whole-cohort fail-closed behavior and preservation of negative controls",
      () => {
        const doc =
          read(DOC);

        expect(doc).toContain(
          "the complete cohort is rejected",
        );

        expect(doc).toContain(
          "no partial observation set is emitted",
        );

        expect(doc).toContain(
          "no recurrence forms are emitted",
        );

        expect(doc).toContain(
          "`negative_control`",
        );

        expect(doc).toContain(
          "Counterexamples are valid evidence",
        );

        expect(doc).toContain(
          "Null / empty recurrence is a valid result.",
        );
      },
    );

    it(
      "locks source attestation and explicit comparison-mode provenance",
      () => {
        const doc =
          read(DOC);

        for (
          const required
          of [
            "source-attested surface form",
            "structured citations",
            "`fact`",
            "`inference`",
            "`orthography`",
            "`transliteration`",
            "`z_zero_functional_normalization`",
            "a non-empty rule id",
            "`comparisonAuthority`",
            "`comparisonProvenance.authority`",
          ]
        ) {
          expect(doc).toContain(
            required,
          );
        }

        expect(doc).toContain(
          "The recurrence admission layer does not invent a normalization.",
        );

        expect(doc).toContain(
          "A transliteration may not silently masquerade as orthography.",
        );
      },
    );

    it(
      "locks the non-promotion and no-single-winner claim boundary",
      () => {
        const doc =
          read(DOC);

        for (
          const required
          of [
            "`historicalOriginClaim = not_claimed`",
            "`historicalTransmissionClaim = not_claimed`",
            "`cognacyClaim = not_claimed`",
            "`borrowingClaim = not_claimed`",
            "`winnerClaim = not_claimed`",
            "`languageSuperiorityClaim = not_claimed`",
            "`candidateTruthClaim = not_claimed`",
            "`universalityClaim = not_claimed`",
            "`userDecisionPosture = user_decides`",
            "`no_single_winner`",
          ]
        ) {
          expect(doc).toContain(
            required,
          );
        }
      },
    );

    it(
      "locks the milestone as contract-only with no runtime, provider, catalog-data, or statistics promotion",
      () => {
        const doc =
          read(DOC);

        expect(doc).toContain(
          "No production/runtime wiring",
        );

        expect(doc).toContain(
          "No real cohort data in this milestone",
        );

        expect(doc).toContain(
          "This milestone does not add a production recurrence evidence catalog.",
        );

        expect(doc).toContain(
          "No statistical claim",
        );

        expect(doc).toContain(
          "It does not claim that fixture citations constitute external linguistic evidence.",
        );
      },
    );

    it(
      "locks the implementation as an admission wrapper around the existing recurrence engine rather than a replacement algorithm",
      () => {
        const implementation =
          read(
            IMPLEMENTATION,
          );

        const existingRecurrence =
          read(
            EXISTING_RECURRENCE,
          );

        expect(
          implementation,
        ).toContain(
          'from "./sevenVoiceFunctionalRecurrence.v0_1"',
        );

        expect(
          implementation,
        ).toContain(
          "analyzeSevenVoiceFunctionalRecurrenceV0_1({",
        );

        expect(
          implementation,
        ).toContain(
          "admission.recurrenceForms",
        );

        expect(
          existingRecurrence,
        ).toContain(
          "analyzeSevenVoiceFunctionalRecurrenceV0_1",
        );

        expect(
          implementation,
        ).toContain(
          "status:\n        \"rejected\"",
        );

        expect(
          implementation,
        ).toContain(
          "recurrence:\n        null",
        );
      },
    );
  },
);
