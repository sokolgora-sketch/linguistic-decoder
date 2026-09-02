# ZË-RO Seven-Voice Functional Recurrence Statistics Research Design v0.1

Status: DESIGN_ONLY.

Milestone ID:

`SEVEN_VOICE_FUNCTIONAL_RECURRENCE_STATISTICS_RESEARCH_DESIGN_V0_1`

Contract ID:

`open-instrument.seven-voice-functional-recurrence-statistics-research-design.v0_1`

This milestone defines the research questions and evidence requirements that must be resolved before any Seven-Voice Functional Recurrence statistics implementation may be authorized.

It does not calculate statistics.

It does not authorize statistics implementation.

It does not create a statistics API, UI, runtime owner, dataset, evidence promotion path, or publication claim.

## Current verified starting point

The live source-backed FVR catalog currently contains three independently admitted research cohorts:

1. WATER → shared `U`
2. EYE → shared `Y`
3. FATHER → shared `A`

These cohorts prove that the generic evidence-admission and recurrence architecture can operate across more than one concept.

They do not establish recurrence prevalence, statistical significance, universality, language-family independence, historical origin, cognacy, borrowing, or candidate truth.

Current evidence is insufficient to authorize recurrence statistics because the project does not yet have a reviewed statistics methodology defining the population, sampling frame, controls, baseline, null model, dependence treatment, or permitted interpretation.

The number three is not itself treated as a statistical threshold.

This design does not choose a numeric minimum cohort count.

## Required ordering

The research sequence remains:

`source evidence`
→ `cohort evidence admission`
→ `larger controlled cohorts`
→ `counterexamples and negative controls`
→ `baseline design`
→ `null-model design`
→ `reviewed statistics authorization`
→ `possible future statistical implementation`

The governing recurrence rule remains:

**Evidence admission precedes recurrence statistics.**

## Unit of analysis

A future statistics contract must explicitly define the unit being counted.

Possible units are not interchangeable.

A future design must distinguish at minimum:

- concept-level cohorts
- lexical observations
- language observations
- language-variety observations
- declared comparison forms
- canonical-voice occurrences
- shared-functional-nucleus outcomes

No implementation may silently count one unit while presenting conclusions about another.

## Corpus definition

Before statistical analysis, a reviewed future authorization must define the corpus or sampling frame.

It must state:

- what population the sample is intended to represent
- which languages or varieties are eligible
- which lexical concepts are eligible
- how source accessibility affects inclusion
- whether missing or inaccessible evidence is excluded, retained as Unknown, or represented separately
- whether the corpus is fixed before analysis or expanded adaptively
- how duplicate lexical or source evidence is prevented from inflating counts

If corpus expansion is adaptive, merely declaring that posture is not sufficient for confirmatory inference.

Before confirmatory analysis begins, the methodology must either:

- preregister a stopping rule that determines when corpus expansion ends
- or use a reviewed sequential-inference method whose uncertainty calculation explicitly accounts for adaptive sampling

Repeatedly checking a conventional significance result and stopping when a preferred threshold appears is prohibited.

If no valid stopping rule or sequential-inference treatment exists, results from adaptive expansion remain exploratory.

A convenience sample must not be presented as a representative linguistic population.

## Cohort-selection rules

A future statistics lane must define cohort selection before computing recurrence frequencies.

Selection rules must address:

- same-concept comparability
- source-attested lexical meaning
- source quality
- source status
- comparison-mode eligibility
- language and variety identity
- duplicate observations
- exclusion reasons
- negative and counterexample retention

Cohorts must not be selected because they produce a desired shared voice.

Outcome-driven cohort selection is prohibited.

### Discovery versus confirmatory evidence

A cohort used to discover or motivate a recurrence hypothesis must not also be treated as independent confirmatory evidence for that same hypothesis.

The current live cohorts:

- WATER → shared `U`
- EYE → shared `Y`
- FATHER → shared `A`

remain exploratory evidence for any U, Y, or A functional-recurrence hypothesis that was discovered, selected, or refined using those cohorts.

Confirmatory inference for such a hypothesis requires an independent preregistered holdout or other independently collected confirmatory evidence that was not used to discover, select, tune, or refine the tested hypothesis.

The confirmatory target, cohort-selection rule, comparison mode, stopping rule, and primary analysis must be declared before the holdout evidence is examined.

For any confirmatory use of `transliteration` or `z_zero_functional_normalization`, the comparison authority and deterministic transformation procedure must also be frozen before holdout evidence is examined.

That preregistered transformation specification must identify:

- the comparison authority or transliteration scheme
- the deterministic transliteration or normalization procedure
- the applicable non-empty rule id
- the comparison provenance required by the existing evidence-admission contract

The exact comparison form for a holdout must therefore be derived under the frozen authority and rule rather than selected after inspecting the holdout result.

Post-hoc alternative transliterations, normalizations, authorities, rule ids, or comparison forms must remain explicitly exploratory and must not be used as confirmatory evidence for the preregistered hypothesis.

Reusing discovery cohorts as though they were an independent holdout is prohibited.

## Inclusion and exclusion

Every future statistical dataset must make inclusion and exclusion machine-auditable.

Each observation must have an explicit state such as:

- included
- excluded_with_reason
- unavailable
- insufficient_source
- duplicate
- invalid_comparison
- blocked
- unknown

Null and Unknown remain valid outcomes.

Missing evidence must not be converted into a positive or negative recurrence observation without an explicit reviewed rule.

## Positive controls, negative controls, and counterexamples

A valid statistics design requires controlled evidence.

For confirmatory inference, the future methodology must preregister at least one positive-control cohort or positive-control class before confirmatory evidence is examined.

For every required positive control, the preregistration must define:

- the positive-control cohort or control class
- the expected control behavior or result
- the comparison mode and deterministic comparison procedure used for that control
- the decision rule applied if the positive control fails

Failure of a required positive control must block or invalidate confirmatory inference rather than being ignored after results are known.

If a required positive-control criterion is not met, the analysis must return `insufficient_data` or another explicitly reviewed blocked-control state instead of a confirmatory statistical claim.

This milestone does not invent or designate a concrete new positive-control cohort.

Negative controls and counterexamples must remain visible even when they weaken a proposed functional pattern.

The design must preserve cohorts that:

- produce no shared canonical voice
- produce a different shared voice than expected
- depend materially on comparison mode
- challenge the proposed functional interpretation

A future implementation must never filter these outcomes merely to improve recurrence prevalence.

## Independence and dependence

Language observations must not automatically be treated as statistically independent.

A future contract must define how it handles dependence introduced by:

- genealogical language-family relationships
- close language varieties
- shared lexical inheritance
- borrowing
- areal contact
- transliteration conventions
- shared source databases
- duplicated dictionary traditions
- multiple observations derived from one underlying lexical item

This design does not choose a specific correction method.

It requires the dependence problem to be explicitly modeled or bounded before inferential statistics are authorized.

## Comparison-mode separation

The established FVR comparison modes remain distinct:

- `orthography`
- `transliteration`
- `z_zero_functional_normalization`

A future statistics design must not pool these modes silently.

At minimum, it must specify whether analyses are:

- mode-specific
- stratified by mode
- compared across modes
- or combined under an explicitly justified reviewed rule

`WATER -> UOTER` remains explicit ZË-RO functional-normalization doctrine and must not be treated as raw English orthography.

Mode provenance remains auditable.

## Canonical-voice baseline frequencies

A recurrence frequency is uninterpretable without a baseline.

A future design must define the expected frequency of canonical voices under the relevant sampling unit and comparison mode.

The baseline must address:

- the Seven canonical voices `A, E, I, O, U, Y, Ë`
- differing form lengths
- repeated vowels inside a form
- language-specific orthographies
- normalization effects
- concept-selection effects
- source-selection effects

No assumption of equal `1/7` baseline probability is authorized by this milestone.

A uniform baseline may only be used if a future reviewed methodology justifies it for the exact unit of analysis.

For confirmatory inference, the empirical baseline specification must be frozen before holdout evidence is examined.

## Null model

A future statistics lane must define an explicit null model before computing significance.

The null model must state what would count as recurrence expected by chance under the chosen corpus and unit of analysis.

It must specify:

- what is randomized or modeled
- what structure is preserved
- what dependencies remain fixed
- what comparison modes are preserved
- what constitutes a test statistic
- what constitutes a Null result

For confirmatory inference, the null-model specification must also be frozen before holdout evidence is examined.

The frozen baseline and null-model specification must include the randomization or modeling rule, the structure preserved, the dependencies held fixed, the comparison modes preserved, the test statistic, and the rule defining a Null result.

Post-hoc alternative baselines, null models, randomization or modeling rules, or preserved-structure choices must remain explicitly exploratory and must not be used as confirmatory evidence for the preregistered hypothesis.

This milestone does not select a permutation test, parametric model, Bayesian model, bootstrap, or other statistical method.

Method selection remains a future reviewed decision.

## Multiplicity and confirmatory endpoints

A future methodology must define the hypothesis family before confirmatory testing begins.

The hypothesis family must state which combination of these dimensions is being tested:

- canonical voices
- lexical concepts
- comparison modes
- recurrence outcomes
- test statistics
- subgroup or language-family analyses

Testing multiple voices, concepts, modes, statistics, or subgroups and reporting only favorable results is prohibited.

For confirmatory inference, a methodology may preregister one sole primary endpoint or primary hypothesis before confirmatory evidence is examined.

That sole preregistered primary endpoint may be evaluated under the reviewed primary analysis without an additional multiplicity correction solely because it is the single primary endpoint.

Every confirmatory endpoint outside the sole preregistered primary endpoint must either:

- be covered by an explicit reviewed multiplicity-correction procedure for the declared hypothesis family
- or remain explicitly exploratory and must not be presented as confirmatory statistical evidence

Secondary voices, concepts, modes, subgroup analyses, alternative statistics, and other non-primary tests do not become confirmatory merely because one primary endpoint was preregistered.

If there is more than one confirmatory endpoint, the methodology must define multiplicity handling for every confirmatory test outside the sole primary endpoint.

The future methodology must preserve the distinction between exploratory hypothesis generation and confirmatory inference.

## Minimum evidence and insufficiency posture

This design intentionally does not invent a minimum number of cohorts.

A future methodology may define a minimum only when justified by:

- the intended statistical question
- expected effect size or uncertainty target
- corpus structure
- dependence assumptions
- selected null model
- selected statistical method

Before confirmatory evidence is examined, the future methodology must prospectively justify the planned sample size or evidence volume.

That prospective justification must use at least one reviewed adequacy criterion appropriate to the selected statistical method:

- a power analysis tied to the preregistered effect-size assumptions
- or a precision / uncertainty-width target tied to the preregistered inferential question

The adequacy criterion must be declared before confirmatory evidence is examined.

If the preregistered adequacy criterion is not met, confirmatory inference must remain blocked and the result must be `insufficient_data`.

This requirement does not authorize this milestone to invent a numeric minimum cohort count, sample size, power threshold, or uncertainty-width threshold.

Until then:

`insufficient_data`

is a valid and preferred result over manufactured certainty.

The current three live cohorts do not, by themselves, authorize inferential statistics.

## Permitted future outputs

A future reviewed statistics authorization may separately define descriptive and inferential outputs.

Possible descriptive outputs include:

- cohort counts
- observation counts
- mode-stratified counts
- Null recurrence counts
- shared-voice frequencies
- counterexample frequencies

Inferential outputs remain unauthorized until a reviewed null model and statistical method exist.

No future numeric result may automatically become:

- candidate truth
- origin evidence
- cognacy evidence
- borrowing evidence
- language-superiority evidence
- universality evidence

## Truth hierarchy

Future statistical outputs must preserve:

- Fact
- Inference
- Hypothesis
- Unknown / Null

Observed dataset counts may be factual within a declared dataset.

Model-based estimates may be inference.

Functional interpretation remains hypothesis unless separately supported.

Insufficient evidence remains Unknown / Null.

These categories must not be collapsed.

## Claim boundary

This research design preserves:

`historicalOriginClaim = not_claimed`

`historicalTransmissionClaim = not_claimed`

`cognacyClaim = not_claimed`

`borrowingClaim = not_claimed`

`winnerClaim = not_claimed`

`languageSuperiorityClaim = not_claimed`

`candidateTruthClaim = not_claimed`

`universalityClaim = not_claimed`

`userDecisionPosture = user_decides`

Project posture remains:

`no_single_winner`

A statistically unusual recurrence, if one is ever established, would still not by itself establish historical origin, transmission, cognacy, borrowing, linguistic ownership, candidate truth, or universality.

## Promotion prohibition

This design does not promote:

- WATER / U
- EYE / Y
- FATHER / A
- any future recurrence cohort
- any source row
- any functional interpretation
- any candidate
- any canonical operator

Research evidence remains research evidence unless a separate reviewed promotion contract explicitly authorizes a transition.

## No implementation authorization

This milestone does not authorize creation or modification of:

- recurrence statistics runtime code
- statistics helpers
- statistical libraries
- API routes
- UI surfaces
- recurrence engine logic
- evidence-admission logic
- research catalog data
- new source-backed cohorts
- provider execution
- evidence promotion
- publication evidence
- JO runtime work

A future implementation lane requires a separate explicit authorization after this methodology is reviewed.

## Required review questions before implementation

Before any statistics implementation can be authorized, review must answer:

1. What exact research question is being tested?
2. What is the unit of analysis?
3. What corpus or sampling frame is used?
4. How are cohorts selected before outcomes are known?
5. What are the inclusion and exclusion rules?
6. What positive controls are required?
7. What negative controls and counterexamples are required?
8. How are genealogical, areal, borrowing, lexical, and source dependencies handled?
9. How are comparison modes separated?
10. What are the empirical baseline frequencies for canonical voices?
11. What is the null model?
12. What statistic or descriptive measure is permitted?
13. What constitutes insufficient data?
14. What uncertainty reporting is required?
15. Which claims remain prohibited regardless of numerical result?

If these questions are not resolved, implementation authorization must remain:

`blocked_methodology_incomplete`

## Current milestone result

Current live FVR research:

- WATER → `U`
- EYE → `Y`
- FATHER → `A`

Current statistics posture:

`not_authorized`

Current methodology posture:

`design_defined_implementation_not_authorized`

Current evidence sufficiency for inferential recurrence statistics:

`insufficient_data`

This is not a failure.

Null and insufficiency are valid scientific outcomes.

The governing doctrine remains:

**Logic discovers. Evidence validates or contextualizes. Promotion remains strict.**

The recurrence-specific ordering remains:

**Evidence admission precedes recurrence statistics.**
