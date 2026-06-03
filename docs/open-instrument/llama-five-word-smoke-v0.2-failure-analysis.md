# Open Instrument Llama Five-Word Smoke v0.2 Failure Analysis

Status: docs-only analysis.
Scope: failure explanation only.
Default provider remains `mock`.

## 1. Purpose

Analyze the archived Open Instrument local-provider smoke v0.2 run from PR #1152 and explain why only `study` passed while the other four words failed.

This document does not change code, prompts, guards, or artifacts.

## 2. Source material

- Artifact: `docs/open-instrument/artifacts/local-provider-smoke/2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-five-word-v0.2.json`
- Result doc: `docs/open-instrument/llama-local-provider-five-word-smoke-v0.2-result.md`

## 3. Result summary

| Word | Status | AttemptsUsed | AcceptedCandidateForms | vowelPath.present | vowelPath.value | Fail reason category |
|---|---:|---:|---|---:|---|---|
| `study` | PASS | 2 | `study` | true | `U, Y` | repair-resolved PATH_MATCH |
| `damage` | FAIL | 3 | `` | true | `A, U` | verifier rejection: PATH_MATCH |
| `language` | FAIL | 3 | `` | true | `A, E` | verifier rejection: PATH_MATCH |
| `philosophy` | FAIL | 3 | `` | true | `I, O` | verifier rejection: PATH_MATCH |
| `mathematics` | FAIL | 3 | `` | true | `A, E` | verifier rejection: PATH_MATCH |

## 4. Per-word analysis

### study

- The first proposal already carried `vowelPath=["U","Y"]`, but the artifact trace records an initial `PATH_MATCH` mismatch because the extracted path expected `U→I`.
- On repair, the model converged quickly and the accepted candidate passed with `English`, `action: to study`, `instrument: book`, and `unit: hour`.
- This is the only word in the set that reached a clean PASS.

### damage

- The artifact shows a single candidate with `vowelPath=["A","U"]`.
- The verifier reason was `PATH_MATCH`: provided `A→U`, extracted `A→A→E`.
- The model kept the same basic shape across attempts and did not repair the vowel path into a passing sequence.
- This looks like repeated repair failure on the exact vowel-path alignment requirement.

### language

- The artifact shows a single candidate with `vowelPath=["A","E"]`.
- The verifier reason was `PATH_MATCH`: provided `A→E`, extracted `A→U→A→E`.
- The decomposition was structurally non-empty (`express / tongue / word`), so the failure is not primarily a decomposition-format problem.
- The failure is a repair loop that never matched the full extracted path.

### philosophy

- The artifact shows a single candidate with `vowelPath=["I","O"]`.
- The verifier reason was `PATH_MATCH`: provided `I→O`, extracted `I→O→O→I`.
- The candidate had a valid-looking English decomposition (`contemplate / mind / thought`), but the vowel path was still too short and did not match.
- This is another repeated repair failure on vowel-path completeness rather than a JSON or language-registry issue.

### mathematics

- The artifact shows a single candidate with `vowelPath=["A","E"]`.
- The verifier reason was `PATH_MATCH`: provided `A→E`, extracted `A→E→A→I`.
- The decomposition was structured (`calculate / mind / concept`), so the rejection again came from path alignment.
- Like the other failures, the model did not learn the full extracted vowel path within three attempts.

## 5. Repair-loop observation

- `study` changed once and was recovered by repair.
- The four failed words all repeated the same high-level issue: the model produced a plausible candidate but could not repair `vowelPath` to match the extracted path.
- There is no evidence in the artifact of missing JSON, empty `vowelPath`, lowercase `vowelPath`, or invalid non-Seven-Voice symbols.
- The core failure mode is repeated `PATH_MATCH` repair failure.

## 6. Interpretation

- `llama3.1:8b` is not yet reliable for v0.2 five-word smoke.
- The v0.2 guard/artifact system worked correctly.
- The artifact is honest: it records one success and four failures without hiding the failing traces.
- The current prompt path is stricter than the earlier v0.1 path, but the model still does not reliably satisfy it across the five-word set.

## 7. Recommended next engineering move

Do not expand to ten-word v0.2 yet.

Likely next options:

- strengthen the repair prompt;
- add failure-specific repair instruction;
- try a stronger local model;
- add a per-word diagnostic runner;
- manually inspect raw proposer outputs.

## 8. Non-goals

- no code change
- no prompt change
- no new artifact
- no guard change
- no README/publication claim

## 9. Claim boundary

- not scientific evidence
- not publication evidence
- not eval evidence
- not Cohort evidence
- not general model-quality proof
- not reason to change default provider from `mock`

## 10. Completion definition

This analysis is complete when:

- the archived v0.2 artifact has been inspected;
- the failure modes have been categorized from the actual trace;
- the result doc has been referenced;
- the analysis doc is merged cleanly;
- DF_BRAIN is updated after merge.
