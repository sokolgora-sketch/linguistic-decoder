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
            "the complete corpus or sampling-frame definition must be preregistered and frozen before holdout evidence is examined",
            "the represented population",
            "eligible languages or varieties",
            "eligible lexical concepts",
            "source-accessibility treatment",
            "missing or inaccessible evidence treatment",
            "the fixed-versus-adaptive corpus posture",
            "the duplicate lexical or source evidence control rule",
            "Any post-hoc change to those sampling-frame decisions after holdout evidence has been examined must remain explicitly exploratory",
            "## Cohort-selection rules",
            "## Positive controls, negative controls, and counterexamples",
            "## Independence and dependence",
            "the dependence treatment must be preregistered and frozen before confirmatory evidence is examined",
            "which genealogical dependencies are grouped or otherwise treated as dependent",
            "which areal dependencies are grouped or otherwise treated as dependent",
            "which lexical dependencies are grouped or otherwise treated as dependent",
            "which source dependencies are grouped or otherwise treated as dependent",
            "how each declared dependence class is modeled, clustered, bounded, or otherwise incorporated into the reviewed analysis",
            "Post-hoc alternative dependence groupings, cluster definitions, models, bounding rules, or correlation treatments introduced after confirmatory evidence has been examined must remain explicitly exploratory",
            "This milestone does not choose a concrete dependence model, invent dependence clusters, invent correlation coefficients, or compute a dependence adjustment.",
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

        for (
          const required
          of [
            "preregister at least one positive-control cohort or positive-control class before confirmatory evidence is examined",
            "Failure of a required positive control must block or invalidate confirmatory inference",
            "the analysis must return `insufficient_data` or another explicitly reviewed blocked-control state",
            "This milestone does not invent or designate a concrete new positive-control cohort.",
            "the empirical baseline specification must be frozen before holdout evidence is examined",
            "the null-model specification must also be frozen before holdout evidence is examined",
            "Post-hoc alternative baselines, null models, randomization or modeling rules, or preserved-structure choices must remain explicitly exploratory",
            "must prospectively justify the planned sample size or evidence volume",
            "a power analysis tied to the preregistered effect-size assumptions",
            "a precision / uncertainty-width target tied to the preregistered inferential question",
            "If the preregistered adequacy criterion is not met, confirmatory inference must remain blocked and the result must be `insufficient_data`.",
            "This requirement does not authorize this milestone to invent a numeric minimum cohort count, sample size, power threshold, or uncertainty-width threshold.",
          ]
        ) {
          expect(doc).toContain(
            required,
          );
        }
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
            "the complete hypothesis family must be preregistered and frozen before confirmatory evidence is examined",
            "the sole primary endpoint or primary hypothesis, if one exists",
            "every secondary endpoint intended to remain confirmatory",
            "the multiplicity-correction procedure covering every non-primary confirmatory test that requires correction",
            "Post-hoc narrowing of the hypothesis family, post-hoc endpoint selection, or post-hoc changes to the multiplicity-correction procedure after confirmatory evidence has been examined must remain explicitly exploratory",
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
            "Every future confirmatory inferential result must report an effect size or effect magnitude on the declared unit of analysis together with an uncertainty interval.",
            "must preregister the confidence or credible level used for that interval, or another explicitly reviewed uncertainty level and procedure",
            "A statistical-significance result or p-value alone must not be presented as evidence of practical importance, effect magnitude, or precision.",
            "Post-hoc changes to the uncertainty level, interval procedure, or effect-size definition after confirmatory evidence has been examined must remain explicitly exploratory",
            "This milestone does not choose an effect-size statistic, invent a numeric effect-size threshold, invent a confidence or credible level, compute an effect size, or compute an uncertainty interval.",
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
