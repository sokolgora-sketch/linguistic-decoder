# Open Instrument Embryo Morpheme Terminology Alignment v0.1
Status: design terminology alignment only.

This document aligns the Open Instrument term `embryo morpheme` with the current Heart-to-Brain implementation language, which currently uses `chunk`.

No code changes are made by this document.
No prompt changes are made by this document.
No smoke run is performed by this document.
No archive artifact is added or changed by this document.

This is development terminology/design only. It is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, and not proof that any embryo candidate is true.

---

## 1. Purpose
The purpose is to align terminology before running the first Heart-to-Brain `study` prototype artifact.

The current implementation uses the field name:

    chunk

The preferred doctrine/protocol concept is:

    embryo morpheme

For v0.1, both names are allowed with clear roles:

- `chunk` is the implementation-level field name.
- `embryo morpheme` is the protocol/doctrine-level concept.

This avoids a schema fork while preserving the stronger conceptual language.

---

## 2. Background
Relevant sequence:

- PR #1162 defined the Heart-to-Brain Candidate Search Protocol.
- PR #1163 defined the Heart chunk segmentation policy.
- PR #1164 implemented the Heart chunk segmentation helper.
- PR #1165 defined the Brain candidate search schema.
- PR #1166 implemented the Brain candidate search prompt helper.

Current architecture:

    Heart owns structure.
    Brain finds candidates.
    Heart validates truth.

The next planned lane is a controlled `study` Heart-to-Brain prototype artifact.

Before that, terminology should be aligned.

---

## 3. Definition: Embryo Morpheme
An embryo morpheme is:

- a candidate sub-word unit;
- the smallest useful vowel-carrying unit where possible;
- potentially meaning-bearing;
- cross-linguistically testable;
- not a proven morpheme;
- not an origin claim.

The term `embryo` is intentional.

It means the unit may develop into a meaningful candidate under evidence, but it is not assumed true at creation.

---

## 4. Terminology Alignment
Current implementation term:

    chunk

Protocol/doctrine term:

    embryo morpheme

Alignment:

- `chunk` = field name used in current TypeScript/docs.
- `embryo morpheme` = conceptual name for the unit.
- `chunkCandidate` = current candidate result for an embryo morpheme.
- `embryo candidate` = conceptual candidate result for an embryo morpheme.

For v0.1, current lowercase `chunk` field names remain active.

Future PRs may add aliases or rename fields, but this document does not perform that migration.

---

## 5. Heart Responsibilities
Heart responsibilities:

- receive input word;
- extract vowels;
- normalize where allowed, such as final `Y->I`;
- compute voice path;
- create embryo segmentations;
- create all valid embryo/chunk segmentations where relevant;
- assign resident vowel per embryo where possible;
- attach function hints;
- label function hints as `ZE-RO doctrine`;
- output structured Heart payload;
- validate Brain output after candidate search.

Heart must not delegate vowel path or segmentation authority to Brain.

---

## 6. Brain Responsibilities
Brain responsibilities:

- receive Heart payload;
- search candidates only;
- search candidate meanings for each embryo/chunk;
- return candidate objects;
- return null candidates explicitly;
- label candidate type;
- label evidence type;
- label false-friend risk;
- provide source/risk notes.

Brain must not:

- compute vowel path;
- own vowel path;
- decide segmentation;
- invent embryo targets;
- reorder chunks;
- claim whole-word origin;
- treat resonance as proof;
- hide null candidates.

---

## 7. Conceptual HeartPayload Schema
Conceptual target:

    {
      "inputWord": "study",
      "voicePath": ["U", "I"],
      "normalizationNotes": ["Y normalized to I"],
      "segmentations": [
        {
          "segmentationId": "study.segmentation.003",
          "embryos": [
            {
              "form": "SHTU",
              "variants": ["STU", "SHTU"],
              "residentVowel": "U",
              "functionHints": ["add", "accumulate", "contain", "place"],
              "functionHintSource": "ZE-RO doctrine"
            },
            {
              "form": "DI",
              "variants": ["DI"],
              "residentVowel": "I",
              "functionHints": ["know", "see", "insight", "distinguish"],
              "functionHintSource": "ZE-RO doctrine"
            }
          ]
        }
      ]
    }

Current implementation equivalent:

- `chunks` currently represents embryo forms.
- `chunkVariants` currently represents embryo variants.
- `voicePath` currently represents segmentation-level path.
- `functionHints` currently attaches doctrine hints to chunk/voice.

The conceptual HeartPayload target includes:

- `inputWord`
- `voicePath`
- `normalizationNotes`
- `segmentations`
- `embryos`
- `form`
- `variants`
- `residentVowel`
- `functionHints`
- `functionHintSource`

---

## 8. Conceptual BrainOutput Schema
Conceptual target:

    {
      "inputWord": "study",
      "segmentationId": "study.segmentation.003",
      "embryoResults": [
        {
          "embryoForm": "SHTU",
          "residentVowel": "U",
          "candidates": [
            {
              "language": "Albanian",
              "form": "shtoj",
              "meaning": "to add, to increase",
              "candidateType": "STRONG_LEXICAL",
              "vowelAligned": true,
              "note": "SHTU variant may relate to shtoj root; source check required"
            },
            {
              "language": "Chinese",
              "form": null,
              "meaning": null,
              "candidateType": "NULL_CANDIDATE",
              "vowelAligned": false,
              "note": "no credible STU/SHTU candidate found"
            }
          ]
        }
      ]
    }

Current implementation equivalent:

- `chunkCandidates` currently stores candidate objects for embryo/chunk targets.
- `nullCandidates` currently stores explicit null candidates.
- `candidateType`, `evidenceType`, and `falseFriendRisk` remain required.

The conceptual BrainOutput target includes:

- `inputWord`
- `segmentationId`
- `embryoResults`
- `embryoForm`
- `residentVowel`
- `candidates`
- `language`
- `form`
- `meaning`
- `candidateType`
- `vowelAligned`
- `note`

---

## 9. CandidateType Alignment
Claude-style conceptual enum:

- `STRONG_LEXICAL`
- `WEAK_RESONANCE`
- `DOCTRINE_ALIGNED`
- `FALSE_FRIEND_RISK`
- `NULL_CANDIDATE`

Current repo enum:

- `strong_living_match`
- `historical_match`
- `functional_resonance`
- `phonetic_resonance`
- `weak_resonance`
- `likely_false_friend`
- `null_candidate`

Alignment:

- `STRONG_LEXICAL` maps closest to `strong_living_match`.
- `WEAK_RESONANCE` maps to `weak_resonance`.
- `DOCTRINE_ALIGNED` should remain an `evidenceType` as `doctrine_alignment`, not a candidate type.
- `FALSE_FRIEND_RISK` maps closest to `likely_false_friend`.
- `NULL_CANDIDATE` maps to `null_candidate`.

Decision for v0.1:

    Keep current lowercase repo enums active.

Reason:

- they are already implemented in PR #1166;
- they separate candidate type from evidence type;
- `doctrine_alignment` is better as evidence type than candidate type.

---

## 10. Null Candidate Rule
Null candidates are required.

Silence is invalid.

Null evidence is evidence.

If Brain finds no credible candidate for an embryo/chunk in a target language, it must return a clean null candidate.

Current repo equivalent:

    candidateType: null_candidate
    evidenceType: none
    falseFriendRisk: none
    nullCandidate: true

---

## 11. Function Hint Source Rule
Function hints must be labeled as doctrine.

Current repo canonical spelling:

    ZE-RO doctrine

Potential alternate spelling in external briefs:

    ZE-RO_doctrine

Decision for v0.1:

    Use ZE-RO doctrine in repo fields.

Reason:

- it is already implemented in the Heart segmentation helper;
- it is human-readable;
- it is already covered by guard tests.

Future schema bridges may accept `ZE-RO_doctrine` as an alias, but the repo canonical string remains `ZE-RO doctrine`.

---

## 12. Heart Validation Rules After Brain Returns
Heart validation should check:

- `candidateType` is present;
- `evidenceType` is present;
- `falseFriendRisk` is present;
- `nullCandidate` is explicit;
- `segmentationId` is preserved;
- Heart-approved embryo/chunk target is preserved;
- Brain did not claim origin;
- Brain did not alter vowel path;
- Brain did not create new segmentation;
- if `candidateType` is strong, `sourceNote` must be non-empty;
- if `nullCandidate` is true, form/meaning may be empty but note/sourceNote must explain absence.

Future validation should produce structured failures, not prose-only rejection.

---

## 13. Important Correction: Lexical Candidate Form
Brain lexical candidate form does not have to equal the embryo variant exactly.

Example:

- embryo/chunk target: `SHTU`
- legal variant: `SHTU`
- possible lexical candidate: Albanian `shtoj`

The candidate form `shtoj` is not identical to `SHTU`.

That does not automatically make it invalid.

Validation should check:

- declared relation to embryo;
- source note;
- evidence type;
- false-friend risk;
- function fit;
- candidate type.

Do not require exact equality between embryo target and lexical candidate form.

---

## 14. Study Example Alignment
Current Heart helper segmentation:

    study.segmentation.003
    chunks: SHTU + DI
    legalTransforms: S_TO_SH, FINAL_Y_TO_I
    voicePath: U -> I

Embryo terminology:

- embryo 1: `SHTU`
  - resident vowel: `U`
  - variants: `STU`, `SHTU`
  - function hints: add, accumulate, contain, place
  - source: `ZE-RO doctrine`
- embryo 2: `DI`
  - resident vowel: `I`
  - variants: `DI`
  - function hints: know, see, insight, distinguish
  - source: `ZE-RO doctrine`

Brain candidate search may return:

- Albanian `shtoj` for `SHTU`;
- Albanian `di` for `DI`;
- null candidates for target languages with no credible match.

These remain embryo/chunk candidates, not whole-word origin claims.

---

## 15. Non-Goals
This document does not:

- rename implementation fields;
- implement schema migration;
- implement Brain validation;
- change prompts;
- call an LLM;
- run smoke;
- add artifacts;
- change verifier logic;
- change parser logic;
- change scorer logic;
- make public claims;
- make publication claims;
- touch evals or Cohort evidence.

---

## 16. Claim Boundary
This is development terminology/design only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- proof that any embryo candidate is true;
- proof that any language is origin;
- a reason to change the default provider from `mock`.

Allowed internal reading:

- `embryo morpheme` is the preferred conceptual term.
- `chunk` remains the current implementation field name.
- null candidates remain required.
- candidate type and false-friend risk remain required.
- Heart validates Brain output.

Blocked reading:

- any example candidate is validated;
- Albanian candidates prove origin;
- exact form equality is required for all lexical candidates;
- doctrine hints are external linguistic evidence.

---

## 17. Recommended Next Phases
### Phase 1 - Terminology alignment
This PR.

### Phase 2 - Expose embryo aliases or docs in helper/prompt
Optionally add aliases or comments so implementation makes the embryo/chunk relationship explicit.

### Phase 3 - Brain output validation helper
Implement deterministic validation for Brain candidate output.

### Phase 4 - Study-only Heart-to-Brain prototype artifact
Run a controlled prototype with Qwen3 8B and archive full Heart input, Brain output, null candidates, and validation.

---

## 18. Completion Definition
This alignment is complete when:

- embryo morpheme is defined;
- current `chunk` terminology is mapped to embryo terminology;
- Heart responsibilities are restated;
- Brain responsibilities are restated;
- HeartPayload conceptual schema is included;
- BrainOutput conceptual schema is included;
- CandidateType alignment is defined;
- null candidate rule is preserved;
- function hint source canonical spelling is defined;
- Heart validation rules are listed;
- lexical candidate form correction is explicit;
- `study.segmentation.003` example is aligned;
- non-goals are explicit;
- claim boundaries are explicit;
- no code changes are made;
- no artifacts are changed;
- local validation passes.
