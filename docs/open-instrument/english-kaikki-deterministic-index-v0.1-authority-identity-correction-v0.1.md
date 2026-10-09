# Open Instrument English Kaikki deterministic index v0.1 authority and completeness repair

Status: `TARGETED_6597_POSTING_COMPLETENESS_REPAIR_PASS`

Correction ID: `OPEN_INSTRUMENT_ENGLISH_KAIKKI_DETERMINISTIC_INDEX_V0_1_AUTHORITY_IDENTITY_AND_TARGETED_COMPLETENESS_REPAIR_V0_1`

## Historical boundary

PR #2133 remains the historical third controlled full-corpus build. Its
execution record reported 1,492,836 processed records, but the published
postings file physically contained 1,486,239 postings. The prior PR #2134
correction path incorrectly attempted to relabel that incomplete file by
rewriting metadata counters. That path was removed.

Forensic reconciliation proved that exactly 6,597 admitted physical source
records were absent. The root cause was the pre-hardening bucket writer close
lifecycle: buffered-only buckets below the 1 MiB opening threshold were not
flushed. The repair below is targeted recovery, not a fourth authoritative
build and not a full-corpus rebuild.

## Authority clarification

The frozen identity field `indexContractSha256` binds the machine-readable
deterministic-index contract JSON:

```text
INDEX_CONTRACT_SHA256_SEMANTIC_ROLE=MACHINE_READABLE_CONTRACT_JSON
INDEX_CONTRACT_SHA256=0606a159918d672c03e1deafc0e547c0099e92a63e1b48363bf4348310e757b8
HUMAN_DEFINITION_MARKDOWN_SHA256=c108f82172dcf87c786e2e9baebccc3ffaf6d3430c0b55b30018d626abe153cf
```

The clarification is additive. The frozen contract, historical execution
result, and historical artifact identity remain historical records.

## Targeted repair proof

```text
ROOT_CAUSE=BUCKET_FLUSH_DEFECT
AFFECTED_BUFFERED_ONLY_BUCKETS=47
INCOMPLETE_POSTINGS=1486239
RECOVERED_POSTINGS=6597
FINAL_POSTINGS=1492836
MISSING_ORDINALS_SHA256=5c8c1c5e1624068888f3e7bb5c7988264ff3cb03d36a40427639f0178176f30b
SOURCE_RECORDS_RECOVERED=6597
ADAPTER_ADMITTED=6597
ADAPTER_REJECTED=0
FULL_CORPUS_BUILD_EXECUTED=NO
ATTEMPT_4_EXECUTED=NO
SOURCE_REACQUIRED=NO
```

The repair scans the verified frozen source only to recover the proven missing
physical ordinals, merges the 1,486,239 existing canonical postings with the
6,597 recovered postings, regenerates directory ranges from the merged stream,
and publishes a fully verified sibling candidate atomically. It does not
deduplicate collisions, rank entries, select winners, or change lookup
semantics.

## Repaired external artifact

```text
SOURCE_SHA256=9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195
DIRECTORY_BYTES=133992318
DIRECTORY_SHA256=286f114d630d4dca83d6df4c79baf511dcdd145c11b13a446e42701782660fd2
POSTINGS_BYTES=750627474
POSTINGS_SHA256=daa79101fe08115ac4bd7d58f26dd9e2786f9de6c9ea54f2d764ef180b837ff1
MANIFEST_BYTES=1894
MANIFEST_SHA256=be15e21c895091b333d1a66f6e3556152aee2cf384585944dbd8c9d8776d58a5
ARTIFACT_IDENTITY=0bc436e346a903193a326534f4bfd643e7bc0721cffecd74df8912f706777ae9
DIRECTORY_ENTRY_COUNT=1355933
```

The old incomplete artifact remains recoverable in the external root as a
retained sibling backup. Neither the source nor generated index files are
imported into Git.

## Physical completeness invariant

```text
COUNT_A_PHYSICAL_LF=1492836
COUNT_B_STREAMING_NDJSON=1492836
COUNT_C_DIRECTORY_POSTING_SUM=1492836
UNIQUE_RECORD_ORDINALS=1492836
DUPLICATE_RECORD_ORDINALS=0
MISSING_RECORD_ORDINALS=0
MIN_RECORD_ORDINAL=1
MAX_RECORD_ORDINAL=1492836
DIRECTORY_RANGES_CONTIGUOUS=YES
DIRECTORY_FINAL_RANGE_EQUALS_POSTINGS_EOF=YES
POSTINGS_CANONICAL_ORDER=YES
POSTINGS_FINAL_LF=YES
```

The physical verifier rejects a file with fewer postings even when all local
counters agree. Focused regression coverage also proves the generic
buffered-only bucket close invariant.

## Preserved boundaries and next action

```text
SOURCE_IMPORTED_TO_GIT=NO
INDEX_IMPORTED_TO_GIT=NO
DISCOVERY_CHANGED=NO
RUNTIME_CHANGED=NO
API_CHANGED=NO
UI_CHANGED=NO
COVERAGE_EVALUATED=NO
S4=NOT_STARTED
NEXT_ACTION=SECURITY_REMEDIATION_INSPECT_CRITICAL_NEXTJS_RCE_ALERTS_288_289_AND_PR_2123
```

This next action is recorded only and is not executed by the targeted repair
lane.
