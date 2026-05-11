# Cohort 02 Cross-Model Replication Plan v0.1

Status: DESIGN ONLY
Project: ZË-RO
Cohort: Cohort 02 follow-up
Target case: French `/ø~œ/`
Planned task: `T5_INTERMEDIATE_V0_1`
Planned candidate bracket: V5-V7
Planned control bracket: V2-V5

This document plans a cross-model replication of the strongest Cohort 02 support case.

It does not add tokens, run scoring, interpret new results, update README, change registry labels, or change any published Cohort 02 claim.

## 1. Purpose

Cohort 02 identified French `/ø~œ/` as the strongest current support case.

The published Cohort 02 result was:

- candidate bracket V5-V7: both runs returned `INTERMEDIATE`;
- control bracket V2-V5: both controls returned `COLLAPSED_HIGH`;
- interpretation: strongest Cohort 02 support case, not proof of the full framework.

The purpose of this follow-up is to test whether the same candidate/control separation survives a second curation/model source.

This is a replication-strengthening step, not a new publication claim.

## 2. Public context

Published preprint:

- LingBuzz reference: `lingbuzz/009986`
- LingBuzz URL: `https://ling.auf.net/lingbuzz/009986`

Evidence archive:

- Zenodo record DOI: `https://doi.org/10.5281/zenodo.20116021`
- Zenodo all-versions DOI: `https://doi.org/10.5281/zenodo.20116020`

Repo source paper:

- `docs/evals/cohort-02-paper-preprint-v0.6.md`

Repo publication record:

- `docs/evals/cohort-02-lingbuzz-publication-v0.1.md`

## 3. Why French first

French `/ø~œ/` is the correct first replication target because it had the cleanest candidate/control separation in Cohort 02.

It is stronger than Norwegian `/ø/` and Danish `/ø/` because those controls remained `INTERMEDIATE`, even if weaker.

It is safer than Portuguese `/â/`, Turkish `/ı/`, or Romanian `/ă/` because those cases are explicitly edge-stressed, pressure-audit, or unresolved.

French therefore gives the cleanest test of model/curation invariance.

## 4. Non-goals

This plan does not:

- run `/evals`;
- generate bucket JSON;
- create evidence packs;
- upload to Zenodo;
- submit to LingBuzz;
- update README;
- migrate registry labels;
- revise Cohort 02 published claims;
- claim that French alone proves the full ZË-RO framework.

## 5. Replication design

### 5.1 Source independence

Use a curation/model source different from the source used for the published Cohort 02 researcher-reviewed run.

Preferred options:

1. Claude-assisted, researcher-reviewed;
2. Gemini-assisted, researcher-reviewed;
3. Grok-assisted, researcher-reviewed.

Only one source should be used for the first replication pass. Do not mix models inside the same run series.

### 5.2 Run shape

Use the same four-run candidate/control shape:

| Run | Bracket | Role |
|---|---|---|
| r01 | V5-V7 | candidate main |
| r02 | V5-V7 | candidate alt |
| r03 | V2-V5 | control main |
| r04 | V2-V5 | control alt |

### 5.3 Planned series label

Use this neutral planned label until the actual external source is chosen:

`t5-fr-euoe-v5-v7-crossmodel-v0.1`

When the source is chosen, replace `crossmodel` with a concrete source label, for example:

- `claude-reviewed`
- `gemini-reviewed`
- `grok-reviewed`

Do not use a vague label in final saved runs.

### 5.4 Planned run IDs

Placeholder IDs:

- `t5.fr.euoe.v5-v7.crossmodel.main.r01`
- `t5.fr.euoe.v5-v7.crossmodel.alt.r02`
- `t5.fr.euoe.v2-v5.crossmodel.ctrl.r03`
- `t5.fr.euoe.v2-v5.crossmodel.ctrl-alt.r04`

Final IDs must replace `crossmodel` with the selected source label.

## 6. Planned `/evals` fields

Use `/evals` on localhost or production only after the source tokens are curated and manually reviewed.

Required fields:

- `evalRunVersion`: `evalRun.v0.1`
- `evalSpecVersion`: `evalSpec.v0.1`
- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `fr`
- `vowelUnderTest`: `ø~œ`
- candidate bracket:
  - `anchorLow`: `V5`
  - `anchorHigh`: `V7`
- control bracket:
  - `anchorLow`: `V2`
  - `anchorHigh`: `V5`

Run metadata:

- `provider`: selected external source provider
- `model`: exact model/source label used for curation
- `label`: source-specific run label
- `sourceEngineId`: leave blank for hand-pasted external-model outputs
- `sourceEngineVersion`: leave blank for hand-pasted external-model outputs
- `sourceEngineBuild`: leave blank for hand-pasted external-model outputs

## 7. Token curation rules

Token curation must follow the existing Cohort 02 curation discipline.

Rules:

- tokens must be single orthographic tokens;
- no spaces;
- no punctuation;
- no duplicate tokens across buckets;
- avoid named entities unless deliberately justified;
- avoid mixed-language tokens;
- avoid words where the target grapheme does not represent the intended French vowel zone;
- manually review all model-suggested tokens before scoring.

The token source must be recorded in notes.

## 8. Evidence requirements

A successful replication package must preserve:

- exact input JSON for all four runs;
- selected source model/provider;
- prompt used to generate or curate tokens;
- manually reviewed final token buckets;
- saved run IDs;
- run metadata;
- score outputs;
- copied CSV rows;
- report markdown;
- PDF exports;
- series evidence pack ZIP;
- checksum file;
- interpretation note.

No result should be cited unless its evidence artifacts are preserved.

## 9. Interpretation classes

### Replicated support

Use only if:

- both V5-V7 candidate runs return `INTERMEDIATE`;
- both V2-V5 controls return `COLLAPSED_HIGH`, or clearly worse high-boundary pressure;
- no major curation flaw is found.

Interpretation:

French `/ø~œ/` cross-model replication supports the Cohort 02 high-edge finding.

### Partial replication

Use if:

- V5-V7 candidate runs remain `INTERMEDIATE`;
- V2-V5 controls do not fully collapse but remain weaker or more boundary-stressed.

Interpretation:

French `/ø~œ/` remains supportive, but cross-model separation is weaker than the published Cohort 02 run.

### Failed replication

Use if:

- V5-V7 candidate runs collapse or exceed boundaries;
- controls perform as well as or better than candidates;
- token curation contains an unfixable flaw.

Interpretation:

French `/ø~œ/` requires audit before any stronger claim.

### Invalid run

Use if:

- wrong bracket was used;
- wrong `vowelUnderTest` was used;
- wrong language set was used;
- duplicated or malformed tokens affected the run;
- exported metadata contradicts intended run identity.

Invalid runs must be preserved as excluded artifacts if they affect the audit trail.

## 10. Claim boundaries

Allowed after design-only PR:

- We have a plan for cross-model replication of French `/ø~œ/`.

Blocked after design-only PR:

- Cross-model replication succeeded.
- French proves the high-edge bracket.
- Cohort 02 proves the framework.
- Registry labels should be migrated.
- README should be changed again.
- A new Zenodo archive should be created.

## 11. Completion criteria for this plan

This planning milestone is complete when:

- the plan is merged;
- no scoring has been run as part of the plan PR;
- no token JSON has been committed;
- no publication claims have changed;
- gates pass.

## 12. Next operational step after merge

After this plan lands, create a separate token-curation task for one selected external source.

The next task should produce:

- a source-specific token-curation prompt;
- final reviewed bucket JSON;
- exact `/evals` fields;
- four run IDs;
- no scoring until the bucket JSON is reviewed.
