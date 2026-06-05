# Finnish /i/ Anchor-Family Arm B Place/Object Table v0.1

Status: CURATION TABLE ONLY
Project: ZË-RO Evals
Lane: Finnish `/i` anchor-family audit
Arm: B — function-matched place/object table
Date recorded: 2026-06-05

This document creates the first Arm B place/object curation table for the Finnish `/i` anchor-family audit.

It does not run evaluations.
It does not create evidence packs.
It does not create runnable JSON.
It does not change scoring code.
It does not change bracket rules.
It does not update README.
It does not publish anything.
It does not claim Finnish `/i` supports any tested bracket.

Related documents:

- `docs/evals/c05-fi-i-anchor-geometry-scratch-notes-v0.1.md`
- `docs/evals/c05-fi-i-anchor-family-audit-design-v0.1.md`
- `docs/evals/c05-fi-i-anchor-family-arm-a-token-geometry-table-v0.1.md`
- `docs/evals/c05-fi-i-anchor-family-arm-a-review-v0.1.md`

## 1. Purpose

Arm B tests the next design question:

> Can Finnish `/i` be inspected under one more coherent function class instead of the broad mixed-function buckets used in Arm A?

The Arm A review selected `place/object` as the first function-matched class.

This document extracts the available `place/object`-like candidates from the already-recorded scratch material and marks whether each token is usable, held, or rejected for a future Arm B pack.

This is not a runnable pack.

This is a curation table for review.

## 2. Claim boundaries

Allowed:

- identify candidate place/object rows;
- mark contaminated or unstable rows;
- decide whether current scratch material is sufficient for a future runnable pack;
- identify what additional curation is required.

Blocked:

- do not score Arm B from this table;
- do not create `/evals` JSON from this table yet;
- do not treat this as new evidence;
- do not treat this as publication evidence;
- do not treat this as cohort evidence;
- do not claim Finnish `/i` supports `V6→V7`, `V5→V7`, or `V4→V7`;
- do not mix this with Open Instrument evidence.

## 3. Decision labels

| label | meaning |
|---|---|
| candidate | plausible Arm B candidate after review |
| hold | plausible but requires explicit control/variant |
| reject | do not use for clean Arm B |
| needs_replacement | required role cannot be filled cleanly from existing scratch material |

## 4. Anchor-low candidate table

These rows are candidate or held `anchor_low` material for a future place/object Arm B.

| token | sourceFamily | priorBucket | gloss | functionClass | decision | finalShape | contains_i | i_count | contains_ae | contains_oe | charLength | roughSyllables | expectedVoiceCarriers | expectedApertureRegion | riskNote |
|---|---|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---|---|---|
| talo | A/O-heavy + V4 | anchor_low | house | place/object | candidate | open_final | false | 0 | false | false | 4 | 2 | a,o | low/mid | duplicated across old and V4 families; useful stable place/object row |
| maa | A/O-heavy | anchor_low | land/country | place/field | candidate | open_final | false | 0 | false | false | 3 | 1 | aa | low | very short long-vowel token |
| valo | A/O-heavy + V4 | anchor_low | light | field/object | candidate | open_final | false | 0 | false | false | 4 | 2 | a,o | low/mid | field/quality object; duplicated across old and V4 families |
| metsä | A/O-heavy | anchor_low | forest | place/field | hold | open_final | false | 0 | true | false | 5 | 2 | e,ä | mid/front | front-vowel confound from `ä` |
| pöytä | A/O-heavy | anchor_low | table | object/place | hold | open_final | false | 0 | true | true | 5 | 2 | ö,ä | mid/front-rounded | front-vowel confound from `ö/ä` |
| puu | U-heavy V5 | anchor_low | tree/wood | object/nature | hold | open_final | false | 0 | false | false | 3 | 1 | uu | U-heavy | very short long-vowel U token; length review required |
| kuu | U-heavy V5 | anchor_low | moon | celestial object | hold | open_final | false | 0 | false | false | 3 | 1 | uu | U-heavy | very short long-vowel U token; semantic distance from ordinary place/object |
| puku | U-heavy V5 | anchor_low | suit/clothing | object/container | candidate | open_final | false | 0 | false | false | 4 | 2 | u,u | U-heavy | U-dense object; may overcorrect low |
| kolo | V4 clean | anchor_low | hollow/hole | place/space | candidate | open_final | false | 0 | false | false | 4 | 2 | o,o | O-heavy | strong place/space semantic |
| palo | V4 clean | anchor_low | fire/piece | event/object | hold | open_final | false | 0 | false | false | 4 | 2 | a,o | low/mid | ambiguous gloss; event/object mixture |
| koti | V4 contaminated | anchor_low | home | place | reject | open_final | true | 1 | false | false | 4 | 2 | o,i | mid/high mixed | final-`i` anchor contamination; not clean Arm B anchor |
| ovi | V4 contaminated | anchor_low | door | place/threshold | reject | open_final | true | 1 | false | false | 3 | 2 | o,i | mid/high mixed | final-`i` anchor contamination and short token |
| onni | V4 contaminated | anchor_low | luck/happiness | state | reject | open_final | true | 1 | false | false | 4 | 2 | o,i | mid/high mixed | final-`i` contamination and not place/object |

## 5. X-vowel place/object candidate table

These rows are candidate or held `x_vowel` material for a future place/object Arm B.

| token | sourceFamily | priorBucket | gloss | functionClass | decision | finalShape | contains_i | i_count | contains_ae | contains_oe | charLength | roughSyllables | expectedVoiceCarriers | expectedApertureRegion | riskNote |
|---|---|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---|---|---|
| kirja | open-final target | x_vowel | book | object/knowledge | candidate | open_final | true | 1 | false | false | 5 | 2 | i,a | high/low | good place/object-adjacent target; knowledge/object overlap |
| laiva | open-final target | x_vowel | ship | object/movement | candidate | open_final | true | 1 | false | false | 5 | 2 | a,i,a | mixed | object with movement semantic |
| leipä | open-final target | x_vowel | bread | object/food | hold | open_final | true | 1 | true | false | 5 | 2 | e,i,ä | mixed/front | food object but `ä` front-vowel confound |
| piha | open-final target | x_vowel | yard | place | candidate | open_final | true | 1 | false | false | 4 | 2 | i,a | high/low | clean place row |
| avain | closed-final target | x_vowel | key | object/tool | candidate | closed_final | true | 1 | false | false | 5 | 2 | a,a,i | mixed | good object/tool row |
| taivas | closed-final target | x_vowel | sky/heaven | place/field | candidate | closed_final | true | 1 | false | false | 6 | 2 | a,i,a | mixed | place/field row; broad semantic |
| kirves | closed-final target | x_vowel | axe | object/tool | candidate | closed_final | true | 1 | false | false | 6 | 2 | i,e | high/mid | good object/tool row |
| puhelin | closed-final target | x_vowel | telephone | object/tool | hold | closed_final | true | 1 | false | false | 7 | 3 | u,e,i | mixed | longer than open-final target rows |
| joutsen | closed-final target | x_vowel | swan | living object | reject | closed_final | false | 0 | false | false | 7 | 2 | o,u,e | mixed | no visible `i`; not a strict target-`i` row |
| sika | open-final target | x_vowel | pig | living object | reject | open_final | true | 1 | false | false | 4 | 2 | i,a | high/low | living-object class, not place/object |
| koira | open-final target | x_vowel | dog | living object | reject | open_final | true | 1 | false | false | 5 | 2 | o,i,a | mixed | living-object class, not place/object |
| ilves | closed-final target | x_vowel | lynx | living object | reject | closed_final | true | 1 | false | false | 5 | 2 | i,e | high/mid | living-object class, not place/object |

## 6. Anchor-high candidate table

These rows are possible or held `anchor_high` material. The existing high anchor remains highly contaminated by visible `i`.

| token | sourceFamily | priorBucket | gloss | functionClass | decision | finalShape | contains_i | i_count | contains_ae | contains_oe | charLength | roughSyllables | expectedVoiceCarriers | expectedApertureRegion | riskNote |
|---|---|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---|---|---|
| viiva | shared high anchor | anchor_high | line | point/line/object | candidate | open_final | true | 2 | false | false | 5 | 2 | ii,a | high/low | strongest place/object-compatible V7-style row; high `i` contamination |
| ilma | shared high anchor | anchor_high | air/weather | field/substance | hold | open_final | true | 1 | false | false | 4 | 2 | i,a | high/low | field/substance row but high-anchor contamination remains |
| itä | shared high anchor | anchor_high | east | direction/place | hold | open_final | true | 1 | true | false | 3 | 2 | i,ä | high/front | place/direction row but `ä` front-vowel confound and short length |
| hiiva | shared high anchor | anchor_high | yeast | substance/object | hold | open_final | true | 2 | false | false | 5 | 2 | ii,a | high/low | substance/object but not clean place/object |
| viileä | shared high anchor | anchor_high | cool | property | reject | open_final | true | 2 | true | false | 6 | 3 | ii,e,ä | high/front/mid | property/adjective and `ä` confound |
| ilo | shared high anchor | anchor_high | joy | state/emotion | reject | open_final | true | 1 | false | false | 3 | 2 | i,o | high/mid | emotion/state, not place/object |
| isä | shared high anchor | anchor_high | father | kin/person | reject | open_final | true | 1 | true | false | 3 | 2 | i,ä | high/front | kin/person and `ä` confound |
| kissa | shared high anchor | anchor_high | cat | living object | reject | open_final | true | 1 | false | false | 5 | 2 | i,a | high/low | living-object class |
| viima | shared high anchor | anchor_high | cold wind | field/weather | hold | open_final | true | 2 | false | false | 5 | 2 | ii,a | high/low | field/weather, but double-`i` contamination |
| ilta | shared high anchor | anchor_high | evening | time | reject | open_final | true | 1 | false | false | 4 | 2 | i,a | high/low | time class, not place/object |

## 7. Curation summary

Current scratch material is not sufficient for a clean runnable Arm B pack.

Reasons:

1. Candidate `anchor_low` rows exist, but the families are not balanced:
   - A/O and V4 candidates are place/object-like;
   - U-heavy V5 candidates are shorter and U-dense;
   - V4 final-`i` tokens must be rejected or isolated.
2. Candidate `x_vowel` rows exist, but the pool is too small for a balanced 10-token open/closed design without adding new curated tokens.
3. Candidate `anchor_high` rows are too contaminated by visible `i` to answer contamination questions alone.
4. Several useful tokens carry `ä` or `ö`, which must remain labelled.
5. The table does not produce a runnable `10/10/10` pack.

## 8. Decisions before any future scoring

Do not score from this table.

Before a runnable Arm B pack exists, the next curation step must either:

1. expand the place/object token pool with new reviewed Finnish tokens; or
2. explicitly narrow the design to a smaller non-scoring inspection table; or
3. split Arm B into sub-arms:
   - Arm B1: place/object with existing tokens only;
   - Arm B2: expanded place/object pool;
   - Arm B3: place/object with high-anchor contamination split.

## 9. Next safe work

Next safe evals work:

1. review this Arm B table;
2. decide whether to expand the place/object pool;
3. if expanding, create a separate curation-expansion document before any runnable payload;
4. do not score until the expanded table is reviewed.
