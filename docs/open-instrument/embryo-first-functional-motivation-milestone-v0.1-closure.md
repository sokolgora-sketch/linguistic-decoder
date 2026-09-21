# Open Instrument — Embryo-First Functional Motivation Milestone v0.1

Status: `EMBRYO_FIRST_FUNCTIONAL_MOTIVATION_MILESTONE_CLOSED`

Closure date: 2026-09-21

This document closes the implementation milestone defined by
`docs/open-instrument/embryo-first-functional-motivation-milestone-v0.1.md`.
It records implementation and contract readiness. It does not claim that an
embryo-first linguistic hypothesis has been scientifically validated.

## Closure decision

The milestone is closed because the reviewed live output contract is present
in the deterministic analysis path, the bounded damage/study examples and
focused tests exist, and the required repository gates pass. The closure is
limited to the implementation milestone. Source-attested functional evidence,
historical ancestry, candidate truth, and winner claims remain separately
gated and unclaimed.

Implementation source head inspected before this closure artifact:
`20abfa0109e0bace0f2be9d0a76468e36e1561b6`.

## Required milestone checklist

| Step | Requirement | Evidence | Result |
| --- | --- | --- | --- |
| 1 | Define the milestone | `docs/open-instrument/embryo-first-functional-motivation-milestone-v0.1.md:35-61` | PASS |
| 2 | Review and accept the milestone | `docs/open-instrument/reviews/embryo-first-functional-motivation-milestone-review-v0.1.md:5-18` | PASS |
| 3 | Define the live output contract | `docs/open-instrument/live-analyze-v1-embryo-first-candidate-output-contract-v0.1.md:52-571` | PASS |
| 4 | Review and accept the live output contract | `docs/open-instrument/reviews/live-analyze-v1-embryo-first-candidate-output-contract-review-v0.1.md:3-24, 38-171` | PASS |
| 5 | Implement the adapter/schema lane | `src/shared/analysisAdapter.ts:1340-1841`; `src/shared/analyzeV1Adapter.ts:227-355`; `tests/apiAnalyzeV1.embryoFirstCandidate.contract.spec.ts` | PASS |
| 6 | Review the implementation | `docs/open-instrument/reviews/live-analyze-v1-embryo-first-candidate-output-contract-implementation-review-v0.1.md:3-176` | PASS |
| 7 | Add bounded damage/study examples | `tests/apiAnalyzeV1.embryoFirstCandidate.examples.v0_1.spec.ts:1-374`; `docs/open-instrument/reviews/embryo-first-candidate-examples-damage-study-review-v0.1.md:3-184` | PASS |
| 8 | Close the milestone | This artifact plus the lifecycle and gate proofs recorded in the final report | PASS |

The original implementation documents still contain their historical
`pending review` and `next task` wording. Those statements describe the state
before the accepted review and implementation artifacts; this closure record
is the current milestone state and does not rewrite the historical records.

## Live implementation path

The live path is:

`/api/analyze-v1` → `runAnalysisDeterministic` → `enginePayloadToAnalysisResult`
→ `adaptAnalyzeV1ToUI` → candidate model → `CandidatesAccordion`.

The route assembles the deterministic result at
`app/api/analyze-v1/route.ts:881-910, 980-1063` and applies proposal/status
reconciliation at `app/api/analyze-v1/route.ts:1115-1150`.

The structural discovery producer creates the embryo-first hypothesis with an
embryo, size, structural status, reduction steps, expansion chain, evidence
references, bounded claim fields, and `user_decides` posture at
`src/shared/structuralHypothesisDiscovery.v0_1.ts:53-85`. Its normalization
boundary is explicit at
`src/shared/structuralHypothesisDiscovery.v0_1.ts:98-139`; it does not silently
transliterate or invent a structural match.

The analysis adapter validates and projects embryo-first candidates at
`src/shared/analysisAdapter.ts:1340-1731`, and orders them at `:1735-1841`.
The order distinguishes validated functional, partial functional, structural
hypothesis, surface/seed, historical context, and unresolved tiers. The
adapter keeps functional truth, source attestation, structural provenance,
claim boundaries, evidence references, and review posture separate.

The API adapter carries the typed fields through at
`src/shared/analyzeV1Adapter.ts:227-355`. The UI view model carries them at
`src/ui/candidates/candidateModel.ts:125-287`. The UI distinguishes research
row form/embryo from a structural embryo at
`src/ui/candidates/CandidatesAccordion.tsx:229-239`, and renders validation,
function, lexical/research labels, evidence, claim boundaries, and
`user_decides` at `src/ui/candidates/CandidatesAccordion.tsx:242-395`.

## Truth and claim boundaries

The live contract preserves:

- deterministic structural discovery as `structural_hypothesis`;
- embryo and expansion-chain context without candidate-truth promotion;
- functional motivation as hypothesis-only when present;
- independent source-attestation and evidence references;
- historical origin, borrowing, cognacy, candidate truth, and winner as
  unclaimed unless separately authorized;
- `Null` as a valid result;
- `no_single_winner` / `user_decides` posture.

The status contract is defined in
`src/shared/analysisStatus.v0_1.ts:6-34, 239-355`; the research-functional
predicate requires the existing target binding, source kind/status, functional
evidence basis, bridge/evidence references, attestation, claim boundary, and
negative historical/winner/candidate-truth protections. It does not turn a
structural embryo into production truth.

The output contract's ranking and seed rules are specified at
`docs/open-instrument/live-analyze-v1-embryo-first-candidate-output-contract-v0.1.md:360-455`.
The accepted review explicitly preserves the truth wall and does not authorize
API, engine, fixture, artifact, or provider changes:
`docs/open-instrument/reviews/live-analyze-v1-embryo-first-candidate-output-contract-review-v0.1.md:65-152`.

## Required damage and study examples

| Example | Bounded fixture | Structural path | Functional posture | Boundary |
| --- | --- | --- | --- | --- |
| Damage | `albanian-da-dam-damage-functional` | `DA → DAM → DAMAGE` | `functionalMotivation` example only | Static fixture; not historical origin, not production truth, `user_decides` |
| Study | `albanian-shtu-di-study-functional` | `SHTU + DI → STUDY` | `functionalMotivation` example only | Static fixture; not historical origin, not production truth, `user_decides` |

These examples are asserted by
`tests/apiAnalyzeV1.embryoFirstCandidate.examples.v0_1.spec.ts:261-374`.
That file's live GET-path checks at `:347-374` prove only that the current
`damage` and `study` responses remain bounded and that any seed/context
candidates stay unvalidated when isolation, source, or semantic-bridge
requirements are absent; they do not assert those static fixture IDs. The
dedicated reviewed-runtime visibility test
`tests/apiAnalyzeV1.embryoFirstReviewedRuntimeVisibility.v0_1.spec.ts:43-173`
proves the separate live reviewed candidates, including
`albanian-da-dam-damage-functional` for damage and
`albanian-di-know-functional` for study.
The example review records the same limits at
`docs/open-instrument/reviews/embryo-first-candidate-examples-damage-study-review-v0.1.md:44-103`.

## Validation proof

Focused command:

```text
npm test -- --runInBand tests/apiAnalyzeV1.embryoFirstCandidate.contract.spec.ts tests/apiAnalyzeV1.embryoFirstCandidate.examples.v0_1.spec.ts tests/analyzeV1.adapter.contract.spec.ts tests/apiAnalyzeV1.contract.spec.ts tests/ui.instrument.embryoFirstCandidatePresentation.v0_1.spec.tsx
```

Result: PASS — 5 suites, 32 tests, 0 snapshots failed.

Repository gates on the implementation state:

- `npm run open-instrument:analysis-capability-baseline -- --check`: PASS.
  Baseline: 57 cases; reviewed functional 2; research functional 0;
  candidate-only 4; structural unreviewed 22; Null 29; 110 candidates;
  66 evidence references and 66 resolved references; repeatability 57/57;
  invariant failures 0. Artifact SHA-256:
  `12a92a4fe5faec0516b30d3a7e86e75924f9c68349b905a2c07d61289d406650`.
- `npm run gate:quick`: PASS — 709 suites passed, 3 skipped; 3,592 tests
  passed, 4 skipped; 149 snapshots passed; integration 2 suites and 5 tests
  passed, including the production build.
- `npm run build`: PASS — standalone production build; TypeScript and 22
  static pages completed successfully.
- `npm run gate`: PASS — 709 suites passed, 3 skipped; 3,592 tests passed,
  4 skipped; 149 snapshots passed; integration 2 suites and 5 tests passed;
  both production-build phases completed successfully.

The first sandboxed full-gate attempt encountered temporary `tsx` IPC
`listen EPERM`; the unchanged command was rerun with the required environment
permission and passed. This is recorded as an environment restriction, not a
code failure.

## M7 relationship and remaining limitations

M7 is supplementary research state, not an implementation criterion in the
milestone documents. The milestone plan and completion criterion are defined
at `docs/open-instrument/embryo-first-functional-motivation-milestone-v0.1.md:198-262`.
The M7 preregistration README explicitly describes M7 as research-only and
non-production at
`docs/open-instrument/research-artifacts/m7-three-case-replication-v1/README.md:3-10`.

Current M7 state is therefore preserved without being promoted into runtime:

- M7-01: `INSUFFICIENT_CORRESPONDENCE`.
- M7-02 Replacement-02: unresolved because the canonical pre-reveal bytes
  remain inaccessible; reconstruction and controlled reveal remain forbidden.
- M7-03 Replacement-03: completed clean blind run, result `NULL`; pre-reveal
  SHA `a923b4453782e65f482b1632204797a50b8dd4f8dc7437ef5c6d9741378a3e69`;
  post-reveal SHA `98c0c89378aa5afefd7cd9776e25e4df9ed06338f5ba161db0012e133e6a710e`.
- Strict completed blind/freeze/reveal cases: 2.
- Strict positive embryo-first correspondences: 0.

The milestone does not claim that M7 produced a positive functional
correspondence. No M7 source row, provider execution, or scientific claim is
admitted by this closure.

The named `albanian-da-dam-damage-functional` and
`albanian-shtu-di-study-functional` records in the examples test remain static
contract fixtures; they are not assertions that those exact fixture objects
are the live catalog rows. The repository does, however, already expose live
validated reviewed candidates for the `damage` and `study` routes through the
separate runtime-visibility coverage cited above, including their source
attestation and bounded claim fields. This closure does not add or alter that
reviewed evidence. The remaining limitation is scientific rather than a
missing runtime seam: M7 has not supplied a strict positive embryo-first
correspondence, so this milestone does not claim new source discovery or
historical validation.

## Scope and non-goals

This closure artifact is the only intended repository mutation for this lane.
It does not change structural discovery, the Seven-Voices engine, source
content, research catalog rows, target-bound architecture, UI architecture,
M7 artifacts, or analytical baseline content. It does not create a new source
tradition, provider path, historical claim, winner, or production evidence.

The milestone is closed as an implementation/readiness milestone, not as proof
of a successful linguistic discovery.
