# Open Instrument Heart Chunk Segmentation Policy v0.1

Status: design only.

This document defines the Heart-owned chunk segmentation policy for Open Instrument.

No code changes are made by this document.
No smoke run is performed by this document.
No archive artifact is added or changed by this document.

This is development design only. It is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not proof that any segmentation is true, and not proof that any candidate origin is true.

---

## 1. Purpose

The Heart-to-Brain Candidate Search Protocol requires a deterministic answer to a blocking question:

    Who decides STU + DI vs S + TU + DI vs STUD + I?

The answer for v0.1:

    Heart decides the allowed segmentation set.

Brain must not invent segmentation.

Brain receives Heart-approved segmentations and searches candidate meanings per chunk.

Heart validates again.

---

## 2. Background

PR #1162 introduced the Heart-to-Brain Candidate Search Protocol.

Core architecture:

- Heart owns structure.
- Brain finds candidates.
- Heart validates truth.

PR #1162 also identified chunk segmentation as the blocking design issue.

A word such as `study` may be segmented in several ways:

- `STU + DY`
- `STU + DI`
- `SHTU + DI`
- `S + TU + DI`
- `STUD + I`

If segmentation is left to the LLM, the Brain becomes structural authority.

That is not allowed.

---

## 3. Core policy

Heart owns segmentation.

Brain must not:

- create new segmentations;
- change chunk order;
- hide segmentation uncertainty;
- crown a segmentation as origin;
- treat resonance as proof.

For v0.1, Heart outputs all valid segmentations.

Segmentations are candidate structures, not final truth.

The artifact must preserve all valid segmentations.

---

## 4. Segmentation ID format

Segmentation IDs must be deterministic and stable.

Format:

    <normalizedWord>.segmentation.<threeDigitIndex>

Examples:

- `study.segmentation.001`
- `study.segmentation.002`
- `study.segmentation.003`

Sorting must be deterministic.

Do not reuse an ID for a different segmentation.

---

## 5. Segmentation object fields

Each segmentation object should include:

- `segmentationId`
- `word`
- `normalizedWord`
- `chunks`
- `chunkVariants`
- `voicePath`
- `normalizationNotes`
- `segmentationType`
- `legalTransforms`
- `functionHints`
- `functionHintSource`
- `status`
- `riskNotes`

Example object fields:

- `segmentationId`: `study.segmentation.002`
- `word`: `study`
- `normalizedWord`: `study`
- `chunks`: `STU`, `DI`
- `chunkVariants`: `DI` variant of `DY` with `FINAL_Y_TO_I`
- `voicePath`: `U`, `I`
- `normalizationNotes`: `final Y may normalize toward I`
- `segmentationType`: `vowel_anchor_split`
- `legalTransforms`: `FINAL_Y_TO_I`
- `functionHints`: `U` attached to `STU`, `I` attached to `DI`
- `functionHintSource`: `ZE-RO doctrine`
- `status`: `candidate_structure`
- `riskNotes`: `Y->I normalization requires explicit marking`

All fields are required unless the future implementation explicitly defines optionality.

---

## 6. Segmentation types

Allowed segmentation types:

- `visible_syllable_like`
- `vowel_anchor_split`
- `soft_variant_split`
- `root_like_split`
- `micro_chunk_split`
- `whole_form_with_terminal_vowel`

### 6.1 `visible_syllable_like`

A segmentation following visible spelling or syllable-like grouping.

Example:

    STU + DY

### 6.2 `vowel_anchor_split`

A segmentation where chunks are organized around vowel-bearing units.

Example:

    STU + DI

### 6.3 `soft_variant_split`

A segmentation using a legal soft variant.

Example:

    SHTU + DI

### 6.4 `root_like_split`

A segmentation preserving a larger root-like block.

Example:

    STUD + I

### 6.5 `micro_chunk_split`

A smaller segmentation exposing prefix or micro-units.

Example:

    S + TU + DI

### 6.6 `whole_form_with_terminal_vowel`

A segmentation preserving a whole form with a final vowel or vowel-normalized tail.

Example:

    STUD + I

---

## 7. Chunk rules

Chunk rules:

- preserve original order;
- every segmentation must cover the full word or explicitly mark omitted material;
- prefer chunks with at least one vowel-bearing unit where possible;
- allow consonant-only prefixes only when attached to a vowel-bearing chunk or marked as prefix material;
- do not reorder chunks;
- do not invent hidden vowels;
- preserve visible spelling unless a legal transform is declared;
- record normalization notes where transforms are used;
- preserve segmentation uncertainty.

Every segmentation must be auditable.

---

## 8. Legal transforms

Allowed v0.1 transforms:

- `S_TO_SH`
- `SH_TO_S`
- `FINAL_Y_TO_I`
- `SEVEN_VOICE_VOWEL_NORMALIZATION`

Rules:

- `s<->sh` softening must be explicit.
- final `Y->I` must be explicit.
- vowel normalization must use only Seven-Voice vowels.
- no unmarked transforms are allowed.

Seven-Voice vowels:

    A, E, I, O, U, Y, Ë

---

## 9. Ranking and sorting

Do not crown a winner.

Sort by deterministic priority:

1. visible spelling segmentation;
2. vowel-anchor segmentation;
3. legal soft variants;
4. micro-chunks;
5. root-like variants.

Sorting is for stable output only.

Sorting is not evidence ranking.

All valid segmentations must be preserved in artifacts.

---

## 10. Invalid segmentation rules

Invalid segmentation includes:

- reordering material;
- inventing vowels;
- deleting material without marking it;
- changing word form without legal transform;
- hiding uncertainty;
- letting Brain create the segmentation;
- treating segmentation as proof of origin;
- omitting risk notes when transforms are used.

Invalid segmentations should be rejected or recorded as rejected structures.

---

## 11. Study example

Input:

    study

Visible vowels:

    U, Y

Normalization note:

    final Y may normalize toward I

Working path variants:

- `U -> Y`
- `U -> I`

### 11.1 `study.segmentation.001`

Segmentation:

    STU + DY

Type:

    visible_syllable_like

Chunks:

- `STU`
- `DY`

Voice path:

    U -> Y

Legal transforms:

- none

Risk notes:

- `DY` may require comparison with final `Y->I` normalized variant.

### 11.2 `study.segmentation.002`

Segmentation:

    STU + DI

Type:

    vowel_anchor_split

Chunks:

- `STU`
- `DI`

Voice path:

    U -> I

Legal transforms:

- `FINAL_Y_TO_I`

Risk notes:

- final `Y->I` normalization must be explicit.
- Brain must not treat `DI` candidate as whole-word origin by itself.

### 11.3 `study.segmentation.003`

Segmentation:

    SHTU + DI

Type:

    soft_variant_split

Chunks:

- `SHTU`
- `DI`

Voice path:

    U -> I

Legal transforms:

- `S_TO_SH`
- `FINAL_Y_TO_I`

Risk notes:

- `s<->sh` softening must be justified.
- Albanian-like resonance must be marked as candidate evidence, not proof.

### 11.4 `study.segmentation.004`

Segmentation:

    S + TU + DI

Type:

    micro_chunk_split

Chunks:

- `S`
- `TU`
- `DI`

Voice path:

    U -> I

Legal transforms:

- `FINAL_Y_TO_I`

Risk notes:

- `S` is consonant-only and must be marked as prefix/consonant material.
- short chunks create high false-positive risk.

### 11.5 `study.segmentation.005`

Segmentation:

    STUD + I

Type:

    root_like_split

Chunks:

- `STUD`
- `I`

Voice path:

    U -> I

Legal transforms:

- `FINAL_Y_TO_I`

Risk notes:

- root-like chunk may preserve historical spelling better.
- terminal `I` requires final `Y->I` note.

---

## 12. Function hints

Function hints must be chunk/voice attached.

Function hints must include source label:

    ZE-RO doctrine

Example fields:

- `voice`: `I`
- `chunk`: `DI`
- `hints`: `insight`, `intellect`, `knowing`, `line/point`
- `functionHintSource`: `ZE-RO doctrine`

Function hints are not external linguistic evidence.

They are doctrine constraints used to guide candidate search.

---

## 13. Brain contract

Brain receives only Heart-approved segmentations.

Brain must:

- search candidates per chunk;
- preserve `segmentationId`;
- preserve chunk spelling;
- preserve declared transforms;
- return candidate types;
- return false-friend risk;
- return `null_candidate` when no credible candidate exists.

Brain must not:

- create new segmentation;
- remove chunks;
- reorder chunks;
- invent transforms;
- claim origin;
- treat resonance as proof.

---

## 14. Artifact requirements

Future artifacts must preserve:

- input word;
- normalized word;
- all segmentation objects;
- rejected/invalid segmentation notes if generated;
- chunk variants;
- legal transforms;
- normalization notes;
- function hints;
- function hint source labels;
- risk notes;
- Brain candidate outputs;
- null candidates;
- Heart validation results.

Artifacts must not collapse segmentations into a single story.

---

## 15. Non-goals

This policy does not:

- implement segmentation helper;
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
- touch evals or Cohort evidence.

---

## 16. Claim boundary

This is development design only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- proof that any segmentation is true;
- proof that any candidate origin is true;
- a reason to change the default provider from `mock`.

Allowed internal reading:

- Heart owns segmentation.
- Brain searches within Heart-approved segmentation.
- all valid segmentations should be preserved in artifacts.

Blocked reading:

- any `study` segmentation is now proven;
- any language candidate is proven origin;
- function hints are external linguistic evidence;
- Qwen3 output can replace Heart validation.

---

## 17. Recommended implementation phases

### Phase 1 — Segmentation policy doc

This PR.

### Phase 2 — Deterministic segmentation helper

Implement a helper that returns the v0.1 segmentation objects.

### Phase 3 — Focused tests for `study`

Test the required `study` segmentations:

- `STU + DY`
- `STU + DI`
- `SHTU + DI`
- `S + TU + DI`
- `STUD + I`

### Phase 4 — Brain candidate schema/prompt design

Define strict Brain candidate output.

### Phase 5 — Study-only Heart-to-Brain prototype artifact

Run one controlled `study` artifact preserving segmentations, candidates, nulls, and validation.

---

## 18. Completion definition

This policy is complete when:

- Heart-owned segmentation is defined;
- segmentation ID format is defined;
- segmentation object fields are defined;
- segmentation types are defined;
- chunk rules are defined;
- legal transforms are defined;
- sorting policy is defined;
- invalid segmentation rules are defined;
- `study` examples are included;
- function hint source labeling is required;
- Brain contract is defined;
- artifact requirements are defined;
- non-goals are explicit;
- claim boundaries are explicit;
- no code changes are made;
- no artifacts are changed;
- local validation passes.
