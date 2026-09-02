import fs from "node:fs";

const DOC =
  "docs/open-instrument/z-zero-seven-voice-functional-recurrence-statistics-research-design-v0.1.md";

function read(
  path: string,
): string {
  return fs.readFileSync(
    path,
    "utf8",
  );
}

describe(
  "ZË-RO Seven-Voice Functional Recurrence Statistics Research Design v0.1",
  () => {
    it(
      "locks the milestone as design-only and explicitly non-implementing",
      () => {
        const doc =
          read(DOC);

        expect(doc).toContain(
          "SEVEN_VOICE_FUNCTIONAL_RECURRENCE_STATISTICS_RESEARCH_DESIGN_V0_1",
        );

        expect(doc).toContain(
          "open-instrument.seven-voice-functional-recurrence-statistics-research-design.v0_1",
        );

        expect(doc).toContain(
          "Status: DESIGN_ONLY.",
        );

        expect(doc).toContain(
          "It does not calculate statistics.",
        );

        expect(doc).toContain(
          "It does not authorize statistics implementation.",
        );

        expect(doc).toContain(
          "**Evidence admission precedes recurrence statistics.**",
        );
      },
    );

    it(
      "locks current evidence to WATER EYE and FATHER without inventing a numeric threshold",
      () => {
        const doc =
          read(DOC);

        for (
          const required
          of [
            "WATER → shared `U`",
            "EYE → shared `Y`",
            "FATHER → shared `A`",
            "This design does not choose a numeric minimum cohort count.",
            "The number three is not itself treated as a statistical threshold.",
            "The current three live cohorts do not, by themselves, authorize inferential statistics.",
            "`insufficient_data`",
          ]
        ) {
          expect(doc).toContain(
            required,
          );
        }
      },
    );

    it(
      "requires an explicit corpus cohort-selection controls dependence baseline and null model",
      () => {
        const doc =
          read(DOC);

        for (
          const required
          of [
            "## Corpus definition",
            "## Cohort-selection rules",
            "## Positive controls, negative controls, and counterexamples",
            "## Independence and dependence",
            "## Comparison-mode separation",
            "## Canonical-voice baseline frequencies",
            "## Null model",
            "## Minimum evidence and insufficiency posture",
          ]
        ) {
          expect(doc).toContain(
            required,
          );
        }

        expect(doc).toContain(
          "Outcome-driven cohort selection is prohibited.",
        );

        expect(doc).toContain(
          "No assumption of equal `1/7` baseline probability is authorized by this milestone.",
        );

        expect(doc).toContain(
          "This milestone does not select a permutation test, parametric model, Bayesian model, bootstrap, or other statistical method.",
        );
      },
    );

    it(
      "preserves explicit comparison modes and forbids silent pooling",
      () => {
        const doc =
          read(DOC);

        for (
          const required
          of [
            "`orthography`",
            "`transliteration`",
            "`z_zero_functional_normalization`",
            "A future statistics design must not pool these modes silently.",
            "`WATER -> UOTER` remains explicit ZË-RO functional-normalization doctrine",
          ]
        ) {
          expect(doc).toContain(
            required,
          );
        }
      },
    );

    it(
      "locks adaptive stopping discovery-confirmatory separation and multiplicity handling",
      () => {
        const doc =
          read(DOC);

        for (
          const required
          of [
            "preregister a stopping rule",
            "sequential-inference method",
            "Repeatedly checking a conventional significance result and stopping when a preferred threshold appears is prohibited.",
            "### Discovery versus confirmatory evidence",
            "remain exploratory evidence",
            "independent preregistered holdout",
            "Reusing discovery cohorts as though they were an independent holdout is prohibited.",
            "## Multiplicity and confirmatory endpoints",
            "define the hypothesis family before confirmatory testing begins",
            "preregister one sole primary endpoint or primary hypothesis",
            "multiplicity-correction procedure",
            "- or remain explicitly exploratory and must not be presented as confirmatory statistical evidence",
            "Every confirmatory endpoint outside the sole preregistered primary endpoint",
            "Secondary voices, concepts, modes, subgroup analyses, alternative statistics, and other non-primary tests do not become confirmatory merely because one primary endpoint was preregistered.",
            "comparison authority and deterministic transformation procedure must also be frozen before holdout evidence is examined",
            "the applicable non-empty rule id",
            "The exact comparison form for a holdout must therefore be derived under the frozen authority and rule rather than selected after inspecting the holdout result.",
            "Post-hoc alternative transliterations, normalizations, authorities, rule ids, or comparison forms must remain explicitly exploratory",
          ]
        ) {
          expect(doc).toContain(
            required,
          );
        }
      },
    );

    it(
      "locks Null insufficiency truth hierarchy and non-promotion boundaries",
      () => {
        const doc =
          read(DOC);

        for (
          const required
          of [
            "Fact",
            "Inference",
            "Hypothesis",
            "Unknown / Null",
            "Null and insufficiency are valid scientific outcomes.",
            "`candidateTruthClaim = not_claimed`",
            "`universalityClaim = not_claimed`",
            "`userDecisionPosture = user_decides`",
            "`no_single_winner`",
            "## Promotion prohibition",
          ]
        ) {
          expect(doc).toContain(
            required,
          );
        }
      },
    );

    it(
      "locks statistics implementation API UI engine catalog provider and JO work as unauthorized",
      () => {
        const doc =
          read(DOC);

        expect(doc).toContain(
          "## No implementation authorization",
        );

        for (
          const required
          of [
            "recurrence statistics runtime code",
            "statistics helpers",
            "statistical libraries",
            "API routes",
            "UI surfaces",
            "recurrence engine logic",
            "evidence-admission logic",
            "research catalog data",
            "new source-backed cohorts",
            "provider execution",
            "evidence promotion",
            "JO runtime work",
          ]
        ) {
          expect(doc).toContain(
            required,
          );
        }

        expect(doc).toContain(
          "`blocked_methodology_incomplete`",
        );

        expect(doc).toContain(
          "`not_authorized`",
        );
      },
    );
  },
);
