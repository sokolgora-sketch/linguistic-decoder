# Open Instrument PATH_MATCH Repair Guidance v0.1

Status: guidance doc only.

This document records the repair doctrine for Open Instrument v0.2 local-provider work after the five-word failure analysis in PR #1153.

## 1. Purpose

Open Instrument uses verifier repairs as a truth-preserving step, not a cosmetic pass-finder.

The repair rule is:

Repair must make the candidate true, not merely make the verifier pass.

If a candidate cannot honestly satisfy the missing constraint, it should remain rejected.

## 2. Background

The five-word v0.2 smoke analysis showed this pattern:

- `study` passed on attempt 2 with `vowelPath=["U","Y"]`
- `damage` failed after 3 attempts
- `language` failed after 3 attempts
- `philosophy` failed after 3 attempts
- `mathematics` failed after 3 attempts

All four failures were `PATH_MATCH` repair failures.

The archive guard passed, so the artifact shape was valid.

That means the issue is not archive corruption or JSON damage.
The issue is proposal and repair quality under the stricter path condition.

## 3. What PATH_MATCH means

`PATH_MATCH` means the candidate's vowel path does not yet satisfy the expected pattern for the current word and repair mode.

This is a semantic failure, not a formatting failure.

The repair step must not hide that failure by inventing a path, lowering the bar, or changing the meaning of the candidate.

## 4. Valid repair

A valid repair does all of the following:

- keeps the candidate anchored to the original word
- keeps the candidate anchored to the actual analysis path
- preserves any honest `vowelPath` evidence that exists
- fills gaps only when the candidate can still truthfully support the constraint
- stops when the candidate cannot be made true

Valid repair may:

- tighten decomposition wording
- clarify an already-supported vowel path
- reframe a candidate so the verifier can evaluate the same true structure more cleanly

Valid repair may not:

- invent a vowel path
- convert a failed candidate into a fake success
- overwrite a missing path with a guessed path
- force a candidate to pass by changing the meaning of the underlying proposal

## 5. Invalid repair

The following are invalid repair behaviors:

- making up `vowelPath` values
- replacing the candidate's actual structure with a prettier one
- suppressing the failure reason
- treating `PATH_MATCH` as a formatting-only error
- retrying until a pass appears, even when the candidate is not honest

If the only way to pass is to lie about the path, the repair must stop.

## 6. Required invariants

Repair must preserve these invariants:

1. The candidate must remain tied to the word under analysis.
2. The path evidence must remain honest.
3. The repair output must not overstate confidence.
4. The final status must distinguish real success from repaired convenience.
5. The archive must continue to record both success and failure honestly.

## 7. Handling `vowelPath`

When `vowelPath` is present:

- preserve the actual path
- do not normalize it into a different path unless the change is demonstrably true
- do not strip the path just to satisfy a cleaner summary

When `vowelPath` is absent:

- do not pretend the path exists
- do not convert absence into a guessed sequence
- if the path is required for correctness and cannot be established honestly, keep the `PATH_MATCH` failure

`vowelPath.present` must remain a reviewed field, not an ignored detail.

## 8. Retry behavior

Retries are allowed only as honest repair attempts.

Recommended behavior:

- one repair pass should try to fix the actual path issue
- if the second attempt still cannot make the candidate true, stop
- do not continue retrying past the point where the repair becomes speculative

Retries should improve truthfulness, not merely churn until the verifier yields.

## 9. Non-goals

This guidance doc does not:

- change the prompt implementation
- change the verifier implementation
- change the archive guard
- change the default provider
- change the local smoke artifact format
- change eval or Cohort evidence
- add new tests

This is doctrine for future prompt and repair tuning, not code.

## 10. Claim boundary

This guidance is development guidance only.

It is not:

- scientific evidence
- publication evidence
- eval evidence
- Cohort evidence
- a reason to change the default provider from `mock`

## 11. Future next step

The next implementation lane should use this doctrine to improve the prompt or repair path so that `PATH_MATCH` handling becomes honest first, not merely permissive.

## 12. Completion definition

This doc is complete when:

- the repair doctrine is stated plainly
- `PATH_MATCH` is defined as a truth-preserving repair condition
- valid and invalid repair behavior are separated
- `vowelPath.present` is explicitly protected as a real signal
- the claim boundary stays narrow
