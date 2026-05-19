# Cohort 03 High-Region Audit Design v0.1

Status: DESIGN ONLY
Project: ZË-RO
Milestone: Cohort 03
Date recorded: 2026-05-19

This document defines the first high-region audit design under:

- `docs/evals/cohort-03-high-region-anchor-review-v0.1.md`
- `docs/evals/cohort-03-high-region-audit-protocol-v0.1.md`

It does not run evaluations.
It does not create evidence packs.
It does not change scoring code.
It does not change bracket rules.
It does not update README.
It does not publish anything.
It does not claim the high-region issue is solved.

## 1. Audit target

Target language:

- Hindi

Target vowel:

- `/i`

Reason for choosing Hindi `/i` first:

- Hindi `/i` already has a recorded pressure pack.
- The recorded Hindi `/i` pack collapsed high in both `V5-V7` candidate runs and both `V4-V7` control runs.
- The recorded Hindi `/i` pack had no diagnostic flags.
- This makes Hindi `/i` a clean diagnostic case for separating token-function mismatch, bracket geometry, and scorer sensitivity.

Source result:

- `docs/evals/cohort-03-hindi-i-indo-iranian-result-v0.1.md`

## 2. Audit question

Allowed question:

> Which part of the high-region lens is producing repeated high collapse for Hindi `/i`?

Blocked question:

> Can we prove `V5-V7` support by choosing better Hindi `/i` tokens?

This audit is diagnostic, not support-seeking.

## 3. Audit arms

This design defines two arms.

### Arm A — current-lens reproduction

Purpose:

- reproduce the prior Hindi `/i` pressure pattern using the current anchor logic;
- add explicit function-class documentation to the token design;
- check whether the earlier collapse repeats under better token accountability.

Series label:

- `cohort03-hi-i-highregion-audit-arm-a-current-lens-v0.1`

Bracket comparison:

- candidate: `V5-V7`
- control: `V4-V7`

Planned run IDs:

| Ordinal | Run ID | Bracket | Role |
|---:|---|---|---|
| 1 | `cohort03-hi-i-audit-a-v5-v7-main-r01` | `V5-V7` | candidate main |
| 2 | `cohort03-hi-i-audit-a-v5-v7-alt-r01` | `V5-V7` | candidate alt |
| 3 | `cohort03-hi-i-audit-a-v4-v7-control-main-r01` | `V4-V7` | control main |
| 4 | `cohort03-hi-i-audit-a-v4-v7-control-alt-r01` | `V4-V7` | control alt |

### Arm B — function-matched target audit

Purpose:

- test whether high collapse is caused by broad mixed target semantics;
- narrow the Hindi `/i` target bucket to common concrete entity nouns;
- keep brackets the same as Arm A so the main difference is target-function control.

Series label:

- `cohort03-hi-i-highregion-audit-arm-b-function-matched-v0.1`

Bracket comparison:

- candidate: `V5-V7`
- control: `V4-V7`

Planned run IDs:

| Ordinal | Run ID | Bracket | Role |
|---:|---|---|---|
| 1 | `cohort03-hi-i-audit-b-v5-v7-main-r01` | `V5-V7` | candidate main |
| 2 | `cohort03-hi-i-audit-b-v5-v7-alt-r01` | `V5-V7` | candidate alt |
| 3 | `cohort03-hi-i-audit-b-v4-v7-control-main-r01` | `V4-V7` | control main |
| 4 | `cohort03-hi-i-audit-b-v4-v7-control-alt-r01` | `V4-V7` | control alt |

## 4. Arm A token-function table

Arm A intentionally reproduces the current-lens Hindi `/i` pack structure.

Risk note:

- target buckets remain function-mixed by design;
- this is allowed only because Arm A is a reproduction arm.

### 4.1 Arm A main

| token | bucket | functionClass | gloss | reasonIncluded | riskNote |
|---|---|---|---|---|---|
| chalna | anchor_low | movement-action | to walk/move | V5 movement anchor | verb anchor |
| jana | anchor_low | movement-action | to go | V5 movement anchor | verb anchor |
| aana | anchor_low | movement-action | to come | V5 movement anchor | verb anchor |
| daurna | anchor_low | movement-action | to run | V5 movement anchor | broad transliteration |
| behna | anchor_low | flow-action | to flow | V5 flow anchor | verb anchor |
| raasta | anchor_low | path-noun | road/path | V5 path anchor | clean |
| safar | anchor_low | journey-noun | journey | V5 passage anchor | clean |
| yatra | anchor_low | journey-noun | journey/travel | V5 passage anchor | clean |
| hawa | anchor_low | flow-noun | wind/air | V5 flow anchor | clean |
| lahar | anchor_low | wave-noun | wave | V5 flow anchor | clean |
| din | x_vowel | time-noun | day | visible `/i` target | mixed target function |
| dil | x_vowel | body/emotion-noun | heart | visible `/i` target | mixed target function |
| sir | x_vowel | body-noun | head | visible `/i` target | mixed target function |
| kitab | x_vowel | object/knowledge-noun | book | visible `/i` target | mixed target function |
| nadi | x_vowel | flow-place-noun | river | visible `/i` target | overlaps V5 |
| pita | x_vowel | kinship-noun | father | visible `/i` target | mixed target function |
| kisan | x_vowel | person-noun | farmer | visible `/i` target | mixed target function |
| shiksha | x_vowel | knowledge-noun | education | visible `/i` target | mixed target function |
| vidya | x_vowel | knowledge-noun | knowledge | visible `/i` target | mixed target function |
| garib | x_vowel | property/person | poor | visible `/i` target | adjective/person overlap |
| nok | anchor_high | point-noun | tip/point | V7 point anchor | clean |
| lakshya | anchor_high | target-noun | target | V7 target anchor | clean |
| rekha | anchor_high | line-noun | line | V7 line anchor | clean |
| teer | anchor_high | sharp-object | arrow | V7 point anchor | clean |
| dhaar | anchor_high | edge-noun | edge/blade | V7 edge anchor | clean |
| seema | anchor_high | boundary-noun | boundary | V7 boundary anchor | contains target-like vowel in transliteration |
| kaanta | anchor_high | sharp-object | thorn | V7 point anchor | clean |
| nazar | anchor_high | sight/target-noun | gaze | V7 targeting anchor | semantic abstraction |
| kendra | anchor_high | center-noun | center | V7 focus anchor | clean |
| chhed | anchor_high | point/opening-noun | hole | V7 point/opening anchor | clean |

### 4.2 Arm A alt

| token | bucket | functionClass | gloss | reasonIncluded | riskNote |
|---|---|---|---|---|---|
| gaman | anchor_low | movement-noun | motion | V5 movement anchor | formal register |
| bahav | anchor_low | flow-noun | flow | V5 flow anchor | clean |
| pravah | anchor_low | flow-noun | flow/current | V5 flow anchor | clean |
| raah | anchor_low | path-noun | path | V5 path anchor | clean |
| mod | anchor_low | path-change-noun | turn/bend | V5 path anchor | clean |
| chal | anchor_low | movement-noun | movement/gait | V5 movement anchor | clean |
| daur | anchor_low | motion/time-noun | run/period | V5 movement anchor | polysemous |
| lahar | anchor_low | wave-noun | wave | V5 flow anchor | clean |
| hawa | anchor_low | flow-noun | wind/air | V5 flow anchor | clean |
| safar | anchor_low | journey-noun | journey | V5 passage anchor | clean |
| mitti | x_vowel | substance-noun | soil/clay | visible `/i` target | concrete but not same class as all targets |
| chidiya | x_vowel | animal-noun | bird | visible `/i` target | concrete noun |
| bistar | x_vowel | object-noun | bed | visible `/i` target | concrete noun |
| kiran | x_vowel | light-noun | ray | visible `/i` target | physical/abstract edge |
| nishan | x_vowel | mark-noun | sign/mark | visible `/i` target | overlaps V7 |
| vichar | x_vowel | thought-noun | thought | visible `/i` target | abstract |
| sitar | x_vowel | object-noun | sitar | visible `/i` target | instrument noun |
| shikar | x_vowel | action/result-noun | hunt/prey | visible `/i` target | mixed function |
| kishor | x_vowel | person-noun | adolescent | visible `/i` target | person noun |
| imli | x_vowel | food/object-noun | tamarind | visible `/i` target | concrete noun |
| bindu | anchor_high | point-noun | dot/point | V7 point anchor | contains target vowel |
| sui | anchor_high | sharp-object | needle | V7 point anchor | contains target vowel |
| lakir | anchor_high | line-noun | line | V7 line anchor | contains target vowel |
| nishana | anchor_high | target-noun | target/aim | V7 target anchor | contains target vowel |
| rekha | anchor_high | line-noun | line | V7 line anchor | clean |
| teer | anchor_high | sharp-object | arrow | V7 point anchor | clean |
| dhaar | anchor_high | edge-noun | edge/blade | V7 edge anchor | clean |
| kaanta | anchor_high | sharp-object | thorn | V7 point anchor | clean |
| chhed | anchor_high | point/opening-noun | hole | V7 opening anchor | clean |
| seema | anchor_high | boundary-noun | boundary | V7 boundary anchor | contains target-like vowel |

## 5. Arm B token-function table

Arm B narrows the target bucket to common concrete entity nouns.

Risk note:

- if Arm B stabilizes while Arm A collapses, token-function mismatch is likely;
- if Arm B also collapses, bracket geometry or scorer sensitivity remains likely.

### 5.1 Arm B main

| token | bucket | functionClass | gloss | reasonIncluded | riskNote |
|---|---|---|---|---|---|
| raasta | anchor_low | path-noun | road/path | V5 path anchor | clean noun anchor |
| safar | anchor_low | journey-noun | journey | V5 passage anchor | clean noun anchor |
| yatra | anchor_low | journey-noun | journey/travel | V5 passage anchor | clean noun anchor |
| lehar | anchor_low | flow-noun | wave | V5 flow anchor | clean noun anchor |
| hawa | anchor_low | flow-noun | wind/air | V5 flow anchor | clean noun anchor |
| naav | anchor_low | travel-object | boat | V5 passage anchor | clean noun anchor |
| mod | anchor_low | path-change-noun | turn | V5 path anchor | clean noun anchor |
| pravah | anchor_low | flow-noun | flow/current | V5 flow anchor | clean noun anchor |
| dhara | anchor_low | flow-noun | stream/current | V5 flow anchor | clean noun anchor |
| bahav | anchor_low | flow-noun | flow | V5 flow anchor | clean noun anchor |
| kitab | x_vowel | concrete-entity-noun | book | visible `/i` concrete target | object/knowledge overlap |
| kursi | x_vowel | concrete-entity-noun | chair | visible `/i` concrete target | clean |
| chabi | x_vowel | concrete-entity-noun | key | visible `/i` concrete target | clean |
| sikka | x_vowel | concrete-entity-noun | coin | visible `/i` concrete target | clean |
| katori | x_vowel | concrete-entity-noun | bowl | visible `/i` concrete target | clean |
| imli | x_vowel | concrete-entity-noun | tamarind | visible `/i` concrete target | food object |
| topi | x_vowel | concrete-entity-noun | cap | visible `/i` concrete target | clean |
| patti | x_vowel | concrete-entity-noun | leaf/strip | visible `/i` concrete target | polysemous |
| mitti | x_vowel | concrete-entity-noun | soil/clay | visible `/i` concrete target | substance noun |
| chidiya | x_vowel | concrete-entity-noun | bird | visible `/i` concrete target | living entity |
| nok | anchor_high | point-noun | tip/point | V7 point anchor | clean noun anchor |
| teer | anchor_high | sharp-object | arrow | V7 point anchor | clean noun anchor |
| kaanta | anchor_high | sharp-object | thorn | V7 point anchor | clean noun anchor |
| dhaar | anchor_high | edge-noun | edge/blade | V7 edge anchor | clean noun anchor |
| rekha | anchor_high | line-noun | line | V7 line anchor | clean noun anchor |
| lakshya | anchor_high | target-noun | target | V7 target anchor | clean noun anchor |
| chhed | anchor_high | opening-noun | hole | V7 point/opening anchor | clean noun anchor |
| bindu | anchor_high | point-noun | dot/point | V7 point anchor | contains target vowel |
| seema | anchor_high | boundary-noun | boundary | V7 boundary anchor | contains target-like vowel |
| kendra | anchor_high | focus-noun | center | V7 focus anchor | clean noun anchor |

### 5.2 Arm B alt

| token | bucket | functionClass | gloss | reasonIncluded | riskNote |
|---|---|---|---|---|---|
| raah | anchor_low | path-noun | path | V5 path anchor | clean noun anchor |
| safar | anchor_low | journey-noun | journey | V5 passage anchor | clean noun anchor |
| yatra | anchor_low | journey-noun | journey/travel | V5 passage anchor | clean noun anchor |
| rasta | anchor_low | path-noun | road/path | V5 path anchor | spelling variant risk |
| lehar | anchor_low | flow-noun | wave | V5 flow anchor | clean noun anchor |
| dhara | anchor_low | flow-noun | stream/current | V5 flow anchor | clean noun anchor |
| pravah | anchor_low | flow-noun | flow/current | V5 flow anchor | clean noun anchor |
| mod | anchor_low | path-change-noun | turn | V5 path anchor | clean noun anchor |
| naav | anchor_low | travel-object | boat | V5 passage anchor | clean noun anchor |
| pavan | anchor_low | flow-noun | wind | V5 flow anchor | elevated register |
| bistar | x_vowel | concrete-entity-noun | bed | visible `/i` concrete target | clean |
| chitthi | x_vowel | concrete-entity-noun | letter | visible `/i` concrete target | spelling variation |
| mirch | x_vowel | concrete-entity-noun | chili | visible `/i` concrete target | food object |
| bijli | x_vowel | concrete-entity-noun | electricity/lightning | visible `/i` concrete target | physical phenomenon |
| moti | x_vowel | concrete-entity-noun | pearl | visible `/i` concrete target | clean |
| machhli | x_vowel | concrete-entity-noun | fish | visible `/i` concrete target | spelling variation |
| dibbi | x_vowel | concrete-entity-noun | small box | visible `/i` concrete target | less common |
| chimta | x_vowel | concrete-entity-noun | tongs | visible `/i` concrete target | object/tool |
| tikki | x_vowel | concrete-entity-noun | patty/cake | visible `/i` concrete target | food object |
| pinjra | x_vowel | concrete-entity-noun | cage | visible `/i` concrete target | clean |
| nok | anchor_high | point-noun | tip/point | V7 point anchor | clean noun anchor |
| sui | anchor_high | sharp-object | needle | V7 point anchor | contains target vowel |
| teer | anchor_high | sharp-object | arrow | V7 point anchor | clean noun anchor |
| dhaar | anchor_high | edge-noun | edge/blade | V7 edge anchor | clean noun anchor |
| rekha | anchor_high | line-noun | line | V7 line anchor | clean noun anchor |
| lakir | anchor_high | line-noun | line | V7 line anchor | contains target vowel |
| nishana | anchor_high | target-noun | target/aim | V7 target anchor | contains target vowel |
| chhed | anchor_high | opening-noun | hole | V7 point/opening anchor | clean noun anchor |
| seema | anchor_high | boundary-noun | boundary | contains target-like vowel |
| kendra | anchor_high | focus-noun | center | V7 focus anchor | clean noun anchor |

## 6. Planned JSON construction

The later `/evals` run must use the exact tokens from this design.

Arm A main task:

- `anchorLow`: `V5`
- `anchorHigh`: `V7`
- `anchor_low`: `chalna`, `jana`, `aana`, `daurna`, `behna`, `raasta`, `safar`, `yatra`, `hawa`, `lahar`
- `x_vowel`: `din`, `dil`, `sir`, `kitab`, `nadi`, `pita`, `kisan`, `shiksha`, `vidya`, `garib`
- `anchor_high`: `nok`, `lakshya`, `rekha`, `teer`, `dhaar`, `seema`, `kaanta`, `nazar`, `kendra`, `chhed`

Arm A alt task:

- `anchorLow`: `V5`
- `anchorHigh`: `V7`
- `anchor_low`: `gaman`, `bahav`, `pravah`, `raah`, `mod`, `chal`, `daur`, `lahar`, `hawa`, `safar`
- `x_vowel`: `mitti`, `chidiya`, `bistar`, `kiran`, `nishan`, `vichar`, `sitar`, `shikar`, `kishor`, `imli`
- `anchor_high`: `bindu`, `sui`, `lakir`, `nishana`, `rekha`, `teer`, `dhaar`, `kaanta`, `chhed`, `seema`

Arm B main task:

- `anchorLow`: `V5`
- `anchorHigh`: `V7`
- `anchor_low`: `raasta`, `safar`, `yatra`, `lehar`, `hawa`, `naav`, `mod`, `pravah`, `dhara`, `bahav`
- `x_vowel`: `kitab`, `kursi`, `chabi`, `sikka`, `katori`, `imli`, `topi`, `patti`, `mitti`, `chidiya`
- `anchor_high`: `nok`, `teer`, `kaanta`, `dhaar`, `rekha`, `lakshya`, `chhed`, `bindu`, `seema`, `kendra`

Arm B alt task:

- `anchorLow`: `V5`
- `anchorHigh`: `V7`
- `anchor_low`: `raah`, `safar`, `yatra`, `rasta`, `lehar`, `dhara`, `pravah`, `mod`, `naav`, `pavan`
- `x_vowel`: `bistar`, `chitthi`, `mirch`, `bijli`, `moti`, `machhli`, `dibbi`, `chimta`, `tikki`, `pinjra`
- `anchor_high`: `nok`, `sui`, `teer`, `dhaar`, `rekha`, `lakir`, `nishana`, `chhed`, `seema`, `kendra`

For each main/alt task, the matching `V4-V7` control must keep the same `x_vowel` and `anchor_high` buckets, but replace `anchor_low` with a `V4` stable-field bucket.

V4 main control anchor:

- `ghar`, `makan`, `gaon`, `khet`, `zameen`, `angan`, `patthar`, `ped`, `sthaan`, `aadhar`

V4 alt control anchor:

- `ghar`, `phal`, `jal`, `dhan`, `ras`, `man`, `tan`, `van`, `kal`, `raj`

## 7. Interpretation rules

Use the protocol interpretation matrix.

Expected decision logic:

| Result pattern | Interpretation |
|---|---|
| Arm A collapses but Arm B stabilizes | broad target-function mixing is likely |
| Arm A and Arm B both collapse in `V5-V7` but `V4-V7` stabilizes | bracket geometry / width problem likely |
| Arm A and Arm B both collapse in both `V5-V7` and `V4-V7` | scorer sensitivity or high-anchor suction likely |
| Arm B stabilizes only when high-anchor tokens with `/i` contamination are removed later | high-anchor token contamination likely |
| both arms remain collapsed with no flags | hard high-region model pressure remains likely |

## 8. Completion definition

This audit design is complete when:

- the design doc is merged;
- no scoring has happened before merge;
- Arm A and Arm B are ready to run as separate evidence-pack series;
- all planned run IDs are locked;
- all token-function tables are present.

## 9. Claim boundaries

Allowed:

- Hindi `/i` is selected as the first high-region audit target.
- Arm A and Arm B are designed.
- Token-function tables are locked for the first audit.
- The next step after merge is running the audit packs.

Blocked:

- Do not claim the audit result before scoring.
- Do not claim the high-region issue is solved.
- Do not claim `V5-V7` supports high/front `/i`-type cases.
- Do not claim Hindi `/i` supports any bracket.
- Do not update README from this design alone.
- Do not publish this design as a result.
- Do not change scoring code from this design alone.
