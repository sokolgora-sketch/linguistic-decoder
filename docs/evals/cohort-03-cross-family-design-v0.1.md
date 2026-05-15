# Cohort 03 Cross-Family Stress Test Design v0.1

Status: DESIGN ONLY
Project: ZË-RO
Milestone: Cohort 03
Date created: 2026-05-15

This document defines the first design pass for Cohort 03.

Cohort 03 begins after the Cohort 02 public chain was completed:

- main Cohort 02 LingBuzz paper: `lingbuzz/009986`
- main Cohort 02 evidence archive: `https://doi.org/10.5281/zenodo.20116021`
- cross-model supplement Zenodo archive: `https://doi.org/10.5281/zenodo.20174451`
- cross-model supplement LingBuzz note: `lingbuzz/009994`

This design does not run evaluations, does not create evidence packs, does not update README, and does not change public claims.

## 1. Milestone goal

Cohort 03 tests whether ZË-RO vowel-bracket behavior remains interpretable across language families beyond the Cohort 02 front-rounded and central-vowel publication set.

The milestone goal is not to maximize support.

The milestone goal is to test transfer across families while preserving the same discipline used in Cohort 02:

- support cases stay support cases only when controls separate cleanly enough;
- edge-stressed cases stay edge-stressed;
- pressure cases stay visible;
- no single language or vowel is promoted into a full-framework claim.

## 2. Why Cohort 03 starts with Finnish

Finnish is the safest bridge from Cohort 02 into cross-family testing because it combines three useful properties:

1. it is non-Indo-European;
2. it has clear Latin orthography;
3. it has front vowels and vowel harmony that connect to the Cohort 01 and Cohort 02 front-vowel work.

Finnish also already appears in earlier work through open-front `/ä/`, so it can serve as a bridge rather than a totally new unknown.

Cohort 03 therefore starts with a Finnish front-vowel bridge before moving into Semitic and Indo-Iranian families.

## 3. Cohort 03 family roadmap

Planned family blocks:

### Phase A — Finnish bridge

Family:

- Uralic

Purpose:

- bridge from prior front-vowel work into cross-family testing;
- test open-front, mid front-rounded, and high front-rounded behavior in one language;
- use clean orthography before moving into scripts/transliteration.

Cases:

- Finnish `/ä/`
- Finnish `/ö/`
- Finnish `/y/`

### Phase B — Semitic block

Families / languages:

- Arabic
- Hebrew

Purpose:

- test root-and-pattern languages where vowel behavior interacts with consonantal root structure;
- stress the distinction between vowel signal and consonantal dressing;
- avoid etymology claims and keep this as bracket testing only.

Phase B is planned, not yet locked in this design.

### Phase C — Indo-Iranian block

Families / languages:

- Hindi
- Persian

Purpose:

- test central-vowel, length, and schwa pressure in Indo-Iranian systems;
- compare a high-schwa-pressure case with a simpler modern vowel inventory.

Phase C is planned, not yet locked in this design.

### Phase D — Japonic baseline

Language:

- Japanese

Purpose:

- test a small, stable five-vowel baseline outside the Indo-European/Semitic/Uralic path.

Phase D is planned, not yet locked in this design.

## 4. Phase A Finnish bridge design

Phase A locks three Finnish cases.

All cases use:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `provider`: to be filled per curation source
- `model`: to be filled per curation source
- `sourceEngine*`: leave blank for hand-pasted or assistant-assisted researcher-reviewed tokens
- curation style: assistant-assisted, researcher-reviewed
- evidence export: required before interpretation

### 4.1 Finnish `/ä/` — open-front bridge

Purpose:

- replicate/bridge the earlier Finnish open-front direction;
- test whether `/ä/` continues to behave as a lower/open-front case.

Planned bracket:

- candidate: `V1-V3`
- control: `V2-V3`

Interpretation target:

- If candidate remains cleaner than control, classify as lower/open-front bridge support.
- If both candidate and control are similar, classify as weak/unclear bridge.
- If candidate fails, classify as open-front pressure.

Planned series label:

`cohort03-fi-ae-v1-v3-bridge-v0.1`

Planned run IDs:

- `cohort03-fi-ae-v1-v3-bridge-main-r01`
- `cohort03-fi-ae-v1-v3-bridge-alt-r01`
- `cohort03-fi-ae-v2-v3-control-main-r01`
- `cohort03-fi-ae-v2-v3-control-alt-r01`

### 4.2 Finnish `/ö/` — mid front-rounded bridge

Purpose:

- test whether Finnish `/ö/` patterns closer to low-edge Scandinavian `/ø/` or to a higher front-rounded pattern;
- connect the Uralic bridge to the Cohort 02 Danish/Norwegian/French distinction.

Planned bracket:

- candidate: `V1-V3`
- control: `V2-V5`

Interpretation target:

- If V1-V3 is cleaner than V2-V5, classify as lower front-rounded bridge evidence.
- If V2-V5 is cleaner, classify as mid/front-rounded pressure against the lower placement.
- If both remain intermediate, classify as weak bridge and do not overstate.

Planned series label:

`cohort03-fi-oe-v1-v3-bridge-v0.1`

Planned run IDs:

- `cohort03-fi-oe-v1-v3-bridge-main-r01`
- `cohort03-fi-oe-v1-v3-bridge-alt-r01`
- `cohort03-fi-oe-v2-v5-control-main-r01`
- `cohort03-fi-oe-v2-v5-control-alt-r01`

### 4.3 Finnish `/y/` — high front-rounded bridge

Purpose:

- test whether Finnish `/y/` behaves as a high/front-rounded case;
- prevent all Finnish front vowels from being forced into the same low-edge bracket.

Planned bracket:

- candidate: `V5-V7`
- control: `V2-V5`

Interpretation target:

- If V5-V7 is cleaner than V2-V5, classify as high/front-rounded bridge evidence.
- If V2-V5 is cleaner, classify as high-front pressure against V5-V7.
- If both remain intermediate, classify as weak bridge.
- Do not use Finnish `/y/` as a full-framework claim.

Planned series label:

`cohort03-fi-y-v5-v7-bridge-v0.1`

Planned run IDs:

- `cohort03-fi-y-v5-v7-bridge-main-r01`
- `cohort03-fi-y-v5-v7-bridge-alt-r01`
- `cohort03-fi-y-v2-v5-control-main-r01`
- `cohort03-fi-y-v2-v5-control-alt-r01`

## 5. Token curation rules for Phase A

Detailed token prompts will be created in a separate token-curation instructions document.

This design locks only the rules:

1. Each bucket must contain single orthographic Finnish tokens.
2. No spaces.
3. No punctuation.
4. No duplicate tokens inside a run.
5. No duplicate tokens across buckets inside the same run.
6. Avoid proper names unless explicitly justified.
7. Prefer common natural words over rare dictionary artifacts.
8. Keep `/ä/`, `/ö/`, and `/y/` target buckets visually obvious.
9. Anchor buckets must avoid the target vowel where possible.
10. Assistant output must be researcher-reviewed before scoring.

For Finnish:

- `/ä/` target tokens should contain `ä`.
- `/ö/` target tokens should contain `ö`.
- `/y/` target tokens should contain `y`.
- Anchor buckets should avoid the target letter for that case unless a later curation note justifies the exception.

## 6. Evidence workflow

No scoring is allowed from this design doc alone.

Required sequence:

1. Merge this design doc.
2. Create and merge Cohort 03 token-curation instructions.
3. Generate token sets in fresh assistant sessions.
4. Researcher-review token sets.
5. Run `/evals`.
6. Export each evidence pack.
7. Verify run metadata and checksums.
8. Write result summary only after exported evidence packs are present and inspected.

## 7. Completion criteria for Phase A

Finnish Phase A is complete only when all of the following exist:

- merged design doc;
- merged token-curation instructions;
- three Finnish case bundles:
  - `/ä/`
  - `/ö/`
  - `/y/`
- four runs per case:
  - candidate main
  - candidate alt
  - control main
  - control alt
- exported evidence packs for all runs;
- checksum or evidence-pack manifest;
- result summary with support/weak/pressure classification;
- explicit claim boundaries.

## 8. Claim boundaries

Allowed after this design PR:

- Cohort 03 has started as a design milestone.
- Finnish is the Phase A bridge case.
- Semitic, Indo-Iranian, and Japonic blocks are planned future phases.
- No evidence results exist yet for Cohort 03.

Blocked after this design PR:

- Do not claim Cohort 03 support.
- Do not claim Finnish validates the model.
- Do not claim `/ä/`, `/ö/`, or `/y/` support any bracket before scoring.
- Do not update README publication links.
- Do not create a paper or archive.
- Do not upload anything to Zenodo or LingBuzz.
- Do not mix etymology-origin claims into this bracket test.

## 9. Next step

After this design doc merges, create:

`docs/evals/cohort-03-token-curation-instructions-v0.1.md`

That document should include exact prompts for Finnish `/ä/`, `/ö/`, and `/y/` token generation.
