# Portuguese and Turkish pressure review v0.1

This document records the current paper-facing interpretation for Portuguese `/â/` and Turkish `/ı/` after fresh replication, refinement, audit, Claude-assisted audit, and wide-sweep checks.

It does not change the Battery registry.
It does not import refinement stats.
It protects the interpretation before public registry labels are migrated.

---

## Summary

| Case | Original registry reading | Fresh/review result | Current paper interpretation | Registry action |
|---|---|---|---|---|
| Portuguese `/â/` | `mixed` / `volatile`; original `V1–V4` case treated as scientifically unstable | Fresh `V1–V4` replication produced all `INTERMEDIATE`; `V2–V4` controls were weaker and near low collapse; `V1–V5` refinement worsened high-boundary pressure | `V1–V4` provisional / edge-stressed support; no longer a clean volatile failure; not strong support | Do not migrate yet; document first |
| Turkish `/ı/` | `pressure` / `strong-pressure`; old wording said `V6–V7` intended exceeded low while `V5–V7` controls collapsed high | Fresh replication, cleaner audit, Claude-assisted audit, and wide sweep all failed to stabilize; `V3–V7` and `V4–V7` also collapsed high | unresolved high-region pressure / framework-pressure case; not support for any tested bracket | Do not import as support; registry wording must be revised later |

---

## Main conclusion

Portuguese `/â/` and Turkish `/ı/` now occupy different pressure categories.

Portuguese is an edge-stressed but still usable bracket case:

```text
Portuguese /â/ = V1–V4 provisional support, boundary-uncertain, not strong
```

Turkish is a stronger challenge case:

```text
Turkish /ı/ = unresolved high-region pressure; current tested brackets do not stabilize
```

This distinction matters. Portuguese should not be over-penalized as a clean volatile failure. Turkish should not be softened into support. The paper should keep both cases visible because they show that structural archive cleanliness and theoretical success are not the same thing.

---

## Portuguese `/â/`

### Case

- caseId: `pt-aa`
- original series: `t5-pt-aa-v1-v4-core-v0.2`
- refinement series: `t5-pt-aa-v1-v5-refine-v0.1`
- original intended bracket: `V1–V4`
- original control bracket: `V2–V4`
- refinement candidate: `V1–V5`
- refinement control: `V1–V4`

### Fresh replication

A fresh four-run replication of `t5-pt-aa-v1-v4-core-v0.2` produced all `INTERMEDIATE` outcomes.

Fresh `V1–V4` intended runs:

```text
main: INTERMEDIATE · 0.613162 · BOUNDARY_UNCERTAIN_HIGH
alt:  INTERMEDIATE · 0.557734 · BOUNDARY_UNCERTAIN_LOW, BOUNDARY_UNCERTAIN_HIGH
```

`V2–V4` controls:

```text
ctrl:     INTERMEDIATE · 0.076628 · NEAR_COLLAPSE_LOW, BOUNDARY_UNCERTAIN_LOW, BOUNDARY_UNCERTAIN_HIGH
ctrl-alt: INTERMEDIATE · 0.232082 · NEAR_COLLAPSE_LOW, BOUNDARY_UNCERTAIN_LOW, BOUNDARY_UNCERTAIN_HIGH
```

The fresh replication no longer supports the harsh reading that Portuguese `/â/` is a clean volatile failure. `V1–V4` was more coherent than `V2–V4`, but still carried boundary uncertainty.

### V1–V5 refinement

Because `V1–V4` showed high-boundary stress, a refinement tested whether widening upward to `V1–V5` would improve the case.

`V1–V5` candidate runs:

```text
main: INTERMEDIATE · 0.804211 · NEAR_COLLAPSE_HIGH, BOUNDARY_UNCERTAIN_HIGH
alt:  INTERMEDIATE · 0.924188 · NEAR_COLLAPSE_HIGH, BOUNDARY_UNCERTAIN_LOW, BOUNDARY_UNCERTAIN_HIGH
```

`V1–V4` controls inside the refinement:

```text
ctrl:     INTERMEDIATE · 0.613162 · BOUNDARY_UNCERTAIN_HIGH
ctrl-alt: INTERMEDIATE · 0.532225 · BOUNDARY_UNCERTAIN_LOW, BOUNDARY_UNCERTAIN_HIGH
```

The refinement did not improve the case. `V1–V5` pushed Portuguese `/â/` closer to high collapse, while `V1–V4` stayed more centered.

### Portuguese interpretation

Portuguese `/â/` is best treated as:

```text
V1–V4 provisional / edge-stressed support
```

It should not be described as strong support, but it also should not remain framed as a clean volatile failure. The strongest current claim is that `V1–V4` is better than both `V2–V4` and `V1–V5`, while still boundary-uncertain.

### Portuguese paper weight

- structurally clean replication
- moderate evidence for `V1–V4` over `V2–V4`
- evidence against widening to `V1–V5`
- edge-stressed / boundary-uncertain case
- not headline support
- not clean volatile failure anymore

---

## Turkish `/ı/`

### Case

- caseId: `tr-ii`
- original series: `t5-tr-ii-v6-v7-core-v0.2`
- cleaner audit series: `t5-tr-ii-v6-v7-audit-v0.1`
- Claude-assisted audit series: `t5-tr-ii-v6-v7-claude-audit-v0.1`
- wide sweep series: `t5-tr-ii-wide-sweep-v0.1`
- original intended bracket: `V6–V7`
- original control bracket: `V5–V7`
- wide sweep brackets: `V4–V7`, `V3–V7`

### Fresh replication

A fresh replication of the original `V6–V7` / `V5–V7` battery did not confirm the older registry interpretation.

Fresh replication result:

```text
V6–V7 intended main: COLLAPSED_HIGH · -0.127389 · BOUNDARY_UNCERTAIN_LOW
V6–V7 intended alt:  COLLAPSED_HIGH · -0.814433
V5–V7 control main:  COLLAPSED_HIGH · -2.826087
V5–V7 control alt:   COLLAPSED_HIGH · -1.511111
```

All four runs collapsed high. The controls were more extreme, but the intended bracket also failed.

### Cleaner audit

A cleaner hand-curated audit reduced token-set noise but did not stabilize the case.

Cleaner audit result:

```text
V6–V7 candidate main: COLLAPSED_HIGH · -1.046512
V6–V7 candidate alt:  COLLAPSED_LOW · 0 · BOUNDARY_UNCERTAIN_LOW
V5–V7 controls:       COLLAPSED_HIGH / COLLAPSED_HIGH
```

This showed anchor-order instability rather than bracket support.

### Claude-assisted audit

An external Claude-assisted token-set audit also failed to stabilize Turkish `/ı/`.

Claude-assisted result:

```text
V6–V7 candidate main: COLLAPSED_HIGH · -2.033613
V6–V7 candidate alt:  COLLAPSED_HIGH · -0.126154 · BOUNDARY_UNCERTAIN_LOW
V5–V7 controls:       COLLAPSED_HIGH / COLLAPSED_HIGH
```

This reduces the chance that the Turkish failure is only a DF token-curation artifact.

### Wide sweep

A wide sweep tested whether lowering the lower anchor would rescue the case.

Wide sweep result:

```text
V4–V7 main: COLLAPSED_HIGH · 6.138889
V4–V7 alt:  COLLAPSED_HIGH · 3.754545
V3–V7 main: COLLAPSED_HIGH · 8.074074
V3–V7 alt:  COLLAPSED_HIGH · 8.469388
```

Widening downward did not rescue Turkish `/ı/`. The instability is not merely an overly narrow high bracket.

### Turkish interpretation

Turkish `/ı/` is best treated as:

```text
unresolved high-region pressure / framework-pressure case
```

It is not support for `V6–V7`, `V5–V7`, `V4–V7`, or `V3–V7`. It is evidence that the current high-region anchor model is under strain.

### Turkish paper weight

- structurally clean evidence across multiple packs
- strong pressure against the current high-region model
- not support for any tested bracket
- not a simple token-curation failure
- important falsification-pressure case
- requires model-level review before stable assignment

---

## Registry note

The current Battery registry still carries older public labels for these cases. Portuguese remains marked as `volatile`, and Turkish remains marked as `strong-pressure` with the older `V6–V7` pressure wording.

This document is not a registry migration. Future registry work should add explicit review/refinement status before changing public labels.

Do not import these review packs into registry as support without a dedicated schema decision.

---

## Paper-safe wording

Portuguese `/â/` and Turkish `/ı/` illustrate two different forms of pressure. Portuguese `/â/` is not a clean support case, but fresh replication shows that `V1–V4` is more coherent than the old volatile reading implied. Widening to `V1–V5` worsened high-boundary pressure, so Portuguese is best treated as a provisional `V1–V4` case with boundary stress. Turkish `/ı/` is stronger pressure. Fresh replication, cleaner audit, Claude-assisted audit, and wide sweep all failed to stabilize the vowel. Turkish therefore remains an unresolved high-region pressure case and should be presented as a real challenge to the current anchor model, not as confirmed bracket support.
