# Open Instrument Structured User Evaluation v0.1

Status: `OPEN_INSTRUMENT_STRUCTURED_USER_EVALUATION_PROTOCOL_READY_V0_1`

This document defines a moderated, deterministic evaluation of the current Open
Instrument `/chat` product. It is a protocol only. No participants have been
run and no usability result is claimed.

## Purpose

Evaluate whether people can understand and use the current product without
confusing:

- current analysis with an imported local snapshot;
- supported functional evidence with a structural hypothesis;
- reviewed evidence with research evidence;
- Null with an engine or network failure;
- a candidate record with a primary readout;
- Evidence Package export with Reproducible Run Bundle reopen;
- candidate ordering with a forced winner;
- a source link with proof of a claim;
- functional interpretation with historical origin.

This is not an evaluation of whether participants agree with Seven-Voices
research doctrine, historical etymology, or any proposed origin.

## Product basis

The protocol is derived from the current production surfaces:

- `src/components/ZroChatPage.tsx` owns `/chat` input, analysis requests,
  import state, current/imported provenance, and error banners.
- `src/ui/instrument/InstrumentPanel.tsx` owns the Overview, Evidence,
  Candidates, Roots / Meaning, and Advanced tabs.
- `src/ui/instrument/sections/AnalysisStatusCard.v0.1.tsx` exposes reviewed,
  research, structural, and Null status labels.
- `src/ui/candidates/CandidatesAccordion.tsx` exposes candidate status,
  provenance, hypothesis boundaries, evidence references, and user decision
  posture.
- `src/ui/candidates/EvidenceReferenceLink.tsx` exposes safe reviewed/research
  source navigation and leaves unresolved or diagnostic references as text.
- `src/ui/instrument/sections/EvidencePackageCard.tsx` exposes copy and durable
  Evidence Package download with the VM-derived audit boundary.
- `src/ui/instrument/ReproducibleRunBundleControls.v0_1.tsx` exposes local
  analysis download/reopen and current/imported snapshot provenance.

The existing contract tests establish the case classifications used below:

- `tests/apiAnalyzeV1.analysisStatus.v0_1.spec.ts` covers `study`, `damage`,
  `mode`, and `xyz` status outputs.
- `tests/apiAnalyzeV1.embryoFirstReviewedRuntimeVisibility.v0_1.spec.ts`
  covers reviewed `DI` for `study` and reviewed `DA` for `damage`.
- `tests/ui.instrument.structuralHypothesisTruthDisplay.v0_1.spec.tsx` covers
  structural `ER` and research evidence for `sterile`.
- `tests/ui.instrument.reproducibleRunBundle.v0_1.spec.tsx` covers valid local
  import, provenance, Null import, structural import, and no re-analysis.
- `tests/ui.instrument.evidenceNavigation.v0_1.spec.tsx` covers reviewed and
  research links, unresolved references, and diagnostic references.

## Evaluation mode

Use a moderated or semi-moderated session with a local deterministic build.
Use one clean browser context per participant and the fixed case order in this
document. Do not add telemetry or analytics for this evaluation.

The evaluator records answers before explaining any product boundary. The
moderator may explain mechanics after an answer is recorded, but must mark the
task as assisted.

Recommended session length is 45 to 60 minutes:

- 5 minutes introduction and consent to record notes;
- 30 to 40 minutes task sequence;
- 10 to 15 minutes final interview.

Do not collect names, email addresses, or other personal information. Use a
participant code such as `P01`.

## Participant profiles

### Profile A: language and meaning user

Non-technical person interested in language, meaning, or word exploration. No
prior Open Instrument knowledge is required.

Primary questions: Can this person understand what the result is and is not,
find supporting material, and avoid reading hypotheses as facts?

### Profile B: technical or research-aware user

Person comfortable reading provenance, evidence labels, JSON, or research
distinctions. Prior Open Instrument knowledge is not required.

Primary questions: Can this person follow the evidence and snapshot workflow
without overclaiming what integrity, status, or a source link proves?

### Optional Profile C: linguistics-aware evaluator

Person familiar with linguistic evidence or historical-language claims. Use
this profile only if available; it is not required for the minimum sample.

Do not train participants on the correct answers before T1 through T9.

## Deterministic case set

The minimum case set contains five live analysis cases and one local import
workflow. These are existing tested cases, not newly asserted semantic truths.

| Case ID | Type | Input or artifact | Expected product state | Evidence basis | Evaluation use |
| --- | --- | --- | --- | --- | --- |
| C1 | Supported reviewed case | `study` | `reviewed_functional_evidence`; reviewed DI candidate is visible | API status and reviewed runtime tests | Baseline supported result |
| C2 | Supported reviewed case | `damage` | `reviewed_functional_evidence`; reviewed DA candidate is visible | API status and reviewed runtime tests | Second reviewed result |
| C3 | Null case | `xyz` | `null_no_supported_candidate`; Overview shows `Null - no supported candidate` | API status and Null UI tests | Null/error distinction |
| C4 | Structural hypothesis case | `mode` | `structural_unreviewed`; structural output remains hypothesis-only | API status and structural UI tests | Hypothesis boundary |
| C5 | Research candidate case | `sterile` | research functional hypothesis and research candidate provenance are visible; research is not reviewed | research status and structural/research UI tests | Reviewed/research distinction |
| C6 | Imported bundle case | valid existing `study` Reproducible Run Bundle | `Imported local snapshot`; schema and fingerprint are visible; no re-analysis | RRB parser and UI handoff tests | Export/reopen/provenance |

For C6, prepare the file through the existing Reproducible Run Bundle flow or
use a valid fixture generated by the current test contract. Do not fabricate a
new analytical result. Do not use an Evidence Package as an import artifact.

The case set is intentionally not provider-driven. If a case does not produce
the expected state in the current build, stop the session and classify the
problem as a runtime or fixture issue rather than changing the scoring rule.

## Task matrix

Scores are recorded after the participant answers. The wording below is fixed
for v0.1 and must not be made more leading during a session.

| Task ID | Case | Input | Expected product state | User instruction | Question | Correct interpretation | Common failure mode | Scoring rule | Truth boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | C1 | `study` | Current analysis with a reviewed functional candidate | Analyze the word and inspect the visible result. | What do you think this result says, and what would you inspect next? | A reviewed functional evidence status and candidate are present; this does not declare historical origin or a winner. | Treats the first row as the final origin answer. | 2 identifies reviewed support and one non-claim; 1 identifies only one; 0 makes an origin/winner claim. | Reviewed evidence is not historical proof. |
| T2 | C3 | `xyz` | Primary Null | Analyze the word and describe the result. | What happened here? | Null is a valid analytical result meaning no supported functional conclusion is available at this boundary; it is not a request, network, or engine failure. | Calls Null an error or says the word has no possible history. | 2 distinguishes Null from failure and avoids broader claims; 1 recognizes no supported result but is uncertain; 0 calls it failure or disproves all relations. | Null is not failure and is not proof of nonexistence. |
| T3 | C4 | `mode` | Structural hypothesis | Analyze the word, open candidate records, and describe the candidate type. | How should this candidate be treated? | It is a structural, unreviewed hypothesis and not candidate truth or reviewed evidence. | Treats embryo or structure as a verified candidate. | 2 states hypothesis-only status; 1 notices uncertainty without the boundary; 0 treats it as reviewed truth. | Structural output is not candidate truth. |
| T4 | C5 | `sterile` | Research functional hypothesis | Analyze the word and find the research-labelled candidate information. | How is this information different from reviewed evidence? | Research status remains research/unreviewed; the functional bridge is a hypothesis and is not promoted to reviewed evidence. | Treats citations or research labels as production verification. | 2 preserves research distinction and hypothesis status; 1 identifies research but overstates one part; 0 calls it reviewed/confirmed. | Research evidence is not reviewed production truth. |
| T5 | C1 | `study` | Candidate evidence references | Open candidate records, locate an evidence reference, and open a navigable source if available. | What did the source link help you inspect, and what does the link itself establish? | The link opens a known source record; it does not independently verify the candidate, origin, or winner. | Cannot find the reference or calls the link proof. | 2 completes navigation and states the limited meaning; 1 completes only one; 0 cannot locate or overclaims. | Navigation is traceability, not verification. |
| T6 | C1 | `study` | Evidence Package | Open the Evidence tab and inspect the Evidence Package actions. | What is this package for, and what would you use it for? | It is a VM-derived audit/handoff export; it is not origin proof, a forced answer, or a reopenable analysis snapshot. | Expects the package to restore or reproduce analysis. | 2 distinguishes audit export from reopenable snapshot; 1 identifies export but not the boundary; 0 treats it as the saved analysis. | Evidence Package and RRB are separate artifacts. |
| T7 | C1 | `study` | Reproducible Run Bundle controls | Download the analysis, then open the saved file through the existing control. | What changed after opening the saved file? | The local snapshot was reopened from the file; import does not mean a fresh analysis was run. | Assumes the file is only a report or assumes import triggered analysis. | 2 identifies reopen and no re-analysis; 1 identifies import without the request distinction; 0 misidentifies the flow. | Reopen is local handoff, not fresh execution. |
| T8 | C6 | saved `study` bundle | Imported local snapshot | Inspect the provenance label and bundle metadata after import. | Is the visible result current or imported, and what supports your answer? | It is an imported local snapshot; schema and fingerprint identify the saved bundle, not analytical truth. | Calls it current analysis or treats the fingerprint as proof of the claim. | 2 identifies imported state and limits fingerprint meaning; 1 identifies state only; 0 confuses state or truth. | Provenance and integrity are not analytical validation. |
| T9 | C1 or C2 | `study` or `damage` | Candidate list with user decision posture | Return to candidate records and compare the visible candidates. | Which candidate did the engine select as the one true winner? | No single winner is declared; ordering and presentation do not replace `user_decides`. | Treats the first candidate as an engine-selected winner. | 2 explicitly rejects the premise and states user decision posture; 1 says uncertain; 0 names a winner. | No single winner; user decides. |

`TASK_COUNT=9`.

## Pre-registered scoring

Each task receives three scores before discussion:

- `CORE`: whether the participant completed the requested task and answered the
  main question.
- `BOUNDARY`: whether the answer preserved the required Fact/Inference/
  Hypothesis/Unknown distinction.
- `CONFIDENCE`: self-reported confidence in the answer.

Use the same 0 to 2 scale:

| Score | Core or boundary meaning | Confidence meaning |
| --- | --- | --- |
| 0 | Incorrect, not completed, or materially overclaims | Guessing or no confidence |
| 1 | Partially correct, hesitant, or needs clarification | Some confidence but material uncertainty |
| 2 | Correct and independently explained | Confident and can identify the basis |

For navigation and export tasks, `CORE=2` requires successful operation, not
just a verbal description. For T2, T3, T4, T8, and T9, `BOUNDARY` is the
critical score.

### Participant-level measures

- `COMPREHENSION_ACCURACY`: mean CORE score across T1-T9, expressed as a
  percentage of the available 2-point scores.
- `TRUTH_BOUNDARY_ACCURACY`: mean BOUNDARY score across T1-T9.
- `EVIDENCE_TRACE_SUCCESS`: CORE score for T5.
- `EXPORT_REOPEN_UNDERSTANDING`: combined CORE and BOUNDARY scores for T6-T8.
- `NULL_ERROR_DISTINCTION`: BOUNDARY score for T2.
- `WINNER_AVOIDANCE`: BOUNDARY score for T9.
- `CONFIDENCE_IN_INTERPRETATION`: mean CONFIDENCE score across T1-T9, reported
  separately from correctness.

### Pre-registered aggregate thresholds

The minimum v0.1 sample is six participants: at least three Profile A and three
Profile B participants. Profile C is supplemental. This is a directional
comprehension pilot, not a population estimate; the minimum ensures both
required perspectives are represented.

Classify the aggregate before seeing results:

- `PASS`: minimum sample and profile coverage are met; each critical task T2,
  T3, T4, T8, and T9 has at least 80% of responses with BOUNDARY=2; no critical
  misunderstanding repeats across two or more participants; and the overall
  CORE and BOUNDARY means are at least 1.5/2.
- `PARTIAL`: minimum sample is met, no repeated critical misunderstanding is
  present, but one or more comprehension or workflow thresholds are below the
  PASS threshold.
- `FAIL`: a critical misunderstanding repeats across at least two participants,
  or a deterministic product contradiction is observed in the same state by
  two participants.
- `INSUFFICIENT_SAMPLE`: fewer than six participants, missing required profile
  coverage, or a case could not be run deterministically.

A single participant misunderstanding is recorded and investigated; it does not
automatically authorize a product change.

## Critical failure conditions

| Severity | Condition |
| --- | --- |
| CRITICAL | Participant says the product declared historical origin, treats structural output as reviewed evidence, treats research as production truth, interprets Null as system failure, believes import reanalyzed the word, or identifies a forced engine winner. |
| MAJOR | Participant cannot locate the evidence supporting a visible candidate, cannot distinguish candidate record from primary readout, or believes Evidence Package can reopen the analysis. |
| MINOR | Participant hesitates, misses a control, needs a mechanical locator, or finds wording/layout difficult without making a truth-boundary error. |

Critical observations are written verbatim where possible and linked to the
task and visible state. Do not soften a critical boundary error into a general
usability note.

## Moderator script

### Introduction

Say:

> We are evaluating how clearly the interface communicates its analysis and
> evidence boundaries. We are not testing whether you agree with a linguistic
> theory. Please think aloud, and answer from what you see before asking for
> help. There are no personal data questions in this session.

Do not define reviewed evidence, research evidence, Null, structural
hypothesis, winner, or provenance before T1-T9.

### Neutral instructions

- Use the provided local `/chat` build.
- Use the exact input shown for each task.
- Explain what you believe the interface is communicating.
- You may change your mind, but state what changed your mind.
- Do not search external sources during the session.

### Fixed task order

Run T1 through T5, then T6 through T8 as the export/reopen sequence, then T9.
Reset to a clean browser context between unrelated cases. Keep the downloaded
RRB file for C6 only; do not use an Evidence Package as a saved-analysis file.

### No-coaching rules

- Do not confirm or deny a participant interpretation before recording it.
- Do not paraphrase a question into its correct answer.
- Do not point to a label unless the task is explicitly a navigation task.
- If the participant is mechanically blocked for 30 seconds, give only the
  minimum locator instruction, record `ASSISTED`, and continue.
- If a product error prevents the task, record the exact state and stop that
  task; do not substitute a different case.

### Clarification allowed

Clarification may explain mechanics only, such as "the task requires the
Evidence tab" or "use the saved file from the previous task." Clarification
may not explain what Null, research, reviewed, structural, or winner means.

### Post-task questions

Ask the same neutral probes after each task:

- What made you choose that answer?
- What, if anything, was difficult to find?
- What would you want to inspect next?

### Final interview

- What would you trust this instrument to tell you?
- What would you not trust it to tell you?
- Which labels or boundaries were easiest to understand?
- Which result type was hardest to interpret?
- What did you think the two downloadable artifacts were for?
- Did any screen imply more certainty than you expected?

## Result classification

Every observation receives one primary classification:

- `PRODUCT_DEFECT`: deterministic behavior contradicts the current contract.
- `LABELING_AMBIGUITY`: visible copy permits a materially wrong interpretation.
- `INFORMATION_ARCHITECTURE_ISSUE`: the needed existing information is too hard
  to locate or its hierarchy is unclear.
- `TRAINING_OR_INSTRUCTION_ISSUE`: the task or setup was insufficiently clear,
  without a product contradiction.
- `EXPECTED_USER_VARIANCE`: an individual preference or interpretation that
  does not violate the product contract.
- `RESEARCH_DOCTRINE_DISAGREEMENT`: disagreement with research content, not a
  comprehension failure.
- `NON_ACTIONABLE`: observation does not support a product change.
- `UNKNOWN`: insufficient evidence to classify.

## Change gate

This protocol does not authorize an immediate UI or semantic patch.

One participant comment alone does not justify a product change unless it
reveals a critical deterministic contract defect. A normal UX change requires
one of:

- repeated observation across at least two participants;
- a clear contradiction with an existing contract or test;
- a critical truth-boundary risk confirmed by the evaluator.

Before any implementation lane, consolidate observations, preserve the raw
score sheets, classify findings, and write a separate change proposal. Do not
change scoring criteria after participant results are seen.

## Non-goals and boundaries

- No production code, engine, adapter, ranking, API, provider, or Firebase
  changes.
- No new evidence or Petro terminology.
- No evidence promotion or origin declaration.
- No claim that the product is historically correct.
- No participant results in this design lane.
- No telemetry or analytics implementation.
- No import semantics for Evidence Package.
- Reproducible Run Bundle remains the reopenable local snapshot.
- Evidence Package remains a VM-derived audit/handoff export.

## Protocol readiness

`PROTOCOL_READY=YES`

The protocol is executable once a moderator has the current local build and the
fixed case artifacts. It is not an evaluation result and does not claim product
usability success.
