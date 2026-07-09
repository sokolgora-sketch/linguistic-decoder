# Open Instrument — Operator Template Reference (DA) v0.1

## Status
Reference template derived from DA.

## Purpose

This document defines the exact reusable operator pattern for future operators using **DA** as the first fully live reference implementation.

The value of this document is procedural:
future operator lanes should be able to use this file as the starting blueprint without guessing what must exist, what must pass, and what must remain blocked.

---

## Operator lifecycle

## State A — candidate metadata only

The operator exists only as metadata-safe candidate material.

Allowed:
- reviewed metadata intake
- candidate diagnostics
- non-live inspection

Not allowed:
- production-live promotion
- runtime reviewed evidence projection

---

## State B — reviewed candidate

A reviewed source row exists and carries traceable citation / review-note posture.

Allowed:
- registry presence
- candidate audits
- promotion checklist evaluation

Not allowed:
- runtime reviewed evidence projection until production-live criteria close

---

## State C — production-live eligible

Promotion checklist passes and the evidence path is acceptable for runtime use.

Allowed:
- production row entry
- runtime reviewed evidence projection
- live smoke inclusion

---

## State D — runtime projected

Boundary-safe runtime reviewed evidence is emitted into runtime-safe structures.

Allowed:
- live API visibility
- RootMap reviewed evidence visibility
- UI visibility through VM-safe paths

---

## State E — live-smoke locked

Repo-native live smoke and full gate prove the operator path.

Allowed:
- canon reuse as template
- future operator comparison against this reference

---

## Exact artifact map every new operator must implement

## 1. Registry source row
File:
- `src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`

Purpose:
- declare the reviewed operator row
- define source identity
- define citation / review posture
- define review notes and safe metadata

DA reference:
- DA reviewed row exists here and is the source-row starting point

---

## 2. Promotion checklist
File:
- `src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1.ts`

Purpose:
- decide whether a reviewed row remains candidate-only or becomes production-live eligible

DA reference:
- DA promotion path is closed enough for runtime reviewed evidence
- DI currently demonstrates what a blocked operator looks like by contrast

---

## 3. Evidence validator
File:
- `src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1.ts`

Purpose:
- validate reviewed evidence before runtime projection
- fail closed on incomplete or unsafe reviewed evidence

DA reference:
- DA satisfies this path
- runtime reviewed evidence is emitted safely

---

## 4. Runtime projection
File:
- `src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts`

Purpose:
- convert eligible reviewed rows into boundary-safe runtime evidence

DA reference:
- DA emits reviewed functional free-operator evidence
- DA runtime wording preserves:
  - no history winner claim
  - no language superiority claim
  - user-decides posture

---

## 5. RootMap / runtime consumption
File:
- `src/shared/deepRoot.rootMap.builder.v1.ts`

Purpose:
- make the projected operator visible in runtime RootMap output

DA reference:
- DA appears live in:
  - `da`
  - `dam`
  - `damage`
  - `mode`

---

## 6. Semantics layer
Files:
- `src/shared/freeOperatorProfile.v0_1.ts`
- `src/shared/freeOperatorEvidence.v0_1.ts`

Purpose:
- define the operator’s meaning / profile / classification posture

DA reference:
- DA currently expresses split / divide / cut / separate

---

## 7. Proof layer

Minimum expected proof set for a future operator:

### Registry / candidate proof
- candidate row exists
- row fields are correct
- candidate posture is deterministic

### Promotion proof
- promotion checklist clearly passes or clearly fails
- blocker reasons are explicit

### Runtime boundary proof
- blocked operators stay out of runtime reviewed projection
- promoted operators project only safe evidence fields

### Live word proof
- at least one direct proof word
- at least one composed / segmented word when applicable

### UI/runtime visibility proof
- runtime evidence appears in the live runtime output where expected
- blocked operators stay absent where expected

---

## 8. Live smoke obligation
File:
- `scripts/open-instrument/live-smoke.v0.1.mjs`

Every canon operator should eventually define:
- exact proof words
- exact expected runtime visibility
- exact expected absence rules where blockers apply

DA reference:
- DA reviewed evidence must be visible for DA proof words
- DI reviewed runtime projection must remain absent while blocked

---

## 9. Documentation obligation

Every canon operator lane should update docs when runtime expectations change.

Minimum doc set:
- milestone or scope doc
- audit or closure doc
- operator template / reference implications if the operator changes the reusable process
- workflow/runbook wording if live smoke expectations change

DA reference:
- DA now serves as the first canonical operator documentation model

---

## 10. What future operators must copy from DA

A future operator should copy the **process**, not the content.

Required copy-pattern:
1. reviewed row
2. promotion checklist result
3. validator-safe reviewed evidence
4. runtime projection
5. RootMap/runtime visibility
6. live-smoke proof words
7. focused tests
8. full gate proof
9. doc updates

---

## 11. DI comparison rule

DI currently proves the opposite case:

- reviewed candidate exists
- live DI carrier evidence can appear
- reviewed DI runtime projection stays blocked

This is useful because it shows that:
- reviewed candidate presence is not enough
- live carrier presence is not enough
- production-live reviewed evidence requires closure, not guesswork

---

## 12. Definition of done for a future operator

A future operator can be treated as DA-template compliant only when all are true:

- reviewed row exists
- promotion state is explicit
- validator path is explicit
- runtime projection state is explicit
- RootMap/runtime visibility is explicit
- live smoke includes proof words
- gate passes
- docs explain the operator lifecycle without guesswork

That is the actual DA canon template.
