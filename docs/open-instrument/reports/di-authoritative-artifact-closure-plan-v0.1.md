# Open Instrument — DI Authoritative Artifact Closure Plan v0.1

## Status
Inspect-only planning baseline.

## Purpose

This document defines the **smallest safe next lane** for DI after DA canon closeout.

The goal is not to promote DI in this doc.
The goal is to make the first DI promotion blocker explicit so the next implementation lane is not guesswork.

Current merged posture:

- DA is the canon reference operator
- DI is semantically supported
- DI is carrier-visible in runtime
- DI reviewed-runtime evidence remains blocked
- the first blocker is **source-row authoritative artifact closure**

---

## Executive decision

DI does **not** appear blocked because runtime code is unfinished.

DI appears blocked because the current reviewed row still uses an **indirect reference-listing posture**:

- host posture: `Wiktionary / DPEWA reference listing`
- URL posture: Wiktionary entry path
- review-note posture explicitly says:
  - direct authoritative locator or archived authoritative dictionary snapshot is still required before production-live promotion

That review note hard-fails the promotion checklist before runtime projection becomes relevant.

So the first next lane is:

**source-row authoritative-artifact closure**

Not runtime wiring first.
Not validator rewrites first.
Not live-smoke expansion first.

---

## What DI already has

The current DI row already has these fields present:

- reviewed accepted citation status
- source URL / archive ref field populated
- entry locator populated
- attested form populated
- attested gloss populated

So DI is **not** missing the basic row shape.

The problem is that the row still declares itself as an indirect bridge to authority, not the authority itself.

---

## Exact current blocker

### 1. Source-host posture is indirect

Current DI row uses a host posture equivalent to:

- `Wiktionary / DPEWA reference listing`

That means the row is still anchored to a secondary path that points toward authority rather than being closed on a direct authoritative artifact.

### 2. Review note explicitly blocks production-live promotion

Current DI review note says, in substance:

- direct authoritative locator or archived authoritative dictionary snapshot is still required before production-live promotion

This is the most important blocker because checklist logic treats this wording as a hard fail.

### 3. Promotion checklist is designed to fail until that source closes

The checklist already contains:

- `direct_authoritative_locator_or_archive`
- `entry_locator_finalized`

The DI blocker is therefore not “missing checklist logic.”
The blocker is that DI currently does not satisfy the source-closure expectation that the checklist already knows how to evaluate.

### 4. Runtime projection is downstream, not first blocker

Validator/runtime layers still require non-empty locator/form/gloss fields.
DI already has those.

So the first blocker is not:
- missing locator field
- missing attested form
- missing attested gloss
- missing runtime projection code

The first blocker is:
- indirect source posture
- explicit blocker review note
- therefore no production-live eligibility

---

## Exact authoritative artifact needed

DI needs one of these, explicitly and reviewably:

### Option A — direct authoritative dictionary locator
A direct authoritative locator into the underlying authoritative source for DI, such as:
- direct DPEWA entry locator
- direct FGJSH entry locator

### Option B — archived authoritative dictionary snapshot
A stable archived authoritative dictionary artifact that is treated as authoritative enough for review closure, with:
- stable archive reference
- exact DI entry locator
- attested form
- attested gloss
- reviewable provenance

The new artifact must replace the current “reference-listing” posture as the primary citation basis.

---

## Smallest safe next implementation lane

## Lane name
**DI source-row authoritative-artifact closure v0.1**

## Lane class
Focused source-row + checklist re-evaluation lane

## What this lane should do
1. replace the current indirect host/source posture with the authoritative artifact
2. update citation/source fields accordingly
3. rewrite the DI review note so it no longer contains the explicit blocker sentence
4. re-run promotion checklist expectations for DI
5. inspect whether DI now becomes production-row eligible
6. only after that, decide whether runtime reviewed projection tests should flip positive

## What this lane should not do
- do not widen into unrelated operator work
- do not rewrite DA
- do not mix TER or other operators
- do not invent broad runtime/UI behavior without first proving production eligibility
- do not skip the inspect-before-patch step for the exact DI row fields

---

## Expected file touch set for the next patch lane

### Likely required
- `src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`
- `tests/reviewedExternalLexiconSourceRowRegistry.diCandidate.v0_1.spec.ts`
- `tests/reviewedExternalLexiconSourceRowRegistry.diProductionBlocker.v0_1.spec.ts`
- `tests/reviewedExternalLexiconSourceRowRegistry.diLocatorArchiveAssessment.v0_1.spec.ts`
- `tests/reviewedExternalLexiconSourceRowRuntimeBoundary.v0_1.spec.ts`

### Maybe required after row closure inspection
- `src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1.ts`
- `tests/reviewedExternalLexiconRuntimeProjection.v0_1.spec.ts`
- `tests/apiAnalyzeV1.reviewedDiRuntimeBlocker.contract.v0_1.spec.ts`
- `tests/apiAnalyzeV1.reviewedDaRuntimeProjection.wiring.v0_1.spec.ts`
- `scripts/open-instrument/live-smoke.v0.1.mjs`

### Only if promotion truly closes
- positive DI runtime projection tests
- live-smoke DI expectation updates
- docs/runbook wording updates

---

## Decision matrix

| Question | Current answer |
|---|---|
| Is DA unfinished? | No |
| Is DI blocked by missing basic row fields? | No |
| Is DI blocked first by source posture? | Yes |
| Is the current blocker explicit in review note text? | Yes |
| Does checklist already encode the blocker? | Yes |
| Does runtime wiring appear to be the first blocker? | No |
| Smallest safe next lane | source-row authoritative-artifact closure |

---

## Exact next-step recommendation

Proceed in two moves:

### Move 1 — inspect anchors for the DI row patch
Inspect exact current field anchors in:
- DI source row
- DI DI-specific tests
- DI promotion checklist expectations

### Move 2 — patch only the DI authoritative-artifact closure lane
If the authoritative artifact is ready and explicit, patch the row and the DI blocker tests first.
Then prove whether checklist closure is enough to justify a second follow-up runtime-promotion lane.

---

## Final decision

- DA is closed for now
- DI remains blocked by **source-row authoritative artifact closure**
- the first real DI implementation lane should be:
  - **source-row authoritative-artifact closure**
- runtime promotion should come only after that closure proves DI production-live eligible
\n