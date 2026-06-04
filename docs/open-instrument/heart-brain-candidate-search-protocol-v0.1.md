# Open Instrument Heart-to-Brain Candidate Search Protocol v0.1

Status: design only.

This document defines the Heart-to-Brain Candidate Search Protocol for Open Instrument.

No code changes are made by this document.
No smoke run is performed by this document.
No archive artifact is added or changed by this document.

This is development protocol design only. It is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, and not proof that any candidate is true.

---

## 1. Purpose

The purpose is to formalize the next Open Instrument architecture step:

    Heart owns structure.
    Brain finds candidates.
    Heart validates truth.

Open Instrument should not ask the LLM to own vowel extraction, vowel path, or whole-word truth.

The deterministic Heart should analyze the word first, then give the Brain constrained chunk-level search targets.

The Brain should search for candidate meanings across languages and return structured candidates with evidence/risk labels.

The Heart should validate the candidates afterward.

---

## 2. Background

Earlier local-provider work showed:

- local provider pipe works;
- archive discipline works;
- scaffold trace/archive discipline works;
- `llama3.1:8b` struggled with `PATH_MATCH` repair;
- prompt doctrine alone did not fix `PATH_MATCH`;
- deterministic repair scaffold improved the retry architecture;
- `qwen3:8b` performed better than `llama3.1:8b` on the five-word scaffold smoke.

The Qwen3 result is useful, but it remains development smoke evidence only.

The architecture should not become:

    Better model equals authority.

The architecture should become:

    Deterministic Heart plus constrained Brain candidate search.

---

## 3. Core architecture

### 3.1 Heart

The Heart is the deterministic Open Instrument / ZË-RO engine.

It owns:

- vowel extraction;
- voice path;
- normalization notes;
- legal transforms;
- chunk segmentation;
- function hints;
- validation;
- false-positive guarding.

### 3.2 Brain

The Brain is the LLM.

It owns:

- candidate search;
- cross-language comparison;
- source/evidence notes;
- semantic/function suggestions;
- false-friend risk labeling;
- null-candidate reporting.

The Brain must not own:

- vowel extraction;
- final vowel path;
- validation;
- claim status;
- origin verdict.

### 3.3 Validation loop

The loop is:

1. Heart extracts structure.
2. Heart generates chunk targets.
3. Brain searches candidates for each chunk.
4. Brain returns structured candidate list.
5. Heart validates candidate truth.
6. Final output preserves candidates, risks, nulls, and validation.

---

## 4. Heart responsibilities

Heart responsibilities:

- receive input word;
- normalize casing/orthography as needed;
- extract Seven-Voice vowel path;
- record normalization such as final `Y->I` where relevant;
- generate legal chunk segmentations;
- generate allowed soft variants, such as `s<->sh` where allowed;
- attach function hints to each vowel/chunk;
- label function hints as ZË-RO doctrine;
- validate Brain candidates;
- preserve null candidates;
- prevent resonance from being treated as origin.

Heart must stay deterministic where possible.

---

## 5. Brain responsibilities

Brain responsibilities:

- receive Heart-provided chunk targets;
- search for candidate forms/meanings across allowed languages;
- return candidates for each chunk;
- return source notes;
- classify evidence type;
- classify candidate type;
- mark false-friend risk;
- return null candidates when no credible match is found.

Brain must not:

- invent vowel paths;
- change Heart chunk targets;
- crown a single origin;
- treat phonetic resonance as proof;
- hide missing candidates;
- skip required fields.

---

## 6. Blocking design issue: chunk segmentation

Chunk segmentation is the blocking design issue.

A word like `study` may be segmented as:

- `STU + DY`
- `STU + DI`
- `SHTU + DI`
- `S + TU + DI`
- `STUD + I`

A deterministic system must define who decides this.

For v0.1, the recommendation is:

    Heart outputs all valid segmentations.

This is more honest than prematurely crowning one segmentation.

It is more expensive, but it preserves evidence.

---

## 7. Chunk segmentation policy v0.1

Heart should produce multiple valid segmentations.

Policy:

- produce multiple valid segmentations;
- preserve original order;
- include smallest meaningful chunks;
- include syllable-like chunks where visible;
- include root-like chunks where plausible;
- include legal soft variants such as `s<->sh` where allowed;
- include final `Y->I` normalization note where relevant;
- do not crown one segmentation too early;
- preserve all segmentations in artifacts.

Segmentation should be treated as candidate structure, not final truth.

---

## 8. Example: study

Input:

    study

Heart extraction:

    visible vowels: U, Y
    normalized path note: final Y may normalize toward I
    working path: U -> Y/I

Candidate segmentations:

- `STU + DY`
- `STU + DI`
- `SHTU + DI`
- `S + TU + DI`
- `STUD + I`

Heart function hints:

- `U`: container, inside, adding, holding, depth
- `I`: insight, intellect, knowing, line/point

Function hint source:

    ZE-RO doctrine

Brain task:

- search for `STU`, `SHTU`, `DI`, `TU`, `DY`, `STUD`, and `I` candidates;
- search across configured languages;
- return candidates with evidence/risk labels;
- return null candidates when no credible match exists.

Possible candidate examples to investigate:

- Albanian `di` as know/knowledge candidate;
- Albanian `shtu` as add/put candidate;
- Latin/Germanic historical candidates for `study`;
- other cross-language resonances only if marked with risk.

No candidate should be treated as true only because it sounds similar.

---

## 9. Doctrine-source labeling

Function hints must be labeled as doctrine.

Example fields:

- `voice`: `U`
- `functionHint`: `container`, `inside`, `adding`, `holding`, `depth`
- `functionHintSource`: `ZE-RO doctrine`

This prevents doctrine assumptions from being confused with external linguistic evidence.

The artifact must make clear what comes from:

- deterministic extraction;
- ZË-RO doctrine;
- LLM candidate search;
- external lexical evidence;
- Heart validation.

---

## 10. Brain output schema

Brain output must be structured.

Required fields:

- `segmentationId`
- `chunk`
- `language`
- `candidateForm`
- `meaning`
- `functionFit`
- `sourceNote`
- `evidenceType`
- `candidateType`
- `falseFriendRisk`
- `nullCandidate`
- `notes`

Example non-null candidate:

- `segmentationId`: `study.segmentation.002`
- `chunk`: `DI`
- `language`: `Albanian`
- `candidateForm`: `di`
- `meaning`: `know`
- `functionFit`: `aligns with I as knowing/insight`
- `sourceNote`: `common Albanian lexical item; source check required`
- `evidenceType`: `living_lexical`
- `candidateType`: `strong_living_match`
- `falseFriendRisk`: `medium`
- `nullCandidate`: `false`
- `notes`: `Candidate supports DI as knowledge-function chunk, not whole-word origin by itself.`

All fields are required.

If no credible candidate is found, Brain must return a null candidate.

---

## 11. Required candidate types

Allowed candidate types:

- `strong_living_match`
- `historical_match`
- `functional_resonance`
- `phonetic_resonance`
- `weak_resonance`
- `likely_false_friend`
- `null_candidate`

Candidate type is required.

It is not optional.

---

## 12. Null candidate path

Null candidates are required when no credible match is found.

A null candidate means:

    Brain searched the target and found no credible candidate under the current constraints.

Null candidate output fields:

- `segmentationId`: `study.segmentation.003`
- `chunk`: `DY`
- `language`: `Albanian`
- `candidateForm`: empty string
- `meaning`: empty string
- `functionFit`: empty string
- `sourceNote`: `No credible candidate found under current constraints.`
- `evidenceType`: `none`
- `candidateType`: `null_candidate`
- `falseFriendRisk`: `none`
- `nullCandidate`: `true`
- `notes`: `Absence recorded as evidence.`

Silence is not allowed.

Null evidence is evidence.

---

## 13. False-positive guard

Short chunks create many accidental matches.

Examples:

- `DI`
- `TU`
- `I`
- `STU`

Brain must mark false-friend risk.

Heart must not treat phonetic resonance as origin.

Resonance can be useful, but it must be labeled.

Artifact outputs must separate:

- historical match;
- living lexical match;
- functional resonance;
- phonetic resonance;
- likely false friend;
- null candidate.

---

## 14. Artifact requirements

Future artifacts for this protocol must preserve:

- input word;
- Heart input;
- Heart vowel extraction;
- normalization notes;
- all segmentations;
- function hints;
- function hint source labels;
- Brain candidate list;
- Brain candidate outputs;
- null candidates;
- false-friend risk;
- Heart validation result;
- final claim boundary.

Artifacts must preserve all candidate segmentations even if one looks stronger.

Do not collapse candidates into a single story.

---

## 15. Non-goals

This protocol does not:

- implement chunk segmentation;
- implement Brain candidate search;
- change prompts;
- change verifier logic;
- change parser logic;
- change scorer logic;
- run smoke;
- add artifacts;
- expand to ten-word smoke;
- make public claims;
- make publication claims;
- treat local LLM output as authority.

---

## 16. Claim boundary

This is development protocol design only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- proof that any chunk candidate is true;
- proof that any language is the origin;
- a reason to change the default provider from `mock`.

Allowed internal reading:

- Heart-to-Brain separation is the next architecture milestone.
- Heart should own structure.
- Brain should search candidates.
- Heart should validate again.
- chunk segmentation is the blocking design issue.

Blocked reading:

- Qwen3 result proves model authority;
- LLM output can replace deterministic validation;
- resonance equals origin;
- doctrine hints are external linguistic evidence.

---

## 17. Recommended implementation phases

### Phase 1 — Protocol design

This PR.

Define Heart/Brain boundaries and candidate-search contract.

### Phase 2 — Chunk segmentation design/helper

Define deterministic segmentation policy and helper.

### Phase 3 — Brain candidate schema/prompt

Define strict Brain output schema and prompt contract.

### Phase 4 — Study-only prototype artifact

Run one controlled `study` prototype using Heart-generated segmentations.

Archive all candidates, null candidates, and validation.

### Phase 5 — Multi-word protocol smoke

Only after the `study` prototype is reviewed, run a small multi-word protocol smoke.

---

## 18. Completion definition

This protocol design is complete when:

- Heart responsibilities are defined;
- Brain responsibilities are defined;
- chunk segmentation issue is explicit;
- v0.1 segmentation policy is defined;
- `study` example is included;
- doctrine-source labeling is required;
- Brain output schema is defined;
- candidate types are required;
- null candidate path is required;
- false-positive guard is defined;
- artifact requirements are defined;
- non-goals are explicit;
- claim boundaries are explicit;
- no code changes are made;
- no artifacts are changed;
- local validation passes.
