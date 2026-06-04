# Open Instrument Brain Candidate Search Schema v0.1

Status: design only.

This document defines the Brain candidate search schema and prompt contract for Open Instrument Heart-to-Brain candidate search.

No code changes are made by this document.

No prompt implementation is added by this document.

No smoke run is performed by this document.

No archive artifact is added or changed by this document.

This is development schema design only. It is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not proof that any candidate is true, and not proof that any language is origin.

---

## 1. Purpose

The purpose is to define what the Brain may return when the Heart gives it chunk-level candidate search targets.

The Brain is an LLM candidate finder.

The Brain does not own:

- segmentation;
- vowel extraction;
- voice path;
- legal transforms;
- validation;
- origin verdict.

The Brain searches for candidate meanings and returns structured evidence/risk-labeled candidates.

---

## 2. Background

PR #1162 defined the Heart-to-Brain Candidate Search Protocol:

    Heart owns structure.
    Brain finds candidates.
    Heart validates truth.

PR #1163 defined the Heart chunk segmentation policy.

PR #1164 implemented the Heart chunk segmentation helper for `study`.

The next step is to define the Brain candidate output contract before implementing any Brain prompt.

Without a strict schema, the Brain can drift into storytelling, hallucinated certainty, or origin claims.

---

## 3. Core Brain Role

Brain responsibilities:

- search candidate meanings for Heart-approved chunks;
- compare candidate meaning to Heart-provided function hints;
- return source/evidence notes;
- return false-friend risk;
- return null candidates when no credible match is found.

Brain must not:

- invent new segmentations;
- change chunks;
- invent transforms;
- alter voice path;
- crown origin;
- treat resonance as proof;
- hide uncertainty.

Core decision:

- Brain searches candidates.
- Brain does not own segmentation.
- Brain does not own vowel path.
- Brain does not own transforms.
- Brain does not own validation.
- Brain does not crown origin.

---

## 4. Brain Input Object

The Brain input object must include:

- `word`
- `normalizedWord`
- `segmentationId`
- `chunks`
- `chunkVariants`
- `voicePath`
- `legalTransforms`
- `normalizationNotes`
- `functionHints`
- `functionHintSource`
- `targetLanguages`
- `searchMode`

Example input object for `study.segmentation.003`:

    {
      "word": "study",
      "normalizedWord": "study",
      "segmentationId": "study.segmentation.003",
      "chunks": ["SHTU", "DI"],
      "chunkVariants": [
        {
          "chunk": "SHTU",
          "variantOf": "STU",
          "transform": "S_TO_SH"
        },
        {
          "chunk": "DI",
          "variantOf": "DY",
          "transform": "FINAL_Y_TO_I"
        }
      ],
      "voicePath": ["U", "I"],
      "legalTransforms": ["S_TO_SH", "FINAL_Y_TO_I"],
      "normalizationNotes": ["S_TO_SH softening applied", "final Y may normalize toward I"],
      "functionHints": [
        {
          "voice": "U",
          "chunk": "SHTU",
          "hints": ["container", "inside", "adding", "holding", "depth"],
          "functionHintSource": "ZE-RO doctrine"
        },
        {
          "voice": "I",
          "chunk": "DI",
          "hints": ["insight", "intellect", "knowing", "line/point"],
          "functionHintSource": "ZE-RO doctrine"
        }
      ],
      "functionHintSource": "ZE-RO doctrine",
      "targetLanguages": ["Albanian", "Latin", "Greek", "Sanskrit", "Chinese", "Germanic", "Slavic", "Semitic"],
      "searchMode": "chunk_candidate_search_v0.1"
    }

The Brain must preserve this input structure in its output artifacts.

---

## 5. Brain Output Object

The Brain output object must include:

- `word`
- `segmentationId`
- `chunkCandidates`
- `nullCandidates`
- `warnings`
- `claimBoundary`

Example output shell:

    {
      "word": "study",
      "segmentationId": "study.segmentation.003",
      "chunkCandidates": [],
      "nullCandidates": [],
      "warnings": [],
      "claimBoundary": {
        "originClaim": false,
        "scientificEvidence": false,
        "publicationEvidence": false,
        "evalEvidence": false,
        "cohortEvidence": false,
        "developmentCandidateSearchOnly": true
      }
    }

The Brain must return strict JSON only.

No prose outside JSON.

---

## 6. Required Chunk Candidate Fields

Each candidate must include:

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

Example candidate:

    {
      "segmentationId": "study.segmentation.003",
      "chunk": "DI",
      "language": "Albanian",
      "candidateForm": "di",
      "meaning": "know",
      "functionFit": "candidate meaning aligns with I as knowing/insight under ZE-RO doctrine",
      "sourceNote": "common Albanian lexical item; source check required",
      "evidenceType": "living_lexical",
      "candidateType": "strong_living_match",
      "falseFriendRisk": "medium",
      "nullCandidate": false,
      "notes": "Candidate may explain DI as a knowledge-function chunk, not whole-word origin by itself."
    }

All fields are required.

Missing fields invalidate the Brain output.

---

## 7. Candidate Types

Allowed candidate types:

- `strong_living_match`
- `historical_match`
- `functional_resonance`
- `phonetic_resonance`
- `weak_resonance`
- `likely_false_friend`
- `null_candidate`

`candidateType` is required for every candidate.

It is not optional.

---

## 8. Evidence Types

Allowed evidence types:

- `living_lexical`
- `historical_etymology`
- `dictionary_attested`
- `phonetic_only`
- `semantic_only`
- `doctrine_alignment`
- `none`

`evidenceType` is required for every candidate.

Doctrine alignment is not external linguistic evidence.

---

## 9. False-Friend Risk

Allowed false-friend risk values:

- `none`
- `low`
- `medium`
- `high`

`falseFriendRisk` is required for every candidate.

Short chunks such as `DI`, `TU`, `I`, and `STU` usually require at least `medium` risk unless there is strong evidence.

---

## 10. Null Candidate Rules

Null candidates are required when no credible candidate is found.

Silence is invalid.

Null evidence is evidence.

Null candidate object:

    {
      "segmentationId": "study.segmentation.003",
      "chunk": "SHTU",
      "language": "Chinese",
      "candidateForm": "",
      "meaning": "",
      "functionFit": "",
      "sourceNote": "No credible candidate found under current constraints.",
      "evidenceType": "none",
      "candidateType": "null_candidate",
      "falseFriendRisk": "none",
      "nullCandidate": true,
      "notes": "Absence recorded as evidence."
    }

A null candidate is not a failure.

It is a clean negative result for a target.

---

## 11. Function Fit Rules

The Brain may compare candidate meaning against Heart function hints.

However:

- function hints come from `ZE-RO doctrine`;
- doctrine alignment is not external linguistic evidence;
- candidate meaning must not be forced to fit doctrine;
- weak fit should be labeled honestly;
- a doctrine fit does not prove origin.

Function fit must distinguish:

- semantic fit;
- phonetic fit;
- doctrine fit;
- historical evidence.

---

## 12. Hard Prohibitions

The Brain must not:

- create new segmentation;
- reorder chunks;
- remove chunks;
- invent transforms;
- change vowel path;
- alter `segmentationId`;
- claim origin;
- treat resonance as proof;
- hide nulls;
- hallucinate source certainty;
- imply external evidence where only doctrine alignment exists.

If uncertain, the Brain should use:

- `null_candidate`, or
- `falseFriendRisk: "high"`, or
- `candidateType: "weak_resonance"`.

---

## 13. Required Study Example

Input target:

    study.segmentation.003
    chunks: SHTU + DI
    legal transforms: S_TO_SH, FINAL_Y_TO_I
    voice path: U -> I

Example output candidates:

    {
      "word": "study",
      "segmentationId": "study.segmentation.003",
      "chunkCandidates": [
        {
          "segmentationId": "study.segmentation.003",
          "chunk": "SHTU",
          "language": "Albanian",
          "candidateForm": "shtu",
          "meaning": "add / put / increase",
          "functionFit": "candidate meaning may align with U as adding/holding under ZE-RO doctrine",
          "sourceNote": "Albanian lexical candidate; source check required",
          "evidenceType": "living_lexical",
          "candidateType": "strong_living_match",
          "falseFriendRisk": "medium",
          "nullCandidate": false,
          "notes": "Candidate may explain SHTU as add/put-function chunk, not whole-word origin by itself."
        },
        {
          "segmentationId": "study.segmentation.003",
          "chunk": "DI",
          "language": "Albanian",
          "candidateForm": "di",
          "meaning": "know",
          "functionFit": "candidate meaning may align with I as knowing/insight under ZE-RO doctrine",
          "sourceNote": "Albanian lexical candidate; source check required",
          "evidenceType": "living_lexical",
          "candidateType": "strong_living_match",
          "falseFriendRisk": "medium",
          "nullCandidate": false,
          "notes": "Candidate may explain DI as knowledge-function chunk, not whole-word origin by itself."
        }
      ],
      "nullCandidates": [],
      "warnings": [
        "Albanian candidates are chunk candidates only, not whole-word origin claims.",
        "Short chunks have false-positive risk."
      ],
      "claimBoundary": {
        "originClaim": false,
        "scientificEvidence": false,
        "publicationEvidence": false,
        "evalEvidence": false,
        "cohortEvidence": false,
        "developmentCandidateSearchOnly": true
      }
    }

The example is schema guidance, not a validated linguistic result.

Albanian `shtu` may be returned as a candidate for `SHTU`.

Albanian `di` may be returned as a candidate for `DI`.

Both must include source notes and false-friend risk.

Neither may be claimed as whole-word origin.

---

## 14. Null Candidate Example

Example null candidate:

    {
      "segmentationId": "study.segmentation.003",
      "chunk": "SHTU",
      "language": "Chinese",
      "candidateForm": "",
      "meaning": "",
      "functionFit": "",
      "sourceNote": "No credible candidate found under current constraints.",
      "evidenceType": "none",
      "candidateType": "null_candidate",
      "falseFriendRisk": "none",
      "nullCandidate": true,
      "notes": "Absence recorded as evidence."
    }

The Brain must return this rather than hallucinating a weak match.

---

## 15. Prompt Contract

Prompt contract:

- return strict JSON only;
- no prose outside JSON;
- preserve `segmentationId`;
- preserve chunks exactly;
- use only Heart-approved chunks;
- include every required field;
- include `null_candidate` when no credible match exists;
- never claim origin;
- never treat resonance as proof;
- label uncertainty;
- label false-friend risk;
- fail honestly when needed.

If uncertain, use `null_candidate` or high false-friend risk.

---

## 16. Artifact Requirements

Future artifacts must preserve:

- Brain input object;
- Brain raw output;
- parsed Brain candidates;
- null candidates;
- warnings;
- claim boundary;
- source notes;
- evidence type;
- candidate type;
- false-friend risk;
- Heart validation result.

Artifacts must not collapse chunk candidates into a single story.

---

## 17. Non-Goals

This schema does not:

- implement the Brain prompt;
- implement candidate search;
- call any LLM;
- run smoke;
- add artifacts;
- change verifier logic;
- change parser logic;
- change scorer logic;
- make public claims;
- make publication claims;
- touch evals or Cohort evidence.

---

## 18. Claim Boundary

This is development schema design only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- proof that any candidate is true;
- proof that any language is origin;
- a reason to change the default provider from `mock`.

Allowed internal reading:

- Brain candidate search needs a strict JSON schema before implementation.
- Null candidates are required.
- Candidate type and false-friend risk are required.
- Doctrine alignment must be separated from external linguistic evidence.

Blocked reading:

- the example candidates are validated results;
- Albanian candidates prove origin;
- Qwen3 output can replace Heart validation;
- resonance is proof.

---

## 19. Recommended Implementation Phases

### Phase 1 — Schema Design

This PR.

### Phase 2 — Brain Prompt Helper

Implement a prompt helper that accepts one Heart segmentation object and returns strict Brain JSON.

### Phase 3 — Schema/Guard Tests

Add guards for required fields, candidate types, null candidate path, and claim boundary.

### Phase 4 — Study-Only Prototype Artifact

Run a controlled `study` prototype preserving Heart input, Brain output, null candidates, and Heart validation.

### Phase 5 — Review Before Multi-Word Protocol

Do not run multi-word protocol until the `study` prototype is reviewed.

---

## 20. Completion Definition

This schema is complete when:

- Brain role is defined;
- Brain input object is defined;
- Brain output object is defined;
- required chunk candidate fields are defined;
- candidate types are defined;
- evidence types are defined;
- false-friend risk values are defined;
- null candidate rules are defined;
- function fit rules are defined;
- hard prohibitions are defined;
- `study` example is included;
- null candidate example is included;
- prompt contract is defined;
- artifact requirements are defined;
- non-goals are explicit;
- claim boundaries are explicit;
- no code changes are made;
- no artifacts are changed;
- local validation passes.
