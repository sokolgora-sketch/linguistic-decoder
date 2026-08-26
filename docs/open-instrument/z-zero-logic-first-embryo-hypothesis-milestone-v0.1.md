# ZË-RO logic-first embryo hypothesis milestone v0.1

Date: 2026-08-25

Status: Z_ZERO_LOGIC_FIRST_EMBRYO_HYPOTHESIS_MILESTONE_CLOSED.

## Purpose

This milestone establishes the governing discovery posture of ZË-RO / Open Instrument.

ZË-RO is not an etymology lookup engine.

ZË-RO is not a historical-origin ranking system.

ZË-RO is not a lexical database with a different interface.

ZË-RO is a deterministic instrument for generating inspectable functional hypotheses from its own internal logic.

The engine performs embryo-first surgery, identifies the smallest defensible structural embryo, expands outward, and presents the resulting hypothesis to the user with explicit truth boundaries.

Historical, lexical, dictionary, corpus, and reviewed-source material may witness, strengthen, weaken, contextualize, or contradict a hypothesis.

Those materials do not create the hypothesis and do not automatically decide whether a logic-derived hypothesis may be shown.

The user remains the final interpreter.

## Governing principle

The core rule is:

**Logic discovers. Evidence validates or contextualizes. Promotion remains strict.**

A second required rule is:

**Discovery may outrun evidence. Meaning may not outrun logic.**

The instrument must not manufacture certainty merely because it discovered a structurally interesting embryo.

The instrument must also not suppress a defensible structural hypothesis merely because no external lexical or historical source has independently promoted it.

## Three separate questions

ZË-RO must keep three questions separate.

### 1. Discovery

Can deterministic ZË-RO logic produce a defensible structural embryo or expansion chain?

Discovery is governed by:

- permitted deterministic transformations
- embryo size
- structural containment
- consonantal frame behavior
- Seven-Voices analysis
- ordered reduction or expansion
- explicit reason codes
- reproducibility
- negative controls

External lexical attestation is not a mandatory prerequisite for structural discovery.

### 2. Functional support

Can the discovered structure motivate the target meaning or function?

Functional support may use:

- internal chain coherence
- functional transitions between expansion levels
- attested lexical witnesses where available
- reviewed evidence where available
- semantic bridge checks
- evidence references
- contradiction checks

A candidate may remain hypothesis-level when functional support is incomplete.

### 3. Promotion

May the result become reviewed, production-authorized, runtime-verified, or canon-locked truth?

Promotion remains evidence-gated and strict.

This milestone does not weaken existing reviewed-evidence, production-membership, authorization, runtime-verification, or canon-lock gates.

Discovery and promotion are different operations.

## Structural hypothesis

This milestone introduces the concept of a structural embryo hypothesis.

A structural embryo hypothesis is a minimal form produced by deterministic ZË-RO reduction or decomposition logic.

A structural hypothesis does not require an independently attested dictionary entry merely to exist as a hypothesis.

However, if no independent functional meaning has been established, the instrument must not invent one.

Example posture:

- embryo: `ER`
- discoveryStatus: `structural_hypothesis`
- independentStandaloneMeaning: `unknown`
- lexicalAttestation: `not_required_for_discovery`
- historicalOriginClaim: `not_claimed`
- historicalTransmissionClaim: `not_claimed`
- userDecisionPosture: `user_decides`

The engine may explain why `ER` was structurally derived.

It may not silently state that `ER` independently means loss, absence, depletion, darkness, error, wind, terror, or any other function unless that meaning is separately supported by the relevant logic or evidence lane.

## Functional expansion chain

A structural embryo may participate in a larger functional chain.

The chain must preserve the status of every level separately.

A smaller embryo does not automatically inherit the meaning or evidence status of a larger expansion.

A larger expansion does not retroactively prove the historical origin of the smaller embryo.

Each level must be independently traceable.

Conceptual output:

~~~text
ER
status: structural_hypothesis
independent meaning: unknown

ER → TER
status: functional expansion candidate

ER → TER → SHTER
status: larger functional expansion candidate

ER → TER → SHTER → STERILE
status: target hypothesis chain
~~~

The displayed chain is a ZË-RO functional hypothesis.

It is not automatically a historical morphology claim.

It is not automatically an etymological derivation.

It is not automatically a borrowing-direction claim.

## STERILE proving case

`STERILE` is the first bounded proving case for this milestone.

The research question is:

**Can ZË-RO deterministically perform embryo surgery and expose `ER` as the smallest defensible structural hypothesis while keeping every larger expansion and every claim status separate?**

The candidate reduction chain to test is:

~~~text
STERILE
→ STER
→ TER
→ ER
~~~

The smallest proposed embryo is therefore `ER`.

This milestone does not declare `ER` to be an attested lexical root.

This milestone does not assign `ER` an independent lexical gloss.

This milestone does not claim that history derives `STERILE` from `ER`, `TER`, `SHTER`, Albanian, Latin, or any other language.

The milestone tests whether ZË-RO's own deterministic logic can discover and present the structural hypothesis honestly.

Larger functional expansions may later carry stronger functional support than `ER`.

That does not invalidate `ER` as the smallest structural hypothesis.

## Null semantics

Null must not mean:

- no reviewed dictionary row exists
- no historical source confirms the hypothesis
- no production-authorized evidence exists
- no canon-locked operator already exists

Those are evidence or promotion states.

For logic-first discovery, Null means:

**The deterministic ZË-RO discovery process could not produce a defensible structural hypothesis under the permitted operations and controls.**

A result may therefore contain:

- a structural hypothesis
- unresolved functional meaning
- no lexical witness
- no historical support
- no production promotion

without collapsing to Null.

## Truth hierarchy

The existing truth hierarchy remains mandatory:

- Fact
- Inference
- Hypothesis
- Unknown / Null

A hypothesis must be visibly labeled as a hypothesis.

Unknown is a valid field value inside a non-Null hypothesis.

For example:

~~~text
embryo = ER
structural status = Hypothesis
independent meaning = Unknown
historical origin = not_claimed
~~~

This is valid.

The presence of Unknown evidence does not erase a defensible structural hypothesis.

## Deterministic reduction requirement

Logic-first does not mean unrestricted letter stripping.

Every reduction must be produced by an explicit deterministic operation.

Each operation must be auditable.

Future implementation must expose or internally preserve:

- source form
- resulting form
- operation
- reason code
- permitted-operation contract
- position or span where applicable
- Seven-Voices state before and after where applicable
- rejection reasons
- competing reductions
- negative controls

The engine must not strip characters until an interesting-looking form appears.

The same rules must apply to control words.

## Evidence posture

Evidence is a witness to the hypothesis, not the source of ZË-RO's imagination.

External evidence may say:

- this form is independently attested
- this function has lexical support
- this expansion has a semantic witness
- this historical relation is supported
- this historical relation is disputed
- no independent witness was found

The engine must keep these statements separate from:

- structural discovery
- internal functional hypothesis
- Seven-Voices reasoning

Historical consensus may contradict a ZË-RO hypothesis.

If so, both may be displayed with their correct claim types.

The historical claim does not silently delete the ZË-RO hypothesis.

The ZË-RO hypothesis does not silently overwrite historical evidence.

## No-single-winner posture

This milestone preserves:

- `no_single_winner`
- `historicalOriginClaim: not_claimed`
- `historicalTransmissionClaim: not_claimed` unless separately supported
- `winnerClaim: not_claimed`
- `languageSuperiorityClaim: not_claimed`
- `userDecisionPosture: user_decides`

The engine presents reasoning.

It does not announce ownership of a word.

## Relationship to the existing embryo-first milestone

The existing embryo-first functional motivation milestone remains valid.

Its reviewed and validated functional-motivation requirements remain valid for promoted functional claims.

This milestone adds an earlier discovery tier.

Previously:

~~~text
candidate
→ evidence / isolation
→ validated functional motivation
~~~

Required architecture:

~~~text
deterministic structural discovery
→ structural hypothesis
→ functional support
→ reviewed evidence
→ production promotion
→ runtime verification
→ optional canon lock
~~~

A structural hypothesis is not a shortcut around later gates.

It is a distinct earlier truth state.

## Required candidate distinction

Future contracts must be able to distinguish at least:

- `structural_hypothesis`
- `functional_hypothesis`
- `partial_functional_support`
- `reviewed_functional_evidence`
- `runtime_verified`
- `canon_locked`
- `unknown`
- `null`

Exact type names may be refined after code inspection.

The semantic separation may not be removed.

## Non-goals

This milestone does not:

- implement a generic reduction engine yet
- register `ER` as a production proto-root
- register `ER` as a canonical operator
- assign `ER` an invented standalone gloss
- promote `TER`
- promote `SHTER`
- claim historical derivation
- claim Albanian origin
- claim Latin origin
- modify reviewed-source rows
- weaken source review
- weaken production membership
- weaken runtime authorization
- weaken canon-lock admission
- execute an LLM/provider
- create a historical winner

## Implementation discipline

Before implementing the reduction engine, inspect whether existing seams can be reused for:

- minimal-root generation
- DeepRoot decomposition
- candidate projection
- RootMap
- reason codes
- validation outcomes
- candidate ranking
- Seven-Voices path
- evidence references
- functional composition

Do not duplicate architecture unnecessarily.

The smallest safe implementation must first prove the separation between:

~~~text
logic-derived structural hypothesis
~~~

and:

~~~text
reviewed/promoted functional evidence
~~~

Only after that boundary is locked should generic reduction breadth expand.

## First proving contract

The first implementation contract under this milestone must lock all of these:

1. `STERILE` may produce a non-Null structural hypothesis.
2. `ER` may appear as the smallest structural hypothesis when reached by permitted deterministic logic.
3. `ER` must not receive an invented independent lexical gloss.
4. `ER` must not automatically become reviewed or production evidence.
5. larger expansions remain separately typed.
6. historical origin remains `not_claimed`.
7. competing hypotheses remain allowed.
8. a failed reduction returns reason codes rather than silent deletion.
9. controls must prove the reduction logic does not generate arbitrary embryos.
10. existing production evidence gates remain unchanged.

## Current implementation state

The core logic-first structural-hypothesis lane is implemented and runtime-verified.

Verified implementation state:

- structural hypothesis contract implemented
- deterministic reduction operation grammar implemented
- structural defensibility gate implemented
- size-2 minimum-anchor family gate implemented
- Null-only public structural projection implemented
- Unicode structural normalization fails closed rather than deleting unsupported internal letters
- `STERILE` deterministically exposes `ER` and `ERILE`
- `GJAK` may expose `AK` under the same generic size-2 rule
- `MEMORY` may expose `EM` under the same generic rule
- independent standalone meaning remains Unknown / null
- historical origin remains `not_claimed`
- candidate truth remains `not_claimed`
- reviewed evidence and production promotion remain separate
- canonical DA / DI / AT evidence ownership remains intact
- `npm run gate:quick` has passed on the implementation worktree
- Open Instrument production live smoke has passed with the automatic proposer disabled

The milestone is **closed**.

Step 8 — UI truth display — is implemented and merged.

PR #1809 added the bounded user-facing truth display required by this milestone:

- `Structural hypothesis`
- `Independent meaning: Unknown`
- `Functional support: Unknown`
- `Historical origin: not claimed`
- `Candidate truth: not claimed`
- `Hypothesis — structural, unreviewed`

The UI presentation preserves the existing truth separation:

- structural hypotheses are not reviewed functional evidence;
- structural hypotheses are not candidate truth;
- structural hypotheses do not create historical-origin claims;
- the Functional Motivation evidence card remains separately governed;
- reviewed evidence and production promotion remain separate.

Step 9 — regression and gate — is satisfied.

The Step-8 implementation passed:

- the dedicated structural-hypothesis UI truth-display contract;
- the existing UI regression pack;
- repo-native Open Instrument local production smoke;
- `npm run gate:quick`;
- GitHub required checks.

Step 10 — milestone closure — is therefore eligible and recorded below.

## Milestone plan

### Step 1 — milestone definition

Status:

`Z_ZERO_LOGIC_FIRST_EMBRYO_HYPOTHESIS_MILESTONE_DEFINED_PENDING_REVIEW`

Completed.

### Step 2 — milestone review

Status:

`Z_ZERO_LOGIC_FIRST_EMBRYO_HYPOTHESIS_MILESTONE_REVIEWED_ACCEPTED_READY_FOR_CONTRACT`

Accepted.

### Step 3 — structural hypothesis contract

Define exact types, states, reason codes, ordering, and Null behavior.

### Step 4 — contract tests

Lock discovery-versus-promotion separation before runtime implementation.

### Step 5 — smallest deterministic reduction embryo

Implement only the smallest reusable seam required to prove the contract.

### Step 6 — STERILE proving case

Run the deterministic `STERILE` case and required negative controls.

### Step 7 — live API projection

Expose structural hypotheses without relabeling them as reviewed evidence.

### Step 8 — UI truth display

Clearly display Hypothesis / Unknown / reviewed evidence as separate states.

### Step 9 — regression and gate

Run focused tests, `npm run gate:quick`, live smoke, and UI smoke where applicable.

### Step 10 — milestone closure

Status:

`Z_ZERO_LOGIC_FIRST_EMBRYO_HYPOTHESIS_MILESTONE_CLOSED`

Closed.

<!-- Z_ZERO_LOGIC_FIRST_EMBRYO_HYPOTHESIS_MILESTONE_CLOSED_2026_08_26 -->

## Final closure evidence — 2026-08-26

### Closure decision

The ZË-RO Logic-First Embryo Hypothesis milestone v0.1 is closed.

The milestone has completed its required architecture:

~~~text
deterministic structural discovery
→ structural hypothesis
→ functional support
→ reviewed evidence
→ production promotion
→ runtime verification
→ optional canon lock
~~~

Logic-derived structural discovery now exists as a distinct truth tier without weakening later evidence or promotion gates.

### Core implementation

PR #1808 implemented the bounded logic-first structural-hypothesis core.

Source commit:

`f238f5194de1399de84ad8a05007048238012fdc`

Merged main after PR #1808:

`8883060f75fc84d1bf308bea3e378f6ce4deea3e`

Core behavior includes:

- deterministic structural-hypothesis discovery;
- explicit reduction operations and reason codes;
- structural defensibility gates;
- size-2 minimum-anchor family gating;
- Null-only public structural projection;
- fail-closed unsupported-Unicode handling;
- deterministic `STERILE → STER → TER → ER`;
- structural sibling `ERILE`;
- generic `GJAK → JAK → AK`;
- generic `MEMORY → MEM → EM`.

These remain structural hypotheses only.

No independent lexical meaning is manufactured.

Historical origin remains unclaimed.

Candidate truth remains unclaimed.

Production promotion remains separate.

### UI truth display

PR #1809 implemented Step 8 and was squash merged.

Source commit:

`59a5f8aafe2394adea8abfa5a60f8649fa8711a0`

Squash merge:

`a3238874989f45f624cf99ccd6d5d5f07f796f63`

User-facing structural hypotheses now visibly distinguish:

- Hypothesis;
- Unknown independent meaning;
- Unknown functional support;
- historical origin not claimed;
- candidate truth not claimed;
- reviewed functional evidence as a separate state.

The structural analysis state is presented as:

`Hypothesis — structural, unreviewed`

The presentation follows the existing adapter boundary:

~~~text
analyze-v1
→ contractAdapter
→ CandidateRowVM
→ candidate presentation
~~~

Presentation components do not bypass the VM to reinterpret raw structural truth.

### Validation evidence

The final Step-8 implementation validation established:

- focused structural-hypothesis UI contract: PASS;
- UI regression pack: PASS;
- repo-native Open Instrument local production smoke: PASS;
- `npm run gate:quick`: PASS;
- unit suites: 580 passed, 3 skipped;
- unit tests: 2458 passed, 4 skipped;
- snapshots: 149 passed;
- integration suites: 2 passed;
- integration tests: 5 passed;
- Next.js 16.2.12 production build: PASS;
- GitHub required checks for PR #1809: 5/5 successful.

### Closure boundaries

This milestone closure does not claim:

- that `ER` has an independently established lexical meaning;
- that `ER`, `TER`, `SHTER`, `AK`, or `EM` are historical origins;
- that any structural hypothesis is reviewed evidence;
- that any structural hypothesis is production truth;
- that any candidate is a historical winner;
- that one language owns or originates the target word;
- that candidate evidence may bypass review or promotion gates.

`Unknown` remains valid inside a non-Null hypothesis.

`Null` remains valid when deterministic ZË-RO logic cannot produce a defensible structural hypothesis.

The governing posture remains:

**Logic discovers. Evidence validates or contextualizes. Promotion remains strict.**

**Discovery may outrun evidence. Meaning may not outrun logic.**

### Final state

All ten milestone steps are complete.

No additional implementation slice is required for ZË-RO Logic-First Embryo Hypothesis v0.1.

The milestone is:

`Z_ZERO_LOGIC_FIRST_EMBRYO_HYPOTHESIS_MILESTONE_CLOSED`
