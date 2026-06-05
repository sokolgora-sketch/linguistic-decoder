# Finnish /i/ Anchor-Family Audit Design v0.1

Status: DESIGN ONLY  
Project: ZË-RO Evals  
Lane: Finnish `/i` scratch follow-up  
Date recorded: 2026-06-05

This document defines the next controlled audit design after the Finnish `/i` anchor-geometry scratch note.

It does not run evaluations.  
It does not create evidence packs.  
It does not change scoring code.  
It does not change bracket rules.  
It does not update README.  
It does not publish anything.  
It does not claim Finnish `/i` supports any tested bracket.

Related scratch note:

- `docs/evals/c05-fi-i-anchor-geometry-scratch-notes-v0.1.md`

Related high-region audit docs:

- `docs/evals/cohort-03-high-region-anchor-review-v0.1.md`
- `docs/evals/cohort-03-high-region-audit-protocol-v0.1.md`
- `docs/evals/cohort-03-high-region-collapse-diagnostics-design-v0.1.md`
- `docs/evals/cohort-03-high-region-pressure-mechanism-note-outline-v0.1.md`

## 1. Purpose

The purpose of this design is to stop ad hoc Finnish `/i` scoring and convert the scratch signal into a controlled anchor-family audit.

The scratch lane showed:

1. Final-shape alone did not explain the Finnish `/i` pressure.
2. Relabelling `anchorLow` did not change scorer geometry.
3. Replacing the low anchor with a U-heavy V5-style bucket flipped the result to `EXCEEDS_LOW`.
4. Replacing the low anchor with an O/mid-style V4 bucket returned `COLLAPSED_HIGH`.

Therefore, the next question is not:

> Can we find a bracket that makes Finnish `/i` look supportive?

The next question is:

> Which anchor-family variables control the Finnish `/i` pressure under `T5_INTERMEDIATE_V0_1` and `aperturePresenceMean`?

## 2. Claim boundaries

Allowed:

- Finnish `/i` is a scratch falsification-pressure lane.
- Finnish `/i` shows anchor-geometry sensitivity.
- Final-shape alone is insufficient as an explanation.
- Actual anchor token geometry matters.
- A controlled anchor-family audit is the correct next design step.

Blocked:

- Do not claim Finnish `/i` supports `V6→V7`.
- Do not claim Finnish `/i` supports `V5→V7`.
- Do not claim Finnish `/i` supports `V4→V7`.
- Do not claim final-shape explains the pressure.
- Do not claim the case is publication evidence.
- Do not mix this lane with Open Instrument evidence.
- Do not mix this lane with Cohort publication evidence.
- Do not run more random Finnish `/i` scoring from this document.

## 3. Audit variables to separate

The audit must separate at least five variables.

### 3.1 Anchor semantic class

Each anchor bucket must declare its intended semantic family before scoring.

Minimum semantic families:

| Anchor family | Intended voice region | Working description |
|---|---|---|
| A/O-heavy field anchor | old low-anchor scratch family | open field, object/place, broad stable nouns |
| U-heavy flow anchor | real V5 family | flow, body-channel, round/back, movement/containment |
| O/mid field anchor | V4-style family | place, field, balance, stable location |
| I-heavy point anchor | V7-style high anchor | point, line, mark, edge, high/front target-like field |

The audit should not mix semantic families inside one anchor bucket unless the mixture is intentional and recorded.

### 3.2 Target-vowel contamination

Every token must record whether it contains visible Finnish `i`.

Required fields:

| Field | Meaning |
|---|---|
| contains_i | token contains visible `i` |
| i_count | number of visible `i` characters |
| i_position | initial, medial, final, mixed, or none |
| contaminationRisk | low, medium, high |

Purpose:

- detect whether anchors are accidentally target-like;
- separate high-anchor suction from ordinary bracket pressure;
- avoid treating contaminated anchors as clean controls.

### 3.3 Token length

Every token must record token length.

Required fields:

| Field | Meaning |
|---|---|
| charLength | character count under Finnish orthography |
| roughSyllables | rough syllable count |
| lengthBand | short, mid, or long |

Purpose:

- prevent target/high-anchor length mismatch from becoming the hidden mechanism;
- compare open-final and closed-final buckets at similar length bands;
- avoid repeating known Hindi `/i` length-confound mistakes.

### 3.4 Final-shape distribution

Every token must record final-shape.

Required fields:

| Field | Meaning |
|---|---|
| finalShape | open_final or closed_final |
| finalChar | last visible character |
| suffixRisk | none, low, medium, high |

Purpose:

- keep open-final / closed-final as an explicit variable;
- avoid suffix-driven morphology confounds;
- ensure final-shape is not silently entangled with length or function class.

### 3.5 aperturePresenceMean placement

Before scoring, the design should estimate expected placement qualitatively.

Required fields:

| Field | Meaning |
|---|---|
| expectedVoiceCarriers | visible vowel carriers expected to affect presence mean |
| expectedApertureRegion | low, mid, high, or mixed |
| placementRisk | low, medium, high |

Purpose:

- make visible why a token might pull the bucket up or down;
- prevent surprise anchor-family flips;
- document whether the bucket is likely to compress near the high anchor.

## 4. Required token table schema

No token should enter a future audit pack without a row like this:

| Field | Required | Notes |
|---|---:|---|
| token | yes | Finnish standard orthography |
| bucket | yes | `anchor_low`, `x_vowel`, or `anchor_high` |
| plannedArm | yes | audit arm id |
| gloss | yes | short English gloss |
| functionClass | yes | semantic class before scoring |
| partOfSpeech | yes | noun, verb, adjective, other |
| finalShape | yes | open_final or closed_final |
| finalChar | yes | final visible character |
| contains_i | yes | boolean |
| i_count | yes | integer |
| i_position | yes | initial, medial, final, mixed, none |
| charLength | yes | integer |
| roughSyllables | yes | rough count |
| expectedVoiceCarriers | yes | visible vowels/carriers |
| expectedApertureRegion | yes | low, mid, high, mixed |
| reasonIncluded | yes | why token belongs |
| riskNote | yes | possible confound |

## 5. Proposed audit structure

This design proposes a staged audit. The first PR should record curation tables and runnable intent, not score.

### Arm A — scratch reproduction table

Purpose:

- preserve the exact scratch families in one comparable table;
- document why previous buckets behaved differently.

Uses the already observed bucket families:

1. A/O-heavy old low anchor:
   - `talo, kala, maa, sana, valo, sota, tapa, kukka, metsä, pöytä`

2. U-heavy real V5 anchor:
   - `puu, kuu, suu, luu, puku, luku, suru, muru, juttu, tuttu`

3. O/mid V4-style anchor:
   - `talo, palo, valo, kolo, polo, poro, sopu, koti, ovi, onni`

4. Shared high anchor:
   - `ilo, ilma, ilta, isä, itä, kissa, viima, viileä, viiva, hiiva`

5. Shared open-final target:
   - `lintu, silmä, sika, kirja, laiva, koira, leipä, liike, viha, piha`

6. Shared closed-final target:
   - `ihminen, avain, kaunis, valmis, kallis, taivas, kirves, ilves, joutsen, puhelin`

Arm A does not create new evidence. It converts the scratch tokens into an auditable geometry table.

### Arm B — function-matched anchor-family table

Purpose:

- test whether semantic-family mismatch is driving pressure.

Design requirement:

- choose one dominant target function class;
- curate anchor families that match that function class as closely as possible;
- avoid mixing body, object, action, cognition, place, and relation words in the same target bucket.

Arm B should not be scored until the token table is reviewed.

### Arm C — contamination-controlled anchor table

Purpose:

- test whether target-vowel contamination in anchors is producing high-anchor suction or low-anchor inversion.

Design requirement:

- build paired anchor candidates:
  - low-contamination anchor set;
  - matched high-contamination anchor set;
- keep rough token length and function class as stable as possible.

Arm C should not be scored until contamination labels are complete.

### Arm D — length/final-shape matched table

Purpose:

- test whether final-shape and length are still entangled.

Design requirement:

- open-final and closed-final target sets should be matched by:
  - mean token length;
  - length band distribution;
  - rough syllable distribution;
  - function class;
  - target-vowel density.

Arm D should not be scored until token geometry is reviewed.

## 6. Stop conditions

Do not proceed to scoring if any of these are true:

- target doc is missing token tables;
- tokens are not labelled for function class;
- target-vowel contamination is not labelled;
- token length is not labelled;
- final-shape distribution is not labelled;
- anchors mix semantic families without explanation;
- target bucket mixes too many unrelated functions;
- run purpose is phrased as support-seeking;
- Open Instrument artifacts are mixed into the eval lane.

## 7. Future scoring posture

If a later PR creates runnable audit packs, it must preserve this posture:

- audit only;
- not support-seeking;
- not publication evidence;
- not cohort evidence;
- no README update;
- no bracket promotion;
- no scoring-code change from audit results alone.

Future evidence should be interpreted as mechanism evidence, not proof.

Possible interpretations:

| Outcome | Interpretation |
|---|---|
| all arms collapse high | high-region scorer/bracket pressure remains unresolved |
| U-heavy anchors keep flipping to `EXCEEDS_LOW` | V5-style low anchor overcorrects under current scoring |
| function-matched arms stabilize | semantic mismatch is likely a major mechanism |
| contamination-controlled arms stabilize | target-vowel contamination is likely a major mechanism |
| length/final-shape matched arms stabilize | shape geometry is likely a major mechanism |
| mixed results | Finnish `/i` remains a multi-variable pressure case |

## 8. Next concrete work

Next PR should be one of:

1. Add a token-geometry curation table for Arm A only.
2. Add a draft curation table for Arm B only.
3. Add a small CLI/helper to summarize token geometry if existing helpers are insufficient.

Do not score a new Finnish `/i` audit pack until at least one curation table is repo-tracked and reviewed.
