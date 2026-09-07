# Open Instrument Logic-First Functional Discovery v1

**Milestone ID:** `OPEN_INSTRUMENT_LOGIC_FIRST_FUNCTIONAL_DISCOVERY_V1`

**Status:** `ACTIVE`

**Opened:** 2026-09-07

**Opening baseline:** `fb68a0630031f0cadabba0ff566f7b880d033816`

---

## 1. Milestone purpose

This milestone adds the next discovery tier to Open Instrument / ZË-RO.

The evidence-scaling and deterministic-intake milestone proved that reviewed and research evidence can move through a generic pipeline and surface correctly at runtime.

That is not sufficient for logic-first discovery.

For a previously unseen word, ZË-RO must be able to use its own deterministic structural and Seven-Voice logic to produce bounded functional hypotheses where that logic genuinely supports them.

The milestone doctrine is:

> **Logic may discover. Evidence may validate, contextualize, strengthen, weaken, or reject. Promotion remains strict.**

The goal is not to eliminate Null.

The goal is to make Null mean:

> no defensible discovery survived the currently authorized ZË-RO logic and controls.

---

## 2. Core research question

Can Open Instrument generate traceable, sense-bound functional hypotheses for previously unseen words from deterministic ZË-RO structure and Seven-Voice doctrine without silently converting doctrine alignment into lexical fact, historical origin, reviewed evidence, candidate truth, or production truth?

A successful discovery must remain visibly weaker than reviewed or source-backed research evidence.

---

## 3. Truth hierarchy

The milestone preserves:

1. Fact
2. Inference
3. Hypothesis
4. Unknown / Null

Unknown remains a valid field inside a non-Null hypothesis.

Null remains a valid aggregate result when no defensible discovery survives.

---

## 4. Canonical Seven Voices

The canonical Seven Voices remain:

`A, E, I, O, U, Y, Ë`

Y remains a canonical vowel by default.

Consonants may shape structural frames but do not independently drive the Seven-Voice path.

Current doctrine roles are inherited from the repository SSOT:

| Voice | Doctrine role |
| --- | --- |
| A | Initiation / Source |
| E | Expansion / Bridge |
| I | Direction / Focus |
| O | Mediation / Balance |
| U | Containment / Depth |
| Y | Reflection / Mirror |
| Ë | Completion / Unit |

This milestone must reuse the existing Seven-Voice registry and principle authorities.

It must not create a competing doctrine table.

---

## 5. Critical semantic boundary

A deterministic Seven-Voice projection is not automatically a functional meaning claim about the analyzed word.

For example:

`E -> Expansion / Bridge`

may be deterministic doctrine projection.

But:

`BREAK -> E -> expansion of a gap motivates physical separation`

contains a semantic bridge about the target sense.

That bridge is a hypothesis.

The engine must preserve this distinction explicitly.

Therefore:

~~~text
Seven-Voice path
-> doctrine projection
~~~

may be deterministic.

But:

~~~text
doctrine projection
+ explicit target sense
-> semantic bridge
-> functional hypothesis
~~~

must remain bounded as Hypothesis unless independently strengthened by another evidence/review lane.

---

## 6. Target-sense requirement

Logic-derived functional discovery must be sense-bound.

The system must not silently infer an unrestricted lexical meaning merely from a word form or vowel.

A discovery input must have an explicit target sense or an equivalently explicit sense-bearing context.

The target sense is not evidence for the proposed historical origin.

It is the semantic object against which a ZË-RO doctrine hypothesis is evaluated.

---

## 7. Reuse-first architecture

Before adding a new subsystem, implementation must reuse or extend existing seams where technically correct.

Current reusable owners include:

- `src/shared/structuralHypothesisDiscovery.v0_1.ts`
- `src/shared/orchestrator/automaticFunctionalCandidateProposal.v0.1.ts`
- `src/shared/verifier/verifyAutomaticFunctionalProposal.v0.1.ts`
- `src/shared/openInstrument/functionalVoiceNormalization.v0.1.ts`
- `src/shared/analysisAdapter.ts`
- `src/shared/analysisStatus.v0_1.ts`
- `src/shared/analyzeWordResult.v1.contract.ts`
- `src/shared/sevenPrinciples.v1.ts`
- `src/shared/sevenVoiceOrderedViews.v0.1.ts`
- `app/api/analyze-v1/route.ts`

The milestone must not duplicate these architectures merely to introduce doctrine-derived discovery.

---

## 8. Existing precedence

Current aggregate truth ownership includes:

~~~text
reviewed functional evidence
-> source-backed research functional hypothesis
-> deterministically verified proposed functional candidate
-> canonical candidate
-> structural output / structural hypothesis
-> Null
~~~

The initial milestone implementation should preserve the existing aggregate status contract unless inspection proves that a new status is necessary.

The default first posture is:

**logic-derived functional discovery remains `candidate_only`**

until a separately reviewed contract authorizes another aggregate status.

---

## 9. Candidate truth boundary

A logic-derived functional discovery candidate must never automatically claim:

- reviewed functional evidence
- source-backed research evidence
- production truth
- candidate truth
- historical origin
- historical transmission
- borrowing direction
- cognacy
- language ownership
- language superiority
- a single etymological winner

Required posture remains equivalent to:

~~~text
historicalOriginClaim = not_claimed
historicalTransmissionClaim = not_claimed
winnerClaim = not_claimed
languageSuperiorityClaim = not_claimed
candidateTruthClaim = not_claimed
userDecisionPosture = user_decides
~~~

---

## 10. No-single-winner posture

This milestone preserves `no_single_winner`.

More than one functional discovery hypothesis may survive.

Ordering may be deterministic.

Ordering must not silently become truth ranking.

The user remains able to inspect competing hypotheses and their reasoning.

---

## 11. Null semantics

Null is not a failure target.

Null is also not something the implementation should artificially minimize.

A fresh word may remain Null when:

- no defensible structural anchor survives;
- no usable Seven-Voice path is available;
- required normalization is unauthorized;
- the target sense cannot be connected without unsupported semantic invention;
- deterministic verification rejects every proposal.

A milestone test passes when it returns Null for the correct reason.

---

## 12. Discovery trace requirements

A logic-derived functional hypothesis must remain traceable.

Where applicable the system should preserve:

- target word
- explicit target sense
- structural anchor or embryo
- structural reduction trace
- surface Seven-Voice path
- functional Seven-Voice path when authorized
- doctrine projection
- selected doctrine role or roles
- semantic bridge
- deterministic verifier checks
- required transformations
- rejection reason codes
- competing hypotheses
- claim boundary
- user-decision posture

---

# 13. Milestone lanes

## Lane 1 — Deterministic Doctrine Projection v0.1

**Status:** `DONE`

Purpose:

Create the smallest deterministic seam that projects an existing authorized Seven-Voice path into canonical doctrine metadata.

This lane must not generate a lexical meaning claim.

Minimum output should be equivalent to:

~~~text
voice/path
-> canonical doctrine role
-> canonical symbolic metadata
-> deterministic provenance to Seven-Voice SSOT
~~~

Requirements:

- reuse the repository Seven-Voice SSOT;
- support all seven canonical voices;
- preserve Y as canonical;
- deterministic output;
- no external provider;
- no semantic bridge generation;
- no evidence promotion;
- no candidate-truth claim;
- focused tests including malformed/empty paths.

Exit proof:

- focused tests pass;
- output is deterministic;
- no duplicate doctrine registry introduced;
- existing Seven-Voice consumers remain unchanged.

---

## Lane 2 — Sense-Bound Logic-Derived Functional Hypothesis v0.1

**Status:** `DONE`

Purpose:

Combine:

~~~text
explicit target sense
+ defensible structural/voice anchor
+ deterministic doctrine projection
~~~

to produce a bounded functional hypothesis candidate.

The semantic bridge must remain `Hypothesis`.

The implementation must not pretend that doctrine projection itself discovered the target lexical meaning.

Initial candidate posture should reuse the existing functional-candidate contract when compatible.

---

## Lane 3 — Deterministic Discovery Verification v0.1

**Status:** `DONE`

Purpose:

Deterministically verify that a discovered functional hypothesis:

- is target-bound;
- uses an authorized structural/voice anchor;
- uses canonical Seven-Voice doctrine;
- does not request unauthorized transforms;
- preserves required truth boundaries;
- does not overwrite stronger evidence;
- fails closed on malformed or unsupported proposals.

The verifier is implemented as a dedicated logic-derived verifier under the existing verifier namespace, because the existing automatic functional proposal verifier has a provider-specific input contract.

---

## Lane 4 — Runtime / API / UI Integration v0.1

**Status:** `NEXT`

Purpose:

Expose verified logic-derived functional hypotheses through the real Open Instrument surface.

Initial aggregate posture:

`candidate_only`

unless a later reviewed contract proves a dedicated status is necessary.

UI must distinguish at least:

- Reviewed functional evidence
- Research functional hypothesis
- Logic-derived functional hypothesis
- Structural hypothesis
- Null

The display must make clear that logic-derived functional hypotheses are not reviewed or source-backed evidence.

---

## Lane 5 — Fresh-Word Generalization and Negative-Control Proof v0.1

**Status:** `NOT_STARTED`

Purpose:

Test the discovery system on words that were not used to implement the feature.

Opening fresh-word pool from the post-PR-1846 user-reality probe includes:

- candle
- staircase
- orchard
- tunnel
- ribbon
- helmet
- pocket
- chimney

These words were confirmed absent from tracked repository content at the time of the reality probe.

The milestone must not require all of them to become non-Null.

The success criterion is:

> defensible hypotheses appear where ZË-RO logic supports them, and legitimate Null survives where it does not.

Required controls include:

- stronger reviewed evidence
- stronger research evidence
- canonical candidate ownership
- structural-only cases
- true Null cases
- malformed sense/path input
- unauthorized normalization
- competing hypotheses

---

## Lane 6 — Milestone Closeout

**Status:** `NOT_STARTED`

The milestone may become `DONE` only after all prior lanes are complete and their actual proof is recorded.

Required closeout proof:

- focused tests for each capability lane;
- repository `npm run gate:quick` PASS;
- production `open-instrument:live-smoke` PASS when available on the closing head;
- live `/api/analyze-v1` proof;
- live `/chat` truth-display proof;
- fresh-word reality matrix;
- negative controls;
- reviewed/research precedence proof;
- Null-preservation proof;
- no-single-winner proof;
- clean final diff;
- PR review findings resolved;
- merged-main synchronization proof;
- protected JO stash unchanged.

Only then:

~~~text
Status: DONE
~~~

may replace:

~~~text
Status: ACTIVE
~~~

A closure marker should then be added:

~~~text
OPEN_INSTRUMENT_LOGIC_FIRST_FUNCTIONAL_DISCOVERY_V1_CLOSED_<DATE>
~~~

---

# 14. Current milestone state

| Lane | State |
| --- | --- |
| Milestone opening | ACTIVE |
| 1. Deterministic Doctrine Projection v0.1 | DONE |
| 2. Sense-Bound Logic-Derived Functional Hypothesis v0.1 | DONE |
| 3. Deterministic Discovery Verification v0.1 | DONE |
| 4. Runtime / API / UI Integration v0.1 | NEXT |
| 5. Fresh-Word Generalization and Negative-Control Proof v0.1 | NOT_STARTED |
| 6. Milestone Closeout | NOT_STARTED |

---

# 15. Current next task

**Lane 4 — Runtime / API / UI Integration v0.1**

Before implementation:

1. inspect current branch and divergence from `main`;
2. inspect live analysis route, adapter, status, result contract, and UI consumers;
3. identify the smallest runtime/API/UI wiring for verified logic-derived hypotheses;
4. patch only that lane;
5. run focused tests;
6. run the repository gate before merge.

Do not implement Lane 5 during Lane 4.

---

# 16. Lane 1 closeout evidence

Lane 1 was implemented and committed at `f3b45b9d` (`feat(open-instrument): add deterministic doctrine projection`).

Implementation files:

- `src/shared/openInstrument/doctrineProjection.v0_1.ts`
- `tests/openInstrument.doctrineProjection.v0_1.spec.ts`

The projection reuses `sevenVoiceOrderedViews.v0.1.ts` and `sevenPrinciples.v1.ts`, preserves canonical path order and duplicates, accepts an explicit empty path, fails closed on malformed or unsupported path values, and records the existing Seven-Voice/doctrine SSOT references. It does not generate lexical meaning, semantic bridges, evidence, candidate truth, or runtime/API output.

Focused validation:

- 3 suites passed
- 21 tests passed
- 1 snapshot passed

Full `npm run gate:quick` validation:

- 633 unit suites passed, 3 skipped
- 2,832 unit tests passed, 4 skipped
- 149 snapshots passed
- 2 integration suites passed
- 5 integration tests passed
- Next.js 16.2.12 production build passed
- static generation passed: 22/22

No existing Seven-Voice consumer changed.

# 17. Lane 2 closeout evidence

Lane 2 was implemented and committed at `4f1c47ff` (`feat(open-instrument): add sense-bound logic hypothesis`).

Implementation files:

- `src/shared/openInstrument/logicDerivedFunctionalHypothesis.v0_1.ts`
- `tests/openInstrument.logicDerivedFunctionalHypothesis.v0_1.spec.ts`

The composition requires an explicit target word and target sense, a defensible structural hypothesis, and a non-empty terminal canonical voice path. It reuses the Lane 1 doctrine projection, emits `candidate_only`, keeps the semantic bridge at `functionalBridgeTruth: hypothesis`, preserves `noSingleWinner`, and fixes historical origin, transmission, winner, language-superiority, and candidate-truth claims at `not_claimed`. It does not wire runtime/API/UI surfaces or promote evidence.

Focused validation:

- 4 suites passed
- 41 tests passed

Full `npm run gate:quick` validation:

- 634 unit suites passed, 3 skipped
- 2,838 unit tests passed, 4 skipped
- 149 snapshots passed
- 2 integration suites passed
- 5 integration tests passed
- Next.js 16.2.12 production build passed
- static generation passed: 22/22

# 18. Lane 3 closeout evidence

Lane 3 was implemented and committed at `b851d890` (`feat(open-instrument): verify logic-derived hypotheses`).

Implementation files:

- `src/shared/verifier/verifyLogicDerivedFunctionalHypothesis.v0_1.ts`
- `tests/verifier/verifyLogicDerivedFunctionalHypothesis.v0_1.spec.ts`

The dedicated verifier reuses the Lane 1 doctrine projection and Lane 2 hypothesis contract, verifies target and sense binding, authorized structural operations, canonical doctrine projection, truth boundaries, stronger-evidence precedence, and malformed input fail-closed behavior. It does not mutate or promote evidence.

Focused validation:

- 4 suites passed
- 33 tests passed

Full `npm run gate:quick` validation on the closing Lane 3 head:

- 635 unit suites passed, 3 skipped
- 2,848 unit tests passed, 4 skipped
- 149 snapshots passed
- 2 integration suites passed
- 5 integration tests passed
- Next.js 16.2.12 production build passed
- static generation passed: 22/22

# 19. Codex continuation protocol

Every Codex task working on this milestone must begin with these rules:

1. Verify that the repository is `sokolgora-sketch/linguistic-decoder`.
2. Verify the local repo is Open Instrument / ZË-RO, not VoiceLab or another project.
3. Inspect git status, current branch, `origin/main`, and divergence.
4. Read this milestone document in full:
   `docs/open-instrument/reports/open-instrument-logic-first-functional-discovery-v1.md`
5. Treat repository state and this document's proven entries as stronger than old chat context.
6. Find the first milestone lane that is not complete.
7. Inspect that lane's existing implementation, contracts, tests, and dependencies before changing code.
8. Continue only the smallest unfinished lane.
9. Do not skip ahead because a later lane looks easy.
10. Do not mark a lane complete without actual test/proof output.
11. Record exact PR/commit/test evidence for completed lanes.
12. Do not mark the milestone `DONE` until every closure criterion is actually proven.
13. Preserve Fact / Inference / Hypothesis / Unknown boundaries.
14. Preserve Null as valid.
15. Preserve `no_single_winner`.
16. Do not promote logic-derived hypotheses into reviewed, research, historical, candidate, or production truth.
17. Preserve the parked JO stash.

If Codex finds repository state inconsistent with this milestone document, it must STOP and report the mismatch rather than guessing.

---

# 20. Milestone doctrine lock

The governing milestone principle is:

> **Discovery should outrun evidence only as Hypothesis. Meaning must not outrun logic. Evidence may validate or contextualize discovery, but neither doctrine nor evidence may silently manufacture truth.**

---

# 21. Opening proof

Opening baseline:

`fb68a0630031f0cadabba0ff566f7b880d033816`

Opening branch:

`feat/open-instrument-logic-first-functional-discovery-v1`

At milestone opening:

- evidence-intake scaling is already merged;
- deterministic structural discovery exists;
- automatic functional proposal and deterministic verification seams exist;
- Seven-Voice doctrine SSOT exists;
- doctrine-derived functional discovery does not yet exist;
- Lane 1 is the next implementation task.
