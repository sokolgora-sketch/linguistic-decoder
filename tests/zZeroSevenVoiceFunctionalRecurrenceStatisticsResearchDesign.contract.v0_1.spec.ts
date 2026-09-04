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
            "## Unit of analysis",
            "the exact unit of analysis and its aggregation or counting rule must be preregistered and frozen before any evidence from the applicable confirmatory dataset is examined",
            "the primary counting unit used for the confirmatory result",
            "how multiple concepts, lexical forms, language varieties, or other repeated observations associated with one language or source are aggregated, retained separately, or otherwise mapped to that unit",
            "the weighting or contribution rule applied to each declared analysis unit",
            "the denominator or deterministic rule that maps admitted observations into the reported analysis units",
            "how repeated or nested observations are prevented from silently changing the effective sample represented by that unit",
            "Post-hoc changes to the counting unit, aggregation rule, weighting rule, denominator, or observation-to-unit mapping after any evidence from the applicable confirmatory dataset has been examined must remain explicitly exploratory",
            "This milestone does not choose a concrete unit of analysis, aggregation method, weighting scheme, denominator, or effective-sample rule.",
            "## Corpus definition",
            "the complete corpus or sampling-frame definition must be preregistered and frozen before any evidence from the applicable confirmatory dataset is examined",
            "the represented population",
            "eligible languages or varieties",
            "eligible lexical concepts",
            "source-accessibility treatment",
            "missing or inaccessible evidence treatment",
            "the fixed-versus-adaptive corpus posture",
            "the duplicate lexical or source evidence control rule",
            "the future methodology must also preregister and freeze the sampling or selection mechanism before any evidence from the applicable confirmatory dataset is examined",
            "whether the design is a census, probability sample, or another explicitly justified selection mechanism",
            "the inclusion probabilities, sampling weights, or equivalent design information required by the selected inferential method when applicable",
            "inferential claims must be restricted to the observed corpus rather than presented as representative of the broader linguistic population",
            "Post-hoc changes to the sampling mechanism, recruitment rule, selection order, inclusion probabilities, sampling weights, or permitted inference population after confirmatory evidence has been examined must remain explicitly exploratory",
            "This milestone does not choose a concrete sampling design, census rule, inclusion probability, sampling weight, or population-generalization rule.",
            "Any post-hoc change to those sampling-frame decisions after any evidence from the applicable confirmatory dataset has been examined must remain explicitly exploratory",
            "## Cohort-selection rules",
            "## Inclusion and exclusion",
            "the exact inclusion and exclusion eligibility criteria and the deterministic rules that map observations into inclusion, exclusion, unavailable, blocked, or other exceptional states must be preregistered and frozen before any evidence from the applicable confirmatory dataset is examined",
            "source-quality and source-availability eligibility criteria",
            "treatment of ambiguous, unresolved, missing, or inaccessible observations",
            "duplicate-observation and duplicate-source handling",
            "the conditions producing `excluded_with_reason`, `insufficient_source`, `invalid_comparison`, `blocked`, or `unknown`",
            "Post-hoc changes to inclusion criteria, exclusion criteria, source-quality rules, exceptional-state mappings, or eligibility decisions after confirmatory evidence has been examined must remain explicitly exploratory",
            "This milestone does not choose concrete source-quality thresholds, exclusion thresholds, or dataset-specific eligibility outcomes.",
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
          "This milestone does not select a permutation test, parametric model, Bayesian model, bootstrap, variance estimator, resampling configuration, or other statistical method or analysis parameter.",
        );

        for (
          const required
          of [
            "preregister at least one positive-control cohort or positive-control class before confirmatory evidence is examined",
            "Failure of a required positive control must block or invalidate confirmatory inference",
            "the analysis must return `insufficient_data` or another explicitly reviewed blocked-control state",
            "This milestone does not invent or designate a concrete new positive-control cohort.",
            "preregister at least one appropriate negative-control cohort or negative-control class before confirmatory evidence is examined",
            "the expected negative-control behavior or result",
            "the prespecified criterion that determines whether the negative control has failed",
            "Failure of a required negative control must block unqualified confirmatory inference",
            "If a required negative-control criterion is not met, the analysis must return `insufficient_data` or another explicitly reviewed blocked-control state instead of an unqualified confirmatory statistical claim.",
            "This milestone does not invent or designate a concrete new negative-control cohort, numeric negative-control threshold, or acceptance tolerance.",
            "the empirical baseline specification must be frozen before any evidence from the applicable confirmatory dataset is examined",
            "the baseline data source and estimation procedure must also be preregistered and frozen before any evidence from the applicable confirmatory dataset is examined",
            "The frozen baseline specification must state whether the baseline is treated as fixed or estimated",
            "how baseline-estimation uncertainty is propagated through the confirmatory inferential procedure",
            "A plug-in empirical baseline estimate must not be treated as known without uncertainty unless the reviewed methodology provides a valid justification for treating that baseline as fixed.",
            "Post-hoc changes to the baseline data source, estimator, fixed-versus-estimated treatment, or uncertainty-propagation procedure after confirmatory evidence has been examined must remain explicitly exploratory",
            "This milestone does not choose a baseline estimator, reference corpus, fixed baseline, variance estimate, or uncertainty-propagation method.",
            "the null-model specification must also be frozen before any evidence from the applicable confirmatory dataset is examined",
            "the complete inferential decision rule must also be preregistered and frozen before any evidence from the applicable confirmatory dataset is examined",
            "the significance level or alpha",
            "the test sidedness where applicable",
            "the exact rejection or confirmatory decision criterion",
            "the analogous reviewed decision threshold or decision rule must be preregistered and frozen before any evidence from the applicable confirmatory dataset is examined",
            "Post-hoc changes to the significance level, test sidedness, rejection criterion, Bayesian threshold, or analogous inferential decision rule after confirmatory evidence has been examined must remain explicitly exploratory",
            "This milestone does not choose a numeric alpha, choose test sidedness, choose a Bayesian threshold, invent a rejection rule, compute a p-value, or compute a posterior probability.",
            "Post-hoc alternative baselines, null models, randomization or modeling rules, or preserved-structure choices must remain explicitly exploratory",
            "the exact statistical method and its analysis parameters must be preregistered and frozen before any evidence from the applicable confirmatory dataset is examined",
            "the inferential procedure or model family used for the confirmatory analysis",
            "the estimator or test procedure used to produce the declared result",
            "the variance, uncertainty, exact, asymptotic, permutation, resampling, or posterior-computation procedure used by that method",
            "deterministic analysis parameters that can change the reported estimate, uncertainty, test result, or confirmatory classification",
            "A statistical method, estimator, variance procedure, resampling configuration, or other analysis parameter must not be selected after examining which available option produces a preferred magnitude, uncertainty interval, significance result, posterior result, or confirmatory conclusion.",
            "Post-hoc alternative methods or analysis-parameter choices introduced after confirmatory evidence has been examined must remain explicitly exploratory",
            "Method selection remains a future reviewed decision, but any method used for confirmatory inference must be selected and frozen prospectively under the requirements above.",
            "must prospectively justify the planned sample size or evidence volume",
            "a power analysis tied to prospectively justified and preregistered effect-size assumptions",
            "a precision / uncertainty-width target tied to the preregistered inferential question",
            "the target power and the effect-size assumption or assumptions supporting the planned sample size must be prospectively justified, preregistered, and frozen before any evidence from the applicable confirmatory dataset is examined",
            "The target power must be explicit rather than left implicit in the fact that a power calculation was performed.",
            "the exact precision or uncertainty-width target used to justify the planned sample size or evidence volume must likewise be prospectively justified, preregistered, and frozen before any evidence from the applicable confirmatory dataset is examined",
            "The selected adequacy criterion and its applicable target or assumptions must be declared and frozen before confirmatory evidence is examined.",
            "Post-hoc weakening or replacement of the target power, effect-size assumption, precision target, uncertainty-width target, or other adequacy criterion after confirmatory evidence has been examined must remain explicitly exploratory",
            "If the preregistered adequacy criterion is not met, confirmatory inference must remain blocked and the result must be `insufficient_data`.",
            "This requirement does not authorize this milestone to invent a numeric minimum cohort count, sample size, target power, effect-size assumption, precision target, or uncertainty-width threshold.",
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
            "other independently collected confirmatory dataset",
            "Every dataset intended to support confirmatory inference must be prospectively designated as confirmatory before any of its evidence is examined.",
            "The same preregistration and freeze requirements apply whether that dataset is an independent holdout or another independently collected confirmatory dataset.",
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
            "uncertainty intervals used to support familywise confirmatory claims must use a simultaneous or multiplicity-adjusted interval procedure consistent with the reviewed multiplicity design",
            "Ordinary marginal intervals may still be reported only when they are clearly labeled as marginal",
            "are not used to make familywise confirmatory claims or to imply rejection where the corresponding multiplicity-adjusted confirmatory test does not reject",
            "The interval treatment for the confirmatory family must be preregistered and frozen before any evidence from the applicable confirmatory dataset is examined.",
            "Post-hoc switching between marginal, simultaneous, or multiplicity-adjusted interval procedures after confirmatory evidence has been examined must remain explicitly exploratory",
            "This milestone does not choose a simultaneous-confidence procedure, multiplicity-adjusted interval method, familywise coverage level, or numeric correction threshold.",
            "comparison authority and deterministic transformation procedure must also be frozen before any evidence from the applicable confirmatory dataset is examined",
            "the applicable non-empty rule id",
            "the methodology must also preregister and freeze a deterministic orthographic surface and comparison-form selection rule before any evidence from the applicable confirmatory dataset is examined",
            "how multiple source-attested spellings, scripts, lexical variants, or equivalent candidate surfaces are handled",
            "the deterministic rule or tie-breaking procedure that selects the confirmatory orthographic surface and comparison form",
            "The exact orthographic comparison form must be derived under that frozen selection rule rather than chosen after inspecting which variant produces a preferred recurrence outcome.",
            "The exact comparison form used for any confirmatory dataset must therefore be derived under the applicable frozen authority, transformation rule, or orthographic selection rule rather than selected after inspecting that dataset's result.",
            "Post-hoc alternative transliterations, normalizations, orthographic variants, authorities, rule ids, selection rules, or comparison forms must remain explicitly exploratory",
            "This milestone does not choose a preferred orthographic variant, invent a new orthographic normalization, or modify the existing FVR evidence-admission contract.",
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
            "Unknown / `insufficient_data`",
            "`empty_recurrence`",
            "`empty_recurrence` counts",
            "Null",
            "Null and insufficiency are both valid scientific outcomes, but they are distinct classifications and must not be conflated.",
            "Insufficient evidence remains Unknown / `insufficient_data` and must not be represented as Null.",
            "At the admitted cohort-observation layer, `sharedFunctionalNucleus = []` must be represented for statistical purposes as `empty_recurrence`.",
            "`empty_recurrence` is a descriptive observation that the admitted comparison forms for that cohort yielded no shared canonical voice.",
            "The existing cohort-evidence phrase `Null / empty recurrence is a valid result` remains valid descriptive evidence-contract terminology.",
            "Within statistical output, its observation-level meaning must be mapped to `empty_recurrence` and must not be conflated with the inferential Null classification defined here.",
            "`empty_recurrence` means that an admitted cohort yielded no shared recurrence at the observation layer.",
            "Neither Null, `empty_recurrence`, nor `insufficient_data` is permission to claim historical origin, candidate truth, universality, or proof of absence beyond its reviewed evidentiary or statistical interpretation.",
            "A Null classification may be emitted only when the preregistered adequacy, control, evidence, and methodology requirements for the applicable confirmatory analysis are satisfied",
            "Unknown / `insufficient_data` means that the available evidence or methodology does not support a confirmatory conclusion.",
            "Null is a distinct inferential classification from an adequately specified completed analysis under its reviewed decision rule.",
            "Every future confirmatory inferential result must report an effect size or effect magnitude on the declared unit of analysis together with an uncertainty interval.",
            "must preregister and freeze the exact effect-size statistic or effect measure and the estimand it represents",
            "The effect measure or estimand must not be selected after examining which available definition produces a preferred magnitude, direction, uncertainty interval, or confirmatory conclusion.",
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
