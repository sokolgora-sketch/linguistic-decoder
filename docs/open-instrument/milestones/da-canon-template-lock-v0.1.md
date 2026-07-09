# Open Instrument Milestone — DA Canon Template Lock v0.1

## Status
Proposed

## Purpose

Lock **DA** as the first full **canon operator template** for Open Instrument.

DA is the current reference operator because it already has a real end-to-end path across:

- reviewed source-row registry
- promotion checklist
- production-live eligibility
- runtime reviewed evidence projection
- RootMap/runtime visibility
- live smoke proof
- gate proof
- runbook / workflow coverage

This milestone exists to convert DA from “working operator” into a **reusable canonical pattern** for future operators such as:

- DI
- TER
- additional Albanian operators
- later cross-language operators

The goal is not just to inspect DA.
The goal is to lock the **operator lifecycle protocol** using DA as the reference implementation.

---

## Why this milestone matters

Without a canon template, future operator work drifts into guesswork:
- unclear file responsibilities
- unclear promotion rules
- unclear difference between metadata-safe and production-live
- unclear runtime proof requirements
- unclear test/doc obligations

DA is the first operator far enough along to define the full pattern professionally.

---

## Milestone outcome

At close, the repo should have a stable answer to all of these:

1. What files define an operator?
2. What evidence makes an operator reviewed?
3. What blocks or allows production-live promotion?
4. What runtime projection is allowed after promotion?
5. What RootMap/runtime wording is expected?
6. What tests are mandatory?
7. What live-smoke proof is mandatory?
8. What docs/runbooks must be updated?
9. How do we apply the DA template to future operators?

---

## Core principle

This milestone is **inspect-first and document-first**.

It should formalize the existing DA path.
It should not invent new behavior unless inspection proves a small correction is required.

---

## Scope

### In scope

- Audit all DA-touching files
- Confirm DA source-row → checklist → production-live → runtime projection path
- Confirm DA RootMap/runtime wording consistency
- Confirm DA live-smoke and gate proof obligations
- Write the DA operator template reference
- Write the reusable operator lifecycle / artifact map
- Create a follow-up gap matrix showing what DI lacks versus DA

### Out of scope

- DI unblock / locator closure
- new operator feature work
- telemetry doc reconciliation outside DA milestone needs
- landing / unrelated UI work
- provider execution
- broad engine redesign

---

## DA current known posture

Based on current merged state, DA already has:

- reviewed source row
- reviewed promotion checklist path
- production-live runtime eligibility
- runtime reviewed evidence projection
- RootMap live evidence visibility
- live smoke assertions
- gate proof coverage

Known words already showing DA live behavior:
- `da`
- `dam`
- `damage`
- `mode`

This milestone should verify and formalize that path.

---

## Canon model to lock

The DA canon should define these operator states:

### State A — candidate metadata only
Safe to store as reviewed metadata candidate, but not production-live.

### State B — reviewed candidate
Reviewed row exists with traceable citation metadata and review notes, but promotion checklist not yet closed.

### State C — production-live eligible
Checklist passes, validator accepts, and the row is allowed into runtime production rows.

### State D — runtime projected
Boundary-safe runtime evidence can project into output / RootMap / live API.

### State E — live-smoke locked
Repo-native live smoke and focused tests prove the runtime contract.

DA should be documented as the first fully locked example.

---

## Required artifacts every canon operator must define

This milestone should lock the professional artifact map.

### 1. Registry layer
Operator-reviewed source row:
- `src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`

### 2. Promotion layer
Promotion checklist and readiness logic:
- `src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1.ts`

### 3. Evidence gate / validation layer
Boundary-safe reviewed evidence validation:
- `src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1.ts`

### 4. Runtime projection layer
Projection from production-live rows into boundary-safe runtime evidence:
- `src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts`

### 5. RootMap / engine consumption layer
Projection into runtime-visible RootMap evidence:
- `src/shared/deepRoot.rootMap.builder.v1.ts`
- other directly consuming runtime projection points if inspection proves them

### 6. Operator semantics layer
Operator profile / free-operator behavior:
- `src/shared/freeOperatorProfile.v0_1.ts`
- `src/shared/freeOperatorEvidence.v0_1.ts`

### 7. Proof layer
Focused tests:
- registry tests
- checklist tests
- runtime boundary tests
- runtime projection tests
- live word projection tests
- UI visibility tests where relevant

### 8. Live proof layer
- `scripts/open-instrument/live-smoke.v0.1.mjs`

### 9. Documentation layer
- milestone doc
- operator template doc
- workflow / runbook references if operator changes live expectations

---

## Files to audit

### Registry / promotion / evidence
- `src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`
- `src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1.ts`
- `src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1.ts`
- `src/shared/freeOperatorProfile.v0_1.ts`
- `src/shared/freeOperatorEvidence.v0_1.ts`

### Runtime projection / RootMap
- `src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts`
- `src/shared/deepRoot.rootMap.builder.v1.ts`

### DA-focused tests
- `tests/apiAnalyzeV1.reviewedDaRuntimeProjection.liveWords.v0_1.spec.ts`
- `tests/apiAnalyzeV1.reviewedDaRuntimeProjection.wiring.v0_1.spec.ts`
- `tests/ui.instrument.daReviewedFunctionalEvidence.visibility.v0_1.spec.tsx`
- `tests/reviewedExternalLexiconSourceRowPromotionChecklist.ghegDa.v0_1.spec.ts`
- `tests/reviewedLexiconCandidateDiagnostics.audit.v0_1.spec.ts`
- `tests/protoRoots.daDialectCarriers.v1.spec.ts`
- any additional DA-specific contract tests found during audit

### Live proof / scripts / docs
- `scripts/open-instrument/live-smoke.v0.1.mjs`
- `scripts/dock-canonical-audit.v0.1.sh`
- `scripts/reviewed-lexicon-candidate-diagnostics.v0.1.mjs`
- DA-related docs under `docs/open-instrument/`

---

## Milestone phases

## Phase 1 — Audit DA end-to-end

### Goal
Produce an exact map of the DA operator lifecycle from source row to runtime proof.

### Tasks
1. Inspect all DA-touching files
2. Confirm exact reviewed source-row shape for DA
3. Confirm exact promotion checklist pass conditions for DA
4. Confirm exact evidence-gate / validator conditions DA satisfies
5. Confirm exact production-live row path for DA
6. Confirm exact runtime projection payload DA emits
7. Confirm exact RootMap wording DA surfaces
8. Confirm exact live-smoke expectations for DA
9. Confirm exact docs/runbook wording for DA
10. Identify any remaining DA drift or inconsistency

### Output
- one inspect report
- one exact DA artifact map
- one DA lifecycle diagram in markdown bullets/table form
- one drift list (if any)

### PR posture
Inspect/docs only

---

## Phase 2 — Lock the reusable DA template

### Goal
Create the professional reference doc for future operators.

### Required new doc
- `docs/open-instrument/operator-template-DA-reference-v0.1.md`

### This doc must explain
1. Required files for a new operator
2. Meaning of each file
3. Candidate → reviewed → production-live → runtime projected progression
4. Mandatory proof requirements
5. Mandatory live-smoke expectations
6. Mandatory docs/runbook updates when live behavior changes
7. Common failure modes
8. Why DI is blocked today while DA is not

### Output
A clean “how to add a new operator professionally” reference with DA as the worked example.

### PR posture
Docs only unless inspection proves a tiny wording correction is required

---

## Phase 3 — Apply the template against DI as a gap matrix

### Goal
Use DA as the canon baseline to show exactly what DI still lacks.

### Output
Create a documented gap matrix:
- what DA has
- what DI has
- what DI lacks
- which missing items are metadata-only
- which missing items block production-live promotion
- which missing items block runtime projection

### Important
This phase does **not** unblock DI.
It only formalizes the delta.

### PR posture
Docs/test-only unless a stale contract line must be synced

---

## Phase 4 — Close the milestone

### Goal
Mark the DA canon template as locked and ready for scaling.

### Close conditions
- DA artifact map documented
- DA lifecycle documented
- operator template doc exists
- DI gap matrix exists
- live smoke passes
- `gate:quick` passes
- remaining future lanes are named clearly

---

## Success criteria

- [ ] All DA-touching files audited
- [ ] DA source-row / checklist / validator / runtime path mapped exactly
- [ ] Any DA drift list written explicitly
- [ ] `docs/open-instrument/operator-template-DA-reference-v0.1.md` exists
- [ ] DA operator lifecycle documented clearly
- [ ] DI gap matrix completed against DA template
- [ ] `npm run open-instrument:live-smoke -- --skip-focused-tests` passes
- [ ] `npm run gate:quick` passes
- [ ] milestone close note written

---

## Recommended PR breakdown

### PR 1
`docs(open-instrument): audit DA canon lifecycle v0.1`

Contains:
- inspect report
- milestone doc
- no behavior changes unless tiny wording fix is proven necessary

### PR 2
`docs(open-instrument): add DA operator template reference v0.1`

Contains:
- `operator-template-DA-reference-v0.1.md`
- reusable artifact/lifecycle mapping

### PR 3
`docs(open-instrument): add DI gap matrix against DA template v0.1`

Contains:
- DI gap analysis
- milestone closeout updates

This is cleaner than mixing everything into one giant PR.

---

## Proof commands

### Focused DA proof
- `npm test -- tests/apiAnalyzeV1.reviewedDaRuntimeProjection.liveWords.v0_1.spec.ts --runInBand`
- `npm test -- tests/apiAnalyzeV1.reviewedDaRuntimeProjection.wiring.v0_1.spec.ts --runInBand`
- `npm test -- tests/ui.instrument.daReviewedFunctionalEvidence.visibility.v0_1.spec.tsx --runInBand`
- `npm test -- tests/reviewedExternalLexiconSourceRowPromotionChecklist.ghegDa.v0_1.spec.ts --runInBand`
- `npm test -- tests/reviewedLexiconCandidateDiagnostics.audit.v0_1.spec.ts --runInBand`
- `npm test -- tests/protoRoots.daDialectCarriers.v1.spec.ts --runInBand`

### Runtime / live proof
- `npm run open-instrument:live-smoke -- --skip-focused-tests`

### Strong proof
- `npm run gate:quick`

### Optional audit helpers
- `scripts/dock-canonical-audit.v0.1.sh`
- `node scripts/reviewed-lexicon-candidate-diagnostics.v0.1.mjs`

---

## Immediate next step

Run an inspect-only DA audit and write the first report.

That first report should answer:

1. Which DA pieces are already canon-grade
2. Which DA wording / docs still drift
3. Which exact file set every future operator must implement

---

## Boundary notes

- This milestone should reduce future operator work to a repeatable protocol.
- This milestone should not invent new DA behavior unless inspection proves drift.
- DI remains a separate blocker-resolution lane.
- The value here is not “DA is done.”
- The value is “future operators now have a professional template.”

---

## Definition of done

This milestone is done when a future operator lane can start from the DA template without guessing:
- required files known
- required evidence known
- promotion gate known
- runtime proof known
- live-smoke proof known
- doc obligations known

At that point DA becomes the first real scaling template for Open Instrument.
