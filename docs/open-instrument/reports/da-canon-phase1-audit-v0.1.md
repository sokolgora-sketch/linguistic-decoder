# Open Instrument — DA Canon Phase 1 Audit v0.1

## Status
Phase 1 audit complete.

## Purpose

This report locks the exact current DA operator path as inspected on main after the DI blocker-contract lane merged.

DA is the first operator that already completes the full practical lifecycle:

- reviewed source-row registry
- promotion checklist path
- production-live eligibility
- boundary-safe runtime reviewed evidence projection
- RootMap/runtime visibility
- live smoke proof
- gate proof

This report exists to separate **runtime truth** from scattered repo knowledge so future operator work can start from one stable reference.

---

## Executive result

### DA is already canon-grade in runtime behavior

DA is the first operator that is live across the full path:

1. reviewed source row exists
2. promotion path exists
3. runtime reviewed evidence projects
4. RootMap visibly surfaces DA evidence
5. repo-native live smoke proves the contract
6. `gate:quick` proves the repo remains green

### DA is not yet fully canon-grade in documentation

The repo still needed a formal written operator template using DA as the reference implementation.

That is the documentation gap this audit closes.

---

## Exact DA lifecycle

## 1. Registry layer

DA exists as a reviewed operator source-row path in the reviewed external lexicon registry layer.

Role:
- declares DA as a reviewed operator candidate / row
- carries reviewed citation / review-note posture
- provides the source material used by later promotion / runtime layers

Required future-operator lesson:
- every operator must begin with an explicit reviewed source row
- row shape and review-note posture are part of the canon

---

## 2. Promotion layer

DA has a promotion checklist path that allows production-live eligibility to be evaluated deterministically.

Role:
- defines whether reviewed metadata is still candidate-only or production-live eligible
- prevents runtime promotion before checklist closure
- separates safe metadata intake from runtime proof

Required future-operator lesson:
- reviewed metadata alone is not enough
- production-live promotion must be explicitly closed

---

## 3. Evidence validator layer

DA passes the reviewed evidence validator path needed for boundary-safe runtime projection.

Role:
- enforces reviewed evidence safety
- prevents malformed or incomplete reviewed evidence from projecting at runtime
- keeps runtime evidence constrained to allowed fields

Required future-operator lesson:
- an operator must satisfy validator conditions before runtime reviewed evidence is emitted

---

## 4. Runtime projection layer

DA projects reviewed evidence through the runtime reviewed-evidence projection layer.

Runtime truth currently visible:
- DA reviewed runtime evidence appears in live outputs
- projected DA evidence contains reviewed functional free-operator wording
- projected DA evidence preserves:
  - `historicalOriginClaim=not_claimed`
  - `winnerClaim=not_claimed`
  - `languageSuperiorityClaim=not_claimed`
  - `userDecisionPosture=user_decides`

Required future-operator lesson:
- reviewed runtime projection is a separate layer after promotion
- reviewed runtime evidence must remain boundary-safe and anti-overclaim

---

## 5. RootMap consumption layer

DA is consumed into RootMap and becomes runtime-visible for real words.

Observed live words:
- `da`
- `dam`
- `damage`
- `mode`

Observed live behavior:
- `da` surfaces DA with reviewed evidence
- `dam` surfaces DA with reviewed evidence plus weak `M` carrier
- `damage` now surfaces bounded DA due to the merged minRoots lane
- `mode` surfaces DA with reviewed evidence through the current segmentation / operator path

Required future-operator lesson:
- runtime projection alone is not enough
- an operator becomes practically live only when RootMap consumption exposes it in real outputs

---

## 6. Live smoke layer

The repo-native live smoke script currently proves DA on production-style local runtime checks.

Current DA proof words:
- `da`
- `dam`
- `damage`

Observed contract:
- reviewed DA evidence is expected to be visible for DA live proof words
- DI reviewed runtime projection remains intentionally absent
- `study` keeps DI as ordinary carrier evidence only

Required future-operator lesson:
- every live operator needs explicit live-smoke proof words
- live smoke is part of canon, not optional

---

## 7. Gate layer

DA survives full repo proof through `npm run gate:quick`.

Required future-operator lesson:
- focused tests are not enough for canon closure
- canon-grade operator work must survive full gate

---

## Canon-grade DA pieces

The following DA pieces are already canon-grade now:

| Layer | Status | Notes |
|---|---|---|
| Registry row | PASS | reviewed DA path exists |
| Promotion checklist | PASS | DA production-live path exists |
| Evidence validator | PASS | DA reviewed evidence path validates |
| Runtime projection | PASS | DA reviewed runtime evidence projects |
| RootMap consumption | PASS | DA is visible in real runtime outputs |
| Live smoke | PASS | DA proof words are covered |
| Gate proof | PASS | full quick gate passes |

---

## Remaining drift / gap list

### No critical runtime drift found

This audit did **not** find a DA runtime failure needing an engine patch.

### Remaining repo gap is documentation formalization

The remaining work is documentation / process locking:

1. one milestone doc
2. one phase-1 audit report
3. one reusable operator template doc

That is the smallest professional next lane.

---

## Exact required file set every future canon operator must implement

## Registry / source row
- `src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`

## Promotion
- `src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1.ts`

## Evidence validation
- `src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1.ts`

## Runtime projection
- `src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts`

## RootMap / runtime consumption
- `src/shared/deepRoot.rootMap.builder.v1.ts`

## Semantics / operator meaning
- `src/shared/freeOperatorProfile.v0_1.ts`
- `src/shared/freeOperatorEvidence.v0_1.ts`

## Proof layer
At minimum:
- registry / candidate tests
- promotion checklist tests
- runtime boundary tests
- runtime projection tests
- live word projection tests
- UI/runtime visibility tests where applicable

## Live proof layer
- `scripts/open-instrument/live-smoke.v0.1.mjs`

## Documentation layer
At minimum:
- milestone doc
- audit report
- operator template reference
- workflow / runbook updates when live behavior changes

---

## Smallest safe next lane after this audit

**Docs-only formalization lane**

Ship:
1. milestone doc
2. this audit report
3. DA operator template reference

Do not change:
- engine behavior
- validator logic
- promotion logic
- runtime projection logic

Those are already good enough for DA canon locking.

---

## Definition of Phase 1 done

Phase 1 is complete when:
- the milestone doc is tracked
- this audit report is tracked
- the repo has one stable written truth for DA end-to-end behavior
- the next lane can write the reusable operator template without guessing
