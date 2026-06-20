# Open Instrument — Next Lane Selection After Zheji Semantic Transparency v0.1

Status: NEXT_LANE_SELECTED.

Project lane: Open Instrument / ZËRO.

Selection date: 2026-06-20.

Selection base:

* Short SHA: `3acce3ba`
* Full SHA: `3acce3baa7e3cea8795409ca194e71db8102013f`

Closed milestone:

* Zheji Semantic Transparency Layer v0.1
* Close doc: `docs/open-instrument/zheji-semantic-transparency-layer-v0.1-milestone-close.md`

## Selection decision

The next Open Instrument lane is:

`docs(open-instrument): define Open Instrument passive artifact registry v0.1`

This is a docs-only registry lane.

It does not authorize runtime integration.

It does not authorize UI integration.

It does not authorize API output changes.

It does not authorize provider execution.

It does not authorize Zheji replay.

## Why this lane is selected

Zheji Semantic Transparency Layer v0.1 closed as a passive, reviewed, non-wired milestone.

The project now has multiple passive Open Instrument artifacts, validators, fixtures, and review docs.

Before any future runtime/API/UI/provenance work, the safe next step is to create a passive artifact registry that records:

* artifact path
* artifact type
* status
* owning lane
* validator command
* test command
* runtime wiring status
* provider execution status
* replay status
* package metadata status
* boundary notes
* next allowed action

This keeps passive artifacts discoverable without turning them into runtime behavior.

## Candidate lanes considered

### Candidate A — Passive Artifact Registry v0.1

Decision: SELECTED.

Reason:

* safe docs-only continuation
* improves governance across existing passive artifacts
* helps prevent orphaned schema/fixture/helper files
* does not require runtime/API/UI changes
* does not require provider execution
* creates a future review target before integration work

### Candidate B — Zheji runtime integration planning

Decision: DEFERRED.

Reason:

* runtime integration remains unauthorized
* Zheji passive artifacts are reference contracts only
* a registry should exist before any runtime boundary discussion

### Candidate C — Zheji UI/API exposure

Decision: REJECTED FOR NOW.

Reason:

* UI/API exposure would cross the current passive boundary
* no separate explicit lane has authorized it
* this would risk turning passive semantic transparency into product behavior too early

### Candidate D — Provider execution or replay lane

Decision: REJECTED.

Reason:

* provider execution remains unauthorized
* Zheji replay remains unauthorized
* this milestone intentionally avoided execution and replay

### Candidate E — Evidence pack or publication lane

Decision: REJECTED.

Reason:

* passive artifacts are not publication evidence
* no candidate-truth, origin, ownership, or model-quality evidence was created
* publication framing remains out of scope

## Selected lane scope

The selected lane may define a registry document only.

The selected lane may list existing passive artifacts.

The selected lane may describe registry fields.

The selected lane may define review requirements.

The selected lane may not create runtime wiring.

The selected lane may not modify source behavior.

The selected lane may not modify API output.

The selected lane may not modify UI output.

The selected lane may not execute providers.

The selected lane may not replay Zheji.

The selected lane may not create evidence packs.

## Expected registry target

The next lane should define:

`docs/open-instrument/open-instrument-passive-artifact-registry-v0.1.md`

The registry should include at minimum:

* Zheji Semantic Transparency passive artifacts
* provider execution preflight passive artifacts, if present
* run packet passive artifacts, if present
* static provider-result import quarantine artifacts, if present

If an artifact family is not present, the registry must mark it as missing instead of inventing it.

## Required validation for selected lane

The selected lane must run:

* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

If the lane references the Zheji artifacts, it must also run:

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

`docs(open-instrument): define Open Instrument passive artifact registry v0.1`
