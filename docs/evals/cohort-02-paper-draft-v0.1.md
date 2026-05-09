# Seven-Primal-Vowel Bracket Testing: Cohort 02 Support and Pressure Cases Across Six Languages

Status: PAPER DRAFT ONLY
Version: v0.1
Created: 2026-05-09
Project: ZË-RO
Cohort: Cohort 02
Archive candidate: `zero-cohort-02-six-language-bracket-evidence-v0.1.zip`
Archive SHA256: `87973040984cbe50e09b86c75251fec066dba3672530873f1105c7cea2d90aaf`

This is a repo-tracked paper draft.

This is not a Zenodo upload.

This is not a LingBuzz submission.

This does not update README, registry labels, or Cohort 01.

---

## Abstract

This paper reports Cohort 02 of the ZË-RO Seven-Primal-Vowel bracket-testing program. Cohort 02 extends prior vowel-bracket battery work by testing six language/vowel cases under researcher-reviewed scoring: Norwegian `/ø/`, Danish `/ø/`, French `/ø~œ/`, Portuguese `/â/`, Turkish `/ı/`, and Romanian `/ă/`.

The purpose of Cohort 02 is not to claim that every tested case supports the framework. The purpose is to separate support cases from edge-stressed and pressure cases under a documented candidate/control workflow.

French `/ø~œ/` is the strongest current support case: V5-V7 candidate runs remained intermediate while V2-V5 controls collapsed high. Norwegian `/ø/` and Danish `/ø/` provide cautious V1-V3 support: their candidate runs were cleaner than controls, but controls did not fully collapse. Portuguese `/â/` replicated V1-V5 improvement over V1-V4 controls but remains edge-stressed. Turkish `/ı/` improved under V4-V7 compared with V5-V7 but remains pressure-audit rather than settled support. Romanian `/ă/` remains unresolved central-vowel pressure and is not treated as support.

Cohort 02 therefore provides a more disciplined classification layer: support, edge-stressed improvement, pressure-audit, and unresolved pressure are kept separate.

---

## 1. Introduction

The ZË-RO bracket-testing program tests whether target vowel groups are better contained by specific Seven-Primal-Vowel bracket intervals. The method compares candidate brackets against control brackets using repeated candidate/control runs and evidence-pack export.

Cohort 01 established a broader battery across ten languages. Cohort 02 narrows the scope and focuses on researcher-reviewed cases that clarify support and pressure boundaries. The central question is not whether all vowels fit cleanly. The question is whether the battery can distinguish cleaner support from boundary stress and unresolved pressure.

Cohort 02 is deliberately conservative. It treats pressure cases as evidence rather than as failures to hide. It also blocks overclaiming: no single case proves the full framework, and no edge-stressed or unresolved case is promoted into headline support.

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

### 3.1 Task type

All listed evidence belongs to the intermediate-vowel bracket-testing workflow:

- task: `T5_INTERMEDIATE_V0_1`
- input shape: `intermediate_triple`

Each run compares:

- `anchor_low`
- `x_vowel`
- `anchor_high`

### 3.2 Four-run candidate/control structure

Each series uses a four-run structure:

1. candidate main;
2. candidate alt;
3. control main;
4. control alt.

The intent is to compare candidate stability against control behavior, rather than accepting a single run as evidence.

### 3.3 Metadata convention

The researcher-reviewed Cohort 02 runs use:

- provider: `openai`
- model: `chatgpt-assisted-researcher-reviewed`
- sourceEngine fields: blank where buckets were generated/reviewed externally rather than exported from an upstream ZË-RO engine.

### 3.4 Evidence-pack handling

Each series was exported as a series evidence pack. Evidence packs were locally archived, inspected, and later included in a Cohort 02 archive candidate.

The local archive candidate is:

`zero-cohort-02-six-language-bracket-evidence-v0.1.zip`

Top-level SHA256:

`87973040984cbe50e09b86c75251fec066dba3672530873f1105c7cea2d90aaf`

### 3.5 Interpretation rules

Interpretation follows these constraints:

- support requires candidate stability and meaningful control separation;
- intermediate verdicts near boundaries are weaker than clean intermediate runs;
- edge-stressed improvement is not headline support;
- pressure-audit cases are not settled support;
- unresolved pressure cases must remain visible;
- failed or pressured controls are part of the evidence;
- public claims must be weaker than internal enthusiasm.

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

## 5. Results summary

| Case | Candidate result | Control result | Paper-safe classification |
|---|---|---|---|
| Norwegian `/ø/` | V1-V3 INTERMEDIATE x2 | V2-V5 INTERMEDIATE x2 with weaker margins | cleaner provisional support |
| Danish `/ø/` | V1-V3 INTERMEDIATE x2 | V2-V5 INTERMEDIATE x2 with weaker margins | cleaner provisional support |
| French `/ø~œ/` | V5-V7 INTERMEDIATE x2 | V2-V5 COLLAPSED_HIGH x2 | strongest support case |
| Portuguese `/â/` | V1-V5 INTERMEDIATE x2 in corrected replication | V1-V4 COLLAPSED_HIGH x2 | replicated edge-stressed improvement |
| Turkish `/ı/` | V4-V7 INTERMEDIATE x2 | V5-V7 pressure, one EXCEEDS_LOW | pressure-audit / partial improvement |
| Romanian `/ă/` | split/failing under V2-V5 and V3-V4 | controls also failed | unresolved central-vowel pressure |

---

## 6. Support cases

### 6.1 French `/ø~œ/`

French `/ø~œ/` is the strongest current Cohort 02 support case.

The V5-V7 candidate runs returned INTERMEDIATE in both runs, while the V2-V5 controls collapsed high. This gives cleaner candidate/control separation than the Norwegian and Danish cases because the French controls failed rather than merely remaining weaker intermediate runs.

Paper-safe interpretation:

- French `/ø~œ/` supports V5-V7 as a cleaner high-edge bracket than V2-V5.
- French should not be framed as proving the full framework alone.
- French is the strongest support case in Cohort 02, not proof of the entire model.

### 6.2 Norwegian `/ø/`

Norwegian `/ø/` supports V1-V3 cautiously.

The V1-V3 candidate runs returned INTERMEDIATE, while V2-V5 controls also returned INTERMEDIATE but with weaker margins. This makes Norwegian useful but not absolute support.

Paper-safe interpretation:

- Norwegian `/ø/` provides cleaner provisional support for V1-V3.
- The result is not an absolute falsification of V2-V5.
- It should be presented as cautious support.

### 6.3 Danish `/ø/`

Danish `/ø/` parallels Norwegian.

The V1-V3 candidate runs were cleaner than V2-V5 controls. Like Norwegian, the controls did not fully collapse, so the result should be treated as supportive but modest.

Paper-safe interpretation:

- Danish `/ø/` supports the low-edge front-rounded direction.
- Danish strengthens the Norwegian pattern.
- Danish should not be overclaimed as decisive proof.

---

## 7. Edge-stressed improvement case

### Portuguese `/â/`

Portuguese `/â/` changed status during Cohort 02.

The original V1-V4 researcher series did not support V1-V4 cleanly. A later V1-V5 redesign improved the case. A corrected second V1-V5 replication then confirmed the improvement:

- V1-V5 candidate main: INTERMEDIATE;
- V1-V5 candidate alt: INTERMEDIATE with high-side caution;
- V1-V4 control main: COLLAPSED_HIGH;
- V1-V4 control alt: COLLAPSED_HIGH.

Paper-safe interpretation:

- Portuguese `/â/` replicated V1-V5 improvement over V1-V4 controls.
- Portuguese remains edge-stressed because one candidate run leaned high and carried high-boundary caution.
- Portuguese is usable with caution.
- Portuguese should not be headline support by itself.

---

## 8. Pressure cases

### 8.1 Turkish `/ı/`

Turkish `/ı/` improved under V4-V7 compared with V5-V7.

The V4-V7 candidate runs returned INTERMEDIATE x2 with no diagnostic flags. V5-V7 controls showed low-boundary pressure, including one EXCEEDS_LOW control run.

Paper-safe interpretation:

- Turkish `/ı/` improved under V4-V7.
- Turkish remains pressure-audit.
- Turkish is not settled support.
- The high-region model still needs cautious treatment.

### 8.2 Romanian `/ă/`

Romanian `/ă/` remains unresolved central-vowel pressure.

The v0.1 V3-V4 candidate did not stabilize. The v0.2 V2-V5 widened candidate split: one run remained EXCEEDS_LOW and one became INTERMEDIATE with low-boundary pressure. Controls also failed or remained pressured.

Paper-safe interpretation:

- Romanian `/ă/` is not support for V3-V4.
- Romanian `/ă/` is not support for V2-V5.
- Romanian `/ă/` is not support for any tested bracket.
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
2. Token curation is researcher-reviewed and ChatGPT-assisted.
3. Some controls remain intermediate rather than fully collapsing.
4. Norwegian and Danish are supportive but modest.
5. Portuguese remains edge-stressed.
6. Turkish remains pressure-audit.
7. Romanian remains unresolved.
8. The method tests bracket behavior; it does not prove a complete theory of phonology.
9. The archive candidate is local and has not yet been publicly uploaded.
10. Public claims must remain weaker than internal interpretation.

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

A local archive candidate has been built:

`zero-cohort-02-six-language-bracket-evidence-v0.1.zip`

Top-level SHA256:

`87973040984cbe50e09b86c75251fec066dba3672530873f1105c7cea2d90aaf`

The archive includes:

- 9 evidence-pack ZIP files;
- repo-tracked design and summary documents;
- pressure notes;
- public paper outline;
- public archive manifest;
- public checksum table;
- public archive build-result document;
- file-level checksums;
- reproduction notes.

The archive has not been uploaded to Zenodo.

The paper has not been submitted to LingBuzz.

The project README has not been updated with a Cohort 02 public chain.

---

## 13. Conclusion

Cohort 02 improves the ZË-RO vowel-bracket evidence chain by making classification more disciplined.

The cohort does not show universal support. Instead, it shows a structured distribution:

- French `/ø~œ/`: strongest support;
- Norwegian `/ø/` and Danish `/ø/`: cautious support;
- Portuguese `/â/`: replicated edge-stressed improvement;
- Turkish `/ı/`: pressure-audit improvement;
- Romanian `/ă/`: unresolved central-vowel pressure.

This mixed outcome is scientifically useful. It shows where the current bracket model works better, where it needs caution, and where it remains unresolved. The safest public framing is therefore not “Cohort 02 proves ZË-RO,” but rather: Cohort 02 separates support, edge stress, and pressure cases under a documented evidence workflow.

---

## 14. Next steps before public release

Before any public release:

1. review this paper draft for overclaims;
2. decide whether the archive candidate should be uploaded to Zenodo;
3. if uploaded, record DOI and update archive metadata;
4. prepare LingBuzz submission text only after DOI exists;
5. update README only after both archive and paper links exist;
6. do not migrate registry labels from Cohort 02 alone.

---

## 15. Completion criteria

This draft is ready for public-review preparation when:

1. all overclaims are removed;
2. support and pressure cases are clearly separated;
3. limitations are preserved;
4. archive SHA is recorded;
5. claim boundaries are preserved;
6. final publish/no-publish decision is made.
