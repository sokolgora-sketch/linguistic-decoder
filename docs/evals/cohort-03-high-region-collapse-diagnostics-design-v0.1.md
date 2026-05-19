# Cohort 03 High-Region Collapse Diagnostics Design v0.1

Status: DESIGN ONLY
Project: ZË-RO
Milestone: Cohort 03
Date recorded: 2026-05-19

This document defines proposed diagnostic labels for high-region collapse cases.

It follows:

- `docs/evals/cohort-03-high-region-anchor-review-v0.1.md`
- `docs/evals/cohort-03-high-region-audit-protocol-v0.1.md`
- `docs/evals/cohort-03-high-region-audit-design-v0.1.md`
- `docs/evals/cohort-03-high-region-hindi-i-audit-result-v0.1.md`

It does not change scoring code.
It does not change bracket rules.
It does not run evaluations.
It does not create evidence packs.
It does not update README.
It does not publish anything.
It keeps the high-region issue unresolved.

## 1. Reason for this design

The Hindi `/i` high-region audit showed:

- Arm A current-lens reproduction collapsed high in all four runs.
- Arm B function-matched target audit also collapsed high in all four runs.
- `V4-V7` controls did not stabilize either arm.
- No diagnostic flags appeared.

This means the current output is too coarse.

The current verdict `COLLAPSED_HIGH` is real, but it does not explain why the collapse happened.

This design defines proposed sub-diagnostics for future scorer work.

## 2. Problem statement

Current result shape:

- verdict: `COLLAPSED_HIGH`
- flags: often `none`

Problem:

- repeated high collapse across multiple arms and families is being reported without cause classification;
- researchers cannot distinguish high-anchor suction from bracket geometry failure or hard high-region model pressure;
- high-region support claims are frozen until diagnostics are clearer.

Needed:

- diagnostic labels that explain collapse mode without changing the underlying verdict.

## 3. Proposed diagnostic labels

### 3.1 `HIGH_ANCHOR_SUCTION`

Meaning:

The target is pulled too strongly toward the high anchor, even when the target bucket has been function-matched.

Use when:

- candidate bracket returns `COLLAPSED_HIGH`;
- control bracket also returns `COLLAPSED_HIGH`;
- high-side gap is negative in both candidate and control;
- no boundary flag explains the result;
- function-matched target audit does not stabilize the case.

Typical evidence pattern:

- Arm A: `COLLAPSED_HIGH`
- Arm B: `COLLAPSED_HIGH`
- `V4-V7` control: `COLLAPSED_HIGH`
- flags: `none`

Interpretation:

- the high anchor may be semantically overpowering the target;
- the scorer may need a separate high-anchor suction warning.

### 3.2 `HARD_HIGH_REGION_PRESSURE`

Meaning:

The target remains collapsed high across cleaned arms, wider controls, and function-matched designs.

Use when:

- multiple independent packs collapse high;
- function-matching does not stabilize;
- widening the lower anchor does not stabilize;
- no diagnostic flags explain the collapse;
- the same pressure appears across more than one language family.

Typical evidence pattern:

- Finnish `/y`, Semitic `/i`, Indo-Iranian `/i`, or audit cases repeat collapse;
- collapse remains after cleaner token-function control.

Interpretation:

- the high-region model itself may need review;
- do not treat the target as support for any high-region bracket.

### 3.3 `BRACKET_GEOMETRY_SUSPECT`

Meaning:

The candidate bracket may be too narrow, misplaced, or structurally wrong for the target.

Use when:

- `V5-V7` collapses;
- `V4-V7` also collapses or remains unstable;
- widening from `V5` to `V4` does not produce clean containment;
- the evidence does not yet prove scorer suction.

Typical evidence pattern:

- candidate and control both fail;
- no alternative bracket has been tested cleanly.

Interpretation:

- bracket geometry remains under suspicion;
- future Arm C may be needed before code changes.

### 3.4 `TARGET_FUNCTION_MISMATCH_UNLIKELY`

Meaning:

Broad target-function mixing was tested and did not explain the collapse.

Use when:

- Arm A is function-mixed and collapses;
- Arm B is function-matched and also collapses;
- the result pattern remains the same.

Typical evidence pattern:

- Hindi `/i` audit Arm A and Arm B both collapsed high.

Interpretation:

- target-function mixing is not the primary explanation under that audit;
- research should move toward scorer sensitivity, high-anchor suction, bracket geometry, or anchor contamination.

### 3.5 `HIGH_ANCHOR_CONTAMINATION_SUSPECT`

Meaning:

High-anchor tokens may contain too much target-vowel material or overlap too strongly with the target vowel.

Use when:

- high-anchor bucket contains multiple visible target-vowel tokens;
- target and high-anchor buckets share phonetic or semantic features;
- collapse remains high and no boundary flag explains it.

Typical evidence pattern:

- high anchor includes target-vowel-heavy tokens such as line/point/needle words with visible `/i`;
- collapse persists.

Interpretation:

- future audit should compare high-anchor tokens with and without target-vowel contamination.

### 3.6 `BOUNDARY_OVERPRESSURE`

Meaning:

Collapse is near a boundary and diagnostic boundary flags already indicate instability.

Use when:

- collapse or near-collapse includes boundary uncertainty flags;
- the result is not clean enough to interpret as hard suction or hard pressure.

Typical evidence pattern:

- `BOUNDARY_UNCERTAIN_HIGH`
- `BOUNDARY_UNCERTAIN_LOW`
- `NEAR_COLLAPSE_HIGH`
- `NEAR_COLLAPSE_LOW`

Interpretation:

- do not over-read the collapse;
- use existing boundary flags before assigning hard high-region pressure.

## 4. Diagnostic priority order

Future scorer diagnostics should apply in a stable order.

Recommended priority:

1. Existing boundary uncertainty flags.
2. `TARGET_FUNCTION_MISMATCH_UNLIKELY`
3. `HIGH_ANCHOR_CONTAMINATION_SUSPECT`
4. `HIGH_ANCHOR_SUCTION`
5. `BRACKET_GEOMETRY_SUSPECT`
6. `HARD_HIGH_REGION_PRESSURE`

Reason:

- boundary flags should remain primary when present;
- function-mismatch findings require audit evidence;
- contamination should be checked before calling the model hard pressure;
- hard pressure should be the most conservative label.

## 5. Non-code decision rules

This section is design-only. It describes future behavior but does not implement it.

### 5.1 When to assign `HIGH_ANCHOR_SUCTION`

Assign only if:

- target collapsed high in candidate bracket;
- target collapsed high in wider control bracket;
- high-side gaps are negative;
- no boundary flags appeared;
- function-matched audit also collapsed.

Do not assign if:

- only one run collapsed;
- boundary flags dominate;
- target-function mismatch has not been tested.

### 5.2 When to assign `HARD_HIGH_REGION_PRESSURE`

Assign only if:

- repeated high collapse appears across independent packs;
- at least one function-matched audit has failed to stabilize;
- wider controls fail to stabilize;
- high-anchor contamination has either been tested or is explicitly still unresolved.

Do not assign as proof of model failure.

### 5.3 When to assign `BRACKET_GEOMETRY_SUSPECT`

Assign if:

- candidate bracket and immediate wider control both fail;
- no successful alternative bracket exists;
- result points to bracket-width uncertainty.

This label can coexist with `HIGH_ANCHOR_SUCTION`.

### 5.4 When to assign `TARGET_FUNCTION_MISMATCH_UNLIKELY`

Assign only when:

- a function-matched audit arm exists;
- the function-matched arm still collapses;
- the prior function-mixed arm also collapses.

This label does not mean token quality is perfect.

It means broad target-function mixing is unlikely to be the primary cause.

### 5.5 When to assign `HIGH_ANCHOR_CONTAMINATION_SUSPECT`

Assign when:

- high-anchor tokens visibly contain target-vowel material;
- high-anchor and target buckets have lexical or semantic overlap;
- there has been no clean contamination-removal audit yet.

This label should trigger a future Arm C or Arm D design.

## 6. Recommended future result shape

Future score output could keep the existing verdict and add a `diagnostics` object.

Example:

```json
{
  "verdict": "COLLAPSED_HIGH",
  "flags": [],
  "diagnostics": {
    "collapseMode": "HIGH_ANCHOR_SUCTION",
    "secondary": [
      "BRACKET_GEOMETRY_SUSPECT",
      "TARGET_FUNCTION_MISMATCH_UNLIKELY"
    ],
    "diagnosticBasis": [
      "candidateCollapsedHigh",
      "widerControlCollapsedHigh",
      "functionMatchedAuditCollapsedHigh",
      "noBoundaryFlags"
    ]
  }
}

This is only a proposed shape.

No implementation is authorized by this document alone.

7. Next audit implication

Before changing scorer code, one follow-up design should be considered:

high-anchor contamination-removal audit.

Purpose:

compare high-anchor buckets with target-vowel-heavy tokens against high-anchor buckets cleaned of target-vowel-heavy tokens.

Possible future arms:

Arm C: bracket geometry audit.
Arm D: high-anchor contamination-removal audit.

No Arm C or Arm D should run without a separate design document.

8. Claim boundaries

Allowed:

A collapse diagnostics design now exists.
The current COLLAPSED_HIGH verdict needs sub-diagnosis for high-region work.
Proposed labels include HIGH_ANCHOR_SUCTION, HARD_HIGH_REGION_PRESSURE, BRACKET_GEOMETRY_SUSPECT, TARGET_FUNCTION_MISMATCH_UNLIKELY, HIGH_ANCHOR_CONTAMINATION_SUSPECT, and BOUNDARY_OVERPRESSURE.

Blocked:

Do not claim the high-region issue is solved.
Do not claim Hindi /i supports any bracket.
Do not claim V5-V7 supports high/front /i-type cases.
Do not change scoring code from this design alone.
Do not update README from this design alone.

Do not publish this as final proof.
