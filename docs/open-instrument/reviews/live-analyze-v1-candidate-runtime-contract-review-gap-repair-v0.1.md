# Live analyze-v1 candidate runtime contract review-gap repair v0.1 - Review

Date: 2026-09-06

Status: LIVE_ANALYZE_V1_CANDIDATE_RUNTIME_CONTRACT_REVIEW_GAP_REPAIR_REVIEWED_ACCEPTED_READY_FOR_NEXT_OPEN_INSTRUMENT_LANE.

Reviewed implementation:

* PR #1830 - `fix(open-instrument): close candidate contract review gaps v0.1`
* Feature head: `7d28145b6dad6010d0d27cc4237b6204090828aa`
* Squash merge: `3ccd49748a500c46cd1dca11bdeb71adfcc95cfe`

## Review verdict

The two bounded gaps identified in the prior candidate runtime-contract review
are closed.

The candidate validator now parses every non-empty candidate array against the
existing normalized full-envelope and explicit research-hypothesis compatibility
variants. Validation no longer depends on finding the required `candidateId`
field before validation begins, so a single malformed candidate or an array
containing only malformed candidates cannot bypass the contract.

The existing research-hypothesis compatibility variant remains unchanged, and
empty candidate arrays remain valid. The repair does not assert linguistic truth,
citation truth, historical origin, winner status, or source validity.

The review record's gate wording is also corrected: `gate:quick` runs lint, unit,
and integration commands but skips production build; the production build is
recorded separately.

## Regression coverage

`tests/apiAnalyzeV1.contract.spec.ts` now proves that:

* a non-empty candidate array with a missing `candidateId` is rejected;
* an all-malformed candidate array is rejected instead of bypassing validation;
* the existing valid normalized candidate envelope still preserves legacy fields.

## Verification

* Focused post-merge proof: `3` suites, `15` tests, `1` snapshot passed.
* Full unit phase: `604` suites, `2,610` tests, `149` snapshots passed.
* Production build passed.
* GitHub checks passed: Analyze actions, Analyze TypeScript, contracts, CodeQL,
  and lint-test-build.
* Local `gate:quick` and the pre-push gate reached lint and unit successfully
  but did not terminate during integration; both were stopped and are not
  claimed as local gate passes.

## Scope confirmation

This repair and review do not:

* call a provider or model;
* execute a replay;
* mutate fixtures or reviewed artifacts;
* change UI or VM rendering;
* change VoiceLab, evals, Seven-Voice ordering, evidence promotion, ranking,
  FVR, or JO runtime.

## Next lane

Select the next Open Instrument task from fresh source and review evidence while
preserving reviewed-evidence precedence, valid Null results, no single winner,
no fabricated provenance, and research-only boundaries.
