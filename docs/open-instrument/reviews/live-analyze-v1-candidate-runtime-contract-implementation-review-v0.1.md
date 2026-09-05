# Live analyze-v1 candidate runtime contract implementation v0.1 - Review

Date: 2026-09-06

Status: LIVE_ANALYZE_V1_CANDIDATE_RUNTIME_CONTRACT_IMPLEMENTATION_REVIEWED_ACCEPTED_READY_FOR_NEXT_OPEN_INSTRUMENT_LANE.

Reviewed implementation:

* PR #1827 - `fix(open-instrument): harden live candidate runtime contract v0.1`
* Feature head: `6534c32d24d8a477e488f9ad95b870c4be3bd23b`
* Squash merge: `9ef38d54ee8d4928290b342b95005a233c4ee866`

## Review verdict

The additive live analyze-v1 candidate runtime contract implementation is accepted.

The implementation adds `AnalyzeV1CandidateEnvelopeSchema` in
`src/shared/analyzeWordResult.v1.contract.ts` and validates candidate arrays
during `toAnalyzeWordResultV1Contract` when the live `candidateId` marker is
present.

The normalized envelope constrains:

* candidate identity and display fields;
* claim, origin, historical-relation, validation, and rank enums;
* embryo and isolation fields, including nullable absence;
* validation reasons, rank score/reason, claim boundary, and user posture.

The schema uses `.passthrough()` so legacy candidate fields remain preserved.
The existing source-backed research hypothesis shape remains an explicit
compatibility variant with `functionalMotivation`, `not_evaluated`,
`unresolved`, `research_functional_hypothesis_only`, and `user_decides`.

This schema validates output shape and boundary values only. It does not assert
linguistic truth, citation truth, historical origin, winner status, or source
validity.

## Tests and verification

Focused proof:

* `tests/apiAnalyzeV1.contract.spec.ts`
* `tests/apiAnalyzeV1.embryoFirstCandidate.contract.spec.ts`
* `tests/apiAnalyzeV1.corpus.gold.spec.ts`
* `3` suites, `13` tests, `1` snapshot passed.

Full local unit phase:

* `604` suites passed;
* `2,607` tests passed;
* `149` snapshots passed.

Production build passed.

GitHub checks passed:

* Analyze actions;
* Analyze TypeScript;
* contracts;
* CodeQL;
* lint-test-build.

Post-merge provider-disabled Open Instrument live smoke passed.

Local `gate:quick` completed its lint and unit phases but did not exit during
the integration phase and was stopped. Because `--quick` skips the production
build, the production build was executed separately and passed. It is not
treated as a local gate pass.

## Scope confirmation

The implementation and review do not:

* call a provider or model;
* execute a replay;
* mutate fixtures or reviewed artifacts;
* change UI or VM rendering;
* change VoiceLab, evals, Seven-Voice ordering, or JO runtime;
* promote evidence or make publication, origin, winner, or language claims.

## Next lane

Select the next Open Instrument task from fresh source and review evidence.
Preserve reviewed-evidence precedence, valid Null results, no single winner,
no fabricated provenance, and research-only boundaries.
