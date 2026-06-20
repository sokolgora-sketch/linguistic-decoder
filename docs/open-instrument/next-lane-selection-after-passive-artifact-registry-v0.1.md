# Open Instrument — Next Lane Selection After Passive Artifact Registry v0.1

Status: NEXT_LANE_SELECTED.

Project lane: Open Instrument / ZËRO.

Selection date: 2026-06-20.

Selection base:

* Short SHA: `43f8d73f`
* Full SHA: `43f8d73f08e962be30fe382fb8ee7279cdc864db`

Closed previous lane:

* Open Instrument Passive Artifact Registry v0.1
* Close doc: `docs/open-instrument/open-instrument-passive-artifact-registry-v0.1-lane-close.md`

## Selection decision

The next Open Instrument lane is:

`docs(open-instrument): define Open Instrument passive-to-runtime authorization checklist v0.1`

This is a docs-only authorization-checklist lane.

It does not authorize runtime integration.

It does not authorize API output changes.

It does not authorize UI integration.

It does not authorize provider execution.

It does not authorize Zheji replay.

## Why this lane is selected

The passive artifact registry v0.1 is now defined, reviewed, and closed.

The project has enough passive artifacts and governance records to require an explicit authorization checklist before any future runtime/API/UI/provider/provenance work.

The safe next step is to define a passive-to-runtime authorization checklist that says exactly what must be true before passive artifacts can be considered for wiring.

This prevents accidental promotion from passive reference material into product behavior.

## Candidate lanes considered

### Candidate A — Passive-to-runtime authorization checklist v0.1

Decision: SELECTED.

Reason:

* closes the governance gap between passive artifacts and future runtime work
* keeps current work docs-only
* creates a hard checklist before any integration lane
* protects against accidental API/UI/provider wiring
* gives future reviews clear acceptance criteria

### Candidate B — Runtime integration planning

Decision: DEFERRED.

Reason:

* runtime work remains unauthorized
* the registry is passive
* no authorization checklist exists yet
* integration planning before checklist would be premature

### Candidate C — API/UI exposure for Zheji Semantic Transparency

Decision: REJECTED FOR NOW.

Reason:

* API/UI exposure crosses current passive boundaries
* no separate explicit lane has authorized it
* semantic transparency must not become product behavior without an authorization checklist

### Candidate D — Provider execution or replay lane

Decision: REJECTED.

Reason:

* provider execution remains unauthorized
* Zheji replay remains unauthorized
* replay would change the lane from governance to execution

### Candidate E — Evidence pack or publication lane

Decision: REJECTED.

Reason:

* passive artifacts are not publication evidence
* no candidate-truth, origin, ownership, or model-quality evidence was created
* publication framing remains out of scope

## Selected lane scope

The selected lane may define a checklist document only.

The selected lane may define authorization fields.

The selected lane may define required proof before runtime/API/UI/provider/provenance work.

The selected lane may define explicit rejection criteria.

The selected lane may reference the passive artifact registry.

The selected lane may reference Zheji passive artifacts.

The selected lane may not modify runtime code.

The selected lane may not modify API output.

The selected lane may not modify UI output.

The selected lane may not execute providers.

The selected lane may not replay Zheji.

The selected lane may not create evidence packs.

The selected lane may not modify package metadata.

The selected lane may not modify CI.

## Expected checklist target

The next lane should define:

`docs/open-instrument/open-instrument-passive-to-runtime-authorization-checklist-v0.1.md`

The checklist should include at minimum:

* artifact family
* registry status
* review status
* close status
* runtime wiring authorization
* API output authorization
* UI output authorization
* provider execution authorization
* replay authorization
* package metadata authorization
* evidence promotion authorization
* required validation commands
* exact changed-file proof
* explicit rejection reasons
* next allowed action

## Required validation for selected lane

The selected lane must run:

* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

Because the lane references Zheji artifacts, it must also run:

* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`

## Hard boundaries

Hard boundaries remain:

* No provider execution.
* No Zheji replay.
* No runtime/API/UI behavior changes.
* No package metadata changes.
* No evidence promotion.
* No publication framing.
* No VoiceLab work.

## Current next task

`docs(open-instrument): define Open Instrument passive-to-runtime authorization checklist v0.1`
