# Cohort 03 High-Region Audit Protocol v0.1

Status: PROTOCOL ONLY
Project: ZË-RO
Milestone: Cohort 03
Date recorded: 2026-05-19

This document defines the audit protocol for high-region front-vowel pressure cases.

It follows:

- `docs/evals/cohort-03-high-region-anchor-review-v0.1.md`

It does not run evaluations.
It does not create evidence packs.
It does not change scoring code.
It does not change bracket rules.
It does not update README.
It does not publish anything.
It does not claim the high-region problem is solved.

## 1. Purpose

The purpose of this protocol is to clean the high-region lens before more support tests are run.

The current pressure pattern includes:

- Finnish `/y`
- Arabic `/i`
- Hebrew `/i`
- Hindi `/i`
- Persian `/i`

These cases repeatedly show:

- `V5-V7` candidate brackets collapse high;
- `V4-V7` controls also collapse high;
- widening from `V5` to `V4` does not stabilize the target;
- no current high-region `/i`-type pack gives clean `V5-V7` support.

The audit protocol must separate four possible causes:

1. bracket geometry problem;
2. semantic anchor mismatch;
3. scorer sensitivity / collapse-threshold problem;
4. token-function mismatch.

## 2. Audit rule

Do not run more high-region `/i` support tests until an audit pack is designed under this protocol.

A high-region audit pack must not be framed as support-seeking.

It must be framed as diagnosis.

Allowed audit question:

> Which part of the high-region lens is producing repeated high collapse?

Blocked audit question:

> Can we prove `V5-V7` support if we pick better tokens?

## 3. Required audit design principles

### 3.1 Function-class control

Every token must be assigned a function class before scoring.

Minimum required fields for each token in an audit design table:

| Field | Meaning |
|---|---|
| token | broad Latin transliteration token |
| bucket | `anchor_low`, `x_vowel`, or `anchor_high` |
| functionClass | semantic function class |
| gloss | short English gloss |
| reasonIncluded | why the token belongs in this bucket |
| riskNote | possible ambiguity or reason to reject |

No token should enter an audit pack without this table.

### 3.2 Matched semantic dimension

The three buckets must be matched by semantic dimension.

Do not compare:

- movement/path words against point/target words while the target bucket is mixed across cognition, object, body, and action;
- concrete anchors against abstract target words;
- action anchors against noun-heavy target buckets unless this is intentional and recorded.

The target `x_vowel` bucket must be narrowed to one dominant semantic dimension.

### 3.3 No broad mixed target buckets

A high-region `/i` target bucket must not mix too many different functions.

Avoid mixing all of these in one target bucket:

- body parts;
- knowledge words;
- small object words;
- sharp/point words;
- writing/marking words;
- movement words;
- abstract relation words.

If multiple functions are needed, they must be tested as separate audit packs.

### 3.4 Anchor purity

Anchor buckets must be cleaner than the target bucket.

Current rough anchor meanings:

- `V5`: movement / flow / path / passage;
- `V7`: point / edge / target / mark / line;
- `V4`: ground / place / stable field.

Audit anchors must be checked for target-vowel contamination and semantic contamination.

Avoid anchor tokens that strongly contain the target vowel when possible.

### 3.5 Same part-of-speech preference

Where possible, buckets should be aligned by part of speech.

Preferred audit design:

- noun target with noun anchors;
- action target with action anchors;
- property target with property anchors.

Mixed grammar is allowed only if it is intentional and documented.

## 4. Recommended first audit shape

Use one already-recorded pressure language first.

Recommended first audit case:

- Finnish `/y` or Hindi `/i`

Reason:

- Finnish `/y` already has initial and audit pressure evidence.
- Hindi `/i` provides a clear Indo-Iranian pressure case with no boundary flags.
- Both are useful for isolating whether the issue is bracket geometry or semantic lens mismatch.

Do not start with five languages at once.

Use one language, one target vowel, and one function-class design.

## 5. Candidate audit arms

The first audit should compare at least two design arms.

### Arm A — current-lens reproduction

Purpose:

- reproduce the existing pressure using the current anchor logic.

Bracket:

- candidate: `V5-V7`
- control: `V4-V7`

Function design:

- use the same broad anchor concepts as prior packs;
- but document every token by function class.

Expected use:

- confirms whether the old pressure repeats under better documentation.

### Arm B — function-matched target audit

Purpose:

- test whether collapse is caused by mixed target semantics.

Bracket:

- candidate: `V5-V7`
- control: `V4-V7`

Function design:

- target bucket uses one function class only;
- anchor buckets are matched against that function class;
- no broad mixed target bucket.

Expected use:

- if Arm B stabilizes while Arm A collapses, token-function mismatch is likely.

### Arm C — bracket-geometry audit

Purpose:

- test whether the bracket shape is wrong.

Bracket options:

- `V5-V7`
- `V4-V7`
- optional later: `V3-V7` or a redesigned high-region bracket

Function design:

- same target function class across all arms.

Expected use:

- if a wider bracket stabilizes while `V5-V7` collapses, bracket geometry is implicated.
- if all brackets collapse, scorer threshold or anchor suction is more likely.

## 6. Interpretation matrix

| Pattern | Interpretation |
|---|---|
| Arm A collapses, Arm B stabilizes | token-function mismatch likely |
| `V5-V7` collapses, `V4-V7` stabilizes | bracket geometry / width problem likely |
| `V5-V7` and `V4-V7` both collapse under clean function matching | scorer sensitivity or high-anchor suction likely |
| all arms collapse with no flags | possible hard high-region model pressure |
| all arms collapse with boundary flags | boundary overpressure; bracket or threshold review needed |
| target becomes `INTERMEDIATE` only after anchor redesign | semantic anchor mismatch likely |

## 7. Required result reporting

Every audit result must report:

- series label;
- run IDs;
- evidence pack filename;
- evidence pack SHA256;
- target language;
- target vowel;
- token-function table location;
- bracket pair;
- verdicts;
- normalizedPosition;
- gap_low;
- gap_high;
- diagnostic flags;
- interpretation using the matrix above.

No audit result should be summarized as support unless the protocol explicitly allows it later.

## 8. Claim boundaries

Allowed:

- The high-region audit protocol is ready.
- Future high-region audit packs must use function-class token tables.
- Current `V5-V7` support claims remain frozen for high/front `/i`-type cases.
- The next step is controlled audit design, not blind support testing.

Blocked:

- Do not claim the high-region issue is solved.
- Do not claim `V5-V7` supports high/front `/i`-type cases.
- Do not claim the whole model is invalid.
- Do not claim the full framework is proven.
- Do not change scoring code from this protocol alone.
- Do not publish or update README from this protocol alone.

## 9. Next step after this protocol

After this protocol is merged, create one audit design document before running any new `/evals`.

Recommended next document:

- `docs/evals/cohort-03-high-region-audit-design-v0.1.md`

That design should choose:

- one target language;
- one target vowel;
- the function class to isolate;
- the exact token-function table;
- the exact planned run IDs;
- the bracket arms to test.

No scoring should happen before the audit design exists.
