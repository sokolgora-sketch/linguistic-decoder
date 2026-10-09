# Open Instrument English Kaikki deterministic index v0.1 authority and identity correction

Status: `POST_2133_FROZEN_AUTHORITY_IDENTITY_CORRECTION_APPLIED`

Correction ID: `OPEN_INSTRUMENT_ENGLISH_KAIKKI_DETERMINISTIC_INDEX_V0_1_AUTHORITY_IDENTITY_CORRECTION_V0_1`

## Purpose and provenance

This is an additive post-merge correction to PR #2133. The original frozen
contract, hash manifest, execution result, and execution-result hash manifest
remain immutable historical records. This correction does not rewrite them.

Parent contract:
`docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/contract.json`

Parent contract SHA-256:
`0606a159918d672c03e1deafc0e547c0099e92a63e1b48363bf4348310e757b8`

PR #2133 merge SHA:
`54764d00e8d41e67442dda90db8741a9ba555c9c`

## Frozen-authority ambiguity discovered after #2133

The frozen identity payload names `indexContractSha256`, but the v0.1 frozen
authority did not state whether that field binds the machine-readable
`contract.json` or the explanatory Markdown definition. PR #2133 implemented
the human-definition SHA in the identity binding. The repository hash manifest
already kept the two artifact roles distinct, but the implementation constant
did not.

The historical PR #2133 result and its external artifact identity remain
historical facts. They are not rewritten as though the old authority had
always specified the corrected role.

## DF authority decision

`indexContractSha256` is the machine identity binding and therefore binds the
machine-readable deterministic-index `contract.json`:

```text
INDEX_CONTRACT_SHA256_SEMANTIC_ROLE=MACHINE_READABLE_CONTRACT_JSON
INDEX_CONTRACT_SHA256=0606a159918d672c03e1deafc0e547c0099e92a63e1b48363bf4348310e757b8
```

The explanatory Markdown definition remains separately identified as:

```text
HUMAN_DEFINITION_MARKDOWN_SHA256=c108f82172dcf87c786e2e9baebccc3ffaf6d3430c0b55b30018d626abe153cf
```

The implementation now uses explicitly named machine-contract and
human-definition constants. The builder validates both hashes against their
respective files, and identity payload construction uses only the explicitly
named machine-contract hash. Future builders must not infer the role from a
generic variable name.

## External identity correction

The verified `directory.ndjson` and `postings.ndjson` files were not rebuilt,
rewritten, or reparsed from the source. Their bytes and hashes are unchanged.
Only the external `manifest.json` metadata was atomically replaced so its
artifact identity reflects the corrected machine-contract binding and its
record counters reflect the already-published directory/postings bytes. The
pre-correction counters were stale; this metadata correction does not alter
the protected files.

```text
DIRECTORY_SHA256=2455eaf2ef9cb625d0744986e6ea65103796cd0465ef1e8d52cadd22427cfd5a
POSTINGS_SHA256=1c9e35493e1e76d9189cef3a9bffb091194f541c4be4414f9c07971aff2f680a
ARTIFACT_IDENTITY_BEFORE=e963008034b37a2dbe379cc16c2b037674544f17f0062934ece067425e1f9543
ARTIFACT_IDENTITY_AFTER=861284c56f00d1297b84229e772a791f765f00e059679c6849db0d4924e7ec39
MANIFEST_COUNTS_BEFORE=recordsProcessed:1492836,postingsWritten:1492836,distinctLookupKeys:1349964
MANIFEST_COUNTS_AFTER=recordsProcessed:1486239,postingsWritten:1486239,distinctLookupKeys:1349964
IDENTITY_CHANGED=YES
```

The source remains externally stored and hash-bound. No source reacquisition,
source reparse, full-corpus build, directory rebuild, postings rebuild, or
fourth authoritative attempt was authorized or performed.

## Execution-evidence reconciliation

Project-controlled historical accounting is:

```text
ATTEMPT_1=FAIL / ERR_USE_AFTER_CLOSE / EXTERNAL_RUN_MERGE
ATTEMPT_2=FAIL / ERR_USE_AFTER_CLOSE / EXTERNAL_RUN_MERGE
ATTEMPT_3=PASS
ATTEMPT_4=NOT_EXECUTED
```

The committed execution artifact independently preserves only one explicit
prior failure plus the successful replacement-build record. It does not by
itself independently preserve both prior failures. This correction records
that limitation instead of fabricating missing durable execution logs.

The authorization-chain interpretation is:

```text
AUTHORIZATION_LOGIC_INTEGRITY=PASS_WITH_POST_BUILD_TEST_TIMEOUT_CHANGE
REVIEWED_TEST_SHA=036666526744117ae12dc34494c7d67827f2982d4ee1378467362bfe4896a5ba
FINAL_MAIN_TEST_SHA_BEFORE_CORRECTION=7cf2a586f3a6a9c2a54c7ad92a5813ffec5cee120c08a4d9073bfeb9662b42e4
TEST_FILE_DIFFERENCE_CLASS=POST_BUILD_TEST_HARNESS_TIMEOUT_ONLY
```

The reviewed test bytes were not identical to the final-main test bytes; the
known difference is limited to the post-build stress-test timeout.

## Preserved boundaries

```text
SOURCE_IMPORTED_TO_GIT=NO
DIRECTORY_IMPORTED_TO_GIT=NO
POSTINGS_IMPORTED_TO_GIT=NO
DISCOVERY_CHANGED=NO
RUNTIME_CHANGED=NO
API_CHANGED=NO
UI_CHANGED=NO
COVERAGE_CHANGED=NO
S4_CHANGED=NO
```

The correction is metadata/authority binding only. It does not authorize
Discovery integration or any runtime, API, UI, coverage, provider, semantic,
pronunciation, or production lane.

## Next action

```text
DEFINE_AND_FREEZE_ENGLISH_KAIKKI_INDEX_DISCOVERY_INTEGRATION_V0_1
```

This next action is recorded only; it is not executed by this correction lane.
