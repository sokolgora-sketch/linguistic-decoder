# Open Instrument Structured User Evaluation SELF_PILOT_DF v0.1

Status: `PILOT_RECORDED_NOT_OFFICIAL_RESULT`

Parent lane: `OPEN_INSTRUMENT_STRUCTURED_USER_EVALUATION_EXECUTION_V0_1`

Parent status: `AWAITING_HUMAN_PARTICIPANTS / INSUFFICIENT_SAMPLE`

Official evaluation status: `INSUFFICIENT_SAMPLE`

## Eligibility boundary

`SELF_PILOT_DF` was a moderator-guided practice and usability run performed by
the product builder/operator. It is not an independent participant, is not P01,
and is excluded from all official participant counts and aggregate evaluation
status.

The official protocol requires at least six independent participants, including
at least three Profile A and three Profile B participants. This artifact records
zero eligible independent participants and does not claim that the structured
evaluation passed.

## Run context

| Field | Value |
| --- | --- |
| Pilot identifier | `SELF_PILOT_DF` |
| Product commit tested | `89fe60edbad8869ace23fe840a79593670959ad1` |
| Moderator context | Product builder/operator |
| Evaluation mode | Moderator-guided local deterministic `/chat` run |
| Official participant count | `0` |
| Required independent sample | `6` minimum |
| Protocol status | `PROTOCOL_READY=YES` |

No personal information is recorded in this artifact.

## Task results

Scores use the protocol's 0-2 scales. `ASSISTED=YES` means the moderator
provided a mechanical locator or repeated an instruction. The original T5
score is intentionally preserved even though the defect was fixed afterward.

| Task | Case | CORE | BOUNDARY | CONFIDENCE | ASSISTED | CRITICAL_FAILURE | Classification | Finding |
| --- | --- | ---: | ---: | ---: | --- | --- | --- | --- |
| T1 | `study` / reviewed functional evidence | 2 | 2 | 2 | NO | NO | NON_ACTIONABLE | Correctly identified reviewed DI functional support without making a historical-origin or winner claim. |
| T2 | `xyz` / Null | 2 | 2 | 2 | NO | NO | NON_ACTIONABLE | Distinguished Null from request, network, or engine failure and avoided claiming that Null disproves every possible relationship. RootMap metadata was not treated as necessarily absent. |
| T3 | `mode` / structural unreviewed | 2 | 2 | 2 | NO | NO | NON_ACTIONABLE | Treated the structural result as hypothesis-only. The RootMap M+DA structural hypothesis remained distinct from the Latin `modus` SEED row. |
| T4 | `sterile` / research functional hypothesis | 2 | 2 | 2 | NO | NO | NON_ACTIONABLE | Distinguished research functional hypotheses from reviewed evidence. Source attestation truth and functional-bridge hypothesis status were not conflated. |
| T5 | `study` / evidence navigation | 1 | 2 | 2 | NO | NO | PRODUCT_DEFECT | Original pilot found `EVIDENCE_REFS_PROJECTION_MISSING`: reviewed DI citation identity was resolvable in the repository but absent from live candidate `evidenceRefs`. Major navigation/discoverability issue. |
| T6 | Evidence Package | 1 | 2 | 2 | NO | NO | NON_ACTIONABLE | Initial answer partially blurred the VM-derived audit/handoff export with the reopenable Reproducible Run Bundle. One observation does not authorize a product change. |
| T7 | Reproducible Run Bundle reopen | 2 | 2 | 2 | NO | NO | NON_ACTIONABLE | Successfully reopened a local snapshot and correctly identified that no fresh analysis ran. |
| T8 | Imported snapshot provenance | 2 | 2 | 2 | YES | NO | NON_ACTIONABLE | Correctly identified imported state and bounded the fingerprint as bundle identity/integrity correspondence, not analytical or linguistic truth. Moderator provided the exact provenance/metadata location. |
| T9 | Winner/order boundary | 2 | 2 | 2 | NO | NO | NON_ACTIONABLE | Correctly identified ordered candidate presentation without an engine-declared winner; `user_decides` and `no_single_winner` remained intact. |

## Pilot aggregates

| Measure | Result |
| --- | --- |
| CORE | `16/18` (`88.9%`) |
| BOUNDARY | `18/18` (`100%`) |
| CONFIDENCE | `18/18` (`100%`) |
| Assisted tasks | `T8` only |
| Critical misunderstandings | `0` |
| Critical failures | `0` |
| Official eligible participants | `0` |
| Official aggregate status | `INSUFFICIENT_SAMPLE` |

These are pilot/practice observations, not participant results and not an
official PASS, PARTIAL, or FAIL classification.

## T5 defect history and verification

Original pilot T5 remains exactly:

```text
CORE=1
BOUNDARY=2
CONFIDENCE=2
ASSISTED=NO
```

The defect was subsequently fixed by PR #1904, merged at
`89fe60edbad8869ace23fe840a79593670959ad1`.

Separate post-fix runtime verification, not a retroactive pilot score, did the
following:

- analyzed `study`;
- expanded the reviewed DI candidate;
- displayed the evidence source link;
- resolved the registry-backed URL `https://en.wiktionary.org/wiki/di#Albanian`;
- opened the link successfully;
- preserved the functional-motivation and no-historical-origin boundaries.

## Observation classifications

- `T5`: `PRODUCT_DEFECT`, major navigation/evidence-discoverability issue; resolved by PR #1904.
- `T6`: minor partial-comprehension observation; no automatic product change from one self-pilot run.
- `T8`: mechanical locator assistance; not classified as a product defect from this run alone.
- All other observations: `NON_ACTIONABLE` for this single practice run.

No repeated-user evidence is claimed.

## Official next gate

Run the actual structured evaluation with independent human participants using
the existing protocol and score-sheet template. Preserve one score record per
participant, maintain the required Profile A/Profile B coverage, and classify
the aggregate only against the pre-registered thresholds.

This self-pilot sublane does not change production code, engine semantics,
ranking, evidence promotion, research/provider execution, evaluation scoring
rules, or the evaluation protocol.
