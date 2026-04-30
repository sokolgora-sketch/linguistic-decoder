# Front-rounded refinement cluster v0.1

This document records the current refinement interpretation for the front-rounded vowel cluster after the April 2026 retests.

It does not change the Battery registry.
It does not import refinement stats.
It protects the interpretation before further battery runs continue.

---

## Cluster summary

| Case | Original bracket | Refinement tested | Current interpretation | Weight |
|---|---|---|---|---|
| French `/ø~œ/` | `V2–V5` | `V5–V7` | High-edge front-rounded case. `V5–V7` is better than `V2–V5`, but still high-boundary uncertain. | Strong against old bracket; moderate for refinement. |
| Norwegian `/ø/` | `V2–V5` | `V1–V3` | Low-edge front-rounded case. `V1–V3` is cleaner than `V2–V5`. | Strong refinement win. |
| Danish `/ø/` | `V2–V5` | `V1–V3` | Low-edge front-rounded case. Patterns with Norwegian. | Strong refinement win. |
| Swedish `/ö/` | `V2–V5` | `V1–V3` | Weak low-edge / bridging case. `V1–V3` is cleaner, but `V2–V5` does not fully fail. | Weak-to-moderate refinement signal. |
| German `/ö/` | `V2–V5` | `V2–V4` | Middle / bridging case. `V2–V4` is clean, but `V1–V3` controls also stay intermediate. | Clean but weak control separation. |

---

## Main conclusion

The old single assumption:

```text
front-rounded mid vowels = V2–V5
```

is now too coarse.

The retests show a structured split:

```text
French     /ø~œ/ = high-edge → V5–V7 better than V2–V5
Norwegian  /ø/   = low-edge  → V1–V3 better than V2–V5
Danish     /ø/   = low-edge  → V1–V3 better than V2–V5
Swedish    /ö/   = weak low-edge / bridge → V1–V3 cleaner, V2–V5 not fully failed
German     /ö/   = middle / bridge → V2–V4 clean, weak control separation
```

The front-rounded family is therefore not one uniform bracket family. It behaves as a split cluster with high-edge, low-edge, and middle/bridge cases.

---

## French `/ø~œ/`

- Original series: `t5-fr-euoe-v2-v5-exp-v0.2`
- Refinement series: `t5-fr-euoe-v5-v7-refine-v0.1`
- Original bracket: `V2–V5`
- Refinement candidate: `V5–V7`

The repeated `V2–V5` battery produced `COLLAPSED_HIGH` on both intended runs while the `V1–V3` controls stayed `INTERMEDIATE`.

The `V5–V7` refinement moved French into `INTERMEDIATE` on both candidate runs, while the `V2–V5` controls remained `COLLAPSED_HIGH`.

Interpretation:

- French is not support for the original `V2–V5` bracket.
- French is a high-edge front-rounded case.
- `V5–V7` is the better provisional bracket.
- The result still carries high-boundary uncertainty, so it should not be overclaimed as perfectly centered.

Paper weight:

- strong evidence against simple `V2–V5` placement
- moderate positive evidence for `V5–V7` refinement
- high-edge / boundary-pressure case

---

## Norwegian `/ø/`

- Original series: `t5-no-oe-v2-v5-exp-v0.2`
- Refinement series: `t5-no-oe-v1-v3-refine-v0.1`
- Original bracket: `V2–V5`
- Refinement candidate: `V1–V3`

The Norwegian retest moved from near-collapse-low `INTERMEDIATE` behavior to `EXCEEDS_LOW` on `V2–V5`, while `V1–V3` stayed `INTERMEDIATE`.

The `V1–V3` refinement produced clean `INTERMEDIATE` candidate runs with no diagnostic flags. The `V2–V5` controls repeated `EXCEEDS_LOW` with `BOUNDARY_UNCERTAIN_LOW`.

Interpretation:

- Norwegian is not support for the original `V2–V5` bracket.
- Norwegian is a low-edge front-rounded case.
- `V1–V3` is the better provisional bracket.

Paper weight:

- strong evidence against simple `V2–V5` placement
- clean positive evidence for `V1–V3` refinement
- low-edge front-rounded case

---

## Danish `/ø/`

- Original series: `t5-da-oe-v2-v5-core-v0.2`
- Refinement series: `t5-da-oe-v1-v3-refine-v0.1`
- Original bracket: `V2–V5`
- Refinement candidate: `V1–V3`

Danish followed the same directional pattern as Norwegian. The original `V2–V5` battery showed low-edge pressure. The `V1–V3` refinement produced clean `INTERMEDIATE` candidate runs, while the `V2–V5` controls produced `EXCEEDS_LOW` with low-boundary uncertainty.

Interpretation:

- Danish is not support for the original `V2–V5` bracket.
- Danish is a low-edge front-rounded case.
- Danish strengthens the Norwegian pattern.
- `V1–V3` is the better provisional bracket.

Paper weight:

- strong evidence against simple `V2–V5` placement
- clean positive evidence for `V1–V3` refinement
- low-edge Scandinavian front-rounded case

---

## Swedish `/ö/`

- Original series: `t5-sv-oe-v2-v5-exp-v0.2`
- Refinement series: `t5-sv-oe-v1-v3-refine-v0.1`
- Original bracket: `V2–V5`
- Refinement candidate: `V1–V3`

Swedish did not fully fail under `V2–V5`. Both intended runs stayed `INTERMEDIATE`, but the main run sat close to the low boundary with `NEAR_COLLAPSE_LOW` and `BOUNDARY_UNCERTAIN_LOW`.

The `V1–V3` refinement was cleaner: both candidate runs were `INTERMEDIATE` with no flags. However, the `V2–V5` controls also remained `INTERMEDIATE`, although one repeated the low-boundary pressure.

Interpretation:

- Swedish is not strong support for the original `V2–V5` bracket.
- Swedish weakly aligns with the Danish/Norwegian low-edge pattern.
- `V1–V3` is cleaner, but `V2–V5` does not fully fail.
- Swedish should be treated as a bridge case, not a headline refinement win.

Paper weight:

- weak-to-moderate evidence against clean `V2–V5` placement
- weak-to-moderate evidence for `V1–V3` refinement
- bridge case between German and the Danish/Norwegian low-edge pair

---

## German `/ö/`

- Original series: `t5-de-oe-v2-v5-core-v0.2`
- Refinement series: `t5-de-oe-v2-v4-refine-v0.1`
- Original bracket: `V2–V5`
- Refinement candidate: `V2–V4`

German was structurally clean under the original `V2–V5` battery, but weakly discriminative because the `V1–V3` controls also stayed `INTERMEDIATE`.

The `V2–V4` refinement produced clean `INTERMEDIATE` candidate runs with no flags. The `V1–V3` controls also stayed `INTERMEDIATE` with no flags.

Interpretation:

- German is a middle / bridging front-rounded case.
- `V2–V4` is cleaner and narrower than `V2–V5`.
- Control separation remains weak.
- German should not be used as a headline falsification win.

Paper weight:

- clean archive
- clean `V2–V4` refinement
- weak control separation
- useful middle comparison case

---

## Paper-safe wording

The front-rounded battery no longer supports a single uniform `V2–V5` treatment. Instead, the refinement runs suggest a split cluster. French `/ø~œ/` pressures the high side of `V2–V5` and is better modeled by `V5–V7`, although with high-boundary uncertainty. Norwegian `/ø/` and Danish `/ø/` pressure the low side of `V2–V5` and are better modeled by `V1–V3`. Swedish `/ö/` weakly follows the low-edge pattern, but remains a bridge case because `V2–V5` does not fully fail. German `/ö/` is a middle/bridge case: `V2–V4` is clean, but nearby controls also remain intermediate. The safest conclusion is therefore not that front-rounded vowels share one bracket, but that the front-rounded family exposes a structured internal split across high-edge, low-edge, and middle cases.

---

## Registry note

The current registry still contains the older Battery labels for several front-rounded cases. This document is an interpretation note, not a registry migration.

Future registry work should decide whether to add refinement status fields before changing public case labels.
