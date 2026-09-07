# Open Instrument Fresh-Word Embryo Discovery v1

**Milestone ID:** `OPEN_INSTRUMENT_FRESH_WORD_EMBRYO_DISCOVERY_V1`

**Status:** `ACTIVE`

**Opened:** 2026-09-08

**Opening main SHA:** `01ea85e95c2d079be9016f5337db8cf3a8faae8c`

**Opening branch:** `main`

**Protected JO stash:** `8b7e4397ac3341c1c4ea9c004b29e6fa93db40b1` (`park-jo-runtime-verified-before-logic-first-milestone-2026-08-25`)

## 1. Purpose

Extend Open Instrument's deterministic structural discovery only where a generic, bounded structural operation supports a smallest defensible embryo. An explicit user-provided target sense may then bind that structural result to the existing doctrine projection, logic-derived hypothesis, verifier, API, and `/chat` surfaces.

This milestone must preserve legitimate Null. It must not manufacture lexical meaning, evidence, historical origin, candidate truth, or a single winner.

## 2. Doctrine lock

Canonical Seven Voices remain `A, E, I, O, U, Y, Ë`. Vowels drive the voice path; consonants shape frames. The truth hierarchy remains Fact, Inference, Hypothesis, and Unknown / Null.

Every logic-derived result must preserve:

- `no_single_winner`;
- `historicalOriginClaim=not_claimed`;
- `historicalTransmissionClaim=not_claimed`;
- `winnerClaim=not_claimed`;
- `languageSuperiorityClaim=not_claimed`;
- `candidateTruthClaim=not_claimed`;
- `userDecisionPosture=user_decides`.

Structural reachability and doctrine alignment are not lexical meaning or evidence.

## 3. Opening failure matrix

The existing `discoverStructuralHypothesesV0_1` was probed on the known opening set at the opening head. Every word returned zero structural hypotheses, including when an explicit target sense was supplied to the later logic layer:

| Word | Structural hypotheses | Current result |
| --- | ---: | --- |
| `candle` | 0 | `null_no_supported_candidate` |
| `staircase` | 0 | `null_no_supported_candidate` |
| `orchard` | 0 | `null_no_supported_candidate` |
| `tunnel` | 0 | `null_no_supported_candidate` |
| `ribbon` | 0 | `null_no_supported_candidate` |
| `helmet` | 0 | `null_no_supported_candidate` |
| `pocket` | 0 | `null_no_supported_candidate` |
| `chimney` | 0 | `null_no_supported_candidate` |

The existing `sterile` control remains a positive structural family with `ER` as its smallest embryo. The first lane must classify these failures before any grammar change.

## 4. Lanes

| Lane | State |
| --- | --- |
| 1. Baseline failure taxonomy | DONE |
| 2. Generic structural grammar expansion | DONE |
| 3. Structural defensibility v0.2 / additive verification | DONE |
| 4. Explicit target-sense product path | DONE |
| 5. End-to-end functional discovery | DONE |
| 6. Generalization / anti-hardcode proof | DONE |
| 7. Negative / adversarial controls | DONE |
| 8. Live product proof | NEXT |
| 9. Milestone closeout | NOT_STARTED |

## 5. Exit criteria

The milestone may become `DONE` only after:

- both the opening set and a frozen, post-implementation held-out set contain at least one genuinely surviving generic structural family;
- structural operations are explicit, bounded, traceable, word-independent, and fail closed;
- the normal `/chat` workflow accepts an explicit target sense without requiring an internal ID;
- logic-derived hypotheses remain weaker than reviewed/research evidence and remain user-decided;
- negative controls, Null preservation, no-single-winner, reviewed/research precedence, and no-hardcode scans pass;
- focused tests, `npm run gate:quick`, integration tests, production build, live smoke, direct API proof, and `/chat` proof pass;
- the implementation PR is reviewed, green, merged, and local `main` is synchronized;
- the protected JO stash remains unchanged;
- this document records the real merge proof and closure marker.

## 6. Codex continuation protocol

Every continuation must verify repository identity, branch/main state, divergence, worktree, remote, and protected stash before editing. Read this document and the closed predecessor in full. Continue only the first incomplete lane. Inspect current implementation, callers, and tests before patching. Never weaken existing gates to improve coverage, and never add word-specific branches, catalog rows, lexical meanings, or evidence claims.

## 7. Lane 1 closeout: baseline failure taxonomy

The current v0.1 grammar was inspected and probed without production changes. Its authorized operations are `peel_right_vowel_led_expansion` and `peel_left_consonant_frame`; the existing defensibility gates require at least two authorized operations and a minimum emitted anchor size of two.

| Word | Voice path | Mechanically reachable terminal(s) | Rejection |
| --- | --- | --- | --- |
| `candle` | `A,E` | `ANDLE` after one left-frame peel | one operation; terminal remains above size 2 |
| `staircase` | `A,I,A,E` | `AIRC` after `ASE` peel plus two left-frame peels; `AIRCASE` via two left-frame peels | smallest defensible terminal is size 4 |
| `orchard` | `O,A` | `ORCH` after `ARD` right vowel-led peel | one operation; terminal remains above size 2 |
| `tunnel` | `U,E` | `UNN` after `EL` right vowel-led peel plus one left-frame peel | smallest defensible terminal is size 3 |
| `ribbon` | `I,O` | `IBB` after `ON` right vowel-led peel plus one left-frame peel | smallest defensible terminal is size 3 |
| `helmet` | `E,E` | `ELM` after `ET` right vowel-led peel plus one left-frame peel | smallest defensible terminal is size 3 |
| `pocket` | `O,E` | `OCK` after `ET` right vowel-led peel plus one left-frame peel | smallest defensible terminal is size 3 |
| `chimney` | `I,E` | `IMNEY` after two left-frame peels | smallest defensible terminal is size 5 |

The dominant gap is not target sense, evidence, or doctrine. It is a missing generic right-edge consonant-led expansion/frame grammar. Some words contain a bounded three-symbol terminal CCV frame with exactly one canonical voice, but v0.1 only recognizes the reverse vowel-led orientation. Existing operation-count and minimum-anchor gates remain justified and unchanged.

The `sterile` positive control remains `ER` with the existing three-step chain. The `xyz`, `data`, `dij`, and `mode` negative controls remain Null under the current grammar.

## 8. Lane 2 closeout: generic structural grammar expansion

The structural grammar was extended additively in `src/shared/structuralHypothesisDiscovery.v0_1.ts` with `peel_right_consonant_led_expansion`.

The operation is authorized only when:

- the removed segment is exactly three normalized symbols;
- its first two symbols are consonant frame symbols;
- its final symbol is a canonical Seven-Voice symbol;
- the segment contains exactly one canonical voice;
- the retained base is at least three symbols and contains a canonical voice.

The operation emits a complete transformation trace and reason code. Existing `operationCount >= 2` and minimum anchor size `2` gates were not changed. No target word, target sense, lexical lookup, evidence row, or catalog data is consulted.

Focused validation:

- 6 suites passed;
- 75 tests passed;
- opening `candle` now yields `AN <- CAN <- CANDLE`;
- `staircase`, `orchard`, `tunnel`, `ribbon`, `helmet`, `pocket`, and `chimney` remain Null;
- `sterile` remains exactly `ER`, `ERILE`;
- `xyz`, `data`, `dij`, `mode`, `terror`, and `sister` remain empty.

This is a bounded structural family, not a lexical claim. `AN` has no independent standalone meaning or attestation in this lane.

## 9. Lane 3 closeout: additive verification for the new structural operation

The verifier allowlist now authorizes `peel_right_consonant_led_expansion` without changing the truth hierarchy or weakening any existing acceptance rule. The verifier test exercises the actual discovered `candle -> AN` path and confirms that a user-bound logic hypothesis is accepted only as a hypothesis with the existing claim-boundary protections.

Focused validation:

- 7 suites passed;
- 73 tests passed;
- structural, verifier, API, UI, projection, defensibility, and normalization coverage remained green;
- no-single-winner, historical-origin, historical-transmission, winner, language-superiority, candidate-truth, and user-decision protections remain unchanged.

This closes verification for the additive operation. It does not claim that `AN` is a lexical meaning or reviewed evidence.

## 10. Lane 4 closeout: explicit target-sense product path

The normal `/chat` composer now accepts an optional `Intended sense` label. The UI sends the label only; callers do not need to know an internal sense ID. The API derives a deterministic opaque `user_sense_*` identifier from the normalized label when an ID is absent, preserves explicit IDs for existing callers, and continues to omit the logic-derived layer when the label is blank.

The route carries both target-sense fields into the existing analysis adapter for GET and POST requests. No discovery, evidence, catalog, or truth-status rules were changed.

Focused validation:

- 4 suites passed;
- 24 tests passed;
- UI request proof confirms the label is sent and an internal ID is not required;
- direct API proof confirms `candle` produces a `candidate_only` logic-derived hypothesis with `AN -> CAN -> CANDLE`;
- historical origin, historical transmission, winner, language-superiority, candidate-truth, and user-decision boundaries remain unchanged;
- existing verifier and responsive-shell tests remain green.

## 11. Lane 5 closeout: end-to-end functional discovery

The new structural family now travels through the existing deterministic analysis adapter and public UI model without a parallel product path. A label-only request for `candle` produces a verified logic-derived candidate with the public expansion chain `AN -> CAN -> CANDLE`, `candidate_only` status, and the explicit target-sense label. `CandidatesAccordion` renders it as a logic-derived functional hypothesis with an explicitly hypothesis-level bridge.

The existing stronger-evidence `sterile` path remains research-functional-hypothesis precedence, and blank target sense continues to suppress logic-derived output. No catalog, research, or projection contract was changed.

Focused validation:

- direct API, analysis adapter, verifier, UI candidate-model, and candidate-surface coverage passed;
- the candle label-only request was rendered through `adaptAnalysisToTelemetryVM`, `buildCandidateRowsFromVM`, and `CandidatesAccordion`;
- the rendered result shows `Target sense: a wax light source`, `AN`, and `Functional bridge: Hypothesis only; no source-backed evidence`.

## 12. Lane 6 closeout: held-out generalization and anti-hardcode proof

A frozen held-out set confirms that the new behavior is generic rather than a `candle` branch. The same bounded operation family produces logic-derived candidates for `bistro -> IS`, `contra -> ON`, and `mantra -> AN`. `electro`, `extra`, `ultra`, `metro`, `intro`, `terror`, and `sister` remain `null_no_supported_candidate` under the same explicit target-sense request.

The held-out test also scans `src/shared/structuralHypothesisDiscovery.v0_1.ts` and rejects target-word literals for the opening and held-out sets. The implementation remains driven by normalized form shape, canonical voice membership, bounded suffix length, existing operation-count, and minimum-anchor gates.

Validation:

- held-out/generalization, UI truth-display, and structural-contract suites passed;
- 3 suites passed;
- 17 tests passed;
- opening distribution remains 1 positive and 7 Null;
- held-out distribution is 3 positive and 7 Null.

## 13. Lane 7 closeout: negative and adversarial controls

Existing and milestone-focused controls remain green without weakening the grammar. Unsupported Unicode input fails closed rather than being transliterated, punctuation does not create unsupported lexical equivalence, weak one-step terminals remain rejected, `terror` and `sister` do not leak `ER`, malformed verifier values reject, unauthorized operation IDs reject, and repeated verification does not mutate hypotheses.

The control set also preserves the claim boundary: structural and logic-derived outputs remain non-winning, non-historical, non-superiority, non-candidate-truth, and user-decided. Stronger reviewed/research evidence continues to own aggregate status.

Validation:

- 5 suites passed;
- 60 tests passed;
- opening, held-out, Unicode, minimum-anchor, verifier, precedence, and no-single-winner controls passed.

## 14. Initial next task

**Lane 8 — Live product proof.**

Run the repository’s actual focused gate, integration path, production build, live smoke, direct API proof, and normal `/chat` proof from the implementation branch. Do not claim product completion from unit tests alone.

## 11. Opening proof

- repository: `sokolgora-sketch/linguistic-decoder`;
- path: `/Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export`;
- branch: `main`;
- `HEAD=origin/main=01ea85e95c2d079be9016f5337db8cf3a8faae8c`;
- divergence: `0 behind / 0 ahead`;
- worktree: clean;
- JO stash marker and object: present;
- previous milestone: closed; do not reopen it.
