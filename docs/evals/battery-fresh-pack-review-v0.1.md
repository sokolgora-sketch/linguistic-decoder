# Battery fresh-pack review v0.1

This document records fresh Battery evidence packs that contain `runs/<runId>/report.json` artifacts but should not all be imported blindly.

The purpose is to separate two questions:

- Is the ZIP structurally import-ready?
- Does the fresh result still support the current registry interpretation?

A pack can be structurally valid and still require interpretation review.

---

## Review summary

| Case | Series | Fresh pack status | Review status | Reason | Registry action |
|---|---|---|---|---|---|
| German ö | `t5-de-oe-v2-v5-core-v0.2` | `runCount: 4` | imported | Intended and control brackets both stayed `INTERMEDIATE`; no flags; matches weak-support interpretation. | Imported in PR #927. |
| French /ø~œ/ | `t5-fr-euoe-v2-v5-exp-v0.2` | `runCount: 4` | review-required | Intended V2-V5 runs collapsed high while control V1-V3 runs stayed intermediate. | Do not import until interpretation is revised. |
| Norwegian ø | `t5-no-oe-v2-v5-exp-v0.2` | `runCount: 4` | review-required | Intended V2-V5 runs are intermediate but flagged near low collapse; controls are cleaner. | Do not import until interpretation is revised. |
| Danish ø | `t5-da-oe-v2-v5-core-v0.2` | `runCount: 4` | review-required | Intended V2-V5 runs are intermediate but flagged near low collapse; controls are cleaner. | Do not import until interpretation is revised. |

---

## German ö — imported as weak support

- caseId: `de-oe`
- seriesLabel: `t5-de-oe-v2-v5-core-v0.2`
- fresh ZIP: `evals.series-evidence-pack.t5-de-oe-v2-v5-core-v0.2.v0.1 (1).zip`
- registry ZIP: `evals.series-evidence-pack.t5-de-oe-v2-v5-core-v0.2.v0.1.zip`
- action: imported in PR #927

Run index summary:

```text
V2-V5 intended main: INTERMEDIATE, normalizedPosition 0.465517, flags none
V2-V5 intended alt:  INTERMEDIATE, normalizedPosition 0.293814, flags none
V1-V3 control main:  INTERMEDIATE, normalizedPosition 0.413437, flags none
V1-V3 control alt:   INTERMEDIATE, normalizedPosition 0.263294, flags none
```

Decision:

- Safe to import because it matches the existing weak-support interpretation.
- Not upgraded to strong support because wrong-bracket controls also stayed intermediate.

---

## French /ø~œ/ — review-required

- caseId: `fr-euoe`
- seriesLabel: `t5-fr-euoe-v2-v5-exp-v0.2`
- fresh ZIP: `evals.series-evidence-pack.t5-fr-euoe-v2-v5-exp-v0.2.v0.1 (1).zip`
- action: not imported

Run index summary:

```text
V2-V5 intended main: COLLAPSED_HIGH, normalizedPosition 1.618182, gap_high -0.075556
V2-V5 intended alt:  COLLAPSED_HIGH, normalizedPosition 1.543478, gap_high -0.055556
V1-V3 control main:  INTERMEDIATE, normalizedPosition 0.67903, flags none
V1-V3 control alt:   INTERMEDIATE, normalizedPosition 0.56016, flags none
```

Decision:

- Structurally import-ready, but not safe to import under the current `support / strong` interpretation.
- Fresh evidence suggests an overshoot/high-collapse behavior in the intended V2-V5 bracket.
- Needs interpretation review before registry stats import.

---

## Norwegian ø — review-required

- caseId: `no-oe`
- seriesLabel: `t5-no-oe-v2-v5-exp-v0.2`
- fresh ZIP: `evals.series-evidence-pack.t5-no-oe-v2-v5-exp-v0.2.v0.1 (1).zip`
- action: not imported

Run index summary:

```text
V2-V5 intended main: INTERMEDIATE, normalizedPosition 0.077551, flags NEAR_COLLAPSE_LOW, BOUNDARY_UNCERTAIN_LOW
V2-V5 intended alt:  INTERMEDIATE, normalizedPosition 0.086726, flags NEAR_COLLAPSE_LOW, BOUNDARY_UNCERTAIN_LOW
V1-V3 control main:  INTERMEDIATE, normalizedPosition 0.222494, flags none
V1-V3 control alt:   INTERMEDIATE, normalizedPosition 0.198789, flags none
```

Decision:

- Structurally import-ready, but intended runs are boundary-uncertain and near low collapse.
- Controls are cleaner than intended runs.
- Needs interpretation review before registry stats import.

---

## Danish ø — review-required

- caseId: `da-oe`
- seriesLabel: `t5-da-oe-v2-v5-core-v0.2`
- fresh ZIP: `evals.series-evidence-pack.t5-da-oe-v2-v5-core-v0.2.v0.1 (1).zip`
- action: not imported

Run index summary:

```text
V2-V5 intended main: INTERMEDIATE, normalizedPosition 0.089286, flags NEAR_COLLAPSE_LOW, BOUNDARY_UNCERTAIN_LOW
V2-V5 intended alt:  INTERMEDIATE, normalizedPosition 0.069401, flags NEAR_COLLAPSE_LOW, BOUNDARY_UNCERTAIN_LOW
V1-V3 control main:  INTERMEDIATE, normalizedPosition 0.240113, flags none
V1-V3 control alt:   INTERMEDIATE, normalizedPosition 0.103448, flags none
```

Decision:

- Structurally import-ready, but intended runs are boundary-uncertain and near low collapse.
- Controls are cleaner than intended runs.
- Needs interpretation review before registry stats import.

---

## Rule going forward

Do not import a fresh pack only because `runCount: 4` exists.

Import only when:

- all four runs have `report.json` artifacts,
- the intended/control behavior matches the registry interpretation,
- diagnostic flags are compatible with the claimed strength,
- and the manifest/review note explains the decision.

---

## Follow-up refinement note

Front-rounded follow-up refinements are summarized in `docs/evals/front-rounded-refinement-cluster-v0.1.md`.

This follow-up note supersedes the older simple `V2–V5` reading for French, Norwegian, Danish, Swedish, and German in paper-writing contexts, but it does not change registry values.
