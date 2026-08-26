# ZË-RO structural hypothesis contract v0.1

Date: 2026-08-25

Status: IMPLEMENTED_CONTRACT.

## Purpose

This contract defines the first machine-facing boundary for ZË-RO logic-first embryo discovery.

The contract implements the governing principle:

**Logic discovers. Evidence validates or contextualizes. Promotion remains strict.**

It also preserves:

**Discovery may outrun evidence. Meaning may not outrun logic.**

This contract was authored before runtime implementation.

The runtime implementation now exists under this contract. Statements below that describe implementation as future or not-yet-authorized record the contract-review phase and must not be read as the current repository implementation state.

## Existing architecture reused

The implementation must reuse the existing Open Instrument architecture wherever possible.

Existing owners remain authoritative for their current concerns:

- `src/shared/deepRoot.minRoots.v1.ts`
  - registered proto-root/carrier DeepRoot hypotheses
- `src/shared/canonicalOperatorDiscovery.v0_1.ts`
  - canonical operator discovery and reviewed-evidence eligibility
- `src/shared/deepRoot.rootMap.builder.v1.ts`
  - RootMap and functional evidence/composition projection
- `src/shared/analysisAdapter.ts`
  - analyze-v1 candidate projection and ordering
- `src/shared/analysisStatus.v0_1.ts`
  - aggregate reviewed/candidate/structural/Null status
- reviewed-source registry, authorization, production membership, runtime projection and canon-lock owners
  - evidence promotion and governance

This milestone must not overload those owners with a claim they were not designed to make.

In particular:

- structural hypothesis discovery must not require a reviewed canonical operator
- structural hypothesis discovery must not require a production proto-root
- structural hypothesis discovery must not mutate reviewed-source registries
- structural hypothesis discovery must not bypass the existing analyze-v1 truth adapter

## Exact architectural gap

Current DeepRoot minimal-root discovery is profile/carrier driven.

A form that has no registered proto-root or approved carrier does not independently become a minimal-root hypothesis.

Current canonical fallback is also tied to canonical discovery and reviewed-evidence eligibility.

Therefore a logic-derived form such as `ER` cannot be represented honestly by merely registering it in an existing evidence owner.

Doing so would collapse:

- structural discovery
- lexical evidence
- reviewed evidence
- production truth

into one state.

This contract forbids that shortcut.

## New smallest seam

The implementation lane should introduce one small reusable deterministic seam with responsibility equivalent to:

`structuralHypothesisDiscovery.v0_1`

The exact filename may be refined during implementation review.

Its sole responsibility is:

**derive and describe structural hypotheses from permitted deterministic ZË-RO operations.**

It does not own:

- lexical meaning
- historical origin
- reviewed evidence
- production membership
- runtime authorization
- canon lock

Its output is consumed by the existing embryo-first projection architecture.

## Structural hypothesis type

The implementation must support a semantic shape equivalent to:

~~~ts
type StructuralHypothesisV0_1 = {
  hypothesisVersion:
    "z-zero.structural-hypothesis.v0_1";

  hypothesisId: string;

  basis: string;

  embryo: string;

  embryoSize: number;

  discoveryStatus:
    "structural_hypothesis";

  independentStandaloneMeaning:
    null;

  lexicalAttestation:
    | "not_evaluated"
    | "not_found"
    | "witness_present";

  functionalSupportStatus:
    | "unknown"
    | "partial"
    | "supported";

  reductionSteps:
    StructuralReductionStepV0_1[];

  expansionChain:
    string[];

  reasonCodes:
    StructuralHypothesisReasonCodeV0_1[];

  evidenceRefs:
    string[];

  historicalOriginClaim:
    "not_claimed";

  historicalTransmissionClaim:
    "not_claimed";

  winnerClaim:
    "not_claimed";

  languageSuperiorityClaim:
    "not_claimed";

  candidateTruthClaim:
    "not_claimed";

  userDecisionPosture:
    "user_decides";
};
~~~

Exact TypeScript naming may be refined.

The semantic fields and boundaries may not be weakened.

## Independent meaning rule

For a pure structural hypothesis:

~~~text
independentStandaloneMeaning = null
~~~

must mean:

**ZË-RO has not established an independent standalone function for this embryo.**

The engine must not replace this Null with a convenient inferred gloss.

For example, discovery of `ER` does not authorize:

- loss
- absence
- depletion
- darkness
- error
- wind
- terror
- sterility
- barrenness

as an independent `ER` meaning.

If later functional or lexical evidence supports a meaning, that support must arrive through a separate typed evidence/support layer.

## Structural reduction step

Every transformation must be auditable.

The implementation must support a shape equivalent to:

~~~ts
type StructuralReductionStepV0_1 = {
  from: string;
  to: string;

  operationId: string;

  reasonCode:
    StructuralReductionReasonCodeV0_1;

  fromSpan:
    {
      start: number;
      end: number;
    } | null;

  removedOrChanged:
    string | null;

  voicePathBefore:
    string[];

  voicePathAfter:
    string[];
};
~~~

A reduction step is invalid if the implementation cannot identify the deterministic operation that produced it.

No anonymous deletion is allowed.

No free-form "looks related" operation is allowed.

## Operation authority

This contract does not yet authorize the operations needed for:

~~~text
STERILE
→ STER
→ TER
→ ER
~~~

That chain is a proving hypothesis.

It is not pre-approved output.

Each edge must later pass an explicit deterministic operation contract.

Therefore implementation must not hard-code:

~~~text
if word == sterile => ER
~~~

and must not create a STERILE-specific exception.

The proving case passes only if the generic permitted operations independently produce the chain.

## Structural hypothesis reason codes

Initial reason-code vocabulary must include semantics equivalent to:

### Positive discovery

- `structural_reduction_applied`
- `structural_containment_preserved`
- `deterministic_operation_authorized`
- `minimum_defensible_embryo_reached`
- `voice_path_recorded`
- `independent_meaning_unknown`
- `lexical_attestation_not_required_for_discovery`
- `historical_origin_not_claimed`
- `candidate_truth_not_claimed`
- `production_promotion_not_claimed`

### Rejection / Null

- `operation_not_authorized`
- `reduction_not_reproducible`
- `structural_containment_failed`
- `control_case_leakage`
- `minimum_embryo_not_defensible`
- `no_structural_hypothesis_survived`

Exact spelling may be refined before implementation.

Reason-code semantics must remain explicit and deterministic.

## Analyze-v1 candidate projection

Structural hypotheses must flow through the existing embryo-first candidate envelope.

The adapter must eventually support an additive claim type equivalent to:

~~~text
claimType = structuralHypothesis
~~~

A structural hypothesis candidate must project with semantics equivalent to:

~~~text
sourceKind = logic_derived_structural_hypothesis
claimType = structuralHypothesis
originClaim = not_claimed
historicalRelation = not_evaluated

embryo = ER
embryoSize = 2
embryoLanguage = null

isolatedStandaloneForm = null
plainStandaloneGloss = null
sourceNote = null
semanticBridge = null

validationOutcome = not_evaluated

rankGroup = structuralHypothesis

userDecisionPosture = user_decides
~~~

The absence of lexical isolation fields is intentional for this candidate class.

The existing functional-motivation isolation rules remain unchanged.

A `functionalMotivation` candidate without the required functional isolation/support must still fail closed as it does today.

Structural hypothesis is a different claim type, not a loophole in `functionalMotivation`.

## Rank-group extension

The existing embryo-first ranking remains authoritative.

The additive structural-hypothesis tier must fit between functional support and surface-only resemblance.

Required ordering:

1. `validatedFunctionalMotivation`
2. `partialFunctionalMotivation`
3. `structuralHypothesis`
4. `surfaceOrSeedOnly`
5. `historicalContextOnly`
6. `unresolved`

This ordering means:

- reviewed/functional evidence outranks pure structural hypothesis
- deterministic structural hypothesis outranks unsupported surface resemblance
- historical context does not outrank functional or structural ZË-RO discovery merely because it is historical

## Ordering inside structural hypotheses

Within `structuralHypothesis` only:

1. smallest defensible embryo
2. lowest permitted operation count
3. stable deterministic discovery order

A one-character embryo does not automatically win merely because it is smaller.

It must survive all structural rules and controls.

## Functional-support separation

A structural hypothesis does not become a functional hypothesis merely because a larger expansion has a known meaning.

Each level remains separately typed.

Example:

~~~text
ER
structural hypothesis
independent meaning: Unknown

TER
possible functional expansion
support state: separately evaluated

SHTER
possible larger functional expansion
support state: separately evaluated

STERILE
target
~~~

A larger supported level may help motivate a chain.

It must not retroactively manufacture a standalone meaning for `ER`.

## Evidence separation

`evidenceRefs` may be empty for a structural hypothesis.

An empty evidence list does not force structural discovery to Null.

However:

~~~text
evidenceRefs = []
~~~

must never be rendered as:

~~~text
reviewed evidence present
~~~

or:

~~~text
historical support present
~~~

Evidence promotion remains owned by the existing reviewed-source architecture.

## Analysis-status integration

The existing aggregate status:

~~~text
structural_unreviewed
~~~

should be reused for a result containing structural hypotheses but no stronger reviewed/functional status.

A new top-level status code is not required by this contract.

The summary may later be refined to state that deterministic structural hypotheses are available.

`structural_unreviewed` must remain explicitly non-truth-promoting.

## Null contract

Current aggregate Null is:

~~~text
null_no_supported_candidate
~~~

For this milestone, the eventual decision order must become semantically:

~~~text
if reviewed functional evidence exists
  => reviewed_functional_evidence

else if supported/proposed functional candidate exists
  => candidate_only

else if deterministic structural hypothesis exists
  => structural_unreviewed

else if other structural RootMap output exists
  => structural_unreviewed

else
  => null_no_supported_candidate
~~~

Therefore:

**absence of reviewed evidence alone may not cause Null when a defensible structural hypothesis exists.**

Null is emitted only when no structural hypothesis survives the permitted deterministic discovery rules and controls.

## STERILE proving contract

`STERILE` is a proving input, not a hard-coded result.

Target hypothesis:

~~~text
STERILE
→ STER
→ TER
→ ER
~~~

Desired final structural candidate, only if the generic operation contract proves every edge:

~~~text
basis: sterile
embryo: ER
discoveryStatus: structural_hypothesis
independentStandaloneMeaning: null
functionalSupportStatus: unknown
historicalOriginClaim: not_claimed
candidateTruthClaim: not_claimed
userDecisionPosture: user_decides
~~~

Required expansion chain:

~~~text
ER
→ TER
→ STER
→ STERILE
~~~

If any edge is not authorized, the complete `ER` hypothesis must not be emitted.

The engine must expose the rejection reason instead.

## TER / SHTER boundary

This contract does not register or promote `TER` or `SHTER`.

It does not equate:

- `TER`
- `TERR`
- `ERR`
- `TMERR`

It does not authorize shortening from `TERR` to `TER`.

Existing boundaries preventing unauthorized `TERR → TER` shortening remain intact.

Any future lexical or functional support for `TER` or `SHTER` requires its own evidence lane.

## Negative controls

The implementation test contract must include controls.

Controls must use exactly the same reduction engine and operation policy as `STERILE`.

No control may receive STERILE-specific exceptions.

At minimum the future test set must contain:

- one near-neighbor structural control
- one unrelated word control
- one word containing a tempting `ER` surface substring
- one word where an unauthorized operation would be required

The exact control words must be selected after the deterministic operation policy is inspected and locked.

This contract intentionally does not guess them prematurely.

## Seven-Voices requirement

Every accepted reduction step must preserve an auditable Seven-Voices view.

The canonical vowels remain:

~~~text
A E I O U Y Ë
~~~

For each step the implementation must preserve or derive:

- voice path before
- voice path after

A voice-path change is descriptive evidence about the structural operation.

It does not independently prove semantic meaning.

Consonants may shape the structural frame.

They do not independently replace the Seven-Voices path as the vowel authority.

## No proto-root shortcut

`ER` must not be inserted into:

~~~text
src/shared/protoRoots.v1.ts
~~~

solely to make the proving case pass.

A production proto-root registration is an evidence/promotion act.

Structural hypothesis discovery must precede that decision.

## No canonical-operator shortcut

`ER` must not be inserted into the canonical operator profile merely to gain canonical discovery.

Canonical operator machinery carries lifecycle, reviewed-evidence, authorization and production semantics that are stronger than a pure structural hypothesis.

## No reviewed-source shortcut

This milestone must not add an `ER` source row merely to satisfy the current functional-isolation gate.

If a real reviewed `ER` witness is later found, that evidence may enter through the normal evidence review process.

It is not required for logic-first structural discovery.

## Compatibility requirements

Implementation must preserve existing behavior for:

- DA
- DI
- AT
- existing reviewed functional candidates
- existing RootMap compositions
- SEED candidates
- historical-context candidates
- existing Null behavior when no structural hypothesis exists
- existing origin/winner/language-superiority boundaries

Structural hypothesis support must be additive.

## First implementation lane — implemented

The reviewed contract defined the following smallest implementation lane, which is now implemented:

1. define structural hypothesis types
2. define deterministic reduction-step contract
3. implement one bounded generic discovery seam
4. project its results through the existing embryo-first adapter
5. reuse `structural_unreviewed`
6. prove `STERILE` only if permitted generic operations derive it
7. prove controls remain closed
8. leave reviewed evidence and promotion owners untouched

## Contract-review authorization boundary — historical

At contract-review time, before implementation began, this contract did not yet authorize:

- runtime implementation
- API output mutation
- UI mutation
- ER proto-root registration
- ER canonical registration
- TER promotion
- SHTER promotion
- new reviewed source rows
- provider/LLM execution
- historical-origin claims
- historical-transmission claims
- candidate-truth claims
- canon lock

## Required next step

The next lane is contract tests.

Those tests must first lock:

- structural hypothesis versus functional evidence separation
- null-safe unknown independent meaning
- reason-code presence
- rank ordering
- no proto-root shortcut
- no canonical shortcut
- no reviewed-source shortcut
- no STERILE-specific branch
- STERILE proving posture
- controls fail closed
- existing evidence/promotion architecture unchanged

This gate was satisfied before runtime implementation began. Runtime implementation is now present; reviewed evidence and promotion remain separate owners.
