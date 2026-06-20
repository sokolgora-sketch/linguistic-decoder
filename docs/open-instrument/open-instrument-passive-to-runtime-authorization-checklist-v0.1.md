# Open Instrument Passive-to-Runtime Authorization Checklist v0.1

Status: CHECKLIST_DEFINED.

Project lane: Open Instrument / ZËRO.

Definition date: 2026-06-20.

Definition base:

* Short SHA: `7b8fabe0`
* Full SHA: `7b8fabe08541a3640d18f08f9c778bd756ddc358`

Preceding lane selection:

* `docs/open-instrument/next-lane-selection-after-passive-artifact-registry-v0.1.md`

Prerequisite registry chain:

* Registry definition: `docs/open-instrument/open-instrument-passive-artifact-registry-v0.1.md`
* Registry review: `docs/open-instrument/reviews/open-instrument-passive-artifact-registry-review-v0.1.md`
* Registry close: `docs/open-instrument/open-instrument-passive-artifact-registry-v0.1-lane-close.md`

## Checklist purpose

This checklist defines what must be true before any passive Open Instrument artifact may be considered for runtime, API, UI, provenance, provider-facing, or replay-facing work.

This checklist does not authorize runtime work.

This checklist does not authorize API output changes.

This checklist does not authorize UI changes.

This checklist does not authorize provider execution.

This checklist does not authorize Zheji replay.

This checklist is a governance document only.

## Core rule

Passive artifacts stay passive until a separate explicit lane authorizes promotion.

A passive artifact may not be treated as runtime behavior just because it exists, validates, is reviewed, or is registered.

A future lane must explicitly state what boundary is being crossed and must pass this checklist before any code or product behavior changes are allowed.

## Required checklist fields

Every future passive-to-runtime authorization request must include:

| Field | Required value before authorization |
| --- | --- |
| artifact family | exact artifact family name |
| registry status | registered or explicitly exempted with reason |
| review status | reviewed and accepted |
| close status | closed or explicitly exempted with reason |
| runtime wiring authorization | explicitly requested and scoped |
| API output authorization | explicitly requested and scoped, or not requested |
| UI output authorization | explicitly requested and scoped, or not requested |
| provider execution authorization | explicitly requested and scoped, or not requested |
| replay authorization | explicitly requested and scoped, or not requested |
| package metadata authorization | explicitly requested and scoped, or not requested |
| CI authorization | explicitly requested and scoped, or not requested |
| evidence promotion authorization | explicitly requested and scoped, or not requested |
| publication authorization | explicitly requested and scoped, or not requested |
| validation commands | exact commands to run |
| exact changed-file proof | required before merge |
| rollback plan | required for runtime/API/UI/provider-facing changes |
| rejection criteria | explicit reasons to stop |
| next allowed action | one exact next task |

## Minimum authorization packet

A future authorization lane must include a packet with:

* artifact family
* source artifact paths
* target runtime/API/UI/provider/provenance paths
* exact boundary being crossed
* reason the boundary must be crossed now
* validator command
* focused test command
* full gate command
* exact file list
* rollback plan
* evidence that package metadata is unchanged, unless package metadata change is explicitly authorized
* evidence that CI is unchanged, unless CI change is explicitly authorized

## Automatic rejection criteria

A passive-to-runtime authorization request must be rejected if any of the following are true:

* artifact is not registered and no exemption is documented
* artifact has not been reviewed and accepted
* artifact lane has not been closed, unless explicitly exempted
* requested boundary is vague
* target files are not named
* runtime/API/UI/provider/provenance paths are mixed without scope separation
* provider execution is implied instead of explicitly requested
* replay is implied instead of explicitly requested
* package metadata changes appear without explicit authorization
* CI changes appear without explicit authorization
* evidence promotion is implied
* publication framing is implied
* origin, ownership, candidate-truth, or model-quality claims are introduced without a separate evidence lane
* exact changed-file proof is missing
* rollback plan is missing for behavior-changing work

## Boundary-specific requirements

### Runtime wiring

Runtime wiring requires:

* exact runtime files
* exact passive source artifacts
* adapter or transformation boundary
* deterministic behavior statement
* failure/null behavior
* focused tests
* full gate

Runtime wiring remains unauthorized by this checklist.

### API output changes

API output changes require:

* exact endpoint or response object
* schema contract
* compatibility statement
* null behavior
* client impact note
* focused tests
* full gate

API output changes remain unauthorized by this checklist.

### UI output changes

UI output changes require:

* exact UI components
* rendering contract
* empty/null state
* no raw object rendering proof
* focused UI tests where applicable
* full gate

UI output changes remain unauthorized by this checklist.

### Provider execution

Provider execution requires:

* provider identity
* execution boundary
* secrets policy
* network policy
* cost policy
* replay policy
* storage policy
* failure policy
* explicit approval

Provider execution remains unauthorized by this checklist.

### Replay

Replay requires:

* replay target
* replay input
* replay output storage path
* reproducibility posture
* no publication/evidence promotion unless separately authorized

Zheji replay remains unauthorized by this checklist.

### Package metadata or CI changes

Package metadata or CI changes require:

* exact file list
* reason
* dependency or CI impact
* lockfile impact
* rollback plan
* full gate

Package metadata and CI changes remain unauthorized by this checklist.

## Zheji-specific application

Zheji Semantic Transparency Layer v0.1 is:

* passive
* reviewed
* registered
* closed
* not wired
* not replayed
* not provider-executed
* not publication evidence

Required validation before any future Zheji-related authorization lane:

* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

Any future Zheji runtime/API/UI/provider/provenance work must cite the registry and this checklist.

## Allowed current lane behavior

This checklist lane may only:

* define checklist fields
* define rejection criteria
* define boundary-specific requirements
* reference registry artifacts
* reference Zheji validation commands
* record hard boundaries

This checklist lane may not:

* modify runtime code
* modify API code
* modify UI code
* modify source behavior
* modify package metadata
* modify CI
* execute providers
* replay Zheji
* create evidence packs
* create publication artifacts
* promote candidate truth
* assert origin evidence
* assert ownership evidence

## Required validation for checklist review

A review of this checklist must run:

* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

## Hard boundaries

Hard boundaries preserved:

* No provider execution.
* No Zheji replay.
* No runtime/API/UI behavior changes.
* No package metadata changes.
* No CI changes.
* No evidence promotion.
* No publication framing.
* No VoiceLab work.

## Current next task

`docs(open-instrument): review Open Instrument passive-to-runtime authorization checklist v0.1`
