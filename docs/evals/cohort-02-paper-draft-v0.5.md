# Seven-Primal-Vowel Bracket Testing: Cohort 02 Support and Pressure Cases Across Six Languages

Author: Sokol Gora
Project: ZË-RO
Version: v0.5
Date: 2026-05-09
Document type: Technical report / preprint candidate

## Abstract

This paper reports Cohort 02 of the ZË-RO Seven-Primal-Vowel bracket-testing program. Cohort 02 extends prior vowel-bracket battery work by testing six language/vowel cases under researcher-reviewed scoring: Norwegian `/ø/`, Danish `/ø/`, French `/ø~œ/`, Portuguese `/â/`, Turkish `/ı/`, and Romanian `/ă/`.

The purpose of Cohort 02 is not to claim that every tested case supports the framework. The purpose is to separate support cases from edge-stressed and pressure cases under a documented candidate/control workflow.

French `/ø~œ/` is the strongest current support case: V5-V7 candidate runs remained intermediate while V2-V5 controls collapsed high. Norwegian `/ø/` and Danish `/ø/` provide cautious V1-V3 support: their candidate runs were cleaner than controls, but controls did not fully collapse. Portuguese `/â/` replicated V1-V5 improvement over V1-V4 controls but remains edge-stressed. Turkish `/ı/` improved under V4-V7 compared with V5-V7 but remains pressure-audit rather than settled support. Romanian `/ă/` remains unresolved central-vowel pressure and is not treated as support.

Cohort 02 therefore provides a disciplined classification layer: support, edge-stressed improvement, pressure-audit improvement, and unresolved pressure are kept separate.

Keywords: ZË-RO; Seven-Primal-Vowel; vowel bracket testing; phonology; reproducibility; evaluation archive; Norwegian; Danish; French; Portuguese; Turkish; Romanian

Publication status: Zenodo DOI reserved for the evidence archive; not submitted to LingBuzz; no README public link; no registry migration.

Evidence archive DOI: https://doi.org/10.5281/zenodo.20116021

All-versions DOI: https://doi.org/10.5281/zenodo.20116020

## 1. Introduction

The ZË-RO bracket-testing program tests whether target vowel groups are better contained by specific Seven-Primal-Vowel bracket intervals. The method compares candidate brackets against control brackets using repeated candidate/control runs and evidence-pack export.

Cohort 01 established a broader battery across ten languages. Cohort 02 narrows the scope and focuses on researcher-reviewed cases that clarify support and pressure boundaries. The central question is not whether all vowels fit cleanly. The question is whether the battery can distinguish cleaner support from boundary stress and unresolved pressure.

Cohort 02 is deliberately conservative. It treats pressure cases as evidence rather than as failures to hide. It also blocks overclaiming: no single case proves the full framework, and no edge-stressed or unresolved case is promoted into headline support.

### 1.1 Relationship to Cohort 01

Cohort 02 should be read as a follow-up evidence layer, not a replacement for Cohort 01.

The six Cohort 02 cases revisit vowel zones already visible in the Cohort 01 work:

- Norwegian `/ø/`
- Danish `/ø/`
- French `/ø~œ/`
- Portuguese `/â/`
- Turkish `/ı/`
- Romanian `/ă/`

Cohort 02 confirms, refines, or pressures Cohort 01 in different ways:

- French `/ø~œ/` strengthens the high-edge front-rounded case because V5-V7 candidates remain intermediate while V2-V5 controls collapse high.
- Norwegian `/ø/` and Danish `/ø/` remain supportive of the low-edge front-rounded direction, but Cohort 02 frames them as cautious because V2-V5 controls remain intermediate with weaker margins.
- Portuguese `/â/` updates the earlier V1-V4 framing: the corrected and replicated Cohort 02 evidence favors V1-V5 over V1-V4, while preserving high-edge caution.
- Turkish `/ı/` improves under V4-V7 compared with V5-V7, but remains pressure-audit rather than settled support.
- Romanian `/ă/` remains unresolved and is not treated as support for any tested bracket.

What changes in Cohort 02 is not the overall research question. What changes is the discipline of the evidence workflow:

1. narrower six-language scope;
2. researcher-reviewed series;
3. explicit candidate/control framing;
4. corrected Portuguese replication after excluding an invalid export;
5. explicit pressure notes for Turkish and Romanian;
6. public claim boundaries before publication.

Cohort 02 therefore strengthens the research program by clarifying which cases behave as support, which cases behave as edge-stressed improvements, and which cases remain pressure.

---

## 2. Cohort scope

Cohort 02 covers six language/vowel cases.

| Language | Vowel | Current classification |
|---|---|---|
| Norwegian | `/ø/` | V1-V3 cleaner provisional support |
| Danish | `/ø/` | V1-V3 cleaner provisional support |
| French | `/ø~œ/` | V5-V7 cleaner high-edge support |
| Portuguese | `/â/` | replicated V1-V5 redesign improvement, still edge-stressed |
| Turkish | `/ı/` | V4-V7 improvement, pressure-audit retained |
| Romanian | `/ă/` | unresolved central-vowel pressure |

Out of scope:

- no new scoring in this paper draft;
- no new token curation;
- no registry migration;
- no Cohort 01 rewrite;
- no Zenodo upload;
- no LingBuzz submission;
- no README public link.

---

## 3. Method

### 3.1 Seven-Primal-Vowel aperture proxy

The scoring workflow uses ordinal Seven-Primal-Vowel aperture proxy values.

| Voice | Proxy value |
|---|---:|
| A | 1.0 |
| O | 0.8 |
| E | 0.6 |
| Ë | 0.5 |
| U | 0.4 |
| Y | 0.3 |
| I | 0.1 |

These values are ordinal positions inside the ZË-RO testing framework. They are not acoustic measurements. They are derived from the fixed Seven-Primal-Vowel ordinal ladder used in earlier ZË-RO batteries and are kept unchanged here for comparability across cohorts. They are used to test whether target vowel token sets behave as intermediate between selected low and high anchors.

### 3.2 Task type

All listed evidence belongs to the intermediate-vowel bracket-testing workflow:

- task: `T5_INTERMEDIATE_V0_1`
- input shape: `intermediate_triple`

Each run compares:

- `anchor_low`
- `x_vowel`
- `anchor_high`

### 3.3 Four-run candidate/control structure

Each series uses a four-run structure:

1. candidate main;
2. candidate alt;
3. control main;
4. control alt.

The intent is to compare candidate stability against control behavior, rather than accepting a single run as evidence.

### 3.4 Metadata convention

The researcher-reviewed Cohort 02 runs use:

- provider: `openai`
- model: `chatgpt-assisted-researcher-reviewed`
- sourceEngine fields: blank where buckets were generated/reviewed externally rather than exported from an upstream ZË-RO engine.

### 3.5 Evidence-pack handling

Each series was exported as a series evidence pack. Evidence packs were locally archived, inspected, and later included in a Cohort 02 archive candidate.

The public archive ZIP is treated as release metadata, not as a fixed value inside the paper text. This avoids a self-reference problem: the archive contains the paper PDF, so changing the paper changes the archive checksum. The final top-level archive SHA256 must therefore be recorded in the archive metadata, Zenodo record, and repo-tracked archive-build result after the final PDF is generated.

The archive is expected to include:

- the final paper PDF;
- the paper Markdown source;
- series evidence packs;
- checksum files;
- reproduction notes;
- repo-tracked curation, summary, pressure, and publication-readiness documents.

### 3.6 Interpretation rules

Interpretation follows these constraints:

- support requires candidate stability and meaningful control separation;
- intermediate verdicts near boundaries are weaker than clean intermediate runs;
- edge-stressed improvement is not headline support;
- pressure-audit cases are not settled support;
- unresolved pressure cases must remain visible;
- failed or pressured controls are part of the evidence;
- public claims must be weaker than internal enthusiasm.

### 3.7 Falsification and pressure criteria

The framework treats the following as pressure or falsification signals:

1. **Out-of-range target behavior**
   - The target vowel repeatedly falls outside the proposed bracket.

2. **Wrong-bracket equivalence**
   - A control bracket performs as well as, or better than, the intended candidate bracket.

3. **Control collapse without candidate stability**
   - Controls fail, but candidate runs also fail or remain boundary-stressed.

4. **Cross-run instability**
   - Main and alt runs disagree in a way that prevents stable classification.

5. **Indistinguishable phonemic contrast**
   - The workflow cannot distinguish a phonemic pair that should be separated under the model.

6. **Cross-model divergence**
   - Future external scoring models produce materially different classifications from the same token sets.

Romanian `/ă/` is kept as unresolved because it triggers cross-run and bracket-instability pressure. Turkish `/ı/` is kept as pressure-audit because it improves under V4-V7 but is not settled.

### 3.8 Scoring mechanics

The `T5_INTERMEDIATE_V0_1` label is a task identifier for the intermediate-vowel bracket test. It is not a claim that a T5 language model computes the scores.

The scoring step is deterministic. The evaluator receives already-curated orthographic token buckets:

- `anchor_low`
- `x_vowel`
- `anchor_high`

The evaluator does not call an external model during scoring. It extracts Seven-Primal-Vowel voices from each orthographic token using the shared orthography extractor, then maps extracted voices to fixed aperture proxy values:

| Voice | Aperture proxy |
|---|---:|
| A | 1.0 |
| O | 0.8 |
| E | 0.6 |
| Ë | 0.5 |
| U | 0.4 |
| Y | 0.3 |
| I | 0.1 |

For each bucket, the scorer computes a bucket mean using `aperturePresenceMean`.

The report then defines:

`mean_anchor_low = mean(anchor_low)`

`mean_x_vowel = mean(x_vowel)`

`mean_anchor_high = mean(anchor_high)`

The gap formulas are:

`gap_low = mean_anchor_low - mean_x_vowel`

`gap_high = mean_x_vowel - mean_anchor_high`

The normalized position formula is:

`normalizedPosition = gap_low / (gap_low + gap_high)`

Because `gap_low + gap_high = mean_anchor_low - mean_anchor_high`, this is equivalent to:

`normalizedPosition = gap_low / (mean_anchor_low - mean_anchor_high)`

when the denominator is finite and non-zero.

Interpretation of the normalized axis:

- `0.0` means the target bucket has collapsed to the lower/open anchor.
- `0.5` means the target bucket sits halfway between the two anchors.
- `1.0` means the target bucket has collapsed to the higher/closed anchor.
- values below `0.0` indicate the target exceeds the lower/open side.
- values above `1.0` indicate the target exceeds or collapses past the higher/closed side.

The verdict rule is:

- if `mean_x_vowel > mean_anchor_low`, verdict is `EXCEEDS_LOW`;
- else if `mean_x_vowel <= mean_anchor_high`, verdict is `COLLAPSED_HIGH`;
- else verdict is `INTERMEDIATE`.

The implementation also contains an exact-equality low-collapse edge branch, but ordinary reported low-side failure appears as `EXCEEDS_LOW`.

Diagnostic flags are added after the verdict:

- `NEAR_COLLAPSE_LOW` when an `INTERMEDIATE` result has `gap_low < 0.05`;
- `NEAR_COLLAPSE_HIGH` when an `INTERMEDIATE` result has `gap_high < 0.05`;
- `BOUNDARY_UNCERTAIN_LOW` when `abs(gap_low) <= 0.041` or the low bootstrap confidence interval spans zero;
- `BOUNDARY_UNCERTAIN_HIGH` when `abs(gap_high) <= 0.041` or the high bootstrap confidence interval spans zero.

Example using Norwegian `/ø/` r01:

`mean_anchor_low = 1.000000`

`mean_x_vowel = 0.752222`

`mean_anchor_high = 0.216667`

`gap_low = 1.000000 - 0.752222 = 0.247778`

`gap_high = 0.752222 - 0.216667 = 0.535555`

`normalizedPosition = 0.247778 / (1.000000 - 0.216667) = 0.316312`

This is why Norwegian `/ø/` r01 is reported as `INTERMEDIATE`: the target mean sits between the low/open and high/closed anchors.

---

## 4. Evidence inventory

| Case | Candidate bracket | Control bracket | Series |
|---|---|---|---|
| Norwegian `/ø/` | V1-V3 | V2-V5 | `t5-no-oe-v1-v3-researcher-v0.1` |
| Danish `/ø/` | V1-V3 | V2-V5 | `t5-da-oe-v1-v3-researcher-v0.1` |
| French `/ø~œ/` | V5-V7 | V2-V5 | `t5-fr-euoe-v5-v7-researcher-v0.1` |
| Portuguese `/â/` original | V1-V4 | V2-V4 | `t5-pt-aa-v1-v4-researcher-v0.1` |
| Romanian `/ă/` v0.1 | V3-V4 | V2-V4 | `t5-ro-a-breve-v3-v4-researcher-v0.1` |
| Turkish `/ı/` | V4-V7 | V5-V7 | `t5-tr-ii-v4-v7-researcher-v0.1` |
| Romanian `/ă/` v0.2 | V2-V5 | V3-V4 | `t5-ro-a-breve-v2-v5-researcher-v0.2` |
| Portuguese `/â/` v0.2 | V1-V5 | V1-V4 | `t5-pt-aa-v1-v5-researcher-v0.2` |
| Portuguese `/â/` replication | V1-V5 | V1-V4 | `t5-pt-aa-v1-v5-researcher-replication-v0.2` |

The invalid Portuguese replication v0.1 export is excluded from final evidence because r02 was accidentally scored with `anchorHigh: V4` while the run ID claimed V1-V5.

---

## 5. Numerical results

### 5.1 Case-level summary

The case-level summary is written as short case notes rather than a wide table so that the PDF does not merge columns or hide interpretation details.

**Norwegian `/ø/`**

- Candidate: V1-V3 returned INTERMEDIATE in both runs.
- Control: V2-V5 also returned INTERMEDIATE in both runs, but with weaker lower margins.
- Interpretation: cleaner provisional support, quantitative rather than categorical.

**Danish `/ø/`**

- Candidate: V1-V3 returned INTERMEDIATE in both runs.
- Control: V2-V5 also returned INTERMEDIATE in both runs, but with weaker lower margins.
- Interpretation: cleaner provisional support, quantitative rather than categorical.

**French `/ø~œ/`**

- Candidate: V5-V7 returned INTERMEDIATE in both runs.
- Control: V2-V5 returned COLLAPSED_HIGH in both runs.
- Interpretation: strongest Cohort 02 support case.

**Portuguese `/â/`**

- Candidate: corrected and replicated V1-V5 runs returned INTERMEDIATE.
- Control: V1-V4 controls collapsed high in the corrected comparison and replication.
- Interpretation: replicated edge-stressed improvement, not headline support.

**Turkish `/ı/`**

- Candidate: V4-V7 returned INTERMEDIATE in both runs.
- Control: V5-V7 remained pressured, including one EXCEEDS_LOW run.
- Interpretation: pressure-audit / partial improvement, not settled support.

**Romanian `/ă/`**

- Candidate/control pattern: split or failing under V2-V5 and V3-V4.
- Control behavior: controls also failed or remained unstable.
- Interpretation: unresolved central-vowel pressure; no tested bracket contains Romanian `/ă/` cleanly.

### 5.2 Run-level numerical table

| Case | Run | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---|---|---|---:|---:|---:|---|
| Norwegian `/ø/` | r01 | V1-V3 | INTERMEDIATE | 0.316312 | 0.247778 | 0.535556 | none |
| Norwegian `/ø/` | r02 | V1-V3 | INTERMEDIATE | 0.357333 | 0.297778 | 0.535556 | none |
| Norwegian `/ø/` | r03 | V2-V5 | INTERMEDIATE | 0.221289 | 0.087778 | 0.308889 | none |
| Norwegian `/ø/` | r04 | V2-V5 | INTERMEDIATE | 0.294032 | 0.112222 | 0.269444 | none |
| Danish `/ø/` | r01 | V1-V3 | INTERMEDIATE | 0.286334 | 0.220000 | 0.548333 | none |
| Danish `/ø/` | r02 | V1-V3 | INTERMEDIATE | 0.325820 | 0.265000 | 0.548333 | none |
| Danish `/ø/` | r03 | V2-V5 | INTERMEDIATE | 0.209402 | 0.081667 | 0.308333 | none |
| Danish `/ø/` | r04 | V2-V5 | INTERMEDIATE | 0.270742 | 0.103333 | 0.278333 | none |
| French `/ø~œ/` | r01 | V5-V7 | INTERMEDIATE | 0.315371 | 0.099167 | 0.215278 | none |
| French `/ø~œ/` | r02 | V5-V7 | INTERMEDIATE | 0.238625 | 0.065556 | 0.209167 | none |
| French `/ø~œ/` | r03 | V2-V5 | COLLAPSED_HIGH | 2.081818 | 0.190833 | -0.099167 | none |
| French `/ø~œ/` | r04 | V2-V5 | COLLAPSED_HIGH | 1.621670 | 0.253611 | -0.097222 | none |
| Portuguese `/â/` original | r01 | V1-V4 | COLLAPSED_HIGH | 1.265217 | 0.161667 | -0.033889 | BOUNDARY_UNCERTAIN_HIGH |
| Portuguese `/â/` original | r02 | V1-V4 | COLLAPSED_HIGH | 1.097166 | 0.301111 | -0.026667 | BOUNDARY_UNCERTAIN_HIGH |
| Portuguese `/â/` original | r03 | V2-V4 | EXCEEDS_LOW | 0.786340 | -0.124722 | -0.033889 | BOUNDARY_UNCERTAIN_HIGH |
| Portuguese `/â/` original | r04 | V2-V4 | EXCEEDS_LOW | 0.014706 | -0.001667 | -0.111667 | BOUNDARY_UNCERTAIN_LOW |
| Turkish `/ı/` | r01 | V4-V7 | INTERMEDIATE | 0.614663 | 0.400556 | 0.251111 | none |
| Turkish `/ı/` | r02 | V4-V7 | INTERMEDIATE | 0.474286 | 0.276667 | 0.306667 | none |
| Turkish `/ı/` | r03 | V5-V7 | INTERMEDIATE | 0.192982 | 0.055000 | 0.230000 | BOUNDARY_UNCERTAIN_LOW |
| Turkish `/ı/` | r04 | V5-V7 | EXCEEDS_LOW | -0.063380 | -0.015000 | 0.251667 | BOUNDARY_UNCERTAIN_LOW |
| Romanian `/ă/` v0.1 | r01 | V3-V4 | EXCEEDS_LOW | -4.256410 | -0.276667 | 0.341667 | none |
| Romanian `/ă/` v0.1 | r02 | V3-V4 | EXCEEDS_LOW | 1.483283 | -0.271111 | 0.088333 | none |
| Romanian `/ă/` v0.1 | r03 | V2-V4 | EXCEEDS_LOW | -2.382979 | -0.062222 | 0.088333 | BOUNDARY_UNCERTAIN_LOW |
| Romanian `/ă/` v0.1 | r04 | V2-V4 | COLLAPSED_HIGH | 1.360577 | 0.078611 | -0.020833 | BOUNDARY_UNCERTAIN_LOW, BOUNDARY_UNCERTAIN_HIGH |
| Romanian `/ă/` v0.2 | r01 | V2-V5 | EXCEEDS_LOW | -0.288566 | -0.088333 | 0.394444 | none |
| Romanian `/ă/` v0.2 | r02 | V2-V5 | INTERMEDIATE | 0.107258 | 0.036944 | 0.307500 | NEAR_COLLAPSE_LOW, BOUNDARY_UNCERTAIN_LOW |
| Romanian `/ă/` v0.2 | r03 | V3-V4 | EXCEEDS_LOW | 1.483283 | -0.271111 | 0.088333 | none |
| Romanian `/ă/` v0.2 | r04 | V3-V4 | EXCEEDS_LOW | 0.960256 | -0.208056 | -0.008611 | BOUNDARY_UNCERTAIN_HIGH |
| Portuguese `/â/` v0.2 | r01 | V1-V5 | INTERMEDIATE | 0.624464 | 0.161667 | 0.097222 | none |
| Portuguese `/â/` v0.2 | r02 | V1-V5 | INTERMEDIATE | 0.856083 | 0.320556 | 0.053889 | none |
| Portuguese `/â/` v0.2 | r03 | V1-V4 | COLLAPSED_HIGH | 1.265217 | 0.161667 | -0.033889 | BOUNDARY_UNCERTAIN_HIGH |
| Portuguese `/â/` v0.2 | r04 | V1-V4 | COLLAPSED_HIGH | 1.576503 | 0.320556 | -0.117222 | none |
| Portuguese `/â/` replication | r01 | V1-V5 | INTERMEDIATE | 0.753676 | 0.284722 | 0.093056 | none |
| Portuguese `/â/` replication | r02 | V1-V5 | INTERMEDIATE | 0.875000 | 0.330556 | 0.047222 | NEAR_COLLAPSE_HIGH, BOUNDARY_UNCERTAIN_HIGH |
| Portuguese `/â/` replication | r03 | V1-V4 | COLLAPSED_HIGH | 1.154279 | 0.284722 | -0.038056 | BOUNDARY_UNCERTAIN_HIGH |
| Portuguese `/â/` replication | r04 | V1-V4 | COLLAPSED_HIGH | 1.599462 | 0.330556 | -0.123889 | none |

---

## 6. Support cases

### 6.1 French `/ø~œ/`

French `/ø~œ/` is the strongest current Cohort 02 support case.

The V5-V7 candidate runs returned clean INTERMEDIATE verdicts:

- r01: normalizedPosition 0.315371, gap_low 0.099167, gap_high 0.215278, no flags;
- r02: normalizedPosition 0.238625, gap_low 0.065556, gap_high 0.209167, no flags.

The V2-V5 controls both collapsed high:

- r03: normalizedPosition 2.081818, gap_high -0.099167;
- r04: normalizedPosition 1.621670, gap_high -0.097222.

This is the cleanest candidate/control separation in Cohort 02. The target remains inside the intended V5-V7 bracket while controls overshoot high.

Paper-safe interpretation:

- French `/ø~œ/` supports V5-V7 as a cleaner high-edge bracket than V2-V5.
- French should not be framed as proving the full framework alone.
- French is the strongest support case in Cohort 02, not proof of the entire model.

### 6.2 Norwegian `/ø/`

Norwegian `/ø/` supports V1-V3 cautiously.

The V1-V3 candidate runs returned INTERMEDIATE:

- r01: normalizedPosition 0.316312, gap_low 0.247778, gap_high 0.535556;
- r02: normalizedPosition 0.357333, gap_low 0.297778, gap_high 0.535556.

The V2-V5 controls also returned INTERMEDIATE, but with weaker lower margins:

- r03: gap_low 0.087778;
- r04: gap_low 0.112222.

The separation is therefore quantitative, not categorical: the V2-V5 controls do not collapse, but their lower margins are roughly one-third of the V1-V3 candidate lower margins.

Paper-safe interpretation:

- Norwegian `/ø/` provides cleaner provisional support for V1-V3.
- The result is not an absolute falsification of V2-V5.
- It should be presented as cautious support.

### 6.3 Danish `/ø/`

Danish `/ø/` parallels Norwegian.

The V1-V3 candidate runs returned INTERMEDIATE:

- r01: normalizedPosition 0.286334, gap_low 0.220000, gap_high 0.548333;
- r02: normalizedPosition 0.325820, gap_low 0.265000, gap_high 0.548333.

The V2-V5 controls also returned INTERMEDIATE but with weaker lower margins:

- r03: gap_low 0.081667;
- r04: gap_low 0.103333.

The separation is therefore quantitative, not categorical: the V2-V5 controls do not collapse, but their lower margins are much smaller than the V1-V3 candidate lower margins.

Paper-safe interpretation:

- Danish `/ø/` supports the low-edge front-rounded direction.
- Danish strengthens the Norwegian pattern.
- Danish should not be overclaimed as decisive proof.

---

## 7. Edge-stressed improvement case

### Portuguese `/â/`

Portuguese `/â/` changed status during Cohort 02.

The original V1-V4 researcher series is retained as a historical baseline: it did not support V1-V4 cleanly because both V1-V4 candidate runs collapsed high and V2-V4 controls exceeded low. A later V1-V5 redesign improved the case, and a corrected second V1-V5 replication confirmed the improvement.

The valid public evidence is the corrected V1-V5 redesign plus the corrected V1-V5 replication. The invalid Portuguese replication v0.1 export is excluded because one run was accidentally scored with `anchorHigh: V4` while claiming V1-V5.

Corrected replication:

- V1-V5 r01: INTERMEDIATE, normalizedPosition 0.753676, gap_low 0.284722, gap_high 0.093056;
- V1-V5 r02: INTERMEDIATE, normalizedPosition 0.875000, gap_low 0.330556, gap_high 0.047222, with NEAR_COLLAPSE_HIGH and BOUNDARY_UNCERTAIN_HIGH;
- V1-V4 r03: COLLAPSED_HIGH, normalizedPosition 1.154279, gap_high -0.038056;
- V1-V4 r04: COLLAPSED_HIGH, normalizedPosition 1.599462, gap_high -0.123889.

Paper-safe interpretation:

- Portuguese `/â/` replicated V1-V5 improvement over V1-V4 controls.
- Portuguese remains edge-stressed because one candidate run leaned high and carried high-boundary caution.
- Portuguese is usable with caution.
- Portuguese should not be headline support by itself.

---

## 8. Pressure cases

### 8.1 Turkish `/ı/`

Turkish `/ı/` improved under V4-V7 compared with V5-V7.

The V4-V7 candidate runs returned INTERMEDIATE x2 with no diagnostic flags:

- r01: normalizedPosition 0.614663, gap_low 0.400556, gap_high 0.251111;
- r02: normalizedPosition 0.474286, gap_low 0.276667, gap_high 0.306667.

The V5-V7 controls showed pressure:

- r03: INTERMEDIATE, normalizedPosition 0.192982, gap_low 0.055000, BOUNDARY_UNCERTAIN_LOW;
- r04: EXCEEDS_LOW, normalizedPosition -0.063380, gap_low -0.015000, BOUNDARY_UNCERTAIN_LOW.

Paper-safe interpretation:

- Turkish `/ı/` improved under V4-V7.
- Turkish remains pressure-audit.
- Turkish is not settled support.
- The high-region model still needs cautious treatment.

### 8.2 Romanian `/ă/`

Romanian `/ă/` remains unresolved central-vowel pressure.

The v0.1 V3-V4 candidate failed:

- r01: EXCEEDS_LOW, normalizedPosition -4.256410, gap_low -0.276667;
- r02: EXCEEDS_LOW, normalizedPosition 1.483283, gap_low -0.271111.

The v0.1 V2-V4 controls also failed or collapsed:

- r03: EXCEEDS_LOW;
- r04: COLLAPSED_HIGH.

The v0.2 widened V2-V5 candidate did not stabilize:

- r01: EXCEEDS_LOW, normalizedPosition -0.288566, gap_low -0.088333;
- r02: INTERMEDIATE, normalizedPosition 0.107258, gap_low 0.036944, with NEAR_COLLAPSE_LOW and BOUNDARY_UNCERTAIN_LOW.

The v0.2 V3-V4 controls also failed:

- r03: EXCEEDS_LOW;
- r04: EXCEEDS_LOW.

Paper-safe interpretation:

- Romanian `/ă/` is not support for V3-V4.
- Romanian `/ă/` is not support for V2-V5.
- Romanian `/ă/` is not support for any tested bracket.
- No tested bracket contains Romanian `/ă/` cleanly.
- Romanian remains an unresolved central-vowel pressure case.

---

## 9. Discussion

Cohort 02 is useful because it separates evidence categories.

The strongest case is French `/ø~œ/`, which shows clear candidate/control separation in favor of V5-V7 over V2-V5.

Norwegian `/ø/` and Danish `/ø/` support V1-V3 more cautiously. They fit the lower front-rounded direction, but controls did not collapse. These cases should be described as cleaner provisional support, not decisive proof.

Portuguese `/â/` is scientifically useful because it shows improvement after redesign and replication, but it remains edge-stressed. Its value is not that it becomes a perfect support case. Its value is that the method can record a better bracket while preserving caution.

Turkish `/ı/` is useful because it shows partial improvement without becoming settled. V4-V7 is cleaner than V5-V7, but the case remains high-region pressure.

Romanian `/ă/` is useful because it remains unresolved. A weaker paper would hide this case. Cohort 02 keeps it visible as central-vowel pressure, which is the more honest result.

The overall pattern is therefore mixed but productive:

- one strongest support case;
- two cautious support cases;
- one replicated edge-stressed improvement;
- one pressure-audit improvement;
- one unresolved pressure case.

---

## 10. Limitations

1. Cohort 02 is small: six language/vowel cases.
2. Token curation is researcher-reviewed and ChatGPT-assisted; the repo-tracked curation procedure is `docs/evals/cohort-02-token-curation-instructions-v0.1.md`.
3. The scoring workflow is LLM-mediated and should be replicated across additional models.
4. The method uses orthographic token sets, not direct acoustic measurement.
5. Orthographic forms can carry non-target vowel effects inside each token.
6. Some controls remain intermediate rather than fully collapsing.
7. Norwegian and Danish are supportive but modest.
8. Portuguese remains edge-stressed.
9. Turkish remains pressure-audit.
10. Romanian remains unresolved.
11. The aperture proxy values are ordinal model positions, not physical vowel measurements.
12. The method tests bracket behavior; it does not prove a complete theory of phonology.
13. The archive candidate is local and has not yet been publicly uploaded.
14. Public claims must remain weaker than internal interpretation.

---

## 11. Claim boundaries

Allowed public claims:

- Cohort 02 separates support cases from pressure cases.
- French `/ø~œ/` is the strongest current Cohort 02 support case.
- Norwegian and Danish `/ø/` provide cautious V1-V3 support.
- Portuguese `/â/` replicated V1-V5 improvement but remains edge-stressed.
- Turkish `/ı/` improved under V4-V7 but remains pressure-audit.
- Romanian `/ă/` remains unresolved and is not support.

Blocked public claims:

- Cohort 02 proves the framework.
- Cohort 02 replaces Cohort 01.
- Portuguese `/â/` is final headline support.
- Turkish `/ı/` is settled support.
- Romanian `/ă/` supports any tested bracket.
- French `/ø~œ/` alone proves the high-edge bracket.
- Norwegian `/ø/` and Danish `/ø/` absolutely falsify V2-V5.
- Registry labels should be migrated based on Cohort 02 alone.

---

## 12. Reproducibility and archive

The Cohort 02 evidence archive is prepared for Zenodo publication as:

`zero-cohort-02-six-language-bracket-evidence-v0.1.zip`

Evidence archive DOI:

`https://doi.org/10.5281/zenodo.20116021`

All-versions DOI:

`https://doi.org/10.5281/zenodo.20116020`

The final top-level archive SHA256 is intentionally not embedded in this paper body because the archive contains the paper PDF. The final archive hash must be recorded after PDF generation in the archive metadata, Zenodo record, and repo-tracked archive-build result.

The archive includes 9 evidence-pack ZIP files:

1. `evals.series-evidence-pack.t5-no-oe-v1-v3-researcher-v0.1.v0.1.zip`
2. `evals.series-evidence-pack.t5-da-oe-v1-v3-researcher-v0.1.v0.1.zip`
3. `evals.series-evidence-pack.t5-tr-ii-v4-v7-researcher-v0.1.v0.1.zip`
4. `evals.series-evidence-pack.t5-ro-a-breve-v3-v4-researcher-v0.1.v0.1.zip`
5. `evals.series-evidence-pack.t5-fr-euoe-v5-v7-researcher-v0.1.v0.1.zip`
6. `evals.series-evidence-pack.t5-pt-aa-v1-v4-researcher-v0.1.v0.1.zip`
7. `evals.series-evidence-pack.t5-ro-a-breve-v2-v5-researcher-v0.2.v0.1.zip`
8. `evals.series-evidence-pack.t5-pt-aa-v1-v5-researcher-v0.2.v0.1.zip`
9. `evals.series-evidence-pack.t5-pt-aa-v1-v5-researcher-replication-v0.2.v0.1.zip`

The archive also includes:

- repo-tracked design and summary documents;
- pressure notes;
- public paper outline;
- public archive manifest;
- public checksum table;
- public archive build-result document;
- file-level checksums;
- reproduction notes.

The Zenodo record DOI is `https://doi.org/10.5281/zenodo.20116021`.

The Zenodo all-versions DOI is `https://doi.org/10.5281/zenodo.20116020`.

The paper has not been submitted to LingBuzz.

The project README has not yet been updated with a Cohort 02 public chain.

---

## 13. Token curation protocol reference

Cohort 02 token curation is not treated as hidden intuition. The repo contains a dedicated curation procedure:

`docs/evals/cohort-02-token-curation-instructions-v0.1.md`

That procedure records:

- the intended Cohort 02 subset cases;
- single-token constraints;
- strict JSON output expectations;
- duplicate-checking requirements;
- metadata conventions;
- the rule that token curation must precede scoring.

The archive should include this protocol alongside the paper source and evidence packs so that readers can inspect how token buckets were prepared.

## 14. Conclusion

Cohort 02 improves the ZË-RO vowel-bracket evidence chain by making the method more auditable.

The main contribution is not a universal support claim. The main contribution is methodological discipline:

- explicit candidate/control framing;
- explicit pressure and falsification criteria;
- deterministic scoring mechanics;
- numerical run-level reporting;
- exclusion of an invalid Portuguese replication export;
- retention of Romanian `/ă/` as unresolved pressure;
- archive checksums and reproduction notes;
- public claim boundaries before release.

The result is a structured evidence distribution:

- French `/ø~œ/`: strongest support;
- Norwegian `/ø/` and Danish `/ø/`: cautious support;
- Portuguese `/â/`: replicated edge-stressed improvement;
- Turkish `/ı/`: pressure-audit improvement;
- Romanian `/ă/`: unresolved central-vowel pressure.

This mixed outcome is scientifically useful. It shows where the current bracket model works better, where it needs caution, and where it remains unresolved. The safest public framing is therefore not “Cohort 02 proves ZË-RO,” but rather: Cohort 02 provides a reproducible template for separating support, edge stress, and pressure cases under a documented vowel-bracket testing workflow.

---

## 15. Internal pre-release checklist

Before any public release:

1. review this paper draft for overclaims;
2. generate the final PDF;
3. rebuild the archive candidate including the PDF;
4. decide whether the archive candidate should be uploaded to Zenodo;
5. record DOI-linked archive build result in the repo after final archive rebuild;
6. prepare LingBuzz submission text only after DOI exists;
7. update README only after both archive and paper links exist;
8. do not migrate registry labels from Cohort 02 alone.

---

## 16. Internal completion criteria

This internal draft is ready for final PDF review when:

1. all overclaims are removed;
2. support and pressure cases are clearly separated;
3. numerical evidence is included;
4. scoring mechanics and normalizedPosition formula are defined;
5. limitations are preserved;
6. archive SHA is recorded in archive metadata after final PDF generation;
7. claim boundaries are preserved;
8. final publish/no-publish decision is made.
