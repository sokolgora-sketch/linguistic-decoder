# Open Instrument Run Packet Fixture Validation Design v0.1

## Status
Validation design only.

No validator implementation.
No tests added.
No source schema change.
No prompt change.
No runtime/API/UI wiring.
No fixture JSON change.
No model call.
No rerun.
No provider execution.
No provider default change.
No OpenAI API use.
No publication framing.

## Source fixture reviewed
This validation design is grounded in:

- PR #1287 / `e72d4ca7a8cc0bc6f066862558363187b60df0bc`
- PR #1288 / `5bd920a5fa92f4922d27820faaa6ecfd04459147`
- PR #1285 / `e6e763631b30cfc19b28f00dbb7660497021c53f`
- PR #1286 / `cd9ecc41cdcb3068c2b3aa9b719962486196ff71`
- PR #1281 / `216524f7`
- PR #1282 / `be9353d17f8962b307a777244ecdc3e47cd9792c`
- PR #1283 / `3220744a6cc94686c27197fcaf88af3dacb03fd0`
- PR #1284 / `82f975ce1ac68ea79dfc980252aedfb7793400fa`

Reviewed fixture path:

- `docs/open-instrument/fixtures/run-packets/open-instrument-run-packet-fixture-v0.1.json`

This validation design defines what a future validator should check for the static fixture.

The accepted operational loop remains:

Design → Preflight → Run Packet → Provider Execution → Capture → Verification → Archive and Report → Review and Closure

## Validation purpose
This design sets validation expectations for the static run packet fixture.

The future validator should:

- validate fixture shape
- validate explicitness
- validate non-runnable boundary
- validate false authorization fields
- validate boundary objects
- validate stop-condition coverage
- validate evidence-class posture
- validate no origin, candidate-truth, publication, or provider-execution claims

The future validator should not:

- validate model quality
- validate candidate truth
- validate origin truth
- run providers
- create artifacts

This PR does not implement the validator.

## Validation boundary
Validation is static file validation only.

Input:
- the fixture JSON file at `docs/open-instrument/fixtures/run-packets/open-instrument-run-packet-fixture-v0.1.json`

Output:
- a deterministic validation result in a future implementation

Validation must not:

- mutate the fixture
- call a provider
- inspect live environment provider defaults
- create artifact or report files
- infer authorization from fixture existence

## Required-file validation
Future validator should assert:

- the fixture file exists at `docs/open-instrument/fixtures/run-packets/open-instrument-run-packet-fixture-v0.1.json`
- the fixture parses as valid JSON
- the fixture is an object
- the fixture contains no executable command strings
- the fixture contains no provider credentials or secrets

## Required top-level field validation
Future validator should require these top-level fields:

- schemaVersion
- packetId
- runId
- createdAt
- createdBy
- status
- word
- normalizedWord
- targetObject
- segmentationId
- segmentationLabel
- chunks
- chunkVariants
- voicePath
- legalTransforms
- functionHints
- targetLanguages
- searchMode
- provider
- model
- providerProfile
- endpointType
- timeoutBudget
- promptContractPath
- expectedOutputSchema
- artifactPath
- reportPath
- reviewPath
- sourceDesignPath
- sourcePreflightPath
- claimBoundary
- publicationBoundary
- providerDefaultBoundary
- modelCallAuthorization
- artifactCreationAuthorization
- rerunAuthorization
- openAiApiAuthorization
- validatorExpectations
- stopConditions
- evidenceClassIntent
- notes

Missing top-level fields should fail validation.

## Exact fixture identity validation
Future validator should check exact values:

- schemaVersion equals `open-instrument.run-packet.v0.1`
- packetId equals `fixture.open-instrument.run-packet.v0.1`
- runId equals `fixture.open-instrument.run-packet.static.v0.1`
- status equals `design_fixture`
- word equals `study`
- normalizedWord equals `study`
- targetObject equals `word`
- segmentationId equals `fixture.segmentation.study.demo`
- segmentationLabel equals `STUDY_DEMO_SEGMENTATION`

These exact values are fixture identity, not live run identity.
Validation of `study` does not create origin evidence.
Validation of `study` does not create candidate-truth evidence.

## Provider non-execution validation
Future validator should check exact values:

- provider equals `fixture`
- model equals `none`
- providerProfile equals `static-fixture-no-provider`
- endpointType equals `none`
- timeoutBudget equals `not_applicable`

Future validator should reject:

- live provider names
- live model names
- OpenAI API endpoint labels
- Ollama endpoint labels
- missing provider
- missing model
- implicit provider default behavior

Provider validation proves explicit non-execution posture only.

## Authorization validation
Future validator should check exact booleans:

- modelCallAuthorization is false
- artifactCreationAuthorization is false
- rerunAuthorization is false
- openAiApiAuthorization is false

Future validator should fail if:

- any field is missing
- any field is not boolean
- any field is true
- any field is represented as the string `false`
- any field is nested somewhere else instead of top-level

False authorization is mandatory for this fixture.

## Boundary validation
Future validator should require:

- claimBoundary object exists
- publicationBoundary object exists
- providerDefaultBoundary object exists

Future validator should check claim boundary encodes:

- no origin claim
- no winner claim
- no candidate-truth claim
- no language-superiority claim
- no model-quality proof
- no publication framing

Future validator should check publication boundary encodes:

- publicationReady false
- publicClaimAllowed false
- static fixture only
- not run evidence

Future validator should check provider default boundary encodes:

- providerDefaultChanged false
- providerDefaultRequired false
- providerExecutionAllowed false
- openAiApiUseAllowed false

Boundary validation must be deterministic and must not rely on prose interpretation alone where exact booleans are present.

## Evidence-class validation
Future validator should check:

- evidenceClassIntent equals `design-only`

Future validator should reject:

- run-evidence labels
- publication labels
- origin-evidence labels
- candidate-truth labels
- model-quality-proof labels

Clean validation would prove fixture/validator alignment only.

Clean validation is not candidate-truth evidence.

Clean validation is not origin evidence.

## Stop-condition validation
Future validator should require stopConditions include identifiers covering:

- implicit provider
- implicit model
- missing prompt contract
- missing artifact path
- missing report path
- existing target artifact
- existing target report
- ambiguous OpenAI API use
- ambiguous provider default behavior
- absent claim boundary
- absent publication boundary
- missing validator expectations
- segmentationId drift
- chunk drift
- enum array drift
- forbidden claims
- hidden null candidates
- provider default claims

For v0.1 design, exact string matching is preferred for fixture validation if the fixture uses canonical strings.

If the future implementation uses normalized stop-condition IDs, that mapping must be designed in a separate PR.

## Path validation
Future validator should check:

- sourceDesignPath points to `docs/open-instrument/open-instrument-run-packet-fixture-design-v0.1.md`
- reviewPath points to `docs/open-instrument/open-instrument-run-packet-fixture-review-v0.1.md`
- sourcePreflightPath does not claim an execution preflight occurred
- artifactPath does not claim a provider-created artifact exists
- reportPath does not claim a provider-created report exists
- fixture paths do not collide with real model-run artifacts

If artifactPath or reportPath uses `not_applicable`, validation should accept it for the static fixture.

If the fixture uses placeholder paths, validation should require them to be clearly fixture-scoped.

## Segmentation validation
Future validator should check:

- chunks are present and use simple fixture/demo values
- chunkVariants are present and fixture-only
- voicePath is explicit
- legalTransforms is explicit and bounded
- functionHints is explicit
- these fields are not interpreted as origin evidence
- these fields are not interpreted as candidate-truth evidence

Validation should not reuse live Zheji segmentation outputs.

## Notes validation
Future validator should check notes include boundary statements covering:

- static fixture only
- no model call
- no rerun
- no provider execution
- no artifact creation
- no OpenAI API use
- not candidate-truth evidence
- not origin evidence
- future validation proves schema/traceability alignment only

Notes validation may use contains-style checks in v0.1 design, but exact canonical note IDs may be designed later.

## Negative validation cases
Design future negative cases:

- missing fixture file
- malformed JSON
- missing required field
- wrong schemaVersion
- live provider value
- live model value
- endpointType not none
- true modelCallAuthorization
- true artifactCreationAuthorization
- true rerunAuthorization
- true openAiApiAuthorization
- missing claimBoundary
- missing publicationBoundary
- missing providerDefaultBoundary
- publicationReady true
- providerExecutionAllowed true
- openAiApiUseAllowed true
- evidenceClassIntent not design-only
- stopConditions missing required coverage
- fixture contains origin claim
- fixture contains winner claim
- fixture contains candidate-truth claim
- fixture contains provider default mutation claim

Negative cases are design targets only. This PR does not add tests.

## Future implementation sequence
Recommended next implementation sequence after this design lands:

1. Review this validation design.
2. Add fixture validation helper.
3. Add validation tests for the static fixture.
4. Add a docs-only validation result note if needed.
5. Only later consider integrating validation into Open Instrument run-packet workflow.

Do not recommend model execution yet.

Do not recommend provider execution yet.

## Accepted next action
The next accepted action after this design lands is:

docs(open-instrument): review open instrument run packet fixture validation design

Do not recommend source implementation before that review lands.

## Claim boundary
This validation design is development-only schema/traceability design. It is not external origin/truth evidence, not candidate-truth evidence, not historical origin proof, not model-quality proof, not publication evidence, and not a reason to change provider defaults or authorize OpenAI API use.

## Final design decision
The Open Instrument run packet fixture validation design is ready for review. It defines deterministic static validation expectations for the first run packet fixture without authorizing model calls, provider execution, artifact creation, OpenAI API use, provider-default changes, publication framing, origin claims, or candidate-truth claims.
