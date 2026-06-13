# Open Instrument Provider Execution Preflight Checklist Design v0.1

## Status

Design only.

Docs only.

No provider execution.
No model call.
No OpenAI API use.
No runtime/API/UI wiring.
No provider default change.
No artifact/report creation.
No publication framing.
No checklist implementation in this PR.

## Purpose

This design defines the future checklist structure used before any provider execution can be considered.

The checklist is a preflight control.
The checklist is not a run packet.
The checklist is not provider execution.
The checklist is not evidence of model quality.
The checklist is not origin evidence.
The checklist is not publication evidence.

The checklist exists to force explicit review of the pre-execution state and to fail closed when any required control is missing or ambiguous.

## Relationship to accepted boundary design

This checklist design follows the accepted provider execution preflight boundary design:

- PR #1307
- `docs(open-instrument): design provider execution preflight boundary`
- merge SHA `25313ed4cb839633c79e99d691ff7c479288d92f`
- short SHA `25313ed4`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-boundary-design-v0.1.md`

It also follows the accepted review of that boundary:

- PR #1308
- `docs(open-instrument): review provider execution preflight boundary design`
- merge SHA `a711c77d11ac9a4f0d9d8f7d2d47adc2dc5582e0`
- short SHA `a711c77d`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-boundary-design-review-v0.1.md`

PR #1308 accepted the boundary design as a design target only.
PR #1308 did not authorize provider execution.

## Relationship to closed run packet fixture validation lane

This checklist design follows the closed run packet fixture validation lane:

- PR #1305
- `docs/open-instrument: close run packet fixture validation lane`
- merge SHA `5c6e3ac55d0b539bc55132c69e0414863201fc13`
- short SHA `5c6e3ac5`
- doc: `docs/open-instrument/open-instrument-run-packet-fixture-validation-lane-closure-v0.1.md`

The closed run packet fixture validation lane remains schema/traceability infrastructure only.

The checklist must require static validation to pass before provider execution can even be considered.

## Checklist object shape

This design defines a future checklist object shape in prose only.

The future checklist must be a structured, reviewable object with sections for:

- checklist identity
- source references
- repository state
- run packet status
- static validation status
- provider identity
- model identity
- endpoint identity
- authorization gates
- provider default snapshot status
- prompt/source review status
- capture path status
- failure policy status
- no-fallback policy status
- no-silent-rerun policy status
- runtime/API/UI exclusion status
- artifact/report authorization status
- evidence boundary status
- final decision

This design does not create real JSON.
This design does not create runnable JSON.

## Checklist identity fields

The future checklist must include these explicit identity fields:

- checklistSchemaVersion
- checklistId
- checklistCreatedAt
- reviewedRunPacketId
- reviewedRunPacketPath
- reviewedRunPacketCommit
- preflightBoundaryVersion
- preflightBoundaryReviewCommit
- operator
- repository
- baseCommit

All identity fields must be explicit and reviewable.

## Source references section

The future checklist must reference these sources:

- accepted run packet contract doc
- reviewed run packet
- static fixture validation closure doc
- provider execution preflight boundary design doc
- provider execution preflight boundary review doc
- future provider execution design doc, if present
- future capture policy doc, if present
- future artifact/report policy doc, if present

If a required source reference is missing, the checklist fails closed.

## Repository state section

The future checklist must capture these repository checks:

- current branch
- current commit
- clean working tree
- clean staged area
- no unexpected untracked files
- origin/main sync status
- divergence count
- open PR list
- unrelated non-dependency PR stop condition

Dirty repo or unexpected open non-dependency PR means stop.

## Run packet status section

The future checklist must capture these run packet checks:

- run packet exists
- run packet path is explicit
- run packet schema version is accepted
- packetId is stable
- runId is stable
- provider is explicit
- model is explicit
- endpointType is explicit
- authorization fields are present
- capture path is explicit or explicitly not authorized
- artifact/report path is explicit or explicitly not authorized

Any missing or ambiguous run packet field means stop.

## Static validation status section

The future checklist must capture these static validation checks:

- `npm run open-instrument:validate-run-packet-fixture` passes
- focused helper validation test passes
- focused integration gate test passes
- CI is green
- validation output remains schema/traceability only
- validation output is not provider execution evidence
- validation output is not candidate-truth evidence
- validation output is not origin evidence

Failed static validation means stop.

## Provider identity section

The future checklist must capture these provider fields:

- providerName
- providerType
- endpointClass
- networkRequired
- localOrRemote
- providerVersionSource
- providerDefaultSnapshotPath
- fallbackProviderAllowed

Rules:

- providerName must be explicit
- endpointClass must be explicit
- fallbackProviderAllowed must be false unless separately reviewed
- unknown provider means stop
- provider default snapshot must exist before execution authorization

## Model identity section

The future checklist must capture these model fields:

- modelName
- modelVersion
- modelSource
- modelConfigurationPath
- modelDefaultSnapshotPath
- modelSwitchAllowed

Rules:

- modelName must be explicit
- modelSwitchAllowed must be false unless separately reviewed
- unknown model means stop
- implicit model substitution means stop

## Endpoint identity section

The future checklist must capture these endpoint fields:

- endpointType
- endpointUrlClass
- authenticationRequired
- networkBoundary
- rateLimitBoundary
- dataRetentionBoundary
- privacyBoundary

Rules:

- endpointType must be explicit
- endpoint URL or class must be reviewed before execution
- authentication ambiguity means stop
- data-retention ambiguity means stop
- privacy ambiguity means stop

## Authorization gates section

The future checklist must define these gates:

- providerExecutionAuthorized
- modelCallAuthorized
- openAiApiAuthorized
- artifactCreationAuthorized
- reportCreationAuthorized
- rerunAuthorized
- fallbackProviderAuthorized
- promptMutationAuthorized
- sourceMutationAuthorized
- runtimeApiUiExecutionAuthorized

Default rule:

Every gate defaults to false.

Execution may proceed only when required gates are explicitly true and reviewed.

This design PR does not set any gate true.

## Provider default snapshot section

The future checklist must require these snapshot checks:

- provider defaults captured before execution
- model defaults captured before execution
- endpoint defaults captured before execution
- configuration diff is recorded
- no unreviewed provider default mutation
- no unreviewed model default mutation

Missing default snapshot means stop.

## Prompt/source review section

The future checklist must require these checks:

- prompt source path explicit
- source document path explicit
- source commit explicit
- prompt mutation authorization explicit
- source mutation authorization explicit
- no unreviewed prompt change
- no unreviewed source change

Unreviewed prompt/source mutation means stop.

## Capture path section

The future checklist must require these checks:

- output capture path explicit
- raw response capture path explicit, if response capture is authorized
- metadata capture path explicit
- request capture path explicit, if request capture is authorized
- sensitive data policy explicit
- retention policy explicit

Missing capture path or ambiguous sensitive data policy means stop.

## Failure policy section

The future checklist must require these checks:

- failure mode explicit
- no silent rerun
- no hidden fallback
- no automatic provider switch
- no automatic model switch
- no automatic OpenAI API fallback
- no mutation after failure without review

Failure must stop the lane unless an explicitly reviewed rerun policy exists.

## Runtime/API/UI exclusion section

The future checklist must require these checks:

- no public UI path can initiate provider execution
- analyze/propose/evals routes cannot implicitly initiate provider execution
- runtime/API/UI execution authorization is false unless separately reviewed
- no hidden server action provider call
- no hidden scheduled task provider call

Unexpected runtime/API/UI execution path means stop.

## Artifact/report authorization section

The future checklist must require these checks:

- artifact creation authorization explicit
- report creation authorization explicit
- artifact path explicit if authorized
- report path explicit if authorized
- publication framing false unless separately reviewed
- evidence class explicit

Unreviewed artifact/report path means stop.

## Evidence boundary section

The checklist output is:

- not candidate-truth evidence
- not origin evidence
- not model-quality evidence
- not publication evidence
- preflight control evidence only
- not proof that provider output is correct
- not proof that execution is safe by itself

## Final decision section

The future checklist must be able to end in one of these states:

- not_ready
- blocked
- ready_for_review
- ready_for_explicit_execution_authorization

Rules:

- The checklist itself cannot execute.
- `ready_for_explicit_execution_authorization` does not mean execution is authorized.
- Execution requires a later reviewed execution PR or an explicitly reviewed execution run packet.

## Stop conditions

The future checklist must fail closed on these stop conditions:

- missing checklist identity
- missing source reference
- dirty repo
- unexpected open non-dependency PR
- missing run packet
- invalid run packet
- failing static validation
- ambiguous provider
- ambiguous model
- ambiguous endpoint
- missing provider default snapshot
- missing model default snapshot
- missing prompt/source review
- missing capture path
- missing failure policy
- fallback ambiguity
- silent rerun ambiguity
- OpenAI API ambiguity
- runtime/API/UI path ambiguity
- artifact/report ambiguity
- publication framing ambiguity
- unreviewed mutation
- CI failure

## Future implementation target

The next accepted action after this design lands is:

`docs/open-instrument: review provider execution preflight checklist design`

The future review should verify:

- checklist design is non-executing;
- checklist design preserves all boundary gates;
- checklist design requires static validation;
- checklist design fails closed;
- checklist design does not authorize provider execution;
- checklist design does not create runnable JSON.
