# Cohort 03 Hindi/Arabic `/i/` Token Geometry Result v0.1

Status: inspected result summary
Scope: documentation only
Date recorded: 2026-05-20

## 1. Purpose

This document records the token-geometry inspection result after PR #1059 added the deterministic helper:

- `src/shared/evals/tokenGeometryInspection.v0.1.ts`
- `tests/evals/tokenGeometryInspection.v0.1.spec.ts`

Source design:

- `docs/evals/cohort-03-hi-ar-i-token-geometry-design-v0.1.md`

Source result:

- `docs/evals/cohort-03-i-high-front-lane-probe-result-v0.1.md`

This document does not define or execute new `/evals` runs.

## 2. Mechanism question

The active high-region mechanism question remains:

> Why does Arabic `/i/` stabilize under `V6-V7` while Hindi `/i/` remains high-collapsed?

Known split:

| Language | Prior bracket | Prior verdict | Narrow bracket | Narrow verdict |
|---|---|---|---|---|
| Hindi `/i/` | `V5-V7` | `COLLAPSED_HIGH` | `V6-V7` | `COLLAPSED_HIGH` |
| Arabic `/i/` | `V5-V7` | `COLLAPSED_HIGH` | `V6-V7` | `INTERMEDIATE` |

## 3. Inspection method

The token-geometry helper inspects bucket structure without scoring new runs.

It summarizes:

- token count;
- unique token count;
- mean/min/max token length;
- open/closed final token count;
- max consonant cluster;
- marker counts for:
  - `i`
  - `e`
  - `ee`
  - `ei`
  - `ea`
  - `ii`
- long high-front marker count;
- short `i` marker count;
- target-vs-high-anchor deltas;
- deterministic flags.

The inspected comparison is:

- Hindi target bucket vs Hindi `V6-V7` high anchor.
- Arabic target bucket vs Arabic `V6-V7` high anchor.

## 4. Hindi `/i/` token geometry

Hindi target bucket:

- `din`
- `dil`
- `sir`
- `kitab`
- `shiksha`
- `nadi`
- `pita`
- `kisan`
- `vidya`
- `mitti`

Hindi `V6-V7` high anchor:

- `jeevan`
- `geet`
- `neend`
- `cheez`
- `teer`
- `jeet`
- `peepal`
- `keeda`
- `deewar`
- `meetha`

Locked helper result:

| Metric | Hindi target | Hindi `V6-V7` high anchor |
|---|---:|---:|
| tokenCount | `10` | `10` |
| short `i` marker count | `11` | `0` |
| `ee` marker count | `0` | `10` |
| `ee` marker token count | `0` | `10` |
| highAnchorMeanTokenLengthMinusTarget | n/a | `0.7` |
| highAnchorLongHighFrontMarkersMinusTarget | n/a | `10` |

Deterministic flags:

- `HIGH_ANCHOR_HAS_MORE_LONG_HIGH_FRONT_MARKERS_THAN_TARGET`
- `HIGH_ANCHOR_HAS_FEWER_SHORT_I_MARKERS_THAN_TARGET`
- `HIGH_ANCHOR_TOKENS_LONGER_THAN_TARGET`
- `HIGH_ANCHOR_DOMINATED_BY_EE_MARKER_TOKENS`

Interpretation:

> The Hindi `V6-V7` high anchor is not a short-`i` anchor. It is dominated by long `ee`-style high-front transliteration markers and is longer than the Hindi target bucket.

## 5. Arabic `/i/` token geometry

Arabic target bucket:

- `kitab`
- `bint`
- `sikkah`
- `qalib`
- `kabir`
- `saghir`
- `jadid`
- `qadim`
- `jism`
- `ism`

Arabic `V6-V7` high anchor:

- `sifr`
- `sirr`
- `jild`
- `tin`
- `tibn`
- `dibs`
- `simt`
- `rijl`
- `hibr`
- `liman`

Locked helper result:

| Metric | Arabic target | Arabic `V6-V7` high anchor |
|---|---:|---:|
| tokenCount | `10` | `10` |
| short `i` marker count | `10` | `10` |
| `ee` marker count | `0` | `0` |
| `ee` marker token count | `0` | `0` |
| highAnchorMeanTokenLengthMinusTarget | n/a | `-0.8` |
| highAnchorLongHighFrontMarkersMinusTarget | n/a | `0` |

Deterministic flags:

- `HIGH_ANCHOR_ALL_TOKENS_HAVE_SHORT_I_MARKER`

Absent flags:

- `HIGH_ANCHOR_HAS_MORE_LONG_HIGH_FRONT_MARKERS_THAN_TARGET`
- `HIGH_ANCHOR_TOKENS_LONGER_THAN_TARGET`

Interpretation:

> The Arabic `V6-V7` high anchor is a short-`i` anchor. It is not dominated by long `ee`-style markers and is shorter than the Arabic target bucket on average.

## 6. Direct comparison

| Feature | Hindi `V6-V7` high anchor | Arabic `V6-V7` high anchor |
|---|---:|---:|
| short `i` marker count | `0` | `10` |
| `ee` marker count | `10` | `0` |
| `ee` marker token count | `10` | `0` |
| mean length delta vs target | `+0.7` | `-0.8` |
| long high-front marker delta vs target | `+10` | `0` |
| dominant marker pattern | long `ee` | short `i` |

Main structural finding:

> Hindi and Arabic were not tested against equivalent high-anchor geometry under `V6-V7`.

## 7. Mechanism interpretation

The token-geometry inspection identifies a concrete structural difference that can explain why the same nominal bracket change behaved differently.

Hindi:

- high anchor is dominated by long `ee` markers;
- high anchor has fewer short `i` markers than the target;
- high anchor tokens are longer than the target bucket;
- Hindi remained high-collapsed and became more extreme under `V6-V7`.

Arabic:

- high anchor is dominated by short `i` markers;
- high anchor does not introduce long `ee` pressure;
- high anchor tokens are shorter than the target bucket;
- Arabic stabilized under `V6-V7`.

Interpretation:

> The Hindi failure may be partly driven by high-anchor token geometry, especially long high-front transliteration pressure, rather than by `/i/` alone.

This is mechanism evidence, not bracket support.

## 8. What this result does and does not prove

This result supports:

- The Hindi/Arabic split has a concrete token-geometry difference.
- Hindi `V6-V7` high anchor is structurally more long-high-front than Arabic `V6-V7`.
- A small follow-up run is justified if it directly tests this confound.

This result does not prove:

- `V6-V7` solves `/i/`.
- Any support claim for Arabic `/i/` under `V6-V7`.
- Any model-falsification claim from Hindi `/i/` alone.
- Any solved-model claim.
- The scorer should be changed.
- Anchor doctrine should be changed.
- Publication is justified.

## 9. Decision

A follow-up run is justified, but only a narrow one.

Recommended follow-up design:

> Hindi `/i/` short-`i` versus long-`ee` high-anchor control.

Purpose:

> Test whether Hindi `/i/` collapse under `V6-V7` is sensitive to long `ee` high-anchor geometry.

This should be designed as a small controlled probe, not a broad language battery.

## 10. Claim boundaries

Allowed:

- The helper found a structural difference between Hindi and Arabic `V6-V7` high anchors.
- Hindi high anchor is long-`ee` dominated.
- Arabic high anchor is short-`i` dominated.
- This difference may explain the Hindi/Arabic split.
- A narrow follow-up design is justified.

Blocked:

- Do not claim the confound is proven.
- Do not claim Hindi collapse is explained fully.
- Do not claim Arabic stabilization is support.
- Do not claim `V6-V7` solves `/i/`.
- Do not change scoring.
- Do not change anchors.
- Do not publish from this result alone.
