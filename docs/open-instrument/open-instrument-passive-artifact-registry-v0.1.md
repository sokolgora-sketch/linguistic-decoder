# Open Instrument Passive Artifact Registry v0.1

Status: REGISTRY_DEFINED.

Project lane: Open Instrument / ZËRO.

Definition date: 2026-06-20.

Definition base:

* Short SHA: `7e065c74`
* Full SHA: `7e065c743300d78d8d37eb0f12672850714911e7`

Preceding selection:

* `docs/open-instrument/next-lane-selection-after-zheji-semantic-transparency-v0.1.md`

## Registry purpose

This registry records passive Open Instrument artifacts without turning them into runtime behavior.

The registry exists to make passive artifacts discoverable, auditable, and reviewable.

The registry is not runtime wiring.

The registry is not UI wiring.

The registry is not API output wiring.

The registry is not provider execution.

The registry is not Zheji replay.

## Registry fields

Each registered artifact family must record:

| Field | Required meaning |
| --- | --- |
| artifact family | human-readable artifact group |
| owning lane | lane or milestone that produced the artifact |
| artifact path | exact repository path |
| artifact type | design, review, schema, fixture, helper, test, close record, or selection record |
| status | present, missing, deferred, or not applicable |
| validator command | command that validates the artifact, or not applicable |
| test command | command that tests the artifact, or not applicable |
| runtime wiring status | must be non-wired unless a future lane explicitly authorizes wiring |
| provider execution status | must be not executed |
| replay status | must be not replayed |
| package metadata status | changed or unchanged |
| boundary notes | explicit notes about what remains unauthorized |
| next allowed action | review, close, define next lane, or separate authorization required |

## Registry invariants

The registry must preserve these invariants:

* Passive artifacts remain passive.
* Missing artifacts must be marked missing.
* The registry must not invent files.
* The registry must not claim runtime behavior.
* The registry must not claim provider execution.
* The registry must not claim Zheji replay.
* The registry must not promote candidate truth.
* The registry must not create origin evidence.
* The registry must not create ownership evidence.
* The registry must not create publication evidence.
* The registry must not create evidence packs.

## Registered family: Zheji Semantic Transparency Layer v0.1

Family status: present and milestone closed.

Owning lane:

* Zheji Semantic Transparency Layer v0.1

Runtime wiring status:

* not wired

Provider execution status:

* not executed

Replay status:

* not replayed

Package metadata status:

* unchanged

Validator command:

* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`

Test command:

* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`

Artifact table:

| Artifact path | Status | Type |
| --- | --- | --- |
| `docs/open-instrument/zheji-semantic-transparency-layer-v0.1.md` | present | design |
| `docs/open-instrument/zheji-semantic-transparency-layer-v0.1-milestone-close.md` | present | milestone close |
| `docs/open-instrument/schemas/zheji-semantic-transparency/zheji-semantic-transparency-schema-v0.1.json` | present | passive schema |
| `docs/open-instrument/fixtures/zheji-semantic-transparency/zheji-semantic-transparency-static-fixture-v0.1.json` | present | passive fixture |
| `scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs` | present | passive validator helper |
| `tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts` | present | Jest test |
| `docs/open-instrument/reviews/zheji-semantic-transparency-passive-artifacts-review-v0.1.md` | present | passive artifacts review |

Review status:

* design reviewed
* passive scope reviewed
* passive artifacts reviewed
* milestone closed

Boundary notes:

* no provider execution
* no Zheji replay
* no runtime/API/UI behavior changes
* no package metadata changes
* no evidence promotion
* no publication framing
* no VoiceLab work

Next allowed action:

* separate explicit lane required for any runtime/API/UI/provider/provenance work

## Registered family: Open Instrument run packet fixture artifacts

Family status: discovered by exact path if present.

Runtime wiring status:

* not authorized by this registry

Provider execution status:

* not executed by this registry

Replay status:

* not replayed by this registry

Package metadata status:

* unchanged by this registry

Artifact table:

| Artifact path | Status | Type |
| --- | --- | --- |
| `scripts/openInstrumentRunPacketFixtureValidation.v0.1.mjs` | present | validation helper |

Validator command:

* If present: `node scripts/openInstrumentRunPacketFixtureValidation.v0.1.mjs`
* If missing: not applicable

Next allowed action:

* review existing lane docs before adding or modifying any run packet artifact

## Registered family: Provider execution preflight passive artifacts

Family status: discovered by exact path if present.

Runtime wiring status:

* not authorized by this registry

Provider execution status:

* not executed by this registry

Replay status:

* not replayed by this registry

Package metadata status:

* unchanged by this registry

Artifact table:

| Artifact path | Status | Type |
| --- | --- | --- |
| `scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs` | present | static fixture schema validation helper |
| `scripts/openInstrumentProviderExecutionPreflightMappingCoverageAudit.v0.1.mjs` | present | mapping coverage audit helper |

Validator commands:

* If present: `node scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs`
* If present: `node scripts/openInstrumentProviderExecutionPreflightMappingCoverageAudit.v0.1.mjs`

Next allowed action:

* review existing lane docs before modifying any preflight artifact

## Registered family: Static provider-result import quarantine artifacts

Family status: present only if discovered by exact repository paths.

Discovery query:

```bash
find docs/open-instrument scripts tests -type f | sort | rg "provider-result|quarantine|static-provider"
```

Runtime wiring status:

* not authorized by this registry

Provider execution status:

* not executed by this registry

Replay status:

* not replayed by this registry

Package metadata status:

* unchanged by this registry

Registry rule:

* This registry may list discovered quarantine artifacts in a future registry update.
* This registry must not invent missing quarantine paths.

Next allowed action:

* separate registry update or review lane if exact quarantine artifact paths need to be normalized

## Required validation for registry review

A review of this registry must run:

* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

Because this registry references Zheji artifacts, review must also run:

* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`

If a future registry update references provider preflight helpers, the review should run those helpers if present.

If a future registry update references run packet helpers, the review should run those helpers if present.

## Forbidden behavior

This registry does not authorize:

* provider execution
* OpenAI execution
* remote endpoint execution
* localhost execution
* Ollama execution
* Zheji replay
* runtime wiring
* API output wiring
* UI wiring
* source behavior changes
* package metadata changes
* CI changes
* evidence promotion
* publication framing
* candidate-truth evidence
* origin evidence
* ownership evidence
* model-quality evidence
* VoiceLab work

## Current next task

`docs(open-instrument): review Open Instrument passive artifact registry v0.1`
