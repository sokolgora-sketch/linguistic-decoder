# Open Instrument — Functional Manifestation Preregistration v0.1

Status: `FROZEN_PREREGISTRATION_CONTRACT_ONLY`.

Contract ID: `OPEN_INSTRUMENT_FUNCTIONAL_MANIFESTATION_PREREGISTRATION_V0_1`.

This document freezes one bounded observational experiment over the already
materialized English lexical-outcome and canonical-Voice population. It does
not execute the experiment, create a functional candidate, or promote a source
gloss into functional truth.

## 1. Authority boundary

The admitted chain is:

```text
frozen English lexical-sense source
  -> frozen source-only functional outcome observation
  -> frozen canonical Voice path and structural configuration
  -> this bounded association experiment
```

The functional outcome normalization contract remains source-only. Its
`SOURCE_TO_OUTCOME_NORMALIZATION_ONLY` boundary, `user_decides` posture, and
`noSingleWinner=true` remain unchanged. This preregistration does not authorize
causality, semantic meaning, etymology, production authority, or a
`(Voice, configuration) -> functional output` rule.

## 2. Frozen inputs

The experiment consumes these already-verified artifacts without regeneration:

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `/tmp/open-instrument-functional-outcome-stage-a-v0.1.json` | 41648123 | `c0953894a677696761bab73bfc10af0ea1f8cefccee428b158477186459f61c3` |
| `/tmp/open-instrument-functional-outcome-stage-b-v0.1.json` | 1266368 | `dbc689de4dce6411b9b066fd058d0282580d7c5c67515c4943d25831bc7c6845` |
| `/tmp/open-instrument-functional-outcome-stage-b-direct-distribution.json` | not supplied by source report | `36fc1d522f95e6b07068434828baec773d340f6190b3e33b92e69da06ecc20e6` |
| `/tmp/open-instrument-canonical-voice-population-v0.1.jsonl` | 14777467 | `949c682dfc2bfb6de127b053452411652444971e00706babf9be050fce5aa194` |
| frozen structural result `.json.gz` | 11062103 | `ce3d9c9ca3535176c169f45e076736af3cc254b415428d7201fd2a3f24d24f46` |

The source-only vocabulary is the existing 44-property vocabulary. The
accepted Stage-A facts are 94632 source-matched forms, 3678 distinct direct
match forms, 5077 direct property observations, 38 nonzero property IDs, and 6
zero-count property IDs. The accepted Stage-B facts are 3698 V groups and 295
candidate variation groups before the variant policy below. `295` is candidate
geometry, not a power claim.

If any required artifact is absent or hash-invalid, execution is blocked. The
artifacts must not be regenerated or re-matched under this contract.

## 3. Independent observational unit and variant policy

The independent unit is one normalized lexical-form identity from the frozen
Stage-A form aggregate. A source-record/POS/sense unit remains evidence and
provenance, not an additional independent observation. Direct property IDs are
deduplicated and sorted within the form; repeated source support does not add
weight.

The confirmatory population retains a form only when the frozen eligible
pronunciation population contains exactly one pronunciation variant for that
form and exactly one canonical V path. A form with multiple pronunciation
variants is excluded even when the variants share a V path. A form with
multiple V paths is excluded. No first-variant, majority, or other winner is
selected. This prevents variant preservation from becoming lexical-form
pseudoreplication.

The form must have at least one direct property ID. Source-not-found forms and
forms with no direct match are unavailable/unresolved for this experiment; they
are never recoded as property negatives.

## 4. Outcome representation and prevalence

Each retained form contributes one exact multilabel outcome signature:

```text
sorted unique direct property-ID set
+ sourcePresentOutcomeUnresolvedUnitCount > 0
```

The unresolved flag is preserved as part of the signature and is never treated
as a negative property observation. No property is selected as primary, merged
with another property, or grouped by semantic similarity.

All 44 property IDs remain in the vocabulary. The 6 zero-count IDs remain
descriptive zeros and cannot receive a property-specific positive or Null
claim. Rare properties remain in the global multilabel signature; no
support-based cutoff is introduced. This avoids allowing `order` or another
frequent property to define a property-specific omnibus result.

There are no per-property confirmatory tests. The primary endpoint is one
global test over the complete exact outcome-signature distribution.

## 5. Hypothesis and predictors

Primary null hypothesis:

> Conditional on the exact canonical V path, the frozen form-level outcome
> signatures are exchangeable with the frozen primary structural signatures;
> Γ contains no detectable outcome association beyond V in this frozen
> population.

Primary alternative:

> Conditional on V, the frozen Γ signature and the frozen outcome signature
> have a bounded statistical association in the observed population.

The estimand is normalized conditional mutual information between exact Γ
signature and exact outcome signature given V. The unit of inference remains
the lexical form. The claim is restricted to the frozen English population and
does not generalize to language, meaning, history, or causality.

Γ is the sole confirmatory structural predictor. It is the exact frozen
configuration signature, not a new consonant feature or semantic encoding. ZC
is retained as a descriptive secondary projection only. ZC is a deterministic,
lossy projection of Γ and is not independent evidence or a second confirmatory
test.

The experiment must not inspect Γ/ZC values to select forms, V groups,
properties, thresholds, or statistics. The values are first admitted at the
future execution boundary under this already-frozen design.

## 6. Within-V design

V is the blocking variable. Outcomes are not pooled across V paths. Within
each exact V block, the randomization procedure permutes the form-level outcome
signatures while holding form membership, Γ, and the V block fixed. Block sizes,
the complete outcome-signature multiset, and all structural values are
preserved.

The primary statistic is the conditional mutual-information/G-squared
contingency statistic for exact Γ categories and exact outcome signatures,
conditioned on V. The statistic is global and multilabel; it does not select a
property or a V group after inspection.

The null requires exchangeability of retained lexical-form outcome signatures
within V blocks after the frozen eligibility rule. This is a declared
conditional randomization assumption for the observational test, not a claim
that lexical forms are independent in the broader language. Source senses and
variants are prevented from silently changing the unit before this assumption
is applied.

The execution uses 10000 deterministic within-block permutations with the
contract-bound stream name
`OPEN_INSTRUMENT_FUNCTIONAL_MANIFESTATION_V0_1_GAMMA_PRIMARY_PERMUTATION`.

## 7. Testable geometry without Γ/ZC exposure

Applying only the frozen Stage-A outcomes, frozen V assignments, and the
variant policy gives:

- 87872 source-matched forms with exactly one eligible variant;
- 3283 direct-match independent units after the one-variant/one-V-path rule;
- 2943 V groups containing retained one-variant/one-path forms;
- 551 of those V groups containing at least one direct-match unit;
- 255 candidate variation V groups with at least two direct units and at least
  two distinct direct-property-ID signatures;
- 2974 direct independent units in those 255 candidate variation groups;
- 38 of 44 property IDs represented in the retained direct population.

The 255 groups and 2974 units are inferential candidate geometry only. No
Γ/ZC value, consonant identity, position, count, recurrence, or signature was
used to produce them. Future execution must not discard candidate groups based
on a preferred structural value. If the frozen Γ categories produce a
degenerate permutation or undefined uncertainty, the result is
`INCONCLUSIVE_INSUFFICIENT_EFFECTIVE_SUPPORT`.

Sequential V-group exclusions from the 3698 total are:

| Exclusion | V groups |
| --- | ---: |
| no source-matched form | 438 |
| no retained one-variant/one-path form | 317 |
| retained forms but no direct match | 2392 |
| direct match but no two-form/differing-outcome candidate variation | 296 |
| retained candidate variation groups | 255 |

These categories are descriptive and deterministic; they are not post-hoc
power filters.

## 8. Inferential constants and uncertainty

The following constants are frozen before Γ/ZC exposure:

| Constant | Value | Rationale |
| --- | --- | --- |
| alpha | 0.05 | conventional level for one preregistered omnibus test |
| within-V permutations | 10000 | deterministic finite randomization approximation fixed independently of outcomes |
| uncertainty level | 95% | conventional uncertainty reporting level |
| block-bootstrap replicates | 2000 | fixed reproducible uncertainty computation, independent of predictor values |
| minimum repeated structural class | 2 | the minimum needed for a repeated categorical structural value; not a power cutoff |

No applicable functional-manifestation alpha, FDR, power, or support threshold
was already frozen in the repository. The unrelated FRD-02 constants are not
imported. No power claim is made. The minimum repeated-class rule is only a
structural identifiability guard; failure yields inconclusive rather than a
positive or negative scientific conclusion.

The effect size is normalized conditional mutual information, interpreted as
the proportion of within-V outcome information associated with Γ. Uncertainty
is a 95% nonparametric block bootstrap over V groups, preserving all retained
form units inside each resampled block. If the interval cannot be defined under
the frozen geometry, the outcome is inconclusive.

## 9. Multiple testing and decision semantics

There is one primary inferential test, one family, and no secondary inferential
test. ZC is descriptive only. No correction is required for the single
primary endpoint, and no result-dependent test selection is allowed.

The experiment may emit exactly one of:

- `SUPPORTED_BOUNDED_ASSOCIATION`: the nondegenerate primary permutation test
  meets alpha and the preregistered uncertainty bound is positive;
- `NULL_NO_DETECTABLE_ASSOCIATION`: the nondegenerate primary test does not
  meet alpha;
- `INCONCLUSIVE_INSUFFICIENT_EFFECTIVE_SUPPORT`: the frozen structural
  permutation or uncertainty calculation is degenerate or undefined;
- `INVALID_ASSUMPTION_FAILURE`: a frozen unit, block, provenance, or source
  artifact invariant is violated.

Neither a Null result nor an inconclusive result disproves consonantal
function. A supported result would mean only that, within the frozen English
population and source-only outcome apparatus, the structural configuration
contains bounded statistical association with the normalized source outcome
signatures conditional on V. It would not establish intrinsic consonant
meaning, causality, semantic truth, etymology, historical origin, or production
readiness.

## 10. Constructive blindness and execution prohibition

At freeze time:

```text
GAMMA_VALUES_INSPECTED=NO
ZC_VALUES_INSPECTED=NO
KNOWN_TARGETS_USED=NO
RESULT_DEPENDENT_RULE_SELECTION=NO
```

The future execution must bind the frozen artifact identities, preserve the
unit and block rules, and record all seeds, permutations, exclusions, and
degeneracy decisions. It may not alter the outcome representation, select a
different property family, introduce a preferred predictor, choose a winner
among variants, or tune thresholds after reading Γ/ZC values.

This is a preregistration only. It does not execute the experiment, alter the
source reader or matcher, change Γ/ZC, change pronunciation/Voice authority,
wire production runtime, or create a functional candidate.

Freeze declaration:

```text
FUNCTIONAL_MANIFESTATION_PREREGISTRATION_V0_1=FROZEN
EXPERIMENT_EXECUTED=NO
PRODUCTION_PROMOTED=NO
CAUSAL_OR_SEMANTIC_AUTHORITY=NO
```
