# ZË-RO Cohort 02 Design Plan v0.1

Status: DESIGN ONLY
Created: 2026-05-07
Cohort: Cohort 02
Depends on: `docs/evals/cohort-battery-workflow-v0.1.md`

This document defines the planned design for Cohort 02 before any token generation, scoring, evidence-pack export, or publication work.

Cohort 02 must not begin with token JSON. It begins with a locked design table.

---

## 1. Purpose

Cohort 02 is the first follow-up battery after the public Cohort 01 publication chain.

Cohort 01 established a working publication pipeline:

- four-run candidate/control case structure;
- `/evals` scoring;
- saved runs;
- series evidence packs;
- public archive packaging;
- Zenodo DOI;
- paper/PDF publication;
- LingBuzz public reference;
- reproduction runbook.

Cohort 02 should test robustness and pressure points, not merely add more cases.

Primary goals:

1. Replicate selected Cohort 01 findings with stricter curation controls.
2. Redesign unresolved pressure cases before retesting them.
3. Separate token-curation effects from bracket behavior.
4. Prepare the ground for later acoustic / VoiceLab bridge work without mixing it into this cohort.

---

## 2. Non-goals

Cohort 02 does not:

- revise Cohort 01 public claims unless a real public error is found;
- change the Cohort 01 Zenodo record except through a formal new version;
- generate token buckets before design is locked;
- score runs from chat memory;
- treat one INTERMEDIATE result as evidence;
- publish until evidence packs are inspected and reproducible.

---

## 3. Workflow authority

Cohort 02 follows:

- `docs/evals/cohort-battery-workflow-v0.1.md`

Required structure per case:

| Ordinal | Role | Meaning |
|---:|---|---|
| 1 | candidate main | First run for proposed bracket |
| 2 | candidate alt | Alternate token set for proposed bracket |
| 3 | control main | First run for comparison bracket |
| 4 | control alt | Alternate token set for comparison bracket |

Required task shape:

- `taskId: T5_INTERMEDIATE_V0_1`
- `inputShape: intermediate_triple`

Required workbench mode:

- `Raw task JSON / wrap into run`

No case is complete until all four ordinals are scored, saved, added to series, exported as an evidence pack, and inspected.

---

## 4. Curation lanes

Cohort 02 should use explicit curation lanes.

| Lane | Name | Purpose | Token source |
|---|---|---|---|
| H | human-only | Control against external-assistant token bias | manually curated by operator |
| X | cross-assistant | Compare token-set effects across assistants | same case, separately generated candidate buckets |
| P | pressure redesign | Rebuild unresolved cases from scratch | human-first, external assistant only after design |
| R | replication | Re-run selected strong / edge findings | human-only preferred |
| A | acoustic bridge prep | Prepare later VoiceLab link | design notes only, no acoustic scoring in this cohort |

Cohort 02 should start with lanes H, P, and R.

Lane X is useful but should not be mixed into the first scoring pack unless the design explicitly calls it.

Lane A is postponed until the linguistic/eval side is stable.

---

## 5. Planned case table

This table is a design plan, not evidence.

| Case ID | Language | Vowel under test | Candidate bracket | Control bracket | Case kind | Curation lane | Hypothesis / purpose | Expected status category |
|---|---|---|---|---|---|---|---|---|
| c02-no-oe-human | Norwegian | `/ø/` | V1-V3 | V2-V5 | replication | H/R | Replicate low-edge front-rounded refinement with human-only tokens. | support if candidate remains cleaner than control |
| c02-da-oe-human | Danish | `/ø/` | V1-V3 | V2-V5 | replication | H/R | Replicate Danish low-edge front-rounded pattern with human-only tokens. | support if candidate remains clean INTERMEDIATE and control pressures low |
| c02-fr-euoe-human | French | `/ø~œ/` | V5-V7 | V2-V5 | high-edge audit | H/R | Re-test French as high-edge front-rounded case under stricter curation. | high-edge support or boundary uncertainty |
| c02-pt-aa-human | Portuguese | `/â/` | V1-V4 | V2-V4 | edge-stress replication | H/R | Test whether Portuguese `/â/` keeps edge-stressed V1-V4 behavior with human-only tokens. | edge-stressed support or unstable |
| c02-tr-ii-redesign | Turkish | `/ı/` | V4-V7 | V5-V7 | pressure redesign | P | Rebuild Turkish `/ı/` as a high-region pressure audit, not bracket support. | unresolved / pressure unless candidate stabilizes clearly |
| c02-ro-a-breve-redesign | Romanian | `/ă/` | V3-V4 | V2-V4 | pressure redesign | P | Rebuild Romanian `/ă/` around central vowel behavior before claiming bracket evidence. | unresolved / pressure unless candidate-control separation appears |
| c02-de-oe-bridge | German | `/ö/` | V2-V4 | V1-V3 | bridge audit | H/R | Re-test German `/ö/` as a stable middle/bridging case, not headline support. | weak / bridging unless strong separation appears |
| c02-sv-oe-bridge | Swedish | `/ö/` | V1-V3 | V2-V5 | bridge audit | H/R | Re-test Swedish `/ö/` as low-edge/bridging case and check whether V1-V3 stays cleaner. | weak / bridging or low-edge support |

---

## 6. Series labels

Series labels must be stable before scoring.

| Case ID | Series label |
|---|---|
| c02-no-oe-human | `t5-no-oe-v1-v3-human-v0.1` |
| c02-da-oe-human | `t5-da-oe-v1-v3-human-v0.1` |
| c02-fr-euoe-human | `t5-fr-euoe-v5-v7-human-v0.1` |
| c02-pt-aa-human | `t5-pt-aa-v1-v4-human-v0.1` |
| c02-tr-ii-redesign | `t5-tr-ii-v4-v7-redesign-v0.1` |
| c02-ro-a-breve-redesign | `t5-ro-a-breve-v3-v4-redesign-v0.1` |
| c02-de-oe-bridge | `t5-de-oe-v2-v4-bridge-v0.1` |
| c02-sv-oe-bridge | `t5-sv-oe-v1-v3-bridge-v0.1` |

---

## 7. Run ID plan

Each case uses four ordinals.

Pattern:

`t5.<language>.<vowel-code>.<bracket>.<case-kind>.<role>.rNN`

### c02-no-oe-human

| Ordinal | Role | Run ID | Label |
|---:|---|---|---|
| 1 | candidate main | `t5.no.oe.v1-v3.human.main.r01` | `no-oe-v1-v3-human-main-r01` |
| 2 | candidate alt | `t5.no.oe.v1-v3.human.alt.r02` | `no-oe-v1-v3-human-alt-r02` |
| 3 | control main | `t5.no.oe.v2-v5.human.ctrl.r03` | `no-oe-v2-v5-human-ctrl-r03` |
| 4 | control alt | `t5.no.oe.v2-v5.human.ctrl-alt.r04` | `no-oe-v2-v5-human-ctrl-alt-r04` |

### c02-da-oe-human

| Ordinal | Role | Run ID | Label |
|---:|---|---|---|
| 1 | candidate main | `t5.da.oe.v1-v3.human.main.r01` | `da-oe-v1-v3-human-main-r01` |
| 2 | candidate alt | `t5.da.oe.v1-v3.human.alt.r02` | `da-oe-v1-v3-human-alt-r02` |
| 3 | control main | `t5.da.oe.v2-v5.human.ctrl.r03` | `da-oe-v2-v5-human-ctrl-r03` |
| 4 | control alt | `t5.da.oe.v2-v5.human.ctrl-alt.r04` | `da-oe-v2-v5-human-ctrl-alt-r04` |

### c02-fr-euoe-human

| Ordinal | Role | Run ID | Label |
|---:|---|---|---|
| 1 | candidate main | `t5.fr.euoe.v5-v7.human.main.r01` | `fr-euoe-v5-v7-human-main-r01` |
| 2 | candidate alt | `t5.fr.euoe.v5-v7.human.alt.r02` | `fr-euoe-v5-v7-human-alt-r02` |
| 3 | control main | `t5.fr.euoe.v2-v5.human.ctrl.r03` | `fr-euoe-v2-v5-human-ctrl-r03` |
| 4 | control alt | `t5.fr.euoe.v2-v5.human.ctrl-alt.r04` | `fr-euoe-v2-v5-human-ctrl-alt-r04` |

### c02-pt-aa-human

| Ordinal | Role | Run ID | Label |
|---:|---|---|---|
| 1 | candidate main | `t5.pt.aa.v1-v4.human.main.r01` | `pt-aa-v1-v4-human-main-r01` |
| 2 | candidate alt | `t5.pt.aa.v1-v4.human.alt.r02` | `pt-aa-v1-v4-human-alt-r02` |
| 3 | control main | `t5.pt.aa.v2-v4.human.ctrl.r03` | `pt-aa-v2-v4-human-ctrl-r03` |
| 4 | control alt | `t5.pt.aa.v2-v4.human.ctrl-alt.r04` | `pt-aa-v2-v4-human-ctrl-alt-r04` |

### c02-tr-ii-redesign

| Ordinal | Role | Run ID | Label |
|---:|---|---|---|
| 1 | candidate main | `t5.tr.ii.v4-v7.redesign.main.r01` | `tr-ii-v4-v7-redesign-main-r01` |
| 2 | candidate alt | `t5.tr.ii.v4-v7.redesign.alt.r02` | `tr-ii-v4-v7-redesign-alt-r02` |
| 3 | control main | `t5.tr.ii.v5-v7.redesign.ctrl.r03` | `tr-ii-v5-v7-redesign-ctrl-r03` |
| 4 | control alt | `t5.tr.ii.v5-v7.redesign.ctrl-alt.r04` | `tr-ii-v5-v7-redesign-ctrl-alt-r04` |

### c02-ro-a-breve-redesign

| Ordinal | Role | Run ID | Label |
|---:|---|---|---|
| 1 | candidate main | `t5.ro.a-breve.v3-v4.redesign.main.r01` | `ro-a-breve-v3-v4-redesign-main-r01` |
| 2 | candidate alt | `t5.ro.a-breve.v3-v4.redesign.alt.r02` | `ro-a-breve-v3-v4-redesign-alt-r02` |
| 3 | control main | `t5.ro.a-breve.v2-v4.redesign.ctrl.r03` | `ro-a-breve-v2-v4-redesign-ctrl-r03` |
| 4 | control alt | `t5.ro.a-breve.v2-v4.redesign.ctrl-alt.r04` | `ro-a-breve-v2-v4-redesign-ctrl-alt-r04` |

### c02-de-oe-bridge

| Ordinal | Role | Run ID | Label |
|---:|---|---|---|
| 1 | candidate main | `t5.de.oe.v2-v4.bridge.main.r01` | `de-oe-v2-v4-bridge-main-r01` |
| 2 | candidate alt | `t5.de.oe.v2-v4.bridge.alt.r02` | `de-oe-v2-v4-bridge-alt-r02` |
| 3 | control main | `t5.de.oe.v1-v3.bridge.ctrl.r03` | `de-oe-v1-v3-bridge-ctrl-r03` |
| 4 | control alt | `t5.de.oe.v1-v3.bridge.ctrl-alt.r04` | `de-oe-v1-v3-bridge-ctrl-alt-r04` |

### c02-sv-oe-bridge

| Ordinal | Role | Run ID | Label |
|---:|---|---|---|
| 1 | candidate main | `t5.sv.oe.v1-v3.bridge.main.r01` | `sv-oe-v1-v3-bridge-main-r01` |
| 2 | candidate alt | `t5.sv.oe.v1-v3.bridge.alt.r02` | `sv-oe-v1-v3-bridge-alt-r02` |
| 3 | control main | `t5.sv.oe.v2-v5.bridge.ctrl.r03` | `sv-oe-v2-v5-bridge-ctrl-r03` |
| 4 | control alt | `t5.sv.oe.v2-v5.bridge.ctrl-alt.r04` | `sv-oe-v2-v5-bridge-ctrl-alt-r04` |

---

## 8. Metadata convention

For Cohort 02 manual or external curation:

| Field | Value |
|---|---|
| provider | `manual` |
| model | `hand-curated` |
| sourceEngineId | `external-llm-curation` |
| sourceEngineVersion | `t5-battery-2026-05-cohort-02-design-v0.1` |
| sourceEngineBuild | `<repo commit used when scoring/exporting>` |

Important:

- `sourceEngineBuild` must be the commit used during scoring/exporting.
- Do not rewrite `sourceEngineBuild` later to a publication commit.
- Do not claim external/manual curation came from `analyze-v1`.

---

## 9. Token curation rules

Token curation is not part of this design PR.

When token curation starts later:

- each bucket should target 30 single-token orthographic words where possible;
- no spaces;
- no punctuation unless the language requires it;
- no duplicates inside bucket;
- no duplicates across buckets;
- target vowel must be preserved in `x_vowel`;
- anchor buckets must be contrastive and clean;
- candidate and alt token sets must be related but not identical;
- every final token set must be duplicate-checked before scoring.

---

## 10. Completion criteria for Cohort 02 design

This design doc is complete when:

1. planned cases are listed;
2. each case has candidate and control brackets;
3. each case has a hypothesis/purpose;
4. each case has a series label;
5. each case has four planned run IDs;
6. curation lanes are declared;
7. no token JSON is included;
8. repo gates pass;
9. PR is merged.

---

## 11. Next milestone after this doc

After this design doc merges:

1. choose the first Cohort 02 subset to run;
2. write a token-curation instruction pack;
3. generate or manually curate token buckets;
4. validate tokens before scoring;
5. run `/evals` four-run series;
6. export and inspect evidence pack;
7. only then decide whether Cohort 02 is becoming a paper/public archive.

Recommended first subset:

- `c02-no-oe-human`
- `c02-da-oe-human`
- `c02-tr-ii-redesign`
- `c02-ro-a-breve-redesign`

Reason:

- two replication controls from strong Cohort 01 refinement;
- two unresolved pressure redesigns.

---

## 12. Open decisions

Before scoring begins, decide:

1. Whether Cohort 02 starts with four cases or all eight planned cases.
2. Whether cross-assistant curation is a separate sub-cohort.
3. Whether human-only token sets should be archived before scoring.
4. Whether VoiceLab/acoustic bridge remains fully postponed until after Cohort 02 linguistic evidence.
5. Whether Turkish `/ı/` needs a different candidate/control bracket before scoring.
