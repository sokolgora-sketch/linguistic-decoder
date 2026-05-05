# Seven-Primal-Vowel Bracket Testing: Cohort 01 Evidence Across Ten Languages

**Author:** Sokol Gora / ZË-RO Research  
**Draft:** v0.1  
**Status:** Working paper draft

## Abstract

This technical note reports Cohort 01 of the ZË-RO vowel-bracket evaluation battery, a four-run test of bracket placement for boundary vowels across ten languages. The study asks whether selected vowel classes stabilize inside proposed Seven-Primal-Vowel brackets, whether refinement brackets perform better, and where the current model fails.

The main finding is that front-rounded vowels are not one uniform class. Norwegian /ø/ and Danish /ø/ support a lower V1–V3 placement over the older V2–V5 bracket under this battery. French /ø~œ/ behaves as a higher front-rounded case: V2–V5 collapses high, while V5–V7 contains the vowel with remaining high-edge stress. Swedish /ö/ and German /ö/ behave as bridging cases rather than strong separation wins.

Open-front /ä/ in Estonian and Finnish supports V1–V3 over V2–V3 under this battery, but both cases sit near the low edge. Portuguese /â/ is provisionally contained by V1–V4, while V1–V5 worsens high-boundary stress. Turkish /ı/ is the strongest pressure case: it fails under V6–V7, remains unstable in audit, and still collapses under wider V4–V7 and V3–V7 sweeps. Romanian /ă/ also fails low under the tested central/reduced brackets and remains unresolved.

Cohort 01 therefore provides evidence for bracket refinement in several vowel families while preserving clear pressure cases. It is best read as a refinement and falsification record, not as final proof.

## Keywords

ZË-RO; Seven-Primal-Vowel model; vowel bracket testing; falsification battery; front-rounded vowels; open-front vowels; central reduced vowels; ChatGPT-assisted researcher-reviewed curation; language evaluation; experimental phonosemantics.

---

## 1. Introduction

ZË-RO is a deterministic vowel-aperture evaluation framework that scores token sets against a fixed seven-primal aperture proxy. In this paper, ZË-RO is used as an evaluation instrument: token sets are curated outside the scorer, and the scorer produces verdicts, normalized positions, gap statistics, and diagnostic flags from those token sets. The results should therefore be read as outputs of this evaluation instrument, not as direct acoustic measurements.

The Seven-Primal-Vowel model proposes that vowel structure can be tested through a fixed bracket system, where vowel classes are expected to occupy stable regions between defined primal anchors. In this framework, a vowel is not treated only as an isolated phonetic sign, but as a position inside a structured vowel field. The practical question is whether this field can be tested in a repeatable way.

This paper reports Cohort 01 of the ZË-RO vowel-bracket evaluation battery. The purpose of the cohort is not to prove the entire Seven-Primal-Vowel model. The purpose is narrower and more useful: to test whether selected vowel classes stabilize inside predicted brackets, whether alternative brackets perform better, and where the current model fails.

This study extends earlier boundary-vowel work by widening the cohort to ten languages, adding Romanian /ă/, and adding refinement brackets for several front-rounded cases. The present paper should therefore be read as a separate Cohort 01 technical note, not as a replacement for the earlier boundary-vowel paper.

Cohort 01 focuses on ten languages and several difficult vowel classes: open-front /ä/, front-rounded /ø~œ~ö/, central/reduced /â~ă/, and high/back unrounded /ı/. These cases were chosen because they are not trivial. A useful model should not only explain easy vowels; it should also expose boundary cases, unstable cases, and pressure cases.

The battery uses a four-run structure for each case: two runs test the intended or candidate bracket, and two runs test a comparison bracket. The result is not judged by a single pass/fail value alone, but by the relation between candidate behavior, control behavior, normalized position, and diagnostic flags.

Cohort 01 shows a mixed but useful pattern. Some cases provide evidence for bracket refinement, especially Norwegian /ø/ and Danish /ø/. Some cases remain technically intermediate but weak, such as Swedish /ö/ and German /ö/. Some cases provide provisional support under boundary stress, such as Finnish /ä/, Estonian /ä/, and Portuguese /â/. Other cases, especially Turkish /ı/ and Romanian /ă/, act as pressure cases for the current bracket model.

The value of the cohort is therefore not that every case supports the model. The value is that the battery preserves both support and failure.

---

## 2. Hypothesis and test design

The working hypothesis is:

> If a vowel class belongs to a proposed Seven-Primal-Vowel bracket, then token sets representing that vowel should fall inside the candidate bracket more reliably than they fall inside an intentionally weaker or alternative comparison bracket.

This hypothesis is deliberately falsifiable. A candidate bracket can fail in several ways:

1. The vowel falls below the lower anchor.
2. The vowel collapses beyond the higher anchor.
3. The vowel remains technically intermediate but only at a boundary edge.
4. The candidate and comparison brackets behave too similarly to support a strong distinction.
5. A refinement bracket fails to improve the original placement.

The battery therefore does not treat every INTERMEDIATE result as equally strong. A clean intermediate result with no diagnostic flags carries more weight than an intermediate result sitting near collapse. Likewise, a bracket is stronger when the candidate runs stabilize and the comparison runs fail in the expected direction.

Each case uses a four-run battery:

| Ordinal | Role |
|---:|---|
| r01 | candidate bracket, main token set |
| r02 | candidate bracket, alternate token set |
| r03 | comparison bracket, main token set |
| r04 | comparison bracket, alternate token set |

The alternate runs test whether a result survives a second token selection. A bracket that only works once is weaker than a bracket that survives both main and alternate sets.

The comparison bracket is equally important. Without comparison runs, the test would only show that a vowel can be made to appear somewhere inside a bracket. With comparison runs, the battery can ask a sharper question: does the proposed bracket contain the vowel better than a plausible alternative?

---

## 3. Method

### 3.1 ZË-RO evaluator

ZË-RO scores token sets against a fixed seven-primal aperture proxy:

```text
A = 1.0
O = 0.8
E = 0.6
Ë = 0.5
U = 0.4
Y = 0.3
I = 0.1
```

These values are the fixed evaluator proxy used by Cohort 01. They are not acoustic F1 measurements and should not be read as claims about physical vowel height. They define the internal scoring scale used by the ZË-RO bracket battery.

The scoring engine is separate from token curation. Token sets are prepared and reviewed before scoring; the evaluator then computes bracket behavior from the submitted tokens. Each run returns a verdict, normalized position, gap statistics, permutation/bootstrap diagnostics, and flags.

Normalized position values between 0.0 and 1.0 indicate that the tested vowel sits inside the bracket. Values below 0.0 indicate that the vowel falls below the lower side of the bracket. Values above 1.0 indicate that the vowel collapses beyond the higher side. The magnitude outside the 0.0–1.0 range indicates how far the vowel falls outside the tested bracket.

### 3.2 Evidence pack structure

Each four-run series is exported as an evidence pack. A complete pack contains:

```text
01_RUN_INDEX.md
series-summary.csv
runs/<runId>/input.json
runs/<runId>/report.json
runs/<runId>/report.md
runs/<runId>/report.pdf
runs/<runId>/workbook.xlsx
runs/<runId>/summary.csv
runs/<runId>/notes.md
```

The run index gives the main series-level view: ordinal, run ID, language, vowel, bracket, verdict, normalized position, gaps, and diagnostic flags. The run folders preserve the exact input, report output, markdown report, PDF report, workbook, and summary table for each run.

### 3.3 Provenance label

Cohort 01 uses the provenance label:

```text
provider: openai
model: chatgpt-assisted-researcher-reviewed
sourceEngineId: external-llm-curation
sourceEngineVersion: t5-battery-2026-05-chatgpt-assisted-v0.1
sourceEngineBuild: 6ef31a5
```

This means the token buckets were prepared with ChatGPT assistance and manually reviewed by the researcher before scoring. The ZË-RO evaluator performed the bracket scoring separately from the token-curation step.

### 3.4 Verdict categories

The battery uses the following primary verdict categories:

| Verdict | Meaning |
|---|---|
| INTERMEDIATE | The vowel sits between the tested low and high anchors. |
| EXCEEDS_LOW | The vowel falls below the lower side of the tested bracket. |
| COLLAPSED_HIGH | The vowel collapses beyond the high side of the tested bracket. |
| COLLAPSED_LOW | The vowel collapses toward the low side of the tested bracket. |

In this paper, INTERMEDIATE means that the run falls inside the tested bracket. It does not mean the vowel is phonetically “intermediate” in the traditional vowel-quality sense.

Diagnostic flags refine these verdicts:

| Flag | Meaning |
|---|---|
| BOUNDARY_UNCERTAIN_LOW | The result is close to the lower boundary. |
| BOUNDARY_UNCERTAIN_HIGH | The result is close to the higher boundary. |
| NEAR_COLLAPSE_LOW | The result is near low collapse. |
| NEAR_COLLAPSE_HIGH | The result is near high collapse. |

These flags affect interpretation. A bracket that returns INTERMEDIATE with boundary flags is weaker than a bracket that returns INTERMEDIATE without flags.

### 3.5 Interpretation weights

Cohort 01 uses four interpretation weights:

| Weight | Meaning |
|---|---|
| Strong refinement support | Under this battery, the candidate bracket stabilizes cleanly and the comparison bracket fails. |
| Provisional support | Under this battery, the candidate bracket performs better than the comparison bracket, but boundary stress or weak separation remains. |
| Weak / bridging | The bracket is stable or plausible, but comparison runs do not clearly fail. |
| Unresolved pressure | The tested bracket does not stabilize, or multiple brackets fail. |

This weighting prevents overclaiming. The paper separates strong cases from weak cases and preserves negative cases as useful evidence.

---

## 4. Cohort 01 overview

Cohort 01 contains ten languages and sixteen evidence packs. The cohort tests five broad vowel groups:

1. Open-front vowels: Estonian /ä/, Finnish /ä/.
2. Front-rounded vowels: French /ø~œ/, Norwegian /ø/, Danish /ø/, Swedish /ö/, German /ö/.
3. Central/reduced vowels: Portuguese /â/, Romanian /ă/.
4. High/back unrounded pressure: Turkish /ı/.
5. Refinement and sweep cases: French, Norwegian, Swedish, Portuguese, Turkish.

### 4.1 Canonical evidence packs

| # | Language | Vowel | Pack | Role |
|---:|---|---:|---|---|
| 1 | Estonian | ä | `evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1 (1).zip` | Open-front V1–V3 test |
| 2 | Finnish | ä | `evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1 (2).zip` | Open-front V1–V3 test |
| 3 | French | ø~œ | `evals.series-evidence-pack.t5-fr-euoe-v2-v5-exp-v0.2.v0.1 (4).zip` | Original V2–V5 test |
| 4 | French | ø~œ | `evals.series-evidence-pack.t5-fr-euoe-v5-v7-refine-v0.1.v0.1 (1).zip` | V5–V7 refinement |
| 5 | Norwegian | ø | `evals.series-evidence-pack.t5-no-oe-v2-v5-exp-v0.2.v0.1 (4).zip` | Original V2–V5 test |
| 6 | Norwegian | ø | `evals.series-evidence-pack.t5-no-oe-v1-v3-refine-v0.1.v0.1 (1).zip` | V1–V3 refinement |
| 7 | Danish | ø | `evals.series-evidence-pack.t5-da-oe-v1-v3-refine-v0.1.v0.1 (1).zip` | V1–V3 refinement |
| 8 | Swedish | ö | `evals.series-evidence-pack.t5-sv-oe-v2-v5-exp-v0.2.v0.1 (3).zip` | Original V2–V5 test |
| 9 | Swedish | ö | `evals.series-evidence-pack.t5-sv-oe-v1-v3-refine-v0.1.v0.1 (1).zip` | V1–V3 refinement |
| 10 | German | ö | `evals.series-evidence-pack.t5-de-oe-v2-v4-refine-v0.1.v0.1 (1).zip` | V2–V4 refinement |
| 11 | Portuguese | â | `evals.series-evidence-pack.t5-pt-aa-v1-v4-core-v0.2.v0.1 (2).zip` | V1–V4 core test |
| 12 | Portuguese | â | `evals.series-evidence-pack.t5-pt-aa-v1-v5-refine-v0.1.v0.1 (1).zip` | V1–V5 refinement |
| 13 | Turkish | ı | `evals.series-evidence-pack.t5-tr-ii-v6-v7-core-v0.2.v0.1 (2).zip` | V6–V7 core test |
| 14 | Turkish | ı | `evals.series-evidence-pack.t5-tr-ii-v6-v7-audit-v0.1.v0.1 (1).zip` | V6–V7 audit |
| 15 | Turkish | ı | `evals.series-evidence-pack.t5-tr-ii-wide-sweep-v0.1.v0.1 (1).zip` | V4–V7 / V3–V7 wide sweep |
| 16 | Romanian | ă | `evals.series-evidence-pack.t5-ro-a-breve-v3-v4-core-v0.1.v0.1 (1).zip` | V3–V4 central/reduced test |

---

## 5. Results overview

Cohort 01 produces four main result classes:

1. Strong refinement support.
2. Provisional or edge-stressed support.
3. Weak / bridging cases.
4. Pressure / falsification cases.

The strongest result is not that all cases pass. The strongest result is that the battery separates cases into different levels of support and pressure.

### 5.1 Results table

| Language | Vowel | Candidate / refinement pattern | Main outcome | Weight |
|---|---:|---|---|---|
| Estonian | ä | V1–V3 vs V2–V3 | V1–V3 contains; V2–V3 fails low | Low-edge support under this battery |
| Finnish | ä | V1–V3 vs V2–V3 | V1–V3 contains near low edge; V2–V3 fails low | Boundary-stressed support under this battery |
| French | ø~œ | V2–V5 to V5–V7 | V2–V5 collapses high; V5–V7 contains with high-edge stress | High-edge refinement evidence |
| Norwegian | ø | V2–V5 to V1–V3 | V2–V5 fails low; V1–V3 clean | Strong refinement evidence |
| Danish | ø | V1–V3 vs V2–V5 | V1–V3 clean; V2–V5 fails low | Strong refinement evidence |
| Swedish | ö | V2–V5 to V1–V3 | V1–V3 cleaner, but controls remain intermediate | Weak / bridging |
| German | ö | V2–V4 vs V1–V3 | All runs intermediate, no flags | Stable bridging |
| Portuguese | â | V1–V4 with V1–V5 refinement | V1–V4 better; V1–V5 worsens high stress | Provisional evidence |
| Turkish | ı | V6–V7, audit, wide sweep | No tested bracket stabilizes | Unresolved pressure |
| Romanian | ă | V3–V4 vs V1–V4 | All runs fail low | Unresolved pressure |

### 5.2 Interpretation classes

| Class | Cases |
|---|---|
| Strong refinement evidence | Norwegian /ø/, Danish /ø/ |
| Edge-stressed evidence | Estonian /ä/, Finnish /ä/, Portuguese /â/ |
| High-edge refinement | French /ø~œ/ |
| Weak / bridging | Swedish /ö/, German /ö/ |
| Unresolved pressure | Turkish /ı/, Romanian /ă/ |

---

## 6. Language-by-language findings

### 6.1 Estonian /ä/ — low-edge open-front support

Estonian /ä/ was tested using V1–V3 as the candidate bracket and V2–V3 as the comparison bracket.

The V1–V3 candidate runs both returned INTERMEDIATE. The main run produced a normalized position of 0.143200 with no diagnostic flags. The alternate run produced a normalized position of 0.056273 and carried NEAR_COLLAPSE_LOW plus BOUNDARY_UNCERTAIN_LOW.

The V2–V3 comparison runs both failed low. The main comparison run returned EXCEEDS_LOW at -0.610526, and the alternate comparison run returned EXCEEDS_LOW at -0.839928.

Interpretation: Under this battery, Estonian /ä/ supports the lower/open-front V1–V3 region better than V2–V3. The candidate bracket contains the vowel while the narrower/higher comparison bracket fails low. Because the alternate candidate run sits close to the lower boundary, the case should be framed as low-edge support rather than clean central support.

### 6.2 Finnish /ä/ — boundary-stressed open-front support

Finnish /ä/ was tested using V1–V3 as the candidate bracket and V2–V3 as the comparison bracket.

The V1–V3 candidate runs both returned INTERMEDIATE, with normalized positions of 0.058824 and 0.091324. Both candidate runs carried NEAR_COLLAPSE_LOW and BOUNDARY_UNCERTAIN_LOW.

The V2–V3 comparison runs both failed low. The main comparison run returned EXCEEDS_LOW at -0.342981, while the alternate comparison run returned EXCEEDS_LOW at -0.149856 with BOUNDARY_UNCERTAIN_LOW.

Interpretation: Under this battery, Finnish /ä/ supports V1–V3 over V2–V3, but it is more boundary-stressed than Estonian. The candidate bracket contains the vowel only near the low edge. This makes Finnish useful as support for the lower/open-front region, but not as a cleanly centered V1–V3 case.

### 6.3 French /ø~œ/ — high-edge front-rounded refinement

French /ø~œ/ was first tested under V2–V5 and then refined under V5–V7.

The original V2–V5 candidate runs both returned COLLAPSED_HIGH. The main run produced a normalized position of 2.077922, and the alternate run produced 3.355372. The V1–V3 comparison runs remained INTERMEDIATE at 0.648198 and 0.613731.

The V5–V7 refinement improved the fit. Both candidate runs returned INTERMEDIATE, with normalized positions of 0.614815 and 0.631902. However, the refinement remained high-edge stressed: the main run carried NEAR_COLLAPSE_HIGH and BOUNDARY_UNCERTAIN_HIGH, and the alternate run carried BOUNDARY_UNCERTAIN_HIGH. The V2–V5 comparison runs again collapsed high.

Interpretation: French /ø~œ/ should not be treated as V2–V5 support. It behaves as a high-edge front-rounded case. V5–V7 is better than V2–V5 because it contains the vowel, but the remaining high-boundary stress means this is refinement support, not a perfectly clean placement.

### 6.4 Norwegian /ø/ — clean low-edge front-rounded refinement

Norwegian /ø/ was first tested under V2–V5 and then refined under V1–V3.

The original V2–V5 candidate runs both failed low. The main run returned EXCEEDS_LOW at -0.140171 with BOUNDARY_UNCERTAIN_LOW. The alternate run also returned EXCEEDS_LOW at -0.388158 with BOUNDARY_UNCERTAIN_LOW. In contrast, the V1–V3 comparison runs remained INTERMEDIATE at 0.229741 and 0.178010 with no diagnostic flags.

The V1–V3 refinement confirmed the pattern. Both V1–V3 candidate runs returned INTERMEDIATE with no flags, at 0.229741 and 0.178010. The V2–V5 comparison runs again failed low, returning EXCEEDS_LOW at -0.140171 and -0.388158 with BOUNDARY_UNCERTAIN_LOW.

Interpretation: Norwegian /ø/ is a strong low-edge front-rounded refinement case. The older V2–V5 bracket does not contain the vowel; it sits below that bracket. The V1–V3 bracket contains it cleanly. Norwegian should therefore be treated as strong evidence for a lower front-rounded subtype rather than as support for the older V2–V5 placement.

### 6.5 Danish /ø/ — clean low-edge front-rounded refinement

Danish /ø/ was tested using V1–V3 as the candidate bracket and V2–V5 as the comparison bracket.

Both V1–V3 candidate runs returned INTERMEDIATE with no diagnostic flags. The main run produced a normalized position of 0.231156, and the alternate run produced 0.167553. Both are low-side intermediate placements, but they remain inside the tested bracket without collapse or boundary flags.

The V2–V5 comparison runs both failed low. The comparison run returned EXCEEDS_LOW at -0.152656 with BOUNDARY_UNCERTAIN_LOW. The comparison alternate returned EXCEEDS_LOW at -0.250681 with BOUNDARY_UNCERTAIN_LOW.

Interpretation: Danish /ø/ aligns closely with Norwegian /ø/. Under this battery, the V1–V3 bracket contains the vowel while V2–V5 fails low. This makes Danish one of the strongest Cohort 01 refinement cases and provides evidence for a lower Scandinavian front-rounded pattern.

### 6.6 Swedish /ö/ — weak low-edge bridge

Swedish /ö/ was first tested under V2–V5 and then refined under V1–V3.

The original V2–V5 candidate runs both returned INTERMEDIATE, but the main run sat close to the low boundary at 0.030888 and carried NEAR_COLLAPSE_LOW plus BOUNDARY_UNCERTAIN_LOW. The alternate run was more stable at 0.162717 with no flags. The V1–V3 comparison runs also remained INTERMEDIATE and flag-free at 0.264423 and 0.204918.

The V1–V3 refinement improved the candidate side: both candidate runs were INTERMEDIATE and flag-free at 0.264423 and 0.204918. However, the V2–V5 comparison runs did not fully fail; one repeated the low-edge stress and the other remained intermediate without flags.

Interpretation: Swedish /ö/ leans toward the lower front-rounded pattern, but weakly. V1–V3 is cleaner than V2–V5, but the comparison bracket remains technically intermediate. Swedish should be treated as a weak or bridging low-edge case, not as a headline refinement win.

### 6.7 German /ö/ — stable middle bridge

German /ö/ was refined using V2–V4 as the candidate bracket and V1–V3 as the comparison bracket.

Both V2–V4 candidate runs returned INTERMEDIATE with no flags, at 0.445652 and 0.371482. The V1–V3 comparison runs also returned INTERMEDIATE with no flags, at 0.337209 and 0.411518.

For German /ö/, the comparison bracket V1–V3 is not a clearly inferior alternative, so the result is intentionally treated as bridging rather than strong separation.

Interpretation: German /ö/ is stable, but not strongly separated. V2–V4 is a plausible bracket because the candidate runs are clean, but V1–V3 also remains stable. German should be presented as a middle bridging case between the low-edge Scandinavian pattern and the high-edge French pattern.

### 6.8 Portuguese /â/ — provisional V1–V4 support under boundary stress

Portuguese /â/ was tested first under V1–V4 and then refined under V1–V5.

The V1–V4 core test returned INTERMEDIATE for all four runs. The candidate runs sat at 0.613162 and 0.557734, both with boundary uncertainty. The V2–V4 comparison runs also remained INTERMEDIATE, but they sat closer to the low edge at 0.076628 and 0.232082 and carried NEAR_COLLAPSE_LOW plus boundary uncertainty.

The V1–V5 refinement did not improve the fit. The candidate runs remained INTERMEDIATE, but shifted toward high collapse at 0.804211 and 0.924188, both with NEAR_COLLAPSE_HIGH and BOUNDARY_UNCERTAIN_HIGH. The V1–V4 comparison runs inside the refinement stayed more centered.

Interpretation: Portuguese /â/ is best treated as provisional V1–V4 evidence with boundary stress. V1–V4 is better than V2–V4 and better than V1–V5, but the case remains weaker because all core runs are technically intermediate and boundary flags are present.

### 6.9 Turkish /ı/ — unresolved high-region pressure case

Turkish /ı/ was tested through three evidence packs: a V6–V7 core test, a V6–V7 audit, and a wider V4–V7 / V3–V7 sweep.

In the core V6–V7 test, both intended V6–V7 runs returned COLLAPSED_HIGH. The main run produced -0.127389 with BOUNDARY_UNCERTAIN_LOW, and the alternate produced -0.814433 with no flags. The V5–V7 comparison runs also returned COLLAPSED_HIGH at -2.826087 and -1.511111.

The audit did not stabilize the case. The V6–V7 candidate split: the main run returned COLLAPSED_HIGH at -1.046512, while the alternate returned COLLAPSED_LOW at 0 with BOUNDARY_UNCERTAIN_LOW. The V5–V7 comparison runs both returned COLLAPSED_HIGH at -3.270270 and -3.166667.

The wide sweep also failed to stabilize the vowel. V4–V7 collapsed high in both runs, at 6.138889 and 3.754545. V3–V7 also collapsed high in both runs, at 8.074074 and 8.469388.

Interpretation: Turkish /ı/ is a serious pressure case for the current high-region bracket model. It should not be described as V6–V7 support. The failure persists through core testing, audit testing, and wider sweep testing. The most honest interpretation is that Turkish /ı/ exposes an unresolved instability in the current bracket design for high/back unrounded vowels.

### 6.10 Romanian /ă/ — central/reduced vowel pressure case

Romanian /ă/ was tested using V3–V4 as the candidate bracket and V1–V4 as the comparison bracket.

All four runs returned EXCEEDS_LOW. The V3–V4 candidate runs failed strongly, with normalized positions of -20.914894 and -6.386364. Neither candidate run carried diagnostic flags, which means the failure was not merely a boundary-warning case; the vowel sat outside the tested bracket.

The V1–V4 comparison runs also failed low. The main comparison run returned EXCEEDS_LOW at -3.835681 with no flags. The alternate comparison run returned EXCEEDS_LOW at -1.296053 with BOUNDARY_UNCERTAIN_LOW.

Interpretation: Romanian /ă/ does not currently stabilize under the tested central/reduced bracket design. It should not be used as support for V3–V4 or V1–V4. At this stage it is best treated as an unresolved central/reduced pressure case requiring further bracket testing, not as final falsification of the whole framework.

---

## 7. Discussion

Cohort 01 shows that the bracket model is most useful as a refinement instrument. The results do not support a simple claim that all tested vowels fit the model. They separate vowel behavior into stable refinements, edge-stressed support, weak bridges, and unresolved pressure cases.

The clearest result is the front-rounded split. Norwegian and Danish provide evidence for a lower V1–V3 placement. French behaves as a higher front-rounded case better handled by V5–V7 than by V2–V5. Swedish leans toward the lower pattern but remains weak because the comparison bracket does not fully fail. German sits as a middle bridge: stable under V2–V4, but not strongly separated from V1–V3.

| Subtype | Languages | Interpretation |
|---|---|---|
| Low-edge front-rounded | Norwegian, Danish | strong V1–V3 refinement |
| Weak low-edge bridge | Swedish | V1–V3 cleaner, but not decisive |
| Middle bridge | German | V2–V4 stable, weak separation |
| High-edge front-rounded | French | V5–V7 better than V2–V5 |

Open-front /ä/ also provides refinement evidence, but with boundary stress. Estonian and Finnish both favor V1–V3 over V2–V3 under this battery, yet both sit near the lower edge, especially Finnish. These cases support the lower/open-front region but should not be treated as perfectly centered placements.

Central/reduced vowels split. Portuguese /â/ is provisionally contained by V1–V4, while V1–V5 worsens the fit. Romanian /ă/ fails low in all tested runs and remains an unresolved central/reduced pressure case.

Turkish /ı/ is the strongest pressure case. It fails under V6–V7, remains unstable in audit, and still collapses under wider V4–V7 and V3–V7 sweeps. This shows that the current high-region bracket strategy is incomplete.

The main result is therefore not simple support or failure. Cohort 01 gives a map of where the bracket model is stable, where it is weak, and where it needs redesign.

---

## 8. Limitations

Cohort 01 is an evaluation battery inside the current ZË-RO scoring system. It is not a final proof of the Seven-Primal-Vowel model.

**Token curation.** The token buckets were prepared with ChatGPT assistance and reviewed by the researcher before scoring. This is acceptable for a first structured battery, but future work should include human-only token curation and cross-assistant comparison. A representative curation prompt is provided in Appendix B.

**Single-model dependency.** Cohort 01 uses one scoring workflow and one curated provenance class. Multi-model replication is needed before treating these results as robust across different model families.

**Orthographic confound.** The battery uses orthographic token sets and the current ZË-RO aperture proxy. Spelling, script conventions, and token selection may influence the results. Cohort 01 is not yet an acoustic phonetics experiment and does not test direct human acoustic production or perception. The results should therefore be read as bracket-behavior evidence inside the current ZË-RO evaluator, not as direct acoustic measurement.

**Boundary stress.** An INTERMEDIATE result is not automatically strong. A case near collapse or carrying boundary flags must be interpreted as weaker than a clean, flag-free intermediate result. This matters for Finnish, Estonian, Portuguese, French, and Swedish.

**Control separation.** Some cases separate cleanly, especially Norwegian and Danish. Others do not. Swedish and German remain useful but weak because the comparison brackets also stay intermediate.

**Bracket granularity.** Turkish /ı/ and Romanian /ă/ show that some vowel classes are not handled well by the current bracket design. These cases should not be hidden. They are exactly the kind of failures that a useful evaluation system should expose.

---

## 9. Conclusion

Cohort 01 tests ten languages across open-front, front-rounded, central/reduced, and high/back unrounded vowel classes. The results show useful discriminatory behavior inside the current ZË-RO bracket battery, but also clear pressure points.

The strongest refinement evidence appears in Norwegian /ø/ and Danish /ø/, where V1–V3 contains the vowel cleanly while V2–V5 fails low. These cases support a lower front-rounded subtype under this battery.

French /ø~œ/ behaves differently. V2–V5 collapses high, while V5–V7 contains the vowel with high-boundary stress. French therefore provides evidence for a higher front-rounded subtype, distinct from the Scandinavian pattern.

Swedish /ö/ and German /ö/ are bridging cases. Swedish leans toward the lower front-rounded pattern, but weakly. German is stable under V2–V4, but the comparison bracket also remains stable.

Estonian /ä/ and Finnish /ä/ favor V1–V3 over V2–V3 under this battery, but both are low-edge cases. Portuguese /â/ is provisionally best treated as V1–V4, while V1–V5 worsens the fit.

Turkish /ı/ and Romanian /ă/ are pressure cases. Turkish does not stabilize under any tested high-region bracket, even after audit and sweep testing. Romanian fails low under the tested central/reduced brackets and requires further bracket testing. These cases show where the model needs revision.

Cohort 01 provides evidence for bracket refinement in several vowel families, especially front-rounded vowels, but it also exposes unresolved pressure cases. The value of the battery is that it preserves both support and failure.

---

## Evidence availability

The Cohort 01 evidence set contains ten languages and sixteen evidence packs. Each evidence pack contains the run index, series summary, input JSON, report JSON, markdown report, PDF report, workbook, per-run summary, and notes.

Evidence archive: DOI pending.

---

## Appendix A — Evidence set

```text
1. evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1 (1).zip
2. evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1 (2).zip
3. evals.series-evidence-pack.t5-fr-euoe-v2-v5-exp-v0.2.v0.1 (4).zip
4. evals.series-evidence-pack.t5-fr-euoe-v5-v7-refine-v0.1.v0.1 (1).zip
5. evals.series-evidence-pack.t5-no-oe-v2-v5-exp-v0.2.v0.1 (4).zip
6. evals.series-evidence-pack.t5-no-oe-v1-v3-refine-v0.1.v0.1 (1).zip
7. evals.series-evidence-pack.t5-da-oe-v1-v3-refine-v0.1.v0.1 (1).zip
8. evals.series-evidence-pack.t5-sv-oe-v2-v5-exp-v0.2.v0.1 (3).zip
9. evals.series-evidence-pack.t5-sv-oe-v1-v3-refine-v0.1.v0.1 (1).zip
10. evals.series-evidence-pack.t5-de-oe-v2-v4-refine-v0.1.v0.1 (1).zip
11. evals.series-evidence-pack.t5-pt-aa-v1-v4-core-v0.2.v0.1 (2).zip
12. evals.series-evidence-pack.t5-pt-aa-v1-v5-refine-v0.1.v0.1 (1).zip
13. evals.series-evidence-pack.t5-tr-ii-v6-v7-core-v0.2.v0.1 (2).zip
14. evals.series-evidence-pack.t5-tr-ii-v6-v7-audit-v0.1.v0.1 (1).zip
15. evals.series-evidence-pack.t5-tr-ii-wide-sweep-v0.1.v0.1 (1).zip
16. evals.series-evidence-pack.t5-ro-a-breve-v3-v4-core-v0.1.v0.1 (1).zip
```

---

## Appendix B — Token curation protocol

The token buckets were prepared using structured ChatGPT prompts followed by manual review. The review process retained single-token real-word entries, removed obvious malformed outputs, removed duplicates where detected, and preserved the final buckets inside each evidence pack.

Representative prompt family:

```text
Return STRICT JSON only. No prose. No markdown fence.
Generate 30 single-token words for each of the following buckets:
anchor_low, x_vowel, anchor_high.
The language is [LANGUAGE].
The vowel under test is [VOWEL].
Tokens should be common real words in that language.
No spaces. No punctuation. No duplicate tokens.
```

For publication, the exact prompt templates and raw model outputs should be included in the supplementary archive together with the evidence packs.

